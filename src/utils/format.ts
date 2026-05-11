import dayjs from 'dayjs';

export const formatDate = (iso?: string): string =>
  iso ? dayjs(iso).format('DD/MM/YYYY') : '—';

export const formatDateTime = (iso?: string): string =>
  iso ? dayjs(iso).format('DD/MM/YYYY HH:mm') : '—';
