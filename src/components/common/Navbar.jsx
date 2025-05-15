import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Menu, Search, X, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
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
  
  // Handle search input
  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      isScrolled ? 'bg-emerald-600 shadow-md' : 'bg-emerald-600'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-white" />
              <span className="text-xl font-bold text-white">Shubhali's CodeCraft</span>
            </Link>
          </div>
          
          {/* Search Bar - Desktop */}
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
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <NavLink to="/tutorials" active={isActive('/tutorials')}>
                Tutorials
              </NavLink>
              
              {user ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 px-3 py-1.5 text-white hover:bg-emerald-700 rounded-md">
                    <User size={18} />
                    <span>{user.username}</span>
                  </button>
                  <div className="absolute right-0 w-48 py-2 mt-2 bg-white rounded-md shadow-xl z-10 hidden group-hover:block">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Profile
                    </Link>
                    <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Dashboard
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
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
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-white hover:bg-emerald-700 rounded-md focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-emerald-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <MobileNavLink to="/tutorials" active={isActive('/tutorials')}>
              Tutorials
            </MobileNavLink>
            
            {/* Search Bar - Mobile */}
            <div className="p-2">
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
            
            {user ? (
              <>
                <MobileNavLink to="/profile" active={isActive('/profile')}>
                  Profile
                </MobileNavLink>
                <MobileNavLink to="/dashboard" active={isActive('/dashboard')}>
                  Dashboard
                </MobileNavLink>
                <button
                  onClick={logout}
                  className="w-full text-left block px-3 py-2 text-base font-medium text-white hover:bg-emerald-800 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 p-2">
                <Link
                  to="/login"
                  className="block px-3 py-2 text-base font-medium text-center text-white bg-emerald-800 hover:bg-emerald-900 rounded-md"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 text-base font-medium text-center text-emerald-600 bg-white hover:bg-gray-100 rounded-md"
                >
                  Sign Up
                </Link>
              </div>
            )}
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

// Mobile Navigation Link
const MobileNavLink = ({ children, to, active }) => (
  <Link
    to={to}
    className={`block px-3 py-2 rounded-md text-base font-medium ${
      active
        ? 'bg-emerald-800 text-white'
        : 'text-white hover:bg-emerald-800 hover:text-white'
    }`}
  >
    {children}
  </Link>
);

export default Navbar;