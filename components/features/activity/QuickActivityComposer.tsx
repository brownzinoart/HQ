'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface Activity {
  id: string;
  content: string;
  type: string;
  createdAt: string;
  user: {
    name: string;
    role: string;
  };
  contact?: {
    name: string;
    company: string;
    leadStatus: string;
  };
  project?: {
    title: string;
    status: string;
  };
}

interface QuickActivityComposerProps {
  onActivityCreated: (activity: Activity) => void;
}

export default function QuickActivityComposer({ onActivityCreated }: QuickActivityComposerProps) {
  const { isContributor } = useAuth();
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [selectedType, setSelectedType] = useState('GENERAL');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [content]);

  // Auto-save draft to localStorage
  useEffect(() => {
    if (content) {
      localStorage.setItem('activity-draft', content);
    } else {
      localStorage.removeItem('activity-draft');
    }
  }, [content]);

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem('activity-draft');
    if (draft) {
      setContent(draft);
    }
  }, []);

  const activityTypes = [
    { key: 'EMAIL', label: 'Email', emoji: '📧', color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
    { key: 'CALL', label: 'Call', emoji: '📞', color: 'bg-green-100 text-green-700 hover:bg-green-200' },
    { key: 'TEXT', label: 'Text', emoji: '💬', color: 'bg-pink-100 text-pink-700 hover:bg-pink-200' },
    { key: 'LINKEDIN', label: 'LinkedIn', emoji: '🔗', color: 'bg-purple-100 text-purple-700 hover:bg-purple-200' },
    { key: 'PRODUCT_UPDATE', label: 'Update', emoji: '🚀', color: 'bg-orange-100 text-orange-700 hover:bg-orange-200' },
    { key: 'GENERAL', label: 'General', emoji: '💭', color: 'bg-slate-100 text-slate-700 hover:bg-slate-200' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isPosting) return;

    setIsPosting(true);
    
    try {
      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content.trim(),
          type: selectedType
        }),
      });

      if (response.ok) {
        const newActivity: Activity = await response.json();
        onActivityCreated(newActivity);
        setContent('');
        localStorage.removeItem('activity-draft');
        
        // Reset to general for next update
        setSelectedType('GENERAL');
      } else {
        throw new Error('Failed to create activity');
      }
    } catch (error) {
      console.error('Error creating activity:', error);
      // TODO: Show error toast
    } finally {
      setIsPosting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit(e as React.FormEvent);
    }
  };

  if (!isContributor) {
    return null; // Only contributors can post
  }

  return (
    <div className="card mb-8 border-2 border-primary-200 bg-gradient-to-r from-primary-25 to-blue-25">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Activity Type Pills */}
        <div className="flex flex-wrap gap-2">
          {activityTypes.map((type) => (
            <button
              key={type.key}
              type="button"
              onClick={() => setSelectedType(type.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                selectedType === type.key 
                  ? type.color + ' ring-2 ring-offset-1 ring-current' 
                  : 'bg-white/60 text-slate-600 hover:bg-white/80'
              }`}
            >
              <span className="mr-1">{type.emoji}</span>
              {type.label}
            </button>
          ))}
        </div>

        {/* Main Input */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What's happening? (⌘↵ to post)"
            className="w-full min-h-[60px] max-h-[200px] p-4 bg-white/80 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent placeholder-slate-400 text-base leading-relaxed"
            disabled={isPosting}
          />
          
          {/* Character count and controls */}
          <div className="flex items-center justify-between mt-3">
            <div className="text-xs text-slate-400">
              {content.length > 0 && (
                <>
                  {content.length} characters
                  {content.length > 500 && (
                    <span className="text-amber-600 ml-1">• Keep it concise</span>
                  )}
                </>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {content.trim() && !isPosting && (
                <button
                  type="button"
                  onClick={() => setContent('')}
                  className="text-xs text-slate-500 hover:text-slate-700 transition-colors"
                >
                  Clear
                </button>
              )}
              
              <button
                type="submit"
                disabled={!content.trim() || isPosting}
                className={`px-6 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  content.trim() && !isPosting
                    ? 'bg-primary-600 text-white hover:bg-primary-700 hover-lift'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                {isPosting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </div>

        {/* Quick tip */}
        {content.length === 0 && (
          <div className="text-xs text-slate-500 bg-white/40 rounded-lg p-3">
            💡 <strong>Quick tip:</strong> Mention contacts with @name or projects with #project. 
            Try &ldquo;Called @Sarah about #acme-deal pricing&rdquo; 
          </div>
        )}
      </form>
    </div>
  );
}