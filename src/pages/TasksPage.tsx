import { useState } from 'react';
import { App, Button, Space, Typography } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { Task } from '@/types/task';
import { useAppDispatch } from '@/store/hooks';
import { deleteManyTasks } from '@/features/tasks/tasksSlice';
import { TaskFilters } from '@/features/tasks/TaskFilters';
import { TaskTable } from '@/features/tasks/TaskTable';
import { TaskFormModal } from '@/features/tasks/TaskFormModal';

const { Title, Text } = Typography;

export function TasksPage() {
  const { modal } = App.useApp();
  const dispatch = useAppDispatch();
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [modalOpen, setModalOpen] = useState(false);

  const openCreate = () => {
    setEditingTask(undefined);
    setModalOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleBulkDelete = () => {
    modal.confirm({
      title: `Xoá ${selectedRowKeys.length} task đã chọn?`,
      content: 'Các task được chọn sẽ bị xoá vĩnh viễn.',
      okText: 'Xoá tất cả',
      okButtonProps: { danger: true },
      cancelText: 'Huỷ',
      onOk: () => {
        dispatch(deleteManyTasks(selectedRowKeys));
        setSelectedRowKeys([]);
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <Title level={3} className="!mb-1">
            Danh sách task
          </Title>
          <Text type="secondary">
            Quản lý, lọc và cập nhật trạng thái công việc
          </Text>
        </div>
        <Space wrap>
          <Button
            danger
            icon={<DeleteOutlined />}
            disabled={selectedRowKeys.length === 0}
            onClick={handleBulkDelete}
          >
            Xoá đã chọn ({selectedRowKeys.length})
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            Thêm mới
          </Button>
        </Space>
      </div>

      <TaskFilters />

      <TaskTable
        selectedRowKeys={selectedRowKeys}
        onSelectionChange={setSelectedRowKeys}
        onEdit={openEdit}
      />

      <TaskFormModal
        open={modalOpen}
        task={editingTask}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
