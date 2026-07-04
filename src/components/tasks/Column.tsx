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
    <div className="flex flex-col flex-1 min-w-[300px] max-w-[350px] bg-gray-50/80 rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
        <h2 className="font-bold text-gray-700">{title}</h2>
        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-semibold border border-gray-200">
          {tasks.length}
        </span>
      </div>
      
      <div
        ref={setNodeRef}
        className={`flex-1 p-3 flex flex-col gap-3 min-h-[200px] transition-colors ${
          isOver ? 'bg-blue-50' : ''
        }`}
      >
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onEdit={onEditTask} />
        ))}
      </div>
    </div>
  );
};
