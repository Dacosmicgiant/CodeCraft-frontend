// Update src/App.jsx to include admin routes
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import TutorialPage from './pages/Tutorial';
import ProfilePage from './pages/Profile';
import NotFoundPage from './pages/NotFound';
import { useAuth } from './hooks/useAuth';

// Import static tutorial pages
import HTMLTutorial from './pages/tutorials/HTMLTutorial';
import CSSTutorial from './pages/tutorials/CSSTutorial';
import JavaScriptTutorial from './pages/tutorials/JavaScriptTutorial';
import ReactTutorial from './pages/tutorials/ReactTutorial';

// Import admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import DomainManagement from './pages/admin/DomainManagement';
import DomainForm from './pages/admin/DomainForm';
import TechnologyManagement from './pages/admin/TechnologyManagement';
import TechnologyForm from './pages/admin/TechnologyForm';
import LessonManagement from './pages/admin/LessonManagement';
import LessonEditor from './pages/admin/LessonEditor';

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
              <Route path="lessons" element={<LessonManagement />} />
              <Route path="lessons/new" element={<LessonEditor />} />
              <Route path="lessons/edit/:id" element={<LessonEditor />} />
            </Route>
            
            {/* Main layout routes */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="tutorials" element={<TutorialPage />} />
              
              {/* Static tutorial pages */}
              <Route path="tutorials/html" element={<HTMLTutorial />} />
              <Route path="tutorials/css" element={<CSSTutorial />} />
              <Route path="tutorials/javascript" element={<JavaScriptTutorial />} />
              <Route path="tutorials/react" element={<ReactTutorial />} />
              
              {/* Dynamic tutorial routes (for future use) */}
              <Route path="tutorials/:topic/:page" element={<TutorialPage />} />
              
              {/* Protected routes */}
              <Route path="profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
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