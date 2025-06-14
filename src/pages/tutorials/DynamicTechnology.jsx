import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  BarChart, 
  Star,
  Play,
  Users,
  Code,
  AlertCircle,
  Loader,
  ArrowRight,
  Search,
  Filter,
  SortAsc
} from 'lucide-react';
import { technologyAPI, tutorialAPI, userAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { COLORS } from '../../constants/colors';

const DynamicTechnology = () => {
  const { technologySlug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [technology, setTechnology] = useState(null);
  const [tutorials, setTutorials] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [sortBy, setSortBy] = useState('-createdAt');
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    fetchTechnologyData();
  }, [technologySlug]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (technology) {
      fetchTutorials();
    }
  }, [technology, difficultyFilter, sortBy, searchQuery]);

  const fetchTechnologyData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const technologyResponse = await technologyAPI.getById(technologySlug);
      const technologyData = technologyResponse.data;
      setTechnology(technologyData);
      
    } catch (err) {
      console.error('Error fetching technology:', err);
      setError('Technology not found or failed to load.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const progressRes = await userAPI.getProgress();
      setUserProgress(progressRes.data || []);
    } catch (err) {
      console.warn('Could not fetch user data:', err);
    }
  };

  const fetchTutorials = async () => {
    try {
      const filters = {
        technology: technology._id,
        sort: sortBy
      };
      
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
      setError('Failed to load tutorials for this technology.');
    }
  };

  const getTutorialProgress = (tutorialId) => {
    const progress = userProgress.find(p => 
      p.tutorial === tutorialId || 
      (p.tutorial && p.tutorial._id === tutorialId)
    );
    return progress ? progress.completion : 0;
  };

  const getTechnologyIcon = () => {
    const name = technology?.name?.toLowerCase() || '';
    
    if (name.includes('html')) return '🌐';
    if (name.includes('css')) return '🎨';
    if (name.includes('javascript')) return '⚡';
    if (name.includes('react')) return '⚛️';
    if (name.includes('node')) return '🟢';
    if (name.includes('python')) return '🐍';
    if (name.includes('java')) return '☕';
    if (name.includes('php')) return '🐘';
    if (name.includes('swift')) return '🍎';
    if (name.includes('kotlin')) return '🎯';
    return '💻';
  };

  const getTechnologyColors = () => {
    const name = technology?.name?.toLowerCase() || '';
    
    if (name.includes('html')) return { bg: 'from-orange-500 to-red-500', text: COLORS.text.dark };
    if (name.includes('css')) return { bg: 'from-blue-500 to-cyan-500', text: COLORS.text.dark };
    if (name.includes('javascript')) return { bg: 'from-yellow-400 to-yellow-600', text: COLORS.text.dark };
    if (name.includes('react')) return { bg: 'from-cyan-500 to-blue-500', text: COLORS.text.dark };
    if (name.includes('node')) return { bg: 'from-green-500 to-green-600', text: COLORS.text.dark };
    if (name.includes('python')) return { bg: 'from-blue-600 to-purple-600', text: COLORS.text.white };
    return { bg: COLORS.gradients.primary, text: COLORS.text.white };
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <Loader size={40} className={`animate-spin ${COLORS.text.primary} mb-4`} />
          <p className={COLORS.text.secondary}>Loading technology...</p>
        </div>
      </div>
    );
  }

  if (error || !technology) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className={`${COLORS.status.error.bg} border-l-4 ${COLORS.status.error.border} p-4 mb-6`}>
          <div className="flex items-start">
            <AlertCircle className={`flex-shrink-0 h-5 w-5 ${COLORS.status.error.text} mt-0.5`} />
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${COLORS.status.error.text}`}>Error</h3>
              <p className={`text-sm ${COLORS.status.error.text} mt-1`}>{error}</p>
            </div>
          </div>
        </div>
        <Link 
          to="/tutorials" 
          className={`inline-flex items-center ${COLORS.text.primary} hover:${COLORS.text.primaryHover}`}
        >
          <ArrowLeft size={18} className="mr-1" />
          Back to Tutorials
        </Link>
      </div>
    );
  }

  const colors = getTechnologyColors();
  const filteredTutorials = tutorials.filter(tutorial => {
    if (searchQuery) {
      return tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
             tutorial.description.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb Navigation */}
      <nav className="mb-6">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link to="/tutorials" className={`${COLORS.text.primary} hover:${COLORS.text.primaryHover} hover:underline`}>
              Tutorials
            </Link>
          </li>
          <span className={`${COLORS.text.tertiary} mx-2`}>/</span>
          
          {/* Domain breadcrumb (if available) */}
          {technology?.domain && (
            <>
              <li>
                <Link 
                  to={`/domains/${technology.domain.slug || technology.domain._id || technology.domain}`}
                  className={`${COLORS.text.primary} hover:${COLORS.text.primaryHover} hover:underline`}
                >
                  {technology.domain.name || technology.domain}
                </Link>
              </li>
              <span className={`${COLORS.text.tertiary} mx-2`}>/</span>
            </>
          )}
          
          <li>
            <span className={`${COLORS.text.secondary} font-medium`}>{technology.name}</span>
          </li>
        </ol>
      </nav>

      {/* Technology Header */}
      <div className={`bg-gradient-to-r ${colors.bg} text-white rounded-xl p-8 mb-8 relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full translate-x-8 -translate-y-8"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-10 rounded-full -translate-x-6 translate-y-6"></div>
        
        <div className="relative">
          <div className="flex items-center mb-4">
            <div className="text-6xl mr-4">
              {getTechnologyIcon()}
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{technology.name}</h1>
              {technology.domain && (
                <div className="flex items-center text-white text-opacity-90">
                  <BookOpen size={16} className="mr-1" />
                  <span>{technology.domain.name || technology.domain}</span>
                </div>
              )}
            </div>
          </div>
          
          <p className="text-lg text-white text-opacity-90 max-w-2xl mb-6">
            {technology.description}
          </p>
          
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center bg-white bg-opacity-20 rounded-full px-3 py-1">
              <BookOpen size={14} className="mr-1" />
              <span>{tutorials.length} {tutorials.length === 1 ? 'Tutorial' : 'Tutorials'}</span>
            </div>
            <div className="flex items-center bg-white bg-opacity-20 rounded-full px-3 py-1">
              <Users size={14} className="mr-1" />
              <span>Interactive Learning</span>
            </div>
            <div className="flex items-center bg-white bg-opacity-20 rounded-full px-3 py-1">
              <Star size={14} className="mr-1" />
              <span>Beginner Friendly</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search tutorials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-8 pr-4 py-2 ${COLORS.border.secondary} border rounded-md text-sm ${COLORS.interactive.focus.outline} ${COLORS.interactive.focus.ring}`}
            />
            <Search size={16} className={`absolute left-2.5 top-2.5 ${COLORS.text.tertiary}`} />
          </div>

          {/* Difficulty Filter */}
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className={`px-3 py-2 ${COLORS.border.secondary} border rounded-md text-sm ${COLORS.interactive.focus.outline} ${COLORS.interactive.focus.ring}`}
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
          className={`px-3 py-2 ${COLORS.border.secondary} border rounded-md text-sm ${COLORS.interactive.focus.outline} ${COLORS.interactive.focus.ring}`}
        >
          <option value="-createdAt">Newest First</option>
          <option value="createdAt">Oldest First</option>
          <option value="title">Title A-Z</option>
          <option value="difficulty">Difficulty: Easy to Hard</option>
        </select>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className={COLORS.text.secondary}>
          {filteredTutorials.length} {filteredTutorials.length === 1 ? 'tutorial' : 'tutorials'} 
          {searchQuery && <span> found for "{searchQuery}"</span>}
          {difficultyFilter !== 'all' && <span> • {difficultyFilter} level</span>}
        </p>
      </div>

      {/* Tutorials Grid */}
      {filteredTutorials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {filteredTutorials.map(tutorial => (
            <TutorialCard 
              key={tutorial._id}
              tutorial={tutorial}
              technology={technology}
              progress={getTutorialProgress(tutorial._id)}
              user={user}
            />
          ))}
        </div>
      ) : (
        <div className={`text-center py-12 ${COLORS.background.tertiary} rounded-lg`}>
          <Search size={48} className={`mx-auto ${COLORS.text.tertiary} mb-4`} />
          <h3 className={`text-lg font-medium ${COLORS.text.dark} mb-2`}>No tutorials found</h3>
          <p className={`${COLORS.text.secondary} mb-4`}>
            {searchQuery 
              ? `No tutorials match "${searchQuery}"`
              : `No ${difficultyFilter} level tutorials available`
            }
          </p>
          {(searchQuery || difficultyFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setDifficultyFilter('all');
              }}
              className={`inline-flex items-center px-4 py-2 ${COLORS.button.primary} rounded-md`}
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Get Started CTA */}
      {tutorials.length > 0 && (
        <div className={`mt-12 ${COLORS.background.tertiary} rounded-lg p-8 text-center`}>
          <h3 className={`text-xl font-bold mb-2 ${COLORS.text.dark}`}>Ready to learn {technology.name}?</h3>
          <p className={`${COLORS.text.secondary} mb-4`}>
            Start with our beginner-friendly tutorials and progress at your own pace.
          </p>
          {!isAuthenticated ? (
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/register"
                className={`px-6 py-3 ${COLORS.button.primary} rounded-md font-medium`}
              >
                Sign Up Free
              </Link>
              <Link
                to="/login"
                className={`px-6 py-3 ${COLORS.button.outline} rounded-md font-medium`}
              >
                Sign In
              </Link>
            </div>
          ) : (
            <Link
              to={`/tutorials/${tutorials[0]?.slug || tutorials[0]?._id}`}
              className={`inline-flex items-center px-6 py-3 ${COLORS.button.primary} rounded-md font-medium`}
            >
              Start Learning
              <ArrowRight size={18} className="ml-2" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

// Tutorial Card Component
const TutorialCard = ({ tutorial, technology, progress, user }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/tutorials/${tutorial.slug || tutorial._id}`);
  };

  const getDifficultyColor = (difficulty) => {
    return COLORS.difficulty[difficulty] || COLORS.difficulty.beginner;
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <div 
      className={`${COLORS.card.interactive} rounded-lg cursor-pointer overflow-hidden`}
      onClick={handleCardClick}
    >
      {/* Card Header */}
      <div className="p-4 border-b">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className={`font-semibold ${COLORS.text.dark} mb-1 line-clamp-2`}>{tutorial.title}</h3>
            <div className="flex items-center gap-2 text-sm">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(tutorial.difficulty)}`}>
                {tutorial.difficulty?.charAt(0).toUpperCase() + tutorial.difficulty?.slice(1) || 'Beginner'}
              </span>
              <span className={`flex items-center ${COLORS.text.tertiary}`}>
                <Clock size={12} className="mr-1" />
                {formatDuration(tutorial.estimatedTime || 30)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4">
        <p className={`${COLORS.text.secondary} text-sm mb-4 line-clamp-3`}>{tutorial.description}</p>

        {/* Progress bar (for authenticated users) */}
        {user && progress > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1">
              <span className={`font-medium ${COLORS.text.secondary}`}>Progress</span>
              <span className={COLORS.text.primary}>{Math.round(progress)}%</span>
            </div>
            <div className={`w-full ${COLORS.background.tertiary} rounded-full h-1.5`}>
              <div 
                className={`${COLORS.background.primary} h-1.5 rounded-full transition-all duration-300`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Meta information */}
        <div className={`flex justify-between items-center text-sm ${COLORS.text.tertiary} mb-4`}>
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
                className={`inline-block px-2 py-0.5 ${COLORS.background.tertiary} ${COLORS.text.secondary} text-xs rounded-full`}
              >
                {tag}
              </span>
            ))}
            {tutorial.tags.length > 3 && (
              <span className={`inline-block px-2 py-0.5 ${COLORS.background.tertiary} ${COLORS.text.secondary} text-xs rounded-full`}>
                +{tutorial.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Action */}
        <div className={`flex items-center justify-between`}>
          <div className={`flex items-center ${COLORS.text.primary} font-medium text-sm`}>
            <Play size={14} className="mr-1" />
            <span>{user && progress > 0 ? 'Continue' : 'Start Learning'}</span>
          </div>
          <ArrowRight size={16} className={COLORS.text.primary} />
        </div>
      </div>
    </div>
  );
};

export default DynamicTechnology;