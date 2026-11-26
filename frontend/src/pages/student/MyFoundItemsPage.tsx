import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  PlusCircle,
  MapPin,
  Calendar,
  Trash2,
  Users,
  Eye,
  Check
} from 'lucide-react';
import { foundItemService, claimService } from '../../services/api';
import { FoundItem, Claim, ItemStatus } from '../../types';

export const MyFoundItemsPage: React.FC = () => {
  const [items, setItems] = useState<FoundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItemClaims, setSelectedItemClaims] = useState<{ [key: number]: Claim[] }>({});
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    loadMyFoundItems();
  }, []);

  const loadMyFoundItems = async () => {
    try {
      setLoading(true);
      const res = await foundItemService.getMyItems();
      if (res.success && res.data) {
        setItems(res.data.content);
        // Load claims count for items
        res.data.content.forEach((item) => loadClaimsForItem(item.id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadClaimsForItem = async (itemId: number) => {
    try {
      const res = await claimService.getClaimsForItem(itemId);
      if (res.success && res.data) {
        setSelectedItemClaims((prev) => ({ ...prev, [itemId]: res.data }));
      }
    } catch (err) {
      // User may not be authorized to view other claims if not admin/reporter
    }
  };

  const handleStatusUpdate = async (id: number, status: ItemStatus) => {
    try {
      const res = await foundItemService.updateStatus(id, status, 'Handed over by student');
      if (res.success) {
        setActionMessage(`Status updated to ${status}`);
        loadMyFoundItems();
        setTimeout(() => setActionMessage(''), 3000);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this found item listing?')) {
      try {
        await foundItemService.delete(id);
        setActionMessage('Found item removed successfully');
        loadMyFoundItems();
        setTimeout(() => setActionMessage(''), 3000);
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to delete listing');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <CheckCircle2 className="w-6 h-6 text-teal-600" />
            <span>Belongings I Found &amp; Registered</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage belongings you found on campus and track incoming ownership claim requests.
          </p>
        </div>

        <Link
          to="/user/report-found"
          className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5 w-fit"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Register Another Found Item</span>
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
          <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 space-y-3">
          <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">No Found Items Registered</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You haven't registered any found items. If you pick up lost keys, wallets, or electronics, register them here!
          </p>
          <Link
            to="/user/report-found"
            className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold"
          >
            Register Found Item
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => {
            const claims = selectedItemClaims[item.id] || [];
            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                      <img
                        src={item.imageUrl || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=300&auto=format&fit=crop'}
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
                          {item.dateFound}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status & Quick Action */}
                  <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        item.status === 'AVAILABLE'
                          ? 'bg-teal-100 text-teal-800'
                          : item.status === 'HANDED_OVER'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.status}
                    </span>

                    <div className="flex items-center space-x-2">
                      {item.status !== 'HANDED_OVER' && (
                        <button
                          onClick={() => handleStatusUpdate(item.id, 'HANDED_OVER')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold flex items-center space-x-1"
                          title="Mark Handed Over to Owner"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Mark Returned</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                        title="Delete listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Incoming Claims Badge */}
                {claims.length > 0 && (
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs bg-slate-50 p-3 rounded-2xl">
                    <div className="flex items-center space-x-2 text-indigo-700 font-semibold">
                      <Users className="w-4 h-4" />
                      <span>{claims.length} Student Claim(s) Submitted for this item</span>
                    </div>
                    <span className="text-[11px] text-slate-500 italic">
                      Under review by Campus Security Desk
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

