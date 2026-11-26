import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  AlertCircle,
  Package,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  BarChart3,
  TrendingUp,
  FileText
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { adminService } from '../../services/api';
import { AdminDashboardData, Claim } from '../../types';

export const AdminDashboardPage: React.FC = () => {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [pendingClaims, setPendingClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [metricsRes, claimsRes] = await Promise.all([
        adminService.getDashboard(),
        adminService.getClaims({ status: 'PENDING', size: 5 }),
      ]);

      if (metricsRes.success && metricsRes.data) {
        setData(metricsRes.data);
      }
      if (claimsRes.success && claimsRes.data) {
        setPendingClaims(claimsRes.data.content);
      }
    } catch (err) {
      console.error('Failed to load admin metrics', err);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#6366F1', '#14B8A6', '#F59E0B', '#EF4444', '#10B981', '#8B5CF6'];

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Security Control &amp; Analytics Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time campus belongings telemetry, claims pending verification, and resolution metrics.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to="/admin/claims"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Review Pending Claims</span>
          </Link>
        </div>
      </div>

      {/* METRIC CARDS */}
      {data && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Registered Students */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Students
            </span>
            <span className="text-2xl font-black text-slate-900 block">{data.totalStudents}</span>
            <span className="text-[10px] text-slate-500">Enrolled users</span>
          </div>

          {/* Total Lost */}
          <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm space-y-1 bg-gradient-to-br from-white to-rose-50/20">
            <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider block">
              Lost Reports
            </span>
            <span className="text-2xl font-black text-rose-700 block">{data.totalLostItems}</span>
            <span className="text-[10px] text-slate-500">Missing logged</span>
          </div>

          {/* Total Found */}
          <div className="bg-white p-5 rounded-2xl border border-teal-100 shadow-sm space-y-1 bg-gradient-to-br from-white to-teal-50/20">
            <span className="text-[11px] font-bold text-teal-600 uppercase tracking-wider block">
              Found Items
            </span>
            <span className="text-2xl font-black text-teal-700 block">{data.totalFoundItems}</span>
            <span className="text-[10px] text-slate-500">Cataloged items</span>
          </div>

          {/* Pending Claims */}
          <div className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm space-y-1 bg-gradient-to-br from-white to-amber-50/20">
            <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">
              Pending Claims
            </span>
            <span className="text-2xl font-black text-amber-700 block">{data.pendingClaims}</span>
            <span className="text-[10px] text-amber-600 font-semibold">Requires Action</span>
          </div>

          {/* Approved Claims */}
          <div className="bg-white p-5 rounded-2xl border border-indigo-100 shadow-sm space-y-1 bg-gradient-to-br from-white to-indigo-50/20">
            <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider block">
              Approved
            </span>
            <span className="text-2xl font-black text-indigo-700 block">{data.approvedClaims}</span>
            <span className="text-[10px] text-slate-500">Awaiting pickup</span>
          </div>

          {/* Recovered Items */}
          <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm space-y-1 bg-gradient-to-br from-white to-emerald-50/20">
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">
              Handed Over
            </span>
            <span className="text-2xl font-black text-emerald-700 block">{data.recoveredItems}</span>
            <span className="text-[10px] text-emerald-600 font-semibold">Resolved</span>
          </div>
        </div>
      )}

      {/* CHARTS ROW (RECHARTS) */}
      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monthly Trends BarChart */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Monthly Volume Trends</h3>
                <p className="text-xs text-slate-500">Comparison of reported Lost vs Found belongings</p>
              </div>
              <BarChart3 className="w-5 h-5 text-indigo-600" />
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.monthlyTrends}>
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      color: '#fff',
                      borderRadius: '12px',
                      fontSize: '11px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="lost" fill="#F43F5E" name="Lost Items" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="found" fill="#14B8A6" name="Found Items" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="recovered" fill="#10B981" name="Recovered" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Claims Status Distribution PieChart */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Claims Verification Distribution</h3>
                <p className="text-xs text-slate-500">Status breakdown across all submitted claims</p>
              </div>
              <TrendingUp className="w-5 h-5 text-teal-600" />
            </div>

            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.claimStatusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="count"
                    nameKey="status"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {data.claimStatusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E293B',
                      color: '#fff',
                      borderRadius: '12px',
                      fontSize: '11px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* PENDING CLAIMS ACTION QUEUE */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Pending Verification Queue</h3>
            <p className="text-xs text-slate-500">Recent student ownership claims awaiting inspection</p>
          </div>
          <Link
            to="/admin/claims"
            className="text-xs font-bold text-indigo-600 hover:underline flex items-center space-x-1"
          >
            <span>Open All Claims</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {pendingClaims.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No claims pending review. The verification queue is currently clear!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-3 px-3">Claim ID</th>
                  <th className="py-3 px-3">Item Name</th>
                  <th className="py-3 px-3">Claimant</th>
                  <th className="py-3 px-3">Reg No</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingClaims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-700">{claim.claimCode}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">{claim.foundItem?.itemName}</td>
                    <td className="py-3 px-3 text-slate-600">{claim.claimedBy?.fullName}</td>
                    <td className="py-3 px-3 font-mono text-slate-500">{claim.claimedBy?.registrationNumber}</td>
                    <td className="py-3 px-3 text-slate-400">{new Date(claim.submittedAt).toLocaleDateString()}</td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        to="/admin/claims"
                        className="px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg font-bold text-[11px]"
                      >
                        Inspect &amp; Verify →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

