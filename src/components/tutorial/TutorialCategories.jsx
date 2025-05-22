import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Code, BarChart, ChevronRight, Star, Loader, AlertCircle } from 'lucide-react';
import { domainAPI, technologyAPI, tutorialAPI } from '../../services/api';

const TutorialCategories = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [domains, setDomains] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch initial data
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Fetch tutorials when category changes
  useEffect(() => {
    if (domains.length > 0 || technologies.length > 0) {
      fetchTutorials();
    }
  }, [activeCategory, domains, technologies]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [domainsRes, technologiesRes] = await Promise.all([
        domainAPI.getAll(),
        technologyAPI.getAll()
      ]);

      setDomains(domainsRes.data);
      setTechnologies(technologiesRes.data);

    } catch (err) {
      console.error('Error fetching initial data:', err);
      setError('Failed to load categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTutorials = async () => {
    try {
      const params = {};
      
      // Set filter based on active category
      if (activeCategory !== 'all' && activeCategory !== 'popular') {
        // Check if it's a domain ID or technology ID
        const isDomain = domains.some(d => d._id === activeCategory);
        const isTechnology = technologies.some(t => t._id === activeCategory);
        
        if (isDomain) {
          params.domain = activeCategory;
        } else if (isTechnology) {
          params.technology = activeCategory;
        }
      }

      // For popular, we can sort by creation date or add a popular field later
      if (activeCategory === 'popular') {
        params.sort = '-createdAt';
        params.limit = 6;
      }

      const tutorialsRes = await tutorialAPI.getAll(params);
      const tutorialsList = tutorialsRes.data.tutorials || tutorialsRes.data;
      setTutorials(tutorialsList);

    } catch (err) {
      console.error('Error fetching tutorials:', err);
      setError('Failed to load tutorials. Please try again.');
    }
  };

  // Generate categories from domains and technologies
  const getCategories = () => {
    const categories = [
      { id: 'all', name: 'All Tutorials', icon: <BookOpen size={20} className="text-blue-500" /> },
      { id: 'popular', name: 'Most Popular', icon: <Star size={20} className="text-yellow-500" /> }
    ];

    // Add domains
    domains.forEach(domain => {
      categories.push({
        id: domain._id,
        name: domain.name,
        icon: <Code size={20} className="text-purple-500" />,
        type: 'domain'
      });
    });

    // Add top technologies (limit to avoid too many categories)
    const topTechnologies = technologies.slice(0, 4);
    topTechnologies.forEach(tech => {
      categories.push({
        id: tech._id,
        name: tech.name,
        icon: <Code size={20} className="text-green-500" />,
        type: 'technology'
      });
    });

    return categories;
  };

  // Generate badge based on difficulty level
  const getLevelBadge = (level) => {
    switch (level) {
      case 'beginner':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Beginner</span>;
      case 'intermediate':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Intermediate</span>;
      case 'advanced':
        return <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Advanced</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Beginner</span>;
    }
  };

  // Get technology icon
  const getTechnologyIcon = (tutorial) => {
    const techName = tutorial.technology?.name?.toLowerCase() || '';
    
    if (techName.includes('html')) {
      return <span className="text-lg font-bold text-orange-500">HTML</span>;
    } else if (techName.includes('css')) {
      return <span className="text-lg font-bold text-blue-500">CSS</span>;
    } else if (techName.includes('javascript')) {
      return <span className="text-lg font-bold text-yellow-500">JS</span>;
    } else if (techName.includes('react')) {
      return <span className="text-lg font-bold text-cyan-500">React</span>;
    } else if (techName.includes('node')) {
      return <span className="text-lg font-bold text-green-500">Node</span>;
    } else if (techName.includes('python')) {
      return <span className="text-lg font-bold text-blue-600">Py</span>;
    } else {
      return <Code size={20} className="text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="mb-12">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Browse by Category</h2>
        <div className="flex justify-center py-8">
          <Loader size={32} className="animate-spin text-emerald-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-12">
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Browse by Category</h2>
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex items-start">
            <AlertCircle className="flex-shrink-0 h-5 w-5 text-red-500 mt-0.5" />
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <button 
                onClick={fetchInitialData}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const categories = getCategories();
  
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
        {tutorials.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            <BookOpen size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No tutorials found for this category.</p>
            <button 
              onClick={() => setActiveCategory('all')}
              className="mt-2 text-emerald-600 hover:text-emerald-700 underline"
            >
              View all tutorials
            </button>
          </div>
        ) : (
          tutorials.map((tutorial) => (
            <Link 
              key={tutorial._id} 
              to={`/tutorials/${tutorial.slug || tutorial._id}`}
              className="block border rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white"
            >
              {/* Card Header with Icon */}
              <div className="flex items-center p-4 border-b">
                <div className="w-10 h-10 flex-shrink-0 bg-gray-100 rounded-md flex items-center justify-center mr-3">
                  {getTechnologyIcon(tutorial)}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-gray-900 truncate">{tutorial.title}</h3>
                </div>
                <div className="ml-2 flex-shrink-0">
                  {getLevelBadge(tutorial.difficulty)}
                </div>
              </div>
              
              {/* Card Body */}
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{tutorial.description}</p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <div className="flex items-center">
                    <BookOpen size={14} className="mr-1" />
                    <span>{tutorial.lessons?.length || 0} lessons</span>
                  </div>
                  <div className="flex items-center text-emerald-600 font-medium">
                    <span>Start Learning</span>
                    <ChevronRight size={14} className="ml-1" />
                  </div>
                </div>
                
                {/* Tags */}
                {tutorial.tags && tutorial.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {tutorial.tags.slice(0, 3).map((tag, index) => (
                      <span 
                        key={index}
                        className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default TutorialCategories;