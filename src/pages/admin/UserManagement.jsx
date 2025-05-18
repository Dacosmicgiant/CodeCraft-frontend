import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  User, 
  Edit, 
  Shield, 
  AlertCircle, 
  X, 
  Check,
  UserX,
  UserCheck
} from 'lucide-react';
import axios from 'axios';

// Mock API call functions (would use actual API in production)
const userAPI = {
  getUsers: async (params) => {
    // In a real app, this would be an API call
    // For the demo, return some mock data
    return {
      data: {
        users: [
          {
            _id: '1',
            username: 'john_doe',
            email: 'john@example.com',
            role: 'user',
            createdAt: '2023-01-15T10:30:00Z',
            lastLogin: '2023-05-10T14:45:00Z',
            active: true
          },
          {
            _id: '2',
            username: 'jane_smith',
            email: 'jane@example.com',
            role: 'admin',
            createdAt: '2023-02-20T09:15:00Z',
            lastLogin: '2023-05-11T11:20:00Z',
            active: true
          },
          {
            _id: '3',
            username: 'alex_wilson',
            email: 'alex@example.com',
            role: 'user',
            createdAt: '2023-03-05T16:45:00Z',
            lastLogin: '2023-05-09T08:30:00Z',
            active: true
          },
          {
            _id: '4',
            username: 'sarah_johnson',
            email: 'sarah@example.com',
            role: 'user',
            createdAt: '2023-03-10T11:30:00Z',
            lastLogin: '2023-05-08T17:15:00Z',
            active: false
          },
          {
            _id: '5',
            username: 'mike_brown',
            email: 'mike@example.com',
            role: 'user',
            createdAt: '2023-04-02T14:20:00Z',
            lastLogin: null,
            active: true
          }
        ]
      }
    };
  },
  
  updateUser: async (id, data) => {
    // In a real app, this would update the user
    console.log(`Updating user ${id} with data:`, data);
    return { data: { ...data, _id: id } };
  }
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    role: 'all',
    status: 'all'
  });
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await userAPI.getUsers();
      setUsers(response.data.users);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
  
  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    
    setShowFilterMenu(false);
    setActiveFilter(null);
  };
  
  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    // Apply search filter
    const matchesSearch = !searchQuery || 
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply role filter
    const matchesRole = filters.role === 'all' || user.role === filters.role;
    
    // Apply status filter
    const matchesStatus = filters.status === 'all' || 
      (filters.status === 'active' && user.active) ||
      (filters.status === 'inactive' && !user.active);
    
    return matchesSearch && matchesRole && matchesStatus;
  });
  
  // Open user edit modal
  const openUserModal = (user) => {
    setSelectedUser({ ...user });
    setShowUserModal(true);
  };
  
  // Update user role or status
  const updateUser = async (user, changes) => {
    try {
      const updatedUser = { ...user, ...changes };
      await userAPI.updateUser(user._id, updatedUser);
      
      // Update local state
      setUsers(users.map(u => 
        u._id === user._id ? updatedUser : u
      ));
    } catch (err) {
      console.error('Error updating user:', err);
      alert('Failed to update user. Please try again.');
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
      </div>
      
      {/* Search and Filter Bar */}
      <div className="mb-6 space-y-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search users by name or email..."
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
          {/* Role Filter */}
          <div className="relative">
            <button 
              onClick={() => toggleFilterMenu('role')}
              className={`px-3 py-1.5 border rounded-full flex items-center gap-1 text-sm ${
                filters.role !== 'all' 
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Shield size={14} />
              <span>
                {filters.role === 'all' ? 'All Roles' : 
                 filters.role === 'admin' ? 'Admin' : 'User'}
              </span>
              <ChevronDown size={14} className={`transition-transform ${activeFilter === 'role' && showFilterMenu ? 'rotate-180' : ''}`} />
            </button>
            
            {activeFilter === 'role' && showFilterMenu && (
              <div className="absolute z-20 mt-1 w-40 bg-white border rounded-md shadow-lg">
                <div className="p-2">
                  <div 
                    className={`px-3 py-2 rounded-md cursor-pointer ${filters.role === 'all' ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-gray-100'}`}
                    onClick={() => handleFilterChange('role', 'all')}
                  >
                    All Roles
                  </div>
                  <div 
                    className={`px-3 py-2 rounded-md cursor-pointer ${filters.role === 'admin' ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-gray-100'}`}
                    onClick={() => handleFilterChange('role', 'admin')}
                  >
                    Admin
                  </div>
                  <div 
                    className={`px-3 py-2 rounded-md cursor-pointer ${filters.role === 'user' ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-gray-100'}`}
                    onClick={() => handleFilterChange('role', 'user')}
                  >
                    User
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Status Filter */}
          <div className="relative">
            <button 
              onClick={() => toggleFilterMenu('status')}
              className={`px-3 py-1.5 border rounded-full flex items-center gap-1 text-sm ${
                filters.status !== 'all' 
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <User size={14} />
              <span>
                {filters.status === 'all' ? 'All Status' : 
                 filters.status === 'active' ? 'Active' : 'Inactive'}
              </span>
              <ChevronDown size={14} className={`transition-transform ${activeFilter === 'status' && showFilterMenu ? 'rotate-180' : ''}`} />
            </button>
            
            {activeFilter === 'status' && showFilterMenu && (
              <div className="absolute z-20 mt-1 w-40 bg-white border rounded-md shadow-lg">
                <div className="p-2">
                  <div 
                    className={`px-3 py-2 rounded-md cursor-pointer ${filters.status === 'all' ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-gray-100'}`}
                    onClick={() => handleFilterChange('status', 'all')}
                  >
                    All Status
                  </div>
                  <div 
                    className={`px-3 py-2 rounded-md cursor-pointer ${filters.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-gray-100'}`}
                    onClick={() => handleFilterChange('status', 'active')}
                  >
                    Active
                  </div>
                  <div 
                    className={`px-3 py-2 rounded-md cursor-pointer ${filters.status === 'inactive' ? 'bg-emerald-100 text-emerald-800' : 'hover:bg-gray-100'}`}
                    onClick={() => handleFilterChange('status', 'inactive')}
                  >
                    Inactive
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Reset Filters Button - only show if filters are active */}
          {(filters.role !== 'all' || filters.status !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setFilters({ role: 'all', status: 'all' });
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
          <p className="mt-2 text-gray-500">Loading users...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white p-8 rounded-md text-center">
          <User size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No users found</h3>
          <p className="text-gray-500 mb-4">
            No users match your search or filter criteria.
          </p>
        </div>
      ) : (
        /* Users Table */
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Last Login
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
              {filteredUsers.map(user => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-800 font-medium">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{user.username}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                    <div className="text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                    <div className="text-sm text-gray-500">
                      {user.lastLogin 
                        ? new Date(user.lastLogin).toLocaleDateString() 
                        : 'Never'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center gap-2">
                      <button
                        onClick={() => openUserModal(user)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit size={18} />
                      </button>
                      
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => updateUser(user, { role: 'admin' })}
                          className="text-purple-600 hover:text-purple-800"
                          title="Make Admin"
                        >
                          <Shield size={18} />
                        </button>
                      )}
                      
                      <button
                        onClick={() => updateUser(user, { active: !user.active })}
                        className={user.active ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}
                        title={user.active ? 'Deactivate' : 'Activate'}
                      >
                        {user.active ? <UserX size={18} /> : <UserCheck size={18} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* User Edit Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Edit User</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={selectedUser.username}
                  onChange={(e) => setSelectedUser({ ...selectedUser, username: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={selectedUser.role}
                  onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  checked={selectedUser.active}
                  onChange={(e) => setSelectedUser({ ...selectedUser, active: e.target.checked })}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
                  Active
                </label>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowUserModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  updateUser(selectedUser, selectedUser);
                  setShowUserModal(false);
                }}
                className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;