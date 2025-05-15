import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Sidebar from '../common/Sidebar';
import Footer from '../common/Footer';

const MainLayout = () => {
  const [currentTopic, setCurrentTopic] = useState('html');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const handleTopicChange = (topic) => {
    setCurrentTopic(topic);
    setIsSidebarOpen(false); // Close sidebar on mobile when topic changes
  };
  
  // Sample topics data (would be fetched from API in real app)
  const topics = [
    { id: 'html', title: 'HTML', category: 'Web Development' },
    { id: 'css', title: 'CSS', category: 'Web Development' },
    { id: 'javascript', title: 'JavaScript', category: 'Web Development' },
    { id: 'react', title: 'React', category: 'Web Development' },
    { id: 'nodejs', title: 'Node.js', category: 'Web Development' },
    { id: 'python', title: 'Python', category: 'Programming' },
    { id: 'java', title: 'Java', category: 'Programming' },
    { id: 'cpp', title: 'C++', category: 'Programming' },
    { id: 'arrays', title: 'Arrays', category: 'Data Structures' },
    { id: 'linked-lists', title: 'Linked Lists', category: 'Data Structures' },
    { id: 'trees', title: 'Trees', category: 'Data Structures' },
  ];
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex flex-1">
        {/* Sidebar - Hidden on mobile, visible on desktop */}
        <div className="hidden md:block">
          <Sidebar
            topics={topics}
            currentTopic={currentTopic}
            onTopicChange={handleTopicChange}
          />
        </div>
        
        {/* Mobile Sidebar - Only shows when open */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-gray-600 bg-opacity-75"
              onClick={() => setIsSidebarOpen(false)}
            ></div>
            
            {/* Sidebar */}
            <div className="relative flex flex-col w-72 max-w-xs h-full bg-white">
              <div className="absolute top-0 right-0 p-1">
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                >
                  <span className="sr-only">Close sidebar</span>
                  <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <Sidebar
                topics={topics}
                currentTopic={currentTopic}
                onTopicChange={handleTopicChange}
              />
            </div>
          </div>
        )}
        
        {/* Main Content */}
        <main className="flex-1 bg-gray-50">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {/* Toggle Sidebar Button - Mobile Only */}
            <div className="px-4 sm:px-0 mb-4 md:hidden">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
              >
                View Topics
              </button>
            </div>
            
            {/* Outlet for nested routes */}
            <Outlet />
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default MainLayout;