// src/pages/tutorials/DynamicDomain.jsx
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

  // Get domain color scheme
  const getDomainColors = () => {
    const name = domain?.name?.toLowerCase() || '';
    
    if (name.includes('web')) return { bg: 'from-blue-500 to-cyan-500', text: 'text-blue-700' };
    if (name.includes('mobile')) return { bg: 'from-purple-500 to-pink-500', text: 'text-purple-700' };
    if (name.includes('data')) return { bg: 'from-green-500 to-teal-500', text: 'text-green-700' };
    if (name.includes('machine')) return { bg: 'from-orange-500 to-red-500', text: 'text-orange-700' };
    if (name.includes('game')) return { bg: 'from-indigo-500 to-purple-500', text: 'text-indigo-700' };
    return { bg: 'from-emerald-500 to-teal-600', text: 'text-emerald-700' };
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
          <h2 className="text-2xl font-bold mb-6">Technologies in {domain.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technologies.map((technology) => (
              <Link 
                key={technology._id}
                to={`/technologies/${technology.slug || technology._id}`}
                className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                    <Code size={16} className="text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{technology.name}</h3>
                </div>
                <p className="text-gray-600 text-sm mb-4">{technology.description}</p>
                <div className="flex items-center text-emerald-600 text-sm font-medium">
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
            <h2 className="text-2xl font-bold">Latest Tutorials</h2>
            <Link 
              to={`/tutorials?domain=${domain._id}`}
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              View All Tutorials
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <h3 className="text-xl font-bold mb-2">Ready to dive into {domain.name}?</h3>
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
          <Link
            to={`/tutorials?domain=${domain._id}`}
            className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 font-medium"
          >
            Start Learning
            <ArrowRight size={18} className="ml-2" />
          </Link>
        )}
      </div>
    </div>
  );
};

// Tutorial Card Component (simplified version)
const TutorialCard = ({ tutorial, isBookmarked, progress, onBookmarkToggle, user }) => {
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

  return (
    <div 
      className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden"
      onClick={handleCardClick}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1">{tutorial.title}</h3>
          {user && (
            <button
              onClick={onBookmarkToggle}
              className={`p-1.5 rounded-full transition-colors ml-2 ${
                isBookmarked 
                  ? 'text-yellow-500 bg-yellow-50' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Bookmark size={16} className={isBookmarked ? 'fill-yellow-500' : ''} />
            </button>
          )}
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{tutorial.description}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(tutorial.difficulty)}`}>
            {tutorial.difficulty?.charAt(0).toUpperCase() + tutorial.difficulty?.slice(1) || 'Beginner'}
          </span>
          <span>{tutorial.lessons?.length || 0} lessons</span>
        </div>
        
        {user && progress > 0 && (
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span>Progress</span>
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
        
        <div className="flex items-center text-emerald-600 font-medium text-sm">
          <span>{user && progress > 0 ? 'Continue' : 'Start Learning'}</span>
          <ArrowRight size={16} className="ml-1" />
        </div>
      </div>
    </div>
  );
};

export default DynamicDomain;