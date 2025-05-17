// src/pages/admin/LessonManagement.jsx
import { useState } from 'react';
import { Plus, Edit, Trash2, Search, Filter, ChevronDown, FileText, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const LessonManagement = () => {
  // Mock data - would come from API in a real app
  const [lessons, setLessons] = useState([
    { 
      id: 1, 
      title: 'HTML Introduction', 
      description: 'Introduction to HTML basics', 
      technology: 'HTML',
      technologyId: 1,
      domain: 'Web Development',
      lastUpdated: '2 days ago'
    },
    { 
      id: 2, 
      title: 'HTML Tags and Elements', 
      description: 'Learn about HTML tags and elements', 
      technology: 'HTML',
      technologyId: 1,
      domain: 'Web Development',
      lastUpdated: '5 days ago'
    },
    { 
      id: 3, 
      title: 'CSS Selectors', 
      description: 'Understanding CSS selectors', 
      technology: 'CSS',
      technologyId: 2,
      domain: 'Web Development',
      lastUpdated: '1 week ago'
    },
    { 
      id: 4, 
      title: 'JavaScript Variables', 
      description: 'Working with variables in JavaScript', 
      technology: 'JavaScript',
      technologyId: 3,
      domain: 'Web Development',
      lastUpdated: '2 weeks ago'
    }
  ]);
  
  const [technologies, setTechnologies] = useState([
    { id: 1, name: 'HTML', domainId: 1 },
    { id: 2, name: 'CSS', domainId: 1 },
    { id: 3, name: 'JavaScript', domainId: 1 },
    { id: 4, name: 'Python', domainId: 2 }
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTech, setSelectedTech] = useState('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState(null);
  
  // Filter lessons based on search and technology filter
  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = 
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTech = selectedTech === 'all' || lesson.technologyId === parseInt(selectedTech);
    
    return matchesSearch && matchesTech;
  });
  
  // Handle delete confirmation
  const confirmDelete = (lesson) => {
    setLessonToDelete(lesson);
    setShowDeleteModal(true);
  };
  
  // Handle actual delete
  const deleteLesson = () => {
    // Mock deletion - would call API in a real app
    setLessons(lessons.filter(l => l.id !== lessonToDelete.id));
    setShowDeleteModal(false);
    setLessonToDelete(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Lesson Management</h1>
        <Link 
          to="/admin/lessons/new" 
          className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 flex items-center gap-2"
        >
          <Plus size={18} />
          Add Lesson
        </Link>
      </div>
      
      {/* Search and Filter Bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search lessons..."
            className="w-full py-2 pl-10 pr-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            className="px-4 py-2 border rounded-md bg-white flex items-center gap-2"
          >
            <Filter size={18} />
            <span>Filter by Technology</span>
            <ChevronDown size={16} className={`transition-transform ${showFilterMenu ? 'rotate-180' : ''}`} />
          </button>
          
          {showFilterMenu && (
            <div className="absolute z-10 mt-1 w-56 bg-white border rounded-md shadow-lg">
              <div className="p-2">
                <div 
                  className={`px-3 py-2 rounded-md cursor-pointer ${selectedTech === 'all' ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-gray-100'}`}
                  onClick={() => {
                    setSelectedTech('all');
                    setShowFilterMenu(false);
                  }}
                >
                  All Technologies
                </div>
                {technologies.map(tech => (
                  <div 
                    key={tech.id}
                    className={`px-3 py-2 rounded-md cursor-pointer ${selectedTech === tech.id.toString() ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-gray-100'}`}
                    onClick={() => {
                      setSelectedTech(tech.id.toString());
                      setShowFilterMenu(false);
                    }}
                  >
                    {tech.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Lessons Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lesson Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Technology
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                Last Updated
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredLessons.length > 0 ? (
              filteredLessons.map(lesson => (
                <tr key={lesson.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        <FileText size={20} />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{lesson.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className="text-sm text-gray-500 line-clamp-2">{lesson.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      {lesson.technology}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                    <div className="text-sm text-gray-500">{lesson.lastUpdated}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <a 
                        href={`/tutorials/${lesson.technology.toLowerCase()}#lesson-${lesson.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <ExternalLink size={18} />
                      </a>
                      <Link 
                        to={`/admin/lessons/edit/${lesson.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit size={18} />
                      </Link>
                      <button 
                        onClick={() => confirmDelete(lesson)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  No lessons found. {searchQuery && 'Try a different search or filter.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
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
              >
                Cancel
              </button>
              <button
                onClick={deleteLesson}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
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

export default LessonManagement;