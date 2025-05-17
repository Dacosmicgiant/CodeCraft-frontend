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
  CheckCircle,
  ArrowRight,
  Video,
  Bookmark
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import TutorialCategories from '../components/tutorial/TutorialCategories';

// Mock data - in a real app, this would come from an API
const tutorialCategories = [
  { id: 'all', name: 'All Tutorials' },
  { id: 'web-dev', name: 'Web Development' },
  { id: 'programming', name: 'Programming Languages' },
  { id: 'data-structures', name: 'Data Structures' },
  { id: 'popular', name: 'Most Popular' },
  { id: 'new', name: 'Recently Added' },
];

const difficultyLevels = [
  { id: 'beginner', name: 'Beginner', color: 'bg-green-100 text-green-800' },
  { id: 'intermediate', name: 'Intermediate', color: 'bg-blue-100 text-blue-800' },
  { id: 'advanced', name: 'Advanced', color: 'bg-purple-100 text-purple-800' },
];

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
  },
  // Rest of the tutorials remain the same...
];

// Get icon component based on tutorial icon type
const getTutorialIcon = (iconType) => {
  switch (iconType) {
    case 'html':
      return <span className="text-2xl font-bold text-white">HTML</span>;
    case 'css':
      return <span className="text-2xl font-bold text-white">CSS</span>;
    case 'javascript':
      return <span className="text-2xl font-bold text-white">JS</span>;
    case 'react':
      return <span className="text-2xl font-bold text-white">React</span>;
    case 'python':
      return <span className="text-2xl font-bold text-white">Py</span>;
    case 'java':
      return <span className="text-2xl font-bold text-white">Java</span>;
    case 'data':
      return <BarChart size={32} className="text-white" />;
    case 'nodejs':
      return <span className="text-2xl font-bold text-white">Node</span>;
    case 'typescript':
      return <span className="text-2xl font-bold text-white">TS</span>;
    case 'algo':
      return <Code size={32} className="text-white" />;
    case 'docker':
      return <span className="text-2xl font-bold text-white">Docker</span>;
    case 'git':
      return <span className="text-2xl font-bold text-white">Git</span>;
    default:
      return <BookOpen size={32} className="text-white" />;
  }
};

