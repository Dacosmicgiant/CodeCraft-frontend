import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Code, BarChart, ChevronRight, Star } from 'lucide-react';

const TutorialCategories = () => {
  const [activeCategory, setActiveCategory] = useState('web-development');
  
  // Category definitions
  const categories = [
    { id: 'web-development', name: 'Web Development', icon: <Code size={20} className="text-blue-500" /> },
    { id: 'programming', name: 'Programming', icon: <Code size={20} className="text-purple-500" /> },
    { id: 'data-structures', name: 'Data Structures', icon: <BarChart size={20} className="text-green-500" /> },
    { id: 'popular', name: 'Most Popular', icon: <Star size={20} className="text-yellow-500" /> }
  ];
  
  // Tutorial data organized by category
  const tutorialsByCategory = {
    'web-development': [
      {
        title: 'HTML Fundamentals',
        description: 'Learn the structure of web pages with HTML tags and attributes.',
        path: '/tutorials/html',
        level: 'Beginner',
        lessons: 10,
        icon: <span className="text-lg font-bold text-orange-500">HTML</span>
      },
      {
        title: 'CSS Styling',
        description: 'Style your web pages with CSS selectors, properties, and values.',
        path: '/tutorials/css',
        level: 'Beginner',
        lessons: 12,
        icon: <span className="text-lg font-bold text-blue-500">CSS</span>
      },
      {
        title: 'JavaScript Essentials',
        description: 'Add interactivity to your websites with JavaScript.',
        path: '/tutorials/javascript',
        level: 'Intermediate',
        lessons: 15,
        icon: <span className="text-lg font-bold text-yellow-500">JS</span>
      },
      {
        title: 'React Fundamentals',
        description: 'Build user interfaces with React components and hooks.',
        path: '/tutorials/react',
        level: 'Intermediate',
        lessons: 12,
        icon: <span className="text-lg font-bold text-cyan-500">React</span>
      }
    ],
    'programming': [
      {
        title: 'Python Basics',
        description: 'Get started with Python programming language.',
        path: '/tutorials/python',
        level: 'Beginner',
        lessons: 14,
        icon: <span className="text-lg font-bold text-blue-600">Py</span>
      },
      {
        title: 'Java Programming',
        description: 'Learn object-oriented programming with Java.',
        path: '/tutorials/java',
        level: 'Intermediate',
        lessons: 16,
        icon: <span className="text-lg font-bold text-red-500">Java</span>
      },
      {
        title: 'C++ Fundamentals',
        description: 'Master the C++ programming language.',
        path: '/tutorials/cpp',
        level: 'Advanced',
        lessons: 18,
        icon: <span className="text-lg font-bold text-blue-800">C++</span>
      }
    ],
    'data-structures': [
      {
        title: 'Arrays and Strings',
        description: 'Learn about arrays and string manipulation.',
        path: '/tutorials/arrays',
        level: 'Beginner',
        lessons: 8,
        icon: <BarChart size={20} className="text-emerald-500" />
      },
      {
        title: 'Linked Lists',
        description: 'Understand linked lists and their operations.',
        path: '/tutorials/linked-lists',
        level: 'Intermediate',
        lessons: 10,
        icon: <BarChart size={20} className="text-emerald-500" />
      },
      {
        title: 'Trees',
        description: 'Explore tree data structures and algorithms.',
        path: '/tutorials/trees',
        level: 'Intermediate',
        lessons: 12,
        icon: <BarChart size={20} className="text-emerald-500" />
      }
    ],
    'popular': [
      {
        title: 'HTML Fundamentals',
        description: 'Learn the structure of web pages with HTML tags and attributes.',
        path: '/tutorials/html',
        level: 'Beginner',
        lessons: 10,
        icon: <span className="text-lg font-bold text-orange-500">HTML</span>
      },
      {
        title: 'JavaScript Essentials',
        description: 'Add interactivity to your websites with JavaScript.',
        path: '/tutorials/javascript',
        level: 'Intermediate',
        lessons: 15,
        icon: <span className="text-lg font-bold text-yellow-500">JS</span>
      },
      {
        title: 'Python Basics',
        description: 'Get started with Python programming language.',
        path: '/tutorials/python',
        level: 'Beginner',
        lessons: 14,
        icon: <span className="text-lg font-bold text-blue-600">Py</span>
      },
      {
        title: 'React Fundamentals',
        description: 'Build user interfaces with React components and hooks.',
        path: '/tutorials/react',
        level: 'Intermediate',
        lessons: 12,
        icon: <span className="text-lg font-bold text-cyan-500">React</span>
      }
    ]
  };
  
  // Generate badge based on difficulty level
  const getLevelBadge = (level) => {
    switch (level) {
      case 'Beginner':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Beginner</span>;
      case 'Intermediate':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Intermediate</span>;
      case 'Advanced':
        return <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Advanced</span>;
      default:
        return null;
    }
  };
  
  return (
    <div className="mb-12">
      <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Browse by Category</h2>
      
      {/* Scrollable Category Tabs */}
      <div className="relative mb-6 overflow-hidden">
        <div className="flex overflow-x-auto scrollbar-hide py-1 -mx-4 px-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center px-3 py-2 border-b-2 font-medium text-sm whitespace-nowrap flex-shrink-0 mr-4 ${
                activeCategory === category.id
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Tutorial Cards - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tutorialsByCategory[activeCategory]?.map((tutorial, index) => (
          <Link 
            key={index} 
            to={tutorial.path}
            className="block border rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white"
          >
            {/* Card Header with Icon */}
            <div className="flex items-center p-4 border-b">
              <div className="w-10 h-10 flex-shrink-0 bg-gray-100 rounded-md flex items-center justify-center mr-3">
                {tutorial.icon}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-gray-900 truncate">{tutorial.title}</h3>
              </div>
              <div className="ml-2 flex-shrink-0">
                {getLevelBadge(tutorial.level)}
              </div>
            </div>
            
            {/* Card Body */}
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{tutorial.description}</p>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <div className="flex items-center">
                  <BookOpen size={14} className="mr-1" />
                  <span>{tutorial.lessons} lessons</span>
                </div>
                <div className="flex items-center text-emerald-600 font-medium">
                  <span>Start Learning</span>
                  <ChevronRight size={14} className="ml-1" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TutorialCategories;