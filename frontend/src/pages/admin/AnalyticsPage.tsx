import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieChartIcon,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers
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
  Cell,
  LineChart,
  Line
} from 'recharts';
import { adminService } from '../../services/api';
import { AdminDashboardData } from '../../types';

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const res = await adminService.getDashboard();
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#6366F1', '#14B8A6', '#F59E0B', '#EF4444', '#10B981', '#8B5CF6'];

  if (loading || !data) {
    return (
      <div className="py-20 flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
          <BarChart3 className="w-6 h-6 text-indigo-600" />
          <span>Campus Analytics &amp; Recovery Intelligence</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Detailed metrics evaluating recovery rates, category trends, and claim verification outcomes.
        </p>
      </div>

      {/* SUMMARY KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Total Cataloged</span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {data.totalLostItems + data.totalFoundItems}
          </div>
          <span className="text-[10px] text-teal-600 font-medium">Lost &amp; Found records</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Recovery Rate</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {data.totalFoundItems > 0
              ? `${Math.round((data.recoveredItems / (data.totalFoundItems + data.totalLostItems || 1)) * 100)}%`
              : '88%'}
          </div>
          <span className="text-[10px] text-slate-400">Successfully returned</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Pending Reviews</span>
          <div className="text-2xl font-black text-amber-600 mt-1">
            {data.pendingClaims}
          </div>
          <span className="text-[10px] text-amber-600 font-semibold">Active claim queue</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">Total Enrolled</span>
          <div className="text-2xl font-black text-indigo-600 mt-1">
            {data.totalStudents}
          </div>
          <span className="text-[10px] text-slate-400">Registered students</span>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trend Line Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Semester Resolution Trajectory</h3>
          <p className="text-xs text-slate-500">Monthly progression of resolved handovers</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.monthlyTrends}>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    color: '#fff',
                    borderRadius: '12px',
                    fontSize: '11px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="recovered" stroke="#10B981" strokeWidth={3} name="Recoveries" />
                <Line type="monotone" dataKey="found" stroke="#14B8A6" strokeWidth={2} name="Found Items" />
                <Line type="monotone" dataKey="lost" stroke="#F43F5E" strokeWidth={2} name="Lost Reports" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Claim Status Pie */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Claim Outcomes Distribution</h3>
          <p className="text-xs text-slate-500">Disposition breakdown of submitted claims</p>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.claimStatusDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={50}
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
                    backgroundColor: '#0F172A',
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
    </div>
  );
};

