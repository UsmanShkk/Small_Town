import Sidebar from '../components/sidebar';
import Topbar from '../components/topbar';
import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-100 min-h-screen flex flex-col">
        <Topbar />
        <main className="p-6 flex-1">
          {/* Show current admin page here */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
