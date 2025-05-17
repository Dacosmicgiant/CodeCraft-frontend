import { useState } from 'react';
import TutorialContent from '../../components/tutorial/TutorialContent';
import NotesComponent from '../../components/tutorial/NotesComponent';
import ResourceList from '../../components/tutorial/ResourceList';
import { Link } from 'react-router-dom';
import { ArrowLeft, Bookmark, Share2 } from 'lucide-react';

const HTMLTutorial = () => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // HTML tutorial content with digital notes and YouTube embeds
  const tutorialContent = {
    title: 'HTML Fundamentals',
    introduction: 'HTML (HyperText Markup Language) is the standard markup language for creating web pages. Learn the basics of HTML to build the structure of your web pages.',
    videoUrl: 'https://www.youtube.com/embed/UB1O30fR-EE', // Main tutorial video
    sections: [
      {
        title: 'What is HTML?',
        text: 'HTML stands for HyperText Markup Language. It is the standard markup language for creating Web pages. HTML describes the structure of a Web page and consists of a series of elements that tell the browser how to display the content.\n\nHTML elements are represented by tags, written using angle brackets. Tags usually come in pairs like <p> and </p>, with the first tag being the start tag and the second tag being the end tag. The content goes between the start and end tags.',
        videoUrl: 'https://www.youtube.com/embed/MDLn5-zSQQI', // Section-specific video
      },
      {
        title: 'HTML Document Structure',
        text: 'An HTML document has a specific structure that includes several key elements. Every HTML page should begin with a document type declaration: <!DOCTYPE html>. Then, the HTML document itself begins with <html> and ends with </html>.\n\nWithin the HTML tags, there are two main sections: the head and the body. The head section contains meta-information about the document, such as the title, character set, and links to external resources. The body section contains the visible content of the page.',
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
        language: 'html',
        codeTitle: 'Basic HTML Document Structure',
        output: '<h1 style="font-size:24px">My First Heading</h1><p>My first paragraph.</p>',
      },
      {
        title: 'HTML Elements',
        text: 'HTML elements are the building blocks of HTML pages. An HTML element is defined by a start tag, some content, and an end tag. Some common HTML elements include headings, paragraphs, links, images, lists, and tables.',
        code: `<h1>This is heading 1</h1>
<h2>This is heading 2</h2>
<h3>This is heading 3</h3>
<p>This is a paragraph.</p>
<a href="https://www.example.com">This is a link</a>
<img src="image.jpg" alt="Description of image">
<ul>
  <li>List item 1</li>
  <li>List item 2</li>
</ul>`,
        language: 'html',
        codeTitle: 'Common HTML Elements',
        videoUrl: 'https://www.youtube.com/embed/2JE8R9KfJwI', // Section-specific video
      },
      {
        title: 'HTML Attributes',
        text: 'HTML attributes provide additional information about HTML elements. Attributes are always specified in the start tag and usually come in name/value pairs like name="value".',
        code: `<a href="https://www.example.com">Visit Example.com</a>
<img src="image.jpg" alt="Description of image" width="500" height="300">
<p style="color:blue;">This is a blue paragraph.</p>`,
        language: 'html',
        codeTitle: 'HTML Attributes',
        note: 'The href attribute specifies the URL of the page the link goes to. The src attribute specifies the path to the image. The alt attribute provides alternative text for an image.',
      },
    ],
  };
  
  // Additional resources for the HTML tutorial
  const additionalResources = [
    {
      title: 'MDN Web Docs - HTML',
      url: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
      description: 'Comprehensive documentation on HTML elements, attributes, and best practices.',
      type: 'documentation'
    },
    {
      title: 'HTML Crash Course For Absolute Beginners',
      url: 'https://www.youtube.com/watch?v=UB1O30fR-EE',
      description: 'A complete crash course on HTML fundamentals for beginners.',
      author: 'Traversy Media',
      type: 'video'
    },
    {
      title: 'W3Schools HTML Tutorial',
      url: 'https://www.w3schools.com/html/',
      description: 'Interactive tutorial with examples and exercises to practice HTML.',
      type: 'tutorial'
    },
    {
      title: 'HTML Best Practices',
      url: 'https://github.com/hail2u/html-best-practices',
      description: 'A guide to writing maintainable and scalable HTML code.',
      type: 'article'
    }
  ];
  
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // In a real app, you would save this to user's bookmarks
  };
  
  const shareContent = () => {
    if (navigator.share) {
      navigator.share({
        title: tutorialContent.title,
        text: tutorialContent.introduction,
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch((error) => console.log('Error copying link', error));
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Tutorial Navigation */}
      <div className="flex justify-between items-center mb-6">
        <Link to="/tutorials" className="flex items-center text-emerald-600 hover:text-emerald-700">
          <ArrowLeft size={18} className="mr-1" />
          <span>Back to Tutorials</span>
        </Link>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleBookmark}
            className={`p-2 rounded-full ${isBookmarked ? 'text-yellow-500 bg-yellow-50' : 'text-gray-500 hover:bg-gray-100'}`}
            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark this Tutorial'}
          >
            <Bookmark size={20} className={isBookmarked ? 'fill-yellow-500' : ''} />
          </button>
          
          <button 
            onClick={shareContent}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
            title="Share this Tutorial"
          >
            <Share2 size={20} />
          </button>
        </div>
      </div>
      
      {/* Tutorial Progress (Optional for logged-in users) */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-1">
          <span className="font-medium text-gray-700">Your progress</span>
          <span className="text-emerald-600">25%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '25%' }}></div>
        </div>
      </div>
      
      {/* Notes Component */}
      <NotesComponent tutorialId="html" />
      
      {/* Main Tutorial Content */}
      <TutorialContent content={tutorialContent} />
      
      {/* Additional Resources */}
      <ResourceList resources={additionalResources} />
      
      {/* Related Tutorials */}
      <div className="mt-8 border-t pt-8">
        <h3 className="text-xl font-bold mb-4">Related Tutorials</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Link to="/tutorials/css" className="p-4 border rounded-md hover:bg-gray-50">
            <h4 className="font-medium">CSS Fundamentals</h4>
            <p className="text-sm text-gray-600">Learn how to style your HTML pages with CSS</p>
          </Link>
          <Link to="/tutorials/javascript" className="p-4 border rounded-md hover:bg-gray-50">
            <h4 className="font-medium">JavaScript Basics</h4>
            <p className="text-sm text-gray-600">Add interactivity to your web pages with JavaScript</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HTMLTutorial;