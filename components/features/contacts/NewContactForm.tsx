'use client';

import { useState, useCallback } from 'react';
import PhotoUpload from '@/components/ui/PhotoUpload';

interface NewContactFormProps {
  onSubmit: (contactData: ContactFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  linkedinUrl: string;
  leadStatus: string;
  notes: string;
  photo: string | null;
}

export default function NewContactForm({ onSubmit, onCancel, loading = false }: NewContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    linkedinUrl: '',
    leadStatus: 'COLD',
    notes: '',
    photo: null,
  });

  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [isSaving, setIsSaving] = useState(false);

  const validateForm = useCallback(() => {
    const newErrors: Partial<ContactFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.linkedinUrl && !formData.linkedinUrl.includes('linkedin.com')) {
      newErrors.linkedinUrl = 'Please enter a valid LinkedIn URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleInputChange = useCallback((field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const handlePhotoChange = useCallback((photoPath: string | null) => {
    setFormData(prev => ({ ...prev, photo: photoPath }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsSaving(true);
      await onSubmit(formData);
    } catch (error) {
      console.error('Error creating contact:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (!isSaving) {
      onCancel();
    }
  };

  const isFormValid = formData.name.trim().length > 0;

  return (
    <div className="card h-full">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center">
          <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-green-600 rounded-full mr-3 shadow-sm"></div>
          Add New Contact
        </h2>
        <button
          onClick={handleCancel}
          disabled={isSaving}
          className="p-2 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 max-h-[calc(100vh-300px)] overflow-y-auto scroll-area">
        {/* Photo Section */}
        <div className="text-center">
          <PhotoUpload
            currentPhoto={formData.photo || undefined}
            onPhotoChange={handlePhotoChange}
            contactName={formData.name}
            className="mb-4"
          />
          <p className="text-sm text-slate-600">
            A photo helps personalize your business relationships
          </p>
        </div>

        {/* Basic Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center">
            <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
            Basic Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 ${
                  errors.name ? 'border-red-300 bg-red-50' : 'border-slate-200 focus:border-transparent'
                }`}
                placeholder="Enter full name"
                disabled={isSaving}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Company
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                placeholder="Company name"
                disabled={isSaving}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Position / Title
              </label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                placeholder="Job title or position"
                disabled={isSaving}
              />
            </div>
          </div>
        </div>

        {/* Contact Methods */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
            Contact Methods
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 ${
                  errors.email ? 'border-red-300 bg-red-50' : 'border-slate-200 focus:border-transparent'
                }`}
                placeholder="email@company.com"
                disabled={isSaving}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                placeholder="+1 (555) 123-4567"
                disabled={isSaving}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                LinkedIn Profile
              </label>
              <input
                type="url"
                value={formData.linkedinUrl}
                onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 ${
                  errors.linkedinUrl ? 'border-red-300 bg-red-50' : 'border-slate-200 focus:border-transparent'
                }`}
                placeholder="https://linkedin.com/in/username"
                disabled={isSaving}
              />
              {errors.linkedinUrl && (
                <p className="mt-1 text-sm text-red-600">{errors.linkedinUrl}</p>
              )}
            </div>
          </div>
        </div>

        {/* Business Context */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center">
            <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
            Business Context
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Lead Status
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'COLD', label: 'Cold Lead', color: 'blue', desc: 'Initial contact' },
                  { value: 'WARM', label: 'Warm Lead', color: 'amber', desc: 'Showing interest' },
                  { value: 'HOT', label: 'Hot Lead', color: 'red', desc: 'Ready to engage' }
                ].map(status => (
                  <button
                    key={status.value}
                    type="button"
                    onClick={() => handleInputChange('leadStatus', status.value)}
                    disabled={isSaving}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                      formData.leadStatus === status.value
                        ? `border-${status.color}-400 bg-${status.color}-50`
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      <div className={`w-3 h-3 bg-${status.color}-400 rounded-full mr-2`}></div>
                      <span className="font-medium text-slate-900">{status.label}</span>
                    </div>
                    <p className="text-xs text-slate-600">{status.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Initial Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 resize-none"
                placeholder="How did you meet? What's the opportunity? Any relevant context..."
                disabled={isSaving}
              />
            </div>
          </div>
        </div>
      </form>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
        <button
          type="button"
          onClick={handleCancel}
          disabled={isSaving}
          className="px-6 py-3 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all duration-300 font-medium disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!isFormValid || isSaving || loading}
          className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-all duration-300 font-medium disabled:opacity-50 flex items-center gap-2"
        >
          {isSaving || loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Creating Contact...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Contact
            </>
          )}
        </button>
      </div>
    </div>
  );
}