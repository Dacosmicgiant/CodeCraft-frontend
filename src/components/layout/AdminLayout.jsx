// src/components/layout/AdminLayout.jsx
import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Layers, 
  FileText, 
  Settings, 
  Users, 
  LogOut, 
  Menu, 
  X,
  Book
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { logout } = useAuth();
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-emerald-800 text-white transition-all duration-300 ${
        isSidebarOpen ? 'w-64' : 'w-20'
      }`}>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-8 w-8" />
            {isSidebarOpen && <span className="font-bold text-xl">CodeCraft</span>}
          </div>
          <button onClick={toggleSidebar} className="text-white p-1 rounded-md hover:bg-emerald-700">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        <nav className="mt-6">
          <SidebarLink to="/admin" icon={<LayoutDashboard size={20} />} text="Dashboard" isCollapsed={!isSidebarOpen} />
          <SidebarLink to="/admin/domains" icon={<Layers size={20} />} text="Domains" isCollapsed={!isSidebarOpen} />
          <SidebarLink to="/admin/technologies" icon={<BookOpen size={20} />} text="Technologies" isCollapsed={!isSidebarOpen} />
          <SidebarLink to="/admin/tutorials" icon={<Book size={20} />} text="Tutorials" isCollapsed={!isSidebarOpen} />
          <SidebarLink to="/admin/lessons" icon={<FileText size={20} />} text="Lessons" isCollapsed={!isSidebarOpen} />
          <SidebarLink to="/admin/users" icon={<Users size={20} />} text="Users" isCollapsed={!isSidebarOpen} />
          <SidebarLink to="/admin/settings" icon={<Settings size={20} />} text="Settings" isCollapsed={!isSidebarOpen} />
          
          <div className="mt-auto pt-20">
            <button 
              onClick={logout}
              className={`flex items-center w-full px-4 py-3 hover:bg-emerald-700 transition-colors ${
                isSidebarOpen ? 'justify-start' : 'justify-center'
              }`}
            >
              <LogOut size={20} />
              {isSidebarOpen && <span className="ml-3">Logout</span>}
            </button>
          </div>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <Link to="/" className="text-sm text-emerald-600 hover:text-emerald-800">
                View Site
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-800 font-bold">
                  A
                </div>
                <span className="text-sm font-medium">Admin</span>
              </div>
            </div>
          </div>
        </header>
        
        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const SidebarLink = ({ to, icon, text, isCollapsed }) => (
  <Link 
    to={to} 
    className={`flex items-center px-4 py-3 hover:bg-emerald-700 transition-colors ${
      isCollapsed ? 'justify-center' : 'justify-start'
    }`}
  >
    {icon}
    {!isCollapsed && <span className="ml-3">{text}</span>}
  </Link>
);

export default AdminLayout;