import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  PlusCircle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Compass,
  ArrowRight,
  Sparkles,
  MapPin,
  Tag,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { foundItemService, lostItemService, categoryService } from '../services/api';
import { FoundItem, LostItem, Category } from '../types';
import { useAuth } from '../context/AuthContext';

export const HomePage: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [recentFound, setRecentFound] = useState<FoundItem[]>([]);
  const [recentLost, setRecentLost] = useState<LostItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      const [foundRes, lostRes, catRes] = await Promise.all([
        foundItemService.getRecent(),
        lostItemService.getRecent(),
        categoryService.getAll(),
      ]);

      if (foundRes.success) setRecentFound(foundRes.data || []);
      if (lostRes.success) setRecentLost(lostRes.data || []);
      if (catRes.success) setCategories(catRes.data || []);
    } catch (err) {
      console.error('Failed to load homepage data', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-12 pb-20 lg:pt-20 lg:pb-32">
        {/* Subtle Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-teal-500/15 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-teal-400 text-xs font-semibold shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Smart Campus Belongings Retrieval Network</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Lost Something on Campus?{' '}
              <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-indigo-400 bg-clip-text text-transparent">
                Let's Find It.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto">
              A centralized, verified lost and found platform for college students and faculty.
              Report missing belongings, register found items, and claim ownership securely with campus administration.
            </p>

            {/* Quick Search Bar */}
            <div className="pt-2 max-w-xl mx-auto">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    window.location.href = `/browse?keyword=${encodeURIComponent(searchQuery.trim())}`;
                  }
                }}
                className="flex items-center bg-white rounded-2xl p-1.5 shadow-2xl border border-slate-200"
              >
                <div className="pl-3 text-slate-400">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Search AirPods, ID card, keys, laptop..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-semibold text-xs tracking-wide transition-all shadow-md"
                >
                  Search
                </button>
              </form>
            </div>

            {/* CTA Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <Link
                to="/browse"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-semibold text-sm shadow-lg shadow-teal-500/25 transition-all flex items-center space-x-2"
              >
                <Search className="w-4 h-4" />
                <span>Search Available Items</span>
              </Link>
              <Link
                to={isAuthenticated ? '/user/report-lost' : '/user/login?redirect=/user/report-lost'}
                className="px-6 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-semibold text-sm transition-all flex items-center space-x-2"
              >
                <AlertCircle className="w-4 h-4 text-rose-400" />
                <span>Report Lost Item</span>
              </Link>
              <Link
                to={isAuthenticated ? '/user/report-found' : '/user/login?redirect=/user/report-found'}
                className="px-6 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-semibold text-sm transition-all flex items-center space-x-2"
              >
                <PlusCircle className="w-4 h-4 text-teal-400" />
                <span>Report Found Item</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* STATS COUNTER BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 lg:-mt-16 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80">
          <div className="text-center p-3 border-r border-slate-100 last:border-none">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 block">500+</span>
            <span className="text-xs font-semibold text-slate-500 mt-1 block">Campus Items Logged</span>
          </div>
          <div className="text-center p-3 border-r border-slate-100 last:border-none">
            <span className="text-2xl sm:text-3xl font-extrabold text-teal-600 block">88%</span>
            <span className="text-xs font-semibold text-slate-500 mt-1 block">Recovery Success Rate</span>
          </div>
          <div className="text-center p-3 border-r border-slate-100 last:border-none">
            <span className="text-2xl sm:text-3xl font-extrabold text-indigo-600 block">&lt; 24 Hrs</span>
            <span className="text-xs font-semibold text-slate-500 mt-1 block">Avg Verification Time</span>
          </div>
          <div className="text-center p-3">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 block">100%</span>
            <span className="text-xs font-semibold text-slate-500 mt-1 block">Security Staff Verified</span>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-2">Simple 3-Step Process</h2>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">How Smart Campus Works</h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Engineered to prevent fraudulent claims while ensuring prompt return of items to their rightful student owners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 hover:shadow-md transition-shadow relative">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg mb-5">
              1
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-2">Report Belongings</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Students and campus staff submit details of lost or found items, including location, approximate time, category, and optional photos.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 hover:shadow-md transition-shadow relative">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-lg mb-5">
              2
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-2">Search &amp; Submit Claim</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              When a student spots their missing item, they submit an ownership claim explaining private unique identifying details (e.g. serial numbers or markings).
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 hover:shadow-md transition-shadow relative">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg mb-5">
              3
            </div>
            <h4 className="text-base font-bold text-slate-900 mb-2">Admin Verification &amp; Return</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Campus Security reviews claim proofs, approves genuine claims, and coordinates safe physical handover at the Security Control Desk.
            </p>
          </div>
        </div>
      </section>

      {/* RECENTLY FOUND ITEMS (PUBLIC SHOWCASE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-1">Recently Registered</h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Available Found Belongings</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Check if an item you lost has been handed in and verified by fellow students.
            </p>
          </div>
          <Link
            to="/browse"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
          >
            <span>View All Found Items</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {recentFound.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <p className="text-slate-400 text-sm">No items currently available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentFound.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all group flex flex-col justify-between"
              >
                <div>
                  {/* Item Image */}
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <img
                      src={item.imageUrl || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop'}
                      alt={item.itemName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-md text-slate-800 shadow">
                        {item.category?.categoryName || 'General'}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-500 text-white shadow">
                        AVAILABLE
                      </span>
                    </div>
                  </div>

                  {/* Item Info */}
                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-mono font-medium text-slate-500">{item.itemCode}</span>
                      <span>{item.dateFound}</span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {item.itemName}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                    <div className="flex items-center space-x-1.5 text-xs text-slate-600 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="p-5 pt-0 border-t border-slate-100 mt-2">
                  <Link
                    to={`/items/${item.id}`}
                    className="w-full mt-3 py-2 px-3 rounded-xl bg-slate-50 hover:bg-indigo-50 text-indigo-600 font-semibold text-xs text-center block transition-colors"
                  >
                    View Details &amp; Claim →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CATEGORIES SECTION */}
      <section className="bg-slate-100/70 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-1">Browse by Category</h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Belongings Categories</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Filter by specific category of campus belongings to quickly pinpoint lost items.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/browse?categoryId=${cat.id}`}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-indigo-50 text-slate-700 group-hover:text-indigo-600 flex items-center justify-center font-bold text-sm mb-3 transition-colors">
                  <Tag className="w-5 h-5" />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {cat.categoryName}
                </h4>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-1">
                  {cat.description || 'Campus items'}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SAFETY & VERIFICATION NOTICE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl relative z-10 space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-500/30">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Campus Security Integrity Assurance</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Anti-Fraud &amp; Ownership Verification Guarantee
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Every found item is safely cataloged. Private identification numbers and concealed marks are withheld from public view and strictly verified by Security staff before item handover.
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>Student ID Verification</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>Immutable Item Audit Trail</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>Admin Authorization Check</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

