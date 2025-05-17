import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Menu, Search, X, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import scrollLock from './../../utils/scrollLock';

const Navbar = ({ onMobileMenuToggle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // New state for dropdown
  const dropdownRef = useRef(null); // Reference for dropdown
  
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
      // Disable scroll lock when navigating away
      scrollLock.disable(); 
      setIsOpen(false);
    }
    setIsMobileSearchOpen(false);
    setIsDropdownOpen(false); // Close dropdown on navigation
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
      // Enable scroll lock
      scrollLock.enable();
    } else {
      // Disable scroll lock
      scrollLock.disable();
    }
    
    // Notify parent component about mobile menu state
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
      // Ensure scroll lock is disabled when component unmounts
      scrollLock.disable();
    };
  }, []);
  
  // Handle search input
  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
    setIsMobileSearchOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
      isScrolled ? 'bg-emerald-600 shadow-md' : 'bg-emerald-600'
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Main navbar */}
        <div className="flex items-center justify-between h-16 px-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <BookOpen className="h-7 w-7 text-white flex-shrink-0" />
              <span className="text-lg md:text-xl font-bold text-white">CodeCraft</span>
            </Link>
          </div>
          
          {/* Search Bar - Desktop Only */}
          <div className="hidden md:block flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tutorials..."
                  className="w-full py-2 pl-10 pr-4 text-gray-800 bg-white rounded-md focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
              </div>
            </form>
          </div>
          
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-4">
            <NavLink to="/tutorials" active={isActive('/tutorials')}>
              Tutorials
            </NavLink>
            
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={toggleDropdown}
                  className="flex items-center gap-2 px-3 py-1.5 text-white hover:bg-emerald-700 rounded-md"
                >
                  <User size={18} />
                  <span>{user.username}</span>
                  <ChevronDown size={16} className={`transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 w-48 py-2 mt-2 bg-white rounded-md shadow-xl z-10">
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link 
                      to="/dashboard" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="px-3 py-1.5 text-white hover:bg-emerald-700 rounded-md">
                  Login
                </Link>
                <Link to="/register" className="px-3 py-1.5 bg-white text-emerald-600 hover:bg-gray-100 rounded-md">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile Navigation Controls */}
          <div className="flex items-center gap-3 md:hidden">
            {/* Mobile Search Button */}
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="p-2 text-white hover:bg-emerald-700 rounded-md"
              aria-label={isMobileSearchOpen ? "Close search" : "Open search"}
            >
              <Search size={22} />
            </button>
            
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-white hover:bg-emerald-700 rounded-md"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobile Search Bar - Shown when search is toggled */}
        {isMobileSearchOpen && (
          <div className="px-4 pb-3 md:hidden">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tutorials..."
                  className="w-full py-2 pl-10 pr-4 text-gray-800 bg-white rounded-md focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
                <button 
                  type="submit"
                  className="absolute right-2 top-1.5 px-2 py-1 bg-emerald-600 text-white text-sm rounded"
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
        <div className="fixed inset-0 z-50 bg-emerald-800 md:hidden mobile-menu-height" style={{top: '64px', width: '100vw', left: 0, right: 0}}>
          <div className="flex flex-col h-full p-4 overflow-y-auto">
            <nav className="flex flex-col gap-2">
              <MobileNavLink to="/tutorials" active={isActive('/tutorials')}>
                Tutorials
              </MobileNavLink>
              
              {/* More menu items can be added here */}
              <MobileNavLink to="/about" active={isActive('/about')}>
                About
              </MobileNavLink>
              
              <MobileNavLink to="/contact" active={isActive('/contact')}>
                Contact
              </MobileNavLink>
              
              <div className="border-t border-emerald-700 my-4"></div>
              
              {user ? (
                <>
                  <div className="bg-emerald-700 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center text-emerald-600 font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-white">{user.username}</div>
                        <div className="text-emerald-300 text-sm">{user.email}</div>
                      </div>
                    </div>
                  </div>
                  
                  <MobileNavLink to="/profile" active={isActive('/profile')}>
                    Profile
                  </MobileNavLink>
                  
                  <MobileNavLink to="/dashboard" active={isActive('/dashboard')}>
                    Dashboard
                  </MobileNavLink>
                  
                  <button
                    onClick={() => {
                      logout();
                      toggleMobileMenu(); // Close menu after logout
                    }}
                    className="mt-2 w-full text-left py-3 px-4 bg-white text-emerald-700 rounded-lg font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="mt-auto flex flex-col gap-3">
                  <Link
                    to="/login"
                    className="w-full py-3 px-4 bg-emerald-700 text-white text-center rounded-lg font-medium hover:bg-emerald-600"
                    onClick={toggleMobileMenu} // Close menu when clicking link
                  >
                    Login
                  </Link>
                  
                  <Link
                    to="/register"
                    className="w-full py-3 px-4 bg-white text-emerald-700 text-center rounded-lg font-medium hover:bg-gray-100"
                    onClick={toggleMobileMenu} // Close menu when clicking link
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>
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
    className={`px-3 py-2 rounded-md text-sm font-medium ${
      active
        ? 'bg-emerald-700 text-white'
        : 'text-white hover:bg-emerald-700 hover:text-white'
    }`}
  >
    {children}
  </Link>
);

// Mobile Navigation Link - fullwidth, larger text
const MobileNavLink = ({ children, to, active }) => (
  <Link
    to={to}
    className={`py-3 px-4 rounded-lg text-base font-medium ${
      active
        ? 'bg-emerald-700 text-white'
        : 'text-white hover:bg-emerald-700'
    }`}
  >
    {children}
  </Link>
);

export default Navbar;