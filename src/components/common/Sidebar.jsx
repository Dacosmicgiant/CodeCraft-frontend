import { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ChevronDown, ChevronRight, Hash, Folder, File, Code } from 'lucide-react';

const Sidebar = ({ currentTopic, onTopicChange }) => {
  const location = useLocation();
  const { topic, page } = useParams();
  
  // Track expanded states for each level
  const [expandedDomains, setExpandedDomains] = useState({
    'Web Development': true,
    'Programming': false,
    'Data Structures': false,
  });
  
  const [expandedTechnologies, setExpandedTechnologies] = useState({});
  
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
  }, [topic]);
  
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
  
  // Data structure for the hierarchical sidebar
  const domains = [
    {
      name: 'Web Development',
      icon: <Code size={16} />,
      technologies: [
        {
          id: 'html',
          title: 'HTML',
          subpages: [
            { id: 'introduction', title: 'Introduction' },
            { id: 'elements', title: 'HTML Elements' },
            { id: 'attributes', title: 'Attributes' },
            { id: 'headings', title: 'Headings' },
            { id: 'paragraphs', title: 'Paragraphs' },
            { id: 'tags', title: 'Common Tags' }
          ]
        },
        {
          id: 'css',
          title: 'CSS',
          subpages: [
            { id: 'introduction', title: 'Introduction' },
            { id: 'selectors', title: 'Selectors' },
            { id: 'box-model', title: 'Box Model' },
            { id: 'flexbox', title: 'Flexbox' },
            { id: 'grid', title: 'CSS Grid' }
          ]
        },
        {
          id: 'javascript',
          title: 'JavaScript',
          subpages: [
            { id: 'introduction', title: 'Introduction' },
            { id: 'variables', title: 'Variables & Types' },
            { id: 'functions', title: 'Functions' },
            { id: 'objects', title: 'Objects' },
            { id: 'arrays', title: 'Arrays' },
            { id: 'dom', title: 'DOM Manipulation' }
          ]
        },
        {
          id: 'react',
          title: 'React',
          subpages: [
            { id: 'introduction', title: 'Introduction' },
            { id: 'components', title: 'Components' },
            { id: 'props', title: 'Props' },
            { id: 'state', title: 'State' },
            { id: 'hooks', title: 'Hooks' }
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
          subpages: [
            { id: 'introduction', title: 'Introduction' },
            { id: 'syntax', title: 'Basic Syntax' },
            { id: 'data-types', title: 'Data Types' },
            { id: 'functions', title: 'Functions' },
            { id: 'modules', title: 'Modules' }
          ]
        },
        {
          id: 'java',
          title: 'Java',
          subpages: [
            { id: 'introduction', title: 'Introduction' },
            { id: 'syntax', title: 'Syntax Basics' },
            { id: 'oop', title: 'OOP Concepts' },
            { id: 'collections', title: 'Collections' }
          ]
        },
        {
          id: 'cpp',
          title: 'C++',
          subpages: [
            { id: 'introduction', title: 'Introduction' },
            { id: 'syntax', title: 'Basic Syntax' },
            { id: 'pointers', title: 'Pointers' },
            { id: 'classes', title: 'Classes & Objects' }
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
          subpages: [
            { id: 'introduction', title: 'Introduction' },
            { id: 'operations', title: 'Basic Operations' },
            { id: 'searching', title: 'Searching' },
            { id: 'sorting', title: 'Sorting' }
          ]
        },
        {
          id: 'linked-lists',
          title: 'Linked Lists',
          subpages: [
            { id: 'introduction', title: 'Introduction' },
            { id: 'singly', title: 'Singly Linked Lists' },
            { id: 'doubly', title: 'Doubly Linked Lists' },
            { id: 'circular', title: 'Circular Linked Lists' }
          ]
        },
        {
          id: 'trees',
          title: 'Trees',
          subpages: [
            { id: 'introduction', title: 'Introduction' },
            { id: 'binary', title: 'Binary Trees' },
            { id: 'bst', title: 'Binary Search Trees' },
            { id: 'avl', title: 'AVL Trees' },
            { id: 'traversal', title: 'Tree Traversal' }
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
                      <button
                        onClick={() => toggleTechnology(tech.id)}
                        className={`flex items-center justify-between w-full px-4 py-2 text-sm rounded-md ${
                          tech.id === currentTopic
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
                      </button>
                      
                      {/* Subpage Level */}
                      {expandedTechnologies[tech.id] && tech.subpages && (
                        <div className="ml-4 pl-2 border-l border-gray-200">
                          {tech.subpages.map((subpage) => (
                            <Link
                              key={`${tech.id}-${subpage.id}`}
                              to={`/tutorials/${tech.id}/${subpage.id}`}
                              className={`flex items-center px-4 py-2 text-xs rounded-md ${
                                tech.id === topic && subpage.id === page
                                  ? 'bg-emerald-50 text-emerald-700 font-medium'
                                  : 'text-gray-600 hover:bg-gray-50'
                              }`}
                              onClick={() => onTopicChange(tech.id)}
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
        
        <div className="mt-4 p-4 bg-emerald-50 mx-3 rounded-md">
          <h3 className="font-medium text-emerald-800">Pro Access</h3>
          <p className="text-sm text-emerald-700 mt-1">
            Get unlimited access to all courses and exercises
          </p>
          <Link 
            to="/pro"
            className="mt-2 block w-full text-center px-4 py-2 bg-emerald-600 text-white rounded-md text-sm hover:bg-emerald-700"
          >
            Upgrade Now
          </Link>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;