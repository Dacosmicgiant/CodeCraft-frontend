import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  BookOpen, 
  Clock, 
  Award, 
  Calendar,
  Target,
  Zap,
  CheckCircle,
  Play,
  ArrowRight,
  Loader,
  Filter,
  BarChart3,
  Trophy,
  Flame
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { userAPI } from '../services/api';
import { COLORS } from '../constants/colors';

const ProgressPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [progressData, setProgressData] = useState([]);
  const [stats, setStats] = useState({
    totalTutorials: 0,
    completedTutorials: 0,
    inProgressTutorials: 0,
    totalLearningTime: 0,
    currentStreak: 0,
    longestStreak: 0,
    certificatesEarned: 0,
    averageScore: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('all');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchProgressData();
  }, [isAuthenticated, navigate]);

  const fetchProgressData = async () => {
    try {
      setIsLoading(true);
      const [progressRes, statsRes] = await Promise.all([
        userAPI.getProgress(),
        userAPI.getStats()
      ]);
      
      setProgressData(progressRes.data || []);
      setStats(statsRes.data || stats);
    } catch (err) {
      console.error('Error fetching progress data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredProgress = () => {
    let filtered = progressData;
    
    if (filter === 'completed') {
      filtered = filtered.filter(item => item.completion >= 100);
    } else if (filter === 'in-progress') {
      filtered = filtered.filter(item => item.completion > 0 && item.completion < 100);
    } else if (filter === 'not-started') {
      filtered = filtered.filter(item => item.completion === 0);
    }
    
    return filtered;
  };

  const getProgressColor = (completion) => {
    if (completion >= 100) return 'bg-green-500';
    if (completion >= 75) return 'bg-emerald-500';
    if (completion >= 50) return 'bg-yellow-500';
    if (completion >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getCompletionStatus = (completion) => {
    if (completion >= 100) return { label: 'Completed', color: COLORS.status.success.text };
    if (completion >= 75) return { label: 'Almost Done', color: COLORS.text.primary };
    if (completion >= 25) return { label: 'In Progress', color: 'text-yellow-600' };
    if (completion > 0) return { label: 'Started', color: 'text-orange-600' };
    return { label: 'Not Started', color: COLORS.text.tertiary };
  };

  const formatLearningTime = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours < 24) return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
  };

  const filteredProgress = getFilteredProgress();

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className={`min-h-screen ${COLORS.background.secondary} flex items-center justify-center`}>
        <div className="text-center">
          <Loader size={40} className={`animate-spin ${COLORS.text.primary} mb-4`} />
          <p className={COLORS.text.secondary}>Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${COLORS.background.secondary}`}>
      {/* Header */}
      <div className={`${COLORS.background.white} py-8 px-4 sm:px-6 lg:px-8 shadow-sm`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className={`text-3xl font-bold ${COLORS.text.dark} mb-2`}>Learning Progress</h1>
            <p className={`${COLORS.text.secondary}`}>
              Track your coding journey and celebrate your achievements
            </p>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`w-16 h-16 ${COLORS.background.primaryLight} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                <BookOpen className={`${COLORS.text.primary}`} size={24} />
              </div>
              <div className={`text-2xl font-bold ${COLORS.text.dark} mb-1`}>
                {stats.completedTutorials}/{stats.totalTutorials}
              </div>
              <div className={`text-sm ${COLORS.text.tertiary}`}>Tutorials</div>
            </div>

            <div className="text-center">
              <div className={`w-16 h-16 ${COLORS.background.primaryLight} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                <Clock className={`${COLORS.text.primary}`} size={24} />
              </div>
              <div className={`text-2xl font-bold ${COLORS.text.dark} mb-1`}>
                {formatLearningTime(stats.totalLearningTime)}
              </div>
              <div className={`text-sm ${COLORS.text.tertiary}`}>Learning Time</div>
            </div>

            <div className="text-center">
              <div className={`w-16 h-16 ${COLORS.background.primaryLight} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                <Flame className={`${COLORS.text.primary}`} size={24} />
              </div>
              <div className={`text-2xl font-bold ${COLORS.text.dark} mb-1`}>
                {stats.currentStreak}
              </div>
              <div className={`text-sm ${COLORS.text.tertiary}`}>Day Streak</div>
            </div>

            <div className="text-center">
              <div className={`w-16 h-16 ${COLORS.background.primaryLight} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                <Trophy className={`${COLORS.text.primary}`} size={24} />
              </div>
              <div className={`text-2xl font-bold ${COLORS.text.dark} mb-1`}>
                {stats.certificatesEarned}
              </div>
              <div className={`text-sm ${COLORS.text.tertiary}`}>Certificates</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'all', label: 'All Tutorials' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'in-progress', label: 'In Progress' },
                  { value: 'not-started', label: 'Not Started' }
                ].map((filterOption) => (
                  <button
                    key={filterOption.value}
                    onClick={() => setFilter(filterOption.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === filterOption.value
                        ? `${COLORS.background.primary} ${COLORS.text.white}`
                        : `${COLORS.background.white} ${COLORS.text.secondary} hover:${COLORS.background.tertiary} border ${COLORS.border.secondary}`
                    }`}
                  >
                    {filterOption.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <BarChart3 className={`${COLORS.text.tertiary}`} size={16} />
                <span className={`text-sm ${COLORS.text.secondary}`}>
                  {filteredProgress.length} tutorial{filteredProgress.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Progress List */}
            {filteredProgress.length === 0 ? (
              <div className={`text-center py-16 ${COLORS.background.white} rounded-xl`}>
                <div className={`w-16 h-16 ${COLORS.background.tertiary} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <BookOpen size={24} className={COLORS.text.tertiary} />
                </div>
                <h3 className={`text-xl font-semibold ${COLORS.text.dark} mb-2`}>
                  {filter === 'all' ? 'No tutorials started yet' : `No ${filter.replace('-', ' ')} tutorials`}
                </h3>
                <p className={`${COLORS.text.secondary} mb-6`}>
                  {filter === 'all' 
                    ? 'Start learning by browsing our tutorial library'
                    : 'Try changing the filter to see more tutorials'
                  }
                </p>
                <Link
                  to="/tutorials"
                  className={`inline-flex items-center gap-2 ${COLORS.button.primary} px-6 py-3 rounded-lg transition-colors duration-200`}
                >
                  Browse Tutorials <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProgress.map((item) => (
                  <ProgressCard key={item._id} progress={item} />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Achievement Summary */}
            <div className={`${COLORS.background.white} rounded-xl shadow-sm p-6`}>
              <h3 className={`text-lg font-semibold ${COLORS.text.dark} mb-4`}>Achievements</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${stats.completedTutorials > 0 ? 'bg-green-100 text-green-600' : COLORS.background.tertiary} rounded-lg flex items-center justify-center`}>
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <p className={`font-medium ${COLORS.text.dark} text-sm`}>First Tutorial</p>
                    <p className={`text-xs ${COLORS.text.tertiary}`}>Complete your first tutorial</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${stats.currentStreak >= 7 ? 'bg-orange-100 text-orange-600' : COLORS.background.tertiary} rounded-lg flex items-center justify-center`}>
                    <Flame size={20} />
                  </div>
                  <div>
                    <p className={`font-medium ${COLORS.text.dark} text-sm`}>Week Streak</p>
                    <p className={`text-xs ${COLORS.text.tertiary}`}>Learn for 7 days in a row</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${stats.completedTutorials >= 5 ? 'bg-blue-100 text-blue-600' : COLORS.background.tertiary} rounded-lg flex items-center justify-center`}>
                    <Target size={20} />
                  </div>
                  <div>
                    <p className={`font-medium ${COLORS.text.dark} text-sm`}>Fast Learner</p>
                    <p className={`text-xs ${COLORS.text.tertiary}`}>Complete 5 tutorials</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${stats.certificatesEarned >= 1 ? 'bg-yellow-100 text-yellow-600' : COLORS.background.tertiary} rounded-lg flex items-center justify-center`}>
                    <Award size={20} />
                  </div>
                  <div>
                    <p className={`font-medium ${COLORS.text.dark} text-sm`}>Certified</p>
                    <p className={`text-xs ${COLORS.text.tertiary}`}>Earn your first certificate</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Learning Goals */}
            <div className={`${COLORS.background.white} rounded-xl shadow-sm p-6`}>
              <h3 className={`text-lg font-semibold ${COLORS.text.dark} mb-4`}>Learning Goals</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className={COLORS.text.secondary}>Weekly Goal</span>
                    <span className={COLORS.text.primary}>3/5 tutorials</span>
                  </div>
                  <div className={`w-full ${COLORS.background.tertiary} rounded-full h-2`}>
                    <div className={`${COLORS.background.primary} h-2 rounded-full transition-all duration-300`} style={{ width: '60%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className={COLORS.text.secondary}>Monthly Goal</span>
                    <span className={COLORS.text.primary}>12/20 tutorials</span>
                  </div>
                  <div className={`w-full ${COLORS.background.tertiary} rounded-full h-2`}>
                    <div className={`${COLORS.background.primary} h-2 rounded-full transition-all duration-300`} style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>

              <button className={`w-full mt-4 px-4 py-2 ${COLORS.button.outline} rounded-lg text-sm font-medium transition-colors duration-200`}>
                Set New Goals
              </button>
            </div>

            {/* Recent Activity */}
            <div className={`${COLORS.background.white} rounded-xl shadow-sm p-6`}>
              <h3 className={`text-lg font-semibold ${COLORS.text.dark} mb-4`}>Recent Activity</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 ${COLORS.background.primary} rounded-full`}></div>
                  <div>
                    <p className={`text-sm ${COLORS.text.dark}`}>Completed HTML Basics</p>
                    <p className={`text-xs ${COLORS.text.tertiary}`}>2 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 ${COLORS.background.primary} rounded-full`}></div>
                  <div>
                    <p className={`text-sm ${COLORS.text.dark}`}>Started CSS Fundamentals</p>
                    <p className={`text-xs ${COLORS.text.tertiary}`}>Yesterday</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 bg-gray-300 rounded-full`}></div>
                  <div>
                    <p className={`text-sm ${COLORS.text.dark}`}>Earned "First Steps" badge</p>
                    <p className={`text-xs ${COLORS.text.tertiary}`}>3 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Progress Card Component
const ProgressCard = ({ progress }) => {
  const status = getCompletionStatus(progress.completion);
  
  return (
    <div className={`${COLORS.background.white} rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden`}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className={`text-lg font-semibold ${COLORS.text.dark} mb-1`}>
              {progress.tutorial?.title || 'Unknown Tutorial'}
            </h3>
            <p className={`${COLORS.text.secondary} text-sm mb-2`}>
              {progress.tutorial?.description || 'No description available'}
            </p>
            <div className="flex items-center gap-4 text-sm">
              <span className={`flex items-center gap-1 ${COLORS.text.tertiary}`}>
                <BookOpen size={14} />
                {progress.tutorial?.lessons?.length || 0} lessons
              </span>
              <span className={`flex items-center gap-1 ${status.color}`}>
                <CheckCircle size={14} />
                {status.label}
              </span>
            </div>
          </div>
          
          <div className="text-right">
            <div className={`text-2xl font-bold ${COLORS.text.dark} mb-1`}>
              {Math.round(progress.completion)}%
            </div>
            {progress.lastAccessed && (
              <div className={`text-xs ${COLORS.text.tertiary}`}>
                Last: {new Date(progress.lastAccessed).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className={`w-full ${COLORS.background.tertiary} rounded-full h-2`}>
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(progress.completion)}`}
              style={{ width: `${progress.completion}%` }}
            ></div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4 text-sm">
            {progress.timeSpent && (
              <span className={`flex items-center gap-1 ${COLORS.text.tertiary}`}>
                <Clock size={14} />
                {formatLearningTime(progress.timeSpent)}
              </span>
            )}
          </div>
          
          <Link
            to={`/tutorials/${progress.tutorial?.slug || progress.tutorial?._id}`}
            className={`flex items-center gap-2 px-4 py-2 ${
              progress.completion >= 100 ? COLORS.button.secondary : COLORS.button.primary
            } rounded-lg text-sm font-medium transition-colors duration-200`}
          >
            {progress.completion >= 100 ? (
              <>
                <CheckCircle size={16} />
                Review
              </>
            ) : progress.completion > 0 ? (
              <>
                <Play size={16} />
                Continue
              </>
            ) : (
              <>
                <Play size={16} />
                Start
              </>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

// Helper functions
const getProgressColor = (completion) => {
  if (completion >= 100) return 'bg-green-500';
  if (completion >= 75) return 'bg-emerald-500';
  if (completion >= 50) return 'bg-yellow-500';
  if (completion >= 25) return 'bg-orange-500';
  return 'bg-red-500';
};

const getCompletionStatus = (completion) => {
  if (completion >= 100) return { label: 'Completed', color: 'text-green-600' };
  if (completion >= 75) return { label: 'Almost Done', color: 'text-emerald-600' };
  if (completion >= 25) return { label: 'In Progress', color: 'text-yellow-600' };
  if (completion > 0) return { label: 'Started', color: 'text-orange-600' };
  return { label: 'Not Started', color: 'text-gray-500' };
};

const formatLearningTime = (minutes) => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours < 24) return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
};

export default ProgressPage;