import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Share2, 
  BookOpen, 
  AlertCircle,
  Clock,
  Loader,
  CheckCircle,
  ArrowRight,
  User
} from 'lucide-react';
import { tutorialAPI, lessonAPI, technologyAPI, domainAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

const DynamicTutorial = () => {
  const { domain, technology, tutorialSlug, tutorialId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [tutorial, setTutorial] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [technologyData, setTechnologyData] = useState(null);
  const [domainData, setDomainData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch tutorial data based on route params
  useEffect(() => {
    fetchTutorialData();
  }, [domain, technology, tutorialSlug, tutorialId]);

  const fetchTutorialData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      let tutorialData = null;
      let lessonsData = [];
      let technologyInfo = null;
      let domainInfo = null;

      // Strategy 1: Direct tutorial access via ID (highest priority)
      if (tutorialId) {
        try {
          const tutorialResponse = await tutorialAPI.getById(tutorialId);
          tutorialData = tutorialResponse.data;
        } catch (err) {
          console.log('Tutorial not found by ID, trying other methods...');
        }
      }

      // Strategy 2: Direct tutorial access via slug
      if (!tutorialData && tutorialSlug) {
        try {
          const tutorialResponse = await tutorialAPI.getById(tutorialSlug);
          tutorialData = tutorialResponse.data;
        } catch (err) {
          console.log('Tutorial not found by slug, trying other methods...');
        }
      }

      // Strategy 3: Find tutorial by technology and optional domain
      if (!tutorialData && technology) {
        try {
          // Get technology first
          const technologyResponse = await technologyAPI.getById(technology);
          technologyInfo = technologyResponse.data;
          setTechnologyData(technologyInfo);
          
          // Build query params
          const queryParams = { technology: technologyInfo._id };
          
          // If domain is also specified, include it in the query
          if (domain) {
            try {
              const domainResponse = await domainAPI.getById(domain);
              domainInfo = domainResponse.data;
              setDomainData(domainInfo);
              queryParams.domain = domainInfo._id;
            } catch (domainErr) {
              console.warn('Domain not found, proceeding with technology only');
            }
          }
          
          // Get tutorials for this technology (and possibly domain)
          const tutorialsResponse = await tutorialAPI.getAll(queryParams);
          const tutorials = tutorialsResponse.data.tutorials || tutorialsResponse.data;
          
          if (tutorials && tutorials.length > 0) {
            // If tutorialSlug is provided, find the specific tutorial
            if (tutorialSlug) {
              tutorialData = tutorials.find(t => t.slug === tutorialSlug);
              if (!tutorialData) {
                tutorialData = tutorials[0]; // Fallback to first tutorial
              }
            } else {
              tutorialData = tutorials[0]; // Take the first tutorial
            }
          }
        } catch (err) {
          console.log('Technology not found, trying domain...');
        }
      }

      // Strategy 4: Find tutorial by domain only
      if (!tutorialData && domain && !technology) {
        try {
          // Get domain first
          const domainResponse = await domainAPI.getById(domain);
          domainInfo = domainResponse.data;
          setDomainData(domainInfo);
          
          // Get tutorials for this domain
          const tutorialsResponse = await tutorialAPI.getAll({ 
            domain: domainInfo._id,
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

      // Fetch technology and domain info if not already fetched
      if (tutorialData.technology && !technologyInfo) {
        try {
          const techId = tutorialData.technology._id || tutorialData.technology;
          const technologyResponse = await technologyAPI.getById(techId);
          technologyInfo = technologyResponse.data;
          setTechnologyData(technologyInfo);
        } catch (err) {
          console.warn('Could not fetch technology info:', err);
        }
      }

      if (tutorialData.domain && !domainInfo) {
        try {
          const domainId = tutorialData.domain._id || tutorialData.domain;
          const domainResponse = await domainAPI.getById(domainId);
          domainInfo = domainResponse.data;
          setDomainData(domainInfo);
        } catch (err) {
          console.warn('Could not fetch domain info:', err);
        }
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

  // Generate breadcrumb navigation
  const getBreadcrumbs = () => {
    const breadcrumbs = [
      { label: 'Tutorials', href: '/tutorials' }
    ];

    if (domainData) {
      breadcrumbs.push({ 
        label: domainData.name, 
        href: `/domains/${domainData.slug || domainData._id}`
      });
    }

    if (technologyData) {
      breadcrumbs.push({ 
        label: technologyData.name, 
        href: `/technologies/${technologyData.slug || technologyData._id}` 
      });
    }

    if (tutorial) {
      breadcrumbs.push({ 
        label: tutorial.title, 
        href: null // Current page
      });
    }

    return breadcrumbs;
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

  const breadcrumbs = getBreadcrumbs();
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb Navigation */}
      <nav className="mb-6">
        <ol className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && <span className="text-gray-400 mx-2">/</span>}
              {crumb.href ? (
                <Link to={crumb.href} className="text-emerald-600 hover:text-emerald-700 hover:underline">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-gray-700 font-medium">{crumb.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Tutorial Navigation */}
      <div className="flex justify-between items-center mb-6">
        <Link to="/tutorials" className="flex items-center text-emerald-600 hover:text-emerald-700">
          <ArrowLeft size={18} className="mr-1" />
          <span>Back to Tutorials</span>
        </Link>
        
        <div className="flex items-center gap-2">
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
        <h1 className="text-2xl md:text-3xl font-bold mb-3">{tutorial.title}</h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-4">
          {(domainData || tutorial.domain) && (
            <Link
              to={`/domains/${domainData?.slug || domainData?._id || (tutorial.domain?._id || tutorial.domain)}`}
              className="flex items-center text-emerald-600 hover:text-emerald-700 hover:underline"
            >
              <BookOpen size={16} className="mr-1" />
              {domainData?.name || tutorial.domain?.name || tutorial.domain}
            </Link>
          )}
          {(technologyData || tutorial.technology) && (
            <Link
              to={`/technologies/${technologyData?.slug || technologyData?._id || tutorial.technology?.slug || tutorial.technology?._id}`}
              className="flex items-center text-emerald-600 hover:text-emerald-700 hover:underline"
            >
              <code className="bg-emerald-100 px-2 py-0.5 rounded text-emerald-800">
                {technologyData?.name || tutorial.technology?.name || tutorial.technology}
              </code>
            </Link>
          )}
          <span className="flex items-center">
            <Clock size={16} className="mr-1" />
            {tutorial.estimatedTime || 30} min
          </span>
          <span className="flex items-center">
            <span className="mr-1">📊</span>
            {tutorial.difficulty?.charAt(0).toUpperCase() + tutorial.difficulty?.slice(1) || 'Beginner'}
          </span>
          {tutorial.author && (
            <span className="flex items-center">
              <User size={16} className="mr-1" />
              {tutorial.author.username || tutorial.author}
            </span>
          )}
        </div>
        
        {/* Description */}
        <p className="text-gray-700 text-lg mb-4">{tutorial.description}</p>
        
        {/* Tags */}
        {tutorial.tags && tutorial.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tutorial.tags.map((tag, index) => (
              <span 
                key={index}
                className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      
      {/* Course Lessons */}
      {lessons.length > 0 && (
        <div className="mt-8 mb-8">
          <h2 className="text-xl font-bold mb-4">Course Lessons</h2>
          <div className="space-y-3">
            {lessons.map((lesson, index) => (
              <Link
                key={lesson._id}
                to={`/lessons/${lesson._id}`}
                className="block p-4 border rounded-md hover:bg-gray-50 hover:border-emerald-300 transition-all"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center font-medium mr-4 flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{lesson.title}</h3>
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
                  <div className="text-emerald-600 ml-4">
                    <ArrowRight size={18} />
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