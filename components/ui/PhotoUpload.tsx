'use client';

import { useState, useRef, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface PhotoUploadProps {
  currentPhoto?: string;
  onPhotoChange: (photoPath: string | null) => void;
  contactName?: string;
  className?: string;
}

export default function PhotoUpload({ 
  currentPhoto, 
  onPhotoChange, 
  contactName = '',
  className = '' 
}: PhotoUploadProps) {
  const { isContributor } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>('');
  const [preview, setPreview] = useState<string>(currentPhoto || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleFileUpload = useCallback(async (file: File) => {
    if (!isContributor) return;

    setError('');
    setIsUploading(true);

    try {
      // Validate file
      const maxSize = 5 * 1024 * 1024; // 5MB
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
      }

      if (file.size > maxSize) {
        throw new Error('File too large. Maximum size is 5MB.');
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload file
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/contacts/upload-photo', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      onPhotoChange(result.filePath);
    } catch (error) {
      console.error('Photo upload error:', error);
      setError(error instanceof Error ? error.message : 'Upload failed');
      setPreview(currentPhoto || '');
    } finally {
      setIsUploading(false);
    }
  }, [isContributor, currentPhoto, onPhotoChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (isContributor) {
      setIsDragging(true);
    }
  }, [isContributor]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (!isContributor) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [isContributor, handleFileUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleClick = useCallback(() => {
    if (isContributor && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [isContributor]);

  const handleRemovePhoto = useCallback(() => {
    if (isContributor) {
      setPreview('');
      onPhotoChange(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [isContributor, onPhotoChange]);

  const initials = generateInitials(contactName);

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      {/* Photo Display/Upload Area */}
      <div
        className={`relative w-32 h-32 rounded-full overflow-hidden border-4 transition-all duration-300 ${
          isDragging 
            ? 'border-primary-400 bg-primary-50' 
            : 'border-slate-200 hover:border-slate-300'
        } ${isContributor ? 'cursor-pointer' : 'cursor-default'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt={contactName || 'Contact photo'}
              className="w-full h-full object-cover"
            />
            {isContributor && (
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity duration-200 flex items-center justify-center">
                <div className="text-white text-sm font-medium opacity-0 hover:opacity-100 transition-opacity duration-200">
                  Change Photo
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
            {contactName ? (
              <span className="text-3xl font-bold text-slate-600">{initials}</span>
            ) : (
              <div className="text-center">
                <div className="w-12 h-12 bg-slate-300 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-slate-600 text-lg">📷</span>
                </div>
                {isContributor && (
                  <div className="text-xs text-slate-500">
                    {isDragging ? 'Drop photo here' : 'Click or drag photo'}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        )}
      </div>

      {/* Controls */}
      {isContributor && (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleClick}
            disabled={isUploading}
            className="px-3 py-1 text-xs bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-all duration-300 disabled:opacity-50"
          >
            {isUploading ? 'Uploading...' : preview ? 'Change' : 'Upload'}
          </button>
          {preview && (
            <button
              type="button"
              onClick={handleRemovePhoto}
              disabled={isUploading}
              className="px-3 py-1 text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-all duration-300 disabled:opacity-50"
            >
              Remove
            </button>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Error message */}
      {error && (
        <div className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg max-w-sm text-center">
          {error}
        </div>
      )}

      {/* Helper text */}
      {isContributor && !error && (
        <div className="text-xs text-slate-500 text-center max-w-sm">
          Drag and drop a photo here, or click to browse.
          <br />
          JPEG, PNG, WebP up to 5MB.
        </div>
      )}
    </div>
  );
}