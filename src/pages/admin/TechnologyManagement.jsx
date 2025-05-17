// src/pages/admin/TechnologyManagement.jsx
import { useState } from 'react';
import { Plus, Edit, Trash2, Search, Filter, ChevronDown, Book } from 'lucide-react';
import { Link } from 'react-router-dom';

const TechnologyManagement = () => {
  // Mock data - would come from API in a real app
  const [technologies, setTechnologies] = useState([
    { 
      id: 1, 
      name: 'HTML', 
      description: 'Hypertext Markup Language for web pages', 
      domain: 'Web Development',
      domainId: 1,
      lessonsCount: 4
    },
    { 
      id: 2, 
      name: 'CSS', 
      description: 'Cascading Style Sheets for styling web pages', 
      domain: 'Web Development',
      domainId: 1,
      lessonsCount: 3
    },
    { 
      id: 3, 
      name: 'JavaScript', 
      description: 'Programming language for the web', 
      domain: 'Web Development',
      domainId: 1,
      lessonsCount: 6
    },
    { 
      id: 4, 
      name: 'Python', 
      description: 'General purpose programming language', 
      domain: 'Programming',
      domainId: 2,
      lessonsCount: 5
    }
  ]);
  
  const [domains] = useState([
    { id: 1, name: 'Web Development' },
    { id: 2, name: 'Programming' },
    { id: 3, name: 'Data Structures' }
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [techToDelete, setTechToDelete] = useState(null);
  
  // Filter technologies based on search and domain filter
  const filteredTechnologies = technologies.filter(tech => {
    const matchesSearch = 
      tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDomain = selectedDomain === 'all' || tech.domainId === parseInt(selectedDomain);
    
    return matchesSearch && matchesDomain;
  });
  
  // Handle delete confirmation
  const confirmDelete = (tech) => {
    setTechToDelete(tech);
    setShowDeleteModal(true);
  };
  
  // Handle actual delete
  const deleteTechnology = () => {
    // Mock deletion - would call API in a real app
    setTechnologies(technologies.filter(t => t.id !== techToDelete.id));
    setShowDeleteModal(false);
    setTechToDelete(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Technology Management</h1>
        <Link 
          to="/admin/technologies/new" 
          className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 flex items-center gap-2"
        >
          <Plus size={18} />
          Add Technology
        </Link>
      </div>
      
      {/* Search and Filter Bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search technologies..."
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
            <span>Filter by Domain</span>
            <ChevronDown size={16} className={`transition-transform ${showFilterMenu ? 'rotate-180' : ''}`} />
          </button>
          
          {showFilterMenu && (
            <div className="absolute z-10 mt-1 w-56 bg-white border rounded-md shadow-lg">
              <div className="p-2">
                <div 
                  className={`px-3 py-2 rounded-md cursor-pointer ${selectedDomain === 'all' ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-gray-100'}`}
                  onClick={() => {
                    setSelectedDomain('all');
                    setShowFilterMenu(false);
                  }}
                >
                  All Domains
                </div>
                {domains.map(domain => (
                  <div 
                    key={domain.id}
                    className={`px-3 py-2 rounded-md cursor-pointer ${selectedDomain === domain.id.toString() ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-gray-100'}`}
                    onClick={() => {
                      setSelectedDomain(domain.id.toString());
                      setShowFilterMenu(false);
                    }}
                  >
                    {domain.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Technologies Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Technology
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Domain
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lessons
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTechnologies.length > 0 ? (
              filteredTechnologies.map(tech => (
                <tr key={tech.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                        <Book size={20} />
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{tech.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <div className="text-sm text-gray-500">{tech.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{tech.domain}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{tech.lessonsCount} lessons</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <Link 
                        to={`/admin/technologies/edit/${tech.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit size={18} />
                      </Link>
                      <button 
                        onClick={() => confirmDelete(tech)}
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
                  No technologies found. {searchQuery && 'Try a different search or filter.'}
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
              Are you sure you want to delete the technology "{techToDelete.name}"? 
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
                onClick={deleteTechnology}
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

export default TechnologyManagement;