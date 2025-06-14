import { Link } from 'react-router-dom';
import { 
  Home, 
  Search, 
  BookOpen, 
  ArrowLeft, 
  HelpCircle,
  MessageCircle
} from 'lucide-react';
import { COLORS } from '../constants/colors';

const NotFoundPage = () => {
  const quickLinks = [
    { label: 'Browse Tutorials', to: '/tutorials', icon: BookOpen },
    { label: 'About CodeCraft', to: '/about', icon: HelpCircle },
    { label: 'Contact Support', to: '/contact', icon: MessageCircle },
  ];

  const popularTutorials = [
    { title: 'HTML Fundamentals', to: '/tutorials/html-fundamentals' },
    { title: 'JavaScript Basics', to: '/tutorials/javascript-basics' },
    { title: 'React Introduction', to: '/tutorials/react-introduction' },
    { title: 'CSS Styling', to: '/tutorials/css-styling' },
  ];

  return (
    <div className={`min-h-screen ${COLORS.background.secondary} flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-3xl mx-auto text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className={`inline-flex items-center justify-center w-32 h-32 ${COLORS.background.primaryLight} rounded-full mb-6`}>
            <span className={`text-6xl font-bold ${COLORS.text.primary}`}>404</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="mb-12">
          <h1 className={`text-4xl md:text-5xl font-bold ${COLORS.text.dark} mb-4`}>
            Oops! Page Not Found
          </h1>
          <p className={`text-xl ${COLORS.text.secondary} mb-8 max-w-2xl mx-auto`}>
            The page you're looking for seems to have wandered off into the digital void. 
            Don't worry, even the best developers encounter broken links!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            to="/"
            className={`inline-flex items-center gap-2 px-8 py-3 ${COLORS.button.primary} rounded-lg font-medium transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg`}
          >
            <Home size={20} />
            Back to Home
          </Link>
          <Link
            to="/tutorials"
            className={`inline-flex items-center gap-2 px-8 py-3 ${COLORS.button.outline} rounded-lg font-medium transition-all duration-200`}
          >
            <Search size={20} />
            Browse Tutorials
          </Link>
        </div>

        {/* Quick Links Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Quick Navigation */}
          <div className={`${COLORS.background.white} rounded-xl p-6 shadow-sm`}>
            <h3 className={`text-lg font-semibold ${COLORS.text.dark} mb-4`}>Quick Navigation</h3>
            <div className="space-y-3">
              {quickLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.to}
                  className={`flex items-center gap-3 p-3 rounded-lg ${COLORS.interactive.hover.secondary} transition-colors group`}
                >
                  <div className={`p-2 ${COLORS.background.primaryLight} rounded-lg group-hover:scale-110 transition-transform`}>
                    <link.icon className={`${COLORS.text.primary}`} size={18} />
                  </div>
                  <span className={`${COLORS.text.secondary} group-hover:${COLORS.text.dark} transition-colors`}>
                    {link.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Popular Tutorials */}
          <div className={`${COLORS.background.white} rounded-xl p-6 shadow-sm`}>
            <h3 className={`text-lg font-semibold ${COLORS.text.dark} mb-4`}>Popular Tutorials</h3>
            <div className="space-y-3">
              {popularTutorials.map((tutorial, index) => (
                <Link
                  key={index}
                  to={tutorial.to}
                  className={`block p-3 rounded-lg ${COLORS.interactive.hover.secondary} transition-colors group`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`${COLORS.text.secondary} group-hover:${COLORS.text.dark} transition-colors`}>
                      {tutorial.title}
                    </span>
                    <ArrowLeft className={`${COLORS.text.tertiary} group-hover:${COLORS.text.primary} group-hover:-translate-x-1 transition-all rotate-180`} size={16} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className={`${COLORS.status.info.bg} rounded-xl p-6 ${COLORS.border.secondary} border`}>
          <h3 className={`text-lg font-semibold ${COLORS.status.info.text} mb-3`}>
            Still can't find what you're looking for?
          </h3>
          <p className={`${COLORS.status.info.text} mb-4 opacity-90`}>
            Our support team is here to help! Reach out and we'll get you back on track.
          </p>
          <Link
            to="/contact"
            className={`inline-flex items-center gap-2 px-6 py-2 ${COLORS.background.white} ${COLORS.text.primary} rounded-lg font-medium hover:shadow-md transition-all duration-200`}
          >
            <MessageCircle size={18} />
            Contact Support
          </Link>
        </div>

        {/* Fun Fact */}
        <div className="mt-8 text-center">
          <p className={`text-sm ${COLORS.text.tertiary} italic`}>
            Fun fact: HTTP status code 404 was named after room "404" at CERN where the web was born! 🌐
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;