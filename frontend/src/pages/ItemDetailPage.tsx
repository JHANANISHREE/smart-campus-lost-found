import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Send,
  X
} from 'lucide-react';
import { foundItemService, claimService } from '../services/api';
import { FoundItem } from '../types';
import { useAuth } from '../context/AuthContext';

export const ItemDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [item, setItem] = useState<FoundItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Claim Modal State
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [claimDescription, setClaimDescription] = useState('');
  const [identifyingDetails, setIdentifyingDetails] = useState('');
  const [submittingClaim, setSubmittingClaim] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [claimError, setClaimError] = useState('');

  useEffect(() => {
    if (id) {
      loadItemDetails(Number(id));
    }
  }, [id]);

  const loadItemDetails = async (itemId: number) => {
    try {
      setLoading(true);
      const res = await foundItemService.getById(itemId);
      if (res.success && res.data) {
        setItem(res.data);
      } else {
        setError('Item details not found.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load item information.');
    } finally {
      setLoading(false);
    }
  };

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;

    if (!claimDescription.trim() || !identifyingDetails.trim()) {
      setClaimError('Please provide both an explanation and distinct identifying details.');
      return;
    }

    setSubmittingClaim(true);
    setClaimError('');

    try {
      const res = await claimService.submit({
        foundItemId: item.id,
        claimDescription: claimDescription.trim(),
        identifyingDetails: identifyingDetails.trim(),
      });

      if (res.success) {
        setClaimSuccess(true);
        setTimeout(() => {
          setClaimModalOpen(false);
          setClaimSuccess(false);
          navigate('/user/my-claims');
        }, 2000);
      }
    } catch (err: any) {
      setClaimError(err.response?.data?.message || 'Failed to submit ownership claim. Please try again.');
    } finally {
      setSubmittingClaim(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-800">{error || 'Item Not Found'}</h2>
        <Link
          to="/browse"
          className="inline-flex items-center text-xs font-semibold text-indigo-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Browse Items
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/browse"
          className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          <span>Back to Catalog</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-2">
        {/* Item Image Showcase */}
        <div className="relative bg-slate-100 min-h-[340px] md:min-h-[460px] flex items-center justify-center overflow-hidden">
          <img
            src={item.imageUrl || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800&auto=format&fit=crop'}
            alt={item.itemName}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 backdrop-blur-md text-slate-800 shadow">
              {item.category?.categoryName}
            </span>
          </div>
          <div className="absolute top-4 right-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold shadow ${
                item.status === 'AVAILABLE'
                  ? 'bg-teal-500 text-white'
                  : item.status === 'HANDED_OVER'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-500 text-white'
              }`}
            >
              {item.status}
            </span>
          </div>
        </div>

        {/* Item Details Information */}
        <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span className="bg-slate-100 px-2.5 py-1 rounded-lg font-semibold text-slate-700">
                {item.itemCode}
              </span>
              <span>Reported on {new Date(item.createdAt).toLocaleDateString()}</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {item.itemName}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {item.description}
            </p>

            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center space-x-2 text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="font-semibold text-slate-800">Found Location:</span>
                <span>{item.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-600">
                <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="font-semibold text-slate-800">Date Found:</span>
                <span>{item.dateFound}</span>
              </div>
              {item.timeFound && (
                <div className="flex items-center space-x-2 text-slate-600">
                  <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="font-semibold text-slate-800">Approximate Time:</span>
                  <span>{item.timeFound}</span>
                </div>
              )}
            </div>

            {/* Privacy Protection Note */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-[11px] text-slate-500 flex items-start space-x-2">
              <Lock className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
              <span>
                To prevent fraudulent claims, the reporting student's personal details and unique item characteristics are hidden from public display.
              </span>
            </div>
          </div>

          {/* Action Button: Claim Item */}
          <div className="pt-4 border-t border-slate-100">
            {item.status === 'HANDED_OVER' ? (
              <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl text-center text-xs font-semibold flex items-center justify-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>This item has been successfully recovered by its owner.</span>
              </div>
            ) : isAuthenticated ? (
              <button
                onClick={() => setClaimModalOpen(true)}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold text-xs tracking-wide shadow-md shadow-teal-500/20 transition-all flex items-center justify-center space-x-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>This is My Item - Submit Ownership Claim</span>
              </button>
            ) : (
              <Link
                to={`/user/login?redirect=/items/${item.id}`}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs tracking-wide text-center block transition-all"
              >
                Sign In with Student ID to Claim
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* CLAIM SUBMISSION MODAL */}
      {claimModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setClaimModalOpen(false)}
              className="absolute top-5 right-5 p-1 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Submit Ownership Claim</h3>
                <p className="text-xs text-slate-500">{item.itemCode} - {item.itemName}</p>
              </div>
            </div>

            {claimSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">Claim Registered Successfully!</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Your claim has been submitted to Campus Security for verification. Redirecting to your claims list...
                </p>
              </div>
            ) : (
              <form onSubmit={handleClaimSubmit} className="space-y-4">
                {claimError && (
                  <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">
                    {claimError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Explain Why This Item Belongs to You <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe where and when you misplaced it, context, etc..."
                    value={claimDescription}
                    onChange={(e) => setClaimDescription(e.target.value)}
                    required
                    className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Unique Characteristics / Identifying Details <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide secret details like serial numbers, stickers, scratches, case brand, wallpaper, or engraved initials..."
                    value={identifyingDetails}
                    onChange={(e) => setIdentifyingDetails(e.target.value)}
                    required
                    className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  ></textarea>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Campus security will compare these proofs against physical records before granting approval.
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setClaimModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingClaim}
                    className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-teal-600/20 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submittingClaim ? 'Submitting...' : 'Confirm & Submit Claim'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

