import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  BookOpen, 
  Code, 
  Users,
  Star,
  ArrowRight,
  Loader,
  AlertCircle,
  Bookmark,
  Clock,
  Award,
  TrendingUp,
  CheckCircle
} from 'lucide-react';
import { domainAPI, technologyAPI, tutorialAPI, userAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { COLORS } from '../constants/colors';

const DomainPage = () => {
  const { domainSlug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [domain, setDomain] = useState(null);
  const [technologies, setTechnologies] = useState([]);
  const [tutorials, setTutorials] = useState([]);
  const [featuredTutorials, setFeaturedTutorials] = useState([]);
  const [userBookmarks, setUserBookmarks] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTechnology, setSelectedTechnology] = useState('all');

  useEffect(() => {
    fetchDomainData();
  }, [domainSlug]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (selectedTechnology !== 'all') {
      filterTutorialsByTechnology();
    } else {
      setTutorials(featuredTutorials);
    }
  }, [selectedTechnology, featuredTutorials]);

  const fetchDomainData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch domain details
      const domainResponse = await domainAPI.getById(domainSlug);
      const domainData = domainResponse.data;
      setDomain(domainData);
      
      // Fetch technologies for this domain
      const technologiesResponse = await technologyAPI.getAll({ domain: domainData._id });
      const technologiesData = technologiesResponse.data;
      setTechnologies(technologiesData);
      
      // Fetch tutorials for this domain
      const tutorialsResponse = await tutorialAPI.getAll({ 
        domain: domainData._id,
        limit: 12,
        sort: '-createdAt'  
      });
      const tutorialsData = tutorialsResponse.data.tutorials || tutorialsResponse.data;
      setFeaturedTutorials(tutorialsData);
      setTutorials(tutorialsData);
      
    } catch (err) {
      console.error('Error fetching domain data:', err);
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

  const filterTutorialsByTechnology = async () => {
    try {
      const response = await tutorialAPI.getAll({ 
        domain: domain._id,
        technology: selectedTechnology,
        limit: 12,
        sort: '-createdAt'  
      });
      const tutorialsData = response.data.tutorials || response.data;
      setTutorials(tutorialsData);
    } catch (err) {
      console.error('Error filtering tutorials:', err);
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
    }
  };

  // Get domain icon and colors
  const getDomainInfo = () => {
    const name = domain?.name?.toLowerCase() || '';
    
    if (name.includes('web')) return { 
      icon: '🌐', 
      colors: { bg: 'from-blue-500 to-cyan-500', text: 'text-blue-700' },
      description: 'Build modern websites and web applications'
    };
    if (name.includes('mobile')) return { 
      icon: '📱', 
      colors: { bg: 'from-purple-500 to-pink-500', text: 'text-purple-700' },
      description: 'Create mobile apps for iOS and Android'
    };
    if (name.includes('data')) return { 
      icon: '📊', 
      colors: { bg: 'from-green-500 to-teal-500', text: 'text-green-700' },
      description: 'Analyze data and build intelligent systems'
    };
    if (name.includes('machine') || name.includes('ai')) return { 
      icon: '🤖', 
      colors: { bg: 'from-orange-500 to-red-500', text: 'text-orange-700' },
      description: 'Build AI and machine learning applications'
    };
    if (name.includes('game')) return { 
      icon: '🎮', 
      colors: { bg: 'from-indigo-500 to-purple-500', text: 'text-indigo-700' },
      description: 'Create engaging games and interactive experiences'
    };
    if (name.includes('design')) return { 
      icon: '🎨', 
      colors: { bg: 'from-pink-500 to-rose-500', text: 'text-pink-700' },
      description: 'Design beautiful user interfaces and experiences'
    };
    
    return { 
      icon: '💻', 
      colors: { bg: 'from-emerald-500 to-teal-600', text: 'text-emerald-700' },
      description: 'Learn programming and software development'
    };
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen ${COLORS.background.secondary} flex items-center justify-center`}>
        <div className="text-center">
          <Loader size={40} className={`animate-spin ${COLORS.text.primary} mb-4`} />
          <p className={COLORS.text.secondary}>Loading domain content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${COLORS.background.secondary} flex items-center justify-center`}>
        <div className={`text-center ${COLORS.background.white} rounded-xl p-8 max-w-md mx-4`}>
          <AlertCircle size={48} className={`${COLORS.status.error.text} mx-auto mb-4`} />
          <h3 className={`text-xl font-semibold ${COLORS.text.dark} mb-2`}>Domain Not Found</h3>
          <p className={`${COLORS.text.secondary} mb-6`}>{error}</p>
          <Link
            to="/tutorials"
            className={`${COLORS.button.primary} px-6 py-3 rounded-lg transition-colors duration-200`}
          >
            Browse All Tutorials
          </Link>
        </div>
      </div>
    );
  }

  const domainInfo = getDomainInfo();

  return (
    <div className={`min-h-screen ${COLORS.background.secondary}`}>
      {/* Back Navigation */}
      <div className={`${COLORS.background.white} py-4 px-4 sm:px-6 lg:px-8 border-b`}>
        <div className="max-w-6xl mx-auto">
          <Link 
            to="/tutorials"
            className={`inline-flex items-center gap-2 ${COLORS.text.secondary} hover:${COLORS.text.primary} transition-colors`}
          >
            <ArrowLeft size={20} />
            <span>Back to Tutorials</span>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className={`bg-gradient-to-r ${domainInfo.colors.bg} text-white py-16`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-6xl mb-6">{domainInfo.icon}</div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{domain.name}</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
              {domain.description || domainInfo.description}
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold mb-1">{tutorials.length}</div>
                <div className="text-sm opacity-90">Tutorials</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold mb-1">{technologies.length}</div>
                <div className="text-sm opacity-90">Technologies</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold mb-1">4.9</div>
                <div className="text-sm opacity-90">Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Technologies Filter */}
        {technologies.length > 0 && (
          <div className="mb-8">
            <h2 className={`text-2xl font-bold ${COLORS.text.dark} mb-4`}>Technologies</h2>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedTechnology('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedTechnology === 'all'
                    ? `${COLORS.background.primary} ${COLORS.text.white} shadow-md`
                    : `${COLORS.background.white} ${COLORS.text.secondary} hover:${COLORS.background.tertiary} border ${COLORS.border.secondary}`
                }`}
              >
                All Technologies
              </button>
              {technologies.map((tech) => (
                <button
                  key={tech._id}
                  onClick={() => setSelectedTechnology(tech._id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    selectedTechnology === tech._id
                      ? `${COLORS.background.primary} ${COLORS.text.white} shadow-md`
                      : `${COLORS.background.white} ${COLORS.text.secondary} hover:${COLORS.background.tertiary} border ${COLORS.border.secondary}`
                  }`}
                >
                  {tech.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Learning Path */}
        <div className="mb-12">
          <h2 className={`text-2xl font-bold ${COLORS.text.dark} mb-6`}>Recommended Learning Path</h2>
          <div className={`${COLORS.background.white} rounded-xl p-6 border ${COLORS.border.secondary}`}>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className={`w-16 h-16 ${COLORS.background.primary} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-white font-bold text-xl">1</span>
                </div>
                <h3 className={`font-semibold ${COLORS.text.dark} mb-2`}>Start with Basics</h3>
                <p className={`${COLORS.text.secondary} text-sm`}>
                  Learn fundamental concepts and core technologies
                </p>
              </div>
              <div className="text-center">
                <div className={`w-16 h-16 ${COLORS.background.primary} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-white font-bold text-xl">2</span>
                </div>
                <h3 className={`font-semibold ${COLORS.text.dark} mb-2`}>Build Projects</h3>
                <p className={`${COLORS.text.secondary} text-sm`}>
                  Apply your knowledge with hands-on projects
                </p>
              </div>
              <div className="text-center">
                <div className={`w-16 h-16 ${COLORS.background.primary} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-white font-bold text-xl">3</span>
                </div>
                <h3 className={`font-semibold ${COLORS.text.dark} mb-2`}>Advanced Topics</h3>
                <p className={`${COLORS.text.secondary} text-sm`}>
                  Master advanced concepts and best practices
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tutorials Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-2xl font-bold ${COLORS.text.dark}`}>
              {selectedTechnology === 'all' ? 'All Tutorials' : `${technologies.find(t => t._id === selectedTechnology)?.name || ''} Tutorials`}
            </h2>
            <Link
              to={`/tutorials?domain=${domain._id}`}
              className={`flex items-center gap-2 ${COLORS.text.primary} hover:${COLORS.text.primaryHover} font-medium transition-colors`}
            >
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {tutorials.length === 0 ? (
            <div className={`text-center py-12 ${COLORS.background.white} rounded-xl`}>
              <BookOpen size={48} className={`${COLORS.text.tertiary} mx-auto mb-4`} />
              <h3 className={`text-lg font-semibold ${COLORS.text.dark} mb-2`}>No Tutorials Found</h3>
              <p className={`${COLORS.text.secondary}`}>
                Check back soon for new content in this technology.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tutorials.slice(0, 6).map((tutorial) => (
                <TutorialCard 
                  key={tutorial._id}
                  tutorial={tutorial}
                  isBookmarked={isTutorialBookmarked(tutorial._id)}
                  progress={getTutorialProgress(tutorial._id)}
                  onBookmarkToggle={(e) => toggleBookmark(e, tutorial._id)}
                  user={user}
                  domainColors={domainInfo.colors}
                />
              ))}
            </div>
          )}
        </div>

        {/* CTA Section */}
        {!isAuthenticated && (
          <div className={`${COLORS.background.primary} text-white rounded-xl p-8 text-center`}>
            <h3 className="text-2xl font-bold mb-4">Ready to start learning {domain.name}?</h3>
            <p className="text-lg opacity-90 mb-6">
              Create a free account to track your progress and bookmark tutorials.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className={`px-8 py-3 ${COLORS.background.white} ${COLORS.text.primary} font-semibold rounded-lg hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1`}
              >
                Sign Up Free
              </Link>
              <Link
                to="/login"
                className="px-8 py-3 bg-white bg-opacity-20 text-white font-semibold rounded-lg hover:bg-opacity-30 transition-all duration-200 border border-white border-opacity-30"
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Tutorial Card Component
const TutorialCard = ({ tutorial, user, isBookmarked = false, progress = 0, onBookmarkToggle, domainColors }) => {
  const navigate = useNavigate();

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
      color: domainColors.bg 
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
      {/* Header */}
      <div className={`bg-gradient-to-r ${techInfo.color} p-6 relative`}>
        <div className="flex justify-between items-start">
          <div className={`${COLORS.background.white} bg-opacity-20 backdrop-blur-sm rounded-lg p-3 inline-flex items-center justify-center`}>
            <span className="text-white font-bold text-sm">
              {techInfo.icon}
            </span>
          </div>
          
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
      
      {/* Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${COLORS.difficulty[tutorial.difficulty] || COLORS.difficulty.beginner}`}>
            {tutorial.difficulty?.charAt(0).toUpperCase() + tutorial.difficulty?.slice(1) || 'Beginner'}
          </div>
        </div>
        
        <h3 className={`text-lg font-semibold ${COLORS.text.dark} mb-2 group-hover:${COLORS.text.primary} transition-colors`}>
          {tutorial.title}
        </h3>
        
        <p className={`${COLORS.text.secondary} text-sm mb-4 leading-relaxed`}>
          {tutorial.description}
        </p>
        
        <div className="flex items-center justify-between text-xs mb-4">
          <div className={`flex items-center gap-1 ${COLORS.text.tertiary}`}>
            <BookOpen size={14} />
            <span>{tutorial.lessons?.length || 0} lessons</span>
          </div>
          <div className={`flex items-center gap-1 ${COLORS.text.tertiary}`}>
            <Clock size={14} />
            <span>~2 hours</span>
          </div>
        </div>
        
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
        
        <div className={`flex items-center ${COLORS.text.primary} font-medium text-sm group-hover:gap-2 transition-all duration-200`}>
          <span>{user && progress > 0 ? 'Continue Learning' : 'Start Learning'}</span>
          <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform duration-200" />
        </div>
      </div>
    </div>
  );
};

export default DomainPage;