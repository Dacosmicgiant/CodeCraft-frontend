import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  Bookmark, 
  Share2, 
  Check,
  AlertCircle,
  Clock,
  BookOpen
} from 'lucide-react';
import { lessonAPI, tutorialAPI, userAPI } from '../../services/api';
import NotesComponent from '../../components/tutorial/NotesComponent';
import { useAuth } from '../../hooks/useAuth';

const DynamicLesson = () => {
  const { lessonId, tutorialId, lessonSlug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [lesson, setLesson] = useState(null);
  const [tutorial, setTutorial] = useState(null);
  const [prevLesson, setPrevLesson] = useState(null);
  const [nextLesson, setNextLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [hasCompletedLesson, setHasCompletedLesson] = useState(false);
  
  // Fetch lesson data based on route params
  useEffect(() => {
    const fetchLessonData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch lesson
        let lessonResponse;
        if (lessonId) {
          lessonResponse = await lessonAPI.getById(lessonId);
        } else if (lessonSlug && tutorialId) {
          // This would require a custom endpoint in a real API
          const lessonsResponse = await lessonAPI.getByTutorial(tutorialId);
          const lessons = lessonsResponse.data;
          const foundLesson = lessons.find(l => l.slug === lessonSlug);
          if (foundLesson) {
            lessonResponse = { data: foundLesson };
          } else {
            throw new Error('Lesson not found');
          }
        } else {
          throw new Error('Invalid lesson parameters');
        }
        
        setLesson(lessonResponse.data);
        
        // Fetch tutorial
        const tutorialResponse = await tutorialAPI.getById(
          lessonResponse.data.tutorial._id || lessonResponse.data.tutorial
        );
        setTutorial(tutorialResponse.data);
        
        // Fetch all lessons for this tutorial to determine prev/next
        const allLessonsResponse = await lessonAPI.getByTutorial(
          tutorialResponse.data._id
        );
        const allLessons = allLessonsResponse.data;
        
        // Sort lessons by order
        const sortedLessons = allLessons.sort((a, b) => a.order - b.order);
        
        // Find current lesson index
        const currentIndex = sortedLessons.findIndex(l => 
          l._id === lessonResponse.data._id
        );
        
        // Set previous and next lessons
        if (currentIndex > 0) {
          setPrevLesson(sortedLessons[currentIndex - 1]);
        }
        
        if (currentIndex < sortedLessons.length - 1) {
          setNextLesson(sortedLessons[currentIndex + 1]);
        }
        
        // Check if user has completed this lesson
        if (isAuthenticated) {
          try {
            const progressResponse = await userAPI.getProgress();
            const progressItems = progressResponse.data;
            
            if (progressItems) {
              // In a real app, you would have a more specific way to track lesson completion
              // For now, we'll use the tutorial progress as a proxy
              const tutorialProgress = progressItems.find(item => 
                item.tutorial === tutorialResponse.data._id || 
                (item.tutorial && item.tutorial._id === tutorialResponse.data._id)
              );
              
              if (tutorialProgress && tutorialProgress.completion > 
                  (currentIndex / sortedLessons.length) * 100) {
                setHasCompletedLesson(true);
              }
            }
          } catch (err) {
            console.error('Error fetching progress:', err);
          }
        }
      } catch (err) {
        console.error('Error fetching lesson:', err);
        setError('Failed to load lesson content. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLessonData();
  }, [lessonId, tutorialId, lessonSlug, isAuthenticated]);
  
  // Mark lesson as completed
  const markAsCompleted = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    try {
      // In a real app, this would be a specific API call to mark a lesson as completed
      // For now, we'll just update the UI state
      setHasCompletedLesson(true);
      
      // You would have an API like this:
      // await userAPI.markLessonCompleted(lesson._id);
      
      // Alternatively, update the tutorial progress
      // const newProgress = ...calculate based on completed lessons
      // await userAPI.updateProgress(tutorial._id, newProgress);
      
      // For the demo, we'll just show the success state
      setTimeout(() => {
        if (nextLesson) {
          navigate(`/lessons/${nextLesson._id}`);
        }
      }, 1500);
    } catch (err) {
      console.error('Error marking lesson as completed:', err);
      alert('Failed to update progress. Please try again.');
    }
  };
  
  // Share lesson
  const shareContent = () => {
    if (navigator.share) {
      navigator.share({
        title: lesson?.title,
        text: tutorial?.title + ' - ' + lesson?.title,
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch((error) => console.log('Error copying link', error));
    }
  };
  
  // Render a content block based on its type
  const renderContentBlock = (block, index) => {
    switch (block.type) {
      case 'text':
        return (
          <div key={index} className="prose max-w-none mb-6">
            <div dangerouslySetInnerHTML={{ __html: block.data.text.replace(/\\n/g, '<br/>') }} />
          </div>
        );
        
      case 'code':
        return (
          <div key={index} className="mb-6">
            <div className="bg-gray-100 p-2 rounded-t-md border border-b-0">
              <span className="text-sm font-medium">
                {block.data.language || 'code'}
              </span>
            </div>
            <pre className="bg-gray-800 text-white p-4 rounded-b-md overflow-x-auto">
              <code>{block.data.code}</code>
            </pre>
          </div>
        );
        
      case 'image':
        return (
          <div key={index} className="mb-6">
            <img 
              src={block.data.url} 
              alt={block.data.alt || 'Lesson image'} 
              className="mx-auto rounded-md max-h-96"
            />
            {block.data.caption && (
              <p className="text-center text-sm text-gray-500 mt-2">{block.data.caption}</p>
            )}
          </div>
        );
        
      case 'video':
        return (
          <div key={index} className="mb-6">
            <div className="relative pt-[56.25%]">
              <iframe 
                src={block.data.url} 
                title={block.data.caption || 'Video content'}
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="absolute inset-0 w-full h-full rounded-md"
              ></iframe>
            </div>
            {block.data.caption && (
              <p className="text-center text-sm text-gray-500 mt-2">{block.data.caption}</p>
            )}
          </div>
        );
        
      default:
        return null;
    }
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
              <h3 className="text-sm font-medium text-red-800">Error loading lesson</h3>
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
  
  if (!lesson || !tutorial) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
          <div className="flex items-start">
            <AlertCircle className="flex-shrink-0 h-5 w-5 text-yellow-500 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Lesson not found</h3>
              <p className="text-sm text-yellow-700 mt-1">
                The lesson you're looking for doesn't exist or is no longer available.
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
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Lesson Navigation */}
      <div className="flex justify-between items-center mb-6">
        <Link 
          to={`/tutorials/${tutorial._id}`} 
          className="flex items-center text-emerald-600 hover:text-emerald-700"
        >
          <ArrowLeft size={18} className="mr-1" />
          <span>Back to Tutorial</span>
        </Link>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={shareContent}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
            title="Share this Lesson"
          >
            <Share2 size={20} />
          </button>
        </div>
      </div>
      
      {/* Tutorial/Lesson Info */}
      <div className="mb-6">
        <div className="flex items-center text-sm text-emerald-600 mb-2">
          <BookOpen size={16} className="mr-1" />
          <Link to={`/tutorials/${tutorial._id}`} className="hover:underline">
            {tutorial.title}
          </Link>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-3">{lesson.title}</h1>
        <div className="flex items-center text-sm text-gray-600">
          <Clock size={16} className="mr-1" />
          <span>{lesson.duration || 10} min</span>
        </div>
      </div>
      
      {/* Notes Component (for logged-in users) */}
      {isAuthenticated && (
        <NotesComponent tutorialId={tutorial._id} sectionId={lesson._id} />
      )}
      
      {/* Lesson Content */}
      <div className="mb-8">
        {lesson.content?.map((block, index) => renderContentBlock(block, index))}
      </div>
      
      {/* Lesson Navigation Controls */}
      <div className="border-t pt-6 mt-12">
        <div className="flex justify-between items-center">
          <div>
            {prevLesson && (
              <Link 
                to={`/lessons/${prevLesson._id}`} 
                className="flex items-center text-emerald-600 hover:text-emerald-700"
              >
                <ArrowLeft size={18} className="mr-1" />
                <span className="hidden sm:inline">Previous:</span> {prevLesson.title}
              </Link>
            )}
          </div>
          
          {isAuthenticated && (
            <button
              onClick={markAsCompleted}
              disabled={hasCompletedLesson}
              className={`px-4 py-2 rounded-md flex items-center gap-1 ${
                hasCompletedLesson 
                  ? 'bg-emerald-100 text-emerald-700 cursor-default' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {hasCompletedLesson ? (
                <>
                  <Check size={18} />
                  Completed
                </>
              ) : (
                <>
                  <Check size={18} />
                  Mark as Completed
                </>
              )}
            </button>
          )}
          
          <div>
            {nextLesson && (
              <Link 
                to={`/lessons/${nextLesson._id}`} 
                className="flex items-center text-emerald-600 hover:text-emerald-700"
              >
                <span className="hidden sm:inline">Next:</span> {nextLesson.title}
                <ArrowRight size={18} className="ml-1" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicLesson;