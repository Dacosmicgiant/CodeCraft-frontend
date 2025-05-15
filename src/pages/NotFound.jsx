import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Page Not Found</h2>
        <p className="text-lg text-gray-600 max-w-md mx-auto mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
          >
            <Home size={18} />
            Go to Homepage
          </Link>
          <Link
            to="/tutorials"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors"
          >
            <Search size={18} />
            Browse Tutorials
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;