import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Bookmark, 
  Share2, 
  BookOpen, 
  AlertCircle,
  Clock,
  BarChart 
} from 'lucide-react';
import { tutorialAPI, lessonAPI, userAPI } from '../../services/api';
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
  
  // Fetch tutorial data based on route params
  useEffect(() => {
    const fetchTutorial = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // First try to fetch by slug if available
        let response;
        if (tutorialSlug) {
          response = await tutorialAPI.getById(tutorialSlug);
        } else {
          // Fetch tutorials by technology and find the first one
          const params = {};
          if (technology) params.technology = technology;
          response = await tutorialAPI.getAll(params);
          
          const tutorials = response.data.tutorials || response.data;
          if (tutorials && tutorials.length > 0) {
            response = { data: tutorials[0] };
          } else {
            throw new Error('No tutorials found for this technology');
          }
        }
        
        setTutorial(response.data);
        
        // Fetch lessons for this tutorial
        if (response.data._id) {
          const lessonsResponse = await lessonAPI.getByTutorial(response.data._id);
          setLessons(lessonsResponse.data);
        }
        
        // Check if user has bookmarked this tutorial
        if (isAuthenticated && response.data._id) {
          try {
            const bookmarksResponse = await userAPI.getBookmarks();
            const bookmarks = bookmarksResponse.data;
            if (bookmarks) {
              const isBookmarked = bookmarks.some(bookmark => 
                bookmark._id === response.data._id || bookmark === response.data._id
              );
              setIsBookmarked(isBookmarked);
            }
          } catch (err) {
            console.error('Error checking bookmarks:', err);
          }
          
          // Fetch user progress
          try {
            const progressResponse = await userAPI.getProgress();
            const progressItems = progressResponse.data;
            if (progressItems) {
              const tutorialProgress = progressItems.find(item => 
                item.tutorial === response.data._id || 
                (item.tutorial && item.tutorial._id === response.data._id)
              );
              if (tutorialProgress) {
                setUserProgress(tutorialProgress.completion);
              }
            }
          } catch (err) {
            console.error('Error fetching progress:', err);
          }
        }
      } catch (err) {
        console.error('Error fetching tutorial:', err);
        setError('Failed to load tutorial content. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTutorial();
  }, [tutorialSlug, technology, domain, isAuthenticated]);
  
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
  
  // Format tutorial data for TutorialContent component
  const formatTutorialContent = () => {
    if (!tutorial) return null;
    
    // Transform tutorial/lessons data into the format expected by TutorialContent
    const formattedContent = {
      title: tutorial.title,
      introduction: tutorial.description,
      sections: lessons.map(lesson => ({
        title: lesson.title,
        text: lesson.content?.find(block => block.type === 'text')?.data?.text || '',
        code: lesson.content?.find(block => block.type === 'code')?.data?.code || '',
        language: lesson.content?.find(block => block.type === 'code')?.data?.language || 'html',
        videoUrl: lesson.content?.find(block => block.type === 'video')?.data?.url || '',
        note: lesson.content?.find(block => block.type === 'text' && block.data?.isNote)?.data?.text || '',
      }))
    };
    
    return formattedContent;
  };
  
  // Generate additional resources
  const generateResources = () => {
    if (!tutorial) return [];
    
    // In a real app, these would come from the backend
    // For now, generating some based on the tutorial/technology
    const resources = [
      {
        title: `Official ${tutorial.technology?.name || 'Documentation'}`,
        url: technology === 'html' ? 'https://developer.mozilla.org/en-US/docs/Web/HTML' :
             technology === 'css' ? 'https://developer.mozilla.org/en-US/docs/Web/CSS' :
             technology === 'javascript' ? 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' :
             technology === 'react' ? 'https://reactjs.org/docs/getting-started.html' :
             'https://developer.mozilla.org/en-US/docs',
        description: `Official documentation for ${tutorial.technology?.name || technology || 'web development'}`,
        type: 'documentation'
      },
      {
        title: `${tutorial.title} - Additional Practice`,
        url: 'https://www.freecodecamp.org/',
        description: 'Practice exercises related to this tutorial',
        type: 'tutorial'
      }
    ];
    
    return resources;
  };
  
  // Get related tutorials
  const getRelatedTutorials = () => {
    // In a real app, would fetch from backend based on current tutorial
    // For demo purposes, use hardcoded related tutorials
    return [
      {
        title: 'HTML Fundamentals',
        description: 'Learn the structure of web pages with HTML',
        path: '/tutorials/html',
        technology: 'html'
      },
      {
        title: 'CSS Fundamentals',
        description: 'Style your web pages with CSS',
        path: '/tutorials/css',
        technology: 'css'
      },
      {
        title: 'JavaScript Essentials',
        description: 'Add interactivity with JavaScript',
        path: '/tutorials/javascript',
        technology: 'javascript'
      },
      {
        title: 'React Fundamentals',
        description: 'Build user interfaces with React',
        path: '/tutorials/react',
        technology: 'react'
      }
    ].filter(related => related.technology !== technology);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
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
              {tutorial.domain.name || 'Web Development'}
            </span>
          )}
          {tutorial.technology && (
            <span className="flex items-center">
              <code className="bg-gray-100 px-2 py-0.5 rounded text-gray-800">
                {tutorial.technology.name || technology}
              </code>
            </span>
          )}
          <span className="flex items-center">
            <Clock size={16} className="mr-1" />
            {tutorial.estimatedTime || '30'} min
          </span>
          <span className="flex items-center">
            <BarChart size={16} className="mr-1" />
            {tutorial.difficulty?.charAt(0).toUpperCase() + tutorial.difficulty?.slice(1) || 'Beginner'}
          </span>
        </div>
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
              className="bg-emerald-600 h-2 rounded-full" 
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
      {tutorialContent && <TutorialContent content={tutorialContent} />}
      
      {/* Lesson Links */}
      {lessons.length > 0 && (
        <div className="mt-8 mb-8">
          <h2 className="text-xl font-bold mb-4">Lessons</h2>
          <div className="space-y-3">
            {lessons.map((lesson, index) => (
              <Link
                key={lesson._id}
                to={`/lessons/${lesson._id}`}
                className="block p-4 border rounded-md hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center font-medium mr-3">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-medium">{lesson.title}</h3>
                    <p className="text-sm text-gray-500">
                      {lesson.duration || 10} min
                      {!lesson.isPublished && " • Draft"}
                    </p>
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
      <div className="mt-12 border-t pt-8">
        <h3 className="text-xl font-bold mb-4">Related Tutorials</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {getRelatedTutorials().slice(0, 2).map((related, index) => (
            <Link 
              key={index} 
              to={related.path} 
              className="p-4 border rounded-md hover:bg-gray-50"
            >
              <h4 className="font-medium">{related.title}</h4>
              <p className="text-sm text-gray-600">{related.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DynamicTutorial;