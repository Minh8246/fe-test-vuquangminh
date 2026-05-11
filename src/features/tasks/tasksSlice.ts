import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  Task,
  TaskFilters,
  TaskPagination,
  TaskStatus,
} from '@/types/task';
import { mockTasks } from './mockTasks';

interface TasksState {
  items: Task[];
  filters: TaskFilters;
  pagination: TaskPagination;
}

const initialFilters: TaskFilters = {
  searchText: '',
  status: [],
  priority: null,
  dateRange: null,
};

const initialState: TasksState = {
  items: mockTasks,
  filters: initialFilters,
  pagination: { currentPage: 1, pageSize: 10 },
};

const generateId = (): string => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `t-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: {
      reducer(state, action: PayloadAction<Task>) {
        state.items.unshift(action.payload);
      },
      prepare(input: Omit<Task, 'id' | 'createdAt'>) {
        return {
          payload: {
            ...input,
            id: generateId(),
            createdAt: new Date().toISOString(),
          } satisfies Task,
        };
      },
    },
    updateTask(state, action: PayloadAction<Task>) {
      const idx = state.items.findIndex((t) => t.id === action.payload.id);
      if (idx !== -1) {
        state.items[idx] = action.payload;
      }
    },
    deleteTask(state, action: PayloadAction<string>) {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
    deleteManyTasks(state, action: PayloadAction<string[]>) {
      const idSet = new Set(action.payload);
      state.items = state.items.filter((t) => !idSet.has(t.id));
    },
    updateTaskStatus(
      state,
      action: PayloadAction<{ id: string; status: TaskStatus }>
    ) {
      const task = state.items.find((t) => t.id === action.payload.id);
      if (task) {
        task.status = action.payload.status;
      }
    },
    setFilter(state, action: PayloadAction<Partial<TaskFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.currentPage = 1;
    },
    resetFilters(state) {
      state.filters = initialFilters;
      state.pagination.currentPage = 1;
    },
    setPage(
      state,
      action: PayloadAction<{ currentPage: number; pageSize?: number }>
    ) {
      state.pagination.currentPage = action.payload.currentPage;
      if (action.payload.pageSize) {
        state.pagination.pageSize = action.payload.pageSize;
      }
    },
  },
});

export const {
  addTask,
  updateTask,
  deleteTask,
  deleteManyTasks,
  updateTaskStatus,
  setFilter,
  resetFilters,
  setPage,
} = tasksSlice.actions;

export default tasksSlice.reducer;
