// src/pages/admin/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { BookOpen, Layers, FileText, Users, ArrowUp, ArrowDown } from 'lucide-react';

const AdminDashboard = () => {
  // Mock data - in a real app, these would come from API calls
  const [stats, setStats] = useState({
    domains: { count: 3, change: 0 },
    technologies: { count: 8, change: 2 },
    lessons: { count: 24, change: 5 },
    users: { count: 132, change: 12 }
  });
  
  const [recentContent, setRecentContent] = useState([
    { id: 1, title: "JavaScript Promises", type: "lesson", date: "2 days ago" },
    { id: 2, title: "React Hooks", type: "technology", date: "5 days ago" },
    { id: 3, title: "CSS Grid Layout", type: "lesson", date: "1 week ago" }
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          title="Domains" 
          count={stats.domains.count} 
          change={stats.domains.change}
          icon={<Layers className="text-emerald-600" size={24} />}
        />
        <StatCard 
          title="Technologies" 
          count={stats.technologies.count} 
          change={stats.technologies.change}
          icon={<BookOpen className="text-blue-600" size={24} />}
        />
        <StatCard 
          title="Lessons" 
          count={stats.lessons.count} 
          change={stats.lessons.change}
          icon={<FileText className="text-yellow-600" size={24} />}
        />
        <StatCard 
          title="Users" 
          count={stats.users.count} 
          change={stats.users.change}
          icon={<Users className="text-purple-600" size={24} />}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Content */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-medium mb-4">Recently Added Content</h2>
          <div className="divide-y">
            {recentContent.map(item => (
              <div key={item.id} className="py-3 flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.type} • {item.date}</p>
                </div>
                <button className="text-emerald-600 hover:text-emerald-800 text-sm font-medium">
                  View
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <button className="text-emerald-600 hover:text-emerald-800 text-sm font-medium">
              View All Content
            </button>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <QuickAction 
              title="Add Domain" 
              description="Create a new learning category"
              link="/admin/domains/new"
              icon={<Layers size={20} />}
            />
            <QuickAction 
              title="Add Technology" 
              description="Add a new technology to a domain"
              link="/admin/technologies/new"
              icon={<BookOpen size={20} />}
            />
            <QuickAction 
              title="Add Lesson" 
              description="Create a new lesson page"
              link="/admin/lessons/new"
              icon={<FileText size={20} />}
            />
            <QuickAction 
              title="Manage Users" 
              description="View and manage user accounts"
              link="/admin/users"
              icon={<Users size={20} />}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, count, change, icon }) => {
  const isPositive = change >= 0;
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold">{count}</p>
        </div>
        <div className="h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center">
          {icon}
        </div>
      </div>
      {change !== 0 && (
        <div className={`mt-2 flex items-center text-sm ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          {isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
          <span className="ml-1">{Math.abs(change)} from last month</span>
        </div>
      )}
    </div>
  );
};

const QuickAction = ({ title, description, link, icon }) => (
  <a 
    href={link} 
    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors flex flex-col"
  >
    <div className="h-8 w-8 bg-emerald-100 rounded-md flex items-center justify-center mb-2 text-emerald-600">
      {icon}
    </div>
    <h3 className="font-medium">{title}</h3>
    <p className="text-sm text-gray-500">{description}</p>
  </a>
);

export default AdminDashboard;