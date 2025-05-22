import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Bookmark, 
  Share2, 
  BookOpen, 
  AlertCircle,
  Clock,
  BarChart,
  Loader,
  Play,
  CheckCircle
} from 'lucide-react';
import { tutorialAPI, lessonAPI, userAPI, technologyAPI, domainAPI } from '../../services/api';
import TutorialContent from '../../components/tutorial/TutorialContent';
import NotesComponent from '../../components/tutorial/NotesComponent';
import ResourceList from '../../components/tutorial/ResourceList';
import { useAuth } from '../../hooks/useAuth';

const DynamicTutorial = () => {
  const { domain, technology, tutorialSlug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [tutorial, setTutorial] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [userProgress, setUserProgress] = useState(0);
  const [relatedTutorials, setRelatedTutorials] = useState([]);
  
  // Fetch tutorial data based on route params
  useEffect(() => {
    fetchTutorialData();
  }, [domain, technology, tutorialSlug]);

  // Fetch user-specific data when authenticated
  useEffect(() => {
    if (isAuthenticated && tutorial) {
      fetchUserData();
    }
  }, [isAuthenticated, tutorial]);

  const fetchTutorialData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      let tutorialData = null;
      let lessonsData = [];

      // Strategy 1: Direct tutorial access via slug
      if (tutorialSlug) {
        try {
          const tutorialResponse = await tutorialAPI.getById(tutorialSlug);
          tutorialData = tutorialResponse.data;
        } catch (err) {
          console.log('Tutorial not found by slug, trying other methods...');
        }
      }

      // Strategy 2: Find tutorial by technology
      if (!tutorialData && technology) {
        try {
          // Get technology first
          const technologyResponse = await technologyAPI.getById(technology);
          const technologyData = technologyResponse.data;
          
          // Get tutorials for this technology
          const tutorialsResponse = await tutorialAPI.getAll({ 
            technology: technologyData._id,
            limit: 1 
          });
          const tutorials = tutorialsResponse.data.tutorials || tutorialsResponse.data;
          
          if (tutorials && tutorials.length > 0) {
            tutorialData = tutorials[0];
          }
        } catch (err) {
          console.log('Technology not found, trying domain...');
        }
      }

      // Strategy 3: Find tutorial by domain
      if (!tutorialData && domain) {
        try {
          // Get domain first
          const domainResponse = await domainAPI.getById(domain);
          const domainData = domainResponse.data;
          
          // Get tutorials for this domain
          const tutorialsResponse = await tutorialAPI.getAll({ 
            domain: domainData._id,
            limit: 1 
          });
          const tutorials = tutorialsResponse.data.tutorials || tutorialsResponse.data;
          
          if (tutorials && tutorials.length > 0) {
            tutorialData = tutorials[0];
          }
        } catch (err) {
          console.log('Domain not found');
        }
      }

      if (!tutorialData) {
        throw new Error('Tutorial not found');
      }

      // Fetch lessons for this tutorial
      try {
        const lessonsResponse = await lessonAPI.getByTutorial(tutorialData._id);
        lessonsData = lessonsResponse.data || [];
        // Sort lessons by order
        lessonsData.sort((a, b) => (a.order || 0) - (b.order || 0));
      } catch (lessonErr) {
        console.warn('Could not fetch lessons:', lessonErr);
        lessonsData = [];
      }

      // Fetch related tutorials
      try {
        const relatedParams = {};
        if (tutorialData.technology) {
          relatedParams.technology = tutorialData.technology._id || tutorialData.technology;
        } else if (tutorialData.domain) {
          relatedParams.domain = tutorialData.domain._id || tutorialData.domain;
        }
        
        const relatedResponse = await tutorialAPI.getAll({
          ...relatedParams,
          limit: 4
        });
        const related = relatedResponse.data.tutorials || relatedResponse.data;
        // Filter out current tutorial
        const filteredRelated = related.filter(t => t._id !== tutorialData._id);
        setRelatedTutorials(filteredRelated.slice(0, 3));
      } catch (relatedErr) {
        console.warn('Could not fetch related tutorials:', relatedErr);
      }

      setTutorial(tutorialData);
      setLessons(lessonsData);
      
    } catch (err) {
      console.error('Error fetching tutorial:', err);
      setError('Failed to load tutorial content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      // Check if user has bookmarked this tutorial
      const bookmarksResponse = await userAPI.getBookmarks();
      const bookmarks = bookmarksResponse.data || [];
      const isBookmarked = bookmarks.some(bookmark => 
        bookmark._id === tutorial._id || bookmark === tutorial._id
      );
      setIsBookmarked(isBookmarked);

      // Fetch user progress
      const progressResponse = await userAPI.getProgress();
      const progressItems = progressResponse.data || [];
      const tutorialProgress = progressItems.find(item => 
        item.tutorial === tutorial._id || 
        (item.tutorial && item.tutorial._id === tutorial._id)
      );
      if (tutorialProgress) {
        setUserProgress(tutorialProgress.completion || 0);
      }
    } catch (err) {
      console.warn('Could not fetch user data:', err);
    }
  };
  
  // Toggle bookmark
  const toggleBookmark = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      if (isBookmarked) {
        await userAPI.removeBookmark(tutorial._id);
      } else {
        await userAPI.addBookmark(tutorial._id);
      }
      setIsBookmarked(!isBookmarked);
    } catch (err) {
      console.error('Error toggling bookmark:', err);
      alert('Failed to update bookmark. Please try again.');
    }
  };
  
  // Share tutorial
  const shareContent = () => {
    if (navigator.share) {
      navigator.share({
        title: tutorial?.title,
        text: tutorial?.description,
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch((error) => console.log('Error copying link', error));
    }
  };

  // Generate resources based on tutorial data
  const generateResources = () => {
    if (!tutorial) return [];
    
    const resources = [];
    const techName = tutorial.technology?.name?.toLowerCase() || '';
    
    // Add official documentation links
    if (techName.includes('html')) {
      resources.push({
        title: 'MDN HTML Documentation',
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
        description: 'Official HTML documentation by Mozilla',
        type: 'documentation'
      });
    }
    
    if (techName.includes('css')) {
      resources.push({
        title: 'MDN CSS Documentation',
        url: 'https://developer.mozilla.org/en-US/docs/Web/CSS',
        description: 'Official CSS documentation by Mozilla',
        type: 'documentation'
      });
    }
    
    if (techName.includes('javascript')) {
      resources.push({
        title: 'MDN JavaScript Documentation',
        url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
        description: 'Official JavaScript documentation by Mozilla',
        type: 'documentation'
      });
    }
    
    if (techName.includes('react')) {
      resources.push({
        title: 'React Official Documentation',
        url: 'https://reactjs.org/docs/getting-started.html',
        description: 'Official React documentation',
        type: 'documentation'
      });
    }

    // Add practice resources
    resources.push({
      title: 'Practice Exercises',
      url: 'https://www.freecodecamp.org/',
      description: 'Additional practice exercises related to this tutorial',
      type: 'tutorial'
    });
    
    return resources;
  };

  // Format tutorial content for TutorialContent component
  const formatTutorialContent = () => {
    if (!tutorial) return null;
    
    return {
      title: tutorial.title,
      introduction: tutorial.description,
      // We'll pass lessons separately to TutorialContent
    };
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader size={40} className="animate-spin text-emerald-600 mb-4" />
        <p className="text-gray-500">Loading tutorial...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-start">
            <AlertCircle className="flex-shrink-0 h-5 w-5 text-red-500 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading tutorial</h3>
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
  
  if (!tutorial) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
          <div className="flex items-start">
            <AlertCircle className="flex-shrink-0 h-5 w-5 text-yellow-500 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Tutorial not found</h3>
              <p className="text-sm text-yellow-700 mt-1">
                The tutorial you're looking for doesn't exist or is no longer available.
              </p>
            </div>
          </div>
        </div>
        <Link 
          to="/tutorials" 
          className="inline-flex items-center text-emerald-600 hover:text-emerald-700"
        >
          <ArrowLeft size={18} className="mr-1" />
          Browse Tutorials
        </Link>
      </div>
    );
  }
  
  const tutorialContent = formatTutorialContent();
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Tutorial Navigation */}
      <div className="flex justify-between items-center mb-6">
        <Link to="/tutorials" className="flex items-center text-emerald-600 hover:text-emerald-700">
          <ArrowLeft size={18} className="mr-1" />
          <span>Back to Tutorials</span>
        </Link>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleBookmark}
            className={`p-2 rounded-full ${isBookmarked ? 'text-yellow-500 bg-yellow-50' : 'text-gray-500 hover:bg-gray-100'}`}
            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark this Tutorial'}
          >
            <Bookmark size={20} className={isBookmarked ? 'fill-yellow-500' : ''} />
          </button>
          
          <button 
            onClick={shareContent}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
            title="Share this Tutorial"
          >
            <Share2 size={20} />
          </button>
        </div>
      </div>
      
      {/* Tutorial Info */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{tutorial.title}</h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
          {tutorial.domain && (
            <span className="flex items-center">
              <BookOpen size={16} className="mr-1" />
              {tutorial.domain.name || tutorial.domain}
            </span>
          )}
          {tutorial.technology && (
            <span className="flex items-center">
              <code className="bg-gray-100 px-2 py-0.5 rounded text-gray-800">
                {tutorial.technology.name || tutorial.technology}
              </code>
            </span>
          )}
          <span className="flex items-center">
            <Clock size={16} className="mr-1" />
            {tutorial.estimatedTime || 30} min
          </span>
          <span className="flex items-center">
            <BarChart size={16} className="mr-1" />
            {tutorial.difficulty?.charAt(0).toUpperCase() + tutorial.difficulty?.slice(1) || 'Beginner'}
          </span>
        </div>
        
        {/* Tags */}
        {tutorial.tags && tutorial.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {tutorial.tags.map((tag, index) => (
              <span 
                key={index}
                className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      
      {/* Progress Bar (for logged-in users) */}
      {isAuthenticated && (
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-gray-700">Your progress</span>
            <span className="text-emerald-600">{userProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-emerald-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${userProgress}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {/* Notes Component (for logged-in users) */}
      {isAuthenticated && (
        <NotesComponent tutorialId={tutorial._id} />
      )}
      
      {/* Main Tutorial Content */}
      {tutorialContent && (
        <TutorialContent 
          content={tutorialContent} 
          lessons={lessons}
        />
      )}
      
      {/* Lesson Links */}
      {lessons.length > 0 && (
        <div className="mt-8 mb-8">
          <h2 className="text-xl font-bold mb-4">Lessons</h2>
          <div className="space-y-3">
            {lessons.map((lesson, index) => (
              <Link
                key={lesson._id}
                to={`/lessons/${lesson._id}`}
                className="block p-4 border rounded-md hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center font-medium mr-3">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{lesson.title}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Clock size={14} className="mr-1" />
                      <span>{lesson.duration || 10} min</span>
                      {!lesson.isPublished && (
                        <>
                          <span className="mx-2">•</span>
                          <span className="text-orange-500">Draft</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-emerald-600">
                    <Play size={18} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {/* Additional Resources */}
      <ResourceList resources={generateResources()} />
      
      {/* Related Tutorials */}
      {relatedTutorials.length > 0 && (
        <div className="mt-12 border-t pt-8">
          <h3 className="text-xl font-bold mb-4">Related Tutorials</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {relatedTutorials.map((related) => (
              <Link 
                key={related._id} 
                to={`/tutorials/${related.slug || related._id}`} 
                className="p-4 border rounded-md hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center mr-3 flex-shrink-0">
                    <BookOpen size={18} className="text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{related.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{related.description}</p>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      {related.difficulty && (
                        <span className={`px-2 py-0.5 rounded-full ${
                          related.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                          related.difficulty === 'intermediate' ? 'bg-blue-100 text-blue-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {related.difficulty}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicTutorial;