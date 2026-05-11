import { App as AntdApp, ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { DashboardPage } from "@/pages/DashboardPage";
import { TasksPage } from "@/pages/TasksPage";

function TopNav() {
  const { pathname } = useLocation();
  const linkCls = (active: boolean) =>
    `px-3 py-1.5 rounded ${
      active ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
    }`;
  return (
    <nav className="flex items-center gap-2 mb-6 border-b pb-3">
      <Link to="/" className={linkCls(pathname === "/")}>
        Tổng quan
      </Link>
      <Link to="/tasks" className={linkCls(pathname.startsWith("/tasks"))}>
        Danh sách task
      </Link>
    </nav>
  );
}

function App() {
  return (
    <ConfigProvider locale={viVN}>
      <AntdApp>
        <div className="p-6 max-w-7xl mx-auto">
          <TopNav />
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;
