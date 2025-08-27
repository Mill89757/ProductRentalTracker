'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/firebase/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ShoppingBag } from 'lucide-react';

const authSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type AuthFormData = z.infer<typeof authSchema>;

export default function AuthPage() {
  const [isSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema)
  });

  const handleAuth = async (data: AuthFormData) => {
    setLoading(true);
    setAuthError('');

    try {
      const { user, error } = await signIn(data.email, data.password);

      if (error) {
        setAuthError(error);
      } else if (user) {
        router.push('/dashboard');
      }
    } catch (err) {
      setAuthError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    // Sign up is disabled by requirement; keep sign-in only
    setAuthError('');
    reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <ShoppingBag className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Staff Product Rental Tracker
          </h2>
          <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
        </div>

        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
          <form className="space-y-6" onSubmit={handleSubmit(handleAuth)}>
            <Input
              label="Email address"
              type="email"
              placeholder="Enter your email"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              error={errors.password?.message}
              {...register('password')}
            />

            {authError && (
              <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-md">
                {authError}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              loading={loading}
              disabled={loading}
            >
              Sign In
            </Button>
          </form>

          {/* Sign up and mode toggle removed as accounts are manually created */}
        </div>

        <div className="text-center text-xs text-gray-500">
          <p>Secure staff product rental management system</p>
        </div>
      </div>
    </div>
  );
}