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

  // Helper function to extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Helper function to get Vimeo video ID
  const getVimeoVideoId = (url) => {
    const regex = /(?:vimeo\.com\/)([0-9]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Helper function to detect and convert URLs in text to embeds
  const processTextWithEmbeds = (text) => {
    if (!text) return text;
    
    console.log(`Processing text for embeds: "${text}"`);
    
    // YouTube URL regex
    const youtubeRegex = /(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11}))/g;
    
    // Check if text contains YouTube URLs
    const youtubeMatches = text.match(youtubeRegex);
    console.log(`YouTube matches found:`, youtubeMatches);
    
    if (youtubeMatches) {
      // If text is just a YouTube URL, render as embed
      const trimmedText = text.trim();
      const isJustUrl = youtubeMatches.some(url => trimmedText === url);
      
      console.log(`Is just URL: ${isJustUrl}, trimmed text: "${trimmedText}"`);
      
      if (isJustUrl) {
        const videoId = getYouTubeVideoId(trimmedText);
        console.log(`Extracted video ID: ${videoId}`);
        return { type: 'youtube-embed', videoId, originalUrl: trimmedText };
      }
    }
    
    return text;
  };

  // Copy code to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        // You could add a toast notification here
        console.log('Code copied to clipboard');
      })
      .catch((err) => {
        console.error('Failed to copy code:', err);
      });
  };
  
  // Render a content block based on its type
  const renderContentBlock = (block, index) => {
    // Debug logging
    console.log(`Rendering block ${index}:`, block);
    
    if (!block) {
      console.warn(`Block ${index} is null or undefined`);
      return null;
    }
    
    if (!block.type) {
      console.warn(`Block ${index} missing type:`, block);
      return null;
    }

    // Handle case where data might be missing
    const blockData = block.data || {};

    switch (block.type) {
      case 'header':
        const HeaderTag = `h${blockData.level || 2}`;
        const headerClasses = {
          1: 'text-3xl font-bold mb-6 text-gray-900',
          2: 'text-2xl font-bold mb-5 text-gray-900',
          3: 'text-xl font-bold mb-4 text-gray-800',
          4: 'text-lg font-semibold mb-3 text-gray-800',
          5: 'text-base font-semibold mb-3 text-gray-700',
          6: 'text-sm font-semibold mb-2 text-gray-700'
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
        console.log(`Processing text block: "${textContent}"`);
        
        const processedText = processTextWithEmbeds(textContent);
        console.log(`Processed text result:`, processedText);
        
        // If it's a YouTube embed, render as video
        if (typeof processedText === 'object' && processedText.type === 'youtube-embed') {
          console.log(`Rendering YouTube embed from text:`, processedText);
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
              <p className="text-xs text-gray-500 mt-2">
                Original URL: {processedText.originalUrl}
              </p>
              {process.env.NODE_ENV === 'development' && (
                <p className="text-xs text-blue-600 mt-1">
                  Auto-detected YouTube URL in text block
                </p>
              )}
            </div>
          );
        }
        
        return (
          <div key={index} className="mb-6">
            <div 
              className="prose max-w-none text-gray-700 leading-relaxed"
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
                  <li key={itemIndex} className="text-gray-700 leading-relaxed">
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
                      <Square size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    )}
                    <span 
                      className={`text-gray-700 leading-relaxed ${isChecked ? 'line-through text-gray-500' : ''}`}
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
            <div className="bg-gray-100 px-4 py-2 rounded-t-lg border border-b-0 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                {blockData.language || 'code'}
              </span>
              <button
                onClick={() => copyToClipboard(blockData.code || '')}
                className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-md transition-colors"
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
            <blockquote className="border-l-4 border-emerald-500 bg-emerald-50 pl-6 pr-4 py-4 rounded-r-lg">
              <div className="flex items-start gap-3">
                <Quote size={20} className="text-emerald-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-800 italic text-lg leading-relaxed mb-2">
                    {blockData.text || ''}
                  </p>
                  {blockData.caption && (
                    <cite className="text-sm text-emerald-700 font-medium">
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
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle size={20} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  {blockData.title && (
                    <h4 className="font-semibold text-yellow-800 mb-2">
                      {blockData.title}
                    </h4>
                  )}
                  <p className="text-yellow-700 leading-relaxed">
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
            <hr className="border-gray-300" />
          </div>
        );

      case 'table':
        if (!blockData.content || !Array.isArray(blockData.content)) return null;
        
        return (
          <div key={index} className="mb-6 overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
              <tbody>
                {blockData.content.map((row, rowIndex) => (
                  <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    {row.map((cell, cellIndex) => {
                      const isHeader = blockData.withHeadings && rowIndex === 0;
                      const CellTag = isHeader ? 'th' : 'td';
                      
                      return (
                        <CellTag
                          key={cellIndex}
                          className={`px-4 py-3 border-r border-gray-200 last:border-r-0 ${
                            isHeader 
                              ? 'font-semibold text-gray-900 bg-gray-100' 
                              : 'text-gray-700'
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
                    blockData.withBorder ? 'border-2 border-gray-200' : ''
                  } ${
                    blockData.withBackground ? 'bg-gray-100 p-4' : ''
                  }`}
                />
              </div>
              {blockData.caption && (
                <p className="text-center text-sm text-gray-500 mt-3 italic">{blockData.caption}</p>
              )}
            </div>
          </div>
        );
        
      case 'video':
      case 'embed':
        console.log(`Rendering video/embed block:`, blockData);
        
        // Handle different video services
        let embedUrl = '';
        
        if (blockData.service === 'youtube') {
          const videoId = blockData.videoId || getYouTubeVideoId(blockData.url || '');
          embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : blockData.embed;
          console.log(`YouTube video - videoId: ${videoId}, embedUrl: ${embedUrl}`);
        } else if (blockData.service === 'vimeo') {
          const videoId = blockData.videoId || getVimeoVideoId(blockData.url || '');
          embedUrl = videoId ? `https://player.vimeo.com/video/${videoId}` : blockData.embed;
          console.log(`Vimeo video - videoId: ${videoId}, embedUrl: ${embedUrl}`);
        } else {
          // Fallback: try to use embed or url directly
          embedUrl = blockData.embed || blockData.url;
          console.log(`Generic embed - embedUrl: ${embedUrl}`);
          
          // If it's a YouTube URL without proper service set, try to extract
          if (!embedUrl && blockData.url) {
            const youtubeId = getYouTubeVideoId(blockData.url);
            if (youtubeId) {
              embedUrl = `https://www.youtube.com/embed/${youtubeId}`;
              console.log(`Auto-detected YouTube URL, embedUrl: ${embedUrl}`);
            }
          }
        }

        console.log(`Final embedUrl for video block:`, embedUrl);

        if (!embedUrl) {
          console.warn(`No embed URL found for video block:`, blockData);
          return (
            <div key={index} className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">
                <strong>Video Error:</strong> No valid video URL found.
              </p>
              <details className="mt-2">
                <summary className="text-sm cursor-pointer">Debug Info</summary>
                <pre className="text-xs mt-1">{JSON.stringify(blockData, null, 2)}</pre>
              </details>
            </div>
          );
        }

        return (
          <div key={index} className="mb-6">
            <div className="w-full bg-gray-50 rounded-lg overflow-hidden shadow-sm">
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
                onLoad={() => console.log('✅ Video loaded successfully:', embedUrl)}
                onError={(e) => console.error('❌ Video failed to load:', e, embedUrl)}
              />
            </div>
            {blockData.caption && (
              <p className="text-center text-sm text-gray-500 mt-3 italic">{blockData.caption}</p>
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
              className="block p-4 border border-gray-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <ExternalLink size={20} className="text-emerald-600 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-900">{blockData.meta?.title || blockData.link}</h4>
                  {blockData.meta?.description && (
                    <p className="text-sm text-gray-600 mt-1">{blockData.meta.description}</p>
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
        // Fallback for unknown block types
        console.warn(`Unknown block type: ${block.type}`, block);
        return (
          <div key={index} className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-orange-800 font-medium mb-2">
              Unsupported content type: <code className="bg-orange-100 px-2 py-1 rounded">{block.type}</code>
            </p>
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-2">
                <summary className="text-sm cursor-pointer text-orange-700">Debug: Show block data</summary>
                <pre className="text-xs mt-2 text-orange-600 bg-white p-2 rounded border overflow-auto">
                  {JSON.stringify(block, null, 2)}
                </pre>
              </details>
            )}
          </div>
        );
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
    <div className="max-w-4xl mx-auto px-4 py-8">
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
      <div className="mb-8">
        <div className="flex items-center text-sm text-emerald-600 mb-2">
          <BookOpen size={16} className="mr-1" />
          <Link to={`/tutorials/${tutorial.slug || tutorial._id}`} className="hover:underline">
            {tutorial.title}
          </Link>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">{lesson.title}</h1>
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
        <div className="mb-8">
          <NotesComponent tutorialId={tutorial._id} sectionId={lesson._id} />
        </div>
      )}
      
      {/* Lesson Content */}
      <div className="mb-12">
        {(() => {
          // Handle different content structures
          let contentBlocks = [];
          
          if (lesson.content) {
            // EditorJS format: { time, blocks, version }
            if (lesson.content.blocks && Array.isArray(lesson.content.blocks)) {
              contentBlocks = lesson.content.blocks;
            }
            // Direct array format: [block1, block2, ...]
            else if (Array.isArray(lesson.content)) {
              contentBlocks = lesson.content;
            }
            // Single block format
            else if (lesson.content.type) {
              contentBlocks = [lesson.content];
            }
          }

          console.log('Lesson content blocks:', contentBlocks);

          return contentBlocks.length > 0 ? (
            contentBlocks.map((block, index) => renderContentBlock(block, index))
          ) : (
            <div className="bg-gray-50 border rounded-lg p-8 text-center">
              <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Content coming soon</h3>
              <p className="text-gray-600">
                This lesson content is being prepared and will be available soon.
              </p>
            </div>
          );
        })()}
      </div>
      
      {/* Lesson Actions */}
      {isAuthenticated && (
        <div className="bg-gray-50 border rounded-lg p-6 mb-8">
          <div className="flex justify-center">
            <button
              onClick={markAsCompleted}
              disabled={hasCompletedLesson || isMarkingComplete}
              className={`px-8 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors ${
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
      <div className="border-t pt-8 mt-12">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            {prevLesson ? (
              <Link 
                to={`/lessons/${prevLesson._id}`} 
                className="inline-flex items-center text-emerald-600 hover:text-emerald-700 group"
              >
                <ArrowLeft size={18} className="mr-3 group-hover:-translate-x-1 transition-transform" />
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
                <div className="text-right mr-3">
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
                <div className="text-right mr-3">
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
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <h4 className="font-bold text-blue-800 mb-4 flex items-center text-lg">
        <Play size={20} className="mr-2" />
        Quick Quiz
      </h4>
      
      <p className="text-blue-900 mb-4 font-medium">{question}</p>
      
      <div className="space-y-3 mb-4">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(index)}
            disabled={showResult}
            className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
              showResult
                ? index === correctAnswer
                  ? 'bg-green-100 border-green-500 text-green-800 shadow-sm'
                  : index === selectedAnswer
                  ? 'bg-red-100 border-red-500 text-red-800'
                  : 'bg-gray-100 border-gray-300 text-gray-600'
                : 'bg-white border-blue-300 hover:bg-blue-50 hover:border-blue-400 hover:shadow-sm'
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
        <div className="border-t border-blue-200 pt-4">
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
              className="text-sm text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Try Again
            </button>
          </div>
          
          {explanation && (
            <div className="bg-blue-100 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
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