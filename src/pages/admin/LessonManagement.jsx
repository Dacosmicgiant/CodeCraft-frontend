// src/pages/admin/LessonManagement.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Plus, Edit, Trash2, Search, Filter, ChevronDown, FileText, 
  ExternalLink, AlertCircle, X, Copy, Eye, Download, 
  CheckCircle, Clock, ArrowUp, ArrowDown, MoreVertical
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
  const [successMessage, setSuccessMessage] = useState('');
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
      const tutorialsList = response.data?.tutorials || response.data || [];
      setTutorials(tutorialsList);
    } catch (err) {
      console.error('Error fetching tutorials:', err);
      setError(err.message || 'Failed to load tutorials. Please try again.');
    }
  };
  
  const fetchLessons = async () => {
  try {
    setIsLoading(true);
    setError(null);
    
    console.log('🔍 Fetching lessons...');
    console.log('Selected tutorial:', selectedTutorial);
    
    // If a specific tutorial is selected, fetch lessons for that tutorial
    if (selectedTutorial) {
      console.log(`📚 Fetching lessons for tutorial: ${selectedTutorial}`);
      try {
        const response = await lessonAPI.getByTutorial(selectedTutorial);
        
        if (response.success) {
          setLessons(response.data || []);
          setPagination({ page: 1, pages: 1, total: response.total || 0 });
        } else {
          throw new Error(response.message || 'Failed to fetch lessons');
        }
      } catch (tutorialError) {
        console.error('❌ Tutorial lessons error:', tutorialError);
        
        // Handle specific tutorial errors
        if (tutorialError.response?.status === 404) {
          setError('Tutorial not found or has no lessons yet.');
        } else {
          setError('Failed to load lessons for this tutorial.');
        }
        setLessons([]);
        return;
      }
    } else {
      // Otherwise, fetch all lessons with pagination (admin only)
      console.log('📋 Fetching all lessons...');
      const params = {
        page: pagination.page,
        limit: 10
      };
      
      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }
      
      console.log('📤 Request params:', params);
      
      try {
        const response = await lessonAPI.getAll(params);
        console.log('📥 Response:', response);
        
        if (response.success) {
          setLessons(response.data || []);
          setPagination(response.pagination || { page: 1, pages: 1, total: 0 });
        } else {
          throw new Error(response.message || 'Failed to fetch lessons');
        }
      } catch (apiError) {
        console.error('❌ API Error details:', apiError);
        
        // Handle specific error cases
        if (apiError.response?.status === 404) {
          setError('Lessons endpoint not available. Please check your backend configuration.');
        } else if (apiError.response?.status === 401) {
          setError('You must be logged in to view lessons.');
        } else if (apiError.response?.status === 403) {
          setError('You do not have permission to view all lessons. Admin access required.');
        } else if (apiError.response?.status === 500) {
          // Handle server errors more gracefully
          const errorMsg = apiError.response.data?.error || apiError.message;
          if (errorMsg.includes('type')) {
            setError('Server error processing lesson data. This might be due to corrupted lesson content.');
          } else {
            setError(`Server error: ${errorMsg}`);
          }
        } else if (apiError.code === 'ECONNREFUSED') {
          setError('Cannot connect to the server. Please ensure the backend is running.');
        } else {
          setError(apiError.response?.data?.message || apiError.message || 'Failed to load lessons');
        }
        
        setLessons([]);
        return;
      }
    }
  } catch (err) {
    console.error('❌ Unexpected error fetching lessons:', err);
    setError('An unexpected error occurred while loading lessons.');
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
      const response = await lessonAPI.delete(lessonToDelete._id);
      
      if (response.success) {
        setSuccessMessage(response.message || 'Lesson deleted successfully');
        // Refresh lessons
        await fetchLessons();
        setShowDeleteModal(false);
        setLessonToDelete(null);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        throw new Error(response.message || 'Failed to delete lesson');
      }
    } catch (err) {
      console.error('Error deleting lesson:', err);
      setError(err.message || 'Failed to delete lesson. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle duplicate lesson
  const duplicateLesson = async (lesson) => {
    try {
      setIsLoading(true);
      const response = await lessonAPI.duplicate(lesson._id);
      
      if (response.success) {
        setSuccessMessage(response.message || 'Lesson duplicated successfully');
        // Refresh lessons
        await fetchLessons();
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        throw new Error(response.message || 'Failed to duplicate lesson');
      }
    } catch (err) {
      console.error('Error duplicating lesson:', err);
      setError(err.message || 'Failed to duplicate lesson. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle export lesson
  const exportLesson = async (lesson, format) => {
    try {
      const content = await lessonAPI.export(lesson._id, format);
      
      if (content.success) {
        const blob = new Blob([
          format === 'json' 
            ? JSON.stringify(content.data, null, 2) 
            : content.data
        ], {
          type: format === 'json' ? 'application/json' : 
               format === 'html' ? 'text/html' : 'text/plain'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${lesson.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        setSuccessMessage(`Lesson exported as ${format.toUpperCase()}`);
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        throw new Error(content.message || 'Failed to export lesson');
      }
    } catch (err) {
      console.error('Error exporting lesson:', err);
      setError(err.message || 'Failed to export lesson. Please try again.');
    }
  };

  // Handle toggle publish status
  const togglePublishStatus = async (lesson) => {
    try {
      setIsLoading(true);
      const response = await lessonAPI.togglePublish(lesson._id, !lesson.isPublished);
      
      if (response.success) {
        setSuccessMessage(response.message || `Lesson ${lesson.isPublished ? 'unpublished' : 'published'} successfully`);
        // Refresh lessons
        await fetchLessons();
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        throw new Error(response.message || 'Failed to update lesson status');
      }
    } catch (err) {
      console.error('Error toggling publish status:', err);
      setError(err.message || 'Failed to update lesson status. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle move lesson up/down
  const moveLessonOrder = async (lesson, direction) => {
    if (!selectedTutorial) return;
    
    try {
      setIsLoading(true);
      const currentIndex = lessons.findIndex(l => l._id === lesson._id);
      
      if (direction === 'up' && currentIndex > 0) {
        const newOrder = lessons[currentIndex - 1].order;
        const lessonOrders = [
          { lessonId: lesson._id, order: newOrder },
          { lessonId: lessons[currentIndex - 1]._id, order: lesson.order }
        ];
        
        const response = await lessonAPI.reorder(selectedTutorial, lessonOrders);
        if (response.success) {
          await fetchLessons();
          setSuccessMessage('Lesson moved up successfully');
          setTimeout(() => setSuccessMessage(''), 3000);
        }
      } else if (direction === 'down' && currentIndex < lessons.length - 1) {
        const newOrder = lessons[currentIndex + 1].order;
        const lessonOrders = [
          { lessonId: lesson._id, order: newOrder },
          { lessonId: lessons[currentIndex + 1]._id, order: lesson.order }
        ];
        
        const response = await lessonAPI.reorder(selectedTutorial, lessonOrders);
        if (response.success) {
          await fetchLessons();
          setSuccessMessage('Lesson moved down successfully');
          setTimeout(() => setSuccessMessage(''), 3000);
        }
      }
    } catch (err) {
      console.error('Error moving lesson:', err);
      setError(err.message || 'Failed to reorder lesson. Please try again.');
    } finally {
      setIsLoading(false);
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

  // Clear messages
  const clearMessages = () => {
    setError(null);
    setSuccessMessage('');
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
      
      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-md flex items-center justify-between">
          <div className="flex items-center">
            <CheckCircle size={18} className="mr-2" />
            {successMessage}
          </div>
          <button onClick={clearMessages} className="text-green-500 hover:text-green-700">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md flex items-center justify-between">
          <div className="flex items-center">
            <AlertCircle size={18} className="mr-2" />
            {error}
          </div>
          <button onClick={clearMessages} className="text-red-500 hover:text-red-700">
            <X size={16} />
          </button>
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
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      {searchQuery 
        ? "No lessons match your search" 
        : selectedTutorial
          ? "No lessons in this tutorial yet"
          : "No lessons found"}
    </h3>
    <p className="text-gray-500 mb-4">
      {searchQuery 
        ? `No lessons found for "${searchQuery}". Try adjusting your search terms.`
        : selectedTutorial
          ? "This tutorial doesn't have any lessons yet. Create the first lesson to get started."
          : "No lessons have been created yet across all tutorials."}
    </p>
    {selectedTutorial && (
      <Link
        to={`/admin/lessons/new?tutorialId=${selectedTutorial}`}
        className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
      >
        <Plus size={16} className="mr-1" />
        Create First Lesson
      </Link>
    )}
    {!selectedTutorial && (
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> Select a tutorial from the filter above to view its lessons, or create a new tutorial first.
        </p>
      </div>
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
              {lessons.map((lesson, index) => (
                <tr key={lesson._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <span>#{lesson.order}</span>
                      {selectedTutorial && (
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => moveLessonOrder(lesson, 'up')}
                            disabled={index === 0 || isLoading}
                            className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                            title="Move up"
                          >
                            <ArrowUp size={12} />
                          </button>
                          <button
                            onClick={() => moveLessonOrder(lesson, 'down')}
                            disabled={index === lessons.length - 1 || isLoading}
                            className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                            title="Move down"
                          >
                            <ArrowDown size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        <FileText size={20} />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{lesson.title}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-2">
                          <Clock size={12} />
                          <span>Created: {new Date(lesson.createdAt).toLocaleDateString()}</span>
                          {lesson.updatedAt !== lesson.createdAt && (
                            <>
                              <span>•</span>
                              <span>Updated: {new Date(lesson.updatedAt).toLocaleDateString()}</span>
                            </>
                          )}
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
                    <button
                      onClick={() => togglePublishStatus(lesson)}
                      disabled={isLoading}
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer transition-colors ${
                        lesson.isPublished 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                      }`}
                    >
                      {lesson.isPublished ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-1">
                      {/* Preview */}
                      <Link
                        to={`/lessons/${lesson._id}`}
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
              Are you sure you want to delete the lesson "{lessonToDelete.title}"? This action cannot be undone.
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