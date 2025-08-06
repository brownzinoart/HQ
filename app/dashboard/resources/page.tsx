'use client';

import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: string;
  url: string;
  createdAt: string;
  _count: {
    activities: number;
  };
}

export default function ResourcesPage() {
  const { isViewer, isContributor } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call - replace with actual API endpoint
    setTimeout(() => {
      setResources([
        {
          id: '1',
          title: 'Design System Guidelines',
          description: 'Comprehensive guide for maintaining consistent design across all products',
          type: 'Documentation',
          url: 'https://example.com/design-system',
          createdAt: '2024-01-15T10:00:00Z',
          _count: { activities: 5 }
        },
        {
          id: '2',
          title: 'API Reference',
          description: 'Complete API documentation for developers',
          type: 'Technical',
          url: 'https://api.hedgehox.com/docs',
          createdAt: '2024-01-10T09:00:00Z',
          _count: { activities: 12 }
        },
        {
          id: '3',
          title: 'Brand Assets',
          description: 'Logos, colors, and brand guidelines',
          type: 'Brand',
          url: 'https://brand.hedgehox.com',
          createdAt: '2024-01-05T14:30:00Z',
          _count: { activities: 3 }
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Documentation': return 'bg-blue-100 text-blue-700';
      case 'Technical': return 'bg-purple-100 text-purple-700';
      case 'Brand': return 'bg-pink-100 text-pink-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Documentation': return 'DOC';
      case 'Technical': return 'TECH';
      case 'Brand': return 'BRAND';
      default: return 'FILE';
    }
  };

  return (
    <div className="space-y-10">
      {/* Hero Header */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold gradient-text mb-4">
          Resources
        </h1>
        <p className="text-slate-600 text-xl max-w-2xl mx-auto">
          {isViewer 
            ? "Your resource library and documentation hub" 
            : "Organize and share important documents and links"
          }
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-6 text-slate-500 text-lg">Loading resources...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Action Bar */}
          {isContributor && (
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                <button className="btn-primary hover-lift">
                  Add Resource
                </button>
                <button className="btn-outline hover-lift">
                  Import from URL
                </button>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 text-sm bg-white/60 hover:bg-white/80 rounded-xl transition-all duration-300 hover-lift">
                  All Types
                </button>
                <button className="px-4 py-2 text-sm text-slate-600 hover:bg-white/40 rounded-xl transition-all duration-300">
                  Documentation
                </button>
                <button className="px-4 py-2 text-sm text-slate-600 hover:bg-white/40 rounded-xl transition-all duration-300">
                  Technical
                </button>
                <button className="px-4 py-2 text-sm text-slate-600 hover:bg-white/40 rounded-xl transition-all duration-300">
                  Brand
                </button>
              </div>
            </div>
          )}

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.length > 0 ? (
              resources.map((resource) => (
                <div key={resource.id} className="card hover-lift group">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/60 rounded-xl flex items-center justify-center text-xs font-bold text-slate-600 group-hover:scale-110 transition-transform duration-300">
                          {getTypeIcon(resource.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 group-hover:text-primary-700 transition-colors">
                            {resource.title}
                          </h3>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTypeColor(resource.type)}`}>
                            {resource.type}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {resource.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/20">
                      <div className="text-xs text-slate-400">
                        {resource._count.activities} references
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 text-xs bg-white/60 hover:bg-white/80 rounded-lg transition-all duration-300 font-medium">
                          View
                        </button>
                        {isContributor && (
                          <button className="px-3 py-1 text-xs bg-primary-100 hover:bg-primary-200 text-primary-700 rounded-lg transition-all duration-300 font-medium">
                            Edit
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="w-12 h-12 bg-primary-200 rounded-xl"></div>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">No resources yet</h3>
                <p className="text-slate-600 mb-6">Start building your resource library</p>
                {isContributor && (
                  <button className="btn-primary hover-lift">
                    Add First Resource
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="metric-card text-center hover-lift group">
              <div className="relative z-10">
                <div className="text-3xl font-bold text-primary-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                  {resources.length}
                </div>
                <div className="text-slate-600 font-medium">Total Resources</div>
              </div>
            </div>
            <div className="metric-card text-center hover-lift group">
              <div className="relative z-10">
                <div className="text-3xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                  {resources.filter(r => r.type === 'Documentation').length}
                </div>
                <div className="text-slate-600 font-medium">Documentation</div>
              </div>
            </div>
            <div className="metric-card text-center hover-lift group">
              <div className="relative z-10">
                <div className="text-3xl font-bold text-purple-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                  {resources.filter(r => r.type === 'Technical').length}
                </div>
                <div className="text-slate-600 font-medium">Technical</div>
              </div>
            </div>
            <div className="metric-card text-center hover-lift group">
              <div className="relative z-10">
                <div className="text-3xl font-bold text-pink-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                  {resources.filter(r => r.type === 'Brand').length}
                </div>
                <div className="text-slate-600 font-medium">Brand Assets</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}