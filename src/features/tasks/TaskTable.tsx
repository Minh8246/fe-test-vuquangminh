import { useMemo } from 'react';
import { App, Button, Space, Table, Tooltip, Typography } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { Task } from '@/types/task';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectFilteredTasks, selectPagination } from './tasksSelectors';
import { deleteTask, setPage } from './tasksSlice';
import { PriorityTag } from '@/components/PriorityTag';
import { StatusTag } from '@/components/StatusTag';
import { TaskStatusSelect } from './TaskStatusSelect';
import { formatDate } from '@/utils/format';

const { Text } = Typography;

interface TaskTableProps {
  selectedRowKeys: string[];
  onSelectionChange: (keys: string[]) => void;
  onEdit: (task: Task) => void;
  loading?: boolean;
}

export function TaskTable({
  selectedRowKeys,
  onSelectionChange,
  onEdit,
  loading = false,
}: TaskTableProps) {
  const { modal } = App.useApp();
  const dispatch = useAppDispatch();
  const filtered = useAppSelector(selectFilteredTasks);
  const { currentPage, pageSize } = useAppSelector(selectPagination);

  const columns: ColumnsType<Task> = useMemo(
    () => [
      {
        title: 'Tiêu đề',
        dataIndex: 'title',
        key: 'title',
        sorter: (a, b) => a.title.localeCompare(b.title, 'vi'),
        render: (_value: string, task: Task) => (
          <div>
            <Text strong>{task.title}</Text>
            {task.description && (
              <div className="text-xs text-neutral-500 line-clamp-1">
                {task.description}
              </div>
            )}
          </div>
        ),
      },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        width: 170,
        render: (_value, task) => (
          <Space direction="vertical" size={4}>
            <StatusTag status={task.status} />
            <TaskStatusSelect taskId={task.id} value={task.status} />
          </Space>
        ),
      },
      {
        title: 'Ưu tiên',
        dataIndex: 'priority',
        key: 'priority',
        width: 110,
        sorter: (a, b) => {
          const order = { low: 0, medium: 1, high: 2 } as const;
          return order[a.priority] - order[b.priority];
        },
        render: (_value, task) => <PriorityTag priority={task.priority} />,
      },
      {
        title: 'Người được giao',
        dataIndex: 'assignee',
        key: 'assignee',
        width: 140,
        render: (value: string | undefined) => value ?? '—',
      },
      {
        title: 'Hạn chót',
        dataIndex: 'dueDate',
        key: 'dueDate',
        width: 120,
        sorter: (a, b) => {
          const ax = a.dueDate ? new Date(a.dueDate).getTime() : 0;
          const bx = b.dueDate ? new Date(b.dueDate).getTime() : 0;
          return ax - bx;
        },
        render: (value: string | undefined) => formatDate(value),
      },
      {
        title: 'Hành động',
        key: 'actions',
        width: 130,
        fixed: 'right',
        render: (_value, task) => (
          <Space>
            <Tooltip title="Chỉnh sửa">
              <Button
                size="small"
                icon={<EditOutlined />}
                onClick={() => onEdit(task)}
              />
            </Tooltip>
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() =>
                modal.confirm({
                  title: 'Xoá task này?',
                  content: `"${task.title}" sẽ bị xoá vĩnh viễn. Hành động không thể hoàn tác.`,
                  okText: 'Xoá',
                  okButtonProps: { danger: true },
                  cancelText: 'Huỷ',
                  onOk: () => dispatch(deleteTask(task.id)),
                })
              }
            />
          </Space>
        ),
      },
    ],
    [dispatch, onEdit, modal]
  );

  const onChange: TableProps<Task>['onChange'] = (pagination) => {
    dispatch(
      setPage({
        currentPage: pagination.current ?? 1,
        pageSize: pagination.pageSize ?? pageSize,
      })
    );
  };

  return (
    <Table<Task>
      rowKey="id"
      columns={columns}
      dataSource={filtered}
      loading={loading}
      scroll={{ x: 'max-content' }}
      rowSelection={{
        selectedRowKeys,
        onChange: (keys) => onSelectionChange(keys as string[]),
      }}
      pagination={{
        current: currentPage,
        pageSize,
        total: filtered.length,
        showTotal: (total) => `Tổng ${total} task`,
        showSizeChanger: false,
      }}
      onChange={onChange}
      locale={{ emptyText: 'Không có task phù hợp' }}
    />
  );
}
