'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { MoreVertical, Edit, Trash2, Activity, Copy } from 'lucide-react';

interface ProjectActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  onViewActivities: () => void;
  onDuplicate: () => void;
}

export default function ProjectActions({
  onEdit,
  onDelete,
  onViewActivities,
  onDuplicate,
}: ProjectActionsProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="p-1 hover:bg-slate-100 rounded transition-colors duration-200 opacity-0 group-hover:opacity-100"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="w-4 h-4 text-slate-500" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[160px] bg-white rounded-lg shadow-lg border border-slate-200 p-1 z-50"
          sideOffset={5}
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenu.Item
            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 rounded-md hover:bg-slate-50 cursor-pointer outline-none"
            onSelect={onEdit}
          >
            <Edit className="w-4 h-4" />
            Edit Details
          </DropdownMenu.Item>

          <DropdownMenu.Item
            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 rounded-md hover:bg-slate-50 cursor-pointer outline-none"
            onSelect={onViewActivities}
          >
            <Activity className="w-4 h-4" />
            View Activities
          </DropdownMenu.Item>

          <DropdownMenu.Item
            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 rounded-md hover:bg-slate-50 cursor-pointer outline-none"
            onSelect={onDuplicate}
          >
            <Copy className="w-4 h-4" />
            Duplicate
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="h-px bg-slate-200 my-1" />

          <DropdownMenu.Item
            className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50 cursor-pointer outline-none"
            onSelect={onDelete}
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </DropdownMenu.Item>

          <DropdownMenu.Arrow className="fill-white" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}