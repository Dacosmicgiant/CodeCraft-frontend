// src/pages/Exercise.jsx
import { useState } from 'react';
import { Check, X, ArrowRight, BookOpen, Zap, Award } from 'lucide-react';

const ExercisePage = () => {
  const [activeTab, setActiveTab] = useState('html');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample exercise data
  const exercises = [
    {
      id: 1,
      title: 'Create an HTML Form',
      description: 'Practice creating a simple HTML form with various input types.',
      category: 'HTML',
      difficulty: 'Beginner',
      completionRate: 85
    },
    {
      id: 2,
      title: 'Build a Responsive Layout with Flexbox',
      description: 'Create a responsive layout using CSS Flexbox properties.',
      category: 'CSS',
      difficulty: 'Intermediate',
      completionRate: 62
    },
    {
      id: 3,
      title: 'JavaScript DOM Manipulation',
      description: 'Manipulate HTML elements using JavaScript DOM methods.',
      category: 'JavaScript',
      difficulty: 'Intermediate',
      completionRate: 48
    },
    {
      id: 4,
      title: 'React Component State',
      description: 'Build a React component with state management and events.',
      category: 'React',
      difficulty: 'Advanced',
      completionRate: 35
    },
    {
      id: 5,
      title: 'CSS Grid Layout',
      description: 'Create a complex grid layout using CSS Grid properties.',
      category: 'CSS',
      difficulty: 'Intermediate',
      completionRate: 55
    },
    {
      id: 6,
      title: 'HTML Semantic Elements',
      description: 'Practice using semantic HTML elements for better accessibility.',
      category: 'HTML',
      difficulty: 'Beginner',
      completionRate: 78
    }
  ];
  
  // Filter exercises
  const filteredExercises = exercises.filter(exercise => {
    // Filter by difficulty
    if (selectedDifficulty !== 'all' && exercise.difficulty !== selectedDifficulty) {
      return false;
    }
    
    // Filter by category
    if (selectedCategory !== 'all' && exercise.category !== selectedCategory) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      return (
        exercise.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return true;
  });
  
  return (
    <div className="p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Coding Exercises</h1>
          <p className="text-gray-600">
            Practice your skills with hands-on coding exercises and challenges.
          </p>
        </div>
        
        {/* Navigation Tabs */}
        <div className="mb-6 border-b">
          <div className="flex space-x-4">
            <NavTab 
              active={activeTab === 'html'} 
              onClick={() => setActiveTab('html')}
              icon={<BookOpen size={16} />}
              label="Exercises"
            />
            <NavTab 
              active={activeTab === 'challenges'} 
              onClick={() => setActiveTab('challenges')}
              icon={<Zap size={16} />}
              label="Challenges"
            />
            <NavTab 
              active={activeTab === 'completed'} 
              onClick={() => setActiveTab('completed')}
              icon={<Award size={16} />}
              label="Completed"
            />
          </div>
        </div>
        
        {/* Filters */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search exercises..."
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <select
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="HTML">HTML</option>
              <option value="CSS">CSS</option>
              <option value="JavaScript">JavaScript</option>
              <option value="React">React</option>
              <option value="Node.js">Node.js</option>
            </select>
            
            <select
              className="px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            >
              <option value="all">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>
        
        {/* Exercise List */}
        {filteredExercises.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExercises.map(exercise => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No exercises found</h3>
            <p className="text-gray-600">
              Try adjusting your filters or search query.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Navigation Tab Component
const NavTab = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
      active 
        ? 'border-emerald-500 text-emerald-600' 
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`}
  >
    {icon}
    {label}
  </button>
);

// Exercise Card Component
const ExerciseCard = ({ exercise }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${getDifficultyColor(exercise.difficulty)}`}>
            {exercise.difficulty}
          </span>
          <span className="text-xs text-gray-500">{exercise.category}</span>
        </div>
        
        <h3 className="text-lg font-bold mb-2">{exercise.title}</h3>
        <p className="text-gray-600 text-sm mb-4">{exercise.description}</p>
        
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <div className="flex items-center mr-4">
            <span className="mr-1">{exercise.completionRate}%</span>
            <span>completion rate</span>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
          <div 
            className="bg-emerald-500 h-1.5 rounded-full"
            style={{ width: `${exercise.completionRate}%` }}
          ></div>
        </div>
        
        <div className="flex justify-end">
          <a
            href="#"
            className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium text-sm"
          >
            Start Exercise
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ExercisePage;