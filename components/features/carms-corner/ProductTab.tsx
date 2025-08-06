'use client';

import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import { PRODUCTS, TASK_PRIORITY_CONFIG, RESPONSE_STATUS_CONFIG } from '@/lib/constants';
import TaskCreateModal from './TaskCreateModal';
import TaskResponseModal from './TaskResponseModal';

interface CarmTask {
  id: string;
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: string;
  createdAt: string;
  user: {
    name: string;
  };
  responses: CarmResponse[];
}

interface CarmResponse {
  id: string;
  content?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'NEEDS_INFO';
  notes?: string;
  createdAt: string;
  user: {
    name: string;
  };
}

interface ProductMention {
  id: string;
  mentionText: string;
  context?: string;
  createdAt: string;
  activity: {
    id: string;
    content: string;
    type: string;
    user: {
      name: string;
    };
  };
}

interface ProductTabProps {
  product: keyof typeof PRODUCTS;
}

export default function ProductTab({ product }: ProductTabProps) {
  const { isViewer, isContributor } = useAuth();
  const [tasks, setTasks] = useState<CarmTask[]>([]);
  const [mentions, setMentions] = useState<ProductMention[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'tasks' | 'mentions'>('tasks');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<CarmTask | null>(null);

  const productConfig = PRODUCTS[product];

  useEffect(() => {
    // Simulate API call - will be replaced with actual API
    setTimeout(() => {
      // Sample data for demonstration
      if (product === 'ECHO') {
        setTasks([
          {
            id: '1',
            title: 'Voice Quality Enhancement Approval',
            description: 'New algorithm for noise cancellation - needs final approval before implementation. This could significantly improve call quality for users in noisy environments.',
            priority: 'HIGH',
            dueDate: '2025-08-10',
            createdAt: '2025-08-05T10:00:00Z',
            user: { name: 'Wally' },
            responses: []
          },
          {
            id: '2',
            title: 'New Feature: Call Recording',
            description: 'Should we implement automatic call recording with user consent? Need guidance on privacy policy and legal implications.',
            priority: 'MEDIUM',
            createdAt: '2025-08-04T14:30:00Z',
            user: { name: 'Wally' },
            responses: [
              {
                id: '1',
                status: 'NEEDS_INFO',
                notes: 'Need more details on storage requirements and costs',
                createdAt: '2025-08-04T16:00:00Z',
                user: { name: 'Carm' }
              }
            ]
          }
        ]);

        setMentions([
          {
            id: '1',
            mentionText: 'Echo integration',
            context: 'Working on Echo integration with the new API endpoints',
            createdAt: '2025-08-06T09:30:00Z',
            activity: {
              id: '1',
              content: 'Completed the Echo integration testing. All voice channels are working properly and the latency has improved by 25%.',
              type: 'PRODUCT_UPDATE',
              user: { name: 'Wally' }
            }
          },
          {
            id: '2',
            mentionText: 'Echo performance',
            context: 'Echo performance metrics showing improvement',
            createdAt: '2025-08-05T15:20:00Z',
            activity: {
              id: '2',
              content: 'Echo performance metrics are looking great this week. User satisfaction scores up 12%.',
              type: 'GENERAL',
              user: { name: 'Wally' }
            }
          }
        ]);
      } else {
        // Sample data for other products
        setTasks([
          {
            id: '3',
            title: `${productConfig.name} Strategy Review`,
            description: `Need your input on the ${productConfig.name} roadmap for Q3. What features should we prioritize?`,
            priority: 'MEDIUM',
            createdAt: '2025-08-03T11:00:00Z',
            user: { name: 'Wally' },
            responses: []
          }
        ]);
        
        setMentions([
          {
            id: '3',
            mentionText: productConfig.name,
            context: `Mentioned in context of ${productConfig.description}`,
            createdAt: '2025-08-05T12:00:00Z',
            activity: {
              id: '3',
              content: `Working on improvements to ${productConfig.name}. The ${productConfig.description} is showing promising results.`,
              type: 'PRODUCT_UPDATE',
              user: { name: 'Wally' }
            }
          }
        ]);
      }
      
      setLoading(false);
    }, 500);
  }, [product, productConfig]);

  const getProductColor = (colorName: string) => {
    switch (colorName) {
      case 'blue': return { bg: 'bg-blue-50', text: 'text-blue-700', accent: 'bg-blue-200', border: 'border-blue-200' };
      case 'green': return { bg: 'bg-green-50', text: 'text-green-700', accent: 'bg-green-200', border: 'border-green-200' };
      case 'purple': return { bg: 'bg-purple-50', text: 'text-purple-700', accent: 'bg-purple-200', border: 'border-purple-200' };
      case 'orange': return { bg: 'bg-orange-50', text: 'text-orange-700', accent: 'bg-orange-200', border: 'border-orange-200' };
      case 'teal': return { bg: 'bg-teal-50', text: 'text-teal-700', accent: 'bg-teal-200', border: 'border-teal-200' };
      default: return { bg: 'bg-slate-50', text: 'text-slate-700', accent: 'bg-slate-200', border: 'border-slate-200' };
    }
  };

  const getPriorityColor = (priority: string) => {
    const config = TASK_PRIORITY_CONFIG[priority as keyof typeof TASK_PRIORITY_CONFIG];
    if (!config) return 'bg-gray-100 text-gray-700';
    
    switch (config.color) {
      case 'red': return 'bg-red-100 text-red-700 border-red-200';
      case 'amber': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'blue': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'gray': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    const config = RESPONSE_STATUS_CONFIG[status as keyof typeof RESPONSE_STATUS_CONFIG];
    if (!config) return 'bg-gray-100 text-gray-700';
    
    switch (config.color) {
      case 'green': return 'bg-green-100 text-green-700';
      case 'red': return 'bg-red-100 text-red-700';
      case 'amber': return 'bg-amber-100 text-amber-700';
      case 'blue': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const colors = getProductColor(productConfig.color);

  const handleTaskCreated = (newTask: unknown) => {
    // Refresh the data instead of trying to update state directly
    // In a real implementation, you would refetch the tasks from the API
    console.log('Task created:', newTask);
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  const handleResponseCreated = (newResponse: unknown) => {
    // Refresh the data instead of trying to update state directly
    // In a real implementation, you would refetch the tasks from the API
    console.log('Response created:', newResponse);
    // For now, we'll just refetch the mock data
    setTimeout(() => {
      setLoading(true);
      setTimeout(() => setLoading(false), 500);
    }, 100);
  };

  const handleRespondToTask = (task: CarmTask) => {
    setSelectedTask(task);
    setShowResponseModal(true);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
        <p className="mt-4 text-slate-500">Loading {productConfig.name} data...</p>
      </div>
    );
  }

  const pendingTasks = tasks.filter(task => task.responses.length === 0 || task.responses.some(r => r.status === 'PENDING'));

  return (
    <div className="space-y-6">
      {/* Product Header */}
      <div className={`card border-l-4 ${colors.border} ${colors.bg}`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{productConfig.name}</h2>
            <p className="text-slate-600 mb-4">{productConfig.description}</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                <span className="text-sm text-slate-600 font-medium">{pendingTasks.length} pending tasks</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span className="text-sm text-slate-600 font-medium">{mentions.length} recent mentions</span>
              </div>
            </div>
          </div>
          {isContributor && (
            <button 
              onClick={() => setShowTaskModal(true)}
              className={`px-4 py-2 ${colors.accent} ${colors.text} rounded-xl font-medium hover:opacity-80 transition-opacity hover-lift`}
            >
              Add Task
            </button>
          )}
        </div>
      </div>

      {/* Section Toggle */}
      <div className="flex gap-2 bg-white/60 backdrop-blur-sm rounded-xl p-1 shadow-sm w-fit">
        <button
          onClick={() => setActiveSection('tasks')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeSection === 'tasks' 
              ? `${colors.accent} ${colors.text} shadow-sm` 
              : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
          }`}
        >
          Tasks ({tasks.length})
        </button>
        <button
          onClick={() => setActiveSection('mentions')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeSection === 'mentions' 
              ? `${colors.accent} ${colors.text} shadow-sm` 
              : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
          }`}
        >
          Mentions ({mentions.length})
        </button>
      </div>

      {/* Content */}
      {activeSection === 'tasks' ? (
        <div className="space-y-6">
          {/* Priority Tasks Alert */}
          {pendingTasks.length > 0 && isViewer && (
            <div className="card bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <div className="w-6 h-6 bg-amber-500 rounded-full animate-pulse"></div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">⚡ {productConfig.name} Tasks Need Attention</h3>
                  <p className="text-slate-700 leading-relaxed">
                    You have <strong>{pendingTasks.length}</strong> pending tasks for {productConfig.name} that need your review and response.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tasks List */}
          <div className="space-y-4">
            {tasks.length > 0 ? (
              tasks.map((task) => {
                const hasResponse = task.responses.length > 0;
                const latestResponse = hasResponse ? task.responses[task.responses.length - 1] : null;
                
                return (
                  <div key={task.id} className="card hover-lift">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-slate-900 mb-2">{task.title}</h4>
                          <p className="text-slate-700 leading-relaxed mb-3">{task.description}</p>
                          
                          <div className="flex flex-wrap items-center gap-3">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium border ${getPriorityColor(task.priority)}`}>
                              {TASK_PRIORITY_CONFIG[task.priority].label}
                            </span>
                            {task.dueDate && (
                              <span className="text-xs text-slate-500">
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                              </span>
                            )}
                            <span className="text-xs text-slate-400">
                              Created {new Date(task.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        {!hasResponse && isViewer && (
                          <button 
                            onClick={() => handleRespondToTask(task)}
                            className="px-4 py-2 text-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-200 hover-lift"
                          >
                            Respond
                          </button>
                        )}
                      </div>

                      {/* Response Section */}
                      {hasResponse && latestResponse && (
                        <div className="pt-4 border-t border-slate-100">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center">
                              <span className="text-secondary-700 font-semibold text-xs">C</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="font-medium text-slate-900">{latestResponse.user.name}</span>
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(latestResponse.status)}`}>
                                  {RESPONSE_STATUS_CONFIG[latestResponse.status].label}
                                </span>
                                <span className="text-xs text-slate-400">
                                  {new Date(latestResponse.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              {latestResponse.notes && (
                                <p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3">
                                  {latestResponse.notes}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-slate-500">
                <div className={`w-16 h-16 ${colors.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <div className={`w-8 h-8 ${colors.accent} rounded-xl`}></div>
                </div>
                <p className="text-lg font-medium mb-2">No tasks yet</p>
                <p className="text-sm text-slate-400 mb-4">Create your first task for {productConfig.name}</p>
                {isContributor && (
                  <button className="btn-primary hover-lift">
                    Add Task
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {mentions.length > 0 ? (
            mentions.map((mention) => (
              <div key={mention.id} className="card hover-lift">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${colors.accent} ${colors.text}`}>
                          {mention.activity.type.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(mention.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed mb-2">{mention.activity.content}</p>
                      <div className="text-sm text-slate-500">
                        <strong>Mentioned:</strong> &quot;{mention.mentionText}&quot;
                        {mention.context && <span className="ml-2">• {mention.context}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-slate-500">
              <div className={`w-16 h-16 ${colors.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <div className={`w-8 h-8 ${colors.accent} rounded-xl`}></div>
              </div>
              <p className="text-lg font-medium mb-2">No mentions yet</p>
              <p className="text-sm text-slate-400">
                {productConfig.name} hasn&apos;t been mentioned in activities recently
              </p>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <TaskCreateModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onTaskCreated={handleTaskCreated}
        selectedProduct={product}
      />

      <TaskResponseModal
        isOpen={showResponseModal}
        onClose={() => setShowResponseModal(false)}
        onResponseCreated={handleResponseCreated}
        task={selectedTask}
      />
    </div>
  );
}