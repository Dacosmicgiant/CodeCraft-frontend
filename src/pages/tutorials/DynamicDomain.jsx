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
  Bookmark
} from 'lucide-react';
import { domainAPI, technologyAPI, tutorialAPI, userAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { COLORS } from '../../constants/colors';

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

  useEffect(() => {
    fetchDomainData();
  }, [domainSlug]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated]);

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

  const isTutorialBookmarked = (tutorialId) => {
    return userBookmarks.some(bookmark => 
      bookmark._id === tutorialId || bookmark === tutorialId
    );
  };

  const getTutorialProgress = (tutorialId) => {
    const progress = userProgress.find(p => 
      p.tutorial === tutorialId || 
      (p.tutorial && p.tutorial._id === tutorialId)
    );
    return progress ? progress.completion : 0;
  };

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

  const getDomainIcon = () => {
    const name = domain?.name?.toLowerCase() || '';
    
    if (name.includes('web')) return '🌐';
    if (name.includes('mobile')) return '📱';
    if (name.includes('data')) return '📊';
    if (name.includes('machine')) return '🤖';
    if (name.includes('game')) return '🎮';
    if (name.includes('design')) return '🎨';
    return '💻';
  };

  const getDomainColors = () => {
    const name = domain?.name?.toLowerCase() || '';
    
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <Loader size={40} className={`animate-spin ${COLORS.text.primary} mb-4`} />
          <p className={COLORS.text.secondary}>Loading domain...</p>
        </div>
      </div>
    );
  }

  if (error || !domain) {
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

  const colors = getDomainColors();

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
          <li>
            <span className={`${COLORS.text.secondary} font-medium`}>{domain.name}</span>
          </li>
        </ol>
      </nav>

      {/* Domain Header */}
      <div className={`bg-gradient-to-r ${colors.bg} text-white rounded-xl p-8 mb-8 relative overflow-hidden`}>
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
                <BookOpen size={16} className="mr-1" />
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
              <Users size={14} className="mr-1" />
              <span>Interactive Learning</span>
            </div>
            <div className="flex items-center bg-white bg-opacity-20 rounded-full px-3 py-1">
              <Star size={14} className="mr-1" />
              <span>All Levels</span>
            </div>
          </div>
        </div>
      </div>

      {/* Technologies Section */}
      {technologies.length > 0 && (
        <div className="mb-12">
          <h2 className={`text-2xl font-bold mb-6 ${COLORS.text.dark}`}>Technologies in {domain.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {technologies.map((technology) => (
              <Link 
                key={technology._id}
                to={`/technologies/${technology.slug || technology._id}`}
                className={`${COLORS.card.interactive} p-6 rounded-lg`}
              >
                <div className="flex items-center mb-3">
                  <div className={`w-8 h-8 ${COLORS.background.primaryLight} rounded-lg flex items-center justify-center mr-3`}>
                    <Code size={16} className={COLORS.text.primary} />
                  </div>
                  <h3 className={`font-semibold ${COLORS.text.dark}`}>{technology.name}</h3>
                </div>
                <p className={`${COLORS.text.secondary} text-sm mb-4`}>{technology.description}</p>
                <div className={`flex items-center ${COLORS.text.primary} text-sm font-medium`}>
                  <span>Explore {technology.name}</span>
                  <ArrowRight size={16} className="ml-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Tutorials Section */}
      {tutorials.length > 0 && (
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-2xl font-bold ${COLORS.text.dark}`}>Latest Tutorials</h2>
            <Link 
              to={`/tutorials?domain=${domain._id}`}
              className={`${COLORS.text.primary} hover:${COLORS.text.primaryHover} font-medium`}
            >
              View All Tutorials
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tutorials.slice(0, 6).map((tutorial) => (
              <TutorialCard 
                key={tutorial._id}
                tutorial={tutorial}
                isBookmarked={isTutorialBookmarked(tutorial._id)}
                progress={getTutorialProgress(tutorial._id)}
                onBookmarkToggle={(e) => toggleBookmark(e, tutorial._id)}
                user={user}
              />
            ))}
          </div>
        </div>
      )}

      {/* Get Started CTA */}
      <div className={`${COLORS.background.tertiary} rounded-lg p-8 text-center`}>
        <h3 className={`text-xl font-bold mb-2 ${COLORS.text.dark}`}>Ready to dive into {domain.name}?</h3>
        <p className={`${COLORS.text.secondary} mb-4`}>
          Start with our beginner-friendly tutorials and build your skills step by step.
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
            to={`/tutorials?domain=${domain._id}`}
            className={`inline-flex items-center px-6 py-3 ${COLORS.button.primary} rounded-md font-medium`}
          >
            Start Learning
            <ArrowRight size={18} className="ml-2" />
          </Link>
        )}
      </div>
    </div>
  );
};

// Tutorial Card Component
const TutorialCard = ({ tutorial, isBookmarked, progress, onBookmarkToggle, user }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/tutorials/${tutorial.slug || tutorial._id}`);
  };

  const getDifficultyColor = (difficulty) => {
    return COLORS.difficulty[difficulty] || COLORS.difficulty.beginner;
  };

  return (
    <div 
      className={`${COLORS.card.interactive} rounded-lg cursor-pointer overflow-hidden`}
      onClick={handleCardClick}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className={`font-semibold ${COLORS.text.dark} line-clamp-2 flex-1`}>{tutorial.title}</h3>
          {user && (
            <button
              onClick={onBookmarkToggle}
              className={`p-1.5 rounded-full transition-colors ml-2 ${
                isBookmarked 
                  ? 'text-yellow-500 bg-yellow-50' 
                  : `${COLORS.text.tertiary} hover:${COLORS.text.secondary} hover:${COLORS.background.tertiary}`
              }`}
            >
              <Bookmark size={16} className={isBookmarked ? 'fill-yellow-500' : ''} />
            </button>
          )}
        </div>
        
        <p className={`${COLORS.text.secondary} text-sm mb-4 line-clamp-2`}>{tutorial.description}</p>
        
        <div className={`flex items-center justify-between text-sm ${COLORS.text.tertiary} mb-3`}>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(tutorial.difficulty)}`}>
            {tutorial.difficulty?.charAt(0).toUpperCase() + tutorial.difficulty?.slice(1) || 'Beginner'}
          </span>
          <span>{tutorial.lessons?.length || 0} lessons</span>
        </div>
        
        {user && progress > 0 && (
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span>Progress</span>
              <span className={COLORS.text.primary}>{Math.round(progress)}%</span>
            </div>
            <div className={`w-full ${COLORS.background.tertiary} rounded-full h-1.5`}>
              <div 
                className={`${COLORS.background.primary} h-1.5 rounded-full`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        <div className={`flex items-center ${COLORS.text.primary} font-medium text-sm`}>
          <span>{user && progress > 0 ? 'Continue' : 'Start Learning'}</span>
          <ArrowRight size={16} className="ml-1" />
        </div>
      </div>
    </div>
  );
};

export default DynamicDomain;