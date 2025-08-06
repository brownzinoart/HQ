'use client';

import { useState, useEffect } from 'react';
import { PRODUCTS } from '@/lib/constants';

interface RecentResource {
  id: string;
  title: string;
  type: string;
  product: string | null;
  version: string | null;
  createdAt: string;
  user: {
    name: string;
  };
}

interface ResourcesHomeTabProps {
  isViewer: boolean;
  isContributor: boolean;
}

export default function ResourcesHomeTab({ isViewer, isContributor }: ResourcesHomeTabProps) {
  const [recentResources, setRecentResources] = useState<RecentResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch recent resources for the home tab
    async function fetchRecentResources() {
      try {
        const response = await fetch('/api/resources?limit=10');
        if (response.ok) {
          const resources = await response.json();
          setRecentResources(resources.slice(0, 10));
        }
      } catch (error) {
        console.error('Error fetching recent resources:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecentResources();
  }, []);

  const getTypeIcon = (type: string) => {
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

  const getProductColor = (product: string | null) => {
    if (!product) return { bg: 'bg-slate-100', text: 'text-slate-700' };
    const productConfig = PRODUCTS[product as keyof typeof PRODUCTS];
    if (!productConfig) return { bg: 'bg-slate-100', text: 'text-slate-700' };
    
    switch (productConfig.color) {
      case 'blue': return { bg: 'bg-blue-100', text: 'text-blue-700' };
      case 'green': return { bg: 'bg-green-100', text: 'text-green-700' };
      case 'purple': return { bg: 'bg-purple-100', text: 'text-purple-700' };
      case 'orange': return { bg: 'bg-orange-100', text: 'text-orange-700' };
      case 'teal': return { bg: 'bg-teal-100', text: 'text-teal-700' };
      default: return { bg: 'bg-slate-100', text: 'text-slate-700' };
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
        <p className="mt-4 text-slate-500">Loading updates...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* Quick Actions (Contributors Only) */}
      {isContributor && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="card hover-lift text-left group border-dashed border-2 border-primary-200 hover:border-primary-300 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <div className="text-lg">📤</div>
              </div>
              <div>
                <div className="font-medium text-slate-900">Upload Resource</div>
                <div className="text-xs text-slate-500">Add new files or links</div>
              </div>
            </div>
          </button>
          
          <button className="card hover-lift text-left group border-dashed border-2 border-secondary-200 hover:border-secondary-300 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <div className="text-lg">🔗</div>
              </div>
              <div>
                <div className="font-medium text-slate-900">Add Link</div>
                <div className="text-xs text-slate-500">External resource link</div>
              </div>
            </div>
          </button>
          
          <button className="card hover-lift text-left group border-dashed border-2 border-slate-200 hover:border-slate-300 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <div className="text-lg">📋</div>
              </div>
              <div>
                <div className="font-medium text-slate-900">Bulk Import</div>
                <div className="text-xs text-slate-500">Multiple files at once</div>
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Recent Activity */}
      <div className="card">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-900">Recent Activity</h3>
          <span className="text-sm text-slate-500">{recentResources.length} recent items</span>
        </div>
        
        <div className="space-y-3">
          {recentResources.length > 0 ? (
            recentResources.map((resource) => {
              const productColors = getProductColor(resource.product);
              
              return (
                <div key={resource.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors hover-lift">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-sm">{getTypeIcon(resource.type)}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-slate-900 truncate">{resource.title}</h4>
                      {resource.version && (
                        <span className="text-xs px-1.5 py-0.5 bg-slate-200 text-slate-600 rounded">
                          v{resource.version}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>by {resource.user.name}</span>
                      <span>•</span>
                      <span>{formatTimeAgo(resource.createdAt)}</span>
                      {resource.product && (
                        <>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <img 
                              src={`/images/products/${resource.product.toLowerCase()}-logo.svg`} 
                              alt={`${PRODUCTS[resource.product as keyof typeof PRODUCTS]?.name} logo`}
                              className="w-3 h-1.5 object-contain"
                            />
                            <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${productColors.bg} ${productColors.text}`}>
                              {PRODUCTS[resource.product as keyof typeof PRODUCTS]?.name}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <button className="px-3 py-1 text-xs bg-white hover:bg-slate-50 rounded-lg transition-colors border border-slate-200">
                    View
                  </button>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-slate-500">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="text-lg">📁</div>
              </div>
              <p className="font-medium mb-1">No recent activity</p>
              <p className="text-sm">Resources will appear here as they're added</p>
            </div>
          )}
        </div>
      </div>

      {/* Resource Insights (Viewer Only) */}
      {isViewer && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h4 className="font-semibold text-slate-900 mb-4">📊 Usage Insights</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Most Downloaded</span>
                <span className="text-sm font-medium text-slate-900">Echo Templates</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Recently Updated</span>
                <span className="text-sm font-medium text-slate-900">Kalabria Docs</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">New This Week</span>
                <span className="text-sm font-medium text-slate-900">3 resources</span>
              </div>
            </div>
          </div>
          
          <div className="card">
            <h4 className="font-semibold text-slate-900 mb-4">🔔 Version Alerts</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                <div>
                  <div className="text-sm font-medium text-slate-900">Phrames Framework v2.1</div>
                  <div className="text-xs text-slate-500">New features available</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                <div>
                  <div className="text-sm font-medium text-slate-900">Legal Templates</div>
                  <div className="text-xs text-slate-500">Updated compliance docs</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}