// src/components/EditorJS/EditorJSComponent.jsx
import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Paragraph from '@editorjs/paragraph';
import List from '@editorjs/list';
import Code from '@editorjs/code';
import Quote from '@editorjs/quote';
import Delimiter from '@editorjs/delimiter';
import Table from '@editorjs/table';
import Warning from '@editorjs/warning';
import Embed from '@editorjs/embed';
import Image from '@editorjs/image';

const EditorJSComponent = forwardRef(({ 
  data, // Changed from initialData to data
  onChange, // Changed from onDataChange to onChange
  placeholder = "Start writing your lesson content...", 
  readOnly = false, 
  className = ""
}, ref) => {
  const editorRef = useRef(null);
  const editorInstance = useRef(null);
  const isInitialized = useRef(false);
  const isReady = useRef(false);
  const changeTimeout = useRef(null);
  const editorId = useRef(`editor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

  useImperativeHandle(ref, () => ({
    save: async () => {
      if (editorInstance.current && isReady.current && typeof editorInstance.current.save === 'function') {
        try {
          const savedData = await editorInstance.current.save();
          console.log('💾 Editor saved:', savedData);
          return savedData;
        } catch (error) {
          console.error('❌ Save error:', error);
          throw error;
        }
      } else if (editorInstance.current && editorInstance.current.isReady) {
        // Try waiting for ready state
        try {
          await editorInstance.current.isReady;
          const savedData = await editorInstance.current.save();
          console.log('💾 Editor saved after waiting:', savedData);
          return savedData;
        } catch (error) {
          console.error('❌ Save error after waiting:', error);
          throw error;
        }
      }
      console.warn('⚠️ Editor instance not ready for saving');
      return null;
    },
    clear: async () => {
      if (editorInstance.current && isReady.current && typeof editorInstance.current.clear === 'function') {
        try {
          await editorInstance.current.clear();
          console.log('🧹 Editor cleared');
        } catch (error) {
          console.error('❌ Clear error:', error);
        }
      }
    }
  }));

  // Initialize editor
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 EditorJSComponent mounting...');
    }
    
    // Use a longer timeout to ensure DOM is ready and avoid race conditions
    const initTimeout = setTimeout(() => {
      if (editorRef.current && !isInitialized.current) {
        initEditor();
      }
    }, 200);

    return () => {
      clearTimeout(initTimeout);
      if (process.env.NODE_ENV === 'development') {
        console.log('🗑️ EditorJSComponent unmounting...');
      }
      // Use async cleanup
      (async () => {
        await destroyEditor();
      })();
    };
  }, []); // Only run once on mount

  // Handle data changes
  useEffect(() => {
    if (editorInstance.current && isInitialized.current && isReady.current && data) {
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Data prop changed, updating editor...');
      }
      updateEditorData(data);
    }
  }, [data]);

  const handleChange = async (api) => {
    // Clear existing timeout
    if (changeTimeout.current) {
      clearTimeout(changeTimeout.current);
    }

    // Debounce the onChange call
    changeTimeout.current = setTimeout(async () => {
      if (onChange && !readOnly && isReady.current && typeof api.saver.save === 'function') {
        try {
          const savedData = await api.saver.save();
          console.log('📝 Content changed:', savedData);
          onChange(savedData);
        } catch (error) {
          console.error('❌ onChange error:', error);
        }
      }
    }, 300);
  };

  const updateEditorData = async (newData) => {
    try {
      if (editorInstance.current && isReady.current && typeof editorInstance.current.render === 'function') {
        await editorInstance.current.render(newData);
        console.log('✅ Editor data updated');
      } else if (editorInstance.current && editorInstance.current.isReady) {
        // Wait for ready state
        await editorInstance.current.isReady;
        if (typeof editorInstance.current.render === 'function') {
          await editorInstance.current.render(newData);
          console.log('✅ Editor data updated after waiting');
        }
      }
    } catch (error) {
      console.error('❌ Error updating editor data:', error);
    }
  };

  const initEditor = async () => {
    // Prevent double initialization
    if (isInitialized.current || isReady.current) {
      if (process.env.NODE_ENV === 'development') {
        console.log('⏭️ Editor already initialized or initializing');
      }
      return;
    }

    // Ensure the holder is clean before initializing
    if (editorRef.current) {
      // Remove any existing content and EditorJS classes
      editorRef.current.innerHTML = '';
      editorRef.current.className = 'editor-holder';
    }

    // Double check that we don't have an existing instance
    if (editorInstance.current) {
      await destroyEditor();
    }

    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('🚀 Initializing editor with data:', data);
      }
      
      const editorConfig = {
        holder: editorId.current,
        placeholder,
        readOnly,
        data: data || {
          time: Date.now(),
          blocks: [],
          version: "2.28.2"
        },
        tools: {
          header: {
            class: Header,
            config: {
              placeholder: 'Enter heading',
              levels: [2, 3, 4],
              defaultLevel: 2
            }
          },
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
            config: {
              placeholder: 'Start typing...'
            }
          },
          list: {
            class: List,
            inlineToolbar: true
          },
          code: {
            class: Code,
            config: {
              placeholder: 'Enter code...'
            }
          },
          quote: {
            class: Quote,
            inlineToolbar: true,
            config: {
              quotePlaceholder: 'Enter a quote',
              captionPlaceholder: 'Quote author'
            }
          },
          warning: {
            class: Warning,
            inlineToolbar: true,
            config: {
              titlePlaceholder: 'Title',
              messagePlaceholder: 'Message'
            }
          },
          delimiter: Delimiter,
          table: {
            class: Table,
            inlineToolbar: true
          },
          embed: {
            class: Embed,
            config: {
              services: {
                youtube: true,
                codepen: true
              }
            }
          },
          image: {
            class: Image,
            config: {
              uploader: {
                uploadByUrl: async (url) => {
                  try {
                    new URL(url);
                    return {
                      success: 1,
                      file: { url }
                    };
                  } catch {
                    return {
                      success: 0,
                      error: 'Invalid URL'
                    };
                  }
                }
              }
            }
          }
        },
        onChange: handleChange
      };

      const editor = new EditorJS(editorConfig);
      editorInstance.current = editor;
      isInitialized.current = true;

      // Wait for editor to be ready and set the ready flag
      try {
        await editor.isReady;
        isReady.current = true;
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ Editor ready!');
        }
      } catch (readyError) {
        console.error('❌ Editor ready failed:', readyError);
        isReady.current = false;
        // Clean up on failed ready
        editorInstance.current = null;
        isInitialized.current = false;
      }

    } catch (error) {
      console.error('❌ Editor init error:', error);
      isInitialized.current = false;
      isReady.current = false;
      editorInstance.current = null;
      
      // Clean up the holder element on failed init
      if (editorRef.current) {
        editorRef.current.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;">Editor failed to initialize. Please refresh the page.</div>';
      }
    }
  };

  const destroyEditor = async () => {
    // Clear any pending timeouts
    if (changeTimeout.current) {
      clearTimeout(changeTimeout.current);
    }

    if (editorInstance.current) {
      try {
        // Wait for editor to be ready before attempting to destroy
        if (isReady.current && typeof editorInstance.current.destroy === 'function') {
          await editorInstance.current.destroy();
          if (process.env.NODE_ENV === 'development') {
            console.log('🗑️ Editor destroyed successfully');
          }
        } else if (editorInstance.current.isReady) {
          // Try waiting for the editor to be ready
          try {
            await editorInstance.current.isReady;
            if (typeof editorInstance.current.destroy === 'function') {
              await editorInstance.current.destroy();
              if (process.env.NODE_ENV === 'development') {
                console.log('🗑️ Editor destroyed after waiting for ready');
              }
            }
          } catch (destroyError) {
            if (process.env.NODE_ENV === 'development') {
              console.log('🗑️ Editor destroy failed, clearing manually');
            }
          }
        } else {
          if (process.env.NODE_ENV === 'development') {
            console.log('🗑️ Editor not ready or destroy method unavailable, clearing reference');
          }
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('⚠️ Error destroying editor:', error);
        }
      } finally {
        editorInstance.current = null;
        isInitialized.current = false;
        isReady.current = false;
      }
    }

    // Aggressive DOM cleanup to prevent duplicates
    if (editorRef.current) {
      // Remove all child elements
      while (editorRef.current.firstChild) {
        editorRef.current.removeChild(editorRef.current.firstChild);
      }
      
      // Reset all attributes and classes
      editorRef.current.className = 'editor-holder';
      editorRef.current.removeAttribute('style');
      editorRef.current.innerHTML = '';
      
      // Remove any EditorJS specific attributes
      const editorElement = editorRef.current.querySelector('[data-empty="true"]');
      if (editorElement) {
        editorElement.remove();
      }
    }
  };

  return (
    <div className={`editor-container ${className}`}>
      {!readOnly && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-xs text-blue-600">
            💡 Click the <strong>+</strong> button to add content blocks
          </div>
        </div>
      )}
      
      <div 
        ref={editorRef}
        id={editorId.current}
        className="editor-holder"
        style={{
          minHeight: readOnly ? 'auto' : '300px',
          border: readOnly ? 'none' : '2px solid #e5e7eb',
          borderRadius: '8px',
          padding: readOnly ? '0' : '20px',
          backgroundColor: readOnly ? 'transparent' : 'white'
        }}
      />
      
      <style>{`
        .editor-container {
          position: relative;
        }
        
        .editor-holder {
          position: relative;
        }
        
        /* Ensure only one editor instance is visible */
        .editor-holder .codex-editor {
          position: relative;
        }
        
        /* Hide duplicate editor instances */
        .editor-holder .codex-editor:not(:first-child) {
          display: none !important;
        }
        
        .editor-container .ce-toolbar__plus {
          color: #059669 !important;
          background: #f0fdf4 !important;
          border-radius: 6px !important;
        }
        
        .editor-container .ce-toolbar__plus:hover {
          background: #059669 !important;
          color: white !important;
        }
        
        .editor-container .ce-paragraph {
          line-height: 1.7;
          font-size: 16px;
        }
        
        .editor-container .ce-code__textarea {
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-family: Monaco, monospace;
          font-size: 14px;
          padding: 16px;
        }
        
        .editor-container .cdx-quote {
          border-left: 4px solid #059669;
          background: #f0fdf4;
          padding: 20px;
          margin: 20px 0;
          border-radius: 8px;
        }
        
        .editor-container .cdx-warning {
          background: #fef3c7;
          border: 2px solid #f59e0b;
          padding: 20px;
          margin: 20px 0;
          border-radius: 8px;
        }
        
        .editor-container h2.ce-header {
          font-size: 2rem;
          font-weight: 700;
          margin: 30px 0 15px 0;
          color: #1f2937;
        }
        
        .editor-container h3.ce-header {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 25px 0 12px 0;
          color: #374151;
        }
        
        .editor-container h4.ce-header {
          font-size: 1.25rem;
          font-weight: 500;
          margin: 20px 0 10px 0;
          color: #4b5563;
        }
        
        .editor-container .image-tool__image {
          max-width: 100%;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .editor-container .image-tool__caption {
          text-align: center;
          font-style: italic;
          color: #6b7280;
          margin-top: 10px;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
});

EditorJSComponent.displayName = 'EditorJSComponent';

export default EditorJSComponent;