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
  BookOpen,
  Loader,
  Play,
  Pause
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
  const [allLessons, setAllLessons] = useState([]);
  const [prevLesson, setPrevLesson] = useState(null);
  const [nextLesson, setNextLesson] = useState(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasCompletedLesson, setHasCompletedLesson] = useState(false);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  
  // Fetch lesson data based on route params
  useEffect(() => {
    fetchLessonData();
  }, [lessonId, tutorialId, lessonSlug]);

  // Check completion status when lesson or user changes
  useEffect(() => {
    if (lesson && tutorial && isAuthenticated) {
      checkCompletionStatus();
    }
  }, [lesson, tutorial, isAuthenticated]);

  const fetchLessonData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      let lessonData = null;
      let tutorialData = null;
      let allLessonsData = [];

      // Strategy 1: Direct lesson access via ID
      if (lessonId) {
        try {
          const lessonResponse = await lessonAPI.getById(lessonId);
          lessonData = lessonResponse.data;
          
          // Get tutorial from lesson
          const tutorialId = lessonData.tutorial._id || lessonData.tutorial;
          const tutorialResponse = await tutorialAPI.getById(tutorialId);
          tutorialData = tutorialResponse.data;
        } catch (err) {
          console.error('Error fetching lesson by ID:', err);
        }
      }

      // Strategy 2: Find lesson by slug within tutorial
      if (!lessonData && lessonSlug && tutorialId) {
        try {
          // Get tutorial first
          const tutorialResponse = await tutorialAPI.getById(tutorialId);
          tutorialData = tutorialResponse.data;

          // Get all lessons for this tutorial
          const lessonsResponse = await lessonAPI.getByTutorial(tutorialId);
          allLessonsData = lessonsResponse.data || [];

          // Find lesson by slug
          lessonData = allLessonsData.find(l => l.slug === lessonSlug);
          
          if (!lessonData) {
            throw new Error('Lesson not found');
          }
        } catch (err) {
          console.error('Error fetching lesson by slug:', err);
        }
      }

      if (!lessonData || !tutorialData) {
        throw new Error('Lesson or tutorial not found');
      }

      // If we don't have all lessons yet, fetch them
      if (allLessonsData.length === 0) {
        try {
          const lessonsResponse = await lessonAPI.getByTutorial(tutorialData._id);
          allLessonsData = lessonsResponse.data || [];
        } catch (err) {
          console.warn('Could not fetch all lessons:', err);
        }
      }

      // Sort lessons by order
      const sortedLessons = allLessonsData.sort((a, b) => (a.order || 0) - (b.order || 0));
      
      // Find current lesson index and set prev/next
      const currentIndex = sortedLessons.findIndex(l => l._id === lessonData._id);
      setCurrentLessonIndex(currentIndex);
      
      if (currentIndex > 0) {
        setPrevLesson(sortedLessons[currentIndex - 1]);
      } else {
        setPrevLesson(null);
      }
      
      if (currentIndex < sortedLessons.length - 1) {
        setNextLesson(sortedLessons[currentIndex + 1]);
      } else {
        setNextLesson(null);
      }

      setLesson(lessonData);
      setTutorial(tutorialData);
      setAllLessons(sortedLessons);
      
    } catch (err) {
      console.error('Error fetching lesson:', err);
      setError('Failed to load lesson content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const checkCompletionStatus = async () => {
    try {
      // Get user progress to check if lesson is completed
      const progressResponse = await userAPI.getProgress();
      const progressItems = progressResponse.data || [];
      
      // Find tutorial progress
      const tutorialProgress = progressItems.find(item => 
        item.tutorial === tutorial._id || 
        (item.tutorial && item.tutorial._id === tutorial._id)
      );
      
      if (tutorialProgress && allLessons.length > 0) {
        // Calculate expected progress if this lesson was completed
        const expectedProgress = ((currentLessonIndex + 1) / allLessons.length) * 100;
        
        // If current progress is at least the expected progress, lesson is completed
        setHasCompletedLesson(tutorialProgress.completion >= expectedProgress);
      }
    } catch (err) {
      console.warn('Could not check completion status:', err);
    }
  };
  
  // Mark lesson as completed
  const markAsCompleted = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    setIsMarkingComplete(true);
    
    try {
      // Calculate new progress percentage
      const newProgress = ((currentLessonIndex + 1) / allLessons.length) * 100;
      
      // In a real implementation, you would have an endpoint to update lesson completion
      // For now, we'll simulate this by updating tutorial progress
      // await userAPI.updateTutorialProgress(tutorial._id, newProgress);
      
      setHasCompletedLesson(true);
      
      // Show success message briefly, then navigate to next lesson
      setTimeout(() => {
        if (nextLesson) {
          navigate(`/lessons/${nextLesson._id}`);
        } else {
          // If this was the last lesson, go back to tutorial
          navigate(`/tutorials/${tutorial.slug || tutorial._id}`);
        }
      }, 1500);
      
    } catch (err) {
      console.error('Error marking lesson as completed:', err);
      alert('Failed to update progress. Please try again.');
    } finally {
      setIsMarkingComplete(false);
    }
  };
  
  // Share lesson
  const shareContent = () => {
    if (navigator.share) {
      navigator.share({
        title: lesson?.title,
        text: `${tutorial?.title} - ${lesson?.title}`,
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
    if (!block || !block.type) return null;

    switch (block.type) {
      case 'text':
        return (
          <div key={index} className="mb-6">
            <div 
              className="prose max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ 
                __html: block.data?.text?.replace(/\n/g, '<br/>') || ''
              }} 
            />
          </div>
        );
        
      case 'code':
        return (
          <div key={index} className="mb-6">
            <div className="bg-gray-100 p-2 rounded-t-md border border-b-0">
              <span className="text-sm font-medium">
                {block.data?.language || 'code'}
              </span>
            </div>
            <div className="relative">
              <pre className="bg-gray-800 text-white p-4 rounded-b-md overflow-x-auto">
                <code>{block.data?.code || ''}</code>
              </pre>
              <button
                onClick={() => navigator.clipboard.writeText(block.data?.code || '')}
                className="absolute top-2 right-2 p-1.5 bg-gray-700 hover:bg-gray-600 rounded-md"
                title="Copy code"
              >
                <BookOpen size={14} className="text-white" />
              </button>
            </div>
          </div>
        );
        
      case 'image':
        return (
          <div key={index} className="mb-6">
            <div className="text-center">
              <img 
                src={block.data?.url || '/api/placeholder/600/400'} 
                alt={block.data?.alt || 'Lesson image'} 
                className="mx-auto rounded-md max-h-96 shadow-sm"
              />
              {block.data?.caption && (
                <p className="text-center text-sm text-gray-500 mt-2">{block.data.caption}</p>
              )}
            </div>
          </div>
        );
        
      case 'video':
        return (
          <div key={index} className="mb-6">
            <div className="relative pt-[56.25%]">
              <iframe 
                src={block.data?.url} 
                title={block.data?.caption || 'Video content'}
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="absolute inset-0 w-full h-full rounded-md"
              ></iframe>
            </div>
            {block.data?.caption && (
              <p className="text-center text-sm text-gray-500 mt-2">{block.data.caption}</p>
            )}
          </div>
        );

      case 'quiz':
        return (
          <div key={index} className="mb-6">
            <QuizBlock 
              question={block.data?.question}
              options={block.data?.options || []}
              correctAnswer={block.data?.correctAnswer}
            />
          </div>
        );
        
      default:
        return null;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader size={40} className="animate-spin text-emerald-600 mb-4" />
        <p className="text-gray-500">Loading lesson...</p>
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
          to={`/tutorials/${tutorial.slug || tutorial._id}`} 
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

      {/* Lesson Progress Indicator */}
      {allLessons.length > 0 && (
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Lesson {currentLessonIndex + 1} of {allLessons.length}</span>
            <span>{Math.round(((currentLessonIndex + 1) / allLessons.length) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-emerald-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${((currentLessonIndex + 1) / allLessons.length) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {/* Tutorial/Lesson Info */}
      <div className="mb-6">
        <div className="flex items-center text-sm text-emerald-600 mb-2">
          <BookOpen size={16} className="mr-1" />
          <Link to={`/tutorials/${tutorial.slug || tutorial._id}`} className="hover:underline">
            {tutorial.title}
          </Link>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-3">{lesson.title}</h1>
        <div className="flex items-center text-sm text-gray-600">
          <Clock size={16} className="mr-1" />
          <span>{lesson.duration || 10} min</span>
          {hasCompletedLesson && (
            <>
              <span className="mx-2">•</span>
              <Check size={16} className="mr-1 text-green-600" />
              <span className="text-green-600">Completed</span>
            </>
          )}
        </div>
      </div>
      
      {/* Notes Component (for logged-in users) */}
      {isAuthenticated && (
        <NotesComponent tutorialId={tutorial._id} sectionId={lesson._id} />
      )}
      
      {/* Lesson Content */}
      <div className="mb-8">
        {lesson.content && lesson.content.length > 0 ? (
          lesson.content.map((block, index) => renderContentBlock(block, index))
        ) : (
          <div className="bg-gray-50 border rounded-md p-8 text-center">
            <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Content coming soon</h3>
            <p className="text-gray-600">
              This lesson content is being prepared and will be available soon.
            </p>
          </div>
        )}
      </div>
      
      {/* Lesson Actions */}
      {isAuthenticated && (
        <div className="bg-gray-50 border rounded-md p-4 mb-8">
          <div className="flex justify-center">
            <button
              onClick={markAsCompleted}
              disabled={hasCompletedLesson || isMarkingComplete}
              className={`px-6 py-3 rounded-md flex items-center gap-2 font-medium ${
                hasCompletedLesson 
                  ? 'bg-green-100 text-green-700 cursor-default' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-70'
              }`}
            >
              {isMarkingComplete ? (
                <Loader size={18} className="animate-spin" />
              ) : (
                <Check size={18} />
              )}
              {hasCompletedLesson ? 'Lesson Completed' : 'Mark as Completed'}
            </button>
          </div>
        </div>
      )}
      
      {/* Lesson Navigation Controls */}
      <div className="border-t pt-6 mt-12">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            {prevLesson ? (
              <Link 
                to={`/lessons/${prevLesson._id}`} 
                className="inline-flex items-center text-emerald-600 hover:text-emerald-700 group"
              >
                <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                <div className="text-left">
                  <div className="text-sm text-gray-500">Previous</div>
                  <div className="font-medium">{prevLesson.title}</div>
                </div>
              </Link>
            ) : (
              <div></div> // Empty div to maintain flex layout
            )}
          </div>
          
          <div className="flex-1 text-right">
            {nextLesson ? (
              <Link 
                to={`/lessons/${nextLesson._id}`} 
                className="inline-flex items-center text-emerald-600 hover:text-emerald-700 group"
              >
                <div className="text-right mr-2">
                  <div className="text-sm text-gray-500">Next</div>
                  <div className="font-medium">{nextLesson.title}</div>
                </div>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : allLessons.length > 0 && currentLessonIndex === allLessons.length - 1 ? (
              <Link 
                to={`/tutorials/${tutorial.slug || tutorial._id}`}
                className="inline-flex items-center text-emerald-600 hover:text-emerald-700 group"
              >
                <div className="text-right mr-2">
                  <div className="text-sm text-gray-500">Completed!</div>
                  <div className="font-medium">Back to Tutorial</div>
                </div>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

// Quiz Block Component
const QuizBlock = ({ question, options = [], correctAnswer }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleAnswerSelect = (optionIndex) => {
    setSelectedAnswer(optionIndex);
    setShowResult(true);
  };

  const resetQuiz = () => {
    setSelectedAnswer(null);
    setShowResult(false);
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
      <h4 className="font-bold text-blue-800 mb-3 flex items-center">
        <Play size={16} className="mr-2" />
        Quick Quiz: {question}
      </h4>
      
      <div className="space-y-2 mb-4">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(index)}
            disabled={showResult}
            className={`w-full text-left p-3 rounded border transition-colors ${
              showResult
                ? index === correctAnswer
                  ? 'bg-green-100 border-green-500 text-green-800'
                  : index === selectedAnswer
                  ? 'bg-red-100 border-red-500 text-red-800'
                  : 'bg-gray-100 border-gray-300 text-gray-600'
                : 'bg-white border-blue-300 hover:bg-blue-50 hover:border-blue-400'
            }`}
          >
            <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
            {option}
          </button>
        ))}
      </div>
      
      {showResult && (
        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${
            selectedAnswer === correctAnswer ? 'text-green-600' : 'text-red-600'
          }`}>
            {selectedAnswer === correctAnswer ? '✓ Correct!' : '✗ Incorrect'}
          </span>
          <button
            onClick={resetQuiz}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default DynamicLesson;