import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Code, Check, ArrowRight, Star, Users, Award, Loader } from 'lucide-react';
import { tutorialAPI, domainAPI, technologyAPI } from '../services/api';

const HomePage = () => {
  // Animation states
  const [isVisible, setIsVisible] = useState({
    hero: false,
    courses: false,
    howItWorks: false,
    testimonials: false,
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
    const sections = ['hero', 'courses', 'howItWorks', 'testimonials', 'cta'];
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
    if (name.includes('html')) return <span className="text-orange-500 font-bold">HTML</span>;
    if (name.includes('css')) return <span className="text-blue-500 font-bold">CSS</span>;
    if (name.includes('javascript')) return <span className="text-yellow-500 font-bold">JS</span>;
    if (name.includes('react')) return <span className="text-cyan-500 font-bold">React</span>;
    if (name.includes('node')) return <span className="text-green-500 font-bold">Node</span>;
    if (name.includes('python')) return <span className="text-blue-600 font-bold">Py</span>;
    return <Code className="text-gray-500" />;
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section 
        id="hero" 
        className={`relative bg-gradient-to-r from-emerald-600 to-teal-500 py-20 text-white overflow-hidden transition-all duration-1000 ease-out ${
          isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Learn to Code with Interactive Tutorials
              </h1>
              <p className="text-xl opacity-90">
                Master programming skills with hands-on examples and step-by-step guidance.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/tutorials" 
                  className="px-6 py-3 bg-white text-emerald-600 font-medium rounded-md hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
                >
                  Start Learning <ArrowRight size={18} />
                </Link>
              </div>
              <div className="flex items-center gap-4 text-sm pt-2">
                <div className="flex items-center gap-1">
                  <Users size={16} />
                  <span>1K+ Users</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={16} />
                  <span>4.8/5 Rating</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award size={16} />
                  <span>Top Rated</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm rounded-xl -rotate-2"></div>
                <div className="relative bg-gray-900 rounded-xl shadow-lg p-6 rotate-1">
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <div className="ml-2 text-gray-400">index.html</div>
                  </div>
                  <pre className="text-sm text-gray-300 overflow-x-auto">
<code>{`<!DOCTYPE html>
<html>
<head>
  <title>My First Web Page</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <h1>Hello, World!</h1>
  <p class="highlight">Welcome to CodeCraft</p>
  
  <script>
    document.querySelector('.highlight')
      .addEventListener('click', function() {
        alert('You\'re learning fast!');
      });
  </script>
</body>
</html>`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-800 opacity-20 rounded-full translate-y-1/3 -translate-x-1/4 blur-3xl"></div>
      </section>

      {/* Featured Courses */}
      <section 
        id="courses" 
        className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ease-out ${
          isVisible.courses ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Start Learning Today</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our most popular courses and build your coding skills from the ground up
          </p>
        </div>

        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader size={32} className="animate-spin text-emerald-600" />
          </div>
        )}

        {error && (
          <div className="text-center py-8 text-red-600">
            <p>{error}</p>
          </div>
        )}

        {!isLoading && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTutorials.slice(0, 6).map((tutorial, index) => (
              <CourseCard 
                key={tutorial._id}
                tutorial={tutorial}
                icon={getTechnologyIcon(tutorial.technology?.name)}
                popular={index === 0} // Mark first tutorial as popular
              />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link 
            to="/tutorials" 
            className="inline-flex items-center gap-2 text-emerald-600 font-medium hover:text-emerald-700"
          >
            View All Courses <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section 
        id="howItWorks" 
        className={`bg-gray-50 py-16 transition-all duration-1000 ease-out ${
          isVisible.howItWorks ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How CodeCraft Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our learning platform is designed to make coding accessible for everyone through a proven, step-by-step approach
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              number="1"
              title="Learn the Concepts"
              description="Read clear explanations with visual examples to understand programming concepts."
            />
            <FeatureCard 
              number="2"
              title="Practice with Examples"
              description="Study code examples with detailed explanations to reinforce your understanding."
            />
            <FeatureCard 
              number="3"
              title="Build Real Projects"
              description="Apply your skills by building real-world projects and expanding your portfolio."
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section 
        id="testimonials" 
        className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-1000 ease-out ${
          isVisible.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Students Say</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of satisfied learners who have transformed their careers with CodeCraft
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <TestimonialCard 
            quote="CodeCraft helped me transition from a non-technical role to a full-stack developer in just 6 months. The interactive tutorials made all the difference."
            name="Alex Morgan"
            title="Software Developer"
            rating={5}
          />
          <TestimonialCard 
            quote="The way concepts are explained with practical examples makes learning coding so much easier. I've tried other platforms, but none compare to CodeCraft."
            name="Sarah Johnson"
            title="Web Designer"
            rating={5}
          />
          <TestimonialCard 
            quote="As a computer science student, CodeCraft has been an invaluable supplement to my studies. The examples are challenging and engaging."
            name="James Wilson"
            title="CS Student"
            rating={4}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section 
        id="cta" 
        className={` bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-16 transition-all duration-1000 ease-out ${
          isVisible.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Coding Journey?</h2>
          <p className="text-xl opacity-90 mb-8">
            Join thousands of students learning to code on CodeCraft. Create your free account today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/register" 
              className="px-6 py-3 bg-white text-emerald-600 font-medium rounded-md hover:bg-gray-100 transition-colors"
            >
              Sign Up For Free
            </Link>
            <Link 
              to="/tutorials" 
              className="px-6 py-3 bg-emerald-700 text-white font-medium rounded-md hover:bg-emerald-800 transition-colors"
            >
              Explore Tutorials
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

// Course Card Component - Updated to use backend data
const CourseCard = ({ tutorial, icon, popular = false }) => (
  <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow overflow-hidden">
    {popular && (
      <div className="bg-emerald-600 text-white text-xs font-medium py-1 px-2 text-center">
        MOST POPULAR
      </div>
    )}
    <div className="p-6">
      <div className="bg-gray-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-2">{tutorial.title}</h3>
      <p className="text-gray-600 mb-4">{tutorial.description}</p>
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center gap-1">
          <BookOpen size={16} />
          <span>{tutorial.lessons?.length || 0} Lessons</span>
        </div>
        <div className={`px-2 py-1 rounded text-xs ${getDifficultyColor(tutorial.difficulty)}`}>
          {tutorial.difficulty?.charAt(0).toUpperCase() + tutorial.difficulty?.slice(1) || 'Beginner'}
        </div>
      </div>
      <Link 
        to={`/tutorials/${tutorial.slug || tutorial._id}`}
        className="block w-full py-2 bg-emerald-600 text-white text-center rounded-md hover:bg-emerald-700 transition-colors"
      >
        Start Learning
      </Link>
    </div>
  </div>
);

// Feature Card Component
const FeatureCard = ({ number, title, description }) => (
  <div className="flex flex-col items-center text-center p-6">
    <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
      {number}
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

// Testimonial Card Component
const TestimonialCard = ({ quote, name, title, rating }) => (
  <div className="bg-white rounded-lg shadow-sm border p-6">
    <div className="flex gap-1 mb-4">
      {[...Array(rating)].map((_, i) => (
        <Star key={i} size={18} className="text-yellow-500 fill-yellow-500" />
      ))}
      {[...Array(5 - rating)].map((_, i) => (
        <Star key={i} size={18} className="text-gray-300" />
      ))}
    </div>
    <p className="text-gray-700 mb-4 italic">"{quote}"</p>
    <div>
      <p className="font-bold">{name}</p>
      <p className="text-gray-500 text-sm">{title}</p>
    </div>
  </div>
);

// Helper function
const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'beginner': return 'bg-green-100 text-green-800';
    case 'intermediate': return 'bg-blue-100 text-blue-800';
    case 'advanced': return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default HomePage;