// Get difficulty badge based on level
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
  const [visibleTutorials, setVisibleTutorials] = useState(tutorials);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isCategoryView, setIsCategoryView] = useState(true);
  
  // Apply filters and search
  useEffect(() => {
    let filtered = [...tutorials];
    
    // Filter by category
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'popular') {
        filtered = filtered.filter(tutorial => tutorial.popular);
      } else if (selectedCategory === 'new') {
        // Simulate "new" tutorials - in a real app this would use a date field
        filtered = filtered.slice(0, 5);
      } else {
        filtered = filtered.filter(tutorial => tutorial.category === selectedCategory);
      }
    }
    
    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(tutorial => tutorial.difficulty === selectedDifficulty);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tutorial => 
        tutorial.title.toLowerCase().includes(query) || 
        tutorial.description.toLowerCase().includes(query) ||
        tutorial.topics.some(topic => topic.toLowerCase().includes(query))
      );
    }
    
    setVisibleTutorials(filtered);
  }, [selectedCategory, selectedDifficulty, searchQuery]);
  
  // Handle search input
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // Switch to card view when searching
    if (e.target.value) {
      setIsCategoryView(false);
    }
  };
  
  // Clear filters
  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedDifficulty('all');
    setSearchQuery('');
  };
  
  // Handle card click
  const handleCardClick = (path) => {
    navigate(path);
  };
  
  // Toggle view mode
  const toggleViewMode = () => {
    setIsCategoryView(!isCategoryView);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tutorial Library</h1>
        <p className="text-lg text-gray-600">
          Learn coding with our collection of interactive tutorials and video lessons.
        </p>
      </div>
      
      {/* Search bar */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="w-full md:w-2/3 relative">
            <input
              type="text"
              placeholder="Search for tutorials, topics, or keywords..."
              className="w-full py-3 pl-12 pr-4 text-gray-700 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={searchQuery}
              onChange={handleSearch}
            />
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            )}
          </div>
          
          <div className="w-full md:w-1/3 flex gap-2 items-center">
            <button
              onClick={toggleViewMode}
              className="px-4 py-2.5 border rounded-md bg-white text-gray-700 hover:bg-gray-50 flex items-center gap-1"
            >
              {isCategoryView ? (
                <>
                  <BarChart size={18} className="text-emerald-600" />
                  <span>Cards View</span>
                </>
              ) : (
                <>
                  <Bookmark size={18} className="text-emerald-600" />
                  <span>Category View</span>
                </>
              )}
            </button>
            
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="px-4 py-2.5 border rounded-md bg-white text-gray-700 hover:bg-gray-50 flex items-center gap-1"
            >
              <Filter size={18} />
              <span>Filter</span>
              <ChevronDown size={16} className={isFilterOpen ? 'transform rotate-180' : ''} />
            </button>
          </div>
        </div>
        
        {/* Advanced Filters */}
        {isFilterOpen && (
          <div className="mt-4 p-4 bg-white border rounded-lg shadow-sm">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Tutorial Category</h3>
                <div className="flex flex-wrap gap-2">
                  {tutorialCategories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                        selectedCategory === category.id 
                          ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-400' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Difficulty Level</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedDifficulty('all')}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                      selectedDifficulty === 'all' 
                        ? 'bg-gray-800 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All Levels
                  </button>
                  {difficultyLevels.map(level => (
                    <button
                      key={level.id}
                      onClick={() => setSelectedDifficulty(level.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                        selectedDifficulty === level.id 
                          ? `${level.color.replace('bg-', 'bg-').replace('text-', 'text-')} ring-1 ring-${level.color.split(' ')[1].replace('text-', '')}-400` 
                          : level.color
                      }`}
                    >
                      {level.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Content Format</h3>
                <div className="flex flex-wrap gap-2">
                  <button className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200">
                    <Video size={12} />
                    <span>With Videos</span>
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200">
                    <BookOpen size={12} />
                    <span>Text-based</span>
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200">
                    <Code size={12} />
                    <span>Interactive</span>
                  </button>
                </div>
              </div>
            </div>
            
            {(selectedCategory !== 'all' || selectedDifficulty !== 'all' || searchQuery) && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="px-3 py-1.5 bg-red-50 text-red-600 rounded-md text-sm font-medium hover:bg-red-100 flex items-center gap-1"
                >
                  <X size={16} />
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Content area */}
      {searchQuery ? (
        // Search results
        <>
          <div className="mb-6">
            <h2 className="text-xl font-bold">Search Results</h2>
            <p className="text-gray-600">Found {visibleTutorials.length} tutorials matching "{searchQuery}"</p>
          </div>
          
          {visibleTutorials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleTutorials.map((tutorial) => (
                <TutorialCard 
                  key={tutorial.id} 
                  tutorial={tutorial}
                  hoveredCard={hoveredCard}
                  setHoveredCard={setHoveredCard}
                  handleCardClick={handleCardClick}
                  user={user}
                />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <Search size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tutorials found</h3>
              <p className="text-gray-600 mb-4">
                We couldn't find any tutorials matching your search criteria.
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
        </>
      ) : (
        // Main view (either category-based or card-based)
        isCategoryView ? (
          <TutorialCategories />
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Showing <span className="font-medium">{visibleTutorials.length}</span> tutorials
              </p>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <select className="text-sm border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500">
                  <option>Most Popular</option>
                  <option>Highest Rated</option>
                  <option>Newest</option>
                  <option>Beginner Friendly</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleTutorials.map((tutorial) => (
                <TutorialCard 
                  key={tutorial.id} 
                  tutorial={tutorial}
                  hoveredCard={hoveredCard}
                  setHoveredCard={setHoveredCard}
                  handleCardClick={handleCardClick}
                  user={user}
                />
              ))}
            </div>
          </>
        )
      )}
      
      {/* Featured section */}
      <section className="mt-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-8 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Ready to become a coding pro?</h2>
            <p className="text-purple-100 mb-4">
              Get unlimited access to all our premium tutorials with our Pro plan.
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-purple-200" />
                <span>In-depth content</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-purple-200" />
                <span>Project-based learning</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-purple-200" />
                <span>Certificate of completion</span>
              </div>
            </div>
          </div>
          <Link 
            to="/pro"
            className="px-6 py-3 bg-white text-purple-700 rounded-md font-medium hover:bg-gray-100 transition-colors"
          >
            Upgrade to Pro
          </Link>
        </div>
      </section>
    </div>
  );
};

// Tutorial Card Component
const TutorialCard = ({ tutorial, hoveredCard, setHoveredCard, handleCardClick, user }) => {
  return (
    <div 
      key={tutorial.id}
      className="group relative bg-white rounded-xl shadow-sm border overflow-hidden transition-all duration-300 hover:shadow-md"
      onMouseEnter={() => setHoveredCard(tutorial.id)}
      onMouseLeave={() => setHoveredCard(null)}
    >
      {/* Card header with gradient bg */}
      <div className={`bg-gradient-to-r ${tutorial.color} p-6 h-32 flex items-center justify-between relative overflow-hidden`}>
        <div className="relative z-10">
          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center">
            {getTutorialIcon(tutorial.icon)}
          </div>
        </div>
        
        <div className="relative z-10 text-right">
          {/* Difficulty badge */}
          {getDifficultyBadge(tutorial.difficulty)}
          
          {/* Popular badge */}
          {tutorial.popular && (
            <div className="mt-2 inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
              <Star size={12} className="mr-1" />
              Popular
            </div>
          )}

          {/* Video badge */}
          {tutorial.hasVideo && (
            <div className="mt-2 inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              <Video size={12} className="mr-1" />
              Video
            </div>
          )}
        </div>
        
        {/* Decorative elements */}
        <div className="absolute right-0 bottom-0 w-32 h-32 bg-white opacity-10 rounded-full transform translate-x-8 translate-y-8"></div>
        <div className="absolute left-0 top-0 w-16 h-16 bg-black opacity-10 rounded-full transform -translate-x-4 -translate-y-4"></div>
      </div>
      
      {/* Card content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
          {tutorial.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2">
          {tutorial.description}
        </p>
        
        {/* Meta info */}
        <div className="flex justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <BookOpen size={16} className="mr-1" />
            <span>{tutorial.lessonCount} lessons</span>
          </div>
          <div className="flex items-center">
            <Clock size={16} className="mr-1" />
            <span>{tutorial.estimatedTime}</span>
          </div>
        </div>
        
        {/* Topics */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {tutorial.topics.slice(0, 3).map((topic, index) => (
              <span 
                key={index}
                className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
              >
                {topic}
              </span>
            ))}
            {tutorial.topics.length > 3 && (
              <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                +{tutorial.topics.length - 3} more
              </span>
            )}
          </div>
        </div>
        
        {/* Rating */}
        <div className="flex items-center mb-4">
          <div className="flex items-center mr-2">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={16} 
                className={i < Math.floor(tutorial.rating) 
                  ? "text-yellow-400 fill-yellow-400" 
                  : "text-gray-300"}
              />
            ))}
          </div>
          <span className="text-sm font-medium">{tutorial.rating}</span>
          <span className="text-sm text-gray-500 ml-1">({tutorial.reviews})</span>
        </div>
        
        {/* Progress bar (if user is logged in and has progress) */}
        {user && tutorial.progress > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium text-gray-700">Your progress</span>
              <span className="text-emerald-600">{Math.round(tutorial.progress * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${tutorial.progress * 100}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {/* Action button */}
        <button
          onClick={() => handleCardClick(tutorial.path)}
          className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors flex items-center justify-center gap-2"
        >
          {user && tutorial.progress > 0 ? (
            <>
              <span>Continue Learning</span>
              <ArrowRight size={16} />
            </>
          ) : (
            <>
              <span>Start Learning</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </div>
      
      {/* Hover overlay - only covers the content area, not the banner */}
      {hoveredCard === tutorial.id && (
        <div className="absolute top-32 left-0 right-0 bottom-0 bg-white bg-opacity-95 p-6 flex flex-col justify-between transform transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100 z-10 overflow-auto">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{tutorial.title}</h3>
            <p className="text-gray-700 mb-4">{tutorial.description}</p>
            
            <h4 className="font-medium text-gray-800 mb-2">What you'll learn:</h4>
            <ul className="space-y-1 mb-4">
              {tutorial.topics.map((topic, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle size={16} className="text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{topic}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <button
            onClick={() => handleCardClick(tutorial.path)}
            className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors flex items-center justify-center gap-2 mt-4"
          >
            <span>View Tutorial</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default TutorialPage;