import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  AlertCircle,
  PlusCircle,
  CheckCircle2,
  Clock,
  Search,
  FileText,
  ArrowRight,
  TrendingUp,
  MapPin,
  Calendar
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { userService, lostItemService, foundItemService, claimService } from '../../services/api';
import { DashboardStats, LostItem, FoundItem, Claim } from '../../types';

export const StudentDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalReported: 0,
    lostItemsCount: 0,
    foundItemsCount: 0,
    pendingClaimsCount: 0,
    recoveredItemsCount: 0,
  });
  const [myRecentLost, setMyRecentLost] = useState<LostItem[]>([]);
  const [myRecentClaims, setMyRecentClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, lostRes, claimsRes] = await Promise.all([
        userService.getStudentDashboard(),
        lostItemService.getMyItems({ page: 0, size: 3 }),
        claimService.getMyClaims({ page: 0, size: 3 }),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (lostRes.success && lostRes.data) setMyRecentLost(lostRes.data.content);
      if (claimsRes.success && claimsRes.data) setMyRecentClaims(claimsRes.data.content);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Greeting Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700/60">
            Student Belongings Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.fullName}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            {user?.department} • Year {user?.yearOfStudy} • Reg: <span className="font-mono text-teal-300">{user?.registrationNumber}</span>
          </p>
        </div>

        {/* Quick Action Buttons inside banner */}
        <div className="relative z-10 pt-6 flex flex-wrap gap-3">
          <Link
            to="/user/report-lost"
            className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5"
          >
            <AlertCircle className="w-4 h-4" />
            <span>Report Lost Item</span>
          </Link>
          <Link
            to="/user/report-found"
            className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Register Found Item</span>
          </Link>
          <Link
            to="/browse"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all flex items-center space-x-1.5"
          >
            <Search className="w-4 h-4 text-teal-400" />
            <span>Browse Found Listings</span>
          </Link>
        </div>
      </div>

      {/* METRIC STATS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Reports */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500">Total Reports</span>
          <div className="text-2xl font-black text-slate-900">{stats.totalReported}</div>
          <span className="text-[10px] text-slate-400">Lost + Found filed</span>
        </div>

        {/* Lost Items */}
        <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm space-y-1 bg-gradient-to-br from-white to-rose-50/30">
          <span className="text-xs font-semibold text-rose-600">Lost Items</span>
          <div className="text-2xl font-black text-rose-700">{stats.lostItemsCount}</div>
          <span className="text-[10px] text-slate-400">Reported missing</span>
        </div>

        {/* Found Items */}
        <div className="bg-white p-5 rounded-2xl border border-teal-100 shadow-sm space-y-1 bg-gradient-to-br from-white to-teal-50/30">
          <span className="text-xs font-semibold text-teal-600">Found Items</span>
          <div className="text-2xl font-black text-teal-700">{stats.foundItemsCount}</div>
          <span className="text-[10px] text-slate-400">Registered by you</span>
        </div>

        {/* Pending Claims */}
        <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm space-y-1 bg-gradient-to-br from-white to-amber-50/30">
          <span className="text-xs font-semibold text-amber-600">Pending Claims</span>
          <div className="text-2xl font-black text-amber-700">{stats.pendingClaimsCount}</div>
          <span className="text-[10px] text-slate-400">Under verification</span>
        </div>

        {/* Recovered Items */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-1 col-span-2 lg:col-span-1 bg-gradient-to-br from-white to-emerald-50/30">
          <span className="text-xs font-semibold text-emerald-600">Recovered</span>
          <div className="text-2xl font-black text-emerald-700">{stats.recoveredItemsCount}</div>
          <span className="text-[10px] text-emerald-600 font-medium">Successfully resolved</span>
        </div>
      </div>

      {/* TWO COLUMN CONTENT: RECENT REPORTS & CLAIMS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Your Recent Lost Reports */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-rose-500" />
              <h3 className="text-sm font-bold text-slate-900">My Missing Items</h3>
            </div>
            <Link to="/user/my-lost" className="text-xs font-bold text-indigo-600 hover:underline">
              View All →
            </Link>
          </div>

          {myRecentLost.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              You haven't reported any missing items yet.
            </div>
          ) : (
            <div className="space-y-3">
              {myRecentLost.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-slate-400">{item.itemCode}</span>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.itemName}</h4>
                    <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                      <span className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                        {item.location}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      item.status === 'LOST'
                        ? 'bg-rose-100 text-rose-800'
                        : item.status === 'RECOVERED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-indigo-100 text-indigo-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Your Recent Claims */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-teal-600" />
              <h3 className="text-sm font-bold text-slate-900">My Claim Status</h3>
            </div>
            <Link to="/user/my-claims" className="text-xs font-bold text-teal-600 hover:underline">
              View All →
            </Link>
          </div>

          {myRecentClaims.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No active claims submitted. Found something that's yours? Browse and submit a claim.
            </div>
          ) : (
            <div className="space-y-3">
              {myRecentClaims.map((claim) => (
                <div
                  key={claim.id}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-slate-400">{claim.claimCode}</span>
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                      {claim.foundItem?.itemName}
                    </h4>
                    <span className="text-[10px] text-slate-500 block">
                      Submitted: {new Date(claim.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      claim.claimStatus === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : claim.claimStatus === 'REJECTED'
                        ? 'bg-rose-100 text-rose-800'
                        : claim.claimStatus === 'COMPLETED'
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {claim.claimStatus}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

