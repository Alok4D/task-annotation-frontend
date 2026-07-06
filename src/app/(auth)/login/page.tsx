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
    <div className="min-h-screen flex items-center justify-center bg-[#F4F5F7] font-sans p-4">
      <div className="w-full max-w-[420px] bg-white p-10 shadow-lg rounded-2xl border border-[#E5E7EB]">
        <div className="flex justify-center mb-8">
          <h1 className="text-[28px] font-black text-[#2F1C6A] tracking-tight">Log In</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-2">Email <span className="text-red-500">*</span></label>
            <input 
              type="email" 
              {...register('email')}
              className={cn(
                "w-full h-11 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#673de6] focus:ring-1 focus:ring-[#673de6] transition-all",
                errors.email && "border-red-500 focus:border-red-500 focus:ring-red-500"
              )}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-2">Password <span className="text-red-500">*</span></label>
            <input 
              type="password" 
              {...register('password')}
              className={cn(
                "w-full h-11 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#673de6] focus:ring-1 focus:ring-[#673de6] transition-all",
                errors.password && "border-red-500 focus:border-red-500 focus:ring-red-500"
              )}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 font-medium">
              {errorMsg}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-11 bg-[#673de6] hover:bg-[#532cc2] text-white font-bold rounded-lg transition-colors flex items-center justify-center shadow-sm disabled:opacity-70 mt-4"
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#E5E7EB] text-center">
          <p className="text-[13px] text-[#6B7280]">
            Don't have an account? <Link href="/register" className="text-[#673de6] hover:underline font-bold">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
