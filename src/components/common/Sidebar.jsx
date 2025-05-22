import { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ChevronDown, ChevronRight, Hash, Folder, File, Code, BookOpen, Loader, AlertCircle } from 'lucide-react';
import { domainAPI, technologyAPI, tutorialAPI, lessonAPI } from '../../services/api';

const Sidebar = ({ currentTopic, onTopicChange }) => {
  const location = useLocation();
  const { topic, page } = useParams();
  
  // State for storing fetched data
  const [domains, setDomains] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Track expanded states for each level
  const [expandedDomains, setExpandedDomains] = useState({});
  const [expandedTechnologies, setExpandedTechnologies] = useState({});
  const [expandedTutorials, setExpandedTutorials] = useState({});
  
  // Track loading states for dynamic content
  const [loadingStates, setLoadingStates] = useState({
    technologies: {},
    tutorials: {},
    lessons: {}
  });
  
  // Fetch domains when component mounts
  useEffect(() => {
    fetchDomains();
  }, []);
  
  const fetchDomains = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch domains from API
      const domainsResponse = await domainAPI.getAll();
      const domainsData = domainsResponse.data;
      
      setDomains(domainsData);
      
      // Initialize expanded states - expand Web Development by default
      const domainStates = {};
      domainsData.forEach(domain => {
        domainStates[domain._id] = domain.name.toLowerCase().includes('web');
      });
      setExpandedDomains(domainStates);
      
      // Auto-expand and fetch technologies for Web Development domain
      const webDevDomain = domainsData.find(d => 
        d.name.toLowerCase().includes('web') || d.name.toLowerCase().includes('development')
      );
      if (webDevDomain) {
        fetchTechnologies(webDevDomain._id);
      }
      
    } catch (err) {
      console.error('Error fetching domains:', err);
      setError('Failed to load domains. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchTechnologies = async (domainId) => {
    try {
      // Set loading state for this domain
      setLoadingStates(prev => ({
        ...prev,
        technologies: {
          ...prev.technologies,
          [domainId]: true
        }
      }));
      
      // Fetch technologies for this domain
      const techResponse = await technologyAPI.getAll({ domain: domainId });
      const technologies = techResponse.data;
      
      // Update domain with technologies
      setDomains(prevDomains => 
        prevDomains.map(domain => 
          domain._id === domainId 
            ? { ...domain, technologies } 
            : domain
        )
      );
      
      // Initialize expanded states for technologies - expand HTML by default
      const techStates = { ...expandedTechnologies };
      technologies.forEach(tech => {
        techStates[tech._id] = tech.name.toLowerCase() === 'html';
      });
      setExpandedTechnologies(techStates);
      
      // Auto-expand and fetch tutorials for HTML technology
      const htmlTech = technologies.find(t => t.name.toLowerCase() === 'html');
      if (htmlTech) {
        fetchTutorials(htmlTech._id);
      }
      
    } catch (err) {
      console.error(`Error fetching technologies for domain ${domainId}:`, err);
    } finally {
      // Clear loading state
      setLoadingStates(prev => ({
        ...prev,
        technologies: {
          ...prev.technologies,
          [domainId]: false
        }
      }));
    }
  };
  
  const fetchTutorials = async (techId) => {
    try {
      // Set loading state for this technology
      setLoadingStates(prev => ({
        ...prev,
        tutorials: {
          ...prev.tutorials,
          [techId]: true
        }
      }));
      
      // Fetch tutorials for this technology
      const tutorialsResponse = await tutorialAPI.getAll({ technology: techId });
      const tutorials = tutorialsResponse.data.tutorials || tutorialsResponse.data;
      
      // Update domains state with tutorials
      setDomains(prevDomains => 
        prevDomains.map(domain => {
          if (!domain.technologies) return domain;
          
          const updatedTechs = domain.technologies.map(tech => 
            tech._id === techId 
              ? { ...tech, tutorials } 
              : tech
          );
          
          return { ...domain, technologies: updatedTechs };
        })
      );
      
      // Initialize tutorial expanded states - expand first tutorial by default
      const tutorialStates = { ...expandedTutorials };
      if (tutorials.length > 0) {
        tutorialStates[tutorials[0]._id] = true;
        
        // Fetch lessons for the first tutorial
        fetchLessons(tutorials[0]._id);
      }
      setExpandedTutorials(tutorialStates);
      
    } catch (err) {
      console.error(`Error fetching tutorials for technology ${techId}:`, err);
    } finally {
      // Clear loading state
      setLoadingStates(prev => ({
        ...prev,
        tutorials: {
          ...prev.tutorials,
          [techId]: false
        }
      }));
    }
  };
  
  const fetchLessons = async (tutorialId) => {
    try {
      // Set loading state for this tutorial
      setLoadingStates(prev => ({
        ...prev,
        lessons: {
          ...prev.lessons,
          [tutorialId]: true
        }
      }));
      
      // Fetch lessons for this tutorial
      const lessonsResponse = await lessonAPI.getByTutorial(tutorialId);
      const lessons = lessonsResponse.data || [];
      
      // Sort lessons by order
      const sortedLessons = lessons.sort((a, b) => (a.order || 0) - (b.order || 0));
      
      // Update domains state with lessons
      setDomains(prevDomains => 
        prevDomains.map(domain => {
          if (!domain.technologies) return domain;
          
          const updatedTechs = domain.technologies.map(tech => {
            if (!tech.tutorials) return tech;
            
            const updatedTutorials = tech.tutorials.map(tutorial => 
              tutorial._id === tutorialId 
                ? { ...tutorial, lessons: sortedLessons } 
                : tutorial
            );
            
            return { ...tech, tutorials: updatedTutorials };
          });
          
          return { ...domain, technologies: updatedTechs };
        })
      );
      
    } catch (err) {
      console.error(`Error fetching lessons for tutorial ${tutorialId}:`, err);
    } finally {
      // Clear loading state
      setLoadingStates(prev => ({
        ...prev,
        lessons: {
          ...prev.lessons,
          [tutorialId]: false
        }
      }));
    }
  };
  
  // Toggle domain expansion
  const toggleDomain = (domainId) => {
    const newExpandedState = !expandedDomains[domainId];
    
    setExpandedDomains(prev => ({
      ...prev,
      [domainId]: newExpandedState
    }));
    
    // Fetch technologies if expanding and not already loaded
    if (newExpandedState) {
      const domain = domains.find(d => d._id === domainId);
      if (domain && (!domain.technologies || domain.technologies.length === 0)) {
        fetchTechnologies(domainId);
      }
    }
  };
  
  // Toggle technology expansion
  const toggleTechnology = (techId) => {
    const newExpandedState = !expandedTechnologies[techId];
    
    setExpandedTechnologies(prev => ({
      ...prev,
      [techId]: newExpandedState
    }));
    
    // Fetch tutorials if expanding and not already loaded
    if (newExpandedState) {
      let foundTech = null;
      
      // Find the technology in our data structure
      domains.forEach(domain => {
        if (domain.technologies) {
          const tech = domain.technologies.find(t => t._id === techId);
          if (tech) foundTech = tech;
        }
      });
      
      if (foundTech && (!foundTech.tutorials || foundTech.tutorials.length === 0)) {
        fetchTutorials(techId);
      }
    }
  };
  
  // Toggle tutorial expansion
  const toggleTutorial = (tutorialId) => {
    const newExpandedState = !expandedTutorials[tutorialId];
    
    setExpandedTutorials(prev => ({
      ...prev,
      [tutorialId]: newExpandedState
    }));
    
    // Fetch lessons if expanding and not already loaded
    if (newExpandedState) {
      let foundTutorial = null;
      
      // Find the tutorial in our data structure
      domains.forEach(domain => {
        if (domain.technologies) {
          domain.technologies.forEach(tech => {
            if (tech.tutorials) {
              const tutorial = tech.tutorials.find(t => t._id === tutorialId);
              if (tutorial) foundTutorial = tutorial;
            }
          });
        }
      });
      
      if (foundTutorial && (!foundTutorial.lessons || foundTutorial.lessons.length === 0)) {
        fetchLessons(tutorialId);
      }
    }
  };
  
  // Check if a path is active
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  // Helper function to get the domain icon
  const getDomainIcon = (iconName) => {
    switch (iconName) {
      case 'code':
        return <Code size={16} />;
      case 'folder':
        return <Folder size={16} />;
      case 'book':
        return <BookOpen size={16} />;
      default:
        return <Folder size={16} />;
    }
  };

  // Get technology icon based on name
  const getTechnologyIcon = (techName) => {
    const name = techName?.toLowerCase() || '';
    if (name.includes('html')) return '🌐';
    if (name.includes('css')) return '🎨';
    if (name.includes('javascript')) return '⚡';
    if (name.includes('react')) return '⚛️';
    if (name.includes('node')) return '🟢';
    if (name.includes('python')) return '🐍';
    return '#';
  };
  
  // Loading state
  if (isLoading) {
    return (
      <aside className="w-64 h-full bg-white border-r flex items-center justify-center">
        <div className="text-center text-gray-500">
          <Loader size={24} className="animate-spin mx-auto mb-2" />
          <p className="text-sm">Loading content...</p>
        </div>
      </aside>
    );
  }
  
  // Error state
  if (error) {
    return (
      <aside className="w-64 h-full bg-white border-r flex items-center justify-center">
        <div className="text-center text-red-500 p-4">
          <AlertCircle size={24} className="mx-auto mb-2" />
          <p className="text-sm">{error}</p>
          <button 
            onClick={fetchDomains}
            className="mt-2 px-3 py-1 bg-emerald-600 text-white text-sm rounded hover:bg-emerald-700"
          >
            Retry
          </button>
        </div>
      </aside>
    );
  }
  
  return (
    <aside className="w-64 h-full bg-white border-r">
      <nav className="h-full overflow-y-auto">
        <div className="p-2">
          {/* Domain Level */}
          {domains.map((domain) => (
            <div key={domain._id} className="mb-2">
              <button
                onClick={() => toggleDomain(domain._id)}
                className="flex items-center justify-between w-full px-3 py-2 text-left text-sm font-medium text-gray-800 hover:bg-gray-100 rounded-md"
              >
                <div className="flex items-center">
                  {getDomainIcon(domain.icon)}
                  <span className="ml-2">{domain.name}</span>
                </div>
                {loadingStates.technologies[domain._id] ? (
                  <Loader size={14} className="animate-spin text-gray-500" />
                ) : (
                  expandedDomains[domain._id] ? (
                    <ChevronDown size={16} className="text-gray-500" />
                  ) : (
                    <ChevronRight size={16} className="text-gray-500" />
                  )
                )}
              </button>
              
              {expandedDomains[domain._id] && (
                <div className="ml-4 mt-1">
                  {/* Technology Level */}
                  {domain.technologies?.map((tech) => (
                    <div key={tech._id} className="mb-1">
                      <button
                        onClick={() => toggleTechnology(tech._id)}
                        className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded-md ${
                          isActive(`/tutorials/${tech.slug}`)
                            ? 'bg-emerald-100 text-emerald-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="mr-2 text-sm">{getTechnologyIcon(tech.name)}</span>
                          <span>{tech.name}</span>
                        </div>
                        {loadingStates.tutorials[tech._id] ? (
                          <Loader size={12} className="animate-spin text-gray-500" />
                        ) : (
                          expandedTechnologies[tech._id] ? (
                            <ChevronDown size={14} className="text-gray-500" />
                          ) : (
                            <ChevronRight size={14} className="text-gray-500" />
                          )
                        )}
                      </button>
                      
                      {/* Tutorial Level */}
                      {expandedTechnologies[tech._id] && tech.tutorials && (
                        <div className="ml-4 mt-1">
                          {tech.tutorials.map((tutorial) => (
                            <div key={tutorial._id} className="mb-1">
                              <button
                                onClick={() => toggleTutorial(tutorial._id)}
                                className="flex items-center justify-between w-full px-3 py-2 text-xs rounded-md text-gray-700 hover:bg-gray-50"
                              >
                                <div className="flex items-center">
                                  <File size={12} className="mr-2 flex-shrink-0" />
                                  <span className="truncate">{tutorial.title}</span>
                                </div>
                                {loadingStates.lessons[tutorial._id] ? (
                                  <Loader size={10} className="animate-spin text-gray-500" />
                                ) : (
                                  expandedTutorials[tutorial._id] ? (
                                    <ChevronDown size={12} className="text-gray-500" />
                                  ) : (
                                    <ChevronRight size={12} className="text-gray-500" />
                                  )
                                )}
                              </button>
                              
                              {/* Lesson/Lecture Level */}
                              {expandedTutorials[tutorial._id] && tutorial.lessons && (
                                <div className="ml-4 mt-1">
                                  {tutorial.lessons.map((lesson, index) => (
                                    <Link
                                      key={lesson._id}
                                      to={`/lessons/${lesson._id}`}
                                      className={`flex items-center px-3 py-2 text-xs rounded-md transition-colors ${
                                        isActive(`/lessons/${lesson._id}`)
                                          ? 'bg-emerald-50 text-emerald-700'
                                          : 'text-gray-600 hover:bg-gray-50 hover:text-emerald-700'
                                      }`}
                                    >
                                      <div className="w-4 h-4 bg-gray-200 rounded-full mr-2 flex items-center justify-center">
                                        <span className="text-xs font-medium text-gray-600">
                                          {index + 1}
                                        </span>
                                      </div>
                                      <span className="truncate">{lesson.title}</span>
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {domain.technologies && domain.technologies.length === 0 && !loadingStates.technologies[domain._id] && (
                    <div className="px-3 py-2 text-xs text-gray-500 italic">
                      No technologies found
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;