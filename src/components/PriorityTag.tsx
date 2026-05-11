import { Tag } from 'antd';
import type { TaskPriority } from '@/types/task';

const PRIORITY_LABEL: Record<TaskPriority, string> = {
  low: 'Thấp',
  medium: 'Trung bình',
  high: 'Cao',
};

const PRIORITY_COLOR: Record<TaskPriority, string> = {
  low: 'success',
  medium: 'warning',
  high: 'error',
};

interface PriorityTagProps {
  priority: TaskPriority;
}

export function PriorityTag({ priority }: PriorityTagProps) {
  return <Tag color={PRIORITY_COLOR[priority]}>{PRIORITY_LABEL[priority]}</Tag>;
}
