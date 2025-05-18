// src/pages/Tutorial.jsx
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
import { tutorialAPI, domainAPI, technologyAPI } from '../services/api';

const TutorialPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State for tutorials, domains, and technologies
  const [tutorials, setTutorials] = useState([]);
  const [domains, setDomains] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  
  // Filter and search state
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTechnology, setSelectedTechnology] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // UI state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Loading and error state
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [error, setError] = useState(null);
  
  // Parse query params for initial filter state
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const domainParam = params.get('domain');
    const technologyParam = params.get('technology');
    const difficultyParam = params.get('difficulty');
    const searchParam = params.get('q');
    
    if (domainParam) setSelectedCategory(domainParam);
    if (technologyParam) setSelectedTechnology(technologyParam);
    if (difficultyParam) setSelectedDifficulty(difficultyParam);
    if (searchParam) setSearchQuery(searchParam);
  }, [location.search]);
  
  // Check if the device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  // Fetch domains, technologies, and tutorials
  useEffect(() => {
    fetchDomains();
    fetchTechnologies();
    fetchTutorials();
  }, []);
  
  // Re-fetch tutorials when filters change
  useEffect(() => {
    fetchTutorials({
      domain: selectedCategory !== 'all' ? selectedCategory : undefined,
      technology: selectedTechnology !== 'all' ? selectedTechnology : undefined,
      difficulty: selectedDifficulty !== 'all' ? selectedDifficulty : undefined,
      search: searchQuery || undefined
    });
    
    // Update URL parameters
    const params = new URLSearchParams();
    if (selectedCategory !== 'all') params.set('domain', selectedCategory);
    if (selectedTechnology !== 'all') params.set('technology', selectedTechnology);
    if (selectedDifficulty !== 'all') params.set('difficulty', selectedDifficulty);
    if (searchQuery) params.set('q', searchQuery);
    
    const newUrl = params.toString() 
      ? `${location.pathname}?${params.toString()}`
      : location.pathname;
    
    window.history.replaceState({}, '', newUrl);
    
  }, [selectedCategory, selectedTechnology, selectedDifficulty, searchQuery]);
  
  const fetchDomains = async () => {
    try {
      const response = await domainAPI.getAll();
      setDomains(response.data);
    } catch (err) {
      console.error('Error fetching domains:', err);
      // Non-blocking error - continue with other data
    }
  };
  
  const fetchTechnologies = async () => {
    try {
      const response = await technologyAPI.getAll();
      setTechnologies(response.data);
    } catch (err) {
      console.error('Error fetching technologies:', err);
      // Non-blocking error - continue with other data
    }
  };
  
  const fetchTutorials = async (filters = {}) => {
    try {
      setIsFiltering(true);
      if (!tutorials.length) setIsLoading(true);
      setError(null);
      
      const response = await tutorialAPI.getAll(filters);
      const tutorialsData = response.data.tutorials || response.data;
      
      setTutorials(tutorialsData);
    } catch (err) {
      console.error('Error fetching tutorials:', err);
      setError('Failed to load tutorials. Please try again.');
    } finally {
      setIsLoading(false);
      setIsFiltering(false);
    }
  };
  
  // Filter tutorials based on search if server-side filtering is not available
  const getFilteredTutorials = () => {
    // If we're already filtering server-side, just return the current tutorials
    return tutorials;
  };
  
  const filteredTutorials = getFilteredTutorials();
  
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
    setSelectedCategory('all');
    setSelectedTechnology('all');
    setSelectedDifficulty('all');
    setSearchQuery('');
  };
  
  // Generate tutorial icon based on technology name or provided icon
  const getTutorialIcon = (tutorial) => {
    const techName = tutorial.technology?.name || '';
    
    if (techName.toLowerCase().includes('html')) {
      return <span className="text-lg font-bold text-white">HTML</span>;
    } else if (techName.toLowerCase().includes('css')) {
      return <span className="text-lg font-bold text-white">CSS</span>;
    } else if (techName.toLowerCase().includes('javascript')) {
      return <span className="text-lg font-bold text-white">JS</span>;
    } else if (techName.toLowerCase().includes('react')) {
      return <span className="text-lg font-bold text-white">React</span>;
    } else {
      return <BookOpen size={24} className="text-white" />;
    }
  };
  
  // Generate difficulty badge
  const getDifficultyBadge = (level) => {
    switch (level) {
      case 'beginner':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Beginner</span>;
      case 'intermediate':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Intermediate</span>;
      case 'advanced':
        return <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">Advanced</span>;
      default:
        return null;
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
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isLoading}
          />
          <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>
      
      {/* Category/Filter Bar */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {/* Category Pills */}
          <div className="relative">
            <button
              onClick={() => toggleFilterMenu('domain')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${
                selectedCategory !== 'all' 
                  ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-500' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
              }`}
              disabled={isLoading || domains.length === 0}
            >
              <span>
                {selectedCategory === 'all' 
                  ? 'All Domains' 
                  : domains.find(d => d._id === selectedCategory)?.name || 'Domain'}
              </span>
              <ChevronDown size={16} className={`transition-transform ${activeFilter === 'domain' && isFilterOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {activeFilter === 'domain' && isFilterOpen && (
              <div className="absolute z-20 mt-1 w-48 bg-white border rounded-md shadow-lg">
                <div className="p-2 max-h-60 overflow-y-auto">
                  <div 
                    className={`px-3 py-2 rounded-md cursor-pointer ${selectedCategory === 'all' ? 'bg-emerald-100 text-emerald-700' : 'hover:bg-gray-100'}`}
                    onClick={() => {
                      setSelectedCategory('all');
                      setIsFilterOpen(false);
                    }}
                  >
                    All Domains
                  </div>
                  {domains.map(domain => (
                    <div 
                      key={domain._id}
                      className={`px-3 py-2 rounded-md cursor-pointer ${selectedCategory === domain._id ? 'bg-emerald-100 text-emerald-700' : 'hover:bg-gray-100'}`}
                      onClick={() => {
                        setSelectedCategory(domain._id);
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
          
          {/* Technology Pills */}
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
          
          {/* Difficulty Pills */}
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
                  <div 
                    className={`px-3 py-2 rounded-md cursor-pointer ${selectedDifficulty === 'all' ? 'bg-emerald-100 text-emerald-700' : 'hover:bg-gray-100'}`}
                    onClick={() => {
                      setSelectedDifficulty('all');
                      setIsFilterOpen(false);
                    }}
                  >
                    All Levels
                  </div>
                  <div 
                    className={`px-3 py-2 rounded-md cursor-pointer ${selectedDifficulty === 'beginner' ? 'bg-emerald-100 text-emerald-700' : 'hover:bg-gray-100'}`}
                    onClick={() => {
                      setSelectedDifficulty('beginner');
                      setIsFilterOpen(false);
                    }}
                  >
                    Beginner
                  </div>
                  <div 
                    className={`px-3 py-2 rounded-md cursor-pointer ${selectedDifficulty === 'intermediate' ? 'bg-emerald-100 text-emerald-700' : 'hover:bg-gray-100'}`}
                    onClick={() => {
                      setSelectedDifficulty('intermediate');
                      setIsFilterOpen(false);
                    }}
                  >
                    Intermediate
                  </div>
                  <div 
                    className={`px-3 py-2 rounded-md cursor-pointer ${selectedDifficulty === 'advanced' ? 'bg-emerald-100 text-emerald-700' : 'hover:bg-gray-100'}`}
                    onClick={() => {
                      setSelectedDifficulty('advanced');
                      setIsFilterOpen(false);
                    }}
                  >
                    Advanced
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Clear Filters Button - only show if filters are active */}
          {(selectedCategory !== 'all' || selectedTechnology !== 'all' || selectedDifficulty !== 'all' || searchQuery) && (
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
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md flex items-center">
          <AlertCircle size={18} className="mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      {/* Results Count */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-gray-600">
          {isFiltering ? (
            <span className="flex items-center">
              <Loader size={14} className="animate-spin mr-2" />
              Filtering tutorials...
            </span>
          ) : (
            <>
              {filteredTutorials.length} {filteredTutorials.length === 1 ? 'tutorial' : 'tutorials'} found
              {searchQuery && <span> for "{searchQuery}"</span>}
            </>
          )}
        </p>
      </div>
      
      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <Loader size={36} className="animate-spin mx-auto mb-4 text-emerald-500" />
          <p className="text-gray-500">Loading tutorials...</p>
        </div>
      )}
      
      {/* Tutorial Cards Grid */}
      {!isLoading && filteredTutorials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTutorials.map(tutorial => (
            <TutorialCard 
              key={tutorial._id} 
              tutorial={tutorial} 
              onClick={() => navigate(`/tutorials/${tutorial.slug || tutorial._id}`)}
              user={user}
            />
          ))}
        </div>
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

// Feature Item Component
const Feature = ({ children }) => (
  <div className="flex items-center gap-1 text-sm">
    <Check size={16} className="text-purple-200" />
    <span>{children}</span>
  </div>
);

// Tutorial Card Component
const TutorialCard = ({ tutorial, onClick, user }) => {
  // Determine tutorial color based on technology
  const getTutorialColor = (tutorial) => {
    const techName = tutorial.technology?.name?.toLowerCase() || '';
    
    if (techName.includes('html')) {
      return 'from-orange-500 to-red-500';
    } else if (techName.includes('css')) {
      return 'from-blue-500 to-cyan-500';
    } else if (techName.includes('javascript')) {
      return 'from-yellow-400 to-yellow-600';
    } else if (techName.includes('react')) {
      return 'from-cyan-500 to-blue-500';
    } else {
      return 'from-emerald-500 to-teal-600';
    }
  };
  
  // Get user progress for this tutorial
  const getUserProgress = () => {
    // This would come from the user object or a separate API call
    // For now, we'll return a random value for demonstration
    return Math.random();
  };
  
  // Determine if the tutorial has videos
  const hasVideo = tutorial.lessons?.some(lesson => 
    lesson.content?.some(block => block.type === 'video')
  );
  
  // Calculate the tutorial's estimated time in minutes
  const estimatedTimeMinutes = tutorial.estimatedTime || 30;
  
  // Format the estimated time as hours and minutes
  const formatEstimatedTime = (minutes) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    }
    
    return `${hours}h ${remainingMinutes}m`;
  };
  
  return (
    <div 
      className="flex flex-col rounded-lg border overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer bg-white"
      onClick={onClick}
    >
      {/* Card Header with gradient background */}
      <div className={`bg-gradient-to-r ${getTutorialColor(tutorial)} p-4 h-20`}>
        <div className="flex justify-between items-center">
          <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center">
            {tutorial.technology?.name ? (
              <span className="text-lg font-bold text-white">
                {tutorial.technology.name.substring(0, 2).toUpperCase()}
              </span>
            ) : (
              <BookOpen size={20} className="text-white" />
            )}
          </div>
          
          <div>
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
            
            {hasVideo && (
              <div className="mt-1.5 inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                <Video size={12} className="mr-1" />
                Video
              </div>
            )}
          </div>
        </div>
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
            <span>{formatEstimatedTime(estimatedTimeMinutes)}</span>
          </div>
        </div>
        
        {/* Progress bar (for logged in users) */}
        {user && (
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-gray-700">Your progress</span>
              <span className="text-emerald-600">{Math.round(getUserProgress() * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-emerald-600 h-1.5 rounded-full"
                style={{ width: `${getUserProgress() * 100}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {/* Tags */}
        {tutorial.tags && tutorial.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tutorial.tags.map((tag, index) => (
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
          <span>{user && getUserProgress() > 0 ? 'Continue Learning' : 'Start Learning'}</span>
          <ArrowRight size={16} className="ml-1" />
        </div>
      </div>
    </div>
  );
};

export default TutorialPage;