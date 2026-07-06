import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Task, TaskStatus } from '@/types/task';
import { TaskCard } from './TaskCard';

interface ColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  onEditTask: (task: Task) => void;
}

export const Column = ({ id, title, tasks, onEditTask }: ColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div className="flex flex-col flex-1 min-w-[300px] max-w-[350px] bg-[#F8F9FA] rounded-xl border border-[#E5E7EB] overflow-hidden shadow-sm">
      <div className="p-4 border-b border-[#E5E7EB] bg-white flex justify-between items-center">
        <h2 className="font-bold text-[#2F1C6A]">{title}</h2>
        <span className="bg-[#F4F5F7] text-[#6B7280] text-xs px-2.5 py-1 rounded-full font-bold border border-[#E5E7EB]">
          {tasks.length}
        </span>
      </div>
      
      <div
        ref={setNodeRef}
        className={`flex-1 p-3 flex flex-col gap-3 min-h-[200px] transition-colors ${
          isOver ? 'bg-[#E5E7EB]/50' : ''
        }`}
      >
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onEdit={onEditTask} />
        ))}
      </div>
    </div>
  );
};
