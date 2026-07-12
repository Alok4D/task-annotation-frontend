'use client';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Task, TaskPriority, TaskStatus } from '@/types/task';
import { useCreateTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation } from '@/features/tasks/taskApi';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
}

interface FormData {
  title: string;
  priority: TaskPriority;
  status: TaskStatus;
  due_date: string;
  tags: string;
}

export const TaskModal = ({ isOpen, onClose, task }: TaskModalProps) => {
  const selectedDate = useSelector((state: RootState) => state.tasks.selectedDate);
  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  useEffect(() => {
    if (isOpen) {
      if (task) {
        reset({
          title: task.title,
          priority: task.priority,
          status: task.status,
          due_date: task.due_date,
          tags: task.tags || '',
        });
      } else {
        reset({
          title: '',
          priority: 'MEDIUM',
          status: 'TODO',
          due_date: selectedDate,
          tags: '',
        });
      }
    }
  }, [isOpen, task, reset, selectedDate]);

  const onSubmit = async (data: FormData) => {
    try {
      if (task) {
        await updateTask({ id: task.id, ...data, selected_date: data.due_date }).unwrap();
      } else {
        await createTask({ ...data, selected_date: data.due_date }).unwrap();
      }
      onClose();
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  const handleDelete = async () => {
    if (task) {
      try {
        await deleteTask(task.id).unwrap();
        onClose();
      } catch (error) {
        console.error('Failed to delete task:', error);
      }
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task ? 'Edit Task' : 'Add New Task'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Title"
          {...register('title', { required: 'Title is required' })}
          error={errors.title?.message}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-2">Priority</label>
            <select
              {...register('priority')}
              className="flex h-11 w-full rounded-none border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2 text-sm text-[#1F2937] focus:outline-none focus:border-[#673de6] focus:ring-1 focus:ring-[#673de6] transition-all"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-2">Status</label>
            <select
              {...register('status')}
              className="flex h-11 w-full rounded-none border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2 text-sm text-[#1F2937] focus:outline-none focus:border-[#673de6] focus:ring-1 focus:ring-[#673de6] transition-all"
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>
        </div>

        <Input
          type="date"
          label="Due Date"
          {...register('due_date', { required: 'Due date is required' })}
          error={errors.due_date?.message}
        />

        <Input
          label="Tags (comma separated)"
          placeholder="e.g. frontend, bug, critical"
          {...register('tags')}
        />

        <div className="flex justify-end gap-3 mt-8 pt-5 border-t border-[#E5E7EB]">
          {task && (
            <button 
              type="button" 
              onClick={() => {
                deleteTask(task.id);
                onClose();
              }}
              className="mr-auto px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-none transition-colors"
            >
              Delete
            </button>
          )}
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold text-[#4B5563] bg-white border border-[#E5E7EB] hover:bg-[#F9FAFB] rounded-none transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={isLoading}
            className="px-5 py-2 text-sm font-bold text-white bg-[#673de6] hover:bg-[#532cc2] rounded-none transition-colors disabled:opacity-70 flex items-center gap-2"
          >
            {isLoading ? (task ? 'Saving...' : 'Creating...') : (task ? 'Save Changes' : 'Create Task')}
          </button>
        </div>
      </form>
    </Modal>
  );
};
