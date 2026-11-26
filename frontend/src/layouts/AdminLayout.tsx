import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { AdminSidebar } from '../components/AdminSidebar';
import { useAuth } from '../context/AuthContext';
import { Menu, X, ShieldAlert } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Strict Admin Role Verification
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Navbar />

      {/* Admin Safety Alert Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-indigo-200 px-4 py-2 border-b border-indigo-800/40 text-xs flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-white">Campus Security Administrative Control Panel</span>
            <span className="hidden sm:inline text-indigo-300">| Session verified with ROLE_ADMIN</span>
          </div>
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="lg:hidden text-xs bg-indigo-800 text-white px-2.5 py-1 rounded font-medium flex items-center space-x-1"
          >
            {mobileSidebarOpen ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
            <span>Admin Menu</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Admin Sidebar */}
        <div className="hidden lg:block">
          <AdminSidebar />
        </div>

        {/* Mobile Admin Sidebar */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm"
              onClick={() => setMobileSidebarOpen(false)}
            ></div>
            <div className="relative z-50">
              <AdminSidebar onClose={() => setMobileSidebarOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Admin Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

