// src/pages/admin/TechnologyManagement.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, Filter, ChevronDown, Book, AlertCircle, X } from 'lucide-react';
import { technologyAPI, domainAPI } from '../../services/api';

const TechnologyManagement = () => {
  // State for technologies and domains
  const [technologies, setTechnologies] = useState([]);
  const [domains, setDomains] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [techToDelete, setTechToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Load technologies and domains when component mounts
  useEffect(() => {
    fetchTechnologies();
    fetchDomains();
  }, []);
  
  // Fetch technologies (with optional domain filter)
  const fetchTechnologies = async (domainId = null) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params = {};
      if (domainId && domainId !== 'all') {
        params.domain = domainId;
      }
      
      const response = await technologyAPI.getAll(params);
      setTechnologies(response.data);
    } catch (err) {
      console.error('Error fetching technologies:', err);
      setError('Failed to load technologies. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch domains for filter dropdown
  const fetchDomains = async () => {
    try {
      const response = await domainAPI.getAll();
      setDomains(response.data);
    } catch (err) {
      console.error('Error fetching domains:', err);
      // Non-blocking error - we can still show technologies
    }
  };
  
  // Handle domain filter change
  const handleDomainChange = (domainId) => {
    setSelectedDomain(domainId);
    fetchTechnologies(domainId);
    setShowFilterMenu(false);
  };
  
  // Filter technologies based on search
  const filteredTechnologies = technologies.filter(tech => {
    const matchesSearch = 
      tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });
  
  // Handle delete confirmation
  const confirmDelete = (tech) => {
    setTechToDelete(tech);
    setShowDeleteModal(true);
  };
  
  // Handle actual delete
  const deleteTechnology = async () => {
    try {
      setIsLoading(true);
      await technologyAPI.delete(techToDelete._id);
      
      // Remove from local state
      setTechnologies(technologies.filter(t => t._id !== techToDelete._id));
      setShowDeleteModal(false);
      setTechToDelete(null);
    } catch (err) {
      console.error('Error deleting technology:', err);
      
      if (err.response?.status === 400) {
        alert(err.response.data.message || 'Cannot delete technology. It has associated tutorials.');
      } else {
        alert('Failed to delete technology. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
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
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
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
                  onClick={() => handleDomainChange('all')}
                >
                  All Domains
                </div>
                {domains.map(domain => (
                  <div 
                    key={domain._id}
                    className={`px-3 py-2 rounded-md cursor-pointer ${selectedDomain === domain._id ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-gray-100'}`}
                    onClick={() => handleDomainChange(domain._id)}
                  >
                    {domain.name}
                  </div>
                ))}
              </div>
            </div>
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
      {isLoading && technologies.length === 0 ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600"></div>
          <p className="mt-2 text-gray-500">Loading technologies...</p>
        </div>
      ) : (
        /* Technologies Table */
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
                  Tutorials
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTechnologies.length > 0 ? (
                filteredTechnologies.map(tech => (
                  <tr key={tech._id} className="hover:bg-gray-50">
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
                      <div className="text-sm text-gray-500">
                        {tech.domain?.name || 'Unknown Domain'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {tech.lessonsCount || tech.tutorials?.length || 0} tutorials
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Link 
                          to={`/admin/technologies/edit/${tech._id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit size={18} />
                        </Link>
                        <button 
                          onClick={() => confirmDelete(tech)}
                          className="text-red-600 hover:text-red-900"
                          disabled={isLoading}
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
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete the technology "{techToDelete.name}"? 
              This will also delete all associated tutorials and lessons.
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
                onClick={deleteTechnology}
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

export default TechnologyManagement;