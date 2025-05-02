import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/app/libs/prismadb";
import { PrismaClientInitializationError } from "@prisma/client/runtime/library";

// Function to validate image size
function validateImage(imageBase64: string): boolean {
  // Check if image is too large (>500KB)
  const approximateSizeInKB = Math.round(imageBase64.length * 0.75 / 1024);
  return approximateSizeInKB <= 500;
}

export async function POST(req: Request) {
  try {
    console.log("Registration API route called");
    
    // Parse request body without logging the full image
    const body = await req.json();
    const imageSize = body.image ? Math.round(body.image.length * 0.75 / 1024) : 0;
    console.log("Request body received with image size:", imageSize + "KB");

    const { name, email, image, password, role, gender } = body;
    
    // Validate required fields
    if (!email || !name || !password || !gender) {
      console.log("Missing required fields:", { email: !!email, name: !!name, password: !!password, gender: !!gender });
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    if (!image) {
      console.log("Missing profile image");
      return NextResponse.json({ error: "Profile image is required" }, { status: 400 });
    }
    
    // Check if image is too large
    if (!validateImage(image)) {
      console.log("Image too large");
      return NextResponse.json({ error: "Image is too large. Maximum size is 500KB" }, { status: 400 });
    }
    
    // Check if user already exists - more direct approach without transactions
    console.log("Checking if email exists:", email);
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });
      
      if (existingUser) {
        console.log("Email already registered");
        return NextResponse.json({ error: "Email already registered" }, { status: 409 });
      }
    } catch (findError) {
      console.error("Error checking existing user:", findError);
      // Continue with registration attempt
    }
    
    // Use role from request or default to "user"
    const userRole = role || "user";
    console.log("Using role:", userRole);

    // Hash password
    console.log("Hashing password");
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user in database - catch any MongoDB replica set issues
    console.log("Creating user in database");
    try {
      const user = await prisma.user.create({
        data: {
          email,
          name,
          image,
          role: userRole,
          hashedPassword,
          gender,
        },
      });

      console.log("User created successfully:", user.id);

      // Don't return the hashed password
      const { hashedPassword: _, ...safeUser } = user;
      
      // Don't return the full image in the response to save bandwidth
      return NextResponse.json({
        ...safeUser,
        image: safeUser.image ? 'Image saved successfully' : null
      });
      
    } catch (createError: any) {
      console.error("Error creating user:", createError);
      
      if (createError.message?.includes('replica set')) {
        return NextResponse.json({ 
          error: "MongoDB configuration error: Your MongoDB instance requires a replica set configuration.",
          message: "Please use MongoDB Atlas instead of a local MongoDB instance for this application."
        }, { status: 500 });
      }
      
      throw createError; // Re-throw for general handling
    }
    
  } catch (error: any) {
    console.error("Registration error details:", error);
    
    // Handle specific MongoDB error for replica set
    if (error instanceof PrismaClientInitializationError || 
        error.message?.includes('replica set') || 
        error.message?.includes('transaction')) {
      return NextResponse.json({ 
        error: "Database configuration error",
        message: "The application requires MongoDB Atlas. Please update your DATABASE_URL in .env.local"
      }, { status: 500 });
    }
    
    // Handle Prisma-specific errors
    if (error.code) {
      console.error(`Prisma error code: ${error.code}`);
      
      if (error.code === 'P2002') {
        return NextResponse.json({ error: "This email is already registered" }, { status: 409 });
      }
      
      if (error.code === 'P2000') {
        return NextResponse.json({ error: "Input value is too long" }, { status: 400 });
      }
    }
    
    return NextResponse.json({ 
      error: "Registration failed",
      message: error.message || "Failed to register user",
      details: process.env.NODE_ENV !== 'production' ? error.toString() : undefined
    }, { status: 500 });
  }
}
