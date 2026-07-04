'use client';
import React, { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useGetTasksQuery, useUpdateTaskMutation } from '@/features/tasks/taskApi';
import { Column } from './Column';
import { Task, TaskStatus } from '@/types/task';
import { TaskCard } from './TaskCard';
import { Spinner } from '@/components/ui/Spinner';

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: 'TODO', title: 'To Do' },
  { id: 'IN_PROGRESS', title: 'In Progress' },
  { id: 'DONE', title: 'Done' },
];

export const Board = ({ onEditTask }: { onEditTask: (task: Task) => void }) => {
  const selectedDate = useSelector((state: RootState) => state.tasks.selectedDate);
  const { data: tasks = [], isLoading } = useGetTasksQuery(selectedDate);
  const [updateTask] = useUpdateTaskMutation();

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id.toString() === active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = parseInt(active.id as string);
    const newStatus = over.id as TaskStatus;

    const task = tasks.find((t) => t.id === taskId);
    if (task && task.status !== newStatus) {
      updateTask({ id: taskId, status: newStatus });
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex justify-center items-center min-h-[400px]">
        <Spinner />
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex gap-6 overflow-x-auto h-full pb-4 items-start w-full">
        {COLUMNS.map((col) => (
          <Column
            key={col.id}
            id={col.id}
            title={col.title}
            tasks={tasks.filter((t) => t.status === col.id)}
            onEditTask={onEditTask}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} onEdit={() => {}} /> : null}
      </DragOverlay>
    </DndContext>
  );
};
