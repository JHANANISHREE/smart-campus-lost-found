import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  PlusCircle,
  CheckCircle2,
  MapPin,
  Calendar,
  Trash2,
  Check,
  Ban
} from 'lucide-react';
import { lostItemService } from '../../services/api';
import { LostItem, ItemStatus } from '../../types';

export const MyLostItemsPage: React.FC = () => {
  const [items, setItems] = useState<LostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    loadMyLostItems();
  }, []);

  const loadMyLostItems = async () => {
    try {
      setLoading(true);
      const res = await lostItemService.getMyItems();
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
      const res = await lostItemService.updateStatus(id, status, 'Updated by reporting student');
      if (res.success) {
        setActionMessage(`Status updated to ${status}`);
        loadMyLostItems();
        setTimeout(() => setActionMessage(''), 3000);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this lost item report?')) {
      try {
        await lostItemService.delete(id);
        setActionMessage('Report removed successfully');
        loadMyLostItems();
        setTimeout(() => setActionMessage(''), 3000);
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to delete report');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <AlertCircle className="w-6 h-6 text-rose-500" />
            <span>My Missing Belongings Reports</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track and manage lost item reports submitted under your student account.
          </p>
        </div>

        <Link
          to="/user/report-lost"
          className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5 w-fit"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report Another Lost Item</span>
        </Link>
      </div>

      {actionMessage && (
        <div className="p-3.5 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionMessage}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 flex justify-center items-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 space-y-3">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">No Lost Items Reported</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You haven't submitted any missing item reports. If you misplace something on campus, report it here.
          </p>
          <Link
            to="/user/report-lost"
            className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold"
          >
            Report Missing Item
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&auto=format&fit=crop'}
                    alt={item.itemName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      {item.itemCode}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Category: {item.category?.categoryName}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{item.itemName}</h3>
                  <p className="text-xs text-slate-500 line-clamp-1">{item.description}</p>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      {item.location}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      {item.dateLost}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
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

                <div className="flex items-center space-x-2">
                  {item.status === 'LOST' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(item.id, 'RECOVERED')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold flex items-center space-x-1"
                        title="Mark as Recovered"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Recovered</span>
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(item.id, 'CANCELLED')}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-semibold flex items-center space-x-1"
                        title="Cancel Report"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                    title="Delete report"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

