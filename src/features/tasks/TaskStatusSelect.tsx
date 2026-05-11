import { Select } from 'antd';
import { STATUS_OPTIONS, type TaskStatus } from '@/types/task';
import { useAppDispatch } from '@/store/hooks';
import { updateTaskStatus } from './tasksSlice';

interface TaskStatusSelectProps {
  taskId: string;
  value: TaskStatus;
}

export function TaskStatusSelect({ taskId, value }: TaskStatusSelectProps) {
  const dispatch = useAppDispatch();
  return (
    <Select
      size="small"
      value={value}
      style={{ minWidth: 130 }}
      options={STATUS_OPTIONS}
      onChange={(status) => dispatch(updateTaskStatus({ id: taskId, status }))}
    />
  );
}
