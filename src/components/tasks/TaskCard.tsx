import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Task } from '@/types/task';
import { PriorityBadge } from './PriorityBadge';
import { Tag } from './Tag';
import { Clock } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export const TaskCard = ({ task, onEdit }: TaskCardProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id.toString(),
    data: task,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: isDragging ? 50 : undefined,
        opacity: isDragging ? 0.8 : 1,
      }
    : undefined;

  const tagsList = task.tags ? task.tags.split(',').map((t) => t.trim()).filter(Boolean) : [];

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white p-4 rounded-xl shadow-sm border border-[#E5E7EB] cursor-grab active:cursor-grabbing hover:border-[#673de6] hover:shadow-md transition-all group relative ${
        isDragging ? 'ring-2 ring-[#673de6] shadow-xl scale-105' : ''
      }`}
      onClick={(e) => {
        // Only trigger edit if we are not actively dragging
        if (!isDragging) {
          onEdit(task);
        }
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <PriorityBadge priority={task.priority} />
      </div>
      <h3 className="text-[#2F1C6A] font-bold text-sm mb-3 line-clamp-2">{task.title}</h3>
      
      {tagsList.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {tagsList.map((tag, idx) => (
            <Tag key={idx} label={tag} />
          ))}
        </div>
      )}
      
      <div className="flex items-center text-xs font-medium text-[#6B7280] gap-1 mt-auto pt-3 border-t border-[#E5E7EB]">
        <Clock className="w-3.5 h-3.5 text-[#9CA3AF]" />
        <span>{new Date(task.due_date).toLocaleDateString()}</span>
      </div>
    </div>
  );
};
