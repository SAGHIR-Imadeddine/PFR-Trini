import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignInPage from '@/app/(auth)/signin/page';
import { signIn } from 'next-auth/react';

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
  success: jest.fn(),
}));

describe('SignIn Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders sign in form correctly', () => {
    render(<SignInPage />);
    
    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('handles form submission and successful login', async () => {
    // Mock successful sign in
    (signIn as jest.Mock).mockResolvedValueOnce({
      ok: true,
      error: undefined,
    });

    render(<SignInPage />);
    
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'test@example.com' },
    });
    
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('credentials', {
        email: 'test@example.com',
        password: 'password123',
        redirect: false,
      });
    });
  });
}); 