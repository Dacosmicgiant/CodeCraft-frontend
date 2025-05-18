import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Award, 
  BarChart, 
  Calendar, 
  Clock, 
  BookOpen,
  CheckCircle,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { userAPI } from '../services/api';

const ProgressPage = () => {
  const [progress, setProgress] = useState([]);
  const [stats, setStats] = useState({
    completedTutorials: 0,
    completedLessons: 0,
    streak: 0,
    totalTime: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchProgress();
  }, []);
  
  const fetchProgress = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await userAPI.getProgress();
      
      // Sort by last accessed date (most recent first)
      const sortedProgress = (response.data || []).sort((a, b) => 
        new Date(b.lastAccessed) - new Date(a.lastAccessed)
      );
      
      setProgress(sortedProgress);
      
      // Calculate stats
      if (sortedProgress.length > 0) {
        // Count completed tutorials (>75% progress)
        const completedTutorials = sortedProgress.filter(p => p.completion >= 75).length;
        
        // Estimate completed lessons (for demo purposes)
        const estimatedLessons = sortedProgress.reduce((total, p) => {
          // Assume average of 5 lessons per tutorial
          return total + Math.round((p.completion / 100) * 5);
        }, 0);
        
        // Calculate streak (simple demo implementation)
        // In a real app, this would be tracked properly on the backend
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const hasActivityToday = sortedProgress.some(p => 
          new Date(p.lastAccessed).toDateString() === today.toDateString()
        );
        
        const hasActivityYesterday = sortedProgress.some(p => 
          new Date(p.lastAccessed).toDateString() === yesterday.toDateString()
        );
        
        let streak = 0;
        if (hasActivityToday) streak = 1;
        if (hasActivityYesterday) streak = 2;
        
        // Estimate total time spent (based on tutorial estimated times)
        const totalTime = sortedProgress.reduce((total, p) => {
          // Assume average tutorial is 30 minutes
          const tutorialTime = p.tutorial?.estimatedTime || 30;
          return total + Math.round((p.completion / 100) * tutorialTime);
        }, 0);
        
        setStats({
          completedTutorials,
          completedLessons: estimatedLessons,
          streak,
          totalTime
        });
      }
    } catch (err) {
      console.error('Error fetching progress:', err);
      setError('Failed to load your progress. Please try again later.');
    } finally {
      setIsLoading(false);
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
      <h1 className="text-2xl md:text-3xl font-bold mb-8">My Learning Progress</h1>
      
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
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          icon={<BookOpen className="text-blue-500" />}
          label="Completed Tutorials"
          value={stats.completedTutorials}
          color="bg-blue-50"
        />
        <StatCard 
          icon={<CheckCircle className="text-green-500" />}
          label="Completed Lessons"
          value={stats.completedLessons}
          color="bg-green-50"
        />
        <StatCard 
          icon={<Calendar className="text-purple-500" />}
          label="Current Streak"
          value={`${stats.streak} days`}
          color="bg-purple-50"
        />
        <StatCard 
          icon={<Clock className="text-orange-500" />}
          label="Total Time Spent"
          value={`${stats.totalTime}m`}
          color="bg-orange-50"
        />
      </div>
      
      {progress.length === 0 ? (
        <div className="text-center bg-white p-8 rounded-lg shadow-sm">
          <Award size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-medium text-gray-900 mb-2">No progress yet</h2>
          <p className="text-gray-600 mb-6">
            You haven't started any tutorials yet. Begin your learning journey by exploring our tutorials.
          </p>
          <Link
            to="/tutorials"
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
          >
            Browse Tutorials
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b">
            <h3 className="font-medium text-gray-700">Your Tutorial Progress</h3>
          </div>
          
          <div className="divide-y">
            {progress.map(item => (
              <div key={item._id || item.tutorial?._id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <Link to={`/tutorials/${item.tutorial?._id}`}>
                      <h3 className="font-medium text-lg">{item.tutorial?.title || 'Tutorial'}</h3>
                    </Link>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Clock size={14} className="mr-1" />
                      <span>Last accessed: {new Date(item.lastAccessed).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-emerald-600 mr-3">
                      {item.completion}%
                    </div>
                    <div className="w-24 bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-emerald-600 h-2.5 rounded-full" 
                        style={{ width: `${item.completion}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <Link
                    to={`/tutorials/${item.tutorial?._id}`}
                    className="inline-flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700"
                  >
                    {item.completion < 100 ? 'Continue Learning' : 'Review Tutorial'}
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon, label, value, color }) => (
  <div className={`${color} border rounded-md p-4`}>
    <div className="flex items-center gap-3">
      <div className="p-2 bg-white rounded-md shadow-sm">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  </div>
);

export default ProgressPage;