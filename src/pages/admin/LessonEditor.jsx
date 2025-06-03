import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, Save, Plus, Trash2, Youtube, Code, 
  FileText, Image, ExternalLink, AlertCircle, Check, 
  ArrowUp, ArrowDown, GripVertical, Bold, Italic, 
  Underline, AlignLeft, AlignCenter, AlignRight, List,
  ListOrdered
} from 'lucide-react';
import { lessonAPI, tutorialAPI } from '../../services/api';

// Rich Text Editor Component
const RichTextEditor = ({ value, onChange, placeholder }) => {
  const editorRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    if (editorRef.current && !isInitialized) {
      editorRef.current.innerHTML = value || '';
      setIsInitialized(true);
    }
  }, [value, isInitialized]);
  
  const execCommand = (command, commandValue = null) => {
    editorRef.current.focus();
    
    if (command === 'formatBlock') {
      // Handle heading formatting differently
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        document.execCommand('formatBlock', false, `<${commandValue}>`);
      }
    } else if (command === 'insertUnorderedList' || command === 'insertOrderedList') {
      // Handle lists with better formatting
      document.execCommand(command, false, null);
      // Ensure proper styling after list creation
      setTimeout(() => {
        const lists = editorRef.current.querySelectorAll('ul, ol');
        lists.forEach(list => {
          if (list.tagName === 'UL') {
            list.style.listStyleType = 'disc';
            list.style.paddingLeft = '2rem';
            list.style.margin = '0.5rem 0';
          } else if (list.tagName === 'OL') {
            list.style.listStyleType = 'decimal';
            list.style.paddingLeft = '2rem';
            list.style.margin = '0.5rem 0';
          }
          
          // Style list items
          const items = list.querySelectorAll('li');
          items.forEach(item => {
            item.style.display = 'list-item';
            item.style.margin = '0.2rem 0';
            if (list.tagName === 'UL') {
              item.style.listStyleType = 'disc';
            } else if (list.tagName === 'OL') {
              item.style.listStyleType = 'decimal';
            }
          });
        });
      }, 10);
    } else {
      document.execCommand(command, false, commandValue);
    }
    
    handleChange();
  };
  
  const handleChange = () => {
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML);
    }
  };
  
  const handleInput = (e) => {
    handleChange();
  };
  
  const handleKeyDown = (e) => {
    // Prevent default behavior for some formatting shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          execCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          execCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          execCommand('underline');
          break;
      }
    }
  };
  
  const isCommandActive = (command) => {
    try {
      return document.queryCommandState(command);
    } catch (e) {
      return false;
    }
  };
  
  return (
    <div className="border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500">
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-2 flex flex-wrap gap-1">
        {/* Text Formatting */}
        <button
          type="button"
          onClick={() => execCommand('bold')}
          className={`p-2 rounded-md hover:bg-gray-100 ${isCommandActive('bold') ? 'bg-gray-200' : ''}`}
          title="Bold (Ctrl+B)"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => execCommand('italic')}
          className={`p-2 rounded-md hover:bg-gray-100 ${isCommandActive('italic') ? 'bg-gray-200' : ''}`}
          title="Italic (Ctrl+I)"
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onClick={() => execCommand('underline')}
          className={`p-2 rounded-md hover:bg-gray-100 ${isCommandActive('underline') ? 'bg-gray-200' : ''}`}
          title="Underline (Ctrl+U)"
        >
          <Underline size={16} />
        </button>
        
        <div className="border-l border-gray-300 mx-1"></div>
        
        {/* Alignment */}
        <button
          type="button"
          onClick={() => execCommand('justifyLeft')}
          className={`p-2 rounded-md hover:bg-gray-100 ${isCommandActive('justifyLeft') ? 'bg-gray-200' : ''}`}
          title="Align Left"
        >
          <AlignLeft size={16} />
        </button>
        <button
          type="button"
          onClick={() => execCommand('justifyCenter')}
          className={`p-2 rounded-md hover:bg-gray-100 ${isCommandActive('justifyCenter') ? 'bg-gray-200' : ''}`}
          title="Center"
        >
          <AlignCenter size={16} />
        </button>
        <button
          type="button"
          onClick={() => execCommand('justifyRight')}
          className={`p-2 rounded-md hover:bg-gray-100 ${isCommandActive('justifyRight') ? 'bg-gray-200' : ''}`}
          title="Align Right"
        >
          <AlignRight size={16} />
        </button>
        
        <div className="border-l border-gray-300 mx-1"></div>
        
        {/* Lists */}
        <button
          type="button"
          onClick={() => execCommand('insertUnorderedList')}
          className={`p-2 rounded-md hover:bg-gray-100 ${isCommandActive('insertUnorderedList') ? 'bg-gray-200' : ''}`}
          title="Bullet List"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={() => execCommand('insertOrderedList')}
          className={`p-2 rounded-md hover:bg-gray-100 ${isCommandActive('insertOrderedList') ? 'bg-gray-200' : ''}`}
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </button>
        
        <div className="border-l border-gray-300 mx-1"></div>
        
        {/* Heading Buttons */}
        <button
          type="button"
          onClick={() => execCommand('formatBlock', 'h1')}
          className="px-2 py-1 text-sm rounded-md hover:bg-gray-100 font-bold"
          title="Heading 1"
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => execCommand('formatBlock', 'h2')}
          className="px-2 py-1 text-sm rounded-md hover:bg-gray-100 font-semibold"
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => execCommand('formatBlock', 'h3')}
          className="px-2 py-1 text-sm rounded-md hover:bg-gray-100 font-medium"
          title="Heading 3"
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => execCommand('formatBlock', 'p')}
          className="px-2 py-1 text-sm rounded-md hover:bg-gray-100"
          title="Paragraph"
        >
          P
        </button>
      </div>
      
      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        className="p-3 min-h-[120px] focus:outline-none prose prose-sm max-w-none"
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        suppressContentEditableWarning={true}
        style={{
          fontSize: '14px',
          lineHeight: '1.5'
        }}
      />
      
      {/* Placeholder */}
      {(!value || value.trim() === '') && (
        <div 
          className="absolute pointer-events-none text-gray-400 italic"
          style={{ 
            top: '60px', 
            left: '15px',
            fontSize: '14px'
          }}
        >
          {placeholder}
        </div>
      )}
      
      <style jsx>{`
        .prose h1 { 
          font-size: 2rem; 
          font-weight: 700; 
          margin: 0.5rem 0;
          line-height: 1.2;
        }
        .prose h2 { 
          font-size: 1.5rem; 
          font-weight: 600; 
          margin: 0.4rem 0;
          line-height: 1.3;
        }
        .prose h3 { 
          font-size: 1.25rem; 
          font-weight: 500; 
          margin: 0.3rem 0;
          line-height: 1.4;
        }
        .prose p { 
          margin: 0.25rem 0;
          line-height: 1.5;
        }
        .prose ul { 
          margin: 0.5rem 0; 
          padding-left: 2rem;
          list-style-type: disc !important;
          list-style-position: outside !important;
        }
        .prose ol { 
          margin: 0.5rem 0; 
          padding-left: 2rem;
          list-style-type: decimal !important;
          list-style-position: outside !important;
        }
        .prose li { 
          margin: 0.2rem 0;
          display: list-item !important;
          line-height: 1.5;
        }
        .prose ul li {
          list-style-type: disc !important;
        }
        .prose ol li {
          list-style-type: decimal !important;
        }
        /* Ensure nested lists work */
        .prose ul ul {
          list-style-type: circle !important;
          margin: 0.2rem 0;
          padding-left: 1.5rem;
        }
        .prose ol ol {
          list-style-type: lower-alpha !important;
          margin: 0.2rem 0;
          padding-left: 1.5rem;
        }
      `}</style>
    </div>
  );
};

const LessonEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditing = !!id;
  
  // Get tutorialId from URL query params (for new lessons)
  const searchParams = new URLSearchParams(location.search);
  const tutorialIdFromQuery = searchParams.get('tutorialId');
  
  const [formData, setFormData] = useState({
    title: '',
    order: 1,
    duration: 10,
    tutorial: tutorialIdFromQuery || '',
    content: [],
    isPublished: false
  });
  
  const [tutorials, setTutorials] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isTutorialsLoading, setIsTutorialsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
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
      
      setFormData({
        title: lesson.title || '',
        order: lesson.order || 1,
        duration: lesson.duration || 10,
        tutorial: tutorialId,
        content: lesson.content || [],
        isPublished: lesson.isPublished || false
      });
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
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Add a new content block
  const addContentBlock = (type) => {
    let newBlock;
    
    switch (type) {
      case 'text':
        newBlock = { 
          type: 'text',
          data: { html: '' }
        };
        break;
      case 'code':
        newBlock = { 
          type: 'code',
          data: { 
            language: 'html',
            code: ''
          }
        };
        break;
      case 'video':
        newBlock = { 
          type: 'video',
          data: { 
            url: '',
            caption: ''
          }
        };
        break;
      case 'image':
        newBlock = { 
          type: 'image',
          data: { 
            url: '',
            alt: '',
            caption: ''
          }
        };
        break;
      case 'quiz':
        newBlock = {
          type: 'quiz',
          data: {
            question: '',
            options: ['', '', '', ''],
            correctAnswer: 0
          }
        };
        break;
      default:
        return;
    }
    
    setFormData(prev => ({
      ...prev,
      content: [...prev.content, newBlock]
    }));
  };
  
  // Remove a content block
  const removeContentBlock = (index) => {
    setFormData(prev => ({
      ...prev,
      content: prev.content.filter((_, i) => i !== index)
    }));
  };
  
  // Move a content block up or down
  const moveContentBlock = (index, direction) => {
    const newContent = [...formData.content];
    
    if (direction === 'up' && index > 0) {
      [newContent[index], newContent[index-1]] = [newContent[index-1], newContent[index]];
    } else if (direction === 'down' && index < newContent.length - 1) {
      [newContent[index], newContent[index+1]] = [newContent[index+1], newContent[index]];
    }
    
    setFormData(prev => ({
      ...prev,
      content: newContent
    }));
  };
  
  // Update content block data
  const updateContentBlock = (index, field, value) => {
    const newContent = [...formData.content];
    
    // Handle nested data fields
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      if (parent === 'data') {
        newContent[index].data = {
          ...newContent[index].data,
          [child]: value
        };
      }
    } else if (field === 'data') {
      // Update entire data object
      newContent[index].data = value;
    } else {
      // Update direct field
      newContent[index][field] = value;
    }
    
    setFormData(prev => ({
      ...prev,
      content: newContent
    }));
  };

  // Update quiz options
  const updateQuizOption = (blockIndex, optionIndex, value) => {
    const newContent = [...formData.content];
    const newOptions = [...newContent[blockIndex].data.options];
    newOptions[optionIndex] = value;
    
    newContent[blockIndex].data = {
      ...newContent[blockIndex].data,
      options: newOptions
    };
    
    setFormData(prev => ({
      ...prev,
      content: newContent
    }));
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
    
    if (validateForm()) {
      setIsLoading(true);
      setApiError(null);
      setSaveSuccess(false);
      
      try {
        // Format data for API
        const lessonData = {
          title: formData.title.trim(),
          order: parseInt(formData.order),
          duration: parseInt(formData.duration),
          content: formData.content,
          isPublished: formData.isPublished
        };
        
        let response;
        if (isEditing) {
          response = await lessonAPI.update(id, lessonData);
        } else {
          // For new lessons, use the tutorial-specific endpoint
          response = await lessonAPI.create(formData.tutorial, lessonData);
        }
        
        setSaveSuccess(true);
        
        // Redirect after a short delay to show success message
        setTimeout(() => {
          navigate('/admin/lessons');
        }, 1500);
      } catch (err) {
        console.error('Error saving lesson:', err);
        
        if (err.response?.data?.message) {
          setApiError(err.response.data.message);
        } else if (err.response?.status === 400) {
          setApiError('Please check your input data and try again.');
        } else if (err.response?.status === 404) {
          setApiError('Tutorial not found. Please refresh and try again.');
        } else {
          setApiError('Failed to save lesson. Please try again.');
        }
        
        setIsLoading(false);
      }
    }
  };

  // Get tutorial name by ID
  const getTutorialName = (tutorialId) => {
    const tutorial = tutorials.find(t => t._id === tutorialId);
    return tutorial ? tutorial.title : 'Unknown Tutorial';
  };

  // Render content block editor based on type
  const renderContentBlockEditor = (block, index) => {
    switch (block.type) {
      case 'text':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Text Content
            </label>
            <RichTextEditor
              value={block.data?.html || block.data?.text || ''}
              onChange={(value) => updateContentBlock(index, 'data.html', value)}
              placeholder="Enter your content here..."
            />
          </div>
        );
        
      case 'code':
        return (
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Code Snippet
              </label>
              <select
                value={block.data?.language || 'html'}
                onChange={(e) => updateContentBlock(index, 'data.language', e.target.value)}
                className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="json">JSON</option>
              </select>
            </div>
            <textarea
              value={block.data?.code || ''}
              onChange={(e) => updateContentBlock(index, 'data.code', e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="// Enter your code here..."
            ></textarea>
          </div>
        );
        
      case 'video':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Video URL (YouTube embed format)
            </label>
            <input
              type="url"
              value={block.data?.url || ''}
              onChange={(e) => updateContentBlock(index, 'data.url', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="https://www.youtube.com/embed/video-id"
            />
            <label className="block text-sm font-medium text-gray-700 mt-2 mb-1">
              Caption (optional)
            </label>
            <input
              type="text"
              value={block.data?.caption || ''}
              onChange={(e) => updateContentBlock(index, 'data.caption', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Video caption"
            />
            {block.data?.url && (
              <div className="mt-4 relative pt-[56.25%]">
                <iframe
                  className="absolute inset-0 w-full h-full rounded-md"
                  src={block.data.url}
                  title="Video preview"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>
        );
        
      case 'image':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="url"
              value={block.data?.url || ''}
              onChange={(e) => updateContentBlock(index, 'data.url', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="https://example.com/image.jpg"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alt Text
                </label>
                <input
                  type="text"
                  value={block.data?.alt || ''}
                  onChange={(e) => updateContentBlock(index, 'data.alt', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Description of the image"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Caption (optional)
                </label>
                <input
                  type="text"
                  value={block.data?.caption || ''}
                  onChange={(e) => updateContentBlock(index, 'data.caption', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Image caption"
                />
              </div>
            </div>
            {block.data?.url && (
              <div className="mt-4">
                <img 
                  src={block.data.url} 
                  alt={block.data.alt || 'Preview'} 
                  className="max-h-64 rounded-md object-contain mx-auto"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        );

      case 'quiz':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quiz Question
            </label>
            <input
              type="text"
              value={block.data?.question || ''}
              onChange={(e) => updateContentBlock(index, 'data.question', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Enter your question"
            />
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Answer Options
              </label>
              {(block.data?.options || []).map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center mb-2">
                  <input
                    type="radio"
                    name={`quiz-${index}`}
                    checked={block.data?.correctAnswer === optionIndex}
                    onChange={() => updateContentBlock(index, 'data.correctAnswer', optionIndex)}
                    className="mr-2"
                  />
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateQuizOption(index, optionIndex, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder={`Option ${optionIndex + 1}`}
                  />
                </div>
              ))}
              <p className="text-xs text-gray-500 mt-1">
                Select the radio button next to the correct answer
              </p>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="text-gray-500 italic">
            Unknown content type: {block.type}
          </div>
        );
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
          Lesson {isEditing ? 'updated' : 'created'} successfully!
        </div>
      )}
      
      {isLoading && !formData.title && isEditing ? (
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
                  placeholder="e.g., Introduction to HTML"
                  disabled={isLoading}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="tutorial" className="block text-sm font-medium text-gray-700 mb-1">
                    Tutorial *
                  </label>
                  <select
                    id="tutorial"
                    name="tutorial"
                    value={formData.tutorial}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.tutorial ? 'border-red-300' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
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
                    <p className="mt-1 text-sm text-gray-500">Loading tutorials...</p>
                  )}
                  {errors.tutorial && (
                    <p className="mt-1 text-sm text-red-600">{errors.tutorial}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-1">
                    Order *
                  </label>
                  <input
                    type="number"
                    id="order"
                    name="order"
                    value={formData.order}
                    onChange={handleChange}
                    min="1"
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.order ? 'border-red-300' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                    disabled={isLoading}
                  />
                  {errors.order && (
                    <p className="mt-1 text-sm text-red-600">{errors.order}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes) *
                  </label>
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    min="1"
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.duration ? 'border-red-300' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                    disabled={isLoading}
                  />
                  {errors.duration && (
                    <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublished"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleChange}
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  disabled={isLoading}
                />
                <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-900">
                  Publish this lesson (make it visible to users)
                </label>
              </div>

              {/* Show current assignment when editing */}
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
          
          {/* Lesson Content */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Lesson Content</h2>
              <div className="relative group">
                <button 
                  className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 flex items-center gap-2"
                  disabled={isLoading}
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
                      onClick={() => addContentBlock('code')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Code size={16} className="mr-2" />
                      Code Snippet
                    </button>
                    <button 
                      onClick={() => addContentBlock('video')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Youtube size={16} className="mr-2" />
                      YouTube Video
                    </button>
                    <button 
                      onClick={() => addContentBlock('image')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Image size={16} className="mr-2" />
                      Image
                    </button>
                    <button 
                      onClick={() => addContentBlock('quiz')}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <ExternalLink size={16} className="mr-2" />
                      Quiz
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {formData.content.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed rounded-md">
                <p className="text-gray-500 mb-2">No content blocks added yet</p>
                <p className="text-sm text-gray-400">Click "Add Content" to start building your lesson</p>
              </div>
            ) : (
              <div className="space-y-6">
                {formData.content.map((block, index) => (
                  <div key={index} className="border rounded-md p-4 relative">
                    {/* Content Block Header */}
                    <div className="flex justify-between items-center mb-3 pb-2 border-b">
                      <div className="flex items-center gap-2">
                        <span className="p-1 bg-gray-100 rounded">
                          <GripVertical size={16} className="text-gray-400" />
                        </span>
                        <h3 className="text-sm font-medium capitalize">{block.type} Block</h3>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveContentBlock(index, 'up')}
                          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                          disabled={index === 0 || isLoading}
                          title="Move Up"
                        >
                          <ArrowUp size={14} className={index === 0 ? 'opacity-50' : ''} />
                        </button>
                        <button
                          onClick={() => moveContentBlock(index, 'down')}
                          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                          disabled={index === formData.content.length - 1 || isLoading}
                          title="Move Down"
                        >
                          <ArrowDown size={14} className={index === formData.content.length - 1 ? 'opacity-50' : ''} />
                        </button>
                        <button
                          onClick={() => removeContentBlock(index)}
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded-md"
                          title="Remove Block"
                          disabled={isLoading}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    
                    {/* Content Block Editor */}
                    {renderContentBlockEditor(block, index)}
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
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || isTutorialsLoading}
              className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Save size={18} />
              {isLoading ? 'Saving...' : 'Save Lesson'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonEditor;