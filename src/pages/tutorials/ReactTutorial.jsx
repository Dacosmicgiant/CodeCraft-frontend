import { useState } from 'react';
import TutorialContent from '../../components/tutorial/TutorialContent';
import { Link } from 'react-router-dom';
import { ArrowLeft, Bookmark, Share2 } from 'lucide-react';

const ReactTutorial = () => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // React tutorial content with digital notes and YouTube embeds
  const tutorialContent = {
    title: 'React Fundamentals',
    introduction: 'Learn the basics of React, a JavaScript library for building user interfaces. React makes it painless to create interactive UIs.',
    videoUrl: 'https://www.youtube.com/embed/Ke90Tje7VS0', // Main tutorial video
    sections: [
      {
        title: 'What is React?',
        text: 'React is a JavaScript library created by Facebook for building user interfaces, particularly single-page applications. It allows developers to create reusable UI components and manage the state of those components efficiently.\n\nReact uses a virtual DOM to optimize the updating process, making it fast and efficient. It follows a component-based architecture, which means complex UIs are broken down into smaller, reusable components.',
        videoUrl: 'https://www.youtube.com/embed/N3AkSS5hXMA', // Section-specific video
      },
      {
        title: 'React Components',
        text: 'Components are the core of React applications. A component is a self-contained, reusable piece of code that is responsible for a specific part of the UI. React components can be either function components or class components.\n\nFunction components are simpler and have become the preferred way to define components in modern React applications, especially with the introduction of Hooks in React 16.8.',
        code: `// Function Component
import React from 'react';

function Greeting(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <p>Welcome to React.</p>
    </div>
  );
}

export default Greeting;`,
        language: 'jsx',
        codeTitle: 'React Function Component',
        videoUrl: 'https://www.youtube.com/embed/Y2hgEGPzTZY', // Section-specific video
      },
      {
        title: 'State and Props',
        text: 'Props (short for properties) are inputs to React components. They are data passed from a parent component to a child component. Props are read-only and cannot be modified by the component receiving them.\n\nState, on the other hand, is managed within the component. It represents the parts of the component that can change over time. In function components, state is managed using the useState hook.',
        code: `import React, { useState } from 'react';

function Counter() {
  // Declare a state variable named "count" with initial value 0
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}`,
        language: 'jsx',
        codeTitle: 'React State with Hooks',
      },
      {
        title: 'React Hooks',
        text: 'Hooks are functions that let you "hook into" React state and lifecycle features from function components. Hooks were added in React 16.8 and allow you to use state and other React features without writing a class.\n\nSome of the built-in hooks include useState, useEffect, useContext, useReducer, useCallback, useMemo, and useRef.',
        code: `import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // Similar to componentDidMount and componentDidUpdate
  useEffect(() => {
    // Update the document title using the browser API
    document.title = \`You clicked \${count} times\`;
    
    // Optional cleanup function (similar to componentWillUnmount)
    return () => {
      document.title = 'React App';
    };
  }, [count]); // Only re-run the effect if count changes

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}`,
        language: 'jsx',
        codeTitle: 'React useEffect Hook',
        note: 'The array of dependencies (second argument of useEffect) controls when the effect runs. An empty array means the effect only runs once, after the initial render.',
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
          <span className="text-emerald-600">5%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '5%' }}></div>
        </div>
      </div>
      
      {/* Main Tutorial Content */}
      <TutorialContent content={tutorialContent} />
      
      {/* Related Tutorials */}
      <div className="mt-12 border-t pt-8">
        <h3 className="text-xl font-bold mb-4">Related Tutorials</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Link to="/tutorials/javascript" className="p-4 border rounded-md hover:bg-gray-50">
            <h4 className="font-medium">JavaScript Essentials</h4>
            <p className="text-sm text-gray-600">Master JavaScript, the foundation of React</p>
          </Link>
          <Link to="/tutorials/css" className="p-4 border rounded-md hover:bg-gray-50">
            <h4 className="font-medium">CSS Fundamentals</h4>
            <p className="text-sm text-gray-600">Style your React components with CSS</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReactTutorial;