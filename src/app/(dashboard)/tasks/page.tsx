'use client';
import React, { useState } from 'react';
import { Board } from '@/components/tasks/Board';
import { DateSelector } from '@/components/tasks/DateSelector';
import { TaskModal } from '@/components/tasks/TaskModal';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import { Task } from '@/types/task';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useGetTasksQuery } from '@/features/tasks/taskApi';

export default function TasksPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const selectedDateStr = useSelector((state: RootState) => state.tasks.selectedDate);
  const { data: tasks = [] } = useGetTasksQuery(selectedDateStr);
  
  const handleCreateNew = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const selectedDate = new Date(selectedDateStr);
  const formatDateForDisplay = (date: Date) => {
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  };
  
  const isToday = new Date().toISOString().split('T')[0] === selectedDateStr;

  return (
    <div className="h-full flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              📅 {formatDateForDisplay(selectedDate)}
            </h1>
            {isToday && (
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-md border border-blue-200">
                Today
              </span>
            )}
          </div>
          <p className="text-gray-500 text-sm mt-2 font-medium">
            Showing {tasks.length} {tasks.length === 1 ? 'Task' : 'Tasks'}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <DateSelector />
          <Button onClick={handleCreateNew} className="gap-2 shadow-md">
            <Plus className="w-5 h-5" />
            New Task
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0 bg-transparent rounded-2xl">
        {tasks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center bg-white rounded-2xl border border-dashed border-gray-300">
            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
              <CalendarIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No tasks for this date.</h3>
            <p className="text-gray-500 mb-6 max-w-md text-center">
              You have a clear schedule for {formatDateForDisplay(selectedDate)}. Enjoy your free time or add a new task to stay productive!
            </p>
            <Button onClick={handleCreateNew} className="gap-2 shadow-md">
              <Plus className="w-5 h-5" />
              Create Task
            </Button>
          </div>
        ) : (
          <Board onEditTask={handleEditTask} />
        )}
      </div>

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        task={editingTask}
      />
    </div>
  );
}

// Inline Icon
function CalendarIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}
