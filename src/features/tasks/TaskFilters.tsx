import { Button, DatePicker, Input, Select } from 'antd';
import { ClearOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import {
  PRIORITY_OPTIONS,
  STATUS_OPTIONS,
  type TaskPriority,
  type TaskStatus,
} from '@/types/task';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { resetFilters, setFilter } from './tasksSlice';
import { selectFilters } from './tasksSelectors';

const { RangePicker } = DatePicker;

interface TaskFiltersProps {
  searchInput: string;
  onSearchChange: (value: string) => void;
}

export function TaskFilters({ searchInput, onSearchChange }: TaskFiltersProps) {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters);

  return (
    <div
      className="p-4 rounded-md shadow-sm space-y-3"
      style={{ background: 'var(--ant-color-bg-container)' }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <Input.Search
          placeholder="Tìm theo tiêu đề..."
          allowClear
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <Select<TaskStatus[]>
          mode="multiple"
          allowClear
          placeholder="Lọc trạng thái"
          options={STATUS_OPTIONS}
          value={filters.status}
          onChange={(status) => dispatch(setFilter({ status }))}
          maxTagCount="responsive"
        />
        <Select<TaskPriority | null>
          allowClear
          placeholder="Lọc độ ưu tiên"
          options={PRIORITY_OPTIONS}
          value={filters.priority}
          onChange={(priority) =>
            dispatch(setFilter({ priority: priority ?? null }))
          }
        />
        <RangePicker
          className="w-full"
          placeholder={['Từ ngày', 'Đến ngày']}
          format="DD/MM/YYYY"
          value={
            filters.dateRange
              ? [dayjs(filters.dateRange[0]), dayjs(filters.dateRange[1])]
              : null
          }
          onChange={(values) => {
            if (!values || !values[0] || !values[1]) {
              dispatch(setFilter({ dateRange: null }));
              return;
            }
            dispatch(
              setFilter({
                dateRange: [
                  values[0].startOf('day').toISOString(),
                  values[1].endOf('day').toISOString(),
                ],
              })
            );
          }}
        />
      </div>

      <div className="flex justify-end">
        <Button
          icon={<ClearOutlined />}
          onClick={() => dispatch(resetFilters())}
        >
          Reset bộ lọc
        </Button>
      </div>
    </div>
  );
}
