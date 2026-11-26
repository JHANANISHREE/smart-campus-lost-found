import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  Search,
  Filter,
  Trash2,
  CheckCircle2,
  MapPin,
  Calendar,
  User,
  Phone,
  Mail,
  Check
} from 'lucide-react';
import { lostItemService } from '../../services/api';
import { LostItem, ItemStatus } from '../../types';

export const ManageLostItemsPage: React.FC = () => {
  const [items, setItems] = useState<LostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ItemStatus | ''>('');
  const [actionSuccess, setActionSuccess] = useState('');

  useEffect(() => {
    loadLostItems();
  }, [searchQuery, selectedStatus]);

  const loadLostItems = async () => {
    try {
      setLoading(true);
      const res = await lostItemService.search({
        keyword: searchQuery.trim() || undefined,
        status: (selectedStatus as ItemStatus) || undefined,
        size: 50,
      });
      if (res.success && res.data) {
        setItems(res.data.content);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: number, status: ItemStatus) => {
    try {
      const res = await lostItemService.updateStatus(id, status, 'Status updated by campus security administrator');
      if (res.success) {
        setActionSuccess(`Report status updated to ${status}`);
        loadLostItems();
        setTimeout(() => setActionSuccess(''), 3000);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Delete this lost item report from the system database?')) {
      try {
        await lostItemService.delete(id);
        setActionSuccess('Lost item report deleted.');
        loadLostItems();
        setTimeout(() => setActionSuccess(''), 3000);
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to delete report');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <AlertCircle className="w-6 h-6 text-rose-500" />
            <span>Campus Lost Items Directory</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage all missing belongings reported by students, inspect student records, and resolve reports.
          </p>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3.5 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* FILTER CONTROLS */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search item, code, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto"
          >
            <option value="">All Statuses</option>
            <option value="LOST">LOST</option>
            <option value="FOUND_MATCH">FOUND MATCH</option>
            <option value="RECOVERED">RECOVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="py-20 flex justify-center items-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-700">No Reports Found</h3>
          <p className="text-xs text-slate-400">No lost items match the search query.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Item Code</th>
                  <th className="py-3 px-4">Item Name</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Reporting Student</th>
                  <th className="py-3 px-4">Date Lost</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">{item.itemCode}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{item.itemName}</div>
                      <div className="text-[10px] text-slate-400">{item.category?.categoryName}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{item.location}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{item.reportedBy?.fullName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {item.reportedBy?.registrationNumber} • {item.reportedBy?.email}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">{item.dateLost}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          item.status === 'LOST'
                            ? 'bg-rose-100 text-rose-800'
                            : item.status === 'RECOVERED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'FOUND_MATCH'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      {item.status === 'LOST' && (
                        <button
                          onClick={() => handleStatusUpdate(item.id, 'RECOVERED')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-[10px]"
                        >
                          Mark Recovered
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
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

