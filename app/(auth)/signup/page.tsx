"use client";

import { useSession } from "next-auth/react";

import Link from "next/link";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { redirect, useRouter } from "next/navigation";
import Loader from "@/app/components/Loader/Loader";
import toast from "react-hot-toast";

export default function SignUpPage() {
  const { status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      image: "",
      gender: "",
      role: "user",
    },
  });

  const [imageBase64, setImageBase64] = useState<string>("");

  const handleSignUp: SubmitHandler<FieldValues> = async (data) => {
    try {
      setIsLoading(true);
      setApiError("");
      
      if (!imageBase64) {
        setApiError("Please select a profile image");
        toast.error("Please select a profile image");
        setIsLoading(false);
        return;
      }
      
      data.image = imageBase64;
      
      if (!data.role) {
        data.role = "user";
      }

      console.log("Submitting registration:", { ...data, image: 'Base64 image [truncated]' });
      
      const res = await axios.post("/api/auth/register", data);

      if (res.status === 200) {
        toast.success("Registration successful! Redirecting to login...");
        setTimeout(() => {
          router.push("/signin");
        }, 1500);
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      const errorMessage = error.response?.data?.error || "Registration failed. Please try again.";
      setApiError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];

    if (file) {
      // Validate file size (max 1MB)
      if (file.size > 1 * 1024 * 1024) {
        toast.error("Image too large. Maximum size is 1MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        // Compress the image before storing it
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 400; // Maximum width for the image
          const MAX_HEIGHT = 400; // Maximum height for the image
          let width = img.width;
          let height = img.height;
          
          // Calculate new dimensions while maintaining aspect ratio
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Convert to compressed JPEG format with quality 0.7 (70%)
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          setImageBase64(compressedDataUrl);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  if (status === "loading") {
    return <Loader />;
  }

  if (status === "authenticated") {
    return redirect("/");
  }

  return (
    <div className="w-full lg:max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow-xl dark:bg-gray-800">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Gym Management System
      </h2>
      
      {apiError && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800">
          {apiError}
        </div>
      )}
      
      <form className="mt-8 space-y-6" onSubmit={handleSubmit(handleSignUp)}>
        <div>
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your name
          </label>
          <input
            type="text"
            id="name"
            {...register("name", {
              required: "This field is required",
            })}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="John Doe"
            required
          />
          {errors && errors.name && typeof errors.name.message === "string" && (
            <p className="text-red-500 text-xs italic">
              {errors?.name?.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your email
          </label>
          <input
            type="email"
            id="email"
            {...register("email", {
              required: "This field is required",
            })}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="name@company.com"
            required
          />
          {errors &&
            errors.email &&
            typeof errors.email.message === "string" && (
              <p className="text-red-500 text-xs italic">
                {errors?.email?.message}
              </p>
            )}
        </div>
        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your password
          </label>
          <input
            type="password"
            id="password"
            {...register("password", {
              required: "This field is required",
              minLength: {
                value: 8,
                message: "Password must have at least 8 characters",
              },
              maxLength: {
                value: 20,
                message: "Password must have at most 20 characters",
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/,
                message:
                  "Password must contain at least one uppercase letter, one lowercase letter and one number",
              },
            })}
            placeholder="••••••••"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
          {errors &&
            errors.password &&
            typeof errors.password.message === "string" && (
              <p className="text-red-500 text-xs italic">
                {errors?.password?.message}
              </p>
            )}
        </div>

        <div className="flex items-center justify-start gap-5">
          <div className="flex items-center">
            <input
              id="default-radio-1"
              type="radio"
              value={"male"}
              {...register("gender", { required: true })}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="default-radio-1"
              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Male
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="default-radio-2"
              type="radio"
              value={"female"}
              {...register("gender", { required: true })}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />

            <label
              htmlFor="default-radio-2"
              className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Female
            </label>
          </div>
          {errors &&
            errors.gender &&
            typeof errors.gender.message === "string" && (
              <p className="text-red-500 text-xs italic">
                {errors?.gender?.message}
              </p>
            )}
        </div>

        <div className="flex justify-center items-start flex-col">
          <label
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            htmlFor="file_input"
          >
            Upload your profile picture
          </label>
          <input
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            id="file_input"
            type="file"
            {...register("image", { required: true })}
            onChange={handleImageChange}
          />
          {errors &&
            errors.image &&
            typeof errors.image.message === "string" && (
              <p className="text-red-500 text-xs italic">
                {errors?.image?.message}
              </p>
            )}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-5 py-3 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50"
        >
          {isLoading ? "Processing..." : "Sign up"}
        </button>
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          Already have an account?{" "}
          <Link
            href={"/signin"}
            className="text-blue-600 hover:underline dark:text-blue-500"
          >
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
}
