import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/store';
import type { Task, TaskStats } from '@/types/task';

export const selectAllTasks = (state: RootState): Task[] => state.tasks.items;
export const selectFilters = (state: RootState) => state.tasks.filters;
export const selectPagination = (state: RootState) => state.tasks.pagination;

export const selectFilteredTasks = createSelector(
  [selectAllTasks, selectFilters],
  (items, filters): Task[] => {
    const { searchText, status, priority, dateRange } = filters;
    const search = searchText.trim().toLowerCase();
    const [from, to] = dateRange ?? [null, null];
    const fromTime = from ? new Date(from).getTime() : null;
    const toTime = to ? new Date(to).getTime() : null;

    return items.filter((task) => {
      if (search && !task.title.toLowerCase().includes(search)) {
        return false;
      }
      if (status.length > 0 && !status.includes(task.status)) {
        return false;
      }
      if (priority && task.priority !== priority) {
        return false;
      }
      if (fromTime !== null || toTime !== null) {
        if (!task.dueDate) return false;
        const due = new Date(task.dueDate).getTime();
        if (fromTime !== null && due < fromTime) return false;
        if (toTime !== null && due > toTime) return false;
      }
      return true;
    });
  }
);

export const selectPaginatedTasks = createSelector(
  [selectFilteredTasks, selectPagination],
  (filtered, { currentPage, pageSize }): Task[] => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }
);

export const selectTaskStats = createSelector(
  [selectAllTasks],
  (items): TaskStats => ({
    total: items.length,
    todo: items.filter((t) => t.status === 'todo').length,
    inProgress: items.filter((t) => t.status === 'in_progress').length,
    done: items.filter((t) => t.status === 'done').length,
  })
);

export const selectRecentTasks = createSelector(
  [selectAllTasks],
  (items): Task[] =>
    [...items]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5)
);
