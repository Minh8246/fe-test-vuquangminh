import { Layout, Menu, Switch, Typography } from 'antd';
import {
  AppstoreOutlined,
  MoonOutlined,
  ProfileOutlined,
  SunOutlined,
} from '@ant-design/icons';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useTheme } from './ThemeContext';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const menuItems = [
  {
    key: '/',
    icon: <AppstoreOutlined />,
    label: <Link to="/">Tổng quan</Link>,
  },
  {
    key: '/tasks',
    icon: <ProfileOutlined />,
    label: <Link to="/tasks">Danh sách task</Link>,
  },
];

export function AppLayout() {
  const { mode, toggle } = useTheme();
  const { pathname } = useLocation();
  const selectedKey =
    pathname === '/tasks' || pathname.startsWith('/tasks/') ? '/tasks' : '/';

  return (
    <Layout className="min-h-screen">
      <Sider breakpoint="lg" collapsedWidth="0" theme={mode}>
        <div className="h-16 flex items-center justify-center">
          <Title level={4} className="!mb-0" style={{ color: 'var(--ant-color-primary)' }}>
            TaskBoard
          </Title>
        </div>
        <Menu
          mode="inline"
          theme={mode}
          selectedKeys={[selectedKey]}
          items={menuItems}
        />
      </Sider>

      <Layout>
        <Header className="!px-4 flex items-center justify-end">
          <Switch
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<SunOutlined />}
            checked={mode === 'dark'}
            onChange={toggle}
          />
        </Header>
        <Content className="p-4 md:p-6">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
