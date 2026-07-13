'use client';
import { useState } from 'react';
import { Board } from '@/components/tasks/Board';
import { DateSelector } from '@/components/tasks/DateSelector';
import { TaskModal } from '@/components/tasks/TaskModal';
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
    <div className="h-full flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 font-sans">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 md:gap-0 bg-white p-4 sm:p-6 rounded-none shadow-xs border border-[#E5E7EB]">
        <div>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-[#2F1C6A] tracking-tight flex items-center gap-2">
              📅 {formatDateForDisplay(selectedDate)}
            </h1>
            {isToday && (
              <span className="bg-[#f3effe] text-[#673de6] text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#d6c7ff]">
                Today
              </span>
            )}
          </div>
          <p className="text-[#6B7280] text-sm mt-1 sm:mt-2 font-medium">
            Showing {tasks.length} {tasks.length === 1 ? 'Task' : 'Tasks'}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full md:w-auto">
          <div className="w-full overflow-x-auto sm:overflow-visible sm:w-auto pb-1 sm:pb-0 hide-scrollbar">
            <DateSelector />
          </div>
          <button onClick={handleCreateNew} className="h-11 px-5 w-full sm:w-auto bg-[#673de6] hover:bg-[#532cc2] text-white font-bold text-sm rounded-md transition-colors flex items-center justify-center gap-2 shrink-0">
            <Plus className="w-5 h-5" />
            New Task
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 bg-transparent rounded-xl mt-6">
        {tasks.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center bg-white rounded-md border border-dashed border-[#CBD5E1] p-12 w-full max-w-xl">
            <div className="w-16 h-16 bg-[#F4F5F7] text-[#6B7280] rounded-full flex items-center justify-center mb-4">
              <CalendarIcon className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-[#2F1C6A] mb-2">No tasks for this date.</h3>
            <p className="text-[#6B7280] text-center text-md">
              You have a clear schedule for {formatDateForDisplay(selectedDate)}. Enjoy your free time or add a new task from the top right to stay productive!
            </p>
          </div>
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
