'use client';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LogOut, LayoutDashboard, Image as ImageIcon } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '@/features/auth/authSlice';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex flex-col font-sans">
      <header className="bg-white border-b border-[#E5E7EB] px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <h1 className="text-2xl font-black text-[#2F1C6A] tracking-tight">
          TaskFusion<span className="text-[#673de6]">.</span>
        </h1>
        <nav className="flex gap-6 items-center">
          <a href="/tasks" className="flex items-center gap-2 text-[#4B5563] hover:text-[#673de6] font-medium transition-colors">
            <LayoutDashboard className="w-4 h-4" /> Tasks
          </a>
          <a href="/annotate" className="flex items-center gap-2 text-[#4B5563] hover:text-[#673de6] font-medium transition-colors">
            <ImageIcon className="w-4 h-4" /> Annotate
          </a>
          <div className="w-px h-6 bg-[#E5E7EB] mx-2"></div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 hover:text-red-600 font-medium transition-colors" title="Log Out">
            <LogOut className="w-4 h-4" />
          </button>
        </nav>
      </header>
      <main className="flex-1 p-6 overflow-hidden flex flex-col w-full h-full">
        {children}
      </main>
    </div>
  );
}
