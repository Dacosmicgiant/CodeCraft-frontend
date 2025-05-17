import { useState } from 'react';
import TutorialContent from '../../components/tutorial/TutorialContent';
import { Link } from 'react-router-dom';
import { ArrowLeft, Bookmark, Share2 } from 'lucide-react';

const JavaScriptTutorial = () => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // JavaScript tutorial content with digital notes and YouTube embeds
  const tutorialContent = {
    title: 'JavaScript Essentials',
    introduction: 'JavaScript is the programming language of the web. Learn the basics of JavaScript to add interactivity to your websites.',
    videoUrl: 'https://www.youtube.com/embed/W6NZfCO5SIk', // Main tutorial video
    sections: [
      {
        title: 'What is JavaScript?',
        text: 'JavaScript is a lightweight, interpreted programming language designed for creating network-centric applications. It is a scripting language that is used to make webpages interactive and provide online programs, including video games.\n\nJavaScript was originally developed by Netscape as a means to add dynamic and interactive elements to websites. It is supported by all modern web browsers and has become one of the three core technologies of web development, alongside HTML and CSS.',
        videoUrl: 'https://www.youtube.com/embed/upDLs1sn7g4', // Section-specific video
      },
      {
        title: 'Variables and Data Types',
        text: 'In JavaScript, variables are used to store data values. JavaScript has several data types: strings, numbers, booleans, arrays, objects, and more.\n\nIn modern JavaScript, you can declare variables using var, let, or const. Variables declared with var are function-scoped, while those declared with let and const are block-scoped.',
        code: `// Declaring variables
let name = "John"; // String
const age = 30; // Number
let isStudent = true; // Boolean
let hobbies = ["reading", "gaming", "coding"]; // Array
let person = {
  firstName: "John",
  lastName: "Doe",
  age: 30
}; // Object`,
        language: 'javascript',
        codeTitle: 'JavaScript Variables and Data Types',
        videoUrl: 'https://www.youtube.com/embed/edlFjlzxkSI', // Section-specific video
      },
      {
        title: 'Functions',
        text: 'Functions are one of the fundamental building blocks in JavaScript. A function is a JavaScript procedure—a set of statements that performs a task or calculates a value.\n\nTo use a function, you must define it somewhere in the scope from which you wish to call it. A function definition consists of the function keyword, followed by the name of the function, a list of parameters, and the JavaScript statements that define the function, enclosed in curly brackets.',
        code: `// Function declaration
function greet(name) {
  return "Hello, " + name + "!";
}

// Function expression
const sum = function(a, b) {
  return a + b;
};

// Arrow function
const multiply = (a, b) => a * b;

// Using functions
console.log(greet("Alice")); // Output: Hello, Alice!
console.log(sum(5, 3)); // Output: 8
console.log(multiply(4, 2)); // Output: 8`,
        language: 'javascript',
        codeTitle: 'JavaScript Functions',
      },
      {
        title: 'DOM Manipulation',
        text: 'The Document Object Model (DOM) is a programming interface for HTML and XML documents. It represents the page so that programs can change the document structure, style, and content.\n\nJavaScript allows you to manipulate the DOM by accessing and modifying HTML elements, changing their styles, and responding to user events like clicks or key presses.',
        code: `// Selecting elements
const heading = document.getElementById('heading');
const paragraphs = document.getElementsByTagName('p');
const buttons = document.querySelectorAll('.btn');

// Modifying elements
heading.innerHTML = 'New Heading';
heading.style.color = 'blue';

// Adding event listeners
document.getElementById('myButton').addEventListener('click', function() {
  alert('Button clicked!');
});

// Creating new elements
const newParagraph = document.createElement('p');
newParagraph.textContent = 'This is a new paragraph.';
document.body.appendChild(newParagraph);`,
        language: 'javascript',
        codeTitle: 'DOM Manipulation with JavaScript',
        note: 'Always check if the element exists before trying to manipulate it to avoid errors.',
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
          <span className="text-emerald-600">10%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '10%' }}></div>
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
          <Link to="/tutorials/css" className="p-4 border rounded-md hover:bg-gray-50">
            <h4 className="font-medium">CSS Fundamentals</h4>
            <p className="text-sm text-gray-600">Style your web pages with CSS</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JavaScriptTutorial;