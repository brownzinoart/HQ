'use client';

import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import KanbanColumn from './KanbanColumn';
import ProjectCard from './ProjectCard';
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

interface KanbanBoardProps {
  projects: Project[];
  onProjectUpdate: (projectId: string, updates: Partial<Project>) => Promise<void>;
  onProjectCreate: (project: { title: string; description?: string; status: string; progress?: number }) => Promise<void>;
  onProjectDelete: (projectId: string) => Promise<void>;
  onViewProjectDetails?: (projectId: string) => void;
}

const statusColumns = [
  { id: 'NOT_STARTED', title: 'Not Started', color: 'bg-slate-50 border-slate-200' },
  { id: 'IN_PROGRESS', title: 'In Progress', color: 'bg-blue-50 border-blue-200' },
  { id: 'ON_HOLD', title: 'On Hold', color: 'bg-amber-50 border-amber-200' },
  { id: 'COMPLETED', title: 'Completed', color: 'bg-green-50 border-green-200' },
];

export default function KanbanBoard({ 
  projects, 
  onProjectUpdate,
  onProjectCreate,
  onProjectDelete,
  onViewProjectDetails 
}: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const projectsByStatus = statusColumns.reduce((acc, column) => {
    acc[column.id] = projects.filter(project => project.status === column.id);
    return acc;
  }, {} as Record<string, Project[]>);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const projectId = active.id as string;
    const newStatus = over.id as string;
    
    if (statusColumns.some(col => col.id === newStatus)) {
      const project = projects.find(p => p.id === projectId);
      if (project && project.status !== newStatus) {
        onProjectUpdate(projectId, { status: newStatus }).then(() => {
          toast.success('Project moved successfully');
        }).catch(() => {
          toast.error('Failed to move project');
        });
      }
    }
    
    setActiveId(null);
  };

  const activeProject = activeId ? projects.find(p => p.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statusColumns.map((column) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            color={column.color}
            projects={projectsByStatus[column.id]}
            onProjectCreate={onProjectCreate}
            onProjectUpdate={onProjectUpdate}
            onProjectDelete={onProjectDelete}
            onViewProjectDetails={onViewProjectDetails}
          />
        ))}
      </div>
      
      <DragOverlay>
        {activeProject ? (
          <ProjectCard project={activeProject} isDragging />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}