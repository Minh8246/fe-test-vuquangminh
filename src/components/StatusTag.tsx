import { Tag } from 'antd';
import type { TaskStatus } from '@/types/task';

const STATUS_LABEL: Record<TaskStatus, string> = {
  todo: 'Cần làm',
  in_progress: 'Đang làm',
  done: 'Hoàn thành',
};

const STATUS_COLOR: Record<TaskStatus, string> = {
  todo: 'default',
  in_progress: 'processing',
  done: 'success',
};

interface StatusTagProps {
  status: TaskStatus;
}

export function StatusTag({ status }: StatusTagProps) {
  return <Tag color={STATUS_COLOR[status]}>{STATUS_LABEL[status]}</Tag>;
}
