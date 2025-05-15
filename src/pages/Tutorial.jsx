import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle, Copy } from 'lucide-react';
import { useTutorial } from '../hooks/useTutorial';

const TutorialPage = () => {
  const { topic = 'html', page = 'introduction' } = useParams();
  const { tutorial, loading, error } = useTutorial(topic, page);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  
  // Calculate available pages for this topic
  const availablePages = getAvailablePagesForTopic(topic);
  
  // Find current page index
  const currentPageIndex = availablePages.findIndex(p => p.id === page);
  
  // Get previous and next pages
  const prevPage = currentPageIndex > 0 ? availablePages[currentPageIndex - 1] : null;
  const nextPage = currentPageIndex < availablePages.length - 1 ? availablePages[currentPageIndex + 1] : null;
  
  // Update progress when scrolling
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      
      const scrolled = (scrollTop / (documentHeight - windowHeight)) * 100;
      setProgress(Math.min(scrolled, 100));
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Copy code to clipboard
  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto animate-pulse">
        <div className="h-10 bg-gray-200 rounded-md mb-6 w-3/4"></div>
        <div className="h-6 bg-gray-200 rounded-md mb-8 w-1/2"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded-md w-full"></div>
          <div className="h-4 bg-gray-200 rounded-md w-full"></div>
          <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <h3 className="text-red-800 font-medium">Error loading tutorial</h3>
          <p className="text-red-700 mt-1">{error}</p>
          <Link to="/" className="mt-2 inline-flex items-center text-red-800 hover:text-red-900">
            <ArrowLeft size={16} className="mr-1" /> Go back to home
          </Link>
        </div>
      </div>
    );
  }
  
  if (!tutorial) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-md">
          <h3 className="text-yellow-800 font-medium">Tutorial not found</h3>
          <p className="text-yellow-700 mt-1">The requested tutorial could not be found.</p>
          <Link to="/" className="mt-2 inline-flex items-center text-yellow-800 hover:text-yellow-900">
            <ArrowLeft size={16} className="mr-1" /> Go back to home
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-4 md:p-6">
      {/* Progress bar */}
      <div className="fixed top-16 left-0 right-0 h-1 bg-gray-200 z-10">
        <div 
          className="h-full bg-emerald-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      {/* Tutorial navigation */}
      <div className="mb-6 flex items-center text-sm text-gray-500">
        <Link to="/" className="hover:text-emerald-600">Home</Link>
        <span className="mx-2">/</span>
        <Link to={`/tutorials/${topic}`} className="hover:text-emerald-600 capitalize">{topic}</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">{tutorial.title}</span>
      </div>
      
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6 md:p-8">
        <h1 className="text-3xl font-bold mb-4">{tutorial.title}</h1>
        
        {tutorial.introduction && (
          <p className="text-xl text-gray-600 mb-8">{tutorial.introduction}</p>
        )}
        
        {/* Table of Contents */}
        <div className="mb-8 p-4 bg-gray-50 rounded-md">
          <h2 className="text-lg font-medium mb-2">In this tutorial:</h2>
          <ul className="space-y-1">
            {tutorial.sections.map((section, index) => (
              <li key={index}>
                <a 
                  href={`#section-${index}`}
                  className="text-emerald-600 hover:text-emerald-700 hover:underline"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Tutorial sections */}
        <div className="space-y-10">
          {tutorial.sections.map((section, index) => (
            <section key={index} id={`section-${index}`} className="scroll-mt-20">
              <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
              
              {section.text && (
                <div className="prose max-w-none mb-4">
                  {section.text.split('\n\n').map((paragraph, i) => (
                    <p key={i} className="mb-4">{paragraph}</p>
                  ))}
                </div>
              )}
              
              {section.code && (
                <div className="relative">
                  <div className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
                    <div className="flex justify-between mb-2">
                      <span className="text-xs text-gray-400">Code example</span>
                      <button 
                        onClick={() => copyCode(section.code)}
                        className="text-xs text-gray-400 hover:text-white flex items-center"
                      >
                        {copied ? <CheckCircle size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
                        {copied ? 'Copied!' : 'Copy code'}
                      </button>
                    </div>
                    <pre className="font-mono text-sm"><code>{section.code}</code></pre>
                  </div>
                </div>
              )}
              
              {section.output && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2 text-gray-500">Output:</h4>
                  <div className="border p-4 rounded-md bg-gray-50">
                    <div dangerouslySetInnerHTML={{ __html: section.output }} />
                  </div>
                </div>
              )}
              
              {section.note && (
                <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md">
                  <h4 className="font-bold text-blue-800 mb-1">Note</h4>
                  <p className="text-blue-700">{section.note}</p>
                </div>
              )}
            </section>
          ))}
        </div>
        
        {/* Navigation buttons */}
        <div className="mt-12 pt-6 border-t border-gray-200 flex justify-between">
          {prevPage ? (
            <Link 
              to={`/tutorials/${topic}/${prevPage.id}`}
              className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 text-gray-700 flex items-center"
            >
              <ArrowLeft size={16} className="mr-2" />
              <span>Previous: {prevPage.title}</span>
            </Link>
          ) : (
            <div></div> // Empty div to maintain layout
          )}
          
          {nextPage && (
            <Link 
              to={`/tutorials/${topic}/${nextPage.id}`}
              className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 flex items-center"
            >
              <span>Next: {nextPage.title}</span>
              <ArrowRight size={16} className="ml-2" />
            </Link>
          )}
        </div>
      </div>
      
      {/* Related resources */}
      <div className="max-w-4xl mx-auto mt-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-md">
              <BookOpen size={24} className="text-purple-600" />
            </div>
            <h3 className="text-lg font-bold">Related tutorials</h3>
          </div>
          <ul className="space-y-2 mb-4">
            {getRelatedTutorials(topic).map((relatedTopic) => (
              <li key={relatedTopic.id}>
                <Link
                  to={`/tutorials/${relatedTopic.id}`}
                  className="text-gray-700 hover:text-purple-600"
                >
                  {relatedTopic.title}
                </Link>
              </li>
            ))}
          </ul>
          <Link 
            to="/tutorials"
            className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
          >
            View all tutorials <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

// Helper function to get available pages for a topic
const getAvailablePagesForTopic = (topic) => {
  switch (topic) {
    case 'html':
      return [
        { id: 'introduction', title: 'Introduction' },
        { id: 'basics', title: 'HTML Basics' },
        { id: 'elements', title: 'HTML Elements' },
        { id: 'attributes', title: 'HTML Attributes' },
        { id: 'headings', title: 'HTML Headings' },
        { id: 'paragraphs', title: 'HTML Paragraphs' },
      ];
    case 'css':
      return [
        { id: 'introduction', title: 'Introduction' },
        { id: 'selectors', title: 'CSS Selectors' },
        { id: 'box-model', title: 'Box Model' },
        { id: 'colors', title: 'CSS Colors' },
        { id: 'flexbox', title: 'Flexbox' },
        { id: 'grid', title: 'CSS Grid' },
      ];
    case 'javascript':
      return [
        { id: 'introduction', title: 'Introduction' },
        { id: 'syntax', title: 'JS Syntax' },
        { id: 'variables', title: 'Variables' },
        { id: 'functions', title: 'Functions' },
        { id: 'objects', title: 'Objects' },
        { id: 'dom', title: 'DOM Manipulation' },
      ];
    case 'react':
      return [
        { id: 'introduction', title: 'Introduction' },
        { id: 'components', title: 'Components' },
        { id: 'props', title: 'Props' },
        { id: 'state', title: 'State' },
        { id: 'hooks', title: 'Hooks' },
        { id: 'routing', title: 'Routing' },
      ];
    default:
      return [
        { id: 'introduction', title: 'Introduction' }
      ];
  }
};

// Helper function to get related tutorials
const getRelatedTutorials = (currentTopic) => {
  const allTopics = [
    { id: 'html', title: 'HTML' },
    { id: 'css', title: 'CSS' },
    { id: 'javascript', title: 'JavaScript' },
    { id: 'react', title: 'React' },
    { id: 'nodejs', title: 'Node.js' },
    { id: 'python', title: 'Python' },
  ];
  
  // Return topics other than the current one
  return allTopics.filter(topic => topic.id !== currentTopic).slice(0, 4);
};

export default TutorialPage;