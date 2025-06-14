import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Code, 
  ArrowRight,
  Bookmark,
  Loader,
  AlertCircle,
  Play,
  Clock,
  Star,
  Users,
  ChevronRight,
  Layers
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { domainAPI, tutorialAPI, userAPI } from '../services/api';
import { COLORS } from '../constants/colors';

const TutorialPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // State for domains and featured tutorials
  const [domains, setDomains] = useState([]);
  const [featuredTutorials, setFeaturedTutorials] = useState([]);
  const [userBookmarks, setUserBookmarks] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  
  // Loading and error state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
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
  
  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch domains and featured tutorials
      const [domainsRes, featuredRes] = await Promise.all([
        domainAPI.getAll(),
        tutorialAPI.getAll({ limit: 6, sort: '-createdAt' })
      ]);

      setDomains(domainsRes.data);
      
      // Handle both paginated and non-paginated responses for tutorials
      const tutorialsData = featuredRes.data.tutorials || featuredRes.data;
      setFeaturedTutorials(tutorialsData);
      
    } catch (err) {
      console.error('Error fetching initial data:', err);
      setError('Failed to load content. Please try again.');
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

  // Get domain icon
  const getDomainIcon = (domainName) => {
    const name = domainName?.toLowerCase() || '';
    
    if (name.includes('web')) return '🌐';
    if (name.includes('mobile')) return '📱';
    if (name.includes('data')) return '📊';
    if (name.includes('machine') || name.includes('ai')) return '🤖';
    if (name.includes('game')) return '🎮';
    if (name.includes('design')) return '🎨';
    if (name.includes('security')) return '🔒';
    if (name.includes('cloud')) return '☁️';
    return '💻';
  };

  // Get domain colors
  const getDomainColors = (domainName) => {
    const name = domainName?.toLowerCase() || '';
    
    const domainColors = COLORS.domains;
    if (name.includes('web')) return domainColors.web;
    if (name.includes('mobile')) return domainColors.mobile;
    if (name.includes('data')) return domainColors.data;
    if (name.includes('machine') || name.includes('ai')) return domainColors.ai;
    if (name.includes('game')) return domainColors.game;
    if (name.includes('design')) return domainColors.design;
    if (name.includes('security')) return domainColors.security;
    if (name.includes('cloud')) return domainColors.cloud;
    return { bg: COLORS.gradients.primary, text: COLORS.text.white };
  };
  
  if (isLoading) {
    return (
      <div className={`min-h-screen ${COLORS.background.secondary}`}>
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <Loader size={40} className={`animate-spin ${COLORS.text.primary} mb-4`} />
          <p className={COLORS.text.secondary}>Loading tutorial domains...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${COLORS.background.secondary}`}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className={`${COLORS.status.error.bg} border-l-4 ${COLORS.status.error.border} p-4 mb-6`}>
            <div className="flex items-start">
              <AlertCircle className={`flex-shrink-0 h-5 w-5 ${COLORS.status.error.text} mt-0.5`} />
              <div className="ml-3">
                <h3 className={`text-sm font-medium ${COLORS.status.error.text}`}>Error loading content</h3>
                <p className={`text-sm ${COLORS.status.error.text} mt-1`}>{error}</p>
              </div>
            </div>
          </div>
          <button 
            onClick={fetchInitialData}
            className={`${COLORS.button.primary} px-4 py-2 rounded-lg`}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen ${COLORS.background.secondary}`}>
      {/* Hero Section */}
      <div className={`${COLORS.background.white} py-16 px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-6xl mx-auto text-center">
          <h1 className={`text-3xl md:text-4xl font-bold ${COLORS.text.dark} mb-4`}>
            Learn to Code
          </h1>
          <p className={`text-lg ${COLORS.text.secondary} max-w-2xl mx-auto mb-8`}>
            Explore our comprehensive learning domains and discover the path that's right for you. 
            From web development to data science, we have interactive tutorials for every interest.
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className={`flex items-center ${COLORS.text.primary}`}>
              <Layers size={16} className="mr-2" />
              <span className="font-semibold">{domains.length}</span>
              <span className="ml-1">Learning Domains</span>
            </div>
            <div className={`flex items-center ${COLORS.text.primary}`}>
              <BookOpen size={16} className="mr-2" />
              <span className="font-semibold">100+</span>
              <span className="ml-1">Tutorials</span>
            </div>
            <div className={`flex items-center ${COLORS.text.primary}`}>
              <Users size={16} className="mr-2" />
              <span className="font-semibold">Interactive</span>
              <span className="ml-1">Learning</span>
            </div>
            <div className={`flex items-center ${COLORS.text.primary}`}>
              <Star size={16} className="mr-2" />
              <span className="font-semibold">All Levels</span>
              <span className="ml-1">Welcome</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Learning Domains Section */}
        <div className="mb-12">
          <h2 className={`text-2xl font-bold ${COLORS.text.dark} mb-6`}>Choose Your Learning Path</h2>
          
          {domains.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {domains.map((domain) => (
                <DomainCard key={domain._id} domain={domain} />
              ))}
            </div>
          ) : (
            <div className={`text-center py-12 ${COLORS.background.white} rounded-xl ${COLORS.border.secondary} border`}>
              <div className={`mx-auto w-16 h-16 ${COLORS.background.tertiary} rounded-full flex items-center justify-center mb-6`}>
                <Layers size={28} className={COLORS.text.tertiary} />
              </div>
              <h3 className={`text-xl font-semibold ${COLORS.text.dark} mb-2`}>No domains available</h3>
              <p className={`${COLORS.text.secondary} mb-6`}>
                Learning domains will be available soon.
              </p>
            </div>
          )}
        </div>

        

        {/* Get Started CTA */}
        <div className={`${COLORS.background.white} rounded-xl p-8 text-center ${COLORS.border.secondary} border`}>
          <h3 className={`text-xl font-bold mb-2 ${COLORS.text.dark}`}>Ready to start your coding journey?</h3>
          <p className={`${COLORS.text.secondary} mb-6`}>
            Join thousands of learners who are building their programming skills with our interactive tutorials.
          </p>
          {!isAuthenticated ? (
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/register"
                className={`px-6 py-3 ${COLORS.button.primary} rounded-lg font-medium`}
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className={`px-6 py-3 ${COLORS.button.outline} rounded-lg font-medium`}
              >
                Sign In
              </Link>
            </div>
          ) : (
            <p className={`${COLORS.text.primary} font-medium`}>
              Welcome back! Choose a domain above to continue learning.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Domain Card Component
const DomainCard = ({ domain }) => {
  const getDomainIcon = (domainName) => {
    const name = domainName?.toLowerCase() || '';
    
    if (name.includes('web')) return '🌐';
    if (name.includes('mobile')) return '📱';
    if (name.includes('data')) return '📊';
    if (name.includes('machine') || name.includes('ai')) return '🤖';
    if (name.includes('game')) return '🎮';
    if (name.includes('design')) return '🎨';
    if (name.includes('security')) return '🔒';
    if (name.includes('cloud')) return '☁️';
    return '💻';
  };

  const getDomainColors = (domainName) => {
    const name = domainName?.toLowerCase() || '';
    
    const domainColors = COLORS.domains;
    if (name.includes('web')) return domainColors.web;
    if (name.includes('mobile')) return domainColors.mobile;
    if (name.includes('data')) return domainColors.data;
    if (name.includes('machine') || name.includes('ai')) return domainColors.ai;
    if (name.includes('game')) return domainColors.game;
    if (name.includes('design')) return domainColors.design;
    if (name.includes('security')) return domainColors.security;
    if (name.includes('cloud')) return domainColors.cloud;
    return { bg: COLORS.gradients.primary, text: COLORS.text.white };
  };

  const colors = getDomainColors(domain.name);

  return (
    <Link 
      to={`/domains/${domain.slug || domain._id}`}
      className={`block ${COLORS.background.white} rounded-xl ${COLORS.border.secondary} border hover:shadow-lg transition-all duration-300 overflow-hidden group`}
    >
      {/* Domain Header */}
      <div className={`bg-gradient-to-r ${colors.bg} p-6 text-white relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full translate-x-6 -translate-y-6"></div>
        <div className="relative">
          <div className="text-4xl mb-3">
            {getDomainIcon(domain.name)}
          </div>
          <h3 className="text-lg font-bold">{domain.name}</h3>
        </div>
      </div>
      
      {/* Domain Body */}
      <div className="p-6">
        <p className={`${COLORS.text.secondary} text-sm mb-4 leading-relaxed line-clamp-3`}>
          {domain.description}
        </p>
        
        {/* Action */}
        <div className={`flex items-center ${COLORS.text.primary} font-medium text-sm group-hover:gap-2 transition-all duration-200`}>
          <span>Explore Domain</span>
          <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform duration-200" />
        </div>
      </div>
    </Link>
  );
};

// Enhanced Tutorial Card Component (simplified for featured section)
const TutorialCard = ({ tutorial, user, isBookmarked = false, progress = 0, onBookmarkToggle }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/tutorials/${tutorial.slug || tutorial._id}`);
  };

  const getDifficultyColor = (difficulty) => {
    return COLORS.difficulty[difficulty] || COLORS.difficulty.beginner;
  };
  
  return (
    <div 
      className={`${COLORS.background.white} rounded-xl ${COLORS.border.secondary} border hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden group`}
      onClick={handleCardClick}
    >
      {/* Card Body */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(tutorial.difficulty)}`}>
            {tutorial.difficulty?.charAt(0).toUpperCase() + tutorial.difficulty?.slice(1) || 'Beginner'}
          </div>
          
          {/* Bookmark button */}
          {user && (
            <button
              onClick={onBookmarkToggle}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isBookmarked 
                  ? 'text-yellow-400 bg-yellow-50' 
                  : `${COLORS.text.tertiary} hover:${COLORS.text.secondary} hover:${COLORS.background.tertiary}`
              }`}
            >
              <Bookmark size={16} className={isBookmarked ? 'fill-yellow-400' : ''} />
            </button>
          )}
        </div>
        
        <h3 className={`text-lg font-semibold ${COLORS.text.dark} mb-2 group-hover:${COLORS.text.primary} transition-colors line-clamp-2`}>
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