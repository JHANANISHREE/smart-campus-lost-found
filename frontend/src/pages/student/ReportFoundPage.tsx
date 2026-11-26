import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  Upload,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  X,
  Lock
} from 'lucide-react';
import { foundItemService, categoryService, uploadService } from '../../services/api';
import { Category } from '../../types';

export const ReportFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [itemName, setItemName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [dateFound, setDateFound] = useState(new Date().toISOString().split('T')[0]);
  const [timeFound, setTimeFound] = useState('');
  const [location, setLocation] = useState('');
  const [identifyingDetails, setIdentifyingDetails] = useState('');

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

    if (!itemName.trim() || !categoryId || !description.trim() || !location.trim() || !dateFound) {
      setError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      let finalImageUrl = '';

      if (imageFile) {
        setUploadingImage(true);
        const uploadRes = await uploadService.uploadImage(imageFile);
        if (uploadRes.success && uploadRes.data) {
          finalImageUrl = uploadRes.data.imageUrl;
        }
        setUploadingImage(false);
      }

      const res = await foundItemService.create({
        itemName: itemName.trim(),
        categoryId: Number(categoryId),
        description: description.trim(),
        dateFound,
        timeFound: timeFound.trim(),
        location: location.trim(),
        imageUrl: finalImageUrl || undefined,
        identifyingDetails: identifyingDetails.trim() || undefined,
      });

      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/user/my-found');
        }, 1500);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register found item report.');
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
          <PlusCircle className="w-6 h-6 text-teal-600" />
          <span>Register a Found Item</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Thank you for being a responsible member of the campus community. Register belongings you found to help their rightful owner recover them.
        </p>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 flex items-center space-x-2 text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>Found item registered and published to catalog! Redirecting...</span>
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
              Found Item Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Casio Scientific Calculator or Student ID Card"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-700 font-medium"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.categoryName}
                </option>
              ))}
            </select>
          </div>

          {/* Date & Time Found */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Date Found <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="date"
                  required
                  value={dateFound}
                  onChange={(e) => setDateFound(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                  placeholder="e.g. 11:15 AM or During morning break"
                  value={timeFound}
                  onChange={(e) => setTimeFound(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Found Location */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Found Location on Campus <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                placeholder="e.g. Main Cafeteria Counter 3 or Central Library 2nd Floor"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Public Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="General appearance, brand, colors, condition (Avoid sharing secret identifying details here)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
            ></textarea>
          </div>

          {/* Confidential identifying details */}
          <div>
            <div className="flex items-center space-x-1.5 mb-1">
              <label className="block text-xs font-bold text-slate-700">
                Confidential Ownership Test Details
              </label>
              <Lock className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <textarea
              rows={2}
              placeholder="Unique traits withheld from the public that only the real owner should know (e.g. phone lock screen photo, serial ending digits, engraving)..."
              value={identifyingDetails}
              onChange={(e) => setIdentifyingDetails(e.target.value)}
              className="w-full p-3 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
            ></textarea>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Campus Security will use this to verify claimant submissions before returning the item.
            </span>
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
              <label className="border-2 border-dashed border-slate-200 hover:border-teal-400 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50">
                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-xs font-semibold text-slate-700">Click to upload found item photo</span>
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
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 disabled:opacity-50 transition-all flex items-center space-x-1.5"
            >
              <span>{submitting ? 'Registering...' : 'Register Found Item'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

