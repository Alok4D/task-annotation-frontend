import { TaskPriority } from '@/types/task';
import { cn } from '@/utils/cn';

export const PriorityBadge = ({ priority }: { priority: TaskPriority }) => {
  const styles = {
    LOW: 'bg-[#dcfce7] text-[#166534] border-[#bbf7d0]',
    MEDIUM: 'bg-[#fef9c3] text-[#854d0e] border-[#fef08a]',
    HIGH: 'bg-[#fee2e2] text-[#991b1b] border-[#fecaca]',
  };

  return (
    <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold tracking-wider border', styles[priority])}>
      {priority}
    </span>
  );
};
