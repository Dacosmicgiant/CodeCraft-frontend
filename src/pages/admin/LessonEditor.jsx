// src/pages/admin/LessonEditor.jsx
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, Save, AlertCircle, Check, Eye, FileText 
} from 'lucide-react';
import { lessonAPI, tutorialAPI } from '../../services/api';
import EditorJSComponent from '../../components/EditorJS/EditorJSComponent';

const LessonEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditing = !!id;
  
  // Get tutorialId from URL query params (for new lessons)
  const searchParams = new URLSearchParams(location.search);
  const tutorialIdFromQuery = searchParams.get('tutorialId');
  
  const editorRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    order: 1,
    duration: 10,
    tutorial: tutorialIdFromQuery || '',
    content: {
      time: Date.now(),
      blocks: [],
      version: "2.28.2"
    },
    isPublished: false
  });
  
  const [tutorials, setTutorials] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isTutorialsLoading, setIsTutorialsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  
  // Auto-save functionality
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const autoSaveTimeoutRef = useRef(null);
  
  // Load tutorials for dropdown
  useEffect(() => {
    fetchTutorials();
  }, []);
  
  // Load lesson data when editing
  useEffect(() => {
    if (isEditing && id) {
      fetchLesson(id);
    }
  }, [isEditing, id]);
  
  // Auto-save logic
  useEffect(() => {
    if (hasUnsavedChanges && isEditing) {
      // Clear existing timeout
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      
      // Set new timeout for auto-save
      autoSaveTimeoutRef.current = setTimeout(() => {
        handleAutoSave();
      }, 10000); // Auto-save after 10 seconds of inactivity
    }
    
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [hasUnsavedChanges, formData]);
  
  const fetchTutorials = async () => {
    try {
      setIsTutorialsLoading(true);
      const response = await tutorialAPI.getAll();
      const tutorialsList = response.data.tutorials || response.data || [];
      setTutorials(tutorialsList);
    } catch (err) {
      console.error('Error fetching tutorials:', err);
      setApiError('Failed to load tutorials. Please try again.');
    } finally {
      setIsTutorialsLoading(false);
    }
  };
  
  const fetchLesson = async (lessonId) => {
    try {
      setIsLoading(true);
      setApiError(null);
      
      const response = await lessonAPI.getById(lessonId);
      const lesson = response.data;
      
      // Safely extract tutorial ID
      const tutorialId = lesson.tutorial?._id || lesson.tutorial || '';
      
      // Ensure content is in EditorJS format
      let content = lesson.content;
      if (!content || !content.blocks) {
        content = {
          time: Date.now(),
          blocks: [],
          version: "2.28.2"
        };
      }
      
      setFormData({
        title: lesson.title || '',
        order: lesson.order || 1,
        duration: lesson.duration || 10,
        tutorial: tutorialId,
        content: content,
        isPublished: lesson.isPublished || false
      });
      
      setLastSaved(new Date());
    } catch (err) {
      console.error('Error fetching lesson:', err);
      if (err.response?.status === 404) {
        setApiError('Lesson not found.');
      } else {
        setApiError('Failed to load lesson data. Please try again.');
      }
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
    
    setHasUnsavedChanges(true);
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Handle content changes from EditorJS
  const handleContentChange = (data) => {
    console.log('📝 Editor content changed:', data);
    setFormData(prev => ({
      ...prev,
      content: data
    }));
    setHasUnsavedChanges(true);
  };
  
  // Safe function to get editor content with fallback
  const getEditorContent = async () => {
    console.log('🔍 Attempting to get editor content...');
    
    // Try to get content from editor
    if (editorRef.current && typeof editorRef.current.save === 'function') {
      try {
        console.log('💾 Trying to save from editor...');
        const editorData = await editorRef.current.save();
        
        if (editorData && editorData.blocks) {
          console.log('✅ Got content from editor:', editorData);
          return editorData;
        } else {
          console.warn('⚠️ Editor returned invalid data, using fallback');
        }
      } catch (error) {
        console.warn('⚠️ Editor save failed, using fallback:', error);
      }
    } else {
      console.warn('⚠️ Editor ref not available or no save method, using fallback');
    }
    
    // Fallback to current formData content
    console.log('📄 Using fallback content from formData:', formData.content);
    return formData.content;
  };
  
  // Auto-save function
  const handleAutoSave = async () => {
    if (!isEditing || !hasUnsavedChanges) return;
    
    try {
      const editorContent = await getEditorContent();
      
      const lessonData = {
        title: formData.title.trim(),
        order: parseInt(formData.order),
        duration: parseInt(formData.duration),
        content: editorContent,
        isPublished: formData.isPublished
      };
      
      await lessonAPI.update(id, lessonData);
      setHasUnsavedChanges(false);
      setLastSaved(new Date());
      console.log('💾 Auto-saved lesson');
    } catch (error) {
      console.error('Auto-save failed:', error);
      // Don't show error to user for auto-save failures
    }
  };
  
  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Lesson title is required';
    }
    
    if (!formData.tutorial) {
      newErrors.tutorial = 'Please select a tutorial';
    }
    
    if (!formData.order || formData.order < 1) {
      newErrors.order = 'Order must be a positive number';
    }
    
    if (!formData.duration || formData.duration < 1) {
      newErrors.duration = 'Duration must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setApiError(null);
    setSaveSuccess(false);
    
    try {
      // Get current editor content with fallback
      const editorContent = await getEditorContent();
      
      // Validate that we have valid content
      if (!editorContent || typeof editorContent !== 'object') {
        throw new Error('Invalid content format');
      }
      
      // Ensure content has the required structure
      const finalContent = {
        time: editorContent.time || Date.now(),
        blocks: Array.isArray(editorContent.blocks) ? editorContent.blocks : [],
        version: editorContent.version || "2.28.2"
      };
      
      console.log('📤 Final content to send:', finalContent);
      
      // Prepare the lesson data
      const lessonData = {
        title: formData.title.trim(),
        order: parseInt(formData.order),
        duration: parseInt(formData.duration),
        content: finalContent,
        isPublished: formData.isPublished
      };
      
      console.log('📋 Complete lesson data:', lessonData);
      
      let response;
      if (isEditing) {
        response = await lessonAPI.update(id, lessonData);
      } else {
        // For new lessons, use the tutorial-specific endpoint
        response = await lessonAPI.create(formData.tutorial, lessonData);
      }
      
      console.log('✅ Lesson saved successfully:', response);
      
      setSaveSuccess(true);
      setHasUnsavedChanges(false);
      setLastSaved(new Date());
      
      // Redirect after a short delay to show success message
      setTimeout(() => {
        navigate('/admin/lessons');
      }, 1500);
    } catch (err) {
      console.error('❌ Error saving lesson:', err);
      
      if (err.response?.data?.message) {
        setApiError(err.response.data.message);
      } else if (err.response?.status === 400) {
        setApiError('Please check your input data and try again.');
      } else if (err.response?.status === 404) {
        setApiError('Tutorial not found. Please refresh and try again.');
      } else {
        setApiError('Failed to save lesson. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle preview toggle
  const togglePreview = async () => {
    if (!showPreview) {
      // Save current editor content before switching to preview
      const editorContent = await getEditorContent();
      if (editorContent) {
        setFormData(prev => ({
          ...prev,
          content: editorContent
        }));
      }
    }
    setShowPreview(!showPreview);
  };
  
  // Get tutorial name by ID
  const getTutorialName = (tutorialId) => {
    const tutorial = tutorials.find(t => t._id === tutorialId);
    return tutorial ? tutorial.title : 'Unknown Tutorial';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/admin/lessons')}
              className="mr-4 p-2 rounded-md hover:bg-gray-100 transition-colors"
              disabled={isLoading}
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditing ? 'Edit Lesson' : 'Create New Lesson'}
              </h1>
              {lastSaved && (
                <p className="text-sm text-gray-500 mt-1">
                  Last saved: {lastSaved.toLocaleTimeString()}
                  {hasUnsavedChanges && <span className="text-orange-600 ml-2">• Unsaved changes</span>}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={togglePreview}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2 transition-colors"
              disabled={isLoading}
            >
              <Eye size={18} />
              {showPreview ? 'Edit' : 'Preview'}
            </button>
          </div>
        </div>
        
        {/* Error Message */}
        {apiError && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md flex items-center">
            <AlertCircle size={18} className="mr-2 flex-shrink-0" />
            {apiError}
          </div>
        )}
        
        {/* Success Message */}
        {saveSuccess && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-md flex items-center">
            <Check size={18} className="mr-2 flex-shrink-0" />
            Lesson {isEditing ? 'updated' : 'created'} successfully!
          </div>
        )}
        
        {isLoading && !formData.title && isEditing ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Lesson Details Form */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium mb-6 flex items-center gap-2 text-gray-900 border-b border-gray-100 pb-3">
                <FileText size={20} className="text-emerald-600" />
                Lesson Details
              </h2>
              
              <div className="space-y-6">
                {/* Title Field */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Lesson Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                      errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                    }`}
                    placeholder="e.g., Introduction to HTML"
                    disabled={isLoading}
                  />
                  {errors.title && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={16} />
                      {errors.title}
                    </p>
                  )}
                </div>
                
                {/* Tutorial, Order, Duration Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="tutorial" className="block text-sm font-medium text-gray-700 mb-2">
                      Tutorial *
                    </label>
                    <select
                      id="tutorial"
                      name="tutorial"
                      value={formData.tutorial}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                        errors.tutorial ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                      }`}
                      disabled={isEditing || isTutorialsLoading || isLoading}
                    >
                      <option value="">Select a tutorial</option>
                      {tutorials.map(tutorial => (
                        <option key={tutorial._id} value={tutorial._id}>
                          {tutorial.title}
                        </option>
                      ))}
                    </select>
                    {isTutorialsLoading && (
                      <p className="mt-2 text-sm text-gray-500">Loading tutorials...</p>
                    )}
                    {errors.tutorial && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle size={16} />
                        {errors.tutorial}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-2">
                      Order *
                    </label>
                    <input
                      type="number"
                      id="order"
                      name="order"
                      value={formData.order}
                      onChange={handleChange}
                      min="1"
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                        errors.order ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                      }`}
                      disabled={isLoading}
                    />
                    {errors.order && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle size={16} />
                        {errors.order}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (minutes) *
                    </label>
                    <input
                      type="number"
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      min="1"
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                        errors.duration ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
                      }`}
                      disabled={isLoading}
                    />
                    {errors.duration && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle size={16} />
                        {errors.duration}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Publish Checkbox */}
                <div className="flex items-center p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <input
                    type="checkbox"
                    id="isPublished"
                    name="isPublished"
                    checked={formData.isPublished}
                    onChange={handleChange}
                    className="h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    disabled={isLoading}
                  />
                  <label htmlFor="isPublished" className="ml-3 block text-sm font-medium text-gray-900">
                    Publish this lesson (make it visible to users)
                  </label>
                </div>

                {/* Current Tutorial Assignment (when editing) */}
                {isEditing && formData.tutorial && !isLoading && (
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Current Assignment:</h3>
                    <p className="text-sm text-gray-600">
                      Tutorial: <span className="font-medium">{getTutorialName(formData.tutorial)}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Lesson Content Editor */}
            {!showPreview ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-medium mb-4 text-gray-900 border-b border-gray-100 pb-3">
                  📝 Lesson Content
                </h2>
                <EditorJSComponent
                  ref={editorRef}
                  data={formData.content}
                  onChange={handleContentChange}
                  placeholder="Start writing your lesson content..."
                  readOnly={isLoading}
                  className="min-h-96"
                />
              </div>
            ) : (
              /* Preview Mode */
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-medium mb-4 text-gray-900 border-b border-gray-100 pb-3">
                  👁️ Preview
                </h2>
                <div className="prose prose-sm max-w-none">
                  <h1 className="text-2xl font-bold mb-4">{formData.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 pb-4 border-b">
                    <span>Duration: {formData.duration} minutes</span>
                    <span>Order: #{formData.order}</span>
                    <span>Status: {formData.isPublished ? 'Published' : 'Draft'}</span>
                  </div>
                  <EditorJSComponent
                    data={formData.content}
                    readOnly={true}
                    className="border-none p-0"
                  />
                </div>
              </div>
            )}
            
            {/* Submit Buttons */}
            <div className="flex justify-between items-center bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <button
                type="button"
                onClick={() => navigate('/admin/lessons')}
                className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading || isTutorialsLoading}
                className="px-6 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2 transition-colors"
              >
                <Save size={18} />
                {isLoading ? 'Saving...' : 'Save Lesson'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonEditor;