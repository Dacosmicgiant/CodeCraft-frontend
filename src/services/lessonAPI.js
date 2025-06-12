// src/services/lessonAPI.js
import api from './api';

const lessonAPI = {
  // Create a new lesson for a specific tutorial
  create: async (tutorialId, lessonData) => {
    const response = await api.post(`/tutorials/${tutorialId}/lessons`, lessonData);
    return response.data;
  },

  // Get all lessons (with pagination and filters)
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    if (params.tutorial) queryParams.append('tutorial', params.tutorial);
    if (params.published !== undefined) queryParams.append('published', params.published);
    
    const response = await api.get(`/lessons?${queryParams.toString()}`);
    return response.data;
  },

  // Get lessons by tutorial ID
  getByTutorial: async (tutorialId) => {
    const response = await api.get(`/tutorials/${tutorialId}/lessons`);
    return response.data;
  },

  // Get lesson by ID
  getById: async (lessonId) => {
    const response = await api.get(`/lessons/${lessonId}`);
    return response.data;
  },

  // Update lesson
  update: async (lessonId, lessonData) => {
    const response = await api.put(`/lessons/${lessonId}`, lessonData);
    return response.data;
  },

  // Update only lesson content
  updateContent: async (lessonId, content) => {
    const response = await api.put(`/lessons/${lessonId}/content`, { content });
    return response.data;
  },

  // Delete lesson
  delete: async (lessonId) => {
    const response = await api.delete(`/lessons/${lessonId}`);
    return response.data;
  },

  // Duplicate lesson
  duplicate: async (lessonId) => {
    const response = await api.post(`/lessons/${lessonId}/duplicate`);
    return response.data;
  },

  // Toggle publish status
  togglePublish: async (lessonId, isPublished) => {
    const response = await api.put(`/lessons/${lessonId}`, { isPublished });
    return response.data;
  },

  // Reorder lessons within a tutorial
  reorder: async (tutorialId, lessonOrders) => {
    const response = await api.put(`/tutorials/${tutorialId}/lessons/reorder`, { lessonOrders });
    return response.data;
  },

  // Export lesson in different formats
  export: async (lessonId, format = 'json') => {
    try {
      const lesson = await lessonAPI.getById(lessonId);
      
      if (!lesson.success) {
        throw new Error(lesson.message || 'Failed to fetch lesson');
      }
      
      const lessonData = lesson.data;
      let exportData;
      
      switch (format) {
        case 'json':
          exportData = JSON.stringify(lessonData, null, 2);
          break;
          
        case 'html':
          exportData = lessonAPI.convertToHTML(lessonData);
          break;
          
        case 'text':
          exportData = lessonAPI.convertToText(lessonData);
          break;
          
        default:
          throw new Error('Unsupported export format');
      }
      
      return {
        success: true,
        data: exportData,
        filename: `${lessonData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${format}`
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Export failed'
      };
    }
  },

  // Convert EditorJS content to HTML
  convertToHTML: (lessonData) => {
    let html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${lessonData.title}</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
        h1, h2, h3, h4, h5, h6 { color: #333; }
        code { background: #f4f4f4; padding: 2px 4px; border-radius: 3px; }
        pre { background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; }
        blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 20px; font-style: italic; }
        img { max-width: 100%; height: auto; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .delimiter { text-align: center; margin: 30px 0; font-size: 24px; color: #ddd; }
    </style>
</head>
<body>
    <h1>${lessonData.title}</h1>
    <div class="meta">
        <p><strong>Duration:</strong> ${lessonData.duration} minutes</p>
        <p><strong>Order:</strong> #${lessonData.order}</p>
        <p><strong>Status:</strong> ${lessonData.isPublished ? 'Published' : 'Draft'}</p>
    </div>
    <hr>
`;

    if (lessonData.content && lessonData.content.blocks) {
      lessonData.content.blocks.forEach(block => {
        html += lessonAPI.convertBlockToHTML(block);
      });
    }

    html += `
</body>
</html>`;

    return html;
  },

  // Convert EditorJS block to HTML
  convertBlockToHTML: (block) => {
    switch (block.type) {
      case 'paragraph':
        return `<p>${block.data.text || ''}</p>\n`;
        
      case 'header':
        const level = block.data.level || 1;
        return `<h${level}>${block.data.text || ''}</h${level}>\n`;
        
      case 'list':
        const tag = block.data.style === 'ordered' ? 'ol' : 'ul';
        const items = (block.data.items || []).map(item => `<li>${item}</li>`).join('\n');
        return `<${tag}>\n${items}\n</${tag}>\n`;
        
      case 'code':
        return `<pre><code>${block.data.code || ''}</code></pre>\n`;
        
      case 'quote':
        const text = block.data.text || '';
        const caption = block.data.caption ? `<cite>${block.data.caption}</cite>` : '';
        return `<blockquote>${text}${caption}</blockquote>\n`;
        
      case 'image':
        const url = block.data.file?.url || block.data.url || '';
        const alt = block.data.caption || block.data.alt || '';
        return `<img src="${url}" alt="${alt}" />\n`;
        
      case 'table':
        if (!block.data.content || !Array.isArray(block.data.content)) return '';
        let tableHTML = '<table>\n';
        block.data.content.forEach((row, index) => {
          const tag = index === 0 ? 'th' : 'td';
          const cells = row.map(cell => `<${tag}>${cell}</${tag}>`).join('');
          tableHTML += `<tr>${cells}</tr>\n`;
        });
        tableHTML += '</table>\n';
        return tableHTML;
        
      case 'delimiter':
        return '<div class="delimiter">* * *</div>\n';
        
      case 'embed':
        return `<div class="embed">${block.data.embed || ''}</div>\n`;
        
      default:
        return `<!-- Unknown block type: ${block.type} -->\n`;
    }
  },

  // Convert EditorJS content to plain text
  convertToText: (lessonData) => {
    let text = `${lessonData.title}\n${'='.repeat(lessonData.title.length)}\n\n`;
    text += `Duration: ${lessonData.duration} minutes\n`;
    text += `Order: #${lessonData.order}\n`;
    text += `Status: ${lessonData.isPublished ? 'Published' : 'Draft'}\n\n`;
    text += `${'-'.repeat(50)}\n\n`;

    if (lessonData.content && lessonData.content.blocks) {
      lessonData.content.blocks.forEach(block => {
        text += lessonAPI.convertBlockToText(block);
      });
    }

    return text;
  },

  // Convert EditorJS block to plain text
  convertBlockToText: (block) => {
    switch (block.type) {
      case 'paragraph':
        return `${block.data.text?.replace(/<[^>]*>/g, '') || ''}\n\n`;
        
      case 'header':
        const text = block.data.text?.replace(/<[^>]*>/g, '') || '';
        const level = block.data.level || 1;
        const underline = ['=', '-', '~', '^', '+', '*'][level - 1] || '-';
        return `${text}\n${underline.repeat(text.length)}\n\n`;
        
      case 'list':
        const items = (block.data.items || []).map((item, index) => {
          const cleanItem = item.replace(/<[^>]*>/g, '');
          return block.data.style === 'ordered' 
            ? `${index + 1}. ${cleanItem}` 
            : `• ${cleanItem}`;
        }).join('\n');
        return `${items}\n\n`;
        
      case 'code':
        return `\`\`\`\n${block.data.code || ''}\n\`\`\`\n\n`;
        
      case 'quote':
        const quoteText = block.data.text?.replace(/<[^>]*>/g, '') || '';
        const caption = block.data.caption ? `\n— ${block.data.caption}` : '';
        return `> ${quoteText}${caption}\n\n`;
        
      case 'image':
        const alt = block.data.caption || block.data.alt || 'Image';
        return `[${alt}]\n\n`;
        
      case 'table':
        if (!block.data.content || !Array.isArray(block.data.content)) return '';
        let tableText = '';
        block.data.content.forEach((row, rowIndex) => {
          tableText += row.join(' | ') + '\n';
          if (rowIndex === 0) {
            tableText += row.map(() => '---').join(' | ') + '\n';
          }
        });
        return `${tableText}\n`;
        
      case 'delimiter':
        return '* * *\n\n';
        
      default:
        return '';
    }
  }
};

export default lessonAPI;