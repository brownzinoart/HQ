'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { PRODUCTS, TASK_PRIORITY_CONFIG } from '@/lib/constants';

interface TaskCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: (task: unknown) => void;
  selectedProduct?: keyof typeof PRODUCTS;
}

export default function TaskCreateModal({ 
  isOpen, 
  onClose, 
  onTaskCreated, 
  selectedProduct 
}: TaskCreateModalProps) {
  const { isContributor } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    product: selectedProduct || 'ECHO',
    priority: 'MEDIUM',
    dueDate: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isContributor) return;

    setLoading(true);
    try {
      const response = await fetch('/api/carms-corner/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          dueDate: formData.dueDate || null,
        }),
      });

      if (response.ok) {
        const newTask = await response.json();
        onTaskCreated(newTask);
        handleClose();
      } else {
        const error = await response.json();
        alert(`Error creating task: ${error.error}`);
      }
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Error creating task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      product: selectedProduct || 'ECHO',
      priority: 'MEDIUM',
      dueDate: '',
    });
    onClose();
  };

  const getPriorityColor = (priority: string) => {
    const config = TASK_PRIORITY_CONFIG[priority as keyof typeof TASK_PRIORITY_CONFIG];
    if (!config) return 'bg-gray-100 text-gray-700';
    
    switch (config.color) {
      case 'red': return 'bg-red-100 text-red-700';
      case 'amber': return 'bg-amber-100 text-amber-700';
      case 'blue': return 'bg-blue-100 text-blue-700';
      case 'gray': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getProductColor = (productKey: string) => {
    const product = PRODUCTS[productKey as keyof typeof PRODUCTS];
    if (!product) return 'bg-slate-100 text-slate-700';
    
    switch (product.color) {
      case 'blue': return 'bg-blue-100 text-blue-700';
      case 'green': return 'bg-green-100 text-green-700';
      case 'purple': return 'bg-purple-100 text-purple-700';
      case 'orange': return 'bg-orange-100 text-orange-700';
      case 'teal': return 'bg-teal-100 text-teal-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Create New Task for Carm</h2>
            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
            >
              ✕
            </button>
          </div>
          <p className="text-slate-600 mt-2">
            Create a question or task that needs Carm&apos;s attention and approval.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Product Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-3">
              Product *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(PRODUCTS).map(([key, product]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, product: key as keyof typeof PRODUCTS }))}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
                    formData.product === key
                      ? `${getProductColor(key)} border-current shadow-sm`
                      : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-semibold">{product.name}</div>
                  <div className="text-xs opacity-75">{product.description.split(' ').slice(0, 3).join(' ')}...</div>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-900 mb-2">
              Task Title *
            </label>
            <input
              type="text"
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              placeholder="e.g., Approve new feature implementation for Echo"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-900 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              placeholder="Provide detailed context about what needs to be decided or approved..."
            />
          </div>

          {/* Priority and Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-3">
                Priority
              </label>
              <div className="space-y-2">
                {Object.entries(TASK_PRIORITY_CONFIG).map(([key, config]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, priority: key }))}
                    className={`w-full p-3 rounded-lg border text-sm font-medium transition-all duration-200 text-left ${
                      formData.priority === key
                        ? `${getPriorityColor(key)} border-current shadow-sm`
                        : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {config.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-slate-900 mb-2">
                Due Date (Optional)
              </label>
              <input
                type="date"
                id="dueDate"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 text-slate-600 bg-slate-100 rounded-lg font-medium hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title.trim() || !formData.description.trim()}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover-lift"
            >
              {loading ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}