import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './components/layout/MainLayout';
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

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
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
