import { Card, Statistic } from 'antd';
import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: number;
  prefix?: ReactNode;
  valueColor?: string;
}

export function StatCard({ title, value, prefix, valueColor }: StatCardProps) {
  return (
    <Card variant="borderless" className="shadow-sm">
      <Statistic
        title={title}
        value={value}
        prefix={prefix}
        valueStyle={valueColor ? { color: valueColor } : undefined}
      />
    </Card>
  );
}
