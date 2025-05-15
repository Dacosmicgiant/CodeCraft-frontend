import { useState, useEffect } from 'react';

// This hook would normally fetch data from an API
// For now, we'll use mock data
export const useTutorial = (topicId, pageId) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tutorial, setTutorial] = useState(null);
  
  useEffect(() => {
    const fetchTutorial = async () => {
      try {
        setLoading(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Get data from mock
        const tutorialData = mockTutorials[topicId]?.[pageId];
        
        if (!tutorialData) {
          throw new Error('Tutorial not found');
        }
        
        setTutorial(tutorialData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchTutorial();
  }, [topicId, pageId]);
  
  return { tutorial, loading, error };
};

// Mock data for tutorials
const mockTutorials = {
  html: {
    introduction: {
      title: 'HTML Introduction',
      introduction: 'HTML (Hypertext Markup Language) is the standard markup language for creating web pages.',
      sections: [
        {
          title: 'What is HTML?',
          text: 'HTML stands for Hyper Text Markup Language. It is the standard markup language for creating Web pages and describes the structure of a Web page.\n\nHTML consists of a series of elements that tell the browser how to display the content. HTML elements label pieces of content such as "this is a heading", "this is a paragraph", "this is a link", etc.'
        },
        {
          title: 'A Simple HTML Document',
          text: 'The following is a simple HTML document example:',
          code: `<!DOCTYPE html>
<html>
<head>
  <title>Page Title</title>
</head>
<body>
  <h1>My First Heading</h1>
  <p>My first paragraph.</p>
</body>
</html>`,
          note: 'HTML documents begin with a document type declaration: <!DOCTYPE html>.'
        },
        {
          title: 'HTML Elements',
          text: 'An HTML element is defined by a start tag, some content, and an end tag:',
          code: '<tagname>Content goes here...</tagname>',
          text: 'Examples of HTML elements include headings, paragraphs, links, images, lists, and many more.'
        }
      ]
    },
    basics: {
      title: 'HTML Basics',
      introduction: 'Learn the fundamental building blocks of HTML documents.',
      sections: [
        {
          title: 'HTML Document Structure',
          text: 'All HTML documents must start with a document type declaration: <!DOCTYPE html>.\n\nThe HTML document itself begins with <html> and ends with </html>.\n\nThe visible part of the HTML document is between <body> and </body>.'
        },
        {
          title: 'HTML Headings',
          text: 'HTML headings are defined with the <h1> to <h6> tags. <h1> defines the most important heading. <h6> defines the least important heading.',
          code: `<h1>This is heading 1</h1>
<h2>This is heading 2</h2>
<h3>This is heading 3</h3>`,
          output: '<h1 style="font-size:28px">This is heading 1</h1><h2 style="font-size:22px">This is heading 2</h2><h3 style="font-size:18px">This is heading 3</h3>'
        }
      ]
    }
  },
  css: {
    introduction: {
      title: 'CSS Introduction',
      introduction: 'CSS (Cascading Style Sheets) is used to style and layout web pages.',
      sections: [
        {
          title: 'What is CSS?',
          text: 'CSS stands for Cascading Style Sheets. CSS describes how HTML elements are to be displayed on screen, paper, or in other media. CSS saves a lot of work. It can control the layout of multiple web pages all at once.'
        },
        {
          title: 'CSS Syntax',
          text: 'A CSS rule consists of a selector and a declaration block:',
          code: `selector {
  property: value;
  property: value;
}`,
          note: 'The selector points to the HTML element you want to style. The declaration block contains one or more declarations separated by semicolons.'
        }
      ]
    }
  },
  javascript: {
    introduction: {
      title: 'JavaScript Introduction',
      introduction: 'JavaScript is the programming language of the Web.',
      sections: [
        {
          title: 'What is JavaScript?',
          text: 'JavaScript is a lightweight, interpreted programming language. It is designed for creating network-centric applications. It is complementary to and integrated with Java. JavaScript is very easy to implement because it is integrated with HTML. It is open and cross-platform.'
        },
        {
          title: 'What Can JavaScript Do?',
          text: 'JavaScript gives HTML designers a programming tool.\n\nJavaScript can put dynamic text into an HTML page.\n\nJavaScript can react to events.\n\nJavaScript can read and write HTML elements.\n\nJavaScript can be used to validate data.\n\nJavaScript can be used to create cookies.\n\nJavaScript can be used to detect the visitor\'s browser.'
        }
      ]
    }
  },
  react: {
    introduction: {
      title: 'React Introduction',
      introduction: 'React is a JavaScript library for building user interfaces.',
      sections: [
        {
          title: 'What is React?',
          text: 'React is a JavaScript library created by Facebook. React is a User Interface (UI) library. React is a tool for building UI components.'
        },
        {
          title: 'Why Learn React?',
          text: 'React is a popular library with a large community and job market.\n\nReact is component-based, which means you can build encapsulated components that manage their own state, then compose them to make complex UIs.\n\nReact uses a virtual DOM, which makes it fast and efficient when updating the UI.'
        }
      ]
    }
  }
};