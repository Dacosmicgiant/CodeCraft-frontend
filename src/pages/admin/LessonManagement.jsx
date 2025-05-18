// src/pages/admin/LessonManagement.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, Filter, ChevronDown, FileText, ExternalLink, AlertCircle, X } from 'lucide-react';
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
  
  // Load lessons when a tutorial is selected
  useEffect(() => {
    if (selectedTutorial) {
      fetchLessons(selectedTutorial);
    } else {
      setLessons([]);
    }
  }, [selectedTutorial]);
  
  const fetchTutorials = async () => {
    try {
      setIsLoading(true);
      const response = await tutorialAPI.getAll();
      setTutorials(response.data.tutorials || response.data); // Handle different response formats
    } catch (err) {
      console.error('Error fetching tutorials:', err);
      setError('Failed to load tutorials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchLessons = async (tutorialId) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await lessonAPI.getByTutorial(tutorialId);
      setLessons(response.data);
    } catch (err) {
      console.error('Error fetching lessons:', err);
      setError('Failed to load lessons. Please try again.');
      setLessons([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter lessons based on search
  const filteredLessons = lessons.filter(lesson => {
    if (!searchQuery) return true;
    
    return lesson.title.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
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
      
      // Remove from local state
      setLessons(lessons.filter(l => l._id !== lessonToDelete._id));
      setShowDeleteModal(false);
      setLessonToDelete(null);
    } catch (err) {
      console.error('Error deleting lesson:', err);
      alert('Failed to delete lesson. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
            <span>{selectedTutorial ? (tutorials.find(t => t._id === selectedTutorial)?.title || 'Select Tutorial') : 'Select Tutorial'}</span>
            <ChevronDown size={16} className={`ml-auto sm:ml-2 transition-transform ${showFilterMenu ? 'rotate-180' : ''}`} />
          </button>
          
          {showFilterMenu && (
            <div className="absolute z-10 mt-1 w-full sm:w-80 bg-white border rounded-md shadow-lg">
              <div className="p-2 max-h-60 overflow-y-auto">
                {tutorials.length > 0 ? (
                  tutorials.map(tutorial => (
                    <div 
                      key={tutorial._id}
                      className={`px-3 py-2 rounded-md cursor-pointer ${selectedTutorial === tutorial._id ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-gray-100'}`}
                      onClick={() => {
                        setSelectedTutorial(tutorial._id);
                        setShowFilterMenu(false);
                        
                        // Update URL with selected tutorial ID without page reload
                        const newUrl = new URL(window.location);
                        newUrl.searchParams.set('tutorialId', tutorial._id);
                        window.history.pushState({}, '', newUrl);
                      }}
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
            disabled={!selectedTutorial}
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
      
      {/* Tutorial Selection Prompt */}
      {!selectedTutorial && !isLoading && (
        <div className="bg-yellow-50 text-yellow-800 p-4 rounded-md mb-6">
          <p className="font-medium">Please select a tutorial to view or add lessons.</p>
        </div>
      )}
      
      {/* Loading State */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600"></div>
          <p className="mt-2 text-gray-500">Loading...</p>
        </div>
      ) : selectedTutorial && filteredLessons.length === 0 ? (
        <div className="bg-white p-8 rounded-md text-center">
          <FileText size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No lessons found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery 
              ? "No lessons match your search criteria." 
              : "This tutorial doesn't have any lessons yet."}
          </p>
          <Link
            to={`/admin/lessons/new?tutorialId=${selectedTutorial}`}
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
          >
            <Plus size={16} className="mr-1" />
            Add First Lesson
          </Link>
        </div>
      ) : (
        /* Lessons Table */
        selectedTutorial && (
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Content Blocks
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
                {filteredLessons.map(lesson => (
                  <tr key={lesson._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {lesson.order}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                          <FileText size={20} />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{lesson.title}</div>
                          <div className="text-xs text-gray-500">{lesson.duration} min</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="text-sm text-gray-500">
                        {lesson.content?.length || 0} content blocks
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
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/tutorials/${selectedTutorial}/${lesson.slug || lesson._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-gray-900"
                          title="Preview"
                        >
                          <ExternalLink size={18} />
                        </Link>
                        <Link 
                          to={`/admin/lessons/edit/${lesson._id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </Link>
                        <button 
                          onClick={() => confirmDelete(lesson)}
                          className="text-red-600 hover:text-red-900"
                          disabled={isLoading}
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
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