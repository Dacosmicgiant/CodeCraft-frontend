import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, Hash } from 'lucide-react';

const Sidebar = ({ topics, currentTopic, onTopicChange }) => {
  const [expandedCategories, setExpandedCategories] = useState({
    'Web Development': true,
    'Programming': false,
    'Data Structures': false,
  });
  
  const location = useLocation();
  
  const toggleCategory = (category) => {
    setExpandedCategories({
      ...expandedCategories,
      [category]: !expandedCategories[category],
    });
  };
  
  return (
    <aside className="w-64 h-full bg-white border-r">
      <nav className="h-full overflow-y-auto">
        <div className="p-4">
          <h2 className="text-lg font-bold text-gray-800">Learn to Code</h2>
          <p className="text-sm text-gray-600 mt-1">Find your path and master coding skills</p>
        </div>
        
        <div className="px-3 py-2">
          <input
            type="text"
            placeholder="Filter topics..."
            className="w-full px-3 py-2 rounded-md border text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        
        <div className="mt-2">
          {/* Web Development Category */}
          <CategorySection
            title="Web Development"
            expanded={expandedCategories['Web Development']}
            onToggle={() => toggleCategory('Web Development')}
          >
            <TopicItem
              title="HTML"
              path="/tutorials/html"
              active={currentTopic === 'html'}
              onClick={() => onTopicChange('html')}
            />
            <TopicItem
              title="CSS"
              path="/tutorials/css"
              active={currentTopic === 'css'}
              onClick={() => onTopicChange('css')}
            />
            <TopicItem
              title="JavaScript"
              path="/tutorials/javascript"
              active={currentTopic === 'javascript'}
              onClick={() => onTopicChange('javascript')}
            />
            <TopicItem
              title="React"
              path="/tutorials/react"
              active={currentTopic === 'react'}
              onClick={() => onTopicChange('react')}
            />
            <TopicItem
              title="Node.js"
              path="/tutorials/nodejs"
              active={currentTopic === 'nodejs'}
              onClick={() => onTopicChange('nodejs')}
            />
          </CategorySection>
          
          {/* Programming Category */}
          <CategorySection
            title="Programming"
            expanded={expandedCategories['Programming']}
            onToggle={() => toggleCategory('Programming')}
          >
            <TopicItem
              title="Python"
              path="/tutorials/python"
              active={currentTopic === 'python'}
              onClick={() => onTopicChange('python')}
            />
            <TopicItem
              title="Java"
              path="/tutorials/java"
              active={currentTopic === 'java'}
              onClick={() => onTopicChange('java')}
            />
            <TopicItem
              title="C++"
              path="/tutorials/cpp"
              active={currentTopic === 'cpp'}
              onClick={() => onTopicChange('cpp')}
            />
          </CategorySection>
          
          {/* Data Structures Category */}
          <CategorySection
            title="Data Structures"
            expanded={expandedCategories['Data Structures']}
            onToggle={() => toggleCategory('Data Structures')}
          >
            <TopicItem
              title="Arrays"
              path="/tutorials/arrays"
              active={currentTopic === 'arrays'}
              onClick={() => onTopicChange('arrays')}
            />
            <TopicItem
              title="Linked Lists"
              path="/tutorials/linked-lists"
              active={currentTopic === 'linked-lists'}
              onClick={() => onTopicChange('linked-lists')}
            />
            <TopicItem
              title="Trees"
              path="/tutorials/trees"
              active={currentTopic === 'trees'}
              onClick={() => onTopicChange('trees')}
            />
          </CategorySection>
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

// Category Section Component
const CategorySection = ({ title, expanded, onToggle, children }) => (
  <div className="mb-2">
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full px-4 py-2 text-left text-sm font-medium text-gray-800 hover:bg-gray-100 rounded-md"
    >
      <span>{title}</span>
      {expanded ? (
        <ChevronDown size={16} className="text-gray-500" />
      ) : (
        <ChevronRight size={16} className="text-gray-500" />
      )}
    </button>
    
    {expanded && (
      <div className="ml-2 pl-2 border-l border-gray-200">
        {children}
      </div>
    )}
  </div>
);

// Topic Item Component
const TopicItem = ({ title, path, active, onClick }) => (
  <Link
    to={path}
    className={`flex items-center px-4 py-2 text-sm rounded-md ${
      active
        ? 'bg-emerald-100 text-emerald-700 font-medium'
        : 'text-gray-700 hover:bg-gray-100'
    }`}
    onClick={onClick}
  >
    <Hash size={14} className="mr-2 flex-shrink-0" />
    <span>{title}</span>
  </Link>
);

export default Sidebar;