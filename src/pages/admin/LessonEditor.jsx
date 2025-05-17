// src/pages/admin/LessonEditor.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, Youtube, Code, FileText, Image, ExternalLink } from 'lucide-react';

const LessonEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologyId: '',
    content: []
  });
  
  const [technologies, setTechnologies] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Mock API call to get technologies
  useEffect(() => {
    // In a real app, you'd fetch technologies from an API
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      setTechnologies([
        { id: 1, name: 'HTML', domainId: 1 },
        { id: 2, name: 'CSS', domainId: 1 },
        { id: 3, name: 'JavaScript', domainId: 1 },
        { id: 4, name: 'Python', domainId: 2 }
      ]);
      setIsLoading(false);
    }, 500);
  }, []);
  
  // Mock API call to get lesson data when editing
  useEffect(() => {
    if (isEditing && technologies.length > 0) {
      // In a real app, you'd fetch the lesson data from an API
      setIsLoading(true);
      
      // Simulate API delay
      setTimeout(() => {
        // Mock data
        setFormData({
          title: 'HTML Introduction',
          description: 'Introduction to HTML basics',
          technologyId: '1',
          content: [
            { 
              type: 'text', 
              value: 'HTML (HyperText Markup Language) is the standard markup language for creating web pages. It describes the structure of a web page and consists of a series of elements that tell the browser how to display the content.'
            },
            {
              type: 'video',
              value: 'https://www.youtube.com/embed/UB1O30fR-EE'
            },
            {
              type: 'text',
              value: 'HTML elements are represented by tags, written using angle brackets. Tags usually come in pairs like <p> and </p>, with the first tag being the start tag and the second tag being the end tag.'
            },
            {
              type: 'code',
              language: 'html',
              value: '<!DOCTYPE html>\n<html>\n<head>\n  <title>Page Title</title>\n</head>\n<body>\n  <h1>My First Heading</h1>\n  <p>My first paragraph.</p>\n</body>\n</html>'
            }
          ]
        });
        setIsLoading(false);
      }, 500);
    }
  }, [isEditing, id, technologies]);
  
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
  
  // Add new content block
  const addContentBlock = (type) => {
    let newBlock;
    
    switch (type) {
      case 'text':
        newBlock = { type: 'text', value: '' };
        break;
      case 'video':
        newBlock = { type: 'video', value: '' };
        break;
      case 'code':
        newBlock = { type: 'code', language: 'html', value: '' };
        break;
      case 'image':
        newBlock = { type: 'image', value: '', alt: '' };
        break;
      case 'link':
        newBlock = { type: 'link', text: '', url: '' };
        break;
      default:
        return;
    }
    
    setFormData(prev => ({
      ...prev,
      content: [...prev.content, newBlock]
    }));
  };
  
  // Remove content block
  const removeContentBlock = (index) => {
    setFormData(prev => ({
      ...prev,
      content: prev.content.filter((_, i) => i !== index)
    }));
  };
  
  // Update content block
  const updateContentBlock = (index, field, value) => {
    setFormData(prev => {
      const newContent = [...prev.content];
      
      if (field === 'value' || field === 'language' || field === 'alt' || field === 'text' || field === 'url') {
        newContent[index] = {
          ...newContent[index],
          [field]: value
        };
      }
      
      return {
        ...prev,
        content: newContent
      };
    });
  };
  
  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Lesson title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.technologyId) {
      newErrors.technologyId = 'Please select a technology';
    }
    
    if (formData.content.length === 0) {
      newErrors.content = 'Please add at least one content block';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        console.log('Submitting lesson data:', formData);
        setIsSubmitting(false);
        
        // Redirect back to lesson list
        navigate('/admin/lessons');
      }, 500);
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/admin/lessons')}
          className="mr-4 p-2 rounded-md hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">{isEditing ? 'Edit Lesson' : 'Create New Lesson'}</h1>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Lesson Details */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium mb-4">Lesson Details</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Lesson Title *
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
                  placeholder="e.g., HTML Introduction"
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
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.description ? 'border-red-300' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  placeholder="Brief description of this lesson"
                ></textarea>
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="technologyId" className="block text-sm font-medium text-gray-700 mb-1">
                  Technology *
                </label>
                <select
                  id="technologyId"
                  name="technologyId"
                  value={formData.technologyId}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.technologyId ? 'border-red-300' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                >
                  <option value="">Select a technology</option>
                  {technologies.map(tech => (
                    <option key={tech.id} value={tech.id.toString()}>
                      {tech.name}
                    </option>
                  ))}
                </select>
                {errors.technologyId && (
                  <p className="mt-1 text-sm text-red-600">{errors.technologyId}</p>
                )}
              </div>
            </div>
          </div>
          
          {/* Lesson Content */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Lesson Content</h2>
              <div className="relative group">
                <button 
                  className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 flex items-center gap-2"
                >
                  <Plus size={18} />
                  Add Content
                </button>
                
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 hidden group-hover:block">
                  <div className="py-1">
                    <button 
                      onClick={() => addContentBlock('text')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FileText size={16} className="mr-2" />
                      Text Paragraph
                    </button>
                    <button 
                      onClick={() => addContentBlock('video')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Youtube size={16} className="mr-2" />
                      YouTube Video
                    </button>
                    <button 
                      onClick={() => addContentBlock('code')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Code size={16} className="mr-2" />
                      Code Snippet
                    </button>
                    <button 
                      onClick={() => addContentBlock('image')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Image size={16} className="mr-2" />
                      Image
                    </button>
                    <button 
                      onClick={() => addContentBlock('link')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <ExternalLink size={16} className="mr-2" />
                      External Link
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {errors.content && (
              <p className="mb-4 text-sm text-red-600">{errors.content}</p>
            )}
            
            {formData.content.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed rounded-md">
                <p className="text-gray-500 mb-2">No content blocks added yet</p>
                <p className="text-sm text-gray-400">Click "Add Content" to start building your lesson</p>
              </div>
            ) : (
              <div className="space-y-6">
                {formData.content.map((block, index) => (
                  <div key={index} className="border rounded-md p-4 relative">
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={() => removeContentBlock(index)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded-md hover:bg-gray-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    {block.type === 'text' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Text Paragraph
                        </label>
                        <textarea
                          value={block.value}
                          onChange={(e) => updateContentBlock(index, 'value', e.target.value)}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="Enter your content here..."
                        ></textarea>
                      </div>
                    )}
                    
                    {block.type === 'video' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          YouTube Video URL (embed format)
                        </label>
                        <input
                          type="url"
                          value={block.value}
                          onChange={(e) => updateContentBlock(index, 'value', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="https://www.youtube.com/embed/video-id"
                        />
                        {block.value && (
                          <div className="mt-4 relative pt-[56.25%]">
                            <iframe
                              className="absolute inset-0 w-full h-full rounded-md"
                              src={block.value}
                              title="YouTube video"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {block.type === 'code' && (
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Code Snippet
                          </label>
                          <select
                            value={block.language || 'html'}
                            onChange={(e) => updateContentBlock(index, 'language', e.target.value)}
                            className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          >
                            <option value="html">HTML</option>
                            <option value="css">CSS</option>
                            <option value="javascript">JavaScript</option>
                            <option value="python">Python</option>
                            <option value="java">Java</option>
                          </select>
                        </div>
                        <textarea
                          value={block.value}
                          onChange={(e) => updateContentBlock(index, 'value', e.target.value)}
                          rows={6}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="// Enter your code here..."
                        ></textarea>
                      </div>
                    )}
                    
                    {block.type === 'image' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Image URL
                        </label>
                        <input
                          type="url"
                          value={block.value}
                          onChange={(e) => updateContentBlock(index, 'value', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="https://example.com/image.jpg"
                        />
                        <label className="block text-sm font-medium text-gray-700 mb-1 mt-2">
                          Alt Text
                        </label>
                        <input
                          type="text"
                          value={block.alt || ''}
                          onChange={(e) => updateContentBlock(index, 'alt', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="Description of the image"
                        />
                        {block.value && (
                          <div className="mt-4">
                            <img 
                              src={block.value} 
                              alt={block.alt || 'Preview'} 
                              className="max-h-64 rounded-md"
                            />
                          </div>
                        )}
                      </div>
                    )}
                    
                    {block.type === 'link' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Link Text
                        </label>
                        <input
                          type="text"
                          value={block.text || ''}
                          onChange={(e) => updateContentBlock(index, 'text', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="Text for the link"
                        />
                        <label className="block text-sm font-medium text-gray-700 mb-1 mt-2">
                          URL
                        </label>
                        <input
                          type="url"
                          value={block.url || ''}
                          onChange={(e) => updateContentBlock(index, 'url', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="https://example.com"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/admin/lessons')}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Save size={18} />
              {isSubmitting ? 'Saving...' : 'Save Lesson'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonEditor;