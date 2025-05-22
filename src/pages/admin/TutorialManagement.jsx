import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, Edit, Trash2, Search, Filter, ChevronDown, 
  BookOpen, AlertCircle, X, Check, Layers, FileText 
} from 'lucide-react';
import { tutorialAPI, domainAPI, technologyAPI } from '../../services/api';

const TutorialManagement = () => {
  const [tutorials, setTutorials] = useState([]);
  const [domains, setDomains] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    domain: 'all',
    technology: 'all',
    difficulty: 'all'
  });
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tutorialToDelete, setTutorialToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Load data when component mounts
  useEffect(() => {
    fetchInitialData();
  }, []);
  
  // Refetch tutorials when filters change
  useEffect(() => {
    if (domains.length > 0 || technologies.length > 0) {
      fetchTutorials(filters);
    }
  }, [filters, domains, technologies]);
  
  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [domainsRes, technologiesRes] = await Promise.all([
        domainAPI.getAll(),
        technologyAPI.getAll()
      ]);
      
      setDomains(domainsRes.data || []);
      setTechnologies(technologiesRes.data || []);
      
      // Fetch tutorials after domains and technologies are loaded
      await fetchTutorials(filters);
      
    } catch (err) {
      console.error('Error fetching initial data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchTutorials = async (filterParams = {}) => {
    try {
      setError(null);
      
      const params = { ...filterParams };
      if (params.domain === 'all') delete params.domain;
      if (params.technology === 'all') delete params.technology;
      if (params.difficulty === 'all') delete params.difficulty;
      
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }
      
      const response = await tutorialAPI.getAll(params);
      const tutorialsList = response.data.tutorials || response.data || [];
      setTutorials(tutorialsList);
    } catch (err) {
      console.error('Error fetching tutorials:', err);
      setError('Failed to load tutorials. Please try again.');
      setTutorials([]);
    }
  };
  
  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    
    // Close filter menu
    setShowFilterMenu(false);
    setActiveFilter(null);
  };
  
  // Toggle filter menu
  const toggleFilterMenu = (filterName) => {
    if (activeFilter === filterName) {
      setShowFilterMenu(false);
      setActiveFilter(null);
    } else {
      setShowFilterMenu(true);
      setActiveFilter(filterName);
    }
  };
  
  // Handle search
  const handleSearch = () => {
    fetchTutorials(filters);
  };

  // Handle search input change with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (domains.length > 0 || technologies.length > 0) {
        handleSearch();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);
  
  // Filter tutorials based on search (client-side backup)
  const filteredTutorials = tutorials.filter(tutorial => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      tutorial.title.toLowerCase().includes(searchLower) ||
      tutorial.description.toLowerCase().includes(searchLower) ||
      (tutorial.tags && tutorial.tags.some(tag => 
        tag.toLowerCase().includes(searchLower)
      ))
    );
  });
  
  // Handle delete confirmation
  const confirmDelete = (tutorial) => {
    setTutorialToDelete(tutorial);
    setShowDeleteModal(true);
  };
  
  // Handle actual delete
  const deleteTutorial = async () => {
    try {
      await tutorialAPI.delete(tutorialToDelete._id);
      
      // Remove from local state
      setTutorials(tutorials.filter(t => t._id !== tutorialToDelete._id));
      setShowDeleteModal(false);
      setTutorialToDelete(null);
    } catch (err) {
      console.error('Error deleting tutorial:', err);
      alert('Failed to delete tutorial. Please try again.');
    }
  };
  
  // Handle publish toggle
  const togglePublish = async (tutorial) => {
    try {
      const updatedTutorial = { 
        ...tutorial, 
        isPublished: !tutorial.isPublished 
      };
      
      await tutorialAPI.update(tutorial._id, updatedTutorial);
      
      // Update in local state
      setTutorials(tutorials.map(t => 
        t._id === tutorial._id ? { ...t, isPublished: !t.isPublished } : t
      ));
    } catch (err) {
      console.error('Error updating tutorial:', err);
      alert('Failed to update tutorial. Please try again.');
    }
  };

  // Get name by ID helpers
  const getDomainName = (domainId) => {
    if (!domainId) return 'Unknown Domain';
    const domain = domains.find(d => d._id === domainId);
    return domain ? domain.name : 'Unknown Domain';
  };

  const getTechnologyName = (technologyId) => {
    if (!technologyId) return 'Unknown Technology';
    const technology = technologies.find(t => t._id === technologyId);
    return technology ? technology.name : 'Unknown Technology';
  };

  // Safely extract names from tutorial objects
  const getTutorialDomainName = (tutorial) => {
    if (tutorial.domain) {
      if (typeof tutorial.domain === 'object') {
        return tutorial.domain.name || 'Unknown Domain';
      } else {
        return getDomainName(tutorial.domain);
      }
    }
    return 'Unknown Domain';
  };

  const getTutorialTechnologyName = (tutorial) => {
    if (tutorial.technology) {
      if (typeof tutorial.technology === 'object') {
        return tutorial.technology.name || 'Unknown Technology';
      } else {
        return getTechnologyName(tutorial.technology);
      }
    }
    return 'Unknown Technology';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tutorial Management</h1>
        <Link 
          to="/admin/tutorials/new" 
          className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 flex items-center gap-2"
        >
          <Plus size={18} />
          Add Tutorial
        </Link>
      </div>
      
      {/* Search and Filter Bar */}
      <div className="mb-6 space-y-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search tutorials..."
            className="w-full py-2 pl-10 pr-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {/* Domain Filter */}
          <div className="relative">
            <button 
              onClick={() => toggleFilterMenu('domain')}
              className={`px-3 py-1.5 border rounded-full flex items-center gap-1 text-sm ${
                filters.domain !== 'all' 
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Layers size={14} />
              <span>
                {filters.domain === 'all' 
                  ? 'All Domains' 
                  : getDomainName(filters.domain)}
              </span>
              <ChevronDown size={14} className={`transition-transform ${activeFilter === 'domain' && showFilterMenu ? 'rotate-180' : ''}`} />
            </button>
            
            {activeFilter === 'domain' && showFilterMenu && (
              <div className="absolute z-20 mt-1 w-48 bg-white border rounded-md shadow-lg">
                <div className="p-2 max-h-60 overflow-y-auto">
                  <div 
                    className={`px-3 py-2 rounded-md cursor-pointer ${filters.domain === 'all' ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-gray-100'}`}
                    onClick={() => handleFilterChange('domain', 'all')}
                  >
                    All Domains
                  </div>
                  {domains.map(domain => (
                    <div 
                      key={domain._id}
                      className={`px-3 py-2 rounded-md cursor-pointer ${filters.domain === domain._id ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-gray-100'}`}
                      onClick={() => handleFilterChange('domain', domain._id)}
                    >
                      {domain.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Technology Filter */}
          <div className="relative">
            <button 
              onClick={() => toggleFilterMenu('technology')}
              className={`px-3 py-1.5 border rounded-full flex items-center gap-1 text-sm ${
                filters.technology !== 'all' 
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <BookOpen size={14} />
              <span>
                {filters.technology === 'all' 
                  ? 'All Technologies' 
                  : getTechnologyName(filters.technology)}
              </span>
              <ChevronDown size={14} className={`transition-transform ${activeFilter === 'technology' && showFilterMenu ? 'rotate-180' : ''}`} />
            </button>
            
            {activeFilter === 'technology' && showFilterMenu && (
              <div className="absolute z-20 mt-1 w-48 bg-white border rounded-md shadow-lg">
                <div className="p-2 max-h-60 overflow-y-auto">
                  <div 
                    className={`px-3 py-2 rounded-md cursor-pointer ${filters.technology === 'all' ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-gray-100'}`}
                    onClick={() => handleFilterChange('technology', 'all')}
                  >
                    All Technologies
                  </div>
                  {technologies.map(tech => (
                    <div 
                      key={tech._id}
                      className={`px-3 py-2 rounded-md cursor-pointer ${filters.technology === tech._id ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-gray-100'}`}
                      onClick={() => handleFilterChange('technology', tech._id)}
                    >
                      {tech.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Difficulty Filter */}
          <div className="relative">
            <button 
              onClick={() => toggleFilterMenu('difficulty')}
              className={`px-3 py-1.5 border rounded-full flex items-center gap-1 text-sm ${
                filters.difficulty !== 'all' 
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Filter size={14} />
              <span>
                {filters.difficulty === 'all' 
                  ? 'All Difficulties' 
                  : filters.difficulty.charAt(0).toUpperCase() + filters.difficulty.slice(1)}
              </span>
              <ChevronDown size={14} className={`transition-transform ${activeFilter === 'difficulty' && showFilterMenu ? 'rotate-180' : ''}`} />
            </button>
            
            {activeFilter === 'difficulty' && showFilterMenu && (
              <div className="absolute z-20 mt-1 w-48 bg-white border rounded-md shadow-lg">
                <div className="p-2">
                  <div 
                    className={`px-3 py-2 rounded-md cursor-pointer ${filters.difficulty === 'all' ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-gray-100'}`}
                    onClick={() => handleFilterChange('difficulty', 'all')}
                  >
                    All Difficulties
                  </div>
                  <div 
                    className={`px-3 py-2 rounded-md cursor-pointer ${filters.difficulty === 'beginner' ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-gray-100'}`}
                    onClick={() => handleFilterChange('difficulty', 'beginner')}
                  >
                    Beginner
                  </div>
                  <div 
                    className={`px-3 py-2 rounded-md cursor-pointer ${filters.difficulty === 'intermediate' ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-gray-100'}`}
                    onClick={() => handleFilterChange('difficulty', 'intermediate')}
                  >
                    Intermediate
                  </div>
                  <div 
                    className={`px-3 py-2 rounded-md cursor-pointer ${filters.difficulty === 'advanced' ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-gray-100'}`}
                    onClick={() => handleFilterChange('difficulty', 'advanced')}
                  >
                    Advanced
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Reset Filters Button - only show if filters are active */}
          {(filters.domain !== 'all' || filters.technology !== 'all' || filters.difficulty !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setFilters({ domain: 'all', technology: 'all', difficulty: 'all' });
                setSearchQuery('');
              }}
              className="px-3 py-1.5 bg-red-50 text-red-600 rounded-full text-sm hover:bg-red-100 flex items-center gap-1"
            >
              <X size={14} />
              Clear Filters
            </button>
          )}
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md flex items-center">
          <AlertCircle size={18} className="mr-2" />
          {error}
        </div>
      )}
      
      {/* Loading State */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600"></div>
          <p className="mt-2 text-gray-500">Loading tutorials...</p>
        </div>
      ) : filteredTutorials.length === 0 ? (
        <div className="bg-white p-8 rounded-md text-center">
          <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No tutorials found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || filters.domain !== 'all' || filters.technology !== 'all' || filters.difficulty !== 'all'
              ? "No tutorials match your search criteria."
              : "You haven't created any tutorials yet."}
          </p>
          <Link
            to="/admin/tutorials/new"
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
          >
            <Plus size={16} className="mr-1" />
            Create First Tutorial
          </Link>
        </div>
      ) : (
        /* Tutorials Grid */
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 divide-y">
            {filteredTutorials.map(tutorial => (
              <div key={tutorial._id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between">
                  <div className="flex items-start space-x-3">
                    {/* Icon/Image */}
                    <div className={`h-12 w-12 rounded-md flex items-center justify-center bg-gradient-to-br 
                      ${getTutorialTechnologyName(tutorial).toLowerCase().includes('html') ? 'from-orange-500 to-red-500' : 
                        getTutorialTechnologyName(tutorial).toLowerCase().includes('css') ? 'from-blue-500 to-cyan-500' : 
                        getTutorialTechnologyName(tutorial).toLowerCase().includes('javascript') ? 'from-yellow-400 to-yellow-600' : 
                        getTutorialTechnologyName(tutorial).toLowerCase().includes('react') ? 'from-cyan-500 to-blue-500' : 
                        'from-emerald-500 to-teal-600'}`}>
                      <BookOpen className="h-6 w-6 text-white" />
                    </div>
                    
                    {/* Title and Details */}
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="font-medium text-lg">{tutorial.title}</h3>
                        {tutorial.isPublished ? (
                          <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">Published</span>
                        ) : (
                          <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full">Draft</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">{tutorial.description}</p>
                      
                      {/* Tags & Metadata */}
                      <div className="flex flex-wrap items-center mt-2 text-xs text-gray-500 gap-3">
                        <span className="flex items-center">
                          <Layers size={12} className="mr-1" />
                          {getTutorialDomainName(tutorial)}
                        </span>
                        <span className="flex items-center">
                          <BookOpen size={12} className="mr-1" />
                          {getTutorialTechnologyName(tutorial)}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full ${
                          tutorial.difficulty === 'beginner' ? 'bg-green-50 text-green-700' :
                          tutorial.difficulty === 'intermediate' ? 'bg-blue-50 text-blue-700' :
                          tutorial.difficulty === 'advanced' ? 'bg-purple-50 text-purple-700' :
                          'bg-gray-50 text-gray-700'
                        }`}>
                          {tutorial.difficulty ? (tutorial.difficulty.charAt(0).toUpperCase() + tutorial.difficulty.slice(1)) : 'Unknown'}
                        </span>
                        <span className="flex items-center">
                          <FileText size={12} className="mr-1" />
                          {tutorial.lessons?.length || 0} lessons
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-start ml-4 space-x-2">
                    <Link
                      to={`/admin/lessons?tutorialId=${tutorial._id}`}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                      title="Manage Lessons"
                    >
                      <FileText size={16} />
                    </Link>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePublish(tutorial);
                      }}
                      className={`p-2 rounded ${
                        tutorial.isPublished 
                          ? 'text-green-600 hover:text-green-800 hover:bg-green-50' 
                          : 'text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50'
                      }`}
                      title={tutorial.isPublished ? 'Unpublish' : 'Publish'}
                    >
                      <Check size={16} />
                    </button>
                    <Link
                      to={`/admin/tutorials/edit/${tutorial._id}`}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </Link>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        confirmDelete(tutorial);
                      }}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete the tutorial "{tutorialToDelete.title}"? 
              This will also delete all associated lessons.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={deleteTutorial}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorialManagement;