import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Menu, Search, X, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { COLORS } from '../../constants/colors';
import scrollLock from './../../utils/scrollLock';

const Navbar = ({ onMobileMenuToggle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const location = useLocation();
  const { user, logout } = useAuth();
  
  // Check if current path matches the nav item
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  // Add scroll event listener to change navbar style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when navigating to a new page
  useEffect(() => {
    if (isOpen) {
      scrollLock.disable(); 
      setIsOpen(false);
    }
    setIsMobileSearchOpen(false);
    setIsDropdownOpen(false);
  }, [location.pathname]);
  
  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Toggle mobile menu and scroll lock
  const toggleMobileMenu = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    
    if (newState) {
      scrollLock.enable();
    } else {
      scrollLock.disable();
    }
    
    if (onMobileMenuToggle) {
      onMobileMenuToggle(newState);
    }
  };
  
  // Toggle dropdown menu
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      scrollLock.disable();
    };
  }, []);
  
  // Handle search input
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to tutorials page with search query
      window.location.href = `/tutorials?q=${encodeURIComponent(searchQuery)}`;
    }
    setIsMobileSearchOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
      isScrolled 
        ? `${COLORS.background.primary} shadow-lg backdrop-blur-md bg-opacity-95` 
        : `${COLORS.background.primary}`
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Main navbar */}
        <div className="flex items-center justify-between h-16 px-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <BookOpen className={`h-7 w-7 ${COLORS.text.white} flex-shrink-0 transition-transform duration-200 group-hover:scale-110`} />
              <span className={`text-lg md:text-xl font-bold ${COLORS.text.white} transition-colors duration-200`}>
                CodeCraft
              </span>
            </Link>
          </div>
          
          {/* Search Bar - Desktop Only */}
          <div className="hidden md:block flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tutorials..."
                  className={`w-full py-2.5 pl-10 pr-4 ${COLORS.text.dark} ${COLORS.background.white} rounded-lg ${COLORS.interactive.focus.outline} ${COLORS.interactive.focus.ring} shadow-sm transition-all duration-200 hover:shadow-md`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className={`absolute left-3 top-3 ${COLORS.text.tertiary}`} size={18} />
              </div>
            </form>
          </div>
          
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-2">
            <NavLink to="/tutorials" active={isActive('/tutorials')}>
              Tutorials
            </NavLink>
            
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={toggleDropdown}
                  className={`flex items-center gap-2 px-4 py-2 ${COLORS.text.white} ${COLORS.interactive.hover.primary} rounded-lg transition-all duration-200 font-medium`}
                >
                  <div className={`w-8 h-8 ${COLORS.background.white} ${COLORS.text.primary} rounded-full flex items-center justify-center font-bold text-sm`}>
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden lg:block">{user.username}</span>
                  <ChevronDown size={16} className={`transform transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isDropdownOpen && (
                  <div className={`absolute right-0 w-52 py-2 mt-2 ${COLORS.background.white} rounded-xl shadow-xl border ${COLORS.border.secondary} z-10 backdrop-blur-sm`}>
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className={`font-medium ${COLORS.text.dark} text-sm`}>{user.username}</p>
                      <p className={`${COLORS.text.tertiary} text-xs`}>{user.email}</p>
                    </div>
                    <DropdownLink 
                      to="/profile" 
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Profile
                    </DropdownLink>
                    <DropdownLink 
                      to="/progress" 
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Progress
                    </DropdownLink>
                    <DropdownLink 
                      to="/bookmarks" 
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Bookmarks
                    </DropdownLink>
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setIsDropdownOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${COLORS.status.error.text} ${COLORS.interactive.hover.secondary} transition-colors duration-200`}
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  to="/login" 
                  className={`px-4 py-2 ${COLORS.text.white} ${COLORS.interactive.hover.primary} rounded-lg transition-all duration-200 font-medium`}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className={`px-4 py-2 ${COLORS.background.white} ${COLORS.text.primary} ${COLORS.interactive.hover.secondary} rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md`}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile Navigation Controls */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Mobile Search Button */}
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className={`p-2.5 ${COLORS.text.white} ${COLORS.interactive.hover.primary} rounded-lg transition-all duration-200`}
              aria-label={isMobileSearchOpen ? "Close search" : "Open search"}
            >
              <Search size={20} />
            </button>
            
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className={`p-2.5 ${COLORS.text.white} ${COLORS.interactive.hover.primary} rounded-lg transition-all duration-200`}
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Search Bar */}
        {isMobileSearchOpen && (
          <div className="px-4 pb-4 md:hidden">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tutorials..."
                  className={`w-full py-3 pl-10 pr-16 ${COLORS.text.dark} ${COLORS.background.white} rounded-lg ${COLORS.interactive.focus.outline} shadow-sm`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <Search className={`absolute left-3 top-3.5 ${COLORS.text.tertiary}`} size={18} />
                <button 
                  type="submit"
                  className={`absolute right-2 top-2 px-3 py-1.5 ${COLORS.background.primary} ${COLORS.text.white} text-sm rounded-md font-medium transition-colors duration-200 hover:bg-opacity-90`}
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      
      {/* Mobile Menu - Full screen overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden" style={{top: '64px'}}>
          <div className={`h-full ${COLORS.background.primary} backdrop-blur-md bg-opacity-95 overflow-y-auto`}>
            <div className="flex flex-col h-full p-6">
              <nav className="flex flex-col gap-2">
                <MobileNavLink to="/tutorials" active={isActive('/tutorials')} onClick={toggleMobileMenu}>
                  Tutorials
                </MobileNavLink>
                
                <MobileNavLink to="/about" active={isActive('/about')} onClick={toggleMobileMenu}>
                  About
                </MobileNavLink>
                
                <MobileNavLink to="/contact" active={isActive('/contact')} onClick={toggleMobileMenu}>
                  Contact
                </MobileNavLink>
                
                <div className="border-t border-emerald-500 border-opacity-30 my-6"></div>
                
                {user ? (
                  <>
                    <div className={`${COLORS.background.primaryHover} rounded-xl p-6 mb-6`}>
                      <div className="flex items-center gap-4 mb-2">
                        <div className={`${COLORS.background.white} rounded-full w-12 h-12 flex items-center justify-center ${COLORS.text.primary} font-bold text-lg`}>
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className={`font-semibold ${COLORS.text.white} text-lg`}>{user.username}</div>
                          <div className="text-emerald-200 text-sm">{user.email}</div>
                        </div>
                      </div>
                    </div>
                    
                    <MobileNavLink to="/profile" active={isActive('/profile')} onClick={toggleMobileMenu}>
                      Profile
                    </MobileNavLink>
                    
                    <MobileNavLink to="/progress" active={isActive('/progress')} onClick={toggleMobileMenu}>
                      Progress
                    </MobileNavLink>
                    
                    <MobileNavLink to="/bookmarks" active={isActive('/bookmarks')} onClick={toggleMobileMenu}>
                      Bookmarks
                    </MobileNavLink>
                    
                    <button
                      onClick={() => {
                        logout();
                        toggleMobileMenu();
                      }}
                      className={`mt-4 w-full text-left py-4 px-6 ${COLORS.background.white} ${COLORS.text.primary} rounded-xl font-semibold transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5`}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="mt-auto flex flex-col gap-4">
                    <Link
                      to="/login"
                      className={`w-full py-4 px-6 ${COLORS.background.primaryHover} ${COLORS.text.white} text-center rounded-xl font-semibold transition-all duration-200 hover:bg-opacity-80`}
                      onClick={toggleMobileMenu}
                    >
                      Login
                    </Link>
                    
                    <Link
                      to="/register"
                      className={`w-full py-4 px-6 ${COLORS.background.white} ${COLORS.text.primary} text-center rounded-xl font-semibold transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5`}
                      onClick={toggleMobileMenu}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </nav>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

// Desktop Navigation Link
const NavLink = ({ children, to, active }) => (
  <Link
    to={to}
    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      active
        ? `${COLORS.background.primaryHover} ${COLORS.text.white} shadow-md`
        : `${COLORS.text.white} ${COLORS.interactive.hover.primary}`
    }`}
  >
    {children}
  </Link>
);

// Mobile Navigation Link
const MobileNavLink = ({ children, to, active, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`py-4 px-6 rounded-xl text-lg font-medium transition-all duration-200 ${
      active
        ? `${COLORS.background.primaryHover} ${COLORS.text.white} shadow-lg`
        : `${COLORS.text.white} hover:bg-white hover:bg-opacity-10`
    }`}
  >
    {children}
  </Link>
);

// Dropdown Link Component
const DropdownLink = ({ children, to, onClick }) => (
  <Link 
    to={to} 
    className={`block px-4 py-2 text-sm ${COLORS.text.secondary} ${COLORS.interactive.hover.secondary} transition-colors duration-200`}
    onClick={onClick}
  >
    {children}
  </Link>
);

export default Navbar;