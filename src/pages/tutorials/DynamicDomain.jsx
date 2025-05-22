import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  BarChart, 
  Star,
  Play,
  Bookmark,
  Users,
  Code,
  AlertCircle,
  Loader,
  ArrowRight,
  Search,
  Filter,
  SortAsc,
  Folder,
  ChevronRight,
  Award,
  Target
} from 'lucide-react';
import { domainAPI, technologyAPI, tutorialAPI, userAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const DynamicDomain = () => {
  const { domainSlug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [domain, setDomain] = useState(null);
  const [technologies, setTechnologies] = useState([]);
  const [tutorials, setTutorials] = useState([]);
  const [userBookmarks, setUserBookmarks] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [selectedTechnology, setSelectedTechnology] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [sortBy, setSortBy] = useState('-createdAt');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('tutorials'); // 'tutorials' or 'technologies'
  
  useEffect(() => {
    fetchDomainData();
  }, [domainSlug]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (domain) {
      fetchTechnologies();
      fetchTutorials();
    }
  }, [domain, selectedTechnology, difficultyFilter, sortBy, searchQuery]);

  const fetchDomainData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch domain details
      const domainResponse = await domainAPI.getById(domainSlug);
      const domainData = domainResponse.data;
      
      setDomain(domainData);
      
    } catch (err) {
      console.error('Error fetching domain:', err);
      setError('Domain not found or failed to load.');
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

  const fetchTechnologies = async () => {
    try {
      const technologiesResponse = await technologyAPI.getAll({ domain: domain._id });
      const technologiesData = technologiesResponse.data;
      setTechnologies(technologiesData);
    } catch (err) {
      console.error('Error fetching technologies:', err);
    }
  };

  const fetchTutorials = async () => {
    try {
      const filters = {
        domain: domain._id,
        sort: sortBy
      };
      
      if (selectedTechnology !== 'all') {
        filters.technology = selectedTechnology;
      }
      
      if (difficultyFilter !== 'all') {
        filters.difficulty = difficultyFilter;
      }
      
      if (searchQuery) {
        filters.search = searchQuery;
      }
      
      const tutorialsResponse = await tutorialAPI.getAll(filters);
      const tutorialsData = tutorialsResponse.data.tutorials || tutorialsResponse.data;
      setTutorials(tutorialsData);
      
    } catch (err) {
      console.error('Error fetching tutorials:', err);
      setError('Failed to load tutorials for this domain.');
    }
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

  // Get domain icon based on name
  const getDomainIcon = () => {
    const name = domain?.name?.toLowerCase() || '';
    
    if (name.includes('web')) return '🌐';
    if (name.includes('mobile')) return '📱';
    if (name.includes('data')) return '📊';
    if (name.includes('game')) return '🎮';
    if (name.includes('ai') || name.includes('machine')) return '🤖';
    if (name.includes('cloud')) return '☁️';
    if (name.includes('security')) return '🔒';
    if (name.includes('design')) return '🎨';
    return '💻';
  };

  // Get domain color scheme
  const getDomainColors = () => {
    const name = domain?.name?.toLowerCase() || '';
    
    if (name.includes('web')) return { bg: 'from-blue-500 to-cyan-500', text: 'text-blue-700' };
    if (name.includes('mobile')) return { bg: 'from-green-500 to-emerald-500', text: 'text-green-700' };
    if (name.includes('data')) return { bg: 'from-purple-500 to-indigo-500', text: 'text-purple-700' };
    if (name.includes('game')) return { bg: 'from-pink-500 to-rose-500', text: 'text-pink-700' };
    if (name.includes('ai') || name.includes('machine')) return { bg: 'from-indigo-500 to-purple-500', text: 'text-indigo-700' };
    if (name.includes('cloud')) return { bg: 'from-gray-500 to-slate-500', text: 'text-gray-700' };
    if (name.includes('security')) return { bg: 'from-red-500 to-orange-500', text: 'text-red-700' };
    if (name.includes('design')) return { bg: 'from-pink-500 to-purple-500', text: 'text-pink-700' };
    return { bg: 'from-emerald-500 to-teal-600', text: 'text-emerald-700' };
  };

  // Get technology icon
  const getTechnologyIcon = (techName) => {
    const name = techName?.toLowerCase() || '';
    if (name.includes('html')) return '🌐';
    if (name.includes('css')) return '🎨';
    if (name.includes('javascript')) return '⚡';
    if (name.includes('react')) return '⚛️';
    if (name.includes('node')) return '🟢';
    if (name.includes('python')) return '🐍';
    if (name.includes('java')) return '☕';
    if (name.includes('php')) return '🐘';
    return '💻';
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader size={40} className="animate-spin text-emerald-600 mb-4" />
        <p className="text-gray-500">Loading domain...</p>
      </div>
    );
  }

  if (error || !domain) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-start">
            <AlertCircle className="flex-shrink-0 h-5 w-5 text-red-500 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
        <Link 
          to="/tutorials" 
          className="inline-flex items-center text-emerald-600 hover:text-emerald-700"
        >
          <ArrowLeft size={18} className="mr-1" />
          Back to Tutorials
        </Link>
      </div>
    );
  }

  const colors = getDomainColors();
  const filteredTutorials = tutorials.filter(tutorial => {
    if (searchQuery) {
      return tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             tutorial.description.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto py-6">
      {/* Navigation */}
      <div className="mb-6">
        <Link 
          to="/tutorials" 
          className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-4"
        >
          <ArrowLeft size={18} className="mr-1" />
          Back to Tutorials
        </Link>
      </div>

      {/* Domain Header */}
      <div className={`bg-gradient-to-r ${colors.bg} text-white rounded-lg p-8 mb-8 relative overflow-hidden`}>
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full translate-x-8 -translate-y-8"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-10 rounded-full -translate-x-6 translate-y-6"></div>
        
        <div className="relative">
          <div className="flex items-center mb-4">
            <div className="text-6xl mr-4">
              {getDomainIcon()}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{domain.name}</h1>
              <div className="flex items-center text-white text-opacity-90">
                <Folder size={16} className="mr-1" />
                <span>Learning Domain</span>
              </div>
            </div>
          </div>
          
          <p className="text-lg text-white text-opacity-90 max-w-2xl mb-6">
            {domain.description}
          </p>
          
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center bg-white bg-opacity-20 rounded-full px-3 py-1">
              <Code size={14} className="mr-1" />
              <span>{technologies.length} {technologies.length === 1 ? 'Technology' : 'Technologies'}</span>
            </div>
            <div className="flex items-center bg-white bg-opacity-20 rounded-full px-3 py-1">
              <BookOpen size={14} className="mr-1" />
              <span>{tutorials.length} {tutorials.length === 1 ? 'Tutorial' : 'Tutorials'}</span>
            </div>
            <div className="flex items-center bg-white bg-opacity-20 rounded-full px-3 py-1">
              <Target size={14} className="mr-1" />
              <span>Skill Building</span>
            </div>
          </div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="mb-6">
        <div className="flex border-b">
          <button
            onClick={() => setViewMode('tutorials')}
            className={`px-4 py-2 border-b-2 font-medium text-sm ${
              viewMode === 'tutorials'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Tutorials ({tutorials.length})
          </button>
          <button
            onClick={() => setViewMode('technologies')}
            className={`px-4 py-2 border-b-2 font-medium text-sm ml-4 ${
              viewMode === 'technologies'
                ? 'border-emerald-500 text-emerald-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Technologies ({technologies.length})
          </button>
        </div>
      </div>

      {viewMode === 'tutorials' ? (
        <>
          {/* Filters and Search for Tutorials */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-3">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tutorials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <Search size={16} className="absolute left-2.5 top-2.5 text-gray-400" />
              </div>

              {/* Technology Filter */}
              {technologies.length > 0 && (
                <select
                  value={selectedTechnology}
                  onChange={(e) => setSelectedTechnology(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">All Technologies</option>
                  {technologies.map(tech => (
                    <option key={tech._id} value={tech._id}>
                      {tech.name}
                    </option>
                  ))}
                </select>
              )}

              {/* Difficulty Filter */}
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="-createdAt">Newest First</option>
              <option value="createdAt">Oldest First</option>
              <option value="title">Title A-Z</option>
              <option value="difficulty">Difficulty: Easy to Hard</option>
            </select>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              {filteredTutorials.length} {filteredTutorials.length === 1 ? 'tutorial' : 'tutorials'} 
              {searchQuery && <span> found for "{searchQuery}"</span>}
              {difficultyFilter !== 'all' && <span> • {difficultyFilter} level</span>}
              {selectedTechnology !== 'all' && <span> • {technologies.find(t => t._id === selectedTechnology)?.name}</span>}
            </p>
          </div>

          {/* Tutorials Grid */}
          {filteredTutorials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTutorials.map(tutorial => (
                <TutorialCard 
                  key={tutorial._id}
                  tutorial={tutorial}
                  domain={domain}
                  isBookmarked={isTutorialBookmarked(tutorial._id)}
                  progress={getTutorialProgress(tutorial._id)}
                  onBookmarkToggle={(e) => toggleBookmark(e, tutorial._id)}
                  user={user}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Search size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tutorials found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery 
                  ? `No tutorials match "${searchQuery}"`
                  : `No ${difficultyFilter} level tutorials available`
                }
              </p>
              {(searchQuery || difficultyFilter !== 'all' || selectedTechnology !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setDifficultyFilter('all');
                    setSelectedTechnology('all');
                  }}
                  className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </>
      ) : (
        <>
          {/* Technologies View */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Technologies in {domain.name}</h2>
            <p className="text-gray-600">
              Explore the different technologies and programming languages within {domain.name.toLowerCase()}.
            </p>
          </div>

          {technologies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {technologies.map(technology => (
                <TechnologyCard 
                  key={technology._id}
                  technology={technology}
                  domain={domain}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Code size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No technologies found</h3>
              <p className="text-gray-600">
                This domain doesn't have any technologies configured yet.
              </p>
            </div>
          )}
        </>
      )}

      {/* Get Started CTA */}
      {(tutorials.length > 0 || technologies.length > 0) && (
        <div className="mt-12 bg-gray-50 rounded-lg p-8 text-center">
          <h3 className="text-xl font-bold mb-2">Ready to explore {domain.name}?</h3>
          <p className="text-gray-600 mb-4">
            Start with our beginner-friendly tutorials and build your skills step by step.
          </p>
          {!isAuthenticated ? (
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/register"
                className="px-6 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 font-medium"
              >
                Sign Up Free
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 border border-emerald-600 text-emerald-600 rounded-md hover:bg-emerald-50 font-medium"
              >
                Sign In
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {tutorials.length > 0 && (
                <Link
                  to={`/tutorials/${tutorials[0]?.slug || tutorials[0]?._id}`}
                  className="px-6 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 font-medium"
                >
                  Start Learning
                </Link>
              )}
              {technologies.length > 0 && (
                <Link
                  to={`/technologies/${technologies[0]?.slug || technologies[0]?._id}`}
                  className="px-6 py-3 border border-emerald-600 text-emerald-600 rounded-md hover:bg-emerald-50 font-medium"
                >
                  Explore Technologies
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Tutorial Card Component
const TutorialCard = ({ tutorial, domain, isBookmarked, progress, onBookmarkToggle, user }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/tutorials/${tutorial.slug || tutorial._id}`);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div 
      className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden"
      onClick={handleCardClick}
    >
      {/* Card Header */}
      <div className="p-4 border-b">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{tutorial.title}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(tutorial.difficulty)}`}>
                {tutorial.difficulty?.charAt(0).toUpperCase() + tutorial.difficulty?.slice(1) || 'Beginner'}
              </span>
              <span className="flex items-center">
                <Clock size={12} className="mr-1" />
                {formatDuration(tutorial.estimatedTime || 30)}
              </span>
              {tutorial.technology && (
                <span className="text-emerald-600 text-xs">
                  {tutorial.technology.name || tutorial.technology}
                </span>
              )}
            </div>
          </div>

          {/* Bookmark button */}
          {user && (
            <button
              onClick={onBookmarkToggle}
              className={`p-1.5 rounded-full transition-colors ${
                isBookmarked 
                  ? 'text-yellow-500 bg-yellow-50' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark tutorial'}
            >
              <Bookmark size={16} className={isBookmarked ? 'fill-yellow-500' : ''} />
            </button>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4">
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{tutorial.description}</p>

        {/* Progress bar (for authenticated users) */}
        {user && progress > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-gray-700">Progress</span>
              <span className="text-emerald-600">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-emerald-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Meta information */}
        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <BookOpen size={14} className="mr-1" />
            <span>{tutorial.lessons?.length || 0} lessons</span>
          </div>
          <div className="flex items-center">
            <BarChart size={14} className="mr-1" />
            <span>Interactive</span>
          </div>
        </div>

        {/* Tags */}
        {tutorial.tags && tutorial.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {tutorial.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {tutorial.tags.length > 3 && (
              <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{tutorial.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Action */}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-emerald-600 font-medium text-sm">
            <Play size={14} className="mr-1" />
            <span>{user && progress > 0 ? 'Continue' : 'Start Learning'}</span>
          </div>
          <ArrowRight size={16} className="text-emerald-600" />
        </div>
      </div>
    </div>
  );
};

// Technology Card Component
const TechnologyCard = ({ technology, domain }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/technologies/${technology.slug || technology._id}`);
  };

  const getTechnologyIcon = (techName) => {
    const name = techName?.toLowerCase() || '';
    if (name.includes('html')) return '🌐';
    if (name.includes('css')) return '🎨';
    if (name.includes('javascript')) return '⚡';
    if (name.includes('react')) return '⚛️';
    if (name.includes('node')) return '🟢';
    if (name.includes('python')) return '🐍';
    if (name.includes('java')) return '☕';
    if (name.includes('php')) return '🐘';
    return '💻';
  };

  return (
    <div 
      className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden"
      onClick={handleCardClick}
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="text-3xl mr-3">
            {getTechnologyIcon(technology.name)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{technology.name}</h3>
            <p className="text-sm text-gray-500">Technology</p>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{technology.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-emerald-600 font-medium text-sm">
            <span>Explore Technology</span>
          </div>
          <ChevronRight size={16} className="text-emerald-600" />
        </div>
      </div>
    </div>
  );
};

export default DynamicDomain;