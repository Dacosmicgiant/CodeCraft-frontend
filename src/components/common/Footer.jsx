import { Link } from 'react-router-dom';
import { BookOpen, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const Footer = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  
  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };
  
  return (
    <footer className="bg-gray-800 text-gray-300 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Footer with accordion */}
        <div className="md:hidden">
          <div className="mb-6">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <BookOpen className="h-6 w-6 text-white" />
              <span className="text-xl font-bold text-white">Shubhali's CodeCraft</span>
            </Link>
            <p className="text-sm text-gray-400">
              Learn to code with interactive tutorials and examples.
              Master web development, programming, and computer science fundamentals.
            </p>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white text-sm">X</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm">GitHub</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm">LinkedIn</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm">Email</a>
            </div>
          </div>
          
          {/* Accordion Sections */}
          <div className="border-t border-gray-700">
            <FooterAccordion 
              title="Tutorials" 
              isOpen={expandedSection === 'tutorials'} 
              toggleOpen={() => toggleSection('tutorials')}
            >
              <ul className="space-y-2 py-2">
                <FooterLink to="/tutorials/html">HTML</FooterLink>
                <FooterLink to="/tutorials/css">CSS</FooterLink>
                <FooterLink to="/tutorials/javascript">JavaScript</FooterLink>
                <FooterLink to="/tutorials/react">React</FooterLink>
                <FooterLink to="/tutorials/nodejs">Node.js</FooterLink>
              </ul>
            </FooterAccordion>
            
            <FooterAccordion 
              title="Company" 
              isOpen={expandedSection === 'company'} 
              toggleOpen={() => toggleSection('company')}
            >
              <ul className="space-y-2 py-2">
                <FooterLink to="/about">About Us</FooterLink>
                <FooterLink to="/contact">Contact</FooterLink>
                <FooterLink to="/careers">Careers</FooterLink>
                <FooterLink to="/privacy">Privacy Policy</FooterLink>
                <FooterLink to="/terms">Terms of Service</FooterLink>
              </ul>
            </FooterAccordion>
          </div>
        </div>
        
        {/* Desktop Footer */}
        <div className="hidden md:block">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Logo and Description */}
            <div className="col-span-1">
              <Link to="/" className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-white" />
                <span className="text-xl font-bold text-white">Shubhali's CodeCraft</span>
              </Link>
              <p className="mt-2 text-sm text-gray-400">
                Learn to code with interactive tutorials and examples.
                Master web development, programming, and computer science fundamentals.
              </p>
              <div className="mt-4 flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white text-sm">X</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm">GitHub</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm">LinkedIn</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm">Email</a>
              </div>
            </div>
            
            {/* Links */}
            <div>
              <h3 className="text-white font-medium mb-2">Tutorials</h3>
              <ul className="space-y-2">
                <FooterLink to="/tutorials/html">HTML</FooterLink>
                <FooterLink to="/tutorials/css">CSS</FooterLink>
                <FooterLink to="/tutorials/javascript">JavaScript</FooterLink>
                <FooterLink to="/tutorials/react">React</FooterLink>
                <FooterLink to="/tutorials/nodejs">Node.js</FooterLink>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-medium mb-2">Company</h3>
              <ul className="space-y-2">
                <FooterLink to="/about">About Us</FooterLink>
                <FooterLink to="/contact">Contact</FooterLink>
                <FooterLink to="/careers">Careers</FooterLink>
                <FooterLink to="/privacy">Privacy Policy</FooterLink>
                <FooterLink to="/terms">Terms of Service</FooterLink>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 text-center md:text-left">
            &copy; {new Date().getFullYear()} Shubhali's CodeCraft. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 text-sm text-gray-400 flex gap-4">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Accordion component for mobile footer
const FooterAccordion = ({ title, children, isOpen, toggleOpen }) => {
  return (
    <div className="border-b border-gray-700">
      <button 
        className="w-full py-3 flex justify-between items-center text-left"
        onClick={toggleOpen}
      >
        <h3 className="font-medium text-white">{title}</h3>
        <ChevronDown 
          size={16} 
          className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} 
        />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-48' : 'max-h-0'}`}>
        {children}
      </div>
    </div>
  );
};

const FooterLink = ({ to, children }) => (
  <li>
    <Link to={to} className="text-gray-400 hover:text-white text-sm">
      {children}
    </Link>
  </li>
);

export default Footer;