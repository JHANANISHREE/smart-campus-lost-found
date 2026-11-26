import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  AlertCircle,
  Send,
  Building,
  Check,
  X
} from 'lucide-react';
import { adminService } from '../../services/api';
import { Claim, ClaimStatus } from '../../types';

export const ManageClaimsPage: React.FC = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<ClaimStatus | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [reviewRemarks, setReviewRemarks] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  useEffect(() => {
    loadClaims();
  }, [selectedStatus, searchQuery]);

  const loadClaims = async () => {
    try {
      setLoading(true);
      const res = await adminService.getClaims({
        status: (selectedStatus as ClaimStatus) || undefined,
        search: searchQuery.trim() || undefined,
        size: 50,
      });
      if (res.success && res.data) {
        setClaims(res.data.content);
      }
    } catch (err) {
      console.error('Failed to load claims', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (claimId: number) => {
    setActionLoading(true);
    try {
      const remarks = reviewRemarks.trim() || 'Verified ownership proof. Item ready for collection at Security Desk Room 102.';
      const res = await adminService.approveClaim(claimId, remarks);
      if (res.success) {
        setActionSuccess('Claim approved successfully. Notification dispatched to student.');
        setSelectedClaim(null);
        setReviewRemarks('');
        loadClaims();
        setTimeout(() => setActionSuccess(''), 3500);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to approve claim');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (claimId: number) => {
    if (!reviewRemarks.trim()) {
      alert('Please provide verification rejection remarks explaining why the claim was declined.');
      return;
    }

    setActionLoading(true);
    try {
      const res = await adminService.rejectClaim(claimId, reviewRemarks.trim());
      if (res.success) {
        setActionSuccess('Claim rejected. Notification sent to student.');
        setSelectedClaim(null);
        setReviewRemarks('');
        loadClaims();
        setTimeout(() => setActionSuccess(''), 3500);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to reject claim');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCompleteHandover = async (claimId: number) => {
    if (window.confirm('Confirm that the verified student has physically collected this item?')) {
      setActionLoading(true);
      try {
        const res = await adminService.completeClaim(claimId, 'Physically handed over at Security Desk Room 102.');
        if (res.success) {
          setActionSuccess('Handover completed! Item marked as successfully recovered.');
          setSelectedClaim(null);
          loadClaims();
          setTimeout(() => setActionSuccess(''), 3500);
        }
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to complete handover');
      } finally {
        setActionLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-indigo-600" />
            <span>Ownership Claim Verification Management</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review student ownership claims, verify concealed item traits, and authorize collection.
          </p>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search claimant, reg no, claim ID..."
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
            <option value="">All Claim Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="UNDER_REVIEW">UNDER REVIEW</option>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>
        </div>
      </div>

      {/* CLAIMS TABLE */}
      {loading ? (
        <div className="py-20 flex justify-center items-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : claims.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 space-y-2">
          <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">No Claims Found</h3>
          <p className="text-xs text-slate-400">No claims match the active status or search query.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4">Claim Code</th>
                  <th className="py-3.5 px-4">Found Item</th>
                  <th className="py-3.5 px-4">Claimant Student</th>
                  <th className="py-3.5 px-4">Submitted At</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {claims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                      {claim.claimCode}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{claim.foundItem?.itemName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {claim.foundItem?.itemCode} • {claim.foundItem?.location}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{claim.claimedBy?.fullName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {claim.claimedBy?.registrationNumber} • {claim.claimedBy?.department}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                      {new Date(claim.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
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
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5">
                      <button
                        onClick={() => {
                          setSelectedClaim(claim);
                          setReviewRemarks(claim.adminRemarks || '');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] transition-colors"
                      >
                        Inspect Proof
                      </button>

                      {claim.claimStatus === 'APPROVED' && (
                        <button
                          onClick={() => handleCompleteHandover(claim.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors shadow-sm"
                        >
                          Mark Handed Over
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* INSPECT & VERIFY MODAL */}
      {selectedClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto space-y-6">
            <button
              onClick={() => setSelectedClaim(null)}
              className="absolute top-5 right-5 p-1 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Claim Inspection: {selectedClaim.claimCode}
                </h3>
                <p className="text-xs text-slate-500">
                  Comparing claimant ownership testimony against catalog records.
                </p>
              </div>
            </div>

            {/* Side-by-side or stacked details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Item Info */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider block">
                  Found Item Information
                </span>
                <p><span className="text-slate-500">Name:</span> <strong className="text-slate-800">{selectedClaim.foundItem?.itemName}</strong></p>
                <p><span className="text-slate-500">Code:</span> <code className="font-mono text-slate-700">{selectedClaim.foundItem?.itemCode}</code></p>
                <p><span className="text-slate-500">Location:</span> {selectedClaim.foundItem?.location}</p>
                <p><span className="text-slate-500">Date Found:</span> {selectedClaim.foundItem?.dateFound}</p>
                <div className="pt-2 border-t border-slate-200 text-slate-700">
                  <span className="font-semibold block text-[11px] text-amber-800">Secret Physical Traits (Security Record):</span>
                  <p className="mt-0.5 bg-amber-50 p-2 rounded-lg border border-amber-200 text-amber-900 font-mono text-[11px]">
                    {selectedClaim.foundItem?.identifyingDetails || 'No private traits specified by finder.'}
                  </p>
                </div>
              </div>

              {/* Claimant Info */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider block">
                  Claimant Identity
                </span>
                <p><span className="text-slate-500">Student:</span> <strong className="text-slate-800">{selectedClaim.claimedBy?.fullName}</strong></p>
                <p><span className="text-slate-500">Reg No:</span> <code className="font-mono text-slate-700">{selectedClaim.claimedBy?.registrationNumber}</code></p>
                <p><span className="text-slate-500">Email:</span> {selectedClaim.claimedBy?.email}</p>
                <p><span className="text-slate-500">Dept:</span> {selectedClaim.claimedBy?.department}</p>
                <p><span className="text-slate-500">Phone:</span> {selectedClaim.claimedBy?.phoneNumber || 'N/A'}</p>
              </div>
            </div>

            {/* Claimant Proof Testimony */}
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200/80 text-xs space-y-2">
                <span className="font-bold text-indigo-950 uppercase text-[10px] tracking-wider block">
                  Claimant's Written Explanation:
                </span>
                <p className="text-slate-700 leading-relaxed font-medium italic">
                  "{selectedClaim.claimDescription}"
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-200/80 text-xs space-y-2">
                <span className="font-bold text-teal-950 uppercase text-[10px] tracking-wider block">
                  Claimant's Secret Ownership Proof Details:
                </span>
                <p className="text-slate-800 leading-relaxed font-semibold">
                  "{selectedClaim.identifyingDetails}"
                </p>
              </div>
            </div>

            {/* Admin Remarks Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Administrative Decision Remarks / Feedback for Student
              </label>
              <textarea
                rows={2}
                placeholder="Remarks to be communicated to student (e.g. Approved: Please visit Desk 102 with ID card)..."
                value={reviewRemarks}
                onChange={(e) => setReviewRemarks(e.target.value)}
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              ></textarea>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedClaim(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>

              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleReject(selectedClaim.id)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs disabled:opacity-50 transition-colors flex items-center space-x-1"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Reject Claim</span>
              </button>

              <button
                type="button"
                disabled={actionLoading}
                onClick={() => handleApprove(selectedClaim.id)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs disabled:opacity-50 transition-colors flex items-center space-x-1 shadow-md shadow-emerald-600/20"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approve &amp; Authorize Handover</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

