import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Compass,
  Search,
  PlusCircle,
  Bell,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  Shield,
  Layers,
  FileText,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { notificationService } from '../services/api';
import { NotificationItem } from '../types';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications();
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const loadNotifications = async () => {
    try {
      const [countRes, listRes] = await Promise.all([
        notificationService.getUnreadCount(),
        notificationService.getRecent(),
      ]);
      if (countRes.success) setUnreadCount(countRes.data.unreadCount);
      if (listRes.success) setNotifications(listRes.data);
    } catch (err) {
      console.error('Failed to load notifications', err);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationService.markAsRead(id);
      loadNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-slate-900 text-white sticky top-0 z-50 shadow-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & College Branding */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-teal-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  SmartCampus
                </span>
                <span className="text-xs block text-teal-400 font-medium tracking-wide">
                  Lost & Found Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/') ? 'bg-slate-800 text-teal-400' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Home
            </Link>
            <Link
              to="/browse"
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-1.5 transition-colors ${
                isActive('/browse') ? 'bg-slate-800 text-teal-400' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Browse Items</span>
            </Link>
            <Link
              to="/about"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/about') ? 'bg-slate-800 text-teal-400' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              About Project
            </Link>
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                {/* Fast Action: Report Buttons */}
                {!isAdmin ? (
                  <div className="flex items-center space-x-2 mr-2">
                    <Link
                      to="/user/report-lost"
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25 transition-all flex items-center space-x-1"
                    >
                      <PlusCircle className="w-3.5 h-3.5 text-rose-400" />
                      <span>Report Lost</span>
                    </Link>
                    <Link
                      to="/user/report-found"
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-500/15 text-teal-300 border border-teal-500/30 hover:bg-teal-500/25 transition-all flex items-center space-x-1"
                    >
                      <PlusCircle className="w-3.5 h-3.5 text-teal-400" />
                      <span>Report Found</span>
                    </Link>
                  </div>
                ) : (
                  <Link
                    to="/admin/dashboard"
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-500/30 transition-all flex items-center space-x-1"
                  >
                    <Shield className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Admin Console</span>
                  </Link>
                )}

                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setNotificationsOpen(!notificationsOpen);
                      setProfileDropdownOpen(false);
                    }}
                    className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg relative transition-colors"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown Panel */}
                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in duration-150">
                      <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Bell className="w-4 h-4 text-teal-400" />
                          <span className="text-sm font-semibold">Campus Alerts</span>
                        </div>
                        {unreadCount > 0 && (
                          <span className="text-xs bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full font-medium">
                            {unreadCount} unread
                          </span>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                        {notifications.length === 0 ? (
                          <div className="py-8 text-center text-sm text-slate-400">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n.id}
                              onClick={() => !n.isRead && handleMarkAsRead(n.id)}
                              className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer ${
                                !n.isRead ? 'bg-indigo-50/50' : ''
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{n.title}</h4>
                                {!n.isRead && (
                                  <span className="w-2 h-2 rounded-full bg-indigo-600 flex-shrink-0 mt-1"></span>
                                )}
                              </div>
                              <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                                {n.message}
                              </p>
                              <span className="text-[10px] text-slate-400 mt-2 block font-medium">
                                {new Date(n.createdAt).toLocaleDateString()} • {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                        <Link
                          to={isAdmin ? '/admin/dashboard' : '/user/notifications'}
                          onClick={() => setNotificationsOpen(false)}
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                        >
                          View all notifications →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Profile Avatar Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(!profileDropdownOpen);
                      setNotificationsOpen(false);
                    }}
                    className="flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60 transition-all"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-teal-400 text-white font-bold text-xs flex items-center justify-center">
                      {user?.fullName.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-semibold max-w-[100px] truncate">{user?.fullName.split(' ')[0]}</span>
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in duration-150">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-xs font-semibold text-slate-900">{user?.fullName}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                        <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                          {user?.role === 'ADMIN' ? '🛡️ Administrator' : '🎓 Student'}
                        </span>
                      </div>

                      <div className="py-1 text-xs">
                        {user?.role === 'ADMIN' ? (
                          <>
                            <Link
                              to="/admin/dashboard"
                              onClick={() => setProfileDropdownOpen(false)}
                              className="flex items-center px-4 py-2 hover:bg-slate-50 text-slate-700 font-medium"
                            >
                              <Shield className="w-4 h-4 mr-2 text-indigo-600" />
                              Admin Dashboard
                            </Link>
                            <Link
                              to="/admin/claims"
                              onClick={() => setProfileDropdownOpen(false)}
                              className="flex items-center px-4 py-2 hover:bg-slate-50 text-slate-700 font-medium"
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2 text-teal-600" />
                              Manage Claims
                            </Link>
                          </>
                        ) : (
                          <>
                            <Link
                              to="/user/dashboard"
                              onClick={() => setProfileDropdownOpen(false)}
                              className="flex items-center px-4 py-2 hover:bg-slate-50 text-slate-700 font-medium"
                            >
                              <Layers className="w-4 h-4 mr-2 text-indigo-600" />
                              Student Dashboard
                            </Link>
                            <Link
                              to="/user/my-lost"
                              onClick={() => setProfileDropdownOpen(false)}
                              className="flex items-center px-4 py-2 hover:bg-slate-50 text-slate-700 font-medium"
                            >
                              <AlertCircle className="w-4 h-4 mr-2 text-rose-500" />
                              My Lost Items
                            </Link>
                            <Link
                              to="/user/my-found"
                              onClick={() => setProfileDropdownOpen(false)}
                              className="flex items-center px-4 py-2 hover:bg-slate-50 text-slate-700 font-medium"
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2 text-teal-600" />
                              My Found Items
                            </Link>
                            <Link
                              to="/user/my-claims"
                              onClick={() => setProfileDropdownOpen(false)}
                              className="flex items-center px-4 py-2 hover:bg-slate-50 text-slate-700 font-medium"
                            >
                              <FileText className="w-4 h-4 mr-2 text-amber-500" />
                              My Claim Requests
                            </Link>
                            <Link
                              to="/user/profile"
                              onClick={() => setProfileDropdownOpen(false)}
                              className="flex items-center px-4 py-2 hover:bg-slate-50 text-slate-700 font-medium"
                            >
                              <UserIcon className="w-4 h-4 mr-2 text-slate-500" />
                              My Profile
                            </Link>
                          </>
                        )}
                      </div>

                      <div className="pt-1 border-t border-slate-100">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/user/login"
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-200 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Student Sign In
                </Link>
                <Link
                  to="/user/register"
                  className="px-4 py-1.5 text-xs font-semibold bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-lg shadow-md shadow-teal-500/20 transition-all hover:scale-[1.02]"
                >
                  Register
                </Link>
                <Link
                  to="/admin/login"
                  className="ml-2 px-3 py-1.5 text-xs font-medium text-indigo-300 hover:text-indigo-200 border border-indigo-500/30 hover:border-indigo-500/50 rounded-lg hover:bg-indigo-950/40 transition-colors flex items-center space-x-1"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            {isAuthenticated && (
              <Link
                to={isAdmin ? '/admin/dashboard' : '/user/dashboard'}
                className="w-8 h-8 rounded-lg bg-slate-800 text-teal-400 flex items-center justify-center font-bold text-xs"
              >
                {user?.fullName.charAt(0)}
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-6 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
          >
            Home
          </Link>
          <Link
            to="/browse"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
          >
            Browse Found Items
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800"
          >
            About Project
          </Link>

          {isAuthenticated ? (
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <div className="px-3 py-2 bg-slate-800/60 rounded-xl">
                <p className="text-xs font-bold text-white">{user?.fullName}</p>
                <p className="text-[11px] text-teal-400">{user?.role} • {user?.email}</p>
              </div>

              {isAdmin ? (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-semibold text-indigo-400 hover:bg-slate-800"
                >
                  Admin Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/user/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-semibold text-teal-400 hover:bg-slate-800"
                  >
                    Student Dashboard
                  </Link>
                  <Link
                    to="/user/report-lost"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
                  >
                    Report Lost Item
                  </Link>
                  <Link
                    to="/user/report-found"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
                  >
                    Report Found Item
                  </Link>
                  <Link
                    to="/user/my-claims"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
                  >
                    My Claims
                  </Link>
                </>
              )}

              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-rose-400 hover:bg-rose-950/20"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-2">
              <Link
                to="/user/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-white"
              >
                Student Sign In
              </Link>
              <Link
                to="/user/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center px-4 py-2 rounded-xl text-xs font-semibold bg-teal-500 text-white"
              >
                Register
              </Link>
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="col-span-2 text-center px-4 py-2 rounded-xl text-xs font-semibold border border-indigo-500/40 text-indigo-300"
              >
                Campus Admin Sign In
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

