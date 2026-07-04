import { TaskPriority } from '@/types/task';
import { cn } from '@/utils/cn';

export const PriorityBadge = ({ priority }: { priority: TaskPriority }) => {
  const styles = {
    LOW: 'bg-[#1E2228] text-green-400 border-green-500/30',
    MEDIUM: 'bg-[#1E2228] text-yellow-400 border-yellow-500/30',
    HIGH: 'bg-[#1E2228] text-red-400 border-red-500/30',
  };

  return (
    <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold tracking-wider border', styles[priority])}>
      {priority}
    </span>
  );
};
