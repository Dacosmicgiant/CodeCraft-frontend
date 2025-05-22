import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle, Check } from 'lucide-react';
import { domainAPI } from '../../services/api';

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
  const [apiError, setApiError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Fetch domain data when editing
  useEffect(() => {
    if (isEditing) {
      fetchDomain();
    }
  }, [isEditing, id]);
  
  const fetchDomain = async () => {
    try {
      setIsLoading(true);
      setApiError(null);
      
      const response = await domainAPI.getById(id);
      const domain = response.data;
      
      setFormData({
        name: domain.name || '',
        description: domain.description || '',
        icon: domain.icon || 'folder'
      });
    } catch (err) {
      console.error('Error fetching domain:', err);
      if (err.response?.status === 404) {
        setApiError('Domain not found.');
      } else {
        setApiError('Failed to load domain data. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
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
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Domain name must be at least 2 characters long';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters long';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsLoading(true);
      setApiError(null);
      setSaveSuccess(false);
      
      try {
        const domainData = {
          name: formData.name.trim(),
          description: formData.description.trim(),
          icon: formData.icon
        };
        
        let response;
        if (isEditing) {
          response = await domainAPI.update(id, domainData);
        } else {
          response = await domainAPI.create(domainData);
        }
        
        setSaveSuccess(true);
        
        // Redirect after a short delay to show success message
        setTimeout(() => {
          navigate('/admin/domains');
        }, 1500);
      } catch (err) {
        console.error('Error saving domain:', err);
        
        if (err.response?.data?.message) {
          setApiError(err.response.data.message);
        } else if (err.response?.status === 400) {
          setApiError('Please check your input data and try again.');
        } else {
          setApiError('Failed to save domain. Please try again.');
        }
        
        setIsLoading(false);
      }
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
      
      {/* Error Message */}
      {apiError && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md flex items-center">
          <AlertCircle size={18} className="mr-2" />
          {apiError}
        </div>
      )}
      
      {/* Success Message */}
      {saveSuccess && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-md flex items-center">
          <Check size={18} className="mr-2" />
          Domain {isEditing ? 'updated' : 'created'} successfully!
        </div>
      )}
      
      {isLoading && !formData.name && isEditing ? (
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
                disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2"
              >
                <Save size={18} />
                {isLoading ? 'Saving...' : (isEditing ? 'Update Domain' : 'Save Domain')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default DomainForm;