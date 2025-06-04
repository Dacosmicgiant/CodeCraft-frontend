// src/pages/admin/LessonManagement.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Plus, Edit, Trash2, Search, Filter, ChevronDown, FileText, 
  ExternalLink, AlertCircle, X, Copy, Eye, Download 
} from 'lucide-react';
import { lessonAPI, tutorialAPI } from '../../services/api';

const LessonManagement = () => {
  const [lessons, setLessons] = useState([]);
  const [tutorials, setTutorials] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTutorial, setSelectedTutorial] = useState('');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0
  });
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get tutorialId from URL query params if provided
  const searchParams = new URLSearchParams(location.search);
  const tutorialIdFromQuery = searchParams.get('tutorialId');
  
  // Load tutorials when component mounts
  useEffect(() => {
    fetchTutorials();
    
    // If a tutorialId is provided in the URL, select it
    if (tutorialIdFromQuery) {
      setSelectedTutorial(tutorialIdFromQuery);
    }
  }, [tutorialIdFromQuery]);
  
  // Load lessons when filters change
  useEffect(() => {
    fetchLessons();
  }, [selectedTutorial, searchQuery, pagination.page]);
  
  const fetchTutorials = async () => {
    try {
      const response = await tutorialAPI.getAll();
      setTutorials(response.data.tutorials || response.data || []);
    } catch (err) {
      console.error('Error fetching tutorials:', err);
      setError('Failed to load tutorials. Please try again.');
    }
  };
  
  const fetchLessons = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // If a specific tutorial is selected, fetch lessons for that tutorial
      if (selectedTutorial) {
        const response = await lessonAPI.getByTutorial(selectedTutorial);
        setLessons(response.data || response || []);
        setPagination({ page: 1, pages: 1, total: response.length || 0 });
      } else {
        // Otherwise, fetch all lessons with pagination
        const params = {
          page: pagination.page,
          limit: 10
        };
        
        if (searchQuery.trim()) {
          params.search = searchQuery.trim();
        }
        
        const response = await lessonAPI.getAll(params);
        setLessons(response.lessons || []);
        setPagination(response.pagination || { page: 1, pages: 1, total: 0 });
      }
    } catch (err) {
      console.error('Error fetching lessons:', err);
      setError('Failed to load lessons. Please try again.');
      setLessons([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle tutorial filter change
  const handleTutorialChange = (tutorialId) => {
    setSelectedTutorial(tutorialId);
    setShowFilterMenu(false);
    setPagination({ ...pagination, page: 1 });
    
    // Update URL
    const newUrl = new URL(window.location);
    if (tutorialId) {
      newUrl.searchParams.set('tutorialId', tutorialId);
    } else {
      newUrl.searchParams.delete('tutorialId');
    }
    window.history.pushState({}, '', newUrl);
  };
  
  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPagination({ ...pagination, page: 1 });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);
  
  // Handle delete confirmation
  const confirmDelete = (lesson) => {
    setLessonToDelete(lesson);
    setShowDeleteModal(true);
  };
  
  // Handle actual delete
  const deleteLesson = async () => {
    try {
      setIsLoading(true);
      await lessonAPI.delete(lessonToDelete._id);
      
      // Refresh lessons
      await fetchLessons();
      setShowDeleteModal(false);
      setLessonToDelete(null);
    } catch (err) {
      console.error('Error deleting lesson:', err);
      alert('Failed to delete lesson. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle duplicate lesson
  const duplicateLesson = async (lesson) => {
    try {
      setIsLoading(true);
      await lessonAPI.duplicate(lesson._id);
      
      // Refresh lessons
      await fetchLessons();
    } catch (err) {
      console.error('Error duplicating lesson:', err);
      alert('Failed to duplicate lesson. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle export lesson
  const exportLesson = async (lesson, format) => {
    try {
      const content = await lessonAPI.export(lesson._id, format);
      
      const blob = new Blob([format === 'json' ? JSON.stringify(content, null, 2) : content], {
        type: format === 'json' ? 'application/json' : format === 'html' ? 'text/html' : 'text/plain'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${lesson.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting lesson:', err);
      alert('Failed to export lesson. Please try again.');
    }
  };
  
  // Handle page change
  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
  };
  
  // Get tutorial name by ID
  const getTutorialName = (tutorialId) => {
    const tutorial = tutorials.find(t => t._id === tutorialId);
    return tutorial ? tutorial.title : 'Unknown Tutorial';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Lesson Management</h1>
        {selectedTutorial ? (
          <Link 
            to={`/admin/lessons/new?tutorialId=${selectedTutorial}`} 
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 flex items-center gap-2"
          >
            <Plus size={18} />
            Add Lesson
          </Link>
        ) : (
          <button
            className="px-4 py-2 bg-gray-200 text-gray-500 rounded-md cursor-not-allowed"
            title="Select a tutorial first"
            disabled
          >
            <Plus size={18} className="inline mr-1" />
            Add Lesson
          </button>
        )}
      </div>
      
      {/* Tutorial Selection and Search Bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative">
          <button 
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            className="px-4 py-2 border rounded-md bg-white flex items-center gap-2 w-full sm:w-auto"
          >
            <Filter size={18} />
            <span>
              {selectedTutorial 
                ? getTutorialName(selectedTutorial)
                : 'All Tutorials'
              }
            </span>
            <ChevronDown size={16} className={`ml-auto sm:ml-2 transition-transform ${showFilterMenu ? 'rotate-180' : ''}`} />
          </button>
          
          {showFilterMenu && (
            <div className="absolute z-10 mt-1 w-full sm:w-80 bg-white border rounded-md shadow-lg">
              <div className="p-2 max-h-60 overflow-y-auto">
                <div 
                  className={`px-3 py-2 rounded-md cursor-pointer ${!selectedTutorial ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-gray-100'}`}
                  onClick={() => handleTutorialChange('')}
                >
                  All Tutorials
                </div>
                {tutorials.length > 0 ? (
                  tutorials.map(tutorial => (
                    <div 
                      key={tutorial._id}
                      className={`px-3 py-2 rounded-md cursor-pointer ${selectedTutorial === tutorial._id ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-gray-100'}`}
                      onClick={() => handleTutorialChange(tutorial._id)}
                    >
                      {tutorial.title}
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-2 text-gray-500">No tutorials available</div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search lessons..."
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
          <p className="mt-2 text-gray-500">Loading lessons...</p>
        </div>
      ) : lessons.length === 0 ? (
        <div className="bg-white p-8 rounded-md text-center">
          <FileText size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No lessons found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery 
              ? "No lessons match your search criteria." 
              : selectedTutorial
                ? "This tutorial doesn't have any lessons yet."
                : "No lessons available."}
          </p>
          {selectedTutorial && (
            <Link
              to={`/admin/lessons/new?tutorialId=${selectedTutorial}`}
              className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
            >
              <Plus size={16} className="mr-1" />
              Add First Lesson
            </Link>
          )}
        </div>
      ) : (
        /* Lessons Table */
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lesson Title
                </th>
                {!selectedTutorial && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Tutorial
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {lessons.map(lesson => (
                <tr key={lesson._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    #{lesson.order}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        <FileText size={20} />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{lesson.title}</div>
                        <div className="text-xs text-gray-500">
                          Created: {new Date(lesson.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  {!selectedTutorial && (
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="text-sm text-gray-500">
                        {lesson.tutorial?.title || getTutorialName(lesson.tutorial) || 'Unknown'}
                      </div>
                    </td>
                  )}
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className="text-sm text-gray-500">
                      {lesson.duration} min
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {lesson.isPublished ? (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Published
                      </span>
                    ) : (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-1">
                      {/* Preview */}
                      <Link
                        to={`/tutorials/${lesson.tutorial?._id || lesson.tutorial}/${lesson.slug || lesson._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                        title="Preview"
                      >
                        <Eye size={16} />
                      </Link>
                      
                      {/* Edit */}
                      <Link 
                        to={`/admin/lessons/edit/${lesson._id}`}
                        className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </Link>
                      
                      {/* Duplicate */}
                      <button 
                        onClick={() => duplicateLesson(lesson)}
                        className="p-1 text-green-600 hover:text-green-900 hover:bg-green-50 rounded"
                        disabled={isLoading}
                        title="Duplicate"
                      >
                        <Copy size={16} />
                      </button>
                      
                      {/* Export dropdown */}
                      <div className="relative group">
                        <button className="p-1 text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded">
                          <Download size={16} />
                        </button>
                        <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg z-10 hidden group-hover:block">
                          <div className="py-1">
                            <button 
                              onClick={() => exportLesson(lesson, 'json')}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Export JSON
                            </button>
                            <button 
                              onClick={() => exportLesson(lesson, 'html')}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Export HTML
                            </button>
                            <button 
                              onClick={() => exportLesson(lesson, 'text')}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Export Text
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Delete */}
                      <button 
                        onClick={() => confirmDelete(lesson)}
                        className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
                        disabled={isLoading}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Pagination */}
          {!selectedTutorial && pagination.pages > 1 && (
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing page {pagination.page} of {pagination.pages} ({pagination.total} total)
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.pages}
                    className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete the lesson "{lessonToDelete.title}"?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={deleteLesson}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonManagement;