import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  AlertCircle,
  PlusCircle,
  Search,
  CheckCircle2,
  FileText,
  Bell,
  User,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const StudentSidebar: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { logout, user } = useAuth();

  const links = [
    { to: '/user/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/user/report-lost', label: 'Report Lost Item', icon: AlertCircle, highlight: 'rose' },
    { to: '/user/report-found', label: 'Report Found Item', icon: PlusCircle, highlight: 'teal' },
    { to: '/browse', label: 'Browse Found Items', icon: Search },
    { to: '/user/my-lost', label: 'My Lost Items', icon: AlertCircle },
    { to: '/user/my-found', label: 'My Found Items', icon: CheckCircle2 },
    { to: '/user/my-claims', label: 'My Claim Requests', icon: FileText },
    { to: '/user/notifications', label: 'Notifications', icon: Bell },
    { to: '/user/profile', label: 'My Profile', icon: User },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 shadow-sm">
      <div className="space-y-6">
        {/* User Mini Profile */}
        <div className="p-3.5 bg-gradient-to-br from-slate-50 to-indigo-50/50 rounded-2xl border border-slate-200/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-teal-500 text-white font-bold text-sm flex items-center justify-center shadow-md shadow-indigo-500/20">
              {user?.fullName.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-slate-900 truncate">{user?.fullName}</h4>
              <p className="text-[11px] text-slate-500 truncate">{user?.registrationNumber || user?.email}</p>
              <span className="inline-block mt-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                Active Student
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Main Portal
          </p>
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onClose}
                end={link.to === '/user/dashboard'}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Logout button */}
      <div className="pt-4 border-t border-slate-100">
        <button
          onClick={() => {
            if (onClose) onClose();
            logout();
          }}
          className="flex items-center w-full px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

