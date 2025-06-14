import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  Code, 
  Search, 
  Filter, 
  Star, 
  Clock, 
  ChevronDown,
  X,
  ArrowRight,
  Bookmark,
  Loader,
  AlertCircle,
  Play,
  BarChart
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { tutorialAPI, domainAPI, technologyAPI, userAPI } from '../services/api';
import { COLORS } from '../constants/colors';

const TutorialPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State for tutorials, domains, and technologies
  const [tutorials, setTutorials] = useState([]);
  const [domains, setDomains] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [userBookmarks, setUserBookmarks] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  
  // Filter and search state
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [selectedTechnology, setSelectedTechnology] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('-createdAt');
  
  // UI state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);
  
  // Loading and error state
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [error, setError] = useState(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTutorials, setTotalTutorials] = useState(0);
  const tutorialsPerPage = 12;
  
  // Parse query params for initial filter state
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const domainParam = params.get('domain');
    const technologyParam = params.get('technology');
    const difficultyParam = params.get('difficulty');
    const searchParam = params.get('q');
    const pageParam = params.get('page');
    const sortParam = params.get('sort');
    
    if (domainParam) setSelectedDomain(domainParam);
    if (technologyParam) setSelectedTechnology(technologyParam);
    if (difficultyParam) setSelectedDifficulty(difficultyParam);
    if (searchParam) setSearchQuery(searchParam);
    if (pageParam) setCurrentPage(parseInt(pageParam) || 1);
    if (sortParam) setSortBy(sortParam);
  }, [location.search]);
  
  // Fetch initial data
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Fetch user-specific data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated]);
  
  // Re-fetch tutorials when filters change
  useEffect(() => {
    fetchTutorials();
    updateURL();
  }, [selectedDomain, selectedTechnology, selectedDifficulty, searchQuery, sortBy, currentPage]);
  
  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [domainsRes, technologiesRes] = await Promise.all([
        domainAPI.getAll(),
        technologyAPI.getAll()
      ]);

      setDomains(domainsRes.data);
      setTechnologies(technologiesRes.data);
      
    } catch (err) {
      console.error('Error fetching initial data:', err);
      setError('Failed to load filter options. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const [bookmarksRes, progressRes] = await Promise.all([
        userAPI.getBookmarks(),
        userAPI.getProgress()
      ]);

      setUserBookmarks(bookmarksRes.data || []);
      setUserProgress(progressRes.data || []);
    } catch (err) {
      console.warn('Could not fetch user data:', err);
    }
  };
  
  const fetchTutorials = async () => {
    try {
      setIsFiltering(true);
      if (currentPage === 1) setIsLoading(true);
      setError(null);
      
      const filters = {
        page: currentPage,
        limit: tutorialsPerPage,
        sort: sortBy
      };
      
      if (selectedDomain !== 'all') filters.domain = selectedDomain;
      if (selectedTechnology !== 'all') filters.technology = selectedTechnology;
      if (selectedDifficulty !== 'all') filters.difficulty = selectedDifficulty;
      if (searchQuery) filters.search = searchQuery;
      
      const response = await tutorialAPI.getAll(filters);
      const data = response.data;
      
      // Handle both paginated and non-paginated responses
      if (data.tutorials && data.pagination) {
        setTutorials(data.tutorials);
        setTotalPages(data.pagination.pages);
        setTotalTutorials(data.pagination.total);
      } else {
        const tutorialsArray = data.tutorials || data;
        setTutorials(tutorialsArray);
        setTotalTutorials(tutorialsArray.length);
        setTotalPages(Math.ceil(tutorialsArray.length / tutorialsPerPage));
      }
      
    } catch (err) {
      console.error('Error fetching tutorials:', err);
      setError('Failed to load tutorials. Please try again.');
    } finally {
      setIsLoading(false);
      setIsFiltering(false);
    }
  };

  const updateURL = () => {
    const params = new URLSearchParams();
    
    if (selectedDomain !== 'all') params.set('domain', selectedDomain);
    if (selectedTechnology !== 'all') params.set('technology', selectedTechnology);
    if (selectedDifficulty !== 'all') params.set('difficulty', selectedDifficulty);
    if (searchQuery) params.set('q', searchQuery);
    if (currentPage > 1) params.set('page', currentPage.toString());
    if (sortBy !== '-createdAt') params.set('sort', sortBy);
    
    const newUrl = params.toString() 
      ? `${location.pathname}?${params.toString()}`
      : location.pathname;
    
    window.history.replaceState({}, '', newUrl);
  };
  
  // Toggle filter menu
  const toggleFilterMenu = (filterName) => {
    if (activeFilter === filterName) {
      setIsFilterOpen(false);
      setActiveFilter(null);
    } else {
      setIsFilterOpen(true);
      setActiveFilter(filterName);
    }
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSelectedDomain('all');
    setSelectedTechnology('all');
    setSelectedDifficulty('all');
    setSearchQuery('');
    setCurrentPage(1);
    setSortBy('-createdAt');
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Check if tutorial is bookmarked
  const isTutorialBookmarked = (tutorialId) => {
    return userBookmarks.some(bookmark => 
      bookmark._id === tutorialId || bookmark === tutorialId
    );
  };

  // Get user progress for tutorial
  const getTutorialProgress = (tutorialId) => {
    const progress = userProgress.find(p => 
      p.tutorial === tutorialId || 
      (p.tutorial && p.tutorial._id === tutorialId)
    );
    return progress ? progress.completion : 0;
  };

  // Toggle bookmark
  const toggleBookmark = async (e, tutorialId) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      const isBookmarked = isTutorialBookmarked(tutorialId);
      
      if (isBookmarked) {
        await userAPI.removeBookmark(tutorialId);
        setUserBookmarks(prev => prev.filter(b => 
          b._id !== tutorialId && b !== tutorialId
        ));
      } else {
        await userAPI.addBookmark(tutorialId);
        const bookmarksRes = await userAPI.getBookmarks();
        setUserBookmarks(bookmarksRes.data || []);
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
      alert('Failed to update bookmark. Please try again.');
    }
  };
  
  return (
    <div className={`min-h-screen ${COLORS.background.secondary}`}>
      {/* Hero Section */}
      <div className={`${COLORS.background.white} py-16 px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-6xl mx-auto text-center">
          <h1 className={`text-3xl md:text-4xl font-bold ${COLORS.text.dark} mb-4`}>
            Tutorial Library
          </h1>
          <p className={`text-lg ${COLORS.text.secondary} max-w-2xl mx-auto mb-8`}>
            Discover our comprehensive collection of interactive programming tutorials designed to help you master coding skills.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="Search tutorials, topics, or technologies..."
              className={`w-full py-4 pl-12 pr-12 text-lg ${COLORS.background.white} ${COLORS.border.secondary} border-2 rounded-xl ${COLORS.interactive.focus.outline} ${COLORS.interactive.focus.ring} shadow-sm transition-all duration-200 hover:shadow-md`}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              disabled={isLoading}
            />
            <Search className={`absolute left-4 top-5 ${COLORS.text.tertiary}`} size={24} />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className={`absolute right-4 top-5 ${COLORS.text.tertiary} hover:${COLORS.text.secondary} transition-colors`}
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Bar */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex flex-wrap gap-3">
              {/* Domain Filter */}
              <div className="relative">
                <button
                  onClick={() => toggleFilterMenu('domain')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedDomain !== 'all' 
                      ? `${COLORS.background.primary} ${COLORS.text.white} shadow-md` 
                      : `${COLORS.background.white} ${COLORS.text.secondary} ${COLORS.border.secondary} border hover:${COLORS.background.tertiary}`
                  }`}
                  disabled={isLoading || domains.length === 0}
                >
                  <span>
                    {selectedDomain === 'all' 
                      ? 'All Domains' 
                      : domains.find(d => d._id === selectedDomain)?.name || 'Domain'}
                  </span>
                  <ChevronDown size={16} className={`transition-transform ${activeFilter === 'domain' && isFilterOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {activeFilter === 'domain' && isFilterOpen && (
                  <div className={`absolute z-20 mt-2 w-64 ${COLORS.background.white} ${COLORS.border.secondary} border rounded-xl shadow-xl`}>
                    <div className="p-2 max-h-60 overflow-y-auto">
                      <div 
                        className={`px-3 py-2 rounded-lg cursor-pointer transition-colors ${selectedDomain === 'all' ? `${COLORS.background.primaryLight} ${COLORS.text.primary}` : `hover:${COLORS.background.tertiary}`}`}
                        onClick={() => {
                          setSelectedDomain('all');
                          setCurrentPage(1);
                          setIsFilterOpen(false);
                        }}
                      >
                        All Domains
                      </div>
                      {domains.map(domain => (
                        <div 
                          key={domain._id}
                          className={`px-3 py-2 rounded-lg cursor-pointer transition-colors ${selectedDomain === domain._id ? `${COLORS.background.primaryLight} ${COLORS.text.primary}` : `hover:${COLORS.background.tertiary}`}`}
                          onClick={() => {
                            setSelectedDomain(domain._id);
                            setCurrentPage(1);
                            setIsFilterOpen(false);
                          }}
                        >
                          {domain.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Technology Filter */}
              <div className="relative">
                <button
                  onClick={() => toggleFilterMenu('technology')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedTechnology !== 'all' 
                      ? `${COLORS.background.primary} ${COLORS.text.white} shadow-md` 
                      : `${COLORS.background.white} ${COLORS.text.secondary} ${COLORS.border.secondary} border hover:${COLORS.background.tertiary}`
                  }`}
                  disabled={isLoading || technologies.length === 0}
                >
                  <span>
                    {selectedTechnology === 'all' 
                      ? 'All Technologies' 
                      : technologies.find(t => t._id === selectedTechnology)?.name || 'Technology'}
                  </span>
                  <ChevronDown size={16} className={`transition-transform ${activeFilter === 'technology' && isFilterOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {activeFilter === 'technology' && isFilterOpen && (
                  <div className={`absolute z-20 mt-2 w-64 ${COLORS.background.white} ${COLORS.border.secondary} border rounded-xl shadow-xl`}>
                    <div className="p-2 max-h-60 overflow-y-auto">
                      <div 
                        className={`px-3 py-2 rounded-lg cursor-pointer transition-colors ${selectedTechnology === 'all' ? `${COLORS.background.primaryLight} ${COLORS.text.primary}` : `hover:${COLORS.background.tertiary}`}`}
                        onClick={() => {
                          setSelectedTechnology('all');
                          setCurrentPage(1);
                          setIsFilterOpen(false);
                        }}
                      >
                        All Technologies
                      </div>
                      {technologies.map(tech => (
                        <div 
                          key={tech._id}
                          className={`px-3 py-2 rounded-lg cursor-pointer transition-colors ${selectedTechnology === tech._id ? `${COLORS.background.primaryLight} ${COLORS.text.primary}` : `hover:${COLORS.background.tertiary}`}`}
                          onClick={() => {
                            setSelectedTechnology(tech._id);
                            setCurrentPage(1);
                            setIsFilterOpen(false);
                          }}
                        >
                          {tech.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Difficulty Filter */}
              <div className="relative">
                <button
                  onClick={() => toggleFilterMenu('difficulty')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedDifficulty !== 'all' 
                      ? `${COLORS.background.primary} ${COLORS.text.white} shadow-md` 
                      : `${COLORS.background.white} ${COLORS.text.secondary} ${COLORS.border.secondary} border hover:${COLORS.background.tertiary}`
                  }`}
                  disabled={isLoading}
                >
                  <span>
                    {selectedDifficulty === 'all' 
                      ? 'All Levels' 
                      : selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)}
                  </span>
                  <ChevronDown size={16} className={`transition-transform ${activeFilter === 'difficulty' && isFilterOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {activeFilter === 'difficulty' && isFilterOpen && (
                  <div className={`absolute z-20 mt-2 w-48 ${COLORS.background.white} ${COLORS.border.secondary} border rounded-xl shadow-xl`}>
                    <div className="p-2">
                      {['all', 'beginner', 'intermediate', 'advanced'].map(level => (
                        <div 
                          key={level}
                          className={`px-3 py-2 rounded-lg cursor-pointer transition-colors ${selectedDifficulty === level ? `${COLORS.background.primaryLight} ${COLORS.text.primary}` : `hover:${COLORS.background.tertiary}`}`}
                          onClick={() => {
                            setSelectedDifficulty(level);
                            setCurrentPage(1);
                            setIsFilterOpen(false);
                          }}
                        >
                          {level === 'all' ? 'All Levels' : level.charAt(0).toUpperCase() + level.slice(1)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Clear Filters Button */}
              {(selectedDomain !== 'all' || selectedTechnology !== 'all' || selectedDifficulty !== 'all' || searchQuery) && (
                <button
                  onClick={clearFilters}
                  className={`flex items-center gap-2 px-4 py-2 ${COLORS.status.error.bg} ${COLORS.status.error.text} rounded-lg text-sm font-medium hover:bg-red-100 transition-colors`}
                  disabled={isLoading || isFiltering}
                >
                  <X size={14} />
                  Clear Filters
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 ${COLORS.border.secondary} border rounded-lg text-sm ${COLORS.interactive.focus.outline} ${COLORS.interactive.focus.ring}`}
                disabled={isLoading}
              >
                <option value="-createdAt">Newest First</option>
                <option value="createdAt">Oldest First</option>
                <option value="title">Title A-Z</option>
                <option value="-title">Title Z-A</option>
                <option value="difficulty">Difficulty: Easy to Hard</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className={`mb-6 p-4 ${COLORS.status.error.bg} ${COLORS.status.error.text} rounded-lg flex items-center`}>
            <AlertCircle size={18} className="mr-3 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        {/* Results Count */}
        <div className="mb-6 flex justify-between items-center">
          <p className={COLORS.text.secondary}>
            {isFiltering ? (
              <span className="flex items-center gap-2">
                <Loader size={16} className="animate-spin" />
                Filtering tutorials...
              </span>
            ) : (
              <>
                <span className="font-medium">{totalTutorials}</span> {totalTutorials === 1 ? 'tutorial' : 'tutorials'} found
                {searchQuery && <span> for "{searchQuery}"</span>}
                {totalPages > 1 && (
                  <span> (Page {currentPage} of {totalPages})</span>
                )}
              </>
            )}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-16">
            <Loader size={40} className={`animate-spin mx-auto mb-4 ${COLORS.text.primary}`} />
            <p className={COLORS.text.secondary}>Loading tutorials...</p>
          </div>
        )}
        
        {/* Tutorial Cards Grid */}
        {!isLoading && tutorials.length > 0 ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
              {tutorials.map(tutorial => (
                <TutorialCard 
                  key={tutorial._id} 
                  tutorial={tutorial} 
                  user={user}
                  isBookmarked={isTutorialBookmarked(tutorial._id)}
                  progress={getTutorialProgress(tutorial._id)}
                  onBookmarkToggle={(e) => toggleBookmark(e, tutorial._id)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isFiltering}
                  className={`px-4 py-2 ${COLORS.border.secondary} border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:${COLORS.background.tertiary} transition-colors`}
                >
                  Previous
                </button>
                
                {[...Array(Math.min(totalPages, 5))].map((_, index) => {
                  const pageNumber = currentPage <= 3 ? index + 1 : currentPage - 2 + index;
                  if (pageNumber > totalPages) return null;
                  
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      disabled={isFiltering}
                      className={`px-4 py-2 border rounded-lg transition-colors ${
                        currentPage === pageNumber 
                          ? `${COLORS.background.primary} ${COLORS.text.white} ${COLORS.border.primaryDark}` 
                          : `${COLORS.border.secondary} hover:${COLORS.background.tertiary}`
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || isFiltering}
                  className={`px-4 py-2 ${COLORS.border.secondary} border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:${COLORS.background.tertiary} transition-colors`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : !isLoading && (
          <div className={`text-center py-16 ${COLORS.background.white} rounded-xl ${COLORS.border.secondary} border`}>
            <div className={`mx-auto w-16 h-16 ${COLORS.background.tertiary} rounded-full flex items-center justify-center mb-6`}>
              <Search size={28} className={COLORS.text.tertiary} />
            </div>
            <h3 className={`text-xl font-semibold ${COLORS.text.dark} mb-2`}>No tutorials found</h3>
            <p className={`${COLORS.text.secondary} mb-6`}>
              Try adjusting your search or filters to find tutorials.
            </p>
            <button
              onClick={clearFilters}
              className={`inline-flex items-center gap-2 px-6 py-3 ${COLORS.button.primary} rounded-lg transition-colors duration-200`}
            >
              <X size={16} />
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced Tutorial Card Component
const TutorialCard = ({ tutorial, user, isBookmarked = false, progress = 0, onBookmarkToggle }) => {
  const navigate = useNavigate();

  // Get technology icon with colors
  const getTechnologyIcon = (tutorial) => {
    const techName = tutorial.technology?.name?.toLowerCase() || '';
    
    if (techName.includes('html')) return { icon: 'HTML', color: 'from-orange-500 to-red-500' };
    if (techName.includes('css')) return { icon: 'CSS', color: 'from-blue-500 to-cyan-500' };
    if (techName.includes('javascript')) return { icon: 'JS', color: 'from-yellow-400 to-yellow-600' };
    if (techName.includes('react')) return { icon: 'React', color: 'from-cyan-500 to-blue-500' };
    if (techName.includes('node')) return { icon: 'Node', color: 'from-green-500 to-green-600' };
    if (techName.includes('python')) return { icon: 'Py', color: 'from-blue-600 to-purple-600' };
    
    return { 
      icon: tutorial.technology?.name?.substring(0, 2).toUpperCase() || 'CODE', 
      color: COLORS.gradients.primary 
    };
  };

  const handleCardClick = () => {
    navigate(`/tutorials/${tutorial.slug || tutorial._id}`);
  };
  
  const techInfo = getTechnologyIcon(tutorial);
  
  return (
    <div 
      className={`${COLORS.background.white} rounded-xl ${COLORS.border.secondary} border hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group`}
      onClick={handleCardClick}
    >
      {/* Card Header */}
      <div className={`bg-gradient-to-r ${techInfo.color} p-6 relative`}>
        <div className="flex justify-between items-start">
          <div className={`${COLORS.background.white} bg-opacity-20 backdrop-blur-sm rounded-lg p-3 inline-flex items-center justify-center`}>
            <span className="text-white font-bold text-sm">
              {techInfo.icon}
            </span>
          </div>
          
          {/* Bookmark button */}
          {user && (
            <button
              onClick={onBookmarkToggle}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isBookmarked 
                  ? 'text-yellow-400 bg-white bg-opacity-20' 
                  : 'text-white bg-black bg-opacity-20 hover:bg-opacity-30'
              }`}
            >
              <Bookmark size={16} className={isBookmarked ? 'fill-yellow-400' : ''} />
            </button>
          )}
        </div>
      </div>
      
      {/* Card Body */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${COLORS.difficulty[tutorial.difficulty] || COLORS.difficulty.beginner}`}>
            {tutorial.difficulty?.charAt(0).toUpperCase() + tutorial.difficulty?.slice(1) || 'Beginner'}
          </div>
        </div>
        
        <h3 className={`text-lg font-semibold ${COLORS.text.dark} mb-2 group-hover:${COLORS.text.primary} transition-colors`}>
          {tutorial.title}
        </h3>
        
        <p className={`${COLORS.text.secondary} text-sm mb-4 leading-relaxed line-clamp-3`}>
          {tutorial.description}
        </p>
        
        {/* Meta info */}
        <div className={`flex items-center justify-between text-xs mb-4 ${COLORS.text.tertiary}`}>
          <div className="flex items-center gap-1">
            <BookOpen size={14} />
            <span>{tutorial.lessons?.length || 0} lessons</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{tutorial.estimatedTime || 30} min</span>
          </div>
        </div>
        
        {/* Progress bar for logged in users */}
        {user && progress > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-2">
              <span className={`font-medium ${COLORS.text.secondary}`}>Progress</span>
              <span className={COLORS.text.primary}>{Math.round(progress)}%</span>
            </div>
            <div className={`w-full ${COLORS.background.tertiary} rounded-full h-2`}>
              <div 
                className={`${COLORS.background.primary} h-2 rounded-full transition-all duration-300`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {/* Action */}
        <div className={`flex items-center ${COLORS.text.primary} font-medium text-sm group-hover:gap-2 transition-all duration-200`}>
          <Play size={14} className="mr-1" />
          <span>{user && progress > 0 ? 'Continue Learning' : 'Start Learning'}</span>
          <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform duration-200" />
        </div>
      </div>
    </div>
  );
};

export default TutorialPage;