'use client';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { LogOut, LayoutDashboard, Image as ImageIcon, Menu, X } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '@/features/auth/authSlice';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {

  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router, mounted]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  }

  if (!mounted || !isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#F4F5F7] flex flex-col font-sans">
      <header className="bg-white border-b border-[#E5E7EB] px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <Link href={"/"}>
          <img src="/full-logo.png" alt="TaskCanvas Logo" className="h-10 object-contain" />
        </Link>
        <nav className="flex gap-6 items-center">
          <div className="hidden md:flex gap-6 items-center">
            <Link href={"/tasks"} className="flex items-center gap-2 text-[#4B5563] hover:text-[#673de6] font-medium transition-colors">
              <LayoutDashboard className="w-4 h-4" /> Tasks
            </Link>
            <Link href={"/annotate"} className="flex items-center gap-2 text-[#4B5563] hover:text-[#673de6] font-medium transition-colors">
              <ImageIcon className="w-4 h-4" /> Annotate
            </Link>
          </div>
          
          {/* Mobile menu toggle & actions */}
          <div className="md:hidden flex items-center gap-2">
            <div id="mobile-header-actions"></div>
            <button 
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="w-px h-6 bg-[#E5E7EB] mx-2"></div>
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
      
      {/* Mobile Nav Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#E5E7EB] px-4 py-3 flex flex-col gap-3 shadow-md z-40">
          <Link 
            href={"/tasks"} 
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-2 text-gray-600 hover:text-[#673de6] font-medium py-2"
          >
            <LayoutDashboard className="w-4 h-4" /> Tasks
          </Link>
          <Link 
            href={"/annotate"} 
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-2 text-gray-600 hover:text-[#673de6] font-medium py-2"
          >
            <ImageIcon className="w-4 h-4" /> Annotate
          </Link>
          <button 
            onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
            className="flex items-center gap-2 text-red-600 hover:text-red-800 font-medium py-2 text-left w-full border-t border-gray-100 pt-2"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      )}

      <main className="flex-1 p-6 overflow-hidden flex flex-col w-full h-full">
        {children}
      </main>
    </div>
  );
}
