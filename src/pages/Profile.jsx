import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Edit, 
  Save, 
  X, 
  Camera,
  Award,
  BookOpen,
  Clock,
  TrendingUp,
  Loader,
  CheckCircle,
  AlertCircle,
  Settings,
  Shield
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { userAPI } from '../services/api';
import { COLORS } from '../constants/colors';

const ProfilePage = () => {
  const { user, isAuthenticated, updateUser } = useAuth();
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    bio: '',
    location: '',
    website: '',
    githubProfile: '',
    linkedinProfile: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [stats, setStats] = useState({
    completedTutorials: 0,
    totalLearningTime: 0,
    streak: 0,
    certificates: 0
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchProfileData();
  }, [isAuthenticated, navigate]);

  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      const [profileRes, statsRes] = await Promise.all([
        userAPI.getProfile(),
        userAPI.getStats()
      ]);
      
      const profile = profileRes.data;
      setProfileData({
        username: profile.username || '',
        email: profile.email || '',
        bio: profile.bio || '',
        location: profile.location || '',
        website: profile.website || '',
        githubProfile: profile.githubProfile || '',
        linkedinProfile: profile.linkedinProfile || ''
      });
      
      setStats(statsRes.data || stats);
    } catch (err) {
      console.error('Error fetching profile data:', err);
      setError('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError('');
      
      await userAPI.updateProfile(profileData);
      updateUser({ ...user, ...profileData });
      
      setSuccess('Profile updated successfully!');
      setEditMode(false);
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to original data
    setProfileData({
      username: user?.username || '',
      email: user?.email || '',
      bio: user?.bio || '',
      location: user?.location || '',
      website: user?.website || '',
      githubProfile: user?.githubProfile || '',
      linkedinProfile: user?.linkedinProfile || ''
    });
    setEditMode(false);
    setError('');
  };

  const formatLearningTime = (minutes) => {
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours`;
    const days = Math.floor(hours / 24);
    return `${days} days`;
  };

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  if (isLoading) {
    return (
      <div className={`min-h-screen ${COLORS.background.secondary} flex items-center justify-center`}>
        <div className="text-center">
          <Loader size={40} className={`animate-spin ${COLORS.text.primary} mb-4`} />
          <p className={COLORS.text.secondary}>Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${COLORS.background.secondary}`}>
      {/* Header */}
      <div className={`${COLORS.background.white} py-8 px-4 sm:px-6 lg:px-8 shadow-sm`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* Profile Picture */}
              <div className="relative">
                <div className={`w-24 h-24 ${COLORS.background.primary} rounded-full flex items-center justify-center text-white text-2xl font-bold`}>
                  {profileData.username.charAt(0).toUpperCase()}
                </div>
                <button className={`absolute bottom-0 right-0 w-8 h-8 ${COLORS.background.white} rounded-full border-2 ${COLORS.border.primary} flex items-center justify-center hover:${COLORS.background.tertiary} transition-colors`}>
                  <Camera size={14} className={COLORS.text.primary} />
                </button>
              </div>
              
              {/* Basic Info */}
              <div>
                <h1 className={`text-3xl font-bold ${COLORS.text.dark}`}>{profileData.username}</h1>
                <p className={`${COLORS.text.secondary} flex items-center gap-2 mt-1`}>
                  <Mail size={16} />
                  {profileData.email}
                </p>
                <p className={`${COLORS.text.tertiary} flex items-center gap-2 mt-1`}>
                  <Calendar size={16} />
                  Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className={`flex items-center gap-2 px-4 py-2 ${COLORS.button.primary} rounded-lg transition-colors duration-200`}
                >
                  <Edit size={18} />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    className={`flex items-center gap-2 px-4 py-2 ${COLORS.button.secondary} rounded-lg transition-colors duration-200`}
                  >
                    <X size={18} />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`flex items-center gap-2 px-4 py-2 ${COLORS.button.primary} rounded-lg transition-colors duration-200 disabled:opacity-50`}
                  >
                    {isSaving ? <Loader size={18} className="animate-spin" /> : <Save size={18} />}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Messages */}
        {error && (
          <div className={`${COLORS.status.error.bg} ${COLORS.border.secondary} border rounded-lg p-4 mb-6 flex items-center gap-3`}>
            <AlertCircle size={20} className={COLORS.status.error.text} />
            <span className={`${COLORS.status.error.text}`}>{error}</span>
          </div>
        )}

        {success && (
          <div className={`${COLORS.status.success.bg} ${COLORS.border.secondary} border rounded-lg p-4 mb-6 flex items-center gap-3`}>
            <CheckCircle size={20} className={COLORS.status.success.text} />
            <span className={`${COLORS.status.success.text}`}>{success}</span>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className={`${COLORS.background.white} rounded-xl shadow-sm p-6`}>
              <h2 className={`text-xl font-semibold ${COLORS.text.dark} mb-6`}>Personal Information</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium ${COLORS.text.dark} mb-2`}>Username</label>
                  {editMode ? (
                    <input
                      type="text"
                      name="username"
                      value={profileData.username}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 ${COLORS.border.secondary} border rounded-lg ${COLORS.interactive.focus.outline} ${COLORS.interactive.focus.ring} ${COLORS.interactive.focus.border} transition-colors duration-200`}
                    />
                  ) : (
                    <p className={`${COLORS.text.secondary} py-2`}>{profileData.username || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className={`block text-sm font-medium ${COLORS.text.dark} mb-2`}>Email</label>
                  <p className={`${COLORS.text.secondary} py-2`}>{profileData.email}</p>
                  <p className={`text-xs ${COLORS.text.tertiary}`}>Email cannot be changed here</p>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${COLORS.text.dark} mb-2`}>Location</label>
                  {editMode ? (
                    <input
                      type="text"
                      name="location"
                      value={profileData.location}
                      onChange={handleInputChange}
                      placeholder="City, Country"
                      className={`w-full px-3 py-2 ${COLORS.border.secondary} border rounded-lg ${COLORS.interactive.focus.outline} ${COLORS.interactive.focus.ring} ${COLORS.interactive.focus.border} transition-colors duration-200`}
                    />
                  ) : (
                    <p className={`${COLORS.text.secondary} py-2 flex items-center gap-2`}>
                      <MapPin size={16} />
                      {profileData.location || 'Not provided'}
                    </p>
                  )}
                </div>

                <div>
                  <label className={`block text-sm font-medium ${COLORS.text.dark} mb-2`}>Website</label>
                  {editMode ? (
                    <input
                      type="url"
                      name="website"
                      value={profileData.website}
                      onChange={handleInputChange}
                      placeholder="https://yourwebsite.com"
                      className={`w-full px-3 py-2 ${COLORS.border.secondary} border rounded-lg ${COLORS.interactive.focus.outline} ${COLORS.interactive.focus.ring} ${COLORS.interactive.focus.border} transition-colors duration-200`}
                    />
                  ) : (
                    <p className={`${COLORS.text.secondary} py-2`}>
                      {profileData.website ? (
                        <a href={profileData.website} target="_blank" rel="noopener noreferrer" className={`${COLORS.text.primary} hover:${COLORS.text.primaryHover}`}>
                          {profileData.website}
                        </a>
                      ) : (
                        'Not provided'
                      )}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <label className={`block text-sm font-medium ${COLORS.text.dark} mb-2`}>Bio</label>
                {editMode ? (
                  <textarea
                    name="bio"
                    value={profileData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Tell us about yourself..."
                    className={`w-full px-3 py-2 ${COLORS.border.secondary} border rounded-lg ${COLORS.interactive.focus.outline} ${COLORS.interactive.focus.ring} ${COLORS.interactive.focus.border} transition-colors duration-200 resize-none`}
                  />
                ) : (
                  <p className={`${COLORS.text.secondary} py-2 leading-relaxed`}>
                    {profileData.bio || 'No bio provided yet.'}
                  </p>
                )}
              </div>
            </div>

            {/* Social Profiles */}
            <div className={`${COLORS.background.white} rounded-xl shadow-sm p-6`}>
              <h2 className={`text-xl font-semibold ${COLORS.text.dark} mb-6`}>Social Profiles</h2>
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${COLORS.text.dark} mb-2`}>GitHub Profile</label>
                  {editMode ? (
                    <input
                      type="url"
                      name="githubProfile"
                      value={profileData.githubProfile}
                      onChange={handleInputChange}
                      placeholder="https://github.com/yourusername"
                      className={`w-full px-3 py-2 ${COLORS.border.secondary} border rounded-lg ${COLORS.interactive.focus.outline} ${COLORS.interactive.focus.ring} ${COLORS.interactive.focus.border} transition-colors duration-200`}
                    />
                  ) : (
                    <p className={`${COLORS.text.secondary} py-2`}>
                      {profileData.githubProfile ? (
                        <a href={profileData.githubProfile} target="_blank" rel="noopener noreferrer" className={`${COLORS.text.primary} hover:${COLORS.text.primaryHover}`}>
                          {profileData.githubProfile}
                        </a>
                      ) : (
                        'Not provided'
                      )}
                    </p>
                  )}
                </div>

                <div>
                  <label className={`block text-sm font-medium ${COLORS.text.dark} mb-2`}>LinkedIn Profile</label>
                  {editMode ? (
                    <input
                      type="url"
                      name="linkedinProfile"
                      value={profileData.linkedinProfile}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/yourusername"
                      className={`w-full px-3 py-2 ${COLORS.border.secondary} border rounded-lg ${COLORS.interactive.focus.outline} ${COLORS.interactive.focus.ring} ${COLORS.interactive.focus.border} transition-colors duration-200`}
                    />
                  ) : (
                    <p className={`${COLORS.text.secondary} py-2`}>
                      {profileData.linkedinProfile ? (
                        <a href={profileData.linkedinProfile} target="_blank" rel="noopener noreferrer" className={`${COLORS.text.primary} hover:${COLORS.text.primaryHover}`}>
                          {profileData.linkedinProfile}
                        </a>
                      ) : (
                        'Not provided'
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Learning Stats */}
            <div className={`${COLORS.background.white} rounded-xl shadow-sm p-6`}>
              <h3 className={`text-lg font-semibold ${COLORS.text.dark} mb-4`}>Learning Stats</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${COLORS.background.primaryLight} rounded-lg flex items-center justify-center`}>
                      <BookOpen className={`${COLORS.text.primary}`} size={20} />
                    </div>
                    <div>
                      <p className={`font-medium ${COLORS.text.dark}`}>{stats.completedTutorials}</p>
                      <p className={`text-sm ${COLORS.text.tertiary}`}>Completed</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${COLORS.background.primaryLight} rounded-lg flex items-center justify-center`}>
                      <Clock className={`${COLORS.text.primary}`} size={20} />
                    </div>
                    <div>
                      <p className={`font-medium ${COLORS.text.dark}`}>{formatLearningTime(stats.totalLearningTime)}</p>
                      <p className={`text-sm ${COLORS.text.tertiary}`}>Learning Time</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${COLORS.background.primaryLight} rounded-lg flex items-center justify-center`}>
                      <TrendingUp className={`${COLORS.text.primary}`} size={20} />
                    </div>
                    <div>
                      <p className={`font-medium ${COLORS.text.dark}`}>{stats.streak} days</p>
                      <p className={`text-sm ${COLORS.text.tertiary}`}>Current Streak</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${COLORS.background.primaryLight} rounded-lg flex items-center justify-center`}>
                      <Award className={`${COLORS.text.primary}`} size={20} />
                    </div>
                    <div>
                      <p className={`font-medium ${COLORS.text.dark}`}>{stats.certificates}</p>
                      <p className={`text-sm ${COLORS.text.tertiary}`}>Certificates</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className={`${COLORS.background.white} rounded-xl shadow-sm p-6`}>
              <h3 className={`text-lg font-semibold ${COLORS.text.dark} mb-4`}>Quick Actions</h3>
              
              <div className="space-y-3">
                <button 
                  onClick={() => navigate('/progress')}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg ${COLORS.interactive.hover.secondary} transition-colors text-left`}
                >
                  <TrendingUp className={`${COLORS.text.primary}`} size={18} />
                  <span className={`${COLORS.text.secondary}`}>View Progress</span>
                </button>
                
                <button 
                  onClick={() => navigate('/bookmarks')}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg ${COLORS.interactive.hover.secondary} transition-colors text-left`}
                >
                  <BookOpen className={`${COLORS.text.primary}`} size={18} />
                  <span className={`${COLORS.text.secondary}`}>My Bookmarks</span>
                </button>
                
                <button 
                  onClick={() => navigate('/settings')}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg ${COLORS.interactive.hover.secondary} transition-colors text-left`}
                >
                  <Settings className={`${COLORS.text.primary}`} size={18} />
                  <span className={`${COLORS.text.secondary}`}>Account Settings</span>
                </button>
                
                <button 
                  onClick={() => navigate('/privacy')}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg ${COLORS.interactive.hover.secondary} transition-colors text-left`}
                >
                  <Shield className={`${COLORS.text.primary}`} size={18} />
                  <span className={`${COLORS.text.secondary}`}>Privacy Settings</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;