import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  Upload,
  Calendar,
  Clock,
  MapPin,
  Tag,
  CheckCircle2,
  Image as ImageIcon,
  X
} from 'lucide-react';
import { lostItemService, categoryService, uploadService } from '../../services/api';
import { Category } from '../../types';

export const ReportLostPage: React.FC = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [itemName, setItemName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [dateLost, setDateLost] = useState(new Date().toISOString().split('T')[0]);
  const [timeLost, setTimeLost] = useState('');
  const [location, setLocation] = useState('');
  const [identifyingDetails, setIdentifyingDetails] = useState('');
  const [contactPreference, setContactPreference] = useState('EMAIL');

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await categoryService.getAll();
      if (res.success && res.data.length > 0) {
        setCategories(res.data);
        setCategoryId(String(res.data[0].id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!itemName.trim() || !categoryId || !description.trim() || !location.trim() || !dateLost) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    setSubmitting(true);
    try {
      let finalImageUrl = '';

      // Upload image if selected
      if (imageFile) {
        setUploadingImage(true);
        const uploadRes = await uploadService.uploadImage(imageFile);
        if (uploadRes.success && uploadRes.data) {
          finalImageUrl = uploadRes.data.imageUrl;
        }
        setUploadingImage(false);
      }

      const res = await lostItemService.create({
        itemName: itemName.trim(),
        categoryId: Number(categoryId),
        description: description.trim(),
        dateLost,
        timeLost: timeLost.trim(),
        location: location.trim(),
        imageUrl: finalImageUrl || undefined,
        identifyingDetails: identifyingDetails.trim() || undefined,
        contactPreference,
      });

      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/user/my-lost');
        }, 1500);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit lost item report. Please check your inputs.');
    } finally {
      setSubmitting(false);
      setUploadingImage(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
          <AlertCircle className="w-6 h-6 text-rose-500" />
          <span>Report a Lost Item</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Provide complete details of what you misplaced so campus security and fellow students can help locate it.
        </p>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 flex items-center space-x-2 text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>Report successfully published! Redirecting to your reports...</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 text-rose-700 rounded-2xl border border-rose-200 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Item Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Item Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Space Grey Apple MacBook Air M2 in grey felt sleeve"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          {/* Category & Contact Preference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-700 font-medium"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.categoryName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Preferred Contact Channel
              </label>
              <select
                value={contactPreference}
                onChange={(e) => setContactPreference(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-700 font-medium"
              >
                <option value="EMAIL">College Email</option>
                <option value="PHONE">Phone Number</option>
                <option value="SECURITY_DESK">Campus Security Desk Only</option>
              </select>
            </div>
          </div>

          {/* Date Lost & Approximate Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Date Lost <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="date"
                  required
                  value={dateLost}
                  onChange={(e) => setDateLost(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Approximate Time
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="e.g. 15:30 or After lunch"
                  value={timeLost}
                  onChange={(e) => setTimeLost(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Where Was It Misplaced? <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                placeholder="e.g. Computer Lab 3 (Turing Hall) or Main Library 2nd Floor"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              General Item Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="Color, brand, visible features, cover color..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
            ></textarea>
          </div>

          {/* Secret Identifying details */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Private Identifying Details (Confidential)
            </label>
            <textarea
              rows={2}
              placeholder="Serial numbers, lock code, specific stickers, hidden marks (Kept private for verification)..."
              value={identifyingDetails}
              onChange={(e) => setIdentifyingDetails(e.target.value)}
              className="w-full p-3 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
            ></textarea>
          </div>

          {/* Image Upload with Preview */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Item Photograph (Optional)
            </label>
            {imagePreview ? (
              <div className="relative w-40 h-40 rounded-2xl overflow-hidden border border-slate-200">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-slate-900/80 text-white rounded-full hover:bg-slate-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-slate-200 hover:border-rose-400 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50">
                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-xs font-semibold text-slate-700">Click to upload item photo</span>
                <span className="text-[10px] text-slate-400 mt-1">PNG, JPG, or WEBP up to 10MB</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Submit button */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || uploadingImage}
              className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 disabled:opacity-50 transition-all flex items-center space-x-1.5"
            >
              <span>{submitting ? 'Registering Report...' : 'Publish Lost Item Report'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

