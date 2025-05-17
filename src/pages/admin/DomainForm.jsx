// src/pages/admin/DomainForm.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';

const DomainForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'folder'
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock API call to get domain data when editing
  useEffect(() => {
    if (isEditing) {
      // In a real app, you'd fetch the domain data from an API
      setIsLoading(true);
      
      // Simulate API delay
      setTimeout(() => {
        // Mock data
        setFormData({
          name: 'Web Development',
          description: 'Frontend and backend web development topics',
          icon: 'code'
        });
        setIsLoading(false);
      }, 500);
    }
  }, [isEditing, id]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Domain name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        console.log('Submitting domain data:', formData);
        setIsLoading(false);
        
        // Redirect back to domain list
        navigate('/admin/domains');
      }, 500);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/admin/domains')}
          className="mr-4 p-2 rounded-md hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">{isEditing ? 'Edit Domain' : 'Add New Domain'}</h1>
      </div>
      
      {isLoading && !isEditing ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Domain Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                placeholder="e.g., Web Development"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                placeholder="Brief description of this domain"
              ></textarea>
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-1">
                Icon
              </label>
              <select
                id="icon"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="folder">Folder</option>
                <option value="code">Code</option>
                <option value="book">Book</option>
                <option value="database">Database</option>
                <option value="chart">Chart</option>
              </select>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => navigate('/admin/domains')}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2"
              >
                <Save size={18} />
                {isLoading ? 'Saving...' : 'Save Domain'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default DomainForm;