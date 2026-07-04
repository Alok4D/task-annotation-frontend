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
    <div className="min-h-screen bg-[#1E2228] flex flex-col font-sans">
      <header className="bg-[#181A1F] border-b border-[#3A414B] px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <h1 className="text-2xl font-black bg-gradient-to-r from-[#00BFA5] to-[#0D73ED] bg-clip-text text-transparent tracking-tight">
          TaskFusion.
        </h1>
        <nav className="flex gap-6 items-center">
          <a href="/tasks" className="flex items-center gap-2 text-[#8B929D] hover:text-white font-medium transition-colors">
            <LayoutDashboard className="w-4 h-4" /> Tasks
          </a>
          <a href="/annotate" className="flex items-center gap-2 text-[#8B929D] hover:text-white font-medium transition-colors">
            <ImageIcon className="w-4 h-4" /> Annotate
          </a>
          <div className="w-px h-6 bg-[#3A414B] mx-2"></div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 hover:text-red-400 font-medium transition-colors" title="Log Out">
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
