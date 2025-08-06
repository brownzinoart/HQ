'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { RESPONSE_STATUS_CONFIG } from '@/lib/constants';

interface TaskResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResponseCreated: (response: unknown) => void;
  task: {
    id: string;
    title: string;
    description: string;
    user: {
      name: string;
    };
  } | null;
}

export default function TaskResponseModal({ 
  isOpen, 
  onClose, 
  onResponseCreated, 
  task 
}: TaskResponseModalProps) {
  const { isViewer } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    status: 'APPROVED',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isViewer || !task) return;

    setLoading(true);
    try {
      const response = await fetch('/api/carms-corner/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId: task.id,
          status: formData.status,
          notes: formData.notes || null,
        }),
      });

      if (response.ok) {
        const newResponse = await response.json();
        onResponseCreated(newResponse);
        handleClose();
      } else {
        const error = await response.json();
        alert(`Error creating response: ${error.error}`);
      }
    } catch (error) {
      console.error('Error creating response:', error);
      alert('Error creating response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      status: 'APPROVED',
      notes: '',
    });
    onClose();
  };

  const getStatusColor = (status: string) => {
    const config = RESPONSE_STATUS_CONFIG[status as keyof typeof RESPONSE_STATUS_CONFIG];
    if (!config) return 'bg-gray-100 text-gray-700 border-gray-200';
    
    switch (config.color) {
      case 'green': return 'bg-green-100 text-green-700 border-green-200';
      case 'red': return 'bg-red-100 text-red-700 border-red-200';
      case 'amber': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'blue': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED': return '✅';
      case 'REJECTED': return '❌';
      case 'NEEDS_INFO': return '❓';
      case 'PENDING': return '⏳';
      default: return '📝';
    }
  };

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Respond to Task</h2>
            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Task Details */}
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">{task.title}</h3>
          <p className="text-slate-700 mb-3 leading-relaxed">{task.description}</p>
          <div className="text-sm text-slate-500">
            Submitted by: <strong>{task.user.name}</strong>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Status Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-900 mb-3">
              Your Response *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(RESPONSE_STATUS_CONFIG).filter(([key]) => key !== 'PENDING').map(([key, config]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, status: key }))}
                  className={`p-4 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
                    formData.status === key
                      ? `${getStatusColor(key)} shadow-sm`
                      : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{getStatusIcon(key)}</span>
                    <div className="text-left">
                      <div className="font-semibold">{config.label}</div>
                      <div className="text-xs opacity-75 mt-1">
                        {key === 'APPROVED' && 'Give the go-ahead'}
                        {key === 'REJECTED' && 'Decline the request'}
                        {key === 'NEEDS_INFO' && 'Request more details'}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-slate-900 mb-2">
              {formData.status === 'APPROVED' ? 'Additional Comments (Optional)' : 
               formData.status === 'REJECTED' ? 'Reason for Rejection *' : 
               'Additional Information Needed *'}
            </label>
            <textarea
              id="notes"
              rows={4}
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              placeholder={
                formData.status === 'APPROVED' ? 'Any additional guidance or comments...' :
                formData.status === 'REJECTED' ? 'Please explain why this cannot be approved...' :
                'What additional information do you need before making a decision?'
              }
              required={formData.status !== 'APPROVED'}
            />
          </div>

          {/* Response Preview */}
          <div className="bg-slate-50 rounded-lg p-4 border">
            <div className="text-sm font-medium text-slate-900 mb-2">Response Preview:</div>
            <div className="flex items-center gap-3">
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(formData.status)}`}>
                {getStatusIcon(formData.status)} {RESPONSE_STATUS_CONFIG[formData.status as keyof typeof RESPONSE_STATUS_CONFIG].label}
              </span>
            </div>
            {formData.notes && (
              <div className="mt-3 text-sm text-slate-700 bg-white rounded-lg p-3 border">
                {formData.notes}
              </div>
            )}
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
              disabled={loading || (formData.status !== 'APPROVED' && !formData.notes.trim())}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover-lift"
            >
              {loading ? 'Submitting...' : 'Submit Response'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}