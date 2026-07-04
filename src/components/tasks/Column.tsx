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
    <div className="flex flex-col flex-1 min-w-[300px] max-w-[350px] bg-[#1E2228] rounded border border-[#3A414B] overflow-hidden shadow-sm">
      <div className="p-4 border-b border-[#3A414B] bg-[#272B33] flex justify-between items-center">
        <h2 className="font-bold text-white">{title}</h2>
        <span className="bg-[#3A414B] text-[#E0E0E0] text-xs px-2 py-1 rounded-full font-semibold border border-[#4a5360]">
          {tasks.length}
        </span>
      </div>
      
      <div
        ref={setNodeRef}
        className={`flex-1 p-3 flex flex-col gap-3 min-h-[200px] transition-colors ${
          isOver ? 'bg-[#272B33]' : ''
        }`}
      >
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onEdit={onEditTask} />
        ))}
      </div>
    </div>
  );
};
