import React, { useState, useEffect } from 'react';
import {
  History,
  ShieldCheck,
  Search,
  Clock,
  User,
  FileText
} from 'lucide-react';
import { adminService } from '../../services/api';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAuditLogs();
      if (res.success && res.data) {
        setLogs(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
          <History className="w-6 h-6 text-indigo-600" />
          <span>Immutable System Audit Trail</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Historical log of all report creations, claim approvals, status transitions, and handover events.
        </p>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center items-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : logs.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200">
          <History className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-700">No Logs Recorded Yet</h3>
          <p className="text-xs text-slate-400">Audit logs are automatically populated upon actions.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Action Event</th>
                  <th className="py-3 px-4">Entity Type</th>
                  <th className="py-3 px-4">Entity ID</th>
                  <th className="py-3 px-4">Performed By</th>
                  <th className="py-3 px-4">Audit Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-slate-500 font-sans">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-bold">{log.itemType}</td>
                    <td className="py-3 px-4 text-slate-500">#{log.itemId}</td>
                    <td className="py-3 px-4 text-slate-800 font-sans font-medium">
                      {log.performedBy ? log.performedBy.fullName : 'System Bootstrap'}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-sans text-xs">
                      {log.remarks || '—'}
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

