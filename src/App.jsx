import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';

// Pages
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import TutorialPage from './pages/Tutorial';
import ProfilePage from './pages/Profile';
import NotFoundPage from './pages/NotFound';
import BookmarksPage from './pages/Bookmarks';
import ProgressPage from './pages/Progress';

// Static pages
import AboutPage from './pages/About';
import ContactPage from './pages/Contact';
import PrivacyPage from './pages/Privacy';
import TermsPage from './pages/Terms';

// Dynamic tutorial pages
import DynamicTutorial from './pages/tutorials/DynamicTutorial';
import DynamicLesson from './pages/tutorials/DynamicLesson';
import DynamicTechnology from './pages/tutorials/DynamicTechnology';
import DynamicDomain from './pages/tutorials/DynamicDomain';
import DomainsPage from './pages/DomainsPage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import DomainManagement from './pages/admin/DomainManagement';
import DomainForm from './pages/admin/DomainForm';
import TechnologyManagement from './pages/admin/TechnologyManagement';
import TechnologyForm from './pages/admin/TechnologyForm';
import TutorialManagement from './pages/admin/TutorialManagement';
import TutorialForm from './pages/admin/TutorialForm';
import LessonManagement from './pages/admin/LessonManagement';
import LessonEditor from './pages/admin/LessonEditor';
import UserManagement from './pages/admin/UserManagement';
import SettingsPage from './pages/admin/Settings';

// Custom hook for auth
import { useAuth } from './hooks/useAuth';

// Protected route component
const ProtectedRoute = ({ children, adminRequired = false }) => {
  const { isAuthenticated, loading, user } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (adminRequired && (!user || user.role !== 'admin')) {
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Admin routes */}
            <Route path="/admin" element={
              <ProtectedRoute adminRequired={true}>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="domains" element={<DomainManagement />} />
              <Route path="domains/new" element={<DomainForm />} />
              <Route path="domains/edit/:id" element={<DomainForm />} />
              <Route path="technologies" element={<TechnologyManagement />} />
              <Route path="technologies/new" element={<TechnologyForm />} />
              <Route path="technologies/edit/:id" element={<TechnologyForm />} />
              <Route path="tutorials" element={<TutorialManagement />} />
              <Route path="tutorials/new" element={<TutorialForm />} />
              <Route path="tutorials/edit/:id" element={<TutorialForm />} />
              <Route path="lessons" element={<LessonManagement />} />
              <Route path="lessons/new" element={<LessonEditor />} />
              <Route path="lessons/edit/:id" element={<LessonEditor />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            
            {/* Main layout routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="tutorials" element={<TutorialPage />} />
              
              {/* Static pages */}
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="privacy" element={<PrivacyPage />} />
              <Route path="terms" element={<TermsPage />} />
              
              {/* User related routes */}
              <Route path="profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="dashboard" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="bookmarks" element={
                <ProtectedRoute>
                  <BookmarksPage />
                </ProtectedRoute>
              } />
              <Route path="progress" element={
                <ProtectedRoute>
                  <ProgressPage />
                </ProtectedRoute>
              } />
              
              {/* Dynamic routes - ORDER MATTERS! Most specific routes first */}
              
              {/* Domains index page - shows all domains */}
              <Route path="domains" element={<DomainsPage />} />
              
              {/* Specific tutorial by domain, technology, and slug */}
              <Route path="domains/:domain/technologies/:technology/tutorials/:tutorialSlug" element={<DynamicTutorial />} />
              
              {/* Tutorial by domain and technology (shows default/first tutorial) */}
              <Route path="domains/:domain/technologies/:technology" element={<DynamicTutorial />} />
              
              {/* Technology overview page */}
              <Route path="technologies/:technologySlug" element={<DynamicTechnology />} />
              
              {/* Domain overview page - THIS IS NOW PROPERLY USED */}
              <Route path="domains/:domainSlug" element={<DynamicDomain />} />
              
              {/* Direct tutorial by ID or slug */}
              <Route path="tutorials/:tutorialId" element={<DynamicTutorial />} />
              
              {/* Lesson routes */}
              <Route path="lessons/:lessonId" element={<DynamicLesson />} />
              <Route path="tutorials/:tutorialId/lessons/:lessonSlug" element={<DynamicLesson />} />
            </Route>
            
            {/* 404 route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;