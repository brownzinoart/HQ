'use client';

import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import { PRODUCTS } from '@/lib/constants';
import Link from 'next/link';

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

export default function AllActivityPage() {
  const { isViewer } = useAuth();
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [productFilter, setProductFilter] = useState<string>('all');

  useEffect(() => {
    async function fetchActivities() {
      try {
        if (isViewer) {
          const response = await fetch('/api/carms-corner/recent-activity');
          if (response.ok) {
            const data = await response.json();
            setActivities(data);
          }
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchActivities();
  }, [isViewer]);

  const getProductColor = (product: string) => {
    const productConfig = PRODUCTS[product as keyof typeof PRODUCTS];
    if (!productConfig) return { bg: 'bg-slate-50', text: 'text-slate-700', accent: 'bg-slate-200', border: 'border-slate-200' };
    
    switch (productConfig.color) {
      case 'blue': return { bg: 'bg-blue-50', text: 'text-blue-700', accent: 'bg-blue-200', border: 'border-blue-200' };
      case 'green': return { bg: 'bg-green-50', text: 'text-green-700', accent: 'bg-green-200', border: 'border-green-200' };
      case 'purple': return { bg: 'bg-purple-50', text: 'text-purple-700', accent: 'bg-purple-200', border: 'border-purple-200' };
      case 'orange': return { bg: 'bg-orange-50', text: 'text-orange-700', accent: 'bg-orange-200', border: 'border-orange-200' };
      case 'teal': return { bg: 'bg-teal-50', text: 'text-teal-700', accent: 'bg-teal-200', border: 'border-teal-200' };
      default: return { bg: 'bg-slate-50', text: 'text-slate-700', accent: 'bg-slate-200', border: 'border-slate-200' };
    }
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

  const filteredActivities = activities.filter(activity => {
    if (filter !== 'all' && activity.urgency !== filter) return false;
    if (productFilter !== 'all' && activity.product !== productFilter) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto"></div>
        <p className="mt-6 text-slate-500 text-lg">Loading all activities...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">All Activity</h1>
          <p className="text-slate-600">Product mentions across team activities</p>
        </div>
        <Link 
          href="/dashboard/carms-corner"
          className="btn-outline hover-lift"
        >
          Back to Overview
        </Link>
      </div>

      {/* Filters */}
      <div className="glass rounded-xl p-4 space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700">Priority:</label>
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value as 'all' | 'high' | 'medium' | 'low')}
              className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">All</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700">Product:</label>
            <select 
              value={productFilter} 
              onChange={(e) => setProductFilter(e.target.value)}
              className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">All Products</option>
              {Object.entries(PRODUCTS).map(([key, product]) => (
                <option key={key} value={key}>{product.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="text-sm text-slate-600">
          {filteredActivities.length} of {activities.length} mentions
        </div>
      </div>

      {/* Activities List */}
      <div className="space-y-4">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity) => {
            const productColors = getProductColor(activity.product);
            const urgencyColors = getUrgencyColor(activity.urgency);
            
            return (
              <div key={activity.id} className={`card hover-lift border-l-4 ${productColors.border} ${productColors.bg}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 ${productColors.accent} rounded-full flex items-center justify-center text-lg font-bold ${productColors.text} shadow-sm flex-shrink-0`}>
                    {getProductInitial(activity.product)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className={`font-bold ${productColors.text} mb-1`}>
                          {PRODUCTS[activity.product as keyof typeof PRODUCTS]?.name}
                        </h3>
                        <p className="text-slate-700 leading-relaxed mb-2">
                          {activity.context || activity.mentionText}
                        </p>
                        <div className="text-sm text-slate-600 mb-2">
                          <strong>Full Activity:</strong> {activity.activity.content}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className={`w-3 h-3 rounded-full ${urgencyColors.dot} animate-pulse`}></div>
                        {activity.hasTask && (
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        <span>{formatTimeAgo(activity.createdAt)}</span>
                        <span className={urgencyColors.text}>
                          {activity.urgency} priority
                        </span>
                        <span>by {activity.activity.user.name}</span>
                        <span className="text-xs bg-slate-100 px-2 py-1 rounded-full">
                          {activity.activity.type}
                        </span>
                        {activity.activity.contact && (
                          <span className="text-xs bg-blue-100 px-2 py-1 rounded-full text-blue-700">
                            Contact: {activity.activity.contact.name}
                          </span>
                        )}
                        {activity.activity.project && (
                          <span className="text-xs bg-green-100 px-2 py-1 rounded-full text-green-700">
                            Project: {activity.activity.project.title}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button className={`px-3 py-1.5 text-sm ${productColors.accent} ${productColors.text} rounded-lg font-medium hover:opacity-80 transition-opacity`}>
                          View Activity
                        </button>
                        {activity.urgency === 'high' && (
                          <button className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors">
                            Respond Now
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-16 text-slate-500">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-slate-300 rounded-full"></div>
            </div>
            <p className="text-lg font-medium mb-2">No mentions match your filters</p>
            <p>Try adjusting your priority or product filters</p>
          </div>
        )}
      </div>
    </div>
  );
}