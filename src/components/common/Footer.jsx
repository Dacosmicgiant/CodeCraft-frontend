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
          <div className="flex justify-between items-start gap-8">
            {/* Shubhali's Section (Left) */}
            <div>
              <Link to="/" className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-white" />
                <span className="text-xl font-bold text-white">Shubhali's CodeCraft</span>
              </Link>
              <p className="mt-2 text-sm text-gray-400 max-w-sm">
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
            
            {/* Company Section (Right) */}
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
        
        {/* --- MODIFIED COPYRIGHT SECTION --- */}
        {/* Changed justify-between to justify-center */}
        <div className="mt-8 pt-6 border-t border-gray-700 flex flex-col md:flex-row justify-center items-center">
          {/* Changed text-center md:text-left to just text-center */}
          <p className="text-sm text-gray-400 text-center">
            © {new Date().getFullYear()} Shubhali's CodeCraft. All rights reserved.
          </p>
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