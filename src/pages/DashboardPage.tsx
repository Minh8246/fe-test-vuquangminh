import { Card, List, Progress, Space, Typography } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileDoneOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { useAppSelector } from '@/store/hooks';
import {
  selectRecentTasks,
  selectTaskStats,
} from '@/features/tasks/tasksSelectors';
import { StatCard } from '@/components/StatCard';
import { StatusTag } from '@/components/StatusTag';
import { PriorityTag } from '@/components/PriorityTag';
import { formatDate } from '@/utils/format';

const { Title, Text } = Typography;

export function DashboardPage() {
  const stats = useAppSelector(selectTaskStats);
  const recent = useAppSelector(selectRecentTasks);

  const donePercent = stats.total
    ? Math.round((stats.done / stats.total) * 100)
    : 0;
  const inProgressPercent = stats.total
    ? Math.round((stats.inProgress / stats.total) * 100)
    : 0;
  const todoPercent = stats.total
    ? Math.round((stats.todo / stats.total) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <Title level={3} className="!mb-1">
          Tổng quan
        </Title>
        <Text type="secondary">Thống kê nhanh tình trạng công việc</Text>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Tổng task"
          value={stats.total}
          prefix={<FileDoneOutlined />}
        />
        <StatCard
          title="Cần làm"
          value={stats.todo}
          prefix={<ClockCircleOutlined />}
          valueColor="#8c8c8c"
        />
        <StatCard
          title="Đang làm"
          value={stats.inProgress}
          prefix={<SyncOutlined spin />}
          valueColor="#1677ff"
        />
        <StatCard
          title="Hoàn thành"
          value={stats.done}
          prefix={<CheckCircleOutlined />}
          valueColor="#52c41a"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card title="Tỉ lệ theo trạng thái" className="lg:col-span-2">
          <Space direction="vertical" size="middle" className="w-full">
            <div>
              <Text>Cần làm</Text>
              <Progress percent={todoPercent} strokeColor="#8c8c8c" />
            </div>
            <div>
              <Text>Đang làm</Text>
              <Progress percent={inProgressPercent} strokeColor="#1677ff" />
            </div>
            <div>
              <Text>Hoàn thành</Text>
              <Progress percent={donePercent} status="success" />
            </div>
          </Space>
        </Card>

        <Card title="5 task tạo gần nhất">
          <List
            size="small"
            dataSource={recent}
            locale={{ emptyText: 'Chưa có task nào' }}
            renderItem={(task) => (
              <List.Item key={task.id} className="!px-0">
                <div className="w-full">
                  <div className="flex items-start justify-between gap-2">
                    <Text strong className="flex-1">
                      {task.title}
                    </Text>
                    <StatusTag status={task.status} />
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs">
                    <PriorityTag priority={task.priority} />
                    <Text type="secondary">
                      Hạn: {formatDate(task.dueDate)}
                    </Text>
                  </div>
                </div>
              </List.Item>
            )}
          />
        </Card>
      </div>
    </div>
  );
}
