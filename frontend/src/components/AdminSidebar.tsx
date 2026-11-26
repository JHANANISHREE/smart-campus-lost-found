import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  AlertCircle,
  Package,
  ShieldCheck,
  Users,
  Tags,
  BarChart3,
  History,
  LogOut,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminSidebar: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { logout, user } = useAuth();

  const links = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/claims', label: 'Manage Claims', icon: ShieldCheck },
    { to: '/admin/lost-items', label: 'Manage Lost Items', icon: AlertCircle },
    { to: '/admin/found-items', label: 'Manage Found Items', icon: Package },
    { to: '/admin/students', label: 'Manage Students', icon: Users },
    { to: '/admin/categories', label: 'Item Categories', icon: Tags },
    { to: '/admin/analytics', label: 'Reports & Analytics', icon: BarChart3 },
    { to: '/admin/audit-logs', label: 'Security Audit Logs', icon: History },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 shadow-xl border-r border-slate-800">
      <div className="space-y-6">
        {/* Admin Badge Banner */}
        <div className="p-3.5 bg-gradient-to-br from-indigo-950 to-slate-800 rounded-2xl border border-indigo-500/30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-md shadow-indigo-600/40">
              <ShieldAlert className="w-5 h-5 text-indigo-200" />
            </div>
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-white truncate">{user?.fullName || 'Campus Security'}</h4>
              <p className="text-[11px] text-indigo-300 truncate">{user?.email}</p>
              <span className="inline-block mt-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                ADMIN ACCESS
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Administration
          </p>
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onClose}
                end={link.to === '/admin/dashboard'}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
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
      <div className="pt-4 border-t border-slate-800">
        <button
          onClick={() => {
            if (onClose) onClose();
            logout();
          }}
          className="flex items-center w-full px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/30 transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          <span>Exit Admin Mode</span>
        </button>
      </div>
    </aside>
  );
};

