'use client';

import { useState } from 'react';
import ActivityContent from '@/components/features/activity/ActivityContent';

interface Activity {
  id: string;
  content: string;
  type: string;
  createdAt: string;
  user: {
    name: string;
    role: string;
  };
  project?: {
    title: string;
    status: string;
  };
  resource?: {
    title: string;
    type: string;
    url: string;
  };
  comments: Array<{
    id: string;
    content: string;
    createdAt: string;
    user: {
      name: string;
      role: string;
    };
  }>;
}

interface ContactActivitiesProps {
  activities: Activity[];
}

export default function ContactActivities({ activities }: ContactActivitiesProps) {
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'EMAIL': return { bg: 'bg-blue-50', border: 'border-l-blue-400', accent: 'text-blue-600' };
      case 'CALL': return { bg: 'bg-green-50', border: 'border-l-green-400', accent: 'text-green-600' };
      case 'LINKEDIN': return { bg: 'bg-purple-50', border: 'border-l-purple-400', accent: 'text-purple-600' };
      case 'PRODUCT_UPDATE': return { bg: 'bg-orange-50', border: 'border-l-orange-400', accent: 'text-orange-600' };
      case 'TEXT': return { bg: 'bg-pink-50', border: 'border-l-pink-400', accent: 'text-pink-600' };
      default: return { bg: 'bg-primary-50', border: 'border-l-primary-400', accent: 'text-primary-600' };
    }
  };

  const filteredActivities = activities.filter(activity => 
    typeFilter === 'ALL' || activity.type === typeFilter
  );

  const activityTypes = [...new Set(activities.map(a => a.type))];
  const typeCounts = {
    ALL: activities.length,
    ...Object.fromEntries(activityTypes.map(type => [
      type, activities.filter(a => a.type === type).length
    ]))
  };

  if (activities.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="w-8 h-8 bg-secondary-200 rounded-full"></div>
        </div>
        <p className="text-lg font-medium mb-2">No activities yet</p>
        <p className="text-sm text-slate-400">Activities related to this contact will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Activity Type Filter */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(typeCounts).map(([type, count]) => (
          <button
            key={type}
            onClick={() => setTypeFilter(type)}
            className={`px-3 py-1 text-xs font-medium rounded-full transition-all duration-200 ${
              typeFilter === type
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-white/60 text-slate-600 hover:bg-white/80 border border-slate-200'
            }`}
          >
            {type === 'ALL' ? 'All' : type.replace('_', ' ')} ({count})
          </button>
        ))}
      </div>

      {/* Activities Timeline */}
      <div className="space-y-4">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity, index) => {
            const colors = getActivityTypeColor(activity.type);
            const isLast = index === filteredActivities.length - 1;

            return (
              <div key={activity.id} className="relative">
                {/* Timeline Line */}
                {!isLast && (
                  <div className="absolute left-6 top-12 w-0.5 h-16 bg-slate-200"></div>
                )}

                <div className={`relative p-4 bg-white rounded-xl border border-slate-200 shadow-sm hover-lift hover:shadow-md transition-all duration-300 ${colors.border} border-l-4`}>
                  {/* Timeline Dot */}
                  <div className="absolute -left-2 top-6 w-4 h-4 bg-white border-2 border-slate-300 rounded-full shadow-sm">
                    <div className={`w-2 h-2 rounded-full ${colors.accent.replace('text-', 'bg-')} absolute top-0.5 left-0.5`}></div>
                  </div>

                  <div className="ml-6">
                    {/* Activity Header */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-semibold ${colors.accent} uppercase tracking-wider ${colors.bg} px-2 py-1 rounded-md`}>
                          {activity.type.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-slate-500">
                          by {activity.user.name}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 font-medium">
                        {new Date(activity.createdAt).toLocaleDateString()} at {new Date(activity.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>

                    {/* Activity Content */}
                    <ActivityContent 
                      content={activity.content}
                      className="text-sm text-slate-800 mb-4 leading-relaxed"
                    />

                    {/* Related Items */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {activity.project && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                          📁 {activity.project.title}
                        </span>
                      )}
                      {activity.resource && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                          📎 {activity.resource.title}
                        </span>
                      )}
                    </div>

                    {/* Comments */}
                    {activity.comments.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <h4 className="text-xs font-medium text-slate-700 mb-3 flex items-center">
                          <span className="w-4 h-4 bg-slate-100 rounded-full flex items-center justify-center mr-2">
                            💬
                          </span>
                          Comments ({activity.comments.length})
                        </h4>
                        <div className="space-y-3">
                          {activity.comments.map((comment) => (
                            <div key={comment.id} className="bg-slate-50 rounded-lg p-3">
                              <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-medium text-slate-700">
                                  {comment.user.name}
                                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                                    comment.user.role === 'VIEWER' 
                                      ? 'bg-secondary-100 text-secondary-700' 
                                      : 'bg-primary-100 text-primary-700'
                                  }`}>
                                    {comment.user.role === 'VIEWER' ? 'Founder' : 'Contributor'}
                                  </span>
                                </span>
                                <span className="text-xs text-slate-400">
                                  {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm text-slate-600 leading-relaxed">{comment.content}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-slate-500">
            <p className="text-sm">No activities found for the selected filter.</p>
            <button
              onClick={() => setTypeFilter('ALL')}
              className="text-sm text-primary-600 hover:text-primary-700 mt-2"
            >
              Show all activities
            </button>
          </div>
        )}
      </div>
    </div>
  );
}