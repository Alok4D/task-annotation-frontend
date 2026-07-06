'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useRegisterMutation } from '@/features/auth/authApi';
import { setCredentials } from '@/features/auth/authSlice';
import Link from 'next/link';
import { Spinner } from '@/components/ui/Spinner';
import { Check, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/utils/cn';

const registerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Use 8 or more characters'),
  password_confirm: z.string().min(1, 'Confirm your password'),
  agreeTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the Terms and Privacy Policy'
  }),
  subscribe: z.boolean().optional(),
}).refine(data => data.password === data.password_confirm, {
  message: "Passwords don't match",
  path: ['password_confirm'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [registerUser, { isLoading }] = useRegisterMutation();
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      agreeTerms: false,
      subscribe: true,
    }
  });

  const agreeTerms = watch('agreeTerms');
  const subscribe = watch('subscribe');

  const onSubmit = async (data: RegisterFormValues) => {
    setErrorMsg('');
    try {
      const response = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirm: data.password_confirm,
      }).unwrap();
      
      dispatch(
        setCredentials({
          user: response.user || { id: 0, email: data.email, name: data.name, created_at: '' },
          token: response.access,
        })
      );
      router.push('/tasks');
    } catch (err: any) {
      if (err?.data && typeof err.data === 'object') {
        let hasFieldError = false;
        Object.keys(err.data).forEach((key) => {
          if (key !== 'detail' && Array.isArray(err.data[key])) {
            setError(key as keyof RegisterFormValues, { type: 'server', message: err.data[key][0] });
            hasFieldError = true;
          }
        });

        if (!hasFieldError) {
          setErrorMsg(err.data.detail || 'Registration failed. Please try again.');
        }
      } else {
        setErrorMsg('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F5F7] font-sans p-4">
      <div className="w-full max-w-[420px] bg-white p-10 shadow-lg rounded-2xl border border-[#E5E7EB]">
        
        <div className="flex justify-center mb-8">
          <h1 className="text-[28px] font-black text-[#2F1C6A] tracking-tight">Sign Up Free</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-2">Name <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              {...register('name')}
              className={cn(
                "w-full h-11 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#673de6] focus:ring-1 focus:ring-[#673de6] transition-all",
                errors.name && "border-red-500 focus:border-red-500 focus:ring-red-500"
              )}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

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
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                {...register('password')}
                className={cn(
                  "w-full h-11 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg pl-3 pr-10 text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#673de6] focus:ring-1 focus:ring-[#673de6] transition-all",
                  errors.password && "border-red-500 focus:border-red-500 focus:ring-red-500"
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-[#6B7280] mt-1.5">Use 8 or more characters.</p>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-2">Confirm Password <span className="text-red-500">*</span></label>
            <div className="relative">
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                {...register('password_confirm')}
                className={cn(
                  "w-full h-11 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg pl-3 pr-10 text-sm text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#673de6] focus:ring-1 focus:ring-[#673de6] transition-all",
                  errors.password_confirm && "border-red-500 focus:border-red-500 focus:ring-red-500"
                )}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password_confirm && <p className="text-red-500 text-xs mt-1">{errors.password_confirm.message}</p>}
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
            {isLoading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#E5E7EB] text-center">
          <p className="text-[13px] text-[#6B7280]">
            Already have an account? <Link href="/login" className="text-[#673de6] hover:underline font-bold">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
