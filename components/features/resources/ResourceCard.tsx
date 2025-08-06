'use client';

import { useState } from 'react';
import { PRODUCTS } from '@/lib/constants';

interface Resource {
  id: string;
  title: string;
  description: string | null;
  type: string;
  product: string | null;
  url: string | null;
  filePath: string | null;
  fileName: string | null;
  fileSize: number | null;
  mimeType: string | null;
  version: string | null;
  tags: any;
  downloadCount: number;
  lastAccessed: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    name: string;
    role: string;
  };
  _count: {
    activities: number;
  };
}

interface ResourceCardProps {
  resource: Resource;
  onDownload: (resourceId: string) => void;
  onEdit?: (resource: Resource) => void;
  isContributor: boolean;
}

export default function ResourceCard({ 
  resource, 
  onDownload, 
  onEdit, 
  isContributor 
}: ResourceCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const getTypeIcon = (type: string, mimeType?: string | null) => {
    if (mimeType?.startsWith('image/')) return '🖼️';
    if (mimeType?.startsWith('video/')) return '🎥';
    if (mimeType?.startsWith('audio/')) return '🎵';
    if (mimeType === 'application/pdf') return '📄';
    if (mimeType?.includes('word')) return '📝';
    if (mimeType?.includes('excel') || mimeType?.includes('sheet')) return '📊';
    if (mimeType?.includes('powerpoint') || mimeType?.includes('presentation')) return '📽️';
    if (mimeType?.includes('zip')) return '🗜️';
    
    switch (type) {
      case 'DOCUMENTATION': return '📚';
      case 'ASSETS': return '🎨';
      case 'TEMPLATES': return '📋';
      case 'LEGAL': return '⚖️';
      case 'UPDATES': return '🔄';
      case 'TRAINING': return '🎓';
      default: return '📁';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'DOCUMENTATION': return { bg: 'bg-blue-50', text: 'text-blue-700', badge: 'bg-blue-100' };
      case 'ASSETS': return { bg: 'bg-purple-50', text: 'text-purple-700', badge: 'bg-purple-100' };
      case 'TEMPLATES': return { bg: 'bg-green-50', text: 'text-green-700', badge: 'bg-green-100' };
      case 'LEGAL': return { bg: 'bg-red-50', text: 'text-red-700', badge: 'bg-red-100' };
      case 'UPDATES': return { bg: 'bg-orange-50', text: 'text-orange-700', badge: 'bg-orange-100' };
      case 'TRAINING': return { bg: 'bg-cyan-50', text: 'text-cyan-700', badge: 'bg-cyan-100' };
      default: return { bg: 'bg-slate-50', text: 'text-slate-700', badge: 'bg-slate-100' };
    }
  };

  const getProductColor = (product: string | null) => {
    if (!product) return null;
    const productConfig = PRODUCTS[product as keyof typeof PRODUCTS];
    if (!productConfig) return null;
    
    switch (productConfig.color) {
      case 'blue': return 'border-l-blue-400';
      case 'green': return 'border-l-green-400';
      case 'purple': return 'border-l-purple-400';
      case 'orange': return 'border-l-orange-400';
      case 'teal': return 'border-l-teal-400';
      default: return 'border-l-slate-400';
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleDownload = async () => {
    if (!resource.filePath && !resource.url) return;
    
    setIsLoading(true);
    try {
      // Track download
      await fetch(`/api/resources/${resource.id}/download`, {
        method: 'POST'
      });
      
      // Trigger download
      if (resource.filePath) {
        const link = document.createElement('a');
        link.href = resource.filePath;
        link.download = resource.fileName || resource.title;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (resource.url) {
        window.open(resource.url, '_blank');
      }
      
      onDownload(resource.id);
    } catch (error) {
      console.error('Error downloading resource:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const typeColors = getTypeColor(resource.type);
  const productBorder = getProductColor(resource.product);
  const resourceTags = Array.isArray(resource.tags) ? resource.tags : [];

  return (
    <div className={`card hover-lift group border-l-4 ${productBorder || 'border-l-slate-200'}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-12 h-12 bg-white/80 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300">
              {getTypeIcon(resource.type, resource.mimeType)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 group-hover:text-primary-700 transition-colors mb-1 truncate">
                {resource.title}
              </h3>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${typeColors.badge} ${typeColors.text}`}>
                  {resource.type.replace('_', ' ')}
                </span>
                {resource.version && (
                  <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600 font-medium">
                    v{resource.version}
                  </span>
                )}
                {resource.product && (
                  <span className="text-xs px-2 py-1 rounded-full bg-white/60 text-slate-700 font-medium">
                    {PRODUCTS[resource.product as keyof typeof PRODUCTS]?.name}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {resource.description && (
          <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
            {resource.description}
          </p>
        )}

        {/* Tags */}
        {resourceTags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {resourceTags.slice(0, 3).map((tag: string, index: number) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-md"
              >
                #{tag}
              </span>
            ))}
            {resourceTags.length > 3 && (
              <span className="text-xs px-2 py-1 bg-slate-100 text-slate-500 rounded-md">
                +{resourceTags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* File Info */}
        <div className="flex items-center gap-4 text-xs text-slate-500">
          {resource.fileSize && (
            <span>{formatFileSize(resource.fileSize)}</span>
          )}
          {resource.downloadCount > 0 && (
            <span>{resource.downloadCount} downloads</span>
          )}
          <span>{formatDate(resource.updatedAt)}</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/20">
          <div className="text-xs text-slate-400">
            by {resource.user.name}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              disabled={isLoading}
              className="px-3 py-1.5 text-xs bg-primary-100 hover:bg-primary-200 text-primary-700 rounded-lg transition-all duration-300 font-medium hover-lift disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : resource.filePath ? 'Download' : 'Open'}
            </button>
            {isContributor && onEdit && (
              <button
                onClick={() => onEdit(resource)}
                className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all duration-300 font-medium hover-lift"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}