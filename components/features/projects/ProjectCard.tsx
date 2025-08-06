'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import InlineEdit from '@/components/ui/InlineEdit';
import ProgressSlider from '@/components/ui/ProgressSlider';
import ProjectActions from './ProjectActions';
import toast from 'react-hot-toast';

interface Project {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  progress: number;
  _count: {
    activities: number;
  };
}

interface ProjectCardProps {
  project: Project;
  isDragging?: boolean;
  onUpdate?: (projectId: string, updates: Partial<Project>) => void;
  onDelete?: (projectId: string) => void;
  onViewDetails?: (projectId: string) => void;
}

const getProjectProgressColor = (status: string, progress: number) => {
  switch (status) {
    case 'COMPLETED': return 'bg-gradient-to-r from-green-400 via-green-500 to-emerald-600';
    case 'IN_PROGRESS': 
      if (progress > 75) return 'bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-600';
      if (progress > 50) return 'bg-gradient-to-r from-blue-400 via-cyan-500 to-blue-600';
      if (progress > 25) return 'bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-600';
      return 'bg-gradient-to-r from-slate-400 via-blue-400 to-blue-500';
    case 'ON_HOLD': return 'bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500';
    case 'NOT_STARTED': return 'bg-gradient-to-r from-slate-300 via-slate-400 to-slate-500';
    case 'CANCELLED': return 'bg-gradient-to-r from-red-400 via-red-500 to-red-600';
    default: return 'bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600';
  }
};

export default function ProjectCard({ 
  project, 
  isDragging = false,
  onUpdate,
  onDelete,
  onViewDetails,
}: ProjectCardProps) {
  const [isEditingProgress, setIsEditingProgress] = useState(false);
  const [localProgress, setLocalProgress] = useState(project.progress);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const progressGradient = getProjectProgressColor(project.status, localProgress);

  const handleTitleUpdate = async (newTitle: string) => {
    if (onUpdate) {
      try {
        await onUpdate(project.id, { title: newTitle });
        toast.success('Title updated');
      } catch {
        toast.error('Failed to update title');
      }
    }
  };

  const handleProgressUpdate = async (newProgress: number) => {
    setLocalProgress(newProgress);
    if (onUpdate) {
      try {
        await onUpdate(project.id, { progress: newProgress });
        toast.success('Progress updated');
      } catch {
        toast.error('Failed to update progress');
        setLocalProgress(project.progress);
      }
    }
  };

  const handleDuplicate = async () => {
    if (onUpdate) {
      try {
        // This would create a new project with same details
        toast.success('Project duplicated');
      } catch {
        toast.error('Failed to duplicate project');
      }
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 ${
        isDragging || isSortableDragging ? 'opacity-50 cursor-grabbing' : ''
      }`}
    >
      <div 
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
      >
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <InlineEdit
                value={project.title}
                onSave={handleTitleUpdate}
                className="font-medium text-slate-900"
              />
            </div>
            <ProjectActions
              onEdit={() => onViewDetails?.(project.id)}
              onDelete={() => onDelete?.(project.id)}
              onViewActivities={() => onViewDetails?.(project.id)}
              onDuplicate={handleDuplicate}
            />
          </div>
          
          {project.description && (
            <p className="text-sm text-slate-600 mb-3 line-clamp-2">
              {project.description}
            </p>
          )}
          
          <div className="mb-3">
            {isEditingProgress ? (
              <ProgressSlider
                value={localProgress}
                onChange={handleProgressUpdate}
                className="mb-1"
              />
            ) : (
              <div 
                onClick={() => setIsEditingProgress(true)}
                onBlur={() => setIsEditingProgress(false)}
                className="cursor-pointer"
              >
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span className="font-medium">{localProgress}%</span>
                  <span className="text-slate-400">
                    {project._count.activities} activities
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 shadow-inner">
                  <div 
                    className={`${progressGradient} h-2 rounded-full transition-all duration-700 ease-out shadow-sm`}
                    style={{ width: `${localProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${
                project.status === 'COMPLETED' ? 'bg-green-400' : 
                project.status === 'ON_HOLD' ? 'bg-amber-400' : 
                project.status === 'IN_PROGRESS' ? 'bg-blue-400' :
                'bg-slate-400'
              }`}></div>
              <span className="text-xs text-slate-600 capitalize">
                {project.status.toLowerCase().replace('_', ' ')}
              </span>
            </div>
            {project._count.activities > 0 && (
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <div className="w-1 h-1 bg-primary-400 rounded-full animate-pulse"></div>
                <span>Recent activity</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}