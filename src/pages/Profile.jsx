import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { userAPI } from '../services/api';
import { User, Mail, Key, Bookmark, Award, Calendar, Clock, Edit, Save, AlertCircle, ArrowRight, Check, BookOpen } from 'lucide-react';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    bio: '',
    location: '',
    websiteUrl: ''
  });
  
  const [bookmarks, setBookmarks] = useState([]);
  const [progress, setProgress] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Fetch user profile data
  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || 'Web developer passionate about frontend technologies.',
        location: user.location || 'San Francisco, CA',
        websiteUrl: user.websiteUrl || 'https://johndoe.dev'
      });
    }
  }, [user]);
  
  // Fetch bookmarks
const fetchBookmarks = async () => {
  if (activeTab === 'bookmarks') {
    try {
      setIsLoading(true);
      const response = await userAPI.getBookmarks();
      setBookmarks(response.data || []);
    } catch (err) {
      console.error('Error fetching bookmarks:', err);
      // Handle the case where it might be an initial setup with no bookmarks
      setBookmarks([]);
      // Only show error if it's not just an empty response
      if (err.response?.status !== 404) {
        setError('Failed to load bookmarks. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  }
};
  
  // Fetch progress
const fetchProgress = async () => {
  if (activeTab === 'progress') {
    try {
      setIsLoading(true);
      const response = await userAPI.getProgress();
      setProgress(response.data || []);
    } catch (err) {
      console.error('Error fetching progress:', err);
      // Handle the case where it might be an initial setup with no progress
      setProgress([]);
      // Only show error if it's not just an empty response
      if (err.response?.status !== 404) {
        setError('Failed to load progress data. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  }
};
  
  // Load data based on active tab
  useEffect(() => {
    setError(null);
    
    if (activeTab === 'bookmarks') {
      fetchBookmarks();
    } else if (activeTab === 'progress') {
      fetchProgress();
    }
  }, [activeTab]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage('');
    
    try {
      setIsLoading(true);
      
      // Only send fields that are part of the API
      const dataToUpdate = {
        username: profileData.username,
        email: profileData.email
      };
      
      // Add password only if provided in a real implementation
      // if (profileData.password) {
      //   dataToUpdate.password = profileData.password;
      // }
      
      const response = await userAPI.updateProfile(dataToUpdate);
      
      // Update the local user context with new data
      setUser({
        ...user,
        username: response.data.username,
        email: response.data.email
      });
      
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Profile Header */}
          <div className="bg-emerald-600 h-32 relative">
            <div className="absolute -bottom-16 left-6">
              <div className="w-32 h-32 bg-white rounded-full p-1">
                <div className="w-full h-full bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-emerald-600">
                    {profileData.username ? profileData.username.charAt(0).toUpperCase() : '?'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-20 pb-6 px-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold">{profileData.username}</h1>
                <p className="text-gray-600">{profileData.email}</p>
              </div>
              
              <div className="mt-4 md:mt-0 flex items-center gap-2">
                {activeTab === 'profile' && !isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 flex items-center gap-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors"
                  >
                    <Edit size={16} />
                    Edit Profile
                  </button>
                ) : null}
              </div>
            </div>
          </div>
          
          {/* Success Message */}
          {successMessage && (
            <div className="mx-6 mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-md flex items-start">
              <Check size={18} className="mr-2 mt-0.5 flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}
          
          {/* Error Message */}
          {error && (
            <div className="mx-6 mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-md flex items-start">
              <AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          {/* Navigation Tabs */}
          <div className="border-t border-b">
            <div className="flex space-x-4 px-6">
              <NavTab 
                active={activeTab === 'profile'} 
                onClick={() => setActiveTab('profile')}
                icon={<User size={16} />}
                label="Profile"
              />
              <NavTab 
                active={activeTab === 'progress'} 
                onClick={() => setActiveTab('progress')}
                icon={<Award size={16} />}
                label="Progress"
              />
              <NavTab 
                active={activeTab === 'bookmarks'} 
                onClick={() => setActiveTab('bookmarks')}
                icon={<Bookmark size={16} />}
                label="Bookmarks"
              />
            </div>
          </div>
          
          {/* Tab Content */}
          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                {isEditing ? (
                  <form onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Username
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                            <User size={16} />
                          </span>
                          <input
                            type="text"
                            name="username"
                            value={profileData.username}
                            onChange={handleChange}
                            className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                            <Mail size={16} />
                          </span>
                          <input
                            type="email"
                            name="email"
                            value={profileData.email}
                            onChange={handleChange}
                            className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bio
                        </label>
                        <textarea
                          name="bio"
                          value={profileData.bio}
                          onChange={handleChange}
                          rows={4}
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        ></textarea>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={profileData.location}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Website
                        </label>
                        <input
                          type="url"
                          name="websiteUrl"
                          value={profileData.websiteUrl}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-6 gap-3">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
                        disabled={isLoading}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 flex items-center gap-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors disabled:opacity-70"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Saving...' : (
                          <>
                            <Save size={16} />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">About</h3>
                      <p className="text-gray-600">{profileData.bio}</p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <ProfileItem icon={<Mail size={16} />} label="Email" value={profileData.email} />
                      <ProfileItem icon={<User size={16} />} label="Username" value={profileData.username} />
                      <ProfileItem icon={<Award size={16} />} label="Experience" value="Intermediate" />
                      <ProfileItem icon={<Calendar size={16} />} label="Joined" value="January 2023" />
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Progress Tab */}
            {activeTab === 'progress' && (
              <div>
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600"></div>
                  </div>
                ) : (
                  <>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                      <StatCard 
                        icon={<BookOpen className="text-blue-500" />}
                        label="Completed Tutorials"
                        value={progress.length || "0"}
                        color="bg-blue-50"
                      />
                      <StatCard 
                        icon={<Award className="text-yellow-500" />}
                        label="Completed Exercises"
                        value={"0"}
                        color="bg-yellow-50"
                      />
                      <StatCard 
                        icon={<Calendar className="text-green-500" />}
                        label="Current Streak"
                        value={"0 days"}
                        color="bg-green-50"
                      />
                      <StatCard 
                        icon={<Clock className="text-purple-500" />}
                        label="Total Time Spent"
                        value={"0h 0m"}
                        color="bg-purple-50"
                      />
                    </div>
                    
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                    
                    {progress.length > 0 ? (
                      <div className="border rounded-md overflow-hidden">
                        <div className="px-4 py-3 bg-gray-50 border-b">
                          <h4 className="font-medium text-gray-700">Progress Tracking</h4>
                        </div>
                        <div className="divide-y">
                          {progress.map((item, index) => (
                            <div key={index} className="py-3 px-4 flex justify-between items-center">
                              <div>
                                <h3 className="font-medium">{item.tutorial?.title || "Tutorial"}</h3>
                                <div className="flex items-center text-sm text-gray-500">
                                  <span>Progress: {item.completion}%</span>
                                  <span className="mx-2">•</span>
                                  <span>Last accessed: {new Date(item.lastAccessed).toLocaleDateString()}</span>
                                </div>
                              </div>
                              <div className="w-24 bg-gray-200 rounded-full h-2.5">
                                <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: `${item.completion}%` }}></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12 border rounded-md bg-gray-50">
                        <Award size={48} className="mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No progress yet</h3>
                        <p className="text-gray-600 mb-4">
                          Start learning tutorials to track your progress
                        </p>
                        <a
                          href="/tutorials"
                          className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium"
                        >
                          Browse Tutorials
                          <ArrowRight size={16} />
                        </a>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
            
            {/* Bookmarks Tab */}
            {activeTab === 'bookmarks' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Saved Tutorials</h3>
                
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-600"></div>
                  </div>
                ) : bookmarks.length > 0 ? (
                  <div className="space-y-3">
                    {bookmarks.map((bookmark, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-md hover:bg-gray-50"
                      >
                        <div className="flex items-center">
                          <Bookmark size={18} className="text-emerald-500 mr-3" />
                          <div>
                            <h4 className="font-medium">{bookmark.title}</h4>
                            <div className="text-sm text-gray-500">{bookmark.description}</div>
                          </div>
                        </div>
                        <a
                          href={`/tutorials/${bookmark.slug || bookmark._id}`}
                          className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                        >
                          View
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border rounded-md bg-gray-50">
                    <Bookmark size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No bookmarks yet</h3>
                    <p className="text-gray-600 mb-4">
                      Save tutorials and exercises for easy access later.
                    </p>
                    <a
                      href="/tutorials"
                      className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      Browse Tutorials
                      <ArrowRight size={16} />
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Navigation Tab Component
const NavTab = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1.5 py-4 px-3 text-sm font-medium border-b-2 transition-colors ${
      active 
        ? 'border-emerald-500 text-emerald-600' 
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
    }`}
  >
    {icon}
    {label}
  </button>
);

// Profile Item Component
const ProfileItem = ({ icon, label, value }) => (
  <div className="flex items-start">
    <div className="mr-3 mt-1 text-gray-500">{icon}</div>
    <div>
      <h4 className="text-xs font-medium text-gray-500 uppercase">{label}</h4>
      <p className="text-gray-900">{value}</p>
    </div>
  </div>
);

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

export default ProfilePage;