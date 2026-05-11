import { useMemo } from 'react';
import { App as AntdApp, ConfigProvider, theme as antdTheme } from 'antd';
import viVN from 'antd/locale/vi_VN';
import { Navigate, Route, Routes } from 'react-router-dom';
import { DashboardPage } from '@/pages/DashboardPage';
import { TasksPage } from '@/pages/TasksPage';
import { AppLayout } from '@/app/Layout';
import { ThemeProvider, useTheme } from '@/app/ThemeContext';
import { UrlFiltersBridge } from '@/hooks/UrlFiltersBridge';

function ThemedApp() {
  const { mode } = useTheme();
  const isDark = mode === 'dark';

  const themeConfig = useMemo(
    () => ({
      cssVar: true,
      hashed: false,
      algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      token: { colorPrimary: '#1677ff', borderRadius: 6 },
      components: {
        Layout: {
          headerBg: isDark ? '#141414' : '#ffffff',
          siderBg: isDark ? '#141414' : '#ffffff',
          bodyBg: isDark ? '#141414' : '#f5f5f5',
          triggerBg: isDark ? '#1f1f1f' : '#f5f5f5',
          triggerColor: isDark ? '#ffffff' : '#000000',
        },
        Menu: {
          itemBg: 'transparent',
        },
      },
    }),
    [isDark],
  );
  return (
    <ConfigProvider locale={viVN} theme={themeConfig}>
      <AntdApp>
        <UrlFiltersBridge />
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AntdApp>
    </ConfigProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
}

export default App;
