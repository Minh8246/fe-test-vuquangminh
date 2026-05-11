import { describe, expect, it } from 'vitest';
import {
  selectFilteredTasks,
  selectPaginatedTasks,
  selectRecentTasks,
  selectTaskStats,
} from '@/features/tasks/tasksSelectors';
import type { Task } from '@/types/task';
import type { RootState } from '@/store';

const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'Alpha task',
    status: 'todo',
    priority: 'high',
    createdAt: '2026-04-01T00:00:00.000Z',
    dueDate: '2026-05-15T00:00:00.000Z',
  },
  {
    id: '2',
    title: 'Beta task',
    status: 'in_progress',
    priority: 'medium',
    createdAt: '2026-04-05T00:00:00.000Z',
    dueDate: '2026-06-15T00:00:00.000Z',
  },
  {
    id: '3',
    title: 'Gamma task without dueDate',
    status: 'done',
    priority: 'low',
    createdAt: '2026-04-10T00:00:00.000Z',
  },
  {
    id: '4',
    title: 'Alpha duplicate',
    status: 'todo',
    priority: 'low',
    createdAt: '2026-04-12T00:00:00.000Z',
  },
];

const buildState = (overrides: Partial<RootState['tasks']> = {}): RootState =>
  ({
    tasks: {
      items: sampleTasks,
      filters: {
        searchText: '',
        status: [],
        priority: null,
        dateRange: null,
      },
      pagination: { currentPage: 1, pageSize: 2 },
      ...overrides,
    },
  } as RootState);

describe('selectTaskStats', () => {
  it('counts total and breakdown by status', () => {
    const stats = selectTaskStats(buildState());
    expect(stats).toEqual({ total: 4, todo: 2, inProgress: 1, done: 1 });
  });

  it('returns zeros when items is empty', () => {
    const stats = selectTaskStats(buildState({ items: [] }));
    expect(stats).toEqual({ total: 0, todo: 0, inProgress: 0, done: 0 });
  });
});

describe('selectFilteredTasks', () => {
  it('returns all tasks when no filter applied', () => {
    const result = selectFilteredTasks(buildState());
    expect(result.map((t) => t.id)).toEqual(['1', '2', '3', '4']);
  });

  it('filters by case-insensitive search on title', () => {
    const result = selectFilteredTasks(
      buildState({
        filters: {
          searchText: 'alpha',
          status: [],
          priority: null,
          dateRange: null,
        },
      })
    );
    expect(result.map((t) => t.id)).toEqual(['1', '4']);
  });

  it('filters by multi-status (todo + done)', () => {
    const result = selectFilteredTasks(
      buildState({
        filters: {
          searchText: '',
          status: ['todo', 'done'],
          priority: null,
          dateRange: null,
        },
      })
    );
    expect(result.map((t) => t.id).sort()).toEqual(['1', '3', '4']);
  });

  it('filters by priority low', () => {
    const result = selectFilteredTasks(
      buildState({
        filters: {
          searchText: '',
          status: [],
          priority: 'low',
          dateRange: null,
        },
      })
    );
    expect(result.map((t) => t.id)).toEqual(['3', '4']);
  });

  it('filters by date range and excludes tasks without dueDate', () => {
    const result = selectFilteredTasks(
      buildState({
        filters: {
          searchText: '',
          status: [],
          priority: null,
          dateRange: [
            '2026-05-01T00:00:00.000Z',
            '2026-05-31T23:59:59.999Z',
          ],
        },
      })
    );
    
    expect(result.map((t) => t.id)).toEqual(['1']);
  });

  it('combines multiple filters (search + status)', () => {
    const result = selectFilteredTasks(
      buildState({
        filters: {
          searchText: 'alpha',
          status: ['todo'],
          priority: null,
          dateRange: null,
        },
      })
    );
    expect(result.map((t) => t.id)).toEqual(['1', '4']);
  });
});

describe('selectPaginatedTasks', () => {
  it('returns pageSize items based on currentPage', () => {
    const page1 = selectPaginatedTasks(
      buildState({ pagination: { currentPage: 1, pageSize: 2 } })
    );
    const page2 = selectPaginatedTasks(
      buildState({ pagination: { currentPage: 2, pageSize: 2 } })
    );
    expect(page1.map((t) => t.id)).toEqual(['1', '2']);
    expect(page2.map((t) => t.id)).toEqual(['3', '4']);
  });

  it('returns empty array when page out of range', () => {
    const page99 = selectPaginatedTasks(
      buildState({ pagination: { currentPage: 99, pageSize: 2 } })
    );
    expect(page99).toEqual([]);
  });
});

describe('selectRecentTasks', () => {
  it('returns up to 5 tasks sorted by createdAt desc', () => {
    const result = selectRecentTasks(buildState());
    // Sorted: 4 (Apr 12) > 3 (Apr 10) > 2 (Apr 5) > 1 (Apr 1)
    expect(result.map((t) => t.id)).toEqual(['4', '3', '2', '1']);
  });
});
