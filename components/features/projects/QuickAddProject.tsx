'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

interface QuickAddProjectProps {
  status: string;
  onAdd: (project: { title: string; description?: string; status: string }) => void;
}

export default function QuickAddProject({ status, onAdd }: QuickAddProjectProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd({
        title: title.trim(),
        description: description.trim() || undefined,
        status,
      });
      setTitle('');
      setDescription('');
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setIsAdding(false);
  };

  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        className="w-full p-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-slate-400 hover:text-slate-600 transition-colors duration-200 flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        <span className="text-sm font-medium">Add Project</span>
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
      <div className="space-y-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Project title"
          className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm"
          autoFocus
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400 text-sm resize-none"
          rows={2}
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!title.trim()}
            className="flex-1 bg-primary-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Add
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-3 py-1.5 border border-slate-200 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}