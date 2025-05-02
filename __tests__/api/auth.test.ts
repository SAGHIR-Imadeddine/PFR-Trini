import { NextRequest } from 'next/server';
import { POST as registerHandler } from '@/app/api/auth/register/route';
import bcrypt from 'bcrypt';

// Mock prisma client
jest.mock('@/app/libs/prismadb', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

// Mock bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn(() => Promise.resolve('hashedPassword')),
}));

describe('Authentication API Routes', () => {
  let prismadb: any;
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Import the mocked prismadb
    prismadb = require('@/app/libs/prismadb').default;
  });
  
  describe('POST /api/auth/register', () => {
    it('returns 400 when required fields are missing', async () => {
      // Create a request with missing fields
      const request = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test User',
          // Missing email
          password: 'password123',
          gender: 'male',
        }),
      });
      
      const response = await registerHandler(request);
      expect(response.status).toBe(400);
      
      const responseData = await response.json();
      expect(responseData.error).toBe('Missing required fields');
    });
    
    it('returns 409 when email is already registered', async () => {
      // Mock finding an existing user
      prismadb.user.findUnique.mockResolvedValue({ id: '1', email: 'existing@example.com' });
      
      // Create a request with an existing email
      const request = new NextRequest('http://localhost:3000/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test User',
          email: 'existing@example.com',
          password: 'password123',
          gender: 'male',
          image: 'base64image',
        }),
      });
      
      const response = await registerHandler(request);
      expect(response.status).toBe(409);
      
      const responseData = await response.json();
      expect(responseData.error).toBe('Email already registered');
    });
  });
}); 