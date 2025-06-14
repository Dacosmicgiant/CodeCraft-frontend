import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bookmark, 
  BookOpen, 
  Clock, 
  Trash2, 
  ArrowRight, 
  Search,
  Filter,
  Grid,
  List,
  Loader,
  Heart,
  X
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { userAPI } from '../services/api';
import { COLORS } from '../constants/colors';

const BookmarksPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [bookmarks, setBookmarks] = useState([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [isRemoving, setIsRemoving] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchBookmarks();
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    filterBookmarks();
  }, [bookmarks, searchQuery, selectedCategory]);

  const fetchBookmarks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await userAPI.getBookmarks();
      setBookmarks(response.data || []);
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
      setError('Failed to load bookmarks. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const filterBookmarks = () => {
    let filtered = bookmarks;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(bookmark =>
        bookmark.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bookmark.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bookmark.technology?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category/difficulty
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(bookmark => bookmark.difficulty === selectedCategory);
    }

    setFilteredBookmarks(filtered);
  };

  const removeBookmark = async (bookmarkId) => {
    try {
      setIsRemoving(bookmarkId);
      await userAPI.removeBookmark(bookmarkId);
      setBookmarks(prev => prev.filter(b => b._id !== bookmarkId));
    } catch (err) {
      console.error('Error removing bookmark:', err);
      alert('Failed to remove bookmark. Please try again.');
    } finally {
      setIsRemoving(null);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return COLORS.difficulty.beginner;
      case 'intermediate': return COLORS.difficulty.intermediate;
      case 'advanced': return COLORS.difficulty.advanced;
      default: return COLORS.difficulty.beginner;
    }
  };

  const getTechnologyIcon = (techName) => {
    const name = techName?.toLowerCase() || '';
    if (name.includes('html')) return { icon: 'HTML', color: 'from-orange-500 to-red-500' };
    if (name.includes('css')) return { icon: 'CSS', color: 'from-blue-500 to-cyan-500' };
    if (name.includes('javascript')) return { icon: 'JS', color: 'from-yellow-400 to-yellow-600' };
    if (name.includes('react')) return { icon: 'React', color: 'from-cyan-500 to-blue-500' };
    if (name.includes('node')) return { icon: 'Node', color: 'from-green-500 to-green-600' };
    if (name.includes('python')) return { icon: 'Py', color: 'from-blue-600 to-purple-600' };
    return { icon: techName?.substring(0, 2).toUpperCase() || 'CODE', color: 'from-emerald-500 to-teal-600' };
  };

  const categories = [
    { value: 'all', label: 'All Bookmarks' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className={`min-h-screen ${COLORS.background.secondary}`}>
      {/* Header */}
      <div className={`${COLORS.background.white} py-8 px-4 sm:px-6 lg:px-8 shadow-sm`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className={`text-3xl font-bold ${COLORS.text.dark} mb-2`}>My Bookmarks</h1>
              <p className={`${COLORS.text.secondary}`}>
                Your saved tutorials and learning resources
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' 
                      ? `${COLORS.background.primary} ${COLORS.text.white}` 
                      : `${COLORS.background.tertiary} ${COLORS.text.secondary} hover:${COLORS.background.primary} hover:${COLORS.text.white}`
                  }`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' 
                      ? `${COLORS.background.primary} ${COLORS.text.white}` 
                      : `${COLORS.background.tertiary} ${COLORS.text.secondary} hover:${COLORS.background.primary} hover:${COLORS.text.white}`
                  }`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Search className={`h-5 w-5 ${COLORS.text.tertiary}`} />
              </div>
              <input
                type="text"
                placeholder="Search your bookmarks..."
                className={`w-full pl-10 pr-10 py-3 ${COLORS.border.secondary} border rounded-lg ${COLORS.interactive.focus.outline} ${COLORS.interactive.focus.ring} ${COLORS.interactive.focus.border} transition-colors duration-200`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`absolute inset-y-0 right-0 pr-3 flex items-center ${COLORS.text.tertiary} hover:${COLORS.text.secondary}`}
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="sm:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`w-full px-3 py-3 ${COLORS.border.secondary} border rounded-lg ${COLORS.interactive.focus.outline} ${COLORS.interactive.focus.ring} ${COLORS.interactive.focus.border} transition-colors duration-200`}
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4">
            <p className={`${COLORS.text.secondary} text-sm`}>
              {isLoading ? 'Loading...' : `${filteredBookmarks.length} bookmark${filteredBookmarks.length !== 1 ? 's' : ''} found`}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader size={40} className={`animate-spin ${COLORS.text.primary}`} />
          </div>
        ) : error ? (
          <div className={`text-center py-16 ${COLORS.background.white} rounded-xl`}>
            <div className={`w-16 h-16 ${COLORS.status.error.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <Heart size={24} className={COLORS.status.error.text} />
            </div>
            <h3 className={`text-xl font-semibold ${COLORS.text.dark} mb-2`}>Error Loading Bookmarks</h3>
            <p className={`${COLORS.text.secondary} mb-6`}>{error}</p>
            <button
              onClick={fetchBookmarks}
              className={`${COLORS.button.primary} px-6 py-2 rounded-lg transition-colors duration-200`}
            >
              Try Again
            </button>
          </div>
        ) : filteredBookmarks.length === 0 ? (
          <div className={`text-center py-16 ${COLORS.background.white} rounded-xl`}>
            <div className={`w-16 h-16 ${COLORS.background.tertiary} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <Bookmark size={24} className={COLORS.text.tertiary} />
            </div>
            <h3 className={`text-xl font-semibold ${COLORS.text.dark} mb-2`}>
              {searchQuery || selectedCategory !== 'all' ? 'No matches found' : 'No bookmarks yet'}
            </h3>
            <p className={`${COLORS.text.secondary} mb-6`}>
              {searchQuery || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Start bookmarking tutorials to access them quickly later'}
            </p>
            <Link
              to="/tutorials"
              className={`inline-flex items-center gap-2 ${COLORS.button.primary} px-6 py-3 rounded-lg transition-colors duration-200`}
            >
              Browse Tutorials <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredBookmarks.map((bookmark) => (
              viewMode === 'grid' ? (
                <BookmarkCard 
                  key={bookmark._id} 
                  bookmark={bookmark} 
                  onRemove={removeBookmark}
                  isRemoving={isRemoving === bookmark._id}
                  getDifficultyColor={getDifficultyColor}
                  getTechnologyIcon={getTechnologyIcon}
                />
              ) : (
                <BookmarkListItem 
                  key={bookmark._id} 
                  bookmark={bookmark} 
                  onRemove={removeBookmark}
                  isRemoving={isRemoving === bookmark._id}
                  getDifficultyColor={getDifficultyColor}
                  getTechnologyIcon={getTechnologyIcon}
                />
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Grid View Card Component
const BookmarkCard = ({ bookmark, onRemove, isRemoving, getDifficultyColor, getTechnologyIcon }) => {
  const techInfo = getTechnologyIcon(bookmark.technology?.name);
  
  return (
    <div className={`${COLORS.background.white} rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group`}>
      {/* Header */}
      <div className={`bg-gradient-to-r ${techInfo.color} p-4 relative`}>
        <div className="flex justify-between items-start">
          <div className={`${COLORS.background.white} bg-opacity-20 backdrop-blur-sm rounded-lg p-2 inline-flex items-center justify-center`}>
            <span className="text-white font-bold text-sm">
              {techInfo.icon}
            </span>
          </div>
          <button
            onClick={() => onRemove(bookmark._id)}
            disabled={isRemoving}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isRemoving 
                ? 'bg-black bg-opacity-20 cursor-not-allowed' 
                : 'bg-black bg-opacity-20 hover:bg-opacity-30 text-white'
            }`}
          >
            {isRemoving ? <Loader size={16} className="animate-spin" /> : <Trash2 size={16} />}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(bookmark.difficulty)}`}>
            {bookmark.difficulty?.charAt(0).toUpperCase() + bookmark.difficulty?.slice(1) || 'Beginner'}
          </div>
          <div className="text-xs text-gray-400">
            {new Date(bookmark.createdAt || Date.now()).toLocaleDateString()}
          </div>
        </div>

        <h3 className={`text-lg font-semibold ${COLORS.text.dark} mb-2 group-hover:${COLORS.text.primary} transition-colors`}>
          {bookmark.title}
        </h3>

        <p className={`${COLORS.text.secondary} text-sm mb-4 leading-relaxed line-clamp-2`}>
          {bookmark.description}
        </p>

        <div className="flex items-center justify-between text-xs mb-4">
          <div className={`flex items-center gap-1 ${COLORS.text.tertiary}`}>
            <BookOpen size={14} />
            <span>{bookmark.lessons?.length || 0} lessons</span>
          </div>
          <div className={`flex items-center gap-1 ${COLORS.text.tertiary}`}>
            <Clock size={14} />
            <span>~2 hours</span>
          </div>
        </div>

        <Link
          to={`/tutorials/${bookmark.slug || bookmark._id}`}
          className={`flex items-center justify-center gap-2 w-full py-2 ${COLORS.button.primary} rounded-lg transition-colors duration-200 text-sm font-medium`}
        >
          Continue Learning <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

// List View Item Component
const BookmarkListItem = ({ bookmark, onRemove, isRemoving, getDifficultyColor, getTechnologyIcon }) => {
  const techInfo = getTechnologyIcon(bookmark.technology?.name);
  
  return (
    <div className={`${COLORS.background.white} rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className={`w-12 h-12 bg-gradient-to-r ${techInfo.color} rounded-lg flex items-center justify-center`}>
            <span className="text-white font-bold text-sm">{techInfo.icon}</span>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h3 className={`text-lg font-semibold ${COLORS.text.dark}`}>{bookmark.title}</h3>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(bookmark.difficulty)}`}>
                {bookmark.difficulty?.charAt(0).toUpperCase() + bookmark.difficulty?.slice(1) || 'Beginner'}
              </div>
            </div>
            <p className={`${COLORS.text.secondary} text-sm mb-2`}>{bookmark.description}</p>
            <div className="flex items-center gap-4 text-xs">
              <span className={`flex items-center gap-1 ${COLORS.text.tertiary}`}>
                <BookOpen size={14} />
                {bookmark.lessons?.length || 0} lessons
              </span>
              <span className={`flex items-center gap-1 ${COLORS.text.tertiary}`}>
                <Clock size={14} />
                ~2 hours
              </span>
              <span className={COLORS.text.tertiary}>
                Saved {new Date(bookmark.createdAt || Date.now()).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={`/tutorials/${bookmark.slug || bookmark._id}`}
            className={`${COLORS.button.primary} px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium`}
          >
            Continue
          </Link>
          <button
            onClick={() => onRemove(bookmark._id)}
            disabled={isRemoving}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              isRemoving 
                ? `${COLORS.background.tertiary} cursor-not-allowed` 
                : `${COLORS.status.error.bg} ${COLORS.status.error.text} hover:bg-red-100`
            }`}
          >
            {isRemoving ? <Loader size={16} className="animate-spin" /> : <Trash2 size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookmarksPage;