import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle, Check } from 'lucide-react';
import { technologyAPI, domainAPI } from '../../services/api';

const TechnologyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    domain: '', // Will store domain ID
    icon: 'code'
  });
  
  const [domains, setDomains] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDomainsLoading, setIsDomainsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Fetch domains for dropdown
  useEffect(() => {
    fetchDomains();
  }, []);
  
  // Fetch technology when editing
  useEffect(() => {
    if (isEditing) {
      fetchTechnology();
    }
  }, [isEditing, id]);
  
  const fetchDomains = async () => {
    try {
      setIsDomainsLoading(true);
      const response = await domainAPI.getAll();
      setDomains(response.data || []);
    } catch (err) {
      console.error('Error fetching domains:', err);
      setApiError('Failed to load domains. Please try again.');
    } finally {
      setIsDomainsLoading(false);
    }
  };
  
  const fetchTechnology = async () => {
    try {
      setIsLoading(true);
      setApiError(null);
      
      const response = await technologyAPI.getById(id);
      const tech = response.data;
      
      // Safely extract domain ID
      const domainId = tech.domain?._id || tech.domain || '';
      
      setFormData({
        name: tech.name || '',
        description: tech.description || '',
        domain: domainId,
        icon: tech.icon || 'code'
      });
    } catch (err) {
      console.error('Error fetching technology:', err);
      if (err.response?.status === 404) {
        setApiError('Technology not found.');
      } else {
        setApiError('Failed to load technology data. Please try again.');
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
      newErrors.name = 'Technology name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.domain) {
      newErrors.domain = 'Please select a domain';
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
        // Prepare data for API
        const techData = {
          name: formData.name.trim(),
          description: formData.description.trim(),
          domain: formData.domain,
          icon: formData.icon
        };
        
        let response;
        if (isEditing) {
          response = await technologyAPI.update(id, techData);
        } else {
          response = await technologyAPI.create(techData);
        }
        
        setSaveSuccess(true);
        
        // Redirect after a short delay to show success message
        setTimeout(() => {
          navigate('/admin/technologies');
        }, 1500);
      } catch (err) {
        console.error('Error saving technology:', err);
        
        if (err.response?.data?.message) {
          setApiError(err.response.data.message);
        } else if (err.response?.status === 400) {
          setApiError('Please check your input data and try again.');
        } else if (err.response?.status === 404) {
          setApiError('Domain not found. Please refresh and try again.');
        } else {
          setApiError('Failed to save technology. Please try again.');
        }
        
        setIsLoading(false);
      }
    }
  };

  // Get domain name by ID for display
  const getDomainName = (domainId) => {
    const domain = domains.find(d => d._id === domainId);
    return domain ? domain.name : 'Unknown Domain';
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/admin/technologies')}
          className="mr-4 p-2 rounded-md hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">{isEditing ? 'Edit Technology' : 'Add New Technology'}</h1>
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
          Technology {isEditing ? 'updated' : 'created'} successfully!
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
                Technology Name *
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
                placeholder="e.g., HTML"
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
                placeholder="Brief description of this technology"
                disabled={isLoading}
              ></textarea>
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-1">
                Domain *
              </label>
              <select
                id="domain"
                name="domain"
                value={formData.domain}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.domain ? 'border-red-300' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                disabled={isDomainsLoading || isLoading}
              >
                <option value="">Select a domain</option>
                {domains.map(domain => (
                  <option key={domain._id} value={domain._id}>
                    {domain.name}
                  </option>
                ))}
              </select>
              {isDomainsLoading && (
                <p className="mt-1 text-sm text-gray-500">Loading domains...</p>
              )}
              {errors.domain && (
                <p className="mt-1 text-sm text-red-600">{errors.domain}</p>
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
                <option value="code">Code</option>
                <option value="book">Book</option>
                <option value="terminal">Terminal</option>
                <option value="database">Database</option>
                <option value="chart">Chart</option>
              </select>
            </div>
            
            {/* Show current values when editing */}
            {isEditing && formData.domain && !isLoading && (
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Current Assignment:</h3>
                <p className="text-sm text-gray-600">
                  Domain: <span className="font-medium">{getDomainName(formData.domain)}</span>
                </p>
              </div>
            )}
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => navigate('/admin/technologies')}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || isDomainsLoading}
                className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2"
              >
                <Save size={18} />
                {isLoading ? 'Saving...' : (isEditing ? 'Update Technology' : 'Save Technology')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TechnologyForm;