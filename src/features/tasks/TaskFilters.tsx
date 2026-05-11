import { useEffect, useRef, useState } from 'react';
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
import { useDebounce } from '@/hooks/useDebounce';

const { RangePicker } = DatePicker;

export function TaskFilters() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters);
  const [searchInput, setSearchInput] = useState(filters.searchText);
  const debouncedSearch = useDebounce(searchInput, 300);

  // Ref tracks the last value we dispatched OR pulled in from the store,
  // preventing a race where a stale debounced value re-applies after Reset.
  const lastSyncedRef = useRef(filters.searchText);

  useEffect(() => {
    if (debouncedSearch !== lastSyncedRef.current) {
      lastSyncedRef.current = debouncedSearch;
      dispatch(setFilter({ searchText: debouncedSearch }));
    }
  }, [debouncedSearch, dispatch]);

  useEffect(() => {
    if (filters.searchText !== lastSyncedRef.current) {
      lastSyncedRef.current = filters.searchText;
      setSearchInput(filters.searchText);
    }
  }, [filters.searchText]);

  return (
    <div className="bg-white p-4 rounded-md shadow-sm space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <Input.Search
          placeholder="Tìm theo tiêu đề..."
          allowClear
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
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
