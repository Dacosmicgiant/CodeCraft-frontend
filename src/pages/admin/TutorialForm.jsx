// src/pages/admin/TutorialForm.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle, Check, Plus, X } from 'lucide-react';
import { tutorialAPI, domainAPI, technologyAPI } from '../../services/api';

const TutorialForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    domain: '',
    technology: '',
    difficulty: 'beginner',
    estimatedTime: 30,
    tags: [],
    isPublished: false
  });
  
  const [domains, setDomains] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [filteredTechnologies, setFilteredTechnologies] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isResourcesLoading, setIsResourcesLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [tagInput, setTagInput] = useState('');
  
  // Load domains and technologies
  useEffect(() => {
    fetchDomains();
    fetchTechnologies();
  }, []);
  
  // Filter technologies when domain changes
  useEffect(() => {
    if (formData.domain) {
      const filtered = technologies.filter(tech => tech.domain === formData.domain || tech.domain._id === formData.domain);
      setFilteredTechnologies(filtered);
    } else {
      setFilteredTechnologies([]);
    }
  }, [formData.domain, technologies]);
  
  // Load tutorial data when editing
  useEffect(() => {
    if (isEditing) {
      fetchTutorial();
    }
  }, [isEditing, id]);
  
  const fetchDomains = async () => {
    try {
      const response = await domainAPI.getAll();
      setDomains(response.data);
    } catch (err) {
      console.error('Error fetching domains:', err);
      setApiError('Failed to load domains. Please try again.');
    } finally {
      setIsResourcesLoading(false);
    }
  };
  
  const fetchTechnologies = async () => {
    try {
      const response = await technologyAPI.getAll();
      setTechnologies(response.data);
    } catch (err) {
      console.error('Error fetching technologies:', err);
      setApiError('Failed to load technologies. Please try again.');
    }
  };
  
  const fetchTutorial = async () => {
    try {
      setIsLoading(true);
      setApiError(null);
      
      const response = await tutorialAPI.getById(id);
      const tutorial = response.data;
      
      // Set form data from tutorial
      setFormData({
        title: tutorial.title,
        description: tutorial.description,
        domain: tutorial.domain._id || tutorial.domain,
        technology: tutorial.technology._id || tutorial.technology,
        difficulty: tutorial.difficulty || 'beginner',
        estimatedTime: tutorial.estimatedTime || 30,
        tags: tutorial.tags || [],
        isPublished: tutorial.isPublished || false
      });
    } catch (err) {
      console.error('Error fetching tutorial:', err);
      setApiError('Failed to load tutorial data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Handle tag input
  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };
  
  // Add a tag when pressing Enter
  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      addTag(tagInput.trim());
    }
  };
  
  // Add a tag
  const addTag = (tag) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
    setTagInput('');
  };
  
  // Remove a tag
  const removeTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };
  
  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Tutorial title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.domain) {
      newErrors.domain = 'Please select a domain';
    }
    
    if (!formData.technology) {
      newErrors.technology = 'Please select a technology';
    }
    
    if (!formData.estimatedTime || formData.estimatedTime < 1) {
      newErrors.estimatedTime = 'Estimated time must be a positive number';
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
        // Prepare the tutorial data
        const tutorialData = {
          title: formData.title,
          description: formData.description,
          domain: formData.domain,
          technology: formData.technology,
          difficulty: formData.difficulty,
          estimatedTime: parseInt(formData.estimatedTime),
          tags: formData.tags,
          isPublished: formData.isPublished
        };
        
        if (isEditing) {
          await tutorialAPI.update(id, tutorialData);
        } else {
          await tutorialAPI.create(tutorialData);
        }
        
        setSaveSuccess(true);
        
        // Redirect after a short delay to show success message
        setTimeout(() => {
          navigate('/admin/tutorials');
        }, 1500);
      } catch (err) {
        console.error('Error saving tutorial:', err);
        
        if (err.response?.data?.message) {
          setApiError(err.response.data.message);
        } else {
          setApiError('Failed to save tutorial. Please try again.');
        }
        
        setIsLoading(false);
      }
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/admin/tutorials')}
          className="mr-4 p-2 rounded-md hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">{isEditing ? 'Edit Tutorial' : 'Create New Tutorial'}</h1>
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
          Tutorial {isEditing ? 'updated' : 'created'} successfully!
        </div>
      )}
      
      {isLoading && !formData.title && isEditing ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Tutorial Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                placeholder="e.g., HTML Fundamentals"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
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
                rows={4}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                placeholder="Write a detailed description of this tutorial..."
              ></textarea>
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  disabled={isResourcesLoading}
                >
                  <option value="">Select a domain</option>
                  {domains.map(domain => (
                    <option key={domain._id} value={domain._id}>
                      {domain.name}
                    </option>
                  ))}
                </select>
                {errors.domain && (
                  <p className="mt-1 text-sm text-red-600">{errors.domain}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="technology" className="block text-sm font-medium text-gray-700 mb-1">
                  Technology *
                </label>
                <select
                  id="technology"
                  name="technology"
                  value={formData.technology}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.technology ? 'border-red-300' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  disabled={!formData.domain || isResourcesLoading}
                >
                  <option value="">Select a technology</option>
                  {filteredTechnologies.map(tech => (
                    <option key={tech._id} value={tech._id}>
                      {tech.name}
                    </option>
                  ))}
                </select>
                {formData.domain && filteredTechnologies.length === 0 && (
                  <p className="mt-1 text-sm text-gray-500">
                    No technologies available for this domain. 
                    <Link to="/admin/technologies/new" className="ml-1 text-emerald-600 hover:text-emerald-700">
                      Create one
                    </Link>
                  </p>
                )}
                {errors.technology && (
                  <p className="mt-1 text-sm text-red-600">{errors.technology}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                  Difficulty Level
                </label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="estimatedTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Estimated Time (minutes) *
                </label>
                <input
                  type="number"
                  id="estimatedTime"
                  name="estimatedTime"
                  value={formData.estimatedTime}
                  onChange={handleChange}
                  min="1"
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.estimatedTime ? 'border-red-300' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                />
                {errors.estimatedTime && (
                  <p className="mt-1 text-sm text-red-600">{errors.estimatedTime}</p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-emerald-500 hover:text-emerald-700"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  id="tagInput"
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyDown={handleTagInputKeyDown}
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Add a tag and press Enter"
                />
                <button
                  type="button"
                  onClick={() => addTag(tagInput.trim())}
                  disabled={!tagInput.trim()}
                  className="px-3 py-2 bg-emerald-600 text-white rounded-r-md hover:bg-emerald-700 disabled:opacity-50"
                >
                  <Plus size={18} />
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">Press Enter to add multiple tags. Example: html, beginner, web development</p>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublished"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleChange}
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-900">
                Publish this tutorial (make it visible to users)
              </label>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => navigate('/admin/tutorials')}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || isResourcesLoading}
                className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2"
              >
                <Save size={18} />
                {isLoading ? 'Saving...' : 'Save Tutorial'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TutorialForm;