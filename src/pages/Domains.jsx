import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Folder, 
  Code, 
  BookOpen, 
  ArrowRight, 
  Loader, 
  AlertCircle,
  Target,
  Users,
  Star
} from 'lucide-react';
import { domainAPI, technologyAPI, tutorialAPI } from '../services/api';

const DomainsPage = () => {
  const [domains, setDomains] = useState([]);
  const [domainStats, setDomainStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch domains
      const domainsResponse = await domainAPI.getAll();
      const domainsData = domainsResponse.data;
      
      // Fetch stats for each domain
      const stats = {};
      for (const domain of domainsData) {
        try {
          const [techResponse, tutorialResponse] = await Promise.all([
            technologyAPI.getAll({ domain: domain._id }),
            tutorialAPI.getAll({ domain: domain._id })
          ]);
          
          stats[domain._id] = {
            technologies: techResponse.data.length,
            tutorials: tutorialResponse.data.tutorials?.length || tutorialResponse.data.length || 0
          };
        } catch (err) {
          console.warn(`Failed to fetch stats for domain ${domain.name}:`, err);
          stats[domain._id] = { technologies: 0, tutorials: 0 };
        }
      }
      
      setDomains(domainsData);
      setDomainStats(stats);
      
    } catch (err) {
      console.error('Error fetching domains:', err);
      setError('Failed to load domains. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Get domain icon based on name
  const getDomainIcon = (name) => {
    const nameStr = name?.toLowerCase() || '';
    
    if (nameStr.includes('web')) return '🌐';
    if (nameStr.includes('mobile')) return '📱';
    if (nameStr.includes('data')) return '📊';
    if (nameStr.includes('game')) return '🎮';
    if (nameStr.includes('ai') || nameStr.includes('machine')) return '🤖';
    if (nameStr.includes('cloud')) return '☁️';
    if (nameStr.includes('security')) return '🔒';
    if (nameStr.includes('design')) return '🎨';
    return '💻';
  };

  // Get domain color scheme
  const getDomainColors = (name) => {
    const nameStr = name?.toLowerCase() || '';
    
    if (nameStr.includes('web')) return { bg: 'from-blue-500 to-cyan-500', border: 'border-blue-200', text: 'text-blue-700' };
    if (nameStr.includes('mobile')) return { bg: 'from-green-500 to-emerald-500', border: 'border-green-200', text: 'text-green-700' };
    if (nameStr.includes('data')) return { bg: 'from-purple-500 to-indigo-500', border: 'border-purple-200', text: 'text-purple-700' };
    if (nameStr.includes('game')) return { bg: 'from-pink-500 to-rose-500', border: 'border-pink-200', text: 'text-pink-700' };
    if (nameStr.includes('ai') || nameStr.includes('machine')) return { bg: 'from-indigo-500 to-purple-500', border: 'border-indigo-200', text: 'text-indigo-700' };
    if (nameStr.includes('cloud')) return { bg: 'from-gray-500 to-slate-500', border: 'border-gray-200', text: 'text-gray-700' };
    if (nameStr.includes('security')) return { bg: 'from-red-500 to-orange-500', border: 'border-red-200', text: 'text-red-700' };
    if (nameStr.includes('design')) return { bg: 'from-pink-500 to-purple-500', border: 'border-pink-200', text: 'text-pink-700' };
    return { bg: 'from-emerald-500 to-teal-600', border: 'border-emerald-200', text: 'text-emerald-700' };
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader size={40} className="animate-spin text-emerald-600 mb-4" />
        <p className="text-gray-500">Loading domains...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-start">
            <AlertCircle className="flex-shrink-0 h-5 w-5 text-red-500 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
        <button
          onClick={fetchDomains}
          className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Learning Domains
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Explore different areas of programming and technology. Each domain contains specialized 
          technologies and tutorials to help you master specific skills.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-lg border p-6 text-center">
          <div className="text-3xl font-bold text-emerald-600 mb-2">
            {domains.length}
          </div>
          <div className="text-gray-600">Learning Domains</div>
        </div>
        <div className="bg-white rounded-lg border p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {Object.values(domainStats).reduce((sum, stats) => sum + stats.technologies, 0)}
          </div>
          <div className="text-gray-600">Technologies</div>
        </div>
        <div className="bg-white rounded-lg border p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {Object.values(domainStats).reduce((sum, stats) => sum + stats.tutorials, 0)}
          </div>
          <div className="text-gray-600">Tutorials</div>
        </div>
      </div>

      {/* Domains Grid */}
      {domains.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {domains.map(domain => (
            <DomainCard 
              key={domain._id}
              domain={domain}
              stats={domainStats[domain._id] || { technologies: 0, tutorials: 0 }}
              colors={getDomainColors(domain.name)}
              icon={getDomainIcon(domain.name)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Folder size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No domains found</h3>
          <p className="text-gray-600">
            No learning domains are available at the moment.
          </p>
        </div>
      )}

      {/* Call to Action */}
      <div className="mt-16 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Start Learning?</h2>
        <p className="text-lg mb-6 opacity-90">
          Choose a domain that interests you and begin your coding journey today.
        </p>
        <Link
          to="/tutorials"
          className="inline-flex items-center px-6 py-3 bg-white text-emerald-600 rounded-md hover:bg-gray-100 font-medium"
        >
          Browse All Tutorials
          <ArrowRight size={18} className="ml-2" />
        </Link>
      </div>
    </div>
  );
};

// Domain Card Component
const DomainCard = ({ domain, stats, colors, icon }) => {
  return (
    <Link 
      to={`/domains/${domain.slug || domain._id}`}
      className="block bg-white rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
    >
      {/* Header with gradient */}
      <div className={`bg-gradient-to-r ${colors.bg} p-6 text-white relative`}>
        <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full translate-x-6 -translate-y-6"></div>
        
        <div className="relative">
          <div className="text-4xl mb-3">{icon}</div>
          <h3 className="text-xl font-bold mb-2">{domain.name}</h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <p className="text-gray-600 mb-4 line-clamp-3">
          {domain.description}
        </p>

        {/* Stats */}
        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Code size={14} className="mr-1" />
            <span>{stats.technologies} {stats.technologies === 1 ? 'Technology' : 'Technologies'}</span>
          </div>
          <div className="flex items-center">
            <BookOpen size={14} className="mr-1" />
            <span>{stats.tutorials} {stats.tutorials === 1 ? 'Tutorial' : 'Tutorials'}</span>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
            <Target size={12} className="mr-1" />
            Skill Building
          </span>
          <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
            <Users size={12} className="mr-1" />
            Interactive
          </span>
          <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
            <Star size={12} className="mr-1" />
            Beginner Friendly
          </span>
        </div>

        {/* Action */}
        <div className="flex items-center justify-between">
          <span className={`font-medium ${colors.text}`}>
            Explore Domain
          </span>
          <ArrowRight size={16} className={colors.text.replace('text-', 'text-')} />
        </div>
      </div>
    </Link>
  );
};

export default DomainsPage;