import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Code, 
  Search, 
  Filter, 
  Star, 
  Clock, 
  BarChart, 
  Award,
  ChevronDown,
  X,
  ArrowRight,
  Video,
  Bookmark,
  Check
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

// These utility functions need to be accessible to all components
// Generate tutorial icon - moved outside component
const getTutorialIcon = (type) => {
  switch (type) {
    case 'html':
      return <span className="text-lg font-bold text-white">HTML</span>;
    case 'css':
      return <span className="text-lg font-bold text-white">CSS</span>;
    case 'javascript':
      return <span className="text-lg font-bold text-white">JS</span>;
    case 'react':
      return <span className="text-lg font-bold text-white">React</span>;
    default:
      return <BookOpen size={24} className="text-white" />;
  }
};

// Generate difficulty badge - moved outside component
const getDifficultyBadge = (level) => {
  switch (level) {
    case 'beginner':
      return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Beginner</span>;
    case 'intermediate':
      return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">Intermediate</span>;
    case 'advanced':
      return <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">Advanced</span>;
    default:
      return null;
  }
};

const TutorialPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if the device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  // Sample tutorial data
  const tutorials = [
    {
      id: 'html-basics',
      title: 'HTML Fundamentals',
      description: 'Learn the basics of HTML, the building block of the web.',
      category: 'web-dev',
      difficulty: 'beginner',
      lessonCount: 12,
      estimatedTime: '3 hours',
      popular: true,
      rating: 4.8,
      reviews: 235,
      color: 'from-orange-500 to-red-500',
      icon: 'html',
      path: '/tutorials/html',
      topics: ['HTML Structure', 'Tags', 'Attributes', 'Forms', 'Semantic HTML'],
      progress: 0.6,
      hasVideo: true
    },
    {
      id: 'css-fundamentals',
      title: 'CSS Styling',
      description: 'Master CSS and create beautifully styled websites.',
      category: 'web-dev',
      difficulty: 'beginner',
      lessonCount: 14,
      estimatedTime: '4 hours',
      popular: true,
      rating: 4.7,
      reviews: 184,
      color: 'from-blue-500 to-cyan-500',
      icon: 'css',
      path: '/tutorials/css',
      topics: ['Selectors', 'Box Model', 'Flexbox', 'Grid', 'Animations'],
      progress: 0.3,
      hasVideo: true
    },
    {
      id: 'javascript-essentials',
      title: 'JavaScript Essentials',
      description: 'Learn JavaScript, the programming language of the web.',
      category: 'web-dev',
      difficulty: 'intermediate',
      lessonCount: 18,
      estimatedTime: '6 hours',
      popular: true,
      rating: 4.9,
      reviews: 312,
      color: 'from-yellow-400 to-yellow-600',
      icon: 'javascript',
      path: '/tutorials/javascript',
      topics: ['Variables', 'Functions', 'Objects', 'Arrays', 'DOM Manipulation'],
      progress: 0.1,
      hasVideo: true
    },
    {
      id: 'react-basics',
      title: 'React Fundamentals',
      description: 'Build modern user interfaces with React.',
      category: 'web-dev',
      difficulty: 'intermediate',
      lessonCount: 16,
      estimatedTime: '5 hours',
      popular: true,
      rating: 4.9,
      reviews: 276,
      color: 'from-cyan-500 to-blue-500',
      icon: 'react',
      path: '/tutorials/react',
      topics: ['Components', 'Props', 'State', 'Hooks', 'Context'],
      progress: 0,
      hasVideo: true
    }
  ];
  
  // Filter tutorials based on selections
  const getFilteredTutorials = () => {
    let filtered = [...tutorials];
    
    // Category filter
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'popular') {
        filtered = filtered.filter(t => t.popular);
      } else {
        filtered = filtered.filter(t => t.category === selectedCategory);
      }
    }
    
    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(t => t.difficulty === selectedDifficulty);
    }
    
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(query) || 
        t.description.toLowerCase().includes(query) ||
        t.topics.some(topic => topic.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  };
  
  const filteredTutorials = getFilteredTutorials();
  
  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedDifficulty('all');
    setSearchQuery('');
  };
  
  return (
    <div className="container-fluid px-4 py-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Tutorial Library</h1>
        <p className="text-gray-600">
          Learn coding with our collection of interactive tutorials and video lessons.
        </p>
      </div>
      
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for tutorials, topics, or keywords..."
            className="w-full py-3 pl-10 pr-4 text-gray-700 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>
      
      {/* Category/Filter Bar */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {/* Category Pills */}
          <CategoryPill 
            active={selectedCategory === 'all'} 
            onClick={() => setSelectedCategory('all')}
          >
            All
          </CategoryPill>
          <CategoryPill 
            active={selectedCategory === 'web-dev'} 
            onClick={() => setSelectedCategory('web-dev')}
          >
            Web Development
          </CategoryPill>
          <CategoryPill 
            active={selectedCategory === 'popular'} 
            onClick={() => setSelectedCategory('popular')}
          >
            <Star size={16} className="mr-1" />
            Popular
          </CategoryPill>
          
          {/* Filter Button */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-1 px-3 py-1.5 bg-white border rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Filter size={16} />
            <span>Filters</span>
            <ChevronDown size={16} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
        
        {/* Expanded Filter Panel */}
        {isFilterOpen && (
          <div className="mt-4 p-4 bg-white border rounded-lg shadow-sm">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Difficulty</h3>
              <div className="flex flex-wrap gap-2">
                <CategoryPill 
                  active={selectedDifficulty === 'all'} 
                  onClick={() => setSelectedDifficulty('all')}
                >
                  All Levels
                </CategoryPill>
                <CategoryPill 
                  active={selectedDifficulty === 'beginner'} 
                  onClick={() => setSelectedDifficulty('beginner')}
                  className="bg-green-100 text-green-800"
                >
                  Beginner
                </CategoryPill>
                <CategoryPill 
                  active={selectedDifficulty === 'intermediate'} 
                  onClick={() => setSelectedDifficulty('intermediate')}
                  className="bg-blue-100 text-blue-800"
                >
                  Intermediate
                </CategoryPill>
                <CategoryPill 
                  active={selectedDifficulty === 'advanced'} 
                  onClick={() => setSelectedDifficulty('advanced')}
                  className="bg-purple-100 text-purple-800"
                >
                  Advanced
                </CategoryPill>
              </div>
            </div>
            
            {/* Format Filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Format</h3>
              <div className="flex flex-wrap gap-2">
                <CategoryPill className="bg-red-50 text-red-700">
                  <Video size={14} className="mr-1" />
                  With Videos
                </CategoryPill>
                <CategoryPill className="bg-blue-50 text-blue-700">
                  <Code size={14} className="mr-1" />
                  Interactive
                </CategoryPill>
              </div>
            </div>
            
            {/* Clear Filters Button */}
            {(selectedCategory !== 'all' || selectedDifficulty !== 'all' || searchQuery) && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-md text-sm font-medium hover:bg-red-100"
                >
                  <X size={16} />
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Results Count */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-gray-600">
          {filteredTutorials.length} {filteredTutorials.length === 1 ? 'tutorial' : 'tutorials'} found
          {searchQuery && <span> for "{searchQuery}"</span>}
        </p>
      </div>
      
      {/* Tutorial Cards Grid */}
      {filteredTutorials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTutorials.map(tutorial => (
            <TutorialCard 
              key={tutorial.id} 
              tutorial={tutorial} 
              onClick={() => navigate(tutorial.path)}
              user={user}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border">
          <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <Search size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tutorials found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search or filters to find tutorials.
          </p>
          <button
            onClick={clearFilters}
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
          >
            <X size={16} className="mr-2" />
            Clear filters
          </button>
        </div>
      )}
      
      {/* Featured Banner */}
      <div className="mt-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-2">Ready to become a coding pro?</h2>
            <p className="text-purple-100 mb-4">
              Get unlimited access to all our premium tutorials.
            </p>
            <div className="flex flex-wrap gap-3">
              <Feature>In-depth content</Feature>
              <Feature>Project-based learning</Feature>
              <Feature>Certificate of completion</Feature>
            </div>
          </div>
          <Link 
            to="/pro"
            className="px-6 py-3 bg-white text-purple-700 rounded-md font-medium hover:bg-gray-100 whitespace-nowrap"
          >
            Upgrade to Pro
          </Link>
        </div>
      </div>
    </div>
  );
};

// Category Pill Component
const CategoryPill = ({ children, active, onClick, className = '' }) => (
  <button
    onClick={onClick}
    className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
      active 
        ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-500' 
        : `bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 ${className}`
    }`}
  >
    {children}
  </button>
);

// Feature Item Component
const Feature = ({ children }) => (
  <div className="flex items-center gap-1 text-sm">
    <Check size={16} className="text-purple-200" />
    <span>{children}</span>
  </div>
);

// Tutorial Card Component
const TutorialCard = ({ tutorial, onClick, user }) => {
  return (
    <div 
      className="flex flex-col rounded-lg border overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer bg-white"
      onClick={onClick}
    >
      {/* Card Header with gradient background */}
      <div className={`bg-gradient-to-r ${tutorial.color} p-4 h-20`}>
        <div className="flex justify-between items-center">
          <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center">
            {getTutorialIcon(tutorial.icon)}
          </div>
          
          <div>
            {getDifficultyBadge(tutorial.difficulty)}
            
            {tutorial.popular && (
              <div className="mt-1.5 inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                <Star size={12} className="mr-1" />
                Popular
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Card Body */}
      <div className="flex-1 p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-1 line-clamp-1">{tutorial.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{tutorial.description}</p>
        
        {/* Meta info */}
        <div className="flex justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center">
            <BookOpen size={14} className="mr-1" />
            <span>{tutorial.lessonCount} lessons</span>
          </div>
          <div className="flex items-center">
            <Clock size={14} className="mr-1" />
            <span>{tutorial.estimatedTime}</span>
          </div>
        </div>
        
        {/* Progress bar (for logged in users) */}
        {user && tutorial.progress > 0 ? (
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-gray-700">Your progress</span>
              <span className="text-emerald-600">{Math.round(tutorial.progress * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-emerald-600 h-1.5 rounded-full"
                style={{ width: `${tutorial.progress * 100}%` }}
              ></div>
            </div>
          </div>
        ) : null}
        
        {/* Action button */}
        <div className="flex items-center text-emerald-600 font-medium text-sm">
          <span>{user && tutorial.progress > 0 ? 'Continue Learning' : 'Start Learning'}</span>
          <ArrowRight size={16} className="ml-1" />
        </div>
      </div>
    </div>
  );
};

export default TutorialPage;