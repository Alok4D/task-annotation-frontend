'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '@/features/auth/authApi';
import { setCredentials } from '@/features/auth/authSlice';
import Link from 'next/link';
import { cn } from '@/utils/cn';
import { Eye, EyeOff } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setErrorMsg('');
    try {
      const response = await login(data).unwrap();
      dispatch(
        setCredentials({
          user: response.user || { id: 0, email: data.email, created_at: '' },
          token: response.access,
        })
      );
      router.push('/tasks');
    } catch (err: any) {
      setErrorMsg(err?.data?.detail || 'Failed to login. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 font-sans bg-white">
      {/* Left Column - Image */}
      <div className="hidden lg:flex flex-col justify-center items-center relative overflow-hidden bg-linear-to-br from-[#4c24b3] to-[#271060]">
        <div className="absolute inset-0">
          <img src="/auth-bg.png" alt="TaskCanvas" className="w-full h-full object-cover mix-blend-screen opacity-70" />
        </div>
      
      </div>

      {/* Right Column - Form */}
      <div className="flex items-center justify-center p-6 lg:p-12 relative">
        <div className="w-full max-w-110">
          <div className="flex flex-col mb-10 text-center items-center">
            <img src="/full-logo.png" alt="TaskCanvas Logo" className="h-14 mb-6 object-contain" />
           
            <p className="text-[#6B7280] font-medium text-[15px]">Sign in to your TaskCanvas account.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-[12px] font-bold text-[#4B5563] uppercase tracking-wider mb-2">Email</label>
              <input 
                type="email" 
                placeholder="Enter your email"
                {...register('email')}
                className={cn(
                  "w-full h-12 bg-[#F9FAFB] border border-[#E5E7EB] rounded-none px-4 text-[15px] text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#673de6] transition-all",
                  errors.email && "border-red-500 focus:border-red-500"
                )}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#4B5563] uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter your password"
                  {...register('password')}
                  className={cn(
                    "w-full h-12 bg-[#F9FAFB] border border-[#E5E7EB] rounded-none pl-4 pr-12 text-[15px] text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#673de6] transition-all",
                    errors.password && "border-red-500 focus:border-red-500"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#9CA3AF] hover:text-[#673de6] focus:outline-none transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.password.message}</p>}
            </div>

            {errorMsg && (
              <div className="p-4 bg-red-50 text-red-600 text-sm rounded-none border border-red-100 font-medium flex items-center gap-2">
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errorMsg}
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-12 bg-[#673de6] hover:bg-[#532cc2] text-white font-bold text-[15px] rounded-sm transition-all disabled:opacity-70 mt-8 flex items-center justify-center hover:-translate-y-0.5"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-[15px] text-[#6B7280] font-medium">
              Don't have an account? <Link href="/register" className="text-[#673de6] hover:text-[#532cc2] hover:underline font-bold transition-colors ml-1">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
