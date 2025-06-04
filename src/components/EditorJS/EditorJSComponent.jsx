// src/components/EditorJS/EditorJSComponent.jsx
import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

// EditorJS imports
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
  data, 
  onChange, 
  placeholder = "Let's write an awesome lesson!",
  readOnly = false,
  className = ""
}, ref) => {
  const editorRef = useRef(null);
  const editorInstanceRef = useRef(null);
  const isInitialized = useRef(false);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    save: async () => {
      if (editorInstanceRef.current) {
        try {
          const outputData = await editorInstanceRef.current.save();
          return outputData;
        } catch (error) {
          console.error('Error saving editor data:', error);
          throw error;
        }
      }
      return null;
    },
    clear: () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.clear();
      }
    },
    render: (data) => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.render(data);
      }
    },
    destroy: () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy();
        editorInstanceRef.current = null;
        isInitialized.current = false;
      }
    }
  }));

  useEffect(() => {
    // Initialize EditorJS only once
    if (!isInitialized.current && editorRef.current) {
      initializeEditor();
    }

    return () => {
      // Cleanup on unmount
      if (editorInstanceRef.current) {
        try {
          editorInstanceRef.current.destroy();
        } catch (error) {
          console.warn('Error destroying editor:', error);
        }
        editorInstanceRef.current = null;
        isInitialized.current = false;
      }
    };
  }, []);

  // Update editor data when prop changes
  useEffect(() => {
    if (editorInstanceRef.current && data && isInitialized.current) {
      try {
        editorInstanceRef.current.render(data);
      } catch (error) {
        console.error('Error rendering data:', error);
      }
    }
  }, [data]);

  const initializeEditor = () => {
    try {
      const editorConfig = {
        holder: editorRef.current,
        placeholder: placeholder,
        readOnly: readOnly,
        
        // Configure tools
        tools: {
          header: {
            class: Header,
            config: {
              placeholder: 'Enter a header',
              levels: [2, 3, 4],
              defaultLevel: 3
            }
          },
          
          paragraph: {
            class: Paragraph,
            inlineToolbar: true,
            config: {
              placeholder: 'Tell your story...',
            }
          },
          
          list: {
            class: List,
            inlineToolbar: true,
            config: {
              defaultStyle: 'unordered'
            }
          },
          
          code: {
            class: Code,
            config: {
              placeholder: 'Enter code here...'
            }
          },
          
          quote: {
            class: Quote,
            inlineToolbar: true,
            shortcut: 'CMD+SHIFT+O',
            config: {
              quotePlaceholder: 'Enter a quote',
              captionPlaceholder: 'Quote\'s author',
            }
          },
          
          warning: {
            class: Warning,
            inlineToolbar: true,
            shortcut: 'CMD+SHIFT+W',
            config: {
              titlePlaceholder: 'Title',
              messagePlaceholder: 'Message',
            }
          },
          
          delimiter: Delimiter,
          
          table: {
            class: Table,
            inlineToolbar: true,
            config: {
              rows: 2,
              cols: 3,
            }
          },
          
          embed: {
            class: Embed,
            config: {
              services: {
                youtube: true,
                coub: true,
                codepen: {
                  regex: /https?:\/\/codepen.io\/([^\/\?\&]*)\/pen\/([^\/\?\&]*)/,
                  embedUrl: 'https://codepen.io/<%= remote_id %>?height=300&theme-id=0&default-tab=css,result&embed-version=2',
                  html: "<iframe height='300' scrolling='no' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'></iframe>",
                  height: 300,
                  width: 600,
                  id: (groups) => groups.join('/embed/')
                }
              }
            }
          },
          
          // Simplified image tool - URL only
          image: {
            class: Image,
            config: {
              captionPlaceholder: 'Enter image caption',
              buttonContent: 'Select an image',
              uploader: {
                // Only support URL-based images
                uploadByUrl: async (url) => {
                  try {
                    // Basic URL validation
                    new URL(url);
                    
                    // Check if URL looks like an image
                    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
                    const hasImageExtension = imageExtensions.some(ext => 
                      url.toLowerCase().includes(ext)
                    );
                    
                    // Allow common image hosting domains even without extension
                    const imageDomains = [
                      'imgur.com', 'i.imgur.com',
                      'unsplash.com', 'images.unsplash.com',
                      'pixabay.com', 'cdn.pixabay.com',
                      'pexels.com', 'images.pexels.com',
                      'githubusercontent.com', 'raw.githubusercontent.com',
                      'cloudinary.com', 'res.cloudinary.com',
                      'amazonaws.com', 's3.amazonaws.com',
                      'googleusercontent.com',
                      'cdn.jsdelivr.net',
                      'cdnjs.cloudflare.com'
                    ];
                    
                    const isFromImageDomain = imageDomains.some(domain => 
                      url.includes(domain)
                    );
                    
                    if (!hasImageExtension && !isFromImageDomain) {
                      throw new Error('URL does not appear to be an image. Please use a direct image URL or a URL from a known image hosting service.');
                    }
                    
                    return {
                      success: 1,
                      file: {
                        url: url
                      }
                    };
                  } catch (error) {
                    console.error('URL validation error:', error);
                    return {
                      success: 0,
                      error: error.message || 'Invalid image URL'
                    };
                  }
                }
              }
            }
          }
        },
        
        // Initial data
        data: data || {
          time: Date.now(),
          blocks: [],
          version: "2.28.2"
        },
        
        // Handle changes
        onChange: async (api, event) => {
          if (onChange && !readOnly) {
            try {
              const data = await api.saver.save();
              onChange(data);
            } catch (error) {
              console.error('Error on change:', error);
            }
          }
        },
        
        // Additional configuration
        autofocus: false,
        hideToolbar: false,
        
        // i18n configuration
        i18n: {
          messages: {
            ui: {
              "blockTunes": {
                "toggler": {
                  "Click to tune": "Click to tune",
                  "or drag to move": "or drag to move"
                }
              },
              "inlineToolbar": {
                "converter": {
                  "Convert to": "Convert to"
                }
              },
              "toolbar": {
                "toolbox": {
                  "Add": "Add"
                }
              }
            },
            "toolNames": {
              "Text": "Text",
              "Heading": "Heading",
              "List": "List",
              "Warning": "Warning",
              "Checklist": "Checklist",
              "Quote": "Quote",
              "Code": "Code",
              "Delimiter": "Delimiter",
              "Raw HTML": "Raw HTML",
              "Table": "Table",
              "Link": "Link",
              "Marker": "Marker",
              "Bold": "Bold",
              "Italic": "Italic",
              "InlineCode": "Inline Code",
              "Image": "Image"
            },
            "tools": {
              "image": {
                "Caption": "Caption",
                "Select an Image": "Select an Image",
                "With border": "With border",
                "Stretch image": "Stretch image",
                "With background": "With background"
              }
            }
          }
        }
      };

      editorInstanceRef.current = new EditorJS(editorConfig);
      isInitialized.current = true;

      // Handle ready state
      editorInstanceRef.current.isReady
        .then(() => {
          console.log('EditorJS is ready to work!');
        })
        .catch((reason) => {
          console.error('EditorJS initialization failed:', reason);
        });

    } catch (error) {
      console.error('Error initializing EditorJS:', error);
    }
  };

  return (
    <div className={`editorjs-container ${className}`}>
      <div 
        ref={editorRef}
        className="editorjs-editor"
        style={{
          minHeight: '200px',
          border: '1px solid #e5e7eb',
          borderRadius: '0.375rem',
          padding: '1rem'
        }}
      />
      
      <style jsx>{`
        .editorjs-editor {
          background-color: white;
        }
        
        .editorjs-editor .codex-editor__redactor {
          padding-bottom: 50px !important;
        }
        
        .editorjs-editor .ce-block__content,
        .editorjs-editor .ce-toolbar__content {
          max-width: none;
        }
        
        .editorjs-editor .ce-toolbox {
          color: #374151;
        }
        
        .editorjs-editor .ce-toolbar__plus {
          color: #059669;
        }
        
        .editorjs-editor .ce-toolbar__settings-btn {
          color: #059669;
        }
        
        .editorjs-editor .ce-inline-toolbar {
          color: #374151;
        }
        
        .editorjs-editor .ce-conversion-toolbar {
          color: #374151;
        }
        
        /* Code block styling */
        .editorjs-editor .ce-code__textarea {
          background-color: #f3f4f6;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 14px;
          line-height: 1.5;
        }
        
        /* Quote styling */
        .editorjs-editor .cdx-quote {
          border-left: 4px solid #059669;
          padding-left: 1rem;
          margin: 1rem 0;
          background-color: #f0fdf4;
        }
        
        /* Warning block styling */
        .editorjs-editor .cdx-warning {
          background-color: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 1rem;
          border-radius: 0.375rem;
        }
        
        /* Header styling */
        .editorjs-editor h2.ce-header {
          font-size: 1.875rem;
          font-weight: 700;
          margin: 1rem 0 0.5rem 0;
        }
        
        .editorjs-editor h3.ce-header {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 1rem 0 0.5rem 0;
        }
        
        .editorjs-editor h4.ce-header {
          font-size: 1.25rem;
          font-weight: 500;
          margin: 1rem 0 0.5rem 0;
        }
        
        /* List styling */
        .editorjs-editor .cdx-list {
          margin: 0.5rem 0;
        }
        
        .editorjs-editor .cdx-list__item {
          line-height: 1.6;
          margin: 0.25rem 0;
        }
        
        /* Table styling */
        .editorjs-editor .tc-table {
          border-collapse: collapse;
          width: 100%;
          margin: 1rem 0;
        }
        
        .editorjs-editor .tc-table td {
          border: 1px solid #d1d5db;
          padding: 0.5rem;
        }
        
        /* Image styling */
        .editorjs-editor .image-tool {
          margin: 1rem 0;
        }
        
        .editorjs-editor .image-tool__image {
          border-radius: 0.375rem;
          max-width: 100%;
          height: auto;
        }
        
        .editorjs-editor .image-tool__caption {
          margin-top: 0.5rem;
          text-align: center;
          font-style: italic;
          color: #6b7280;
          font-size: 0.875rem;
        }
        
        /* Embed styling */
        .editorjs-editor .embed-tool {
          margin: 1rem 0;
        }
        
        .editorjs-editor .embed-tool__caption {
          margin-top: 0.5rem;
          text-align: center;
          font-style: italic;
          color: #6b7280;
          font-size: 0.875rem;
        }
        
        /* Image URL input styling */
        .editorjs-editor .image-tool__url-input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 14px;
          margin-bottom: 0.5rem;
        }
        
        .editorjs-editor .image-tool__url-button {
          background-color: #059669;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 0.375rem;
          cursor: pointer;
          font-size: 14px;
        }
        
        .editorjs-editor .image-tool__url-button:hover {
          background-color: #047857;
        }
      `}</style>
    </div>
  );
});

EditorJSComponent.displayName = 'EditorJSComponent';

export default EditorJSComponent;