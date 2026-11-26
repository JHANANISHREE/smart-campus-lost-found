import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Hash,
  BookOpen,
  Calendar,
  Phone,
  ShieldCheck,
  Award,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { authService } from '../../services/api';
import { UserProfile } from '../../types';

export const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await authService.getMe();
      if (res.success && res.data) {
        setProfile(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
          <User className="w-6 h-6 text-indigo-600" />
          <span>Student Profile &amp; Campus Record</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review your enrolled academic details and campus lost &amp; found activities.
        </p>
      </div>

      {profile && (
        <>
          {/* Profile Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-teal-500 text-white font-bold text-2xl flex items-center justify-center shadow-md shadow-indigo-600/20">
                {profile.fullName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">{profile.fullName}</h2>
                <p className="text-xs text-slate-500 font-mono">{profile.email}</p>
                <div className="flex items-center space-x-2 mt-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Status: {profile.accountStatus}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                    Role: {profile.role}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Registration Number
                </span>
                <span className="font-mono font-bold text-slate-800 text-sm">
                  {profile.registrationNumber || 'N/A'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Department
                </span>
                <span className="font-bold text-slate-800">
                  {profile.department || 'General'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Year of Study
                </span>
                <span className="font-bold text-slate-800">
                  {profile.yearOfStudy ? `Year ${profile.yearOfStudy}` : 'N/A'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Phone Contact
                </span>
                <span className="font-bold text-slate-800">
                  {profile.phoneNumber || 'Not provided'}
                </span>
              </div>
            </div>
          </div>

          {/* Activity Statistics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center shadow-sm">
              <span className="text-xs text-slate-500 font-semibold block">Lost Reports</span>
              <span className="text-2xl font-black text-rose-600 block mt-1">
                {profile.totalLostReported}
              </span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center shadow-sm">
              <span className="text-xs text-slate-500 font-semibold block">Found Reports</span>
              <span className="text-2xl font-black text-teal-600 block mt-1">
                {profile.totalFoundReported}
              </span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 text-center shadow-sm">
              <span className="text-xs text-slate-500 font-semibold block">Claims Made</span>
              <span className="text-2xl font-black text-indigo-600 block mt-1">
                {profile.totalClaimsMade}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

