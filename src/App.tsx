import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import { DashboardPage } from '@/pages/DashboardPage';

function App() {
  return (
    <ConfigProvider locale={viVN}>
      <div className="p-6 max-w-7xl mx-auto">
        <DashboardPage />
      </div>
    </ConfigProvider>
  );
}

export default App;
