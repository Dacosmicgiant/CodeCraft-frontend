import { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ChevronDown, ChevronRight, Hash, Folder, File, Code, BookOpen } from 'lucide-react';

const Sidebar = ({ currentTopic, onTopicChange }) => {
  const location = useLocation();
  const { topic, page } = useParams();
  
  // Track expanded states for each level
  const [expandedDomains, setExpandedDomains] = useState({
    'Web Development': true,
    'Programming': false,
    'Data Structures': false,
  });
  
  const [expandedTechnologies, setExpandedTechnologies] = useState({
    'html': true,
    'css': false,
    'javascript': false,
    'react': false
  });
  
  // Initialize expanded state for current topic if it exists
  useEffect(() => {
    if (topic) {
      // Find which domain contains this topic
      const domain = domains.find(d => 
        d.technologies.some(t => t.id === topic)
      )?.name;
      
      if (domain) {
        setExpandedDomains(prev => ({
          ...prev,
          [domain]: true
        }));
        
        setExpandedTechnologies(prev => ({
          ...prev,
          [topic]: true
        }));
      }
    }
    
    // Expand based on current path
    const path = location.pathname;
    if (path.includes('/html')) {
      setExpandedTechnologies(prev => ({ ...prev, html: true }));
      setExpandedDomains(prev => ({ ...prev, 'Web Development': true }));
    } else if (path.includes('/css')) {
      setExpandedTechnologies(prev => ({ ...prev, css: true }));
      setExpandedDomains(prev => ({ ...prev, 'Web Development': true }));
    } else if (path.includes('/javascript')) {
      setExpandedTechnologies(prev => ({ ...prev, javascript: true }));
      setExpandedDomains(prev => ({ ...prev, 'Web Development': true }));
    } else if (path.includes('/react')) {
      setExpandedTechnologies(prev => ({ ...prev, react: true }));
      setExpandedDomains(prev => ({ ...prev, 'Web Development': true }));
    }
  }, [topic, location.pathname]);
  
  // Toggle domain expansion
  const toggleDomain = (domain) => {
    setExpandedDomains(prev => ({
      ...prev,
      [domain]: !prev[domain]
    }));
  };
  
  // Toggle technology expansion
  const toggleTechnology = (techId) => {
    setExpandedTechnologies(prev => ({
      ...prev,
      [techId]: !prev[techId]
    }));
  };
  
  // Check if a path is active
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  // Data structure for the hierarchical sidebar
  const domains = [
    {
      name: 'Web Development',
      icon: <Code size={16} />,
      technologies: [
        {
          id: 'html',
          title: 'HTML',
          path: '/tutorials/html',
          subpages: [
            { id: 'introduction', title: 'Introduction', path: '/tutorials/html#section-0' },
            { id: 'document-structure', title: 'Document Structure', path: '/tutorials/html#section-1' },
            { id: 'elements', title: 'HTML Elements', path: '/tutorials/html#section-2' },
            { id: 'attributes', title: 'Attributes', path: '/tutorials/html#section-3' }
          ]
        },
        {
          id: 'css',
          title: 'CSS',
          path: '/tutorials/css',
          subpages: [
            { id: 'introduction', title: 'Introduction', path: '/tutorials/css#section-0' },
            { id: 'syntax', title: 'CSS Syntax', path: '/tutorials/css#section-1' },
            { id: 'selectors', title: 'CSS Selectors', path: '/tutorials/css#section-2' },
            { id: 'box-model', title: 'Box Model', path: '/tutorials/css#section-3' }
          ]
        },
        {
          id: 'javascript',
          title: 'JavaScript',
          path: '/tutorials/javascript',
          subpages: [
            { id: 'introduction', title: 'Introduction', path: '/tutorials/javascript#section-0' },
            { id: 'variables', title: 'Variables & Types', path: '/tutorials/javascript#section-1' },
            { id: 'functions', title: 'Functions', path: '/tutorials/javascript#section-2' },
            { id: 'dom', title: 'DOM Manipulation', path: '/tutorials/javascript#section-3' }
          ]
        },
        {
          id: 'react',
          title: 'React',
          path: '/tutorials/react',
          subpages: [
            { id: 'introduction', title: 'Introduction', path: '/tutorials/react#section-0' },
            { id: 'components', title: 'Components', path: '/tutorials/react#section-1' },
            { id: 'state-props', title: 'State and Props', path: '/tutorials/react#section-2' },
            { id: 'hooks', title: 'React Hooks', path: '/tutorials/react#section-3' }
          ]
        }
      ]
    },
    {
      name: 'Programming',
      icon: <Code size={16} />,
      technologies: [
        {
          id: 'python',
          title: 'Python',
          path: '/tutorials/python',
          subpages: [
            { id: 'introduction', title: 'Introduction', path: '/tutorials/python' },
            { id: 'syntax', title: 'Basic Syntax', path: '/tutorials/python' },
            { id: 'data-types', title: 'Data Types', path: '/tutorials/python' },
            { id: 'functions', title: 'Functions', path: '/tutorials/python' },
            { id: 'modules', title: 'Modules', path: '/tutorials/python' }
          ]
        },
        {
          id: 'java',
          title: 'Java',
          path: '/tutorials/java',
          subpages: [
            { id: 'introduction', title: 'Introduction', path: '/tutorials/java' },
            { id: 'syntax', title: 'Syntax Basics', path: '/tutorials/java' },
            { id: 'oop', title: 'OOP Concepts', path: '/tutorials/java' },
            { id: 'collections', title: 'Collections', path: '/tutorials/java' }
          ]
        },
        {
          id: 'cpp',
          title: 'C++',
          path: '/tutorials/cpp',
          subpages: [
            { id: 'introduction', title: 'Introduction', path: '/tutorials/cpp' },
            { id: 'syntax', title: 'Basic Syntax', path: '/tutorials/cpp' },
            { id: 'pointers', title: 'Pointers', path: '/tutorials/cpp' },
            { id: 'classes', title: 'Classes & Objects', path: '/tutorials/cpp' }
          ]
        }
      ]
    },
    {
      name: 'Data Structures',
      icon: <Folder size={16} />,
      technologies: [
        {
          id: 'arrays',
          title: 'Arrays',
          path: '/tutorials/arrays',
          subpages: [
            { id: 'introduction', title: 'Introduction', path: '/tutorials/arrays' },
            { id: 'operations', title: 'Basic Operations', path: '/tutorials/arrays' },
            { id: 'searching', title: 'Searching', path: '/tutorials/arrays' },
            { id: 'sorting', title: 'Sorting', path: '/tutorials/arrays' }
          ]
        },
        {
          id: 'linked-lists',
          title: 'Linked Lists',
          path: '/tutorials/linked-lists',
          subpages: [
            { id: 'introduction', title: 'Introduction', path: '/tutorials/linked-lists' },
            { id: 'singly', title: 'Singly Linked Lists', path: '/tutorials/linked-lists' },
            { id: 'doubly', title: 'Doubly Linked Lists', path: '/tutorials/linked-lists' },
            { id: 'circular', title: 'Circular Linked Lists', path: '/tutorials/linked-lists' }
          ]
        },
        {
          id: 'trees',
          title: 'Trees',
          path: '/tutorials/trees',
          subpages: [
            { id: 'introduction', title: 'Introduction', path: '/tutorials/trees' },
            { id: 'binary', title: 'Binary Trees', path: '/tutorials/trees' },
            { id: 'bst', title: 'Binary Search Trees', path: '/tutorials/trees' },
            { id: 'avl', title: 'AVL Trees', path: '/tutorials/trees' },
            { id: 'traversal', title: 'Tree Traversal', path: '/tutorials/trees' }
          ]
        }
      ]
    }
  ];
  
  return (
    <aside className="w-64 h-full bg-white border-r">
      <nav className="h-full overflow-y-auto">
        
        
        <div className="mt-2">
          {/* Domain Level */}
          {domains.map((domain) => (
            <div key={domain.name} className="mb-2">
              <button
                onClick={() => toggleDomain(domain.name)}
                className="flex items-center justify-between w-full px-4 py-2 text-left text-sm font-medium text-gray-800 hover:bg-gray-100 rounded-md"
              >
                <div className="flex items-center">
                  {domain.icon}
                  <span className="ml-2">{domain.name}</span>
                </div>
                {expandedDomains[domain.name] ? (
                  <ChevronDown size={16} className="text-gray-500" />
                ) : (
                  <ChevronRight size={16} className="text-gray-500" />
                )}
              </button>
              
              {expandedDomains[domain.name] && (
                <div className="ml-2 pl-2 border-l border-gray-200">
                  {/* Technology Level */}
                  {domain.technologies.map((tech) => (
                    <div key={tech.id}>
                      <Link
                        to={tech.path}
                        onClick={() => toggleTechnology(tech.id)}
                        className={`flex items-center justify-between w-full px-4 py-2 text-sm rounded-md ${
                          isActive(tech.path)
                            ? 'bg-emerald-100 text-emerald-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center">
                          <Hash size={14} className="mr-2 flex-shrink-0" />
                          <span>{tech.title}</span>
                        </div>
                        {tech.subpages && tech.subpages.length > 0 && (
                          expandedTechnologies[tech.id] ? (
                            <ChevronDown size={14} className="text-gray-500" />
                          ) : (
                            <ChevronRight size={14} className="text-gray-500" />
                          )
                        )}
                      </Link>
                      
                      {/* Subpage Level */}
                      {expandedTechnologies[tech.id] && tech.subpages && (
                        <div className="ml-4 pl-2 border-l border-gray-200">
                          {tech.subpages.map((subpage) => (
                            <Link
                              key={`${tech.id}-${subpage.id}`}
                              to={subpage.path}
                              className={`flex items-center px-4 py-2 text-xs rounded-md ${
                                location.pathname.includes(tech.path) && location.hash === `#section-${tech.subpages.indexOf(subpage)}`
                                  ? 'bg-emerald-50 text-emerald-700 font-medium'
                                  : 'text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              <File size={12} className="mr-2 flex-shrink-0" />
                              <span>{subpage.title}</span>
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
        </div>
        
        
      </nav>
    </aside>
  );
};

export default Sidebar;