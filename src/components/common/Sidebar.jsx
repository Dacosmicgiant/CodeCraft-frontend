// src/components/common/Sidebar.jsx
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
      
      // Initialize expanded states
      const domainStates = {};
      
      domainsData.forEach(domain => {
        // Default expand Web Development domain
        domainStates[domain._id] = domain.name === 'Web Development';
      });
      
      setExpandedDomains(domainStates);
      
      // If a domain is expanded by default, fetch its technologies
      const webDevDomain = domainsData.find(d => d.name === 'Web Development');
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
      
      // Initialize expanded states for technologies
      const techStates = { ...expandedTechnologies };
      technologies.forEach(tech => {
        // HTML is expanded by default
        techStates[tech._id] = tech.name === 'HTML';
      });
      
      setExpandedTechnologies(techStates);
      
      // If HTML technology is found and expanded, fetch its tutorials
      const htmlTech = technologies.find(t => t.name === 'HTML');
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
      
      // Initialize tutorial expanded states
      const tutorialStates = { ...expandedTutorials };
      if (tutorials.length > 0) {
        // Expand the first tutorial by default
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
      const lessons = lessonsResponse.data;
      
      // Update domains state with lessons
      setDomains(prevDomains => 
        prevDomains.map(domain => {
          if (!domain.technologies) return domain;
          
          const updatedTechs = domain.technologies.map(tech => {
            if (!tech.tutorials) return tech;
            
            const updatedTutorials = tech.tutorials.map(tutorial => 
              tutorial._id === tutorialId 
                ? { ...tutorial, lessons } 
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
  const getDomainIcon = (icon) => {
    switch (icon) {
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
        <div className="mt-2">
          {/* Domain Level */}
          {domains.map((domain) => (
            <div key={domain._id} className="mb-2">
              <button
                onClick={() => toggleDomain(domain._id)}
                className="flex items-center justify-between w-full px-4 py-2 text-left text-sm font-medium text-gray-800 hover:bg-gray-100 rounded-md"
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
                <div className="ml-2 pl-2 border-l border-gray-200">
                  {/* Technology Level */}
                  {domain.technologies?.map((tech) => (
                    <div key={tech._id}>
                      <button
                        onClick={() => toggleTechnology(tech._id)}
                        className={`flex items-center justify-between w-full px-4 py-2 text-sm rounded-md ${
                          isActive(`/tutorials/${tech.slug}`)
                            ? 'bg-emerald-100 text-emerald-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center">
                          <Hash size={14} className="mr-2 flex-shrink-0" />
                          <span>{tech.name}</span>
                        </div>
                        {loadingStates.tutorials[tech._id] ? (
                          <Loader size={14} className="animate-spin text-gray-500" />
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
                        <div className="ml-4 pl-2 border-l border-gray-200">
                          {tech.tutorials.map((tutorial) => (
                            <div key={tutorial._id}>
                              <button
                                onClick={() => toggleTutorial(tutorial._id)}
                                className={`flex items-center justify-between w-full px-4 py-2 text-xs rounded-md text-gray-700 hover:bg-gray-50`}
                              >
                                <div className="flex items-center">
                                  <File size={12} className="mr-2 flex-shrink-0" />
                                  <span>{tutorial.title}</span>
                                </div>
                                {loadingStates.lessons[tutorial._id] ? (
                                  <Loader size={12} className="animate-spin text-gray-500" />
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
                                <div className="ml-2 pl-2 border-l border-gray-200">
                                  {tutorial.lessons.map((lesson) => (
                                    <Link
                                      key={lesson._id}
                                      to={`/tutorials/${tech.slug}/${tutorial.slug}/${lesson.slug || lesson._id}`}
                                      className="flex items-center px-4 py-2 text-xs rounded-md text-gray-600 hover:bg-gray-50 hover:text-emerald-700"
                                    >
                                      <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
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
                    <div className="px-4 py-2 text-xs text-gray-500 italic">
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