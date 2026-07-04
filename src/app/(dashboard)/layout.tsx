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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
          TaskFusion.
        </h1>
        <nav className="flex gap-6 items-center">
          <a href="/tasks" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition-colors">
            <LayoutDashboard className="w-4 h-4" /> Tasks
          </a>
          <a href="/annotate" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition-colors">
            <ImageIcon className="w-4 h-4" /> Annotate
          </a>
          <div className="w-px h-6 bg-gray-200 mx-2"></div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 hover:text-red-700 font-medium transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </nav>
      </header>
      <main className="flex-1 p-6 overflow-hidden flex flex-col max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
