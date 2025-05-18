// src/components/layout/MainLayout.jsx (unchanged)
import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import Navbar from '../common/Navbar';
import Sidebar from '../common/Sidebar';
import Footer from '../common/Footer';

const MainLayout = () => {
  const [currentTopic, setCurrentTopic] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  const handleTopicChange = (topic) => {
    setCurrentTopic(topic);
    setIsSidebarOpen(false); // Close sidebar when topic changes
  };
  
  // Close sidebar on navigation and on initial load
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById('sidebar-container');
      const toggleButton = document.getElementById('sidebar-toggle');
      
      if (isSidebarOpen && 
          sidebar && 
          !sidebar.contains(event.target) && 
          toggleButton && 
          !toggleButton.contains(event.target)) {
        setIsSidebarOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen]);
  
  // Extract current topic from URL path
  useEffect(() => {
    const path = location.pathname;
    const pathSegments = path.split('/');
    
    if (pathSegments.length > 2 && pathSegments[1] === 'tutorials') {
      setCurrentTopic(pathSegments[2]);
    }
  }, [location.pathname]);
  
  // Handle mobile menu state changes from navbar
  const handleMobileMenuToggle = (isOpen) => {
    setIsMobileMenuOpen(isOpen);
    // Close sidebar if mobile menu is opened
    if (isOpen) {
      setIsSidebarOpen(false);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onMobileMenuToggle={handleMobileMenuToggle} />
      
      <div className="flex flex-1 pt-16">
        {/* Main Content - Always full width */}
        <main className="w-full flex-1 bg-gray-50">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {/* Outlet for nested routes */}
            <Outlet />
          </div>
        </main>
        
        {/* Sidebar - Positioned as overlay with fixed position */}
        <div 
          id="sidebar-container"
          className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          style={{ top: '64px', width: '16rem' }}
        >
          <div className="h-full bg-white border-r overflow-y-auto">
            <Sidebar
              currentTopic={currentTopic}
              onTopicChange={handleTopicChange}
            />
          </div>
        </div>
        
        {/* Sidebar Toggle Button - Hidden when mobile menu is open */}
        {!isMobileMenuOpen && (
          <div 
            id="sidebar-toggle"
            className="fixed z-50 top-20 left-0"
          >
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`flex items-center justify-center h-10 w-10 bg-emerald-600 text-white rounded-r-md shadow-md transition-all duration-300 ${
                isSidebarOpen ? 'translate-x-64' : 'translate-x-0'
              }`}
              aria-label={isSidebarOpen ? "Hide Topics" : "View Topics"}
            >
              {isSidebarOpen ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
            </button>
          </div>
        )}
        
        {/* Dark Backdrop - Only visible when sidebar is open */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300"
            style={{ top: '64px' }}
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
          ></div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default MainLayout;