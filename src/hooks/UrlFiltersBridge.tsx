import { useEffect, useRef } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  selectFilters,
  selectPagination,
} from '@/features/tasks/tasksSelectors';
import { setFilter, setPage } from '@/features/tasks/tasksSlice';
import type { TaskPriority, TaskStatus } from '@/types/task';

const STATUS_VALUES: TaskStatus[] = ['todo', 'in_progress', 'done'];
const PRIORITY_VALUES: TaskPriority[] = ['low', 'medium', 'high'];

const isStatus = (v: string): v is TaskStatus =>
  (STATUS_VALUES as string[]).includes(v);
const isPriority = (v: string): v is TaskPriority =>
  (PRIORITY_VALUES as string[]).includes(v);

export function UrlFiltersBridge() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectFilters);
  const pagination = useAppSelector(selectPagination);
  const [params, setParams] = useSearchParams();
  const location = useLocation();
  const hydratedRef = useRef(false);

  const onTasksRoute =
    location.pathname === '/tasks' || location.pathname.startsWith('/tasks/');

  useEffect(() => {
    if (!onTasksRoute || hydratedRef.current) return;
    hydratedRef.current = true;

    const q = params.get('q') ?? '';
    const statusRaw = params.getAll('status').filter(isStatus);
    const priorityRaw = params.get('priority');
    const priority =
      priorityRaw && isPriority(priorityRaw) ? priorityRaw : null;
    const from = params.get('from');
    const to = params.get('to');
    const dateRange = from && to ? ([from, to] as [string, string]) : null;
    const pageRaw = Number(params.get('page'));
    const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;

    dispatch(setFilter({ searchText: q, status: statusRaw, priority, dateRange }));
    if (page > 1) {
      dispatch(setPage({ currentPage: page }));
    }
  }, [onTasksRoute, params, dispatch]);

  useEffect(() => {
    if (!onTasksRoute || !hydratedRef.current) return;

    const next = new URLSearchParams();
    if (filters.searchText) next.set('q', filters.searchText);
    filters.status.forEach((s) => next.append('status', s));
    if (filters.priority) next.set('priority', filters.priority);
    if (filters.dateRange) {
      next.set('from', filters.dateRange[0]);
      next.set('to', filters.dateRange[1]);
    }
    if (pagination.currentPage > 1) {
      next.set('page', String(pagination.currentPage));
    }

    if (next.toString() !== params.toString()) {
      setParams(next, { replace: true });
    }
  }, [filters, pagination, onTasksRoute, params, setParams]);

  useEffect(() => {
    if (!onTasksRoute) {
      hydratedRef.current = false;
    }
  }, [onTasksRoute]);

  return null;
}
