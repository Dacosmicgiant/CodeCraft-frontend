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
  Pause,
  Copy,
  ExternalLink,
  Quote,
  AlertTriangle,
  CheckSquare,
  Square
} from 'lucide-react';
import { lessonAPI, tutorialAPI, userAPI } from '../../services/api';
import NotesComponent from '../../components/tutorial/NotesComponent';
import { useAuth } from '../../hooks/useAuth';
import { COLORS } from '../../constants/colors';

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
  
  useEffect(() => {
    fetchLessonData();
  }, [lessonId, tutorialId, lessonSlug]);

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
          const tutorialResponse = await tutorialAPI.getById(tutorialId);
          tutorialData = tutorialResponse.data;

          const lessonsResponse = await lessonAPI.getByTutorial(tutorialId);
          allLessonsData = lessonsResponse.data || [];

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
      const progressResponse = await userAPI.getProgress();
      const progressItems = progressResponse.data || [];
      
      const tutorialProgress = progressItems.find(item => 
        item.tutorial === tutorial._id || 
        (item.tutorial && item.tutorial._id === tutorial._id)
      );
      
      if (tutorialProgress && allLessons.length > 0) {
        const expectedProgress = ((currentLessonIndex + 1) / allLessons.length) * 100;
        setHasCompletedLesson(tutorialProgress.completion >= expectedProgress);
      }
    } catch (err) {
      console.warn('Could not check completion status:', err);
    }
  };
  
  const markAsCompleted = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    setIsMarkingComplete(true);
    
    try {
      const newProgress = ((currentLessonIndex + 1) / allLessons.length) * 100;
      setHasCompletedLesson(true);
      
      setTimeout(() => {
        if (nextLesson) {
          navigate(`/lessons/${nextLesson._id}`);
        } else {
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

  const processTextWithEmbeds = (text) => {
    if (!text) return text;
    
    const youtubeRegex = /(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11}))/g;
    const youtubeMatches = text.match(youtubeRegex);
    
    if (youtubeMatches) {
      const trimmedText = text.trim();
      const isJustUrl = youtubeMatches.some(url => trimmedText === url);
      
      if (isJustUrl) {
        const videoId = trimmedText.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1];
        return { type: 'youtube-embed', videoId, originalUrl: trimmedText };
      }
    }
    
    return text;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => console.log('Code copied to clipboard'))
      .catch((err) => console.error('Failed to copy code:', err));
  };
  
  const renderContentBlock = (block, index) => {
    if (!block || !block.type) return null;

    const blockData = block.data || {};

    switch (block.type) {
      case 'header':
        const HeaderTag = `h${blockData.level || 2}`;
        const headerClasses = {
          1: `text-3xl font-bold mb-6 ${COLORS.text.dark}`,
          2: `text-2xl font-bold mb-5 ${COLORS.text.dark}`,
          3: `text-xl font-bold mb-4 ${COLORS.text.light}`,
          4: `text-lg font-semibold mb-3 ${COLORS.text.light}`,
          5: `text-base font-semibold mb-3 ${COLORS.text.secondary}`,
          6: `text-sm font-semibold mb-2 ${COLORS.text.secondary}`
        };
        
        return (
          <div key={index} className="mb-6">
            <HeaderTag className={headerClasses[blockData.level || 2]}>
              {blockData.text || ''}
            </HeaderTag>
          </div>
        );

      case 'paragraph':
      case 'text':
        const textContent = blockData.text || '';
        const processedText = processTextWithEmbeds(textContent);
        
        if (typeof processedText === 'object' && processedText.type === 'youtube-embed') {
          return (
            <div key={index} className="mb-6">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                <iframe
                  src={`https://www.youtube.com/embed/${processedText.videoId}`}
                  title="YouTube video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
              <p className={`text-xs ${COLORS.text.tertiary} mt-2`}>
                Original URL: {processedText.originalUrl}
              </p>
            </div>
          );
        }
        
        return (
          <div key={index} className="mb-6">
            <div 
              className={`prose max-w-none ${COLORS.text.secondary} leading-relaxed`}
              dangerouslySetInnerHTML={{ 
                __html: (typeof processedText === 'string' ? processedText : textContent).replace(/\n/g, '<br/>') 
              }} 
            />
          </div>
        );

      case 'list':
        const ListTag = blockData.style === 'ordered' ? 'ol' : 'ul';
        const listClasses = blockData.style === 'ordered' 
          ? 'list-decimal list-inside space-y-2' 
          : 'list-disc list-inside space-y-2';

        return (
          <div key={index} className="mb-6">
            <ListTag className={listClasses}>
              {(blockData.items || []).map((item, itemIndex) => {
                const content = typeof item === 'string' ? item : (item.content || item.text || '');
                return (
                  <li key={itemIndex} className={`${COLORS.text.secondary} leading-relaxed`}>
                    <span dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br/>') }} />
                  </li>
                );
              })}
            </ListTag>
          </div>
        );

      case 'checklist':
        return (
          <div key={index} className="mb-6">
            <div className="space-y-3">
              {(blockData.items || []).map((item, itemIndex) => {
                const content = typeof item === 'string' ? item : (item.content || item.text || '');
                const isChecked = typeof item === 'object' && item.checked;
                
                return (
                  <div key={itemIndex} className="flex items-start gap-3">
                    {isChecked ? (
                      <CheckSquare size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                    ) : (
                      <Square size={18} className={`${COLORS.text.tertiary} mt-0.5 flex-shrink-0`} />
                    )}
                    <span 
                      className={`${COLORS.text.secondary} leading-relaxed ${isChecked ? 'line-through text-gray-500' : ''}`}
                      dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br/>') }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
        
      case 'code':
        return (
          <div key={index} className="mb-6">
            <div className={`${COLORS.background.tertiary} px-4 py-2 rounded-t-lg ${COLORS.border.secondary} border border-b-0 flex items-center justify-between`}>
              <span className={`text-sm font-medium ${COLORS.text.secondary}`}>
                {blockData.language || 'code'}
              </span>
              <button
                onClick={() => copyToClipboard(blockData.code || '')}
                className={`p-1.5 ${COLORS.text.secondary} hover:${COLORS.text.dark} hover:${COLORS.background.secondary} rounded-md transition-colors`}
                title="Copy code"
              >
                <Copy size={14} />
              </button>
            </div>
            <div className="relative">
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-b-lg overflow-x-auto">
                <code>{blockData.code || ''}</code>
              </pre>
            </div>
          </div>
        );

      case 'quote':
        return (
          <div key={index} className="mb-6">
            <blockquote className={`border-l-4 ${COLORS.border.primaryDark} ${COLORS.background.primaryLight} pl-6 pr-4 py-4 rounded-r-lg`}>
              <div className="flex items-start gap-3">
                <Quote size={20} className={`${COLORS.text.primary} mt-1 flex-shrink-0`} />
                <div>
                  <p className={`${COLORS.text.light} italic text-lg leading-relaxed mb-2`}>
                    {blockData.text || ''}
                  </p>
                  {blockData.caption && (
                    <cite className={`text-sm ${COLORS.text.primary} font-medium`}>
                      — {blockData.caption}
                    </cite>
                  )}
                </div>
              </div>
            </blockquote>
          </div>
        );

      case 'warning':
        return (
          <div key={index} className="mb-6">
            <div className={`${COLORS.status.warning.bg} ${COLORS.status.warning.border} border rounded-lg p-4`}>
              <div className="flex items-start gap-3">
                <AlertTriangle size={20} className={`${COLORS.status.warning.text} mt-0.5 flex-shrink-0`} />
                <div>
                  {blockData.title && (
                    <h4 className={`font-semibold ${COLORS.status.warning.text} mb-2`}>
                      {blockData.title}
                    </h4>
                  )}
                  <p className={`${COLORS.status.warning.text} leading-relaxed`}>
                    {blockData.message || blockData.text || ''}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'delimiter':
        return (
          <div key={index} className="mb-8">
            <hr className={COLORS.border.secondary} />
          </div>
        );

      case 'table':
        if (!blockData.content || !Array.isArray(blockData.content)) return null;
        
        return (
          <div key={index} className="mb-6 overflow-x-auto">
            <table className={`min-w-full ${COLORS.border.secondary} border rounded-lg overflow-hidden`}>
              <tbody>
                {blockData.content.map((row, rowIndex) => (
                  <tr key={rowIndex} className={rowIndex % 2 === 0 ? COLORS.background.tertiary : COLORS.background.white}>
                    {row.map((cell, cellIndex) => {
                      const isHeader = blockData.withHeadings && rowIndex === 0;
                      const CellTag = isHeader ? 'th' : 'td';
                      
                      return (
                        <CellTag
                          key={cellIndex}
                          className={`px-4 py-3 ${COLORS.border.secondary} border-r last:border-r-0 ${
                            isHeader 
                              ? `font-semibold ${COLORS.text.dark} ${COLORS.background.secondary}` 
                              : COLORS.text.secondary
                          }`}
                        >
                          {cell}
                        </CellTag>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        
      case 'image':
        return (
          <div key={index} className="mb-6">
            <div className="text-center">
              <div className={`inline-block ${blockData.stretched ? 'w-full' : ''}`}>
                <img 
                  src={blockData.url || '/api/placeholder/600/400'} 
                  alt={blockData.alt || 'Lesson image'} 
                  className={`mx-auto rounded-lg shadow-sm max-h-96 ${
                    blockData.withBorder ? `border-2 ${COLORS.border.secondary}` : ''
                  } ${
                    blockData.withBackground ? `${COLORS.background.tertiary} p-4` : ''
                  }`}
                />
              </div>
              {blockData.caption && (
                <p className={`text-center text-sm ${COLORS.text.tertiary} mt-3 italic`}>{blockData.caption}</p>
              )}
            </div>
          </div>
        );
        
      case 'video':
      case 'embed':
        let embedUrl = '';
        
        if (blockData.service === 'youtube') {
          const videoId = blockData.videoId || blockData.url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1];
          embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : blockData.embed;
        } else if (blockData.service === 'vimeo') {
          const videoId = blockData.videoId || blockData.url?.match(/vimeo\.com\/(?:video\/)?(\d+)/)?.[1];
          embedUrl = videoId ? `https://player.vimeo.com/video/${videoId}` : blockData.embed;
        } else {
          embedUrl = blockData.embed || blockData.url;
          
          if (!embedUrl && blockData.url) {
            const youtubeId = blockData.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1];
            if (youtubeId) {
              embedUrl = `https://www.youtube.com/embed/${youtubeId}`;
            }
          }
        }

        if (!embedUrl) {
          return (
            <div key={index} className={`mb-6 p-4 ${COLORS.status.error.bg} ${COLORS.status.error.border} border rounded-lg`}>
              <p className={COLORS.status.error.text}>
                <strong>Video Error:</strong> No valid video URL found.
              </p>
            </div>
          );
        }

        return (
          <div key={index} className="mb-6">
            <div className={`w-full ${COLORS.background.tertiary} rounded-lg overflow-hidden shadow-sm`}>
              <iframe 
                src={embedUrl}
                title={blockData.caption || 'Video content'}
                width="560"
                height="315"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full aspect-video"
                style={{ minHeight: '315px' }}
              />
            </div>
            {blockData.caption && (
              <p className={`text-center text-sm ${COLORS.text.tertiary} mt-3 italic`}>{blockData.caption}</p>
            )}
          </div>
        );

      case 'quiz':
        return (
          <div key={index} className="mb-6">
            <QuizBlock 
              question={blockData.question}
              options={blockData.options || []}
              correctAnswer={blockData.correctAnswer}
              explanation={blockData.explanation}
            />
          </div>
        );

      case 'linkTool':
        return (
          <div key={index} className="mb-6">
            <a 
              href={blockData.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`block p-4 ${COLORS.border.secondary} border rounded-lg hover:${COLORS.border.primary} hover:${COLORS.background.primaryLight} transition-colors`}
            >
              <div className="flex items-center gap-3">
                <ExternalLink size={20} className={`${COLORS.text.primary} flex-shrink-0`} />
                <div>
                  <h4 className={`font-medium ${COLORS.text.dark}`}>{blockData.meta?.title || blockData.link}</h4>
                  {blockData.meta?.description && (
                    <p className={`text-sm ${COLORS.text.secondary} mt-1`}>{blockData.meta.description}</p>
                  )}
                </div>
              </div>
            </a>
          </div>
        );

      case 'raw':
        return (
          <div key={index} className="mb-6">
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: blockData.html || '' }} 
            />
          </div>
        );
        
      default:
        return (
          <div key={index} className={`mb-6 p-4 ${COLORS.status.warning.bg} ${COLORS.status.warning.border} border rounded-lg`}>
            <p className={`${COLORS.status.warning.text} font-medium mb-2`}>
              Unsupported content type: <code className={`${COLORS.background.white} px-2 py-1 rounded`}>{block.type}</code>
            </p>
          </div>
        );
    }
  };
  
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <Loader size={40} className={`animate-spin ${COLORS.text.primary} mb-4`} />
          <p className={COLORS.text.secondary}>Loading lesson...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className={`${COLORS.status.error.bg} border-l-4 ${COLORS.status.error.border} p-4 mb-6`}>
          <div className="flex items-start">
            <AlertCircle className={`flex-shrink-0 h-5 w-5 ${COLORS.status.error.text} mt-0.5`} />
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${COLORS.status.error.text}`}>Error loading lesson</h3>
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
  
  if (!lesson || !tutorial) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className={`${COLORS.status.warning.bg} border-l-4 ${COLORS.status.warning.border} p-4 mb-6`}>
          <div className="flex items-start">
            <AlertCircle className={`flex-shrink-0 h-5 w-5 ${COLORS.status.warning.text} mt-0.5`} />
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${COLORS.status.warning.text}`}>Lesson not found</h3>
              <p className={`text-sm ${COLORS.status.warning.text} mt-1`}>
                The lesson you're looking for doesn't exist or is no longer available.
              </p>
            </div>
          </div>
        </div>
        <Link 
          to="/tutorials" 
          className={`inline-flex items-center ${COLORS.text.primary} hover:${COLORS.text.primaryHover}`}
        >
          <ArrowLeft size={18} className="mr-1" />
          Browse Tutorials
        </Link>
      </div>
    );
  }
  
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
            <Link 
              to={`/tutorials/${tutorial.slug || tutorial._id}`} 
              className={`${COLORS.text.primary} hover:${COLORS.text.primaryHover} hover:underline`}
            >
              {tutorial.title}
            </Link>
          </li>
          <span className={`${COLORS.text.tertiary} mx-2`}>/</span>
          <li>
            <span className={`${COLORS.text.secondary} font-medium`}>{lesson.title}</span>
          </li>
        </ol>
      </nav>

      {/* Lesson Navigation */}
      <div className="flex justify-between items-center mb-6">
        <Link 
          to={`/tutorials/${tutorial.slug || tutorial._id}`} 
          className={`flex items-center ${COLORS.text.primary} hover:${COLORS.text.primaryHover}`}
        >
          <ArrowLeft size={18} className="mr-1" />
          <span>Back to Tutorial</span>
        </Link>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={shareContent}
            className={`p-2 ${COLORS.text.tertiary} hover:${COLORS.background.tertiary} rounded-full`}
            title="Share this Lesson"
          >
            <Share2 size={20} />
          </button>
        </div>
      </div>

      {/* Lesson Progress Indicator */}
      {allLessons.length > 0 && (
        <div className="mb-6">
          <div className={`flex justify-between text-sm ${COLORS.text.secondary} mb-2`}>
            <span>Lesson {currentLessonIndex + 1} of {allLessons.length}</span>
            <span>{Math.round(((currentLessonIndex + 1) / allLessons.length) * 100)}% Complete</span>
          </div>
          <div className={`w-full ${COLORS.background.tertiary} rounded-full h-2`}>
            <div 
              className={`${COLORS.background.primary} h-2 rounded-full transition-all duration-300`} 
              style={{ width: `${((currentLessonIndex + 1) / allLessons.length) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {/* Tutorial/Lesson Info */}
      <div className="mb-8">
        <div className={`flex items-center text-sm ${COLORS.text.primary} mb-2`}>
          <BookOpen size={16} className="mr-1" />
          <Link to={`/tutorials/${tutorial.slug || tutorial._id}`} className="hover:underline">
            {tutorial.title}
          </Link>
        </div>
        <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${COLORS.text.dark}`}>{lesson.title}</h1>
        <div className={`flex items-center text-sm ${COLORS.text.secondary}`}>
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
      
      {/* Notes Component */}
      {isAuthenticated && (
        <div className="mb-8">
          <NotesComponent tutorialId={tutorial._id} sectionId={lesson._id} />
        </div>
      )}
      
      {/* Lesson Content */}
      <div className="mb-12">
        {(() => {
          let contentBlocks = [];
          
          if (lesson.content) {
            if (lesson.content.blocks && Array.isArray(lesson.content.blocks)) {
              contentBlocks = lesson.content.blocks;
            } else if (Array.isArray(lesson.content)) {
              contentBlocks = lesson.content;
            } else if (lesson.content.type) {
              contentBlocks = [lesson.content];
            }
          }

          return contentBlocks.length > 0 ? (
            contentBlocks.map((block, index) => renderContentBlock(block, index))
          ) : (
            <div className={`${COLORS.background.tertiary} border rounded-lg p-8 text-center`}>
              <BookOpen size={48} className={`mx-auto ${COLORS.text.tertiary} mb-4`} />
              <h3 className={`text-lg font-medium ${COLORS.text.dark} mb-2`}>Content coming soon</h3>
              <p className={COLORS.text.secondary}>
                This lesson content is being prepared and will be available soon.
              </p>
            </div>
          );
        })()}
      </div>
      
      {/* Lesson Actions */}
      {isAuthenticated && (
        <div className={`${COLORS.background.tertiary} border rounded-lg p-6 mb-8`}>
          <div className="flex justify-center">
            <button
              onClick={markAsCompleted}
              disabled={hasCompletedLesson || isMarkingComplete}
              className={`px-8 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors ${
                hasCompletedLesson 
                  ? `${COLORS.status.success.bg} ${COLORS.status.success.text} cursor-default` 
                  : `${COLORS.button.primary} disabled:opacity-70`
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
      <div className={`border-t ${COLORS.border.secondary} pt-8 mt-12`}>
        <div className="flex justify-between items-center">
          <div className="flex-1">
            {prevLesson ? (
              <Link 
                to={`/lessons/${prevLesson._id}`} 
                className={`inline-flex items-center ${COLORS.text.primary} hover:${COLORS.text.primaryHover} group`}
              >
                <ArrowLeft size={18} className="mr-3 group-hover:-translate-x-1 transition-transform" />
                <div className="text-left">
                  <div className={`text-sm ${COLORS.text.tertiary}`}>Previous</div>
                  <div className="font-medium">{prevLesson.title}</div>
                </div>
              </Link>
            ) : (
              <div></div>
            )}
          </div>
          
          <div className="flex-1 text-right">
            {nextLesson ? (
              <Link 
                to={`/lessons/${nextLesson._id}`} 
                className={`inline-flex items-center ${COLORS.text.primary} hover:${COLORS.text.primaryHover} group`}
              >
                <div className="text-right mr-3">
                  <div className={`text-sm ${COLORS.text.tertiary}`}>Next</div>
                  <div className="font-medium">{nextLesson.title}</div>
                </div>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : allLessons.length > 0 && currentLessonIndex === allLessons.length - 1 ? (
              <Link 
                to={`/tutorials/${tutorial.slug || tutorial._id}`}
                className={`inline-flex items-center ${COLORS.text.primary} hover:${COLORS.text.primaryHover} group`}
              >
                <div className="text-right mr-3">
                  <div className={`text-sm ${COLORS.text.tertiary}`}>Completed!</div>
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

// Enhanced Quiz Block Component
const QuizBlock = ({ question, options = [], correctAnswer, explanation }) => {
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
    <div className={`${COLORS.status.info.bg} ${COLORS.status.info.border} border rounded-lg p-6`}>
      <h4 className={`font-bold ${COLORS.status.info.text} mb-4 flex items-center text-lg`}>
        <Play size={20} className="mr-2" />
        Quick Quiz
      </h4>
      
      <p className={`${COLORS.text.dark} mb-4 font-medium`}>{question}</p>
      
      <div className="space-y-3 mb-4">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(index)}
            disabled={showResult}
            className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
              showResult
                ? index === correctAnswer
                  ? `${COLORS.status.success.bg} ${COLORS.status.success.border} ${COLORS.status.success.text} shadow-sm`
                  : index === selectedAnswer
                  ? `${COLORS.status.error.bg} ${COLORS.status.error.border} ${COLORS.status.error.text}`
                  : `${COLORS.background.tertiary} ${COLORS.border.secondary} ${COLORS.text.tertiary}`
                : `${COLORS.background.white} ${COLORS.border.secondary} hover:${COLORS.background.primaryLight} hover:${COLORS.border.primary} hover:shadow-sm`
            }`}
          >
            <span className="font-medium mr-3 text-sm">
              {String.fromCharCode(65 + index)}.
            </span>
            {option}
          </button>
        ))}
      </div>
      
      {showResult && (
        <div className={`border-t ${COLORS.border.secondary} pt-4`}>
          <div className="flex items-center justify-between mb-3">
            <span className={`font-semibold flex items-center gap-2 ${
              selectedAnswer === correctAnswer ? 'text-green-600' : 'text-red-600'
            }`}>
              {selectedAnswer === correctAnswer ? (
                <>
                  <Check size={18} />
                  Correct!
                </>
              ) : (
                <>
                  <AlertCircle size={18} />
                  Incorrect
                </>
              )}
            </span>
            <button
              onClick={resetQuiz}
              className={`text-sm ${COLORS.text.primary} hover:${COLORS.text.primaryHover} underline font-medium`}
            >
              Try Again
            </button>
          </div>
          
          {explanation && (
            <div className={`${COLORS.status.info.bg} ${COLORS.status.info.border} border rounded-lg p-3`}>
              <p className={`text-sm ${COLORS.status.info.text}`}>
                <strong>Explanation:</strong> {explanation}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DynamicLesson;