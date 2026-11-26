import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Ban,
  Check,
  Building,
  GraduationCap
} from 'lucide-react';
import { adminService } from '../../services/api';
import { User, AccountStatus } from '../../types';

export const ManageStudentsPage: React.FC = () => {
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  useEffect(() => {
    loadStudents();
  }, [searchQuery]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const res = await adminService.getStudents({
        search: searchQuery.trim() || undefined,
        size: 50,
      });
      if (res.success && res.data) {
        setStudents(res.data.content);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (student: User) => {
    const nextStatus = student.accountStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    const actionLabel = nextStatus === 'SUSPENDED' ? 'suspend' : 'reactivate';

    if (window.confirm(`Are you sure you want to ${actionLabel} account for ${student.fullName}?`)) {
      try {
        const res = await adminService.updateStudentStatus(student.id, nextStatus);
        if (res.success) {
          setActionSuccess(`Student account ${student.fullName} updated to ${nextStatus}.`);
          loadStudents();
          setTimeout(() => setActionSuccess(''), 3000);
        }
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to update student account status');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <Users className="w-6 h-6 text-indigo-600" />
            <span>Campus Student Directory &amp; Access Controls</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Search registered students, inspect registration numbers, and manage portal participation privileges.
          </p>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* SEARCH BAR */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by student name, registration number, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* STUDENTS TABLE */}
      {loading ? (
        <div className="py-20 flex justify-center items-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : students.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-700">No Students Found</h3>
          <p className="text-xs text-slate-400">No registered students match your search criteria.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4">Student Name</th>
                  <th className="py-3.5 px-4">Registration No</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Year</th>
                  <th className="py-3.5 px-4">Account Status</th>
                  <th className="py-3.5 px-4 text-right">Access Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{student.fullName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{student.email}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                      {student.registrationNumber || 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{student.department || 'General'}</td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {student.yearOfStudy ? `Year ${student.yearOfStudy}` : 'N/A'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          student.accountStatus === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {student.accountStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleToggleStatus(student)}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors flex items-center space-x-1 ml-auto ${
                          student.accountStatus === 'ACTIVE'
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        {student.accountStatus === 'ACTIVE' ? (
                          <>
                            <Ban className="w-3.5 h-3.5" />
                            <span>Suspend</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Reactivate</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

