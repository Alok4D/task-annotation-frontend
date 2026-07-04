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
import { Check } from 'lucide-react';
import { cn } from '@/utils/cn';

const registerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Use 8 or more characters'),
  agreeTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the Terms and Privacy Policy'
  }),
  subscribe: z.boolean().optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [registerUser, { isLoading }] = useRegisterMutation();
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
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
        email: data.email,
        password: data.password,
      }).unwrap();
      
      dispatch(
        setCredentials({
          user: { id: 0, email: data.email, created_at: '' },
          token: response.access,
        })
      );
      router.push('/tasks');
    } catch (err: any) {
      setErrorMsg(err?.data?.email?.[0] || err?.data?.detail || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#20242B] font-sans p-4">
      <div className="w-full max-w-[420px] bg-[#272B33] p-10 shadow-lg">
        
        <div className="flex justify-center mb-8">
          <h1 className="text-[22px] font-bold text-white tracking-wide">Sign Up Free</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-[11px] font-bold text-[#8B929D] mb-1.5 uppercase tracking-wide">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('name')}
              className="w-full h-10 bg-transparent border border-[#3A414B] focus:border-[#0D73ED] rounded outline-none px-3 text-sm text-white transition-colors"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#8B929D] mb-1.5 uppercase tracking-wide">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              {...register('email')}
              className="w-full h-10 bg-transparent border border-[#3A414B] focus:border-[#0D73ED] rounded outline-none px-3 text-sm text-white transition-colors"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#8B929D] mb-1.5 uppercase tracking-wide">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              {...register('password')}
              className="w-full h-10 bg-transparent border border-[#3A414B] focus:border-[#0D73ED] rounded outline-none px-3 text-sm text-white transition-colors mb-1"
            />
            <p className="text-[11px] text-[#8B929D]">Use 8 or more characters.</p>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

    

          {errorMsg && (
            <div className="p-3 bg-red-500/10 text-red-500 text-sm rounded border border-red-500/20 font-medium">
              {errorMsg}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-[42px] bg-[#00BFA5] hover:bg-[#00a891] text-white font-bold text-sm rounded transition-colors flex justify-center items-center gap-2 mt-4"
          >
            {isLoading ? <Spinner className="w-4 h-4 text-white" /> : 'Sign Up'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-[#8B929D]">
            Already have an account? <Link href="/login" className="text-[#0D73ED] hover:underline font-semibold">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
