import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  XCircle,
  MapPin,
  Calendar,
  Building
} from 'lucide-react';
import { claimService } from '../../services/api';
import { Claim } from '../../types';

export const MyClaimsPage: React.FC = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    loadMyClaims();
  }, []);

  const loadMyClaims = async () => {
    try {
      setLoading(true);
      const res = await claimService.getMyClaims();
      if (res.success && res.data) {
        setClaims(res.data.content);
      }
    } catch (err) {
      console.error('Failed to load claims', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClaim = async (id: number) => {
    if (window.confirm('Are you sure you want to cancel this pending claim?')) {
      try {
        await claimService.cancel(id);
        setActionMessage('Claim request cancelled successfully.');
        loadMyClaims();
        setTimeout(() => setActionMessage(''), 3000);
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to cancel claim');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <FileText className="w-6 h-6 text-teal-600" />
            <span>My Ownership Claims</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track verification status, admin feedback, and collection instructions for your misplaced belongings.
          </p>
        </div>

        <Link
          to="/browse"
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5 w-fit"
        >
          <Search className="w-4 h-4 text-teal-400" />
          <span>Browse More Found Items</span>
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
      ) : claims.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 space-y-3">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">No Claims Submitted Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            If you see an item that matches what you misplaced in the campus catalog, submit a claim with your proof of ownership.
          </p>
          <Link
            to="/browse"
            className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold"
          >
            Search Found Items
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {claims.map((claim) => (
            <div
              key={claim.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2.5">
                  <span className="font-mono text-xs font-bold bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700">
                    {claim.claimCode}
                  </span>
                  <span className="text-xs text-slate-400">
                    Submitted: {new Date(claim.submittedAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
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

                  {claim.claimStatus === 'PENDING' && (
                    <button
                      onClick={() => handleCancelClaim(claim.id)}
                      className="px-2.5 py-1 text-xs text-rose-600 hover:bg-rose-50 rounded-lg font-semibold"
                    >
                      Cancel Claim
                    </button>
                  )}
                </div>
              </div>

              {/* Found Item Info */}
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                  <img
                    src={claim.foundItem?.imageUrl || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=300&auto=format&fit=crop'}
                    alt={claim.foundItem?.itemName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900">{claim.foundItem?.itemName}</h3>
                  <p className="text-xs text-slate-500 line-clamp-1">{claim.foundItem?.description}</p>
                  <div className="flex items-center space-x-3 text-[11px] text-slate-500 pt-0.5">
                    <span className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                      {claim.foundItem?.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Submitted Proof summary */}
              <div className="bg-slate-50 p-3.5 rounded-2xl text-xs space-y-1.5 text-slate-600">
                <span className="font-bold text-slate-800 block text-[11px]">Your Claim Explanation:</span>
                <p className="italic">"{claim.claimDescription}"</p>
              </div>

              {/* Admin Remarks Section */}
              {claim.adminRemarks && (
                <div
                  className={`p-4 rounded-2xl text-xs space-y-1.5 border ${
                    claim.claimStatus === 'APPROVED'
                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                      : claim.claimStatus === 'REJECTED'
                      ? 'bg-rose-50/80 border-rose-200 text-rose-900'
                      : 'bg-indigo-50/80 border-indigo-200 text-indigo-900'
                  }`}
                >
                  <div className="flex items-center space-x-2 font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Campus Administration Review Remarks:</span>
                  </div>
                  <p className="leading-relaxed font-medium">{claim.adminRemarks}</p>

                  {claim.claimStatus === 'APPROVED' && (
                    <div className="pt-2 text-[11px] font-semibold text-emerald-800 flex items-center space-x-1.5">
                      <Building className="w-4 h-4 flex-shrink-0" />
                      <span>Collection Point: Security Office Room 102 (Please bring your student ID card).</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

