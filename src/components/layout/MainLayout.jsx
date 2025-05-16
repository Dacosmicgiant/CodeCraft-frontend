import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import Navbar from '../common/Navbar';
import Sidebar from '../common/Sidebar';
import Footer from '../common/Footer';

const MainLayout = () => {
  const [currentTopic, setCurrentTopic] = useState('html');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  
  const handleTopicChange = (topic) => {
    setCurrentTopic(topic);
    setIsSidebarOpen(false); // Close sidebar when topic changes
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
      
      <div className="flex flex-1 relative">
        {/* Sidebar with scrollable content */}
        <div className="fixed inset-y-0 left-0 z-40" style={{ top: '64px' }}>
          {/* This div is for the sidebar content */}
          <div 
            className={`h-full transition-transform duration-300 ease-in-out transform ${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div 
              className={`h-full overflow-y-auto ${isHovering ? 'hover:overflow-y-scroll' : ''}`} 
              style={{ maxHeight: 'calc(100vh - 64px)' }}
            >
              <Sidebar
                topics={topics}
                currentTopic={currentTopic}
                onTopicChange={handleTopicChange}
              />
            </div>
          </div>
          
          {/* Toggle button - always visible, positioned to the right of the sidebar */}
          <div className="absolute top-1/2 left-0 transform -translate-y-1/2">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`flex items-center justify-center h-12 w-8 bg-emerald-600 text-white rounded-r-md hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-md ${
                isSidebarOpen ? 'translate-x-64' : 'translate-x-0'
              }`}
              style={{ 
                transitionProperty: 'transform, background-color',
                transitionDuration: '300ms'
              }}
              aria-label={isSidebarOpen ? "Hide Topics" : "View Topics"}
            >
              {isSidebarOpen ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
            </button>
          </div>
        </div>
        
        {/* Backdrop - Only visible when sidebar is open */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75 z-30 transition-opacity duration-300"
            style={{ top: '64px' }} // Adjust based on your navbar height
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}
        
        {/* Main Content */}
        <main className="flex-1 bg-gray-50">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
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