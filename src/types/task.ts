export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: number;
  title: string;
  priority: TaskPriority;
  status: TaskStatus;
  due_date: string;
  tags: string; // comma separated tags
  selected_date: string;
  user?: number;
  created_at?: string;
  updated_at?: string;
}
