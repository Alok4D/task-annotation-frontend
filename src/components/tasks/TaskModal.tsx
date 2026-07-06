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
    <Modal isOpen={isOpen} onClose={onClose} title={task ? 'Edit Task' : 'New Task'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Title"
          {...register('title', { required: 'Title is required' })}
          error={errors.title?.message}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-[#8B929D] uppercase tracking-wide">Priority</label>
            <select
              {...register('priority')}
              className="flex h-10 w-full rounded border border-[#3A414B] bg-[#1E2228] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#0D73ED] transition-colors [color-scheme:dark]"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-[#8B929D] uppercase tracking-wide">Status</label>
            <select
              {...register('status')}
              className="flex h-10 w-full rounded border border-[#3A414B] bg-[#1E2228] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#0D73ED] transition-colors [color-scheme:dark]"
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

        <div className="flex gap-3 pt-4 mt-2 border-t border-[#3A414B]">
          {task && (
            <Button
              type="button"
              variant="danger"
              className="mr-auto"
              onClick={handleDelete}
              isLoading={isDeleting}
            >
              Delete
            </Button>
          )}
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {task ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
