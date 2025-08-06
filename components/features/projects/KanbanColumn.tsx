'use client';

import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import ProjectCard from './ProjectCard';
import QuickAddProject from './QuickAddProject';

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

interface KanbanColumnProps {
  id: string;
  title: string;
  color: string;
  projects: Project[];
  onProjectCreate: (project: { title: string; description?: string; status: string; progress?: number }) => Promise<void>;
  onProjectUpdate: (projectId: string, updates: Partial<Project>) => Promise<void>;
  onProjectDelete: (projectId: string) => Promise<void>;
  onViewProjectDetails?: (projectId: string) => void;
}

export default function KanbanColumn({ 
  id, 
  title, 
  color, 
  projects,
  onProjectCreate,
  onProjectUpdate,
  onProjectDelete,
  onViewProjectDetails
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col h-full min-h-[600px] ${color} rounded-xl border-2 transition-all duration-200 ${
        isOver ? 'border-primary-400 shadow-lg' : ''
      }`}
    >
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">{title}</h3>
          <span className="bg-white/80 text-slate-700 text-xs font-medium px-2 py-1 rounded-full">
            {projects.length}
          </span>
        </div>
      </div>
      
      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        <SortableContext
          items={projects.map(p => p.id)}
          strategy={verticalListSortingStrategy}
        >
          {projects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project}
              onUpdate={onProjectUpdate}
              onDelete={onProjectDelete}
              onViewDetails={onViewProjectDetails}
            />
          ))}
          
          <QuickAddProject
            status={id}
            onAdd={onProjectCreate}
          />
          
          {projects.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="w-6 h-6 bg-slate-300 rounded-full"></div>
              </div>
              <p className="text-sm">No projects</p>
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  );
}