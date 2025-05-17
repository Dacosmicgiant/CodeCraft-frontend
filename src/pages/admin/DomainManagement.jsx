// src/pages/admin/DomainManagement.jsx
import { useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const DomainManagement = () => {
  // Mock data - would come from API in a real app
  const [domains, setDomains] = useState([
    { id: 1, name: 'Web Development', description: 'Frontend and backend web development topics', techCount: 4 },
    { id: 2, name: 'Programming', description: 'Programming languages and concepts', techCount: 3 },
    { id: 3, name: 'Data Structures', description: 'Algorithms and data structures', techCount: 3 }
  ]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [domainToDelete, setDomainToDelete] = useState(null);
  
  // Filter domains based on search
  const filteredDomains = domains.filter(domain => 
    domain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    domain.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Handle delete confirmation
  const confirmDelete = (domain) => {
    setDomainToDelete(domain);
    setShowDeleteModal(true);
  };
  
  // Handle actual delete
  const deleteDomain = () => {
    // Mock deletion - would call API in a real app
    setDomains(domains.filter(d => d.id !== domainToDelete.id));
    setShowDeleteModal(false);
    setDomainToDelete(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Domain Management</h1>
        <Link 
          to="/admin/domains/new" 
          className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 flex items-center gap-2"
        >
          <Plus size={18} />
          Add Domain
        </Link>
      </div>
      
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search domains..."
            className="w-full py-2 pl-10 pr-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>
      
      {/* Domains Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Domain Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Technologies
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDomains.length > 0 ? (
              filteredDomains.map(domain => (
                <tr key={domain.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{domain.name}</div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <div className="text-sm text-gray-500">{domain.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{domain.techCount} technologies</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <Link 
                        to={`/admin/domains/edit/${domain.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit size={18} />
                      </Link>
                      <button 
                        onClick={() => confirmDelete(domain)}
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
                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                  No domains found. {searchQuery && 'Try a different search.'}
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
              Are you sure you want to delete the domain "{domainToDelete.name}"? 
              This will also delete all associated technologies and lessons.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={deleteDomain}
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

export default DomainManagement;