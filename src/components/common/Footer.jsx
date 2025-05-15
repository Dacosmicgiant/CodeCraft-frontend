import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        
        <div className="mt-8 pt-6 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Shubhali's CodeCraft. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 text-sm text-gray-400">
            <a href="#" className="hover:text-white mr-4">Privacy</a>
            <a href="#" className="hover:text-white mr-4">Terms</a>
            <a href="#" className="hover:text-white">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
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