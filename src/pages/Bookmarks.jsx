import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bookmark, 
  BookOpen, 
  Clock, 
  BarChart,
  X,
  AlertCircle 
} from 'lucide-react';
import { userAPI } from '../services/api';

const BookmarksPage = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchBookmarks();
  }, []);
  
  const fetchBookmarks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await userAPI.getBookmarks();
      setBookmarks(response.data || []);
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
      setError('Failed to load your bookmarks. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const removeBookmark = async (tutorialId) => {
    try {
      await userAPI.removeBookmark(tutorialId);
      
      // Update the local state
      setBookmarks(bookmarks.filter(bookmark => 
        bookmark._id !== tutorialId
      ));
    } catch (err) {
      console.error('Error removing bookmark:', err);
      alert('Failed to remove bookmark. Please try again.');
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">My Bookmarks</h1>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-start">
            <AlertCircle className="flex-shrink-0 h-5 w-5 text-red-500 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {bookmarks.length === 0 ? (
        <div className="text-center bg-white p-8 rounded-lg shadow-sm">
          <Bookmark size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-medium text-gray-900 mb-2">No bookmarks yet</h2>
          <p className="text-gray-600 mb-6">
            You haven't bookmarked any tutorials yet. When you find tutorials you'd like to save for later,
            click the bookmark icon to add them here.
          </p>
          <Link
            to="/tutorials"
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
          >
            Browse Tutorials
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {bookmarks.map(bookmark => (
            <div key={bookmark._id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between">
                  <div className="flex-1">
                    <h2 className="text-lg font-medium text-gray-900">{bookmark.title}</h2>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">{bookmark.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                      {bookmark.domain && (
                        <span className="flex items-center">
                          <BookOpen size={14} className="mr-1" />
                          {bookmark.domain.name || 'Web Development'}
                        </span>
                      )}
                      <span className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        {bookmark.estimatedTime || '30'} min
                      </span>
                      <span className="flex items-center">
                        <BarChart size={14} className="mr-1" />
                        {bookmark.difficulty?.charAt(0).toUpperCase() + bookmark.difficulty?.slice(1) || 'Beginner'}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => removeBookmark(bookmark._id)}
                    className="ml-4 p-2 text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-full"
                    title="Remove Bookmark"
                  >
                    <Bookmark size={20} className="fill-yellow-500" />
                  </button>
                </div>
                
                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    Bookmarked on {
                      new Date(bookmark.createdAt || Date.now()).toLocaleDateString()
                    }
                  </div>
                  <Link
                    to={`/tutorials/${bookmark._id}`}
                    className="px-3 py-1 bg-emerald-600 text-white text-sm rounded-md hover:bg-emerald-700"
                  >
                    View Tutorial
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarksPage;