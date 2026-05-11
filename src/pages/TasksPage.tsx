import { useEffect, useRef, useState } from 'react';
import { App, Button, Space, Typography } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { Task } from '@/types/task';
import type { RootState } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { deleteManyTasks, setFilter } from '@/features/tasks/tasksSlice';
import { TaskFilters } from '@/features/tasks/TaskFilters';
import { TaskTable } from '@/features/tasks/TaskTable';
import { TaskFormModal } from '@/features/tasks/TaskFormModal';
import { useDebounce } from '@/hooks/useDebounce';

const { Title, Text } = Typography;

const selectSearchText = (state: RootState) => state.tasks.filters.searchText;

export function TasksPage() {
  const { modal } = App.useApp();
  const dispatch = useAppDispatch();
  const searchText = useAppSelector(selectSearchText);

  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [modalOpen, setModalOpen] = useState(false);

  const [searchInput, setSearchInput] = useState(searchText);
  const debouncedSearch = useDebounce(searchInput, 300);
  const lastSyncedRef = useRef(searchText);

  useEffect(() => {
    if (debouncedSearch !== lastSyncedRef.current) {
      lastSyncedRef.current = debouncedSearch;
      dispatch(setFilter({ searchText: debouncedSearch }));
    }
  }, [debouncedSearch, dispatch]);

  useEffect(() => {
    if (searchText !== lastSyncedRef.current) {
      lastSyncedRef.current = searchText;
      setSearchInput(searchText);
    }
  }, [searchText]);

  const isSearching = searchInput !== searchText;

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

      <TaskFilters
        searchInput={searchInput}
        onSearchChange={setSearchInput}
      />

      <TaskTable
        loading={isSearching}
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
