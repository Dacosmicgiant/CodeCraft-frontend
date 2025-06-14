// src/components/layout/MainLayout.jsx
import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Menu } from 'lucide-react';
import Navbar from '../common/Navbar';
import Sidebar from '../common/Sidebar';
import Footer from '../common/Footer';
import { COLORS } from '../../constants/colors';

const MainLayout = () => {
  const [currentTopic, setCurrentTopic] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Check if current page should have sidebar
  const shouldShowSidebar = location.pathname.startsWith('/tutorials') && location.pathname !== '/tutorials';
  
  const handleTopicChange = (topic) => {
    setCurrentTopic(topic);
    setIsSidebarOpen(false);
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
    if (isOpen) {
      setIsSidebarOpen(false);
    }
  };
  
  // Determine if page needs full width (like homepage)
  const isFullWidthPage = location.pathname === '/' || 
                         location.pathname === '/about' || 
                         location.pathname === '/contact' ||
                         location.pathname === '/login' ||
                         location.pathname === '/register';
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onMobileMenuToggle={handleMobileMenuToggle} />
      
      <div className="flex flex-1">
        {/* Main Content */}
        <main className={`flex-1 ${COLORS.background.white} transition-all duration-300`} style={{ marginTop: '64px' }}>
          {isFullWidthPage ? (
            // Full width layout for landing pages
            <div className="min-h-[calc(100vh-64px)]">
              <Outlet />
            </div>
          ) : (
            // Contained layout for content pages
            <div className={`min-h-[calc(100vh-64px)] ${COLORS.background.secondary}`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <Outlet />
              </div>
            </div>
          )}
        </main>
        
        {/* Sidebar - Overlay positioned as before but with better styling */}
        {shouldShowSidebar && (
          <>
            <div 
              id="sidebar-container"
              className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
              style={{ top: '64px' }}
            >
              <div className={`h-full ${COLORS.background.white} ${COLORS.border.secondary} border-r-2 shadow-xl overflow-y-auto backdrop-blur-sm`}>
                <div className={`p-4 ${COLORS.background.primaryLight} border-b-2 ${COLORS.border.primary}`}>
                  <h3 className={`font-semibold ${COLORS.text.primary} text-sm uppercase tracking-wide flex items-center gap-2`}>
                    <Menu size={16} />
                    Course Navigation
                  </h3>
                </div>
                <div className="p-2">
                  <Sidebar
                    currentTopic={currentTopic}
                    onTopicChange={handleTopicChange}
                  />
                </div>
              </div>
            </div>
            
            {/* Sidebar Toggle Button - Enhanced styling */}
            <div 
              id="sidebar-toggle"
              className="fixed z-50"
              style={{ 
                top: '80px', 
                left: isSidebarOpen ? '256px' : '0px',
                transition: 'left 0.3s ease-in-out'
              }}
            >
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`flex items-center justify-center h-12 w-12 ${COLORS.background.primary} ${COLORS.text.white} rounded-r-xl shadow-xl transition-all duration-300 hover:${COLORS.background.primaryHover} transform hover:scale-110 hover:shadow-2xl border-2 border-l-0 ${COLORS.border.primaryDark}`}
                aria-label={isSidebarOpen ? "Hide Navigation" : "Show Navigation"}
              >
                {isSidebarOpen ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
              </button>
            </div>
            
            {/* Enhanced Mobile Backdrop */}
            {isSidebarOpen && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-60 z-30 transition-all duration-300 backdrop-blur-sm"
                style={{ top: '64px' }}
                onClick={() => setIsSidebarOpen(false)}
                aria-hidden="true"
              />
            )}
          </>
        )}
      </div>
      
      {/* Footer - Only show on full-width pages */}
      {isFullWidthPage && <Footer />}
    </div>
  );
};

export default MainLayout;