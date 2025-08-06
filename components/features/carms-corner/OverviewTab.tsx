'use client';

import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import { PRODUCTS } from '@/lib/constants';
import TaskCreateModal from './TaskCreateModal';

interface ProductSummary {
  product: string;
  pendingTasks: number;
  totalTasks: number;
  recentMentions: number;
  lastActivity: string;
}

interface RecentActivity {
  id: string;
  product: string;
  mentionText: string;
  context?: string;
  createdAt: string;
  activity: {
    id: string;
    type: string;
    content: string;
    createdAt: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
    contact?: {
      id: string;
      name: string;
      company: string;
      leadStatus: string;
    };
    project?: {
      id: string;
      title: string;
      status: string;
    };
  };
  urgency: 'high' | 'medium' | 'low';
  hasTask: boolean;
  taskStatus?: string;
}

export default function OverviewTab() {
  const { isViewer, isContributor } = useAuth();
  const [productSummaries, setProductSummaries] = useState<ProductSummary[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch product summaries (mock for now - could be real API later)
        const mockSummaries = [
          {
            product: 'ECHO',
            pendingTasks: 3,
            totalTasks: 12,
            recentMentions: 8,
            lastActivity: '2 hours ago',
          },
          {
            product: 'KALABRIA',
            pendingTasks: 1,
            totalTasks: 5,
            recentMentions: 3,
            lastActivity: '1 day ago',
          },
          {
            product: 'PHRAMES',
            pendingTasks: 5,
            totalTasks: 18,
            recentMentions: 12,
            lastActivity: '30 minutes ago',
          },
          {
            product: 'MAILBRIX',
            pendingTasks: 2,
            totalTasks: 7,
            recentMentions: 6,
            lastActivity: '4 hours ago',
          },
          {
            product: 'PHARMABLOX',
            pendingTasks: 0,
            totalTasks: 3,
            recentMentions: 1,
            lastActivity: '3 days ago',
          },
        ];
        
        setProductSummaries(mockSummaries);

        // Fetch real recent activities from API
        if (isViewer) {
          const response = await fetch('/api/carms-corner/recent-activity');
          if (response.ok) {
            const activities = await response.json();
            setRecentActivities(activities);
          } else {
            // Fallback to mock data if API fails
            console.warn('Failed to fetch recent activities, using mock data');
            setRecentActivities([]);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Use empty arrays as fallback
        setRecentActivities([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [isViewer]);

  const getProductColor = (product: string) => {
    const productConfig = PRODUCTS[product as keyof typeof PRODUCTS];
    if (!productConfig) return { bg: 'bg-slate-50', text: 'text-slate-700', accent: 'bg-slate-200' };
    
    switch (productConfig.color) {
      case 'blue': return { bg: 'bg-blue-50', text: 'text-blue-700', accent: 'bg-blue-200', border: 'border-blue-200' };
      case 'green': return { bg: 'bg-green-50', text: 'text-green-700', accent: 'bg-green-200', border: 'border-green-200' };
      case 'purple': return { bg: 'bg-purple-50', text: 'text-purple-700', accent: 'bg-purple-200', border: 'border-purple-200' };
      case 'orange': return { bg: 'bg-orange-50', text: 'text-orange-700', accent: 'bg-orange-200', border: 'border-orange-200' };
      case 'teal': return { bg: 'bg-teal-50', text: 'text-teal-700', accent: 'bg-teal-200', border: 'border-teal-200' };
      default: return { bg: 'bg-slate-50', text: 'text-slate-700', accent: 'bg-slate-200', border: 'border-slate-200' };
    }
  };

  const getTotalPendingTasks = () => {
    return productSummaries.reduce((sum, product) => sum + product.pendingTasks, 0);
  };

  const getTotalTasks = () => {
    return productSummaries.reduce((sum, product) => sum + product.totalTasks, 0);
  };

  const getTotalMentions = () => {
    return productSummaries.reduce((sum, product) => sum + product.recentMentions, 0);
  };

  const handleTaskCreated = () => {
    // Refresh the overview data when a new task is created
    setLoading(true);
    // For now, we'll just refresh the mock data
    // In a real implementation, you would refetch from the API
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const getUrgencyColor = (urgency: 'high' | 'medium' | 'low') => {
    switch (urgency) {
      case 'high': return { bg: 'bg-red-50', border: 'border-red-400', text: 'text-red-700', dot: 'bg-red-500' };
      case 'medium': return { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-700', dot: 'bg-amber-500' };
      case 'low': return { bg: 'bg-green-50', border: 'border-green-400', text: 'text-green-700', dot: 'bg-green-500' };
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

  const getProductInitial = (product: string) => {
    const productConfig = PRODUCTS[product as keyof typeof PRODUCTS];
    return productConfig?.name?.[0] || product[0];
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
        <p className="mt-4 text-slate-500">Loading overview...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Summary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="metric-card text-center hover-lift group">
          <div className="relative z-10">
            <div className="text-4xl font-bold text-orange-600 mb-2 group-hover:scale-110 transition-transform duration-300">
              {getTotalPendingTasks()}
            </div>
            <div className="text-slate-600 font-medium">Pending Tasks</div>
            <div className="mt-2 text-xs text-slate-400">Need Response</div>
          </div>
        </div>
        <div className="metric-card text-center hover-lift group">
          <div className="relative z-10">
            <div className="text-4xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">
              {getTotalTasks()}
            </div>
            <div className="text-slate-600 font-medium">Total Tasks</div>
            <div className="mt-2 text-xs text-slate-400">All time</div>
          </div>
        </div>
        <div className="metric-card text-center hover-lift group">
          <div className="relative z-10">
            <div className="text-4xl font-bold text-purple-600 mb-2 group-hover:scale-110 transition-transform duration-300">
              {getTotalMentions()}
            </div>
            <div className="text-slate-600 font-medium">Recent Mentions</div>
            <div className="mt-2 text-xs text-slate-400">This week</div>
          </div>
        </div>
        <div className="metric-card text-center hover-lift group">
          <div className="relative z-10">
            <div className="text-4xl font-bold text-green-600 mb-2 group-hover:scale-110 transition-transform duration-300">
              {Object.keys(PRODUCTS).length}
            </div>
            <div className="text-slate-600 font-medium">Products</div>
            <div className="mt-2 text-xs text-slate-400">Under management</div>
          </div>
        </div>
      </div>

      {/* Priority Alert */}
      {isViewer && getTotalPendingTasks() > 0 && (
        <div className="card bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <div className="w-6 h-6 bg-amber-500 rounded-full animate-pulse"></div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900 mb-2">⚡ Action Required</h3>
              <p className="text-slate-700 leading-relaxed">
                You have <strong>{getTotalPendingTasks()}</strong> pending tasks across all products that need your attention. 
                The most urgent items are in <strong>Phrames</strong> ({productSummaries.find(p => p.product === 'PHRAMES')?.pendingTasks} tasks) 
                and <strong>Echo</strong> ({productSummaries.find(p => p.product === 'ECHO')?.pendingTasks} tasks).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Product Summary Cards */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center">
            <div className="w-6 h-6 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full mr-3"></div>
            Product Overview
          </h2>
          {isContributor && (
            <button 
              onClick={() => setShowTaskModal(true)}
              className="btn-primary hover-lift"
            >
              Create New Task
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {productSummaries.map((summary) => {
            const product = PRODUCTS[summary.product as keyof typeof PRODUCTS];
            const colors = getProductColor(summary.product);
            
            return (
              <div key={summary.product} className={`card hover-lift border-l-4 ${colors.border} ${colors.bg}`}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-1">{product?.name}</h3>
                      <p className="text-sm text-slate-600">{product?.description}</p>
                    </div>
                    {summary.pendingTasks > 0 && (
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-red-700 font-bold text-sm">{summary.pendingTasks}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${colors.text} mb-1`}>{summary.pendingTasks}</div>
                      <div className="text-xs text-slate-500">Pending</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${colors.text} mb-1`}>{summary.totalTasks}</div>
                      <div className="text-xs text-slate-500">Total</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${colors.text} mb-1`}>{summary.recentMentions}</div>
                      <div className="text-xs text-slate-500">Mentions</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/50">
                    <div className="text-xs text-slate-400">
                      Last activity: {summary.lastActivity}
                    </div>
                    <div className="flex gap-2">
                      <button className={`px-3 py-1 text-xs ${colors.accent} ${colors.text} rounded-lg font-medium hover:opacity-80 transition-opacity`}>
                        View Details
                      </button>
                      {summary.pendingTasks > 0 && isViewer && (
                        <button className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors">
                          Review
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Stream */}
      <div className="card">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-900">Recent Cross-Product Activity</h3>
          <a 
            href="/dashboard/carms-corner/activity"
            className="text-sm text-slate-600 hover:text-slate-800 font-medium hover-lift transition-colors"
          >
            View All
          </a>
        </div>
        
        <div className="space-y-4">
          {recentActivities.length > 0 ? (
            recentActivities.slice(0, 5).map((activity) => {
              const productColors = getProductColor(activity.product);
              const urgencyColors = getUrgencyColor(activity.urgency);
              
              return (
                <div key={activity.id} className={`flex items-start gap-4 p-4 ${productColors.bg} rounded-lg border-l-4 ${productColors.border} hover-lift transition-all duration-200`}>
                  <div className={`w-10 h-10 ${productColors.accent} rounded-full flex items-center justify-center text-sm font-bold ${productColors.text} shadow-sm`}>
                    {getProductInitial(activity.product)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <p className="text-sm text-slate-700 leading-relaxed">
                        <strong className={productColors.text}>
                          {PRODUCTS[activity.product as keyof typeof PRODUCTS]?.name}
                        </strong> - {activity.context || activity.mentionText}
                      </p>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className={`w-2 h-2 rounded-full ${urgencyColors.dot} animate-pulse`}></div>
                        {activity.hasTask && (
                          <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>{formatTimeAgo(activity.createdAt)}</span>
                        <span>•</span>
                        <span className={urgencyColors.text}>
                          {activity.urgency} priority
                        </span>
                        <span>•</span>
                        <span>by {activity.activity.user.name}</span>
                      </div>
                      {isViewer && (
                        <div className="flex gap-2">
                          <button className={`px-2 py-1 text-xs ${productColors.accent} ${productColors.text} rounded font-medium hover:opacity-80 transition-opacity`}>
                            View
                          </button>
                          {activity.urgency === 'high' && (
                            <button className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded font-medium hover:bg-red-200 transition-colors">
                              Respond
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-slate-500">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="w-6 h-6 bg-slate-300 rounded-full"></div>
              </div>
              <p className="font-medium mb-1">No recent product mentions</p>
              <p className="text-sm">Product mentions from activities will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* Task Creation Modal */}
      <TaskCreateModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onTaskCreated={handleTaskCreated}
      />
    </div>
  );
}