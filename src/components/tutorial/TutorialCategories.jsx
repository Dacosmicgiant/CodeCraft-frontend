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
      <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
      
      {/* Category Tabs */}
      <div className="flex border-b mb-6 overflow-x-auto hide-scrollbar">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`flex items-center px-4 py-2 border-b-2 font-medium text-sm whitespace-nowrap ${
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
      
      {/* Tutorials for the active category */}
      <div className="grid md:grid-cols-2 gap-6">
        {tutorialsByCategory[activeCategory]?.map((tutorial, index) => (
          <Link 
            key={index} 
            to={tutorial.path}
            className="flex border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="w-16 bg-gray-100 flex items-center justify-center">
              {tutorial.icon}
            </div>
            <div className="flex-1 p-4">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-gray-900">{tutorial.title}</h3>
                {getLevelBadge(tutorial.level)}
              </div>
              <p className="text-sm text-gray-600 mt-1 mb-2">{tutorial.description}</p>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <div className="flex items-center">
                  <BookOpen size={14} className="mr-1" />
                  <span>{tutorial.lessons} lessons</span>
                </div>
                <div className="flex items-center text-emerald-600 font-medium">
                  <span>View Tutorial</span>
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