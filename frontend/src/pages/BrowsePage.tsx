import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  RotateCcw,
  Tag,
  ChevronLeft,
  ChevronRight,
  Eye,
  PlusCircle,
  AlertCircle
} from 'lucide-react';
import { foundItemService, lostItemService, categoryService } from '../services/api';
import { FoundItem, LostItem, Category, ItemStatus } from '../types';

export const BrowsePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState<'FOUND' | 'LOST'>('FOUND');
  const [foundItems, setFoundItems] = useState<FoundItem[]>([]);
  const [lostItems, setLostItems] = useState<LostItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  // Filters state
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [categoryId, setCategoryId] = useState(searchParams.get('categoryId') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadItems();
  }, [activeTab, keyword, categoryId, location, status, page]);

  const loadCategories = async () => {
    try {
      const res = await categoryService.getAll();
      if (res.success) setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadItems = async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        size: 9,
      };
      if (keyword) params.keyword = keyword;
      if (categoryId) params.categoryId = categoryId;
      if (location) params.location = location;
      if (status) params.status = status;

      if (activeTab === 'FOUND') {
        const res = await foundItemService.search(params);
        if (res.success && res.data) {
          setFoundItems(res.data.content);
          setTotalPages(res.data.totalPages);
          setTotalElements(res.data.totalElements);
        }
      } else {
        const res = await lostItemService.search(params);
        if (res.success && res.data) {
          setLostItems(res.data.content);
          setTotalPages(res.data.totalPages);
          setTotalElements(res.data.totalElements);
        }
      }
    } catch (err) {
      console.error('Failed to load items', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setKeyword('');
    setCategoryId('');
    setLocation('');
    setStatus('');
    setPage(0);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Browse Campus Belongings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Search verified items reported across lecture halls, libraries, canteens, and sports complexes.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl w-fit">
          <button
            onClick={() => {
              setActiveTab('FOUND');
              setPage(0);
              setStatus('');
            }}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'FOUND'
                ? 'bg-white text-teal-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Found Items ({activeTab === 'FOUND' ? totalElements : 'Browse'})
          </button>
          <button
            onClick={() => {
              setActiveTab('LOST');
              setPage(0);
              setStatus('');
            }}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'LOST'
                ? 'bg-white text-rose-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Missing / Lost Reports ({activeTab === 'LOST' ? totalElements : 'Browse'})
          </button>
        </div>
      </div>

      {/* FILTER CONTROLS BAR */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Keyword search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by name, code..."
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setPage(0);
              }}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Category filter */}
          <div>
            <select
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                setPage(0);
              }}
              className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 font-medium"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.categoryName}
                </option>
              ))}
            </select>
          </div>

          {/* Location filter */}
          <div>
            <input
              type="text"
              placeholder="Filter by location (e.g. Library, Cafeteria)"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setPage(0);
              }}
              className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Status filter */}
          <div>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(0);
              }}
              className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 font-medium"
            >
              <option value="">All Statuses</option>
              {activeTab === 'FOUND' ? (
                <>
                  <option value="AVAILABLE">AVAILABLE</option>
                  <option value="CLAIMED">CLAIMED</option>
                  <option value="HANDED_OVER">HANDED OVER</option>
                </>
              ) : (
                <>
                  <option value="LOST">LOST</option>
                  <option value="FOUND_MATCH">FOUND MATCH</option>
                  <option value="RECOVERED">RECOVERED</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* Clear Filters Button */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Found {totalElements} matching reports</span>
          <button
            onClick={handleClearFilters}
            className="flex items-center space-x-1 text-xs font-semibold text-rose-600 hover:text-rose-800"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* ITEMS LISTING GRID */}
      {loading ? (
        <div className="py-20 flex justify-center items-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : activeTab === 'FOUND' ? (
        foundItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200">
            <Tag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">No Found Items Match Your Query</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Try adjusting your search keywords, location or category filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {foundItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <img
                      src={item.imageUrl || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop'}
                      alt={item.itemName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/95 backdrop-blur-md text-slate-800 shadow">
                        {item.category?.categoryName || 'General'}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold shadow ${
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

                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-mono font-medium text-slate-500">{item.itemCode}</span>
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {item.dateFound}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {item.itemName}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                    <div className="flex items-center space-x-1.5 text-xs text-slate-600 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-100">
                  <Link
                    to={`/items/${item.id}`}
                    className="w-full mt-3 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs text-center block transition-colors"
                  >
                    View Details &amp; Claim Item →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )
      ) : lostItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">No Lost Items Match Your Query</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try resetting your filters or report a new lost item.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {lostItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop'}
                    alt={item.itemName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/95 backdrop-blur-md text-slate-800 shadow">
                      {item.category?.categoryName || 'General'}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold shadow ${
                        item.status === 'LOST'
                          ? 'bg-rose-500 text-white'
                          : item.status === 'RECOVERED'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-indigo-500 text-white'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-mono font-medium text-slate-500">{item.itemCode}</span>
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {item.dateLost}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {item.itemName}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex items-center space-x-1.5 text-xs text-slate-600 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100">
                <div className="text-[11px] text-slate-400 mt-3 flex justify-between items-center">
                  <span>Reported by Student</span>
                  <span className="font-medium text-slate-600">Contact: {item.contactPreference}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-3 pt-6">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 text-slate-700"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-semibold text-slate-600">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 text-slate-700"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

