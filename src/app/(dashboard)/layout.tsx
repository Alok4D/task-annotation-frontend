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
      <header className="bg-white border-b border-[#E5E7EB] px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
      <img src="/full-logo.png" alt="TaskCanvas Logo" className="h-10 object-contain" />
        <nav className="flex gap-6 items-center">
          <a href="/tasks" className="flex items-center gap-2 text-[#4B5563] hover:text-[#673de6] font-medium transition-colors">
            <LayoutDashboard className="w-4 h-4" /> Tasks
          </a>
          <a href="/annotate" className="flex items-center gap-2 text-[#4B5563] hover:text-[#673de6] font-medium transition-colors">
            <ImageIcon className="w-4 h-4" /> Annotate
          </a>
          <div className="w-px h-6 bg-[#E5E7EB] mx-2"></div>
          
          <div className="flex items-center gap-4">
            <div className="relative group flex items-center justify-center">
              <img 
                src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80" 
                alt="User Avatar" 
                className="w-10 h-10 rounded-full border border-gray-200 object-cover"
              />
              {/* Custom Instant Tooltip */}
              <div className="absolute top-full right-0 mt-2 whitespace-nowrap bg-gray-800 text-white text-xs font-medium px-3 py-1.5 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 shadow-md">
                {user?.name || user?.email || 'User Profile'}
              </div>
            </div>
            
            <button 
              onClick={handleLogout} 
              className="flex items-center justify-center px-4 py-2 bg-[#673de6] hover:bg-[#532cc2] text-white text-sm font-semibold rounded-none transition-all shadow-sm" 
              title="Log Out"
            >
              Logout
            </button>
          </div>
        </nav>
      </header>
      <main className="flex-1 p-6 overflow-hidden flex flex-col w-full h-full">
        {children}
      </main>
    </div>
  );
}
