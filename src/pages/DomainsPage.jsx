// src/pages/DomainsPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  BookOpen, 
  Code, 
  Users,
  Star,
  ArrowRight,
  Loader,
  AlertCircle,
  Search
} from 'lucide-react';
import { domainAPI, technologyAPI, tutorialAPI } from '../services/api';

const DomainsPage = () => {
  const [domains, setDomains] = useState([]);
  const [domainStats, setDomainStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch all domains
      const domainsResponse = await domainAPI.getAll();
      const domainsData = domainsResponse.data;
      setDomains(domainsData);
      
      // Fetch stats for each domain
      const stats = {};
      await Promise.all(
        domainsData.map(async (domain) => {
          try {
            // Get technologies count for this domain
            const technologiesResponse = await technologyAPI.getAll({ domain: domain._id });
            const technologies = technologiesResponse.data;
            
            // Get tutorials count for this domain
            const tutorialsResponse = await tutorialAPI.getAll({ 
              domain: domain._id, 
              limit: 1 // We just need the count
            });
            const tutorialsData = tutorialsResponse.data;
            const tutorialsCount = tutorialsData.total || (Array.isArray(tutorialsData) ? tutorialsData.length : tutorialsData.tutorials?.length || 0);
            
            stats[domain._id] = {
              technologies: technologies.length,
              tutorials: tutorialsCount
            };
          } catch (err) {
            console.warn(`Error fetching stats for domain ${domain.name}:`, err);
            stats[domain._id] = { technologies: 0, tutorials: 0 };
          }
        })
      );
      
      setDomainStats(stats);
      
    } catch (err) {
      console.error('Error fetching domains:', err);
      setError('Failed to load domains. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter domains based on search query
  const filteredDomains = domains.filter(domain => 
    domain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    domain.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get domain icon based on name
  const getDomainIcon = (name) => {
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes('web')) return '🌐';
    if (lowerName.includes('mobile')) return '📱';
    if (lowerName.includes('data')) return '📊';
    if (lowerName.includes('machine') || lowerName.includes('ai')) return '🤖';
    if (lowerName.includes('game')) return '🎮';
    if (lowerName.includes('design')) return '🎨';
    if (lowerName.includes('security')) return '🔒';
    if (lowerName.includes('cloud')) return '☁️';
    return '💻';
  };

  // Get domain color scheme
  const getDomainColors = (name) => {
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes('web')) return { bg: 'from-blue-500 to-cyan-500', border: 'border-blue-200', text: 'text-blue-700' };
    if (lowerName.includes('mobile')) return { bg: 'from-purple-500 to-pink-500', border: 'border-purple-200', text: 'text-purple-700' };
    if (lowerName.includes('data')) return { bg: 'from-green-500 to-teal-500', border: 'border-green-200', text: 'text-green-700' };
    if (lowerName.includes('machine') || lowerName.includes('ai')) return { bg: 'from-orange-500 to-red-500', border: 'border-orange-200', text: 'text-orange-700' };
    if (lowerName.includes('game')) return { bg: 'from-indigo-500 to-purple-500', border: 'border-indigo-200', text: 'text-indigo-700' };
    if (lowerName.includes('design')) return { bg: 'from-pink-500 to-rose-500', border: 'border-pink-200', text: 'text-pink-700' };
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

  return (
    <div className="max-w-6xl mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <Link 
          to="/tutorials" 
          className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-4"
        >
          <ArrowLeft size={18} className="mr-1" />
          Back to Tutorials
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Domains</h1>
        <p className="text-lg text-gray-600">
          Explore different areas of technology and find your learning path
        </p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search domains..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
          <Search size={20} className="absolute left-3 top-3.5 text-gray-400" />
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
          <div className="flex items-start">
            <AlertCircle className="flex-shrink-0 h-5 w-5 text-red-500 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          {filteredDomains.length} {filteredDomains.length === 1 ? 'domain' : 'domains'} 
          {searchQuery && <span> found for "{searchQuery}"</span>}
        </p>
      </div>

      {/* Domains Grid */}
      {filteredDomains.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDomains.map((domain) => {
            const colors = getDomainColors(domain.name);
            const stats = domainStats[domain._id] || { technologies: 0, tutorials: 0 };
            
            return (
              <Link
                key={domain._id}
                to={`/domains/${domain.slug || domain._id}`}
                className={`group bg-white rounded-lg border ${colors.border} shadow-sm hover:shadow-md transition-all overflow-hidden`}
              >
                {/* Header with gradient */}
                <div className={`bg-gradient-to-r ${colors.bg} p-6 text-white`}>
                  <div className="flex items-center mb-3">
                    <div className="text-4xl mr-3">
                      {getDomainIcon(domain.name)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold group-hover:text-opacity-90">
                        {domain.name}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-white text-opacity-90">
                    <div className="flex items-center">
                      <Code size={14} className="mr-1" />
                      <span>{stats.technologies} {stats.technologies === 1 ? 'Technology' : 'Technologies'}</span>
                    </div>
                    <div className="flex items-center">
                      <BookOpen size={14} className="mr-1" />
                      <span>{stats.tutorials} {stats.tutorials === 1 ? 'Tutorial' : 'Tutorials'}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {domain.description}
                  </p>
                  
                  <div className={`flex items-center ${colors.text} font-medium text-sm group-hover:text-opacity-80`}>
                    <span>Explore Domain</span>
                    <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Search size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No domains found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery 
              ? `No domains match "${searchQuery}"`
              : 'No learning domains are available at the moment'
            }
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {/* CTA Section */}
      <div className="mt-12 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-8 text-center border border-emerald-100">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Start Learning?</h3>
        <p className="text-gray-600 mb-6">
          Choose a domain that interests you and begin your learning journey with structured tutorials and hands-on projects.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/tutorials"
            className="px-6 py-3 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 font-medium"
          >
            Browse All Tutorials
          </Link>
          <Link
            to="/technologies"
            className="px-6 py-3 border border-emerald-600 text-emerald-600 rounded-md hover:bg-emerald-50 font-medium"
          >
            Explore Technologies
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DomainsPage;