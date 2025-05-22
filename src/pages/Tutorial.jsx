import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  Code, 
  Search, 
  Filter, 
  Star, 
  Clock, 
  BarChart, 
  Award,
  ChevronDown,
  X,
  ArrowRight,
  Video,
  Bookmark,
  Check,
  Loader,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { tutorialAPI, domainAPI, technologyAPI, userAPI } from '../services/api';
import TutorialCategories from '../components/tutorial/TutorialCategories';

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
  const [sortBy, setSortBy] = useState('-createdAt'); // Default sort by newest
  
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
        // Paginated response
        setTutorials(data.tutorials);
        setTotalPages(data.pagination.pages);
        setTotalTutorials(data.pagination.total);
      } else {
        // Non-paginated response
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
        // For simplicity, refetch bookmarks
        const bookmarksRes = await userAPI.getBookmarks();
        setUserBookmarks(bookmarksRes.data || []);
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
      alert('Failed to update bookmark. Please try again.');
    }
  };
  
  return (
    <div className="container-fluid px-4 py-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Tutorial Library</h1>
        <p className="text-gray-600">
          Learn coding with our collection of interactive tutorials and video lessons.
        </p>
      </div>
      
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for tutorials, topics, or keywords..."
            className="w-full py-3 pl-10 pr-4 text-gray-700 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
            disabled={isLoading}
          />
          <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setCurrentPage(1);
              }}
              className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>
      
      {/* Filter and Sort Bar */}
      <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {/* Domain Filter */}
          <div className="relative">
            <button
              onClick={() => toggleFilterMenu('domain')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${
                selectedDomain !== 'all' 
                  ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-500' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
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
              <div className="absolute z-20 mt-1 w-48 bg-white border rounded-md shadow-lg">
                <div className="p-2 max-h-60 overflow-y-auto">
                  <div 
                    className={`px-3 py-2 rounded-md cursor-pointer ${selectedDomain === 'all' ? 'bg-emerald-100 text-emerald-700' : 'hover:bg-gray-100'}`}
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
                      className={`px-3 py-2 rounded-md cursor-pointer ${selectedDomain === domain._id ? 'bg-emerald-100 text-emerald-700' : 'hover:bg-gray-100'}`}
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
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${
                selectedTechnology !== 'all' 
                  ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-500' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
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
              <div className="absolute z-20 mt-1 w-48 bg-white border rounded-md shadow-lg">
                <div className="p-2 max-h-60 overflow-y-auto">
                  <div 
                    className={`px-3 py-2 rounded-md cursor-pointer ${selectedTechnology === 'all' ? 'bg-emerald-100 text-emerald-700' : 'hover:bg-gray-100'}`}
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
                      className={`px-3 py-2 rounded-md cursor-pointer ${selectedTechnology === tech._id ? 'bg-emerald-100 text-emerald-700' : 'hover:bg-gray-100'}`}
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
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${
                selectedDifficulty !== 'all' 
                  ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-500' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
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
              <div className="absolute z-20 mt-1 w-48 bg-white border rounded-md shadow-lg">
                <div className="p-2">
                  {['all', 'beginner', 'intermediate', 'advanced'].map(level => (
                    <div 
                      key={level}
                      className={`px-3 py-2 rounded-md cursor-pointer ${selectedDifficulty === level ? 'bg-emerald-100 text-emerald-700' : 'hover:bg-gray-100'}`}
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
              className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-full text-sm font-medium hover:bg-red-100"
              disabled={isLoading || isFiltering}
            >
              <X size={14} />
              Clear Filters
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
      
      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md flex items-center">
          <AlertCircle size={18} className="mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      {/* Results Count and Status */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-gray-600">
          {isFiltering ? (
            <span className="flex items-center">
              <Loader size={14} className="animate-spin mr-2" />
              Filtering tutorials...
            </span>
          ) : (
            <>
              {totalTutorials} {totalTutorials === 1 ? 'tutorial' : 'tutorials'} found
              {searchQuery && <span> for "{searchQuery}"</span>}
              {totalPages > 1 && (
                <span> (Page {currentPage} of {totalPages})</span>
              )}
            </>
          )}
        </p>
      </div>

      {/* Featured Categories Component
      <TutorialCategories /> */}
      
      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <Loader size={36} className="animate-spin mx-auto mb-4 text-emerald-500" />
          <p className="text-gray-500">Loading tutorials...</p>
        </div>
      )}
      
      {/* Tutorial Cards Grid */}
      {!isLoading && tutorials.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isFiltering}
                className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
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
                    className={`px-3 py-2 border border-gray-300 rounded-md ${
                      currentPage === pageNumber 
                        ? 'bg-emerald-600 text-white border-emerald-600' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isFiltering}
                className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : !isLoading && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border">
          <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <Search size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tutorials found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search or filters to find tutorials.
          </p>
          <button
            onClick={clearFilters}
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
          >
            <X size={16} className="mr-2" />
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};

// Tutorial Card Component - Updated with backend data
const TutorialCard = ({ tutorial, user, isBookmarked = false, progress = 0, onBookmarkToggle }) => {
  const navigate = useNavigate();

  // Get tutorial color based on technology
  const getTutorialColor = (tutorial) => {
    const techName = tutorial.technology?.name?.toLowerCase() || '';
    
    if (techName.includes('html')) return 'from-orange-500 to-red-500';
    if (techName.includes('css')) return 'from-blue-500 to-cyan-500';
    if (techName.includes('javascript')) return 'from-yellow-400 to-yellow-600';
    if (techName.includes('react')) return 'from-cyan-500 to-blue-500';
    if (techName.includes('node')) return 'from-green-500 to-green-600';
    if (techName.includes('python')) return 'from-blue-600 to-purple-600';
    return 'from-emerald-500 to-teal-600';
  };

  // Get technology icon
  const getTechnologyIcon = (tutorial) => {
    const techName = tutorial.technology?.name || '';
    return (
      <span className="text-lg font-bold text-white">
        {techName.substring(0, 2).toUpperCase()}
      </span>
    );
  };

  // Format estimated time
  const formatEstimatedTime = (minutes) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) return `${hours}h`;
    return `${hours}h ${remainingMinutes}m`;
  };

  const handleCardClick = () => {
    navigate(`/tutorials/${tutorial.slug || tutorial._id}`);
  };
  
  return (
    <div 
      className="flex flex-col rounded-lg border overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer bg-white"
      onClick={handleCardClick}
    >
      {/* Card Header with gradient background */}
      <div className={`bg-gradient-to-r ${getTutorialColor(tutorial)} p-4 h-20 relative`}>
        <div className="flex justify-between items-center">
          <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center">
            {getTechnologyIcon(tutorial)}
          </div>
          
          <div className="flex flex-col items-end gap-1">
            {tutorial.difficulty && (
              <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                tutorial.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                tutorial.difficulty === 'intermediate' ? 'bg-blue-100 text-blue-800' :
                tutorial.difficulty === 'advanced' ? 'bg-purple-100 text-purple-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {tutorial.difficulty.charAt(0).toUpperCase() + tutorial.difficulty.slice(1)}
              </div>
            )}
          </div>
        </div>

        {/* Bookmark button */}
        {user && (
          <button
            onClick={onBookmarkToggle}
            className={`absolute top-2 right-2 p-1.5 rounded-full transition-colors ${
              isBookmarked 
                ? 'text-yellow-400 bg-white bg-opacity-20' 
                : 'text-white bg-black bg-opacity-20 hover:bg-opacity-30'
            }`}
          >
            <Bookmark size={16} className={isBookmarked ? 'fill-yellow-400' : ''} />
          </button>
        )}
      </div>
      
      {/* Card Body */}
      <div className="flex-1 p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-1 line-clamp-1">{tutorial.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{tutorial.description}</p>
        
        {/* Meta info */}
        <div className="flex justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center">
            <BookOpen size={14} className="mr-1" />
            <span>{tutorial.lessons?.length || 0} lessons</span>
          </div>
          <div className="flex items-center">
            <Clock size={14} className="mr-1" />
            <span>{formatEstimatedTime(tutorial.estimatedTime || 30)}</span>
          </div>
        </div>
        
        {/* Progress bar (for logged in users) */}
        {user && progress > 0 && (
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-gray-700">Your progress</span>
              <span className="text-emerald-600">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-emerald-600 h-1.5 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {/* Tags */}
        {tutorial.tags && tutorial.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tutorial.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Action button */}
        <div className="flex items-center text-emerald-600 font-medium text-sm">
          <span>{user && progress > 0 ? 'Continue Learning' : 'Start Learning'}</span>
          <ArrowRight size={16} className="ml-1" />
        </div>
      </div>
    </div>
  );
};

export default TutorialPage;