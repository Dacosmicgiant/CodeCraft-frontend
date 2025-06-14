import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Code, ArrowRight, Loader, CheckCircle, Clock } from 'lucide-react';
import { tutorialAPI, domainAPI, technologyAPI } from '../services/api';
import { COLORS } from '../constants/colors';

const HomePage = () => {
  // Animation states
  const [isVisible, setIsVisible] = useState({
    hero: false,
    courses: false,
    features: false,
    cta: false
  });

  // Data states
  const [featuredTutorials, setFeaturedTutorials] = useState([]);
  const [domains, setDomains] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch domains, technologies, and featured tutorials
        const [domainsRes, technologiesRes, tutorialsRes] = await Promise.all([
          domainAPI.getAll(),
          technologyAPI.getAll(),
          tutorialAPI.getAll({ limit: 6, sort: '-createdAt' }) // Get 6 latest tutorials
        ]);

        setDomains(domainsRes.data);
        setTechnologies(technologiesRes.data);
        
        // Extract tutorials from response (handle pagination structure)
        const tutorials = tutorialsRes.data.tutorials || tutorialsRes.data;
        setFeaturedTutorials(tutorials);

      } catch (err) {
        console.error('Error fetching homepage data:', err);
        setError('Failed to load content. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Intersection Observer setup for animations
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: true
          }));
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observe all sections
    const sections = ['hero', 'courses', 'features', 'cta'];
    sections.forEach(section => {
      const element = document.getElementById(section);
      if (element) observer.observe(element);
    });

    return () => {
      sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) observer.unobserve(element);
      });
    };
  }, []);

  // Get icon for technology
  const getTechnologyIcon = (techName) => {
    const name = techName?.toLowerCase() || '';
    if (name.includes('html')) return <span className={`${COLORS.text.secondary} text-xs font-medium`}>HTML</span>;
    if (name.includes('css')) return <span className={`${COLORS.text.secondary} text-xs font-medium`}>CSS</span>;
    if (name.includes('javascript')) return <span className={`${COLORS.text.secondary} text-xs font-medium`}>JS</span>;
    if (name.includes('react')) return <span className={`${COLORS.text.secondary} text-xs font-medium`}>React</span>;
    if (name.includes('node')) return <span className={`${COLORS.text.secondary} text-xs font-medium`}>Node</span>;
    if (name.includes('python')) return <span className={`${COLORS.text.secondary} text-xs font-medium`}>Python</span>;
    return <Code className={COLORS.text.tertiary} size={16} />;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        id="hero" 
        className={`${COLORS.background.white} min-h-screen flex items-center transition-opacity duration-700 py-16 ${
          isVisible.hero ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
          <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold ${COLORS.text.dark} mb-6 sm:mb-8 leading-tight px-2 max-w-6xl mx-auto`}
              style={{ fontSize: 'clamp(1.5rem, 6vw, 4rem)' }}>
            Learn Programming Through
            <br />
            <span className={COLORS.text.primary}>Interactive Tutorials</span>
          </h1>
          
          <p className={`text-base sm:text-lg md:text-xl lg:text-2xl ${COLORS.text.secondary} mb-10 sm:mb-12 md:mb-16 max-w-3xl mx-auto leading-relaxed px-4`}
             style={{ fontSize: 'clamp(1rem, 2.5vw, 1.5rem)' }}>
            Master coding skills with hands-on examples, step-by-step guidance, and real-world projects.
            <br className="hidden sm:block" />
            <span className="block sm:inline"> Start your programming journey today.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4">
            <Link 
              to="/tutorials" 
              className={`px-8 sm:px-10 md:px-12 py-3 sm:py-4 text-base sm:text-lg ${COLORS.button.primary} rounded-md text-center font-medium transition-colors duration-200 w-full sm:w-auto`}
            >
              Browse Tutorials
            </Link>
            <Link 
              to="/register" 
              className={`px-8 sm:px-10 md:px-12 py-3 sm:py-4 text-base sm:text-lg ${COLORS.button.outline} rounded-md text-center font-medium transition-colors duration-200 w-full sm:w-auto`}
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section 
        id="features" 
        className={`py-12 sm:py-16 lg:py-20 ${COLORS.background.secondary} transition-opacity duration-700 ${
          isVisible.features ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${COLORS.text.dark} mb-3 sm:mb-4`}>Why Choose CodeCraft</h2>
            <p className={`text-base sm:text-lg lg:text-xl ${COLORS.text.secondary} max-w-2xl mx-auto px-4`}>
              Our platform is designed to make learning programming effective and accessible
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
            <div className="text-center px-4">
              <div className={`w-12 h-12 sm:w-14 sm:h-14 ${COLORS.background.primary} rounded-lg flex items-center justify-center mx-auto mb-4 sm:mb-6`}>
                <BookOpen className={COLORS.text.white} size={24} />
              </div>
              <h3 className={`text-lg sm:text-xl font-semibold ${COLORS.text.dark} mb-2 sm:mb-3`}>Interactive Learning</h3>
              <p className={`${COLORS.text.secondary} text-sm sm:text-base leading-relaxed`}>
                Learn by doing with hands-on coding exercises and immediate feedback
              </p>
            </div>

            <div className="text-center px-4">
              <div className={`w-12 h-12 sm:w-14 sm:h-14 ${COLORS.background.primary} rounded-lg flex items-center justify-center mx-auto mb-4 sm:mb-6`}>
                <Code className={COLORS.text.white} size={24} />
              </div>
              <h3 className={`text-lg sm:text-xl font-semibold ${COLORS.text.dark} mb-2 sm:mb-3`}>Real Projects</h3>
              <p className={`${COLORS.text.secondary} text-sm sm:text-base leading-relaxed`}>
                Build portfolio-worthy projects that demonstrate your programming skills
              </p>
            </div>

            <div className="text-center px-4 lg:col-span-1">
              <div className={`w-12 h-12 sm:w-14 sm:h-14 ${COLORS.background.primary} rounded-lg flex items-center justify-center mx-auto mb-4 sm:mb-6`}>
                <CheckCircle className={COLORS.text.white} size={24} />
              </div>
              <h3 className={`text-lg sm:text-xl font-semibold ${COLORS.text.dark} mb-2 sm:mb-3`}>Step-by-Step</h3>
              <p className={`${COLORS.text.secondary} text-sm sm:text-base leading-relaxed`}>
                Follow structured learning paths designed to build skills progressively
              </p>
            </div>
          </div>
        </div>
      </section>

     

      {/* CTA Section */}
      <section 
        id="cta" 
        className={`py-12 sm:py-16 lg:py-20 ${COLORS.background.primary} ${COLORS.text.white} transition-opacity duration-700 ${
          isVisible.cta ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Start Learning Today</h2>
          <p className="text-base sm:text-lg lg:text-xl opacity-90 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-4">
            Join our community of learners and take the first step toward your programming goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4">
            <Link 
              to="/register" 
              className={`px-8 sm:px-10 md:px-12 py-3 sm:py-4 text-base sm:text-lg ${COLORS.background.white} ${COLORS.text.primary} font-medium rounded-md hover:${COLORS.background.tertiary} transition-colors duration-200 w-full sm:w-auto`}
            >
              Create Free Account
            </Link>
            <Link 
              to="/tutorials" 
              className="px-8 sm:px-10 md:px-12 py-3 sm:py-4 text-base sm:text-lg border-2 border-white text-white font-medium rounded-md hover:bg-white hover:bg-opacity-10 transition-colors duration-200 w-full sm:w-auto"
            >
              Browse Tutorials
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

// Simple Course Card Component
const CourseCard = ({ tutorial, icon }) => (
  <div className={`${COLORS.background.white} rounded-lg ${COLORS.border.secondary} border p-4 sm:p-6 hover:shadow-md transition-shadow duration-200 h-full flex flex-col`}>
    <div className="flex items-center justify-between mb-3 sm:mb-4">
      <div className={`${COLORS.background.tertiary} w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center`}>
        {icon}
      </div>
      <div className={`px-2 py-1 ${COLORS.difficulty[tutorial.difficulty] || COLORS.difficulty.beginner} rounded text-xs font-medium`}>
        {tutorial.difficulty?.charAt(0).toUpperCase() + tutorial.difficulty?.slice(1) || 'Beginner'}
      </div>
    </div>
    
    <h3 className={`text-base sm:text-lg font-semibold ${COLORS.text.dark} mb-2`}>
      {tutorial.title}
    </h3>
    
    <p className={`${COLORS.text.secondary} mb-3 sm:mb-4 text-sm leading-relaxed flex-grow`}>
      {tutorial.description}
    </p>
    
    <div className="flex items-center justify-between text-xs sm:text-sm mb-3 sm:mb-4 flex-shrink-0">
      <div className="flex items-center gap-1">
        <BookOpen size={12} className={COLORS.text.tertiary} />
        <span className={COLORS.text.tertiary}>{tutorial.lessons?.length || 0} lessons</span>
      </div>
      <div className="flex items-center gap-1">
        <Clock size={12} className={COLORS.text.tertiary} />
        <span className={COLORS.text.tertiary}>~2 hours</span>
      </div>
    </div>
    
    <Link 
      to={`/tutorials/${tutorial.slug || tutorial._id}`}
      className={`block w-full py-2 sm:py-2.5 text-sm sm:text-base ${COLORS.background.primary} ${COLORS.text.white} text-center rounded-md hover:${COLORS.background.primaryHover} transition-colors duration-200 font-medium flex-shrink-0`}
    >
      Start Tutorial
    </Link>
  </div>
);

export default HomePage;