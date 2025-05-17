import { useState } from 'react';
import TutorialContent from '../../components/tutorial/TutorialContent';
import { Link } from 'react-router-dom';
import { ArrowLeft, Bookmark, Share2 } from 'lucide-react';

const CSSTutorial = () => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // CSS tutorial content with digital notes and YouTube embeds
  const tutorialContent = {
    title: 'CSS Fundamentals',
    introduction: 'CSS (Cascading Style Sheets) is used to style and layout web pages. Learn how to make your websites visually appealing with CSS.',
    videoUrl: 'https://www.youtube.com/embed/1PnVor36_40', // Main tutorial video
    sections: [
      {
        title: 'What is CSS?',
        text: 'CSS stands for Cascading Style Sheets. CSS describes how HTML elements are to be displayed on screen, paper, or in other media. CSS saves a lot of work because it can control the layout of multiple web pages all at once.\n\nWith CSS, you can control the color, font, text size, spacing, positioning, background, and much more of your HTML elements.',
        videoUrl: 'https://www.youtube.com/embed/1PnVor36_40?start=60', // Section-specific video with timestamp
      },
      {
        title: 'CSS Syntax',
        text: 'CSS consists of selectors and declaration blocks. The selector points to the HTML element you want to style. The declaration block contains one or more declarations separated by semicolons.\n\nEach declaration includes a CSS property name and a value, separated by a colon. A CSS declaration always ends with a semicolon, and declaration blocks are surrounded by curly braces.',
        code: `selector {
  property1: value1;
  property2: value2;
  property3: value3;
}`,
        language: 'css',
        codeTitle: 'CSS Syntax',
      },
      {
        title: 'CSS Selectors',
        text: 'CSS selectors are used to "find" or select HTML elements based on their element name, id, class, attribute, and more.\n\nThe element selector selects HTML elements based on the element name. The id selector uses the id attribute of an HTML element to select a specific element. The class selector selects elements with a specific class attribute.',
        code: `/* Element Selector */
p {
  color: red;
}

/* ID Selector */
#header {
  background-color: blue;
}

/* Class Selector */
.button {
  padding: 10px;
  border-radius: 5px;
}`,
        language: 'css',
        codeTitle: 'CSS Selectors',
        videoUrl: 'https://www.youtube.com/embed/qKoajPPWpmo', // Section-specific video
      },
      {
        title: 'CSS Box Model',
        text: 'The CSS box model is essentially a box that wraps around every HTML element. It consists of: margins, borders, padding, and the actual content.\n\nThe content area contains the actual content of the box, like text or images. The padding is the space between the content and the border. The border surrounds the padding and content. The margin is the space outside the border.',
        code: `div {
  width: 300px;
  padding: 10px;
  border: 5px solid gray;
  margin: 20px;
}`,
        language: 'css',
        codeTitle: 'CSS Box Model Example',
        note: 'The total width of the element will be 300px (content) + 20px (padding) + 10px (border) + 40px (margin) = 370px.',
      },
    ],
  };
  
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
          <span className="text-emerald-600">15%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '15%' }}></div>
        </div>
      </div>
      
      {/* Main Tutorial Content */}
      <TutorialContent content={tutorialContent} />
      
      {/* Related Tutorials */}
      <div className="mt-12 border-t pt-8">
        <h3 className="text-xl font-bold mb-4">Related Tutorials</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Link to="/tutorials/html" className="p-4 border rounded-md hover:bg-gray-50">
            <h4 className="font-medium">HTML Fundamentals</h4>
            <p className="text-sm text-gray-600">Learn the structure of web pages with HTML</p>
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

export default CSSTutorial;