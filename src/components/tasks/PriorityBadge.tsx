import { TaskPriority } from '@/types/task';
import { cn } from '@/utils/cn';

export const PriorityBadge = ({ priority }: { priority: TaskPriority }) => {
  const styles = {
    LOW: 'bg-green-100 text-green-700 border-green-200',
    MEDIUM: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    HIGH: 'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <span className={cn('px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider border', styles[priority])}>
      {priority}
    </span>
  );
};
