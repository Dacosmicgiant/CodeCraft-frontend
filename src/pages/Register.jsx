import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Loader, AlertCircle, BookOpen, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { COLORS } from '../constants/colors';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      navigate('/tutorials');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score < 2) return { strength: 1, label: 'Weak', color: 'bg-red-500' };
    if (score < 4) return { strength: 2, label: 'Fair', color: 'bg-yellow-500' };
    if (score < 5) return { strength: 3, label: 'Good', color: 'bg-green-500' };
    return { strength: 4, label: 'Strong', color: 'bg-green-600' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className={`min-h-screen ${COLORS.background.secondary} flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-3 mb-8">
            <div className={`${COLORS.background.primary} p-3 rounded-xl`}>
              <BookOpen className={`h-8 w-8 ${COLORS.text.white}`} />
            </div>
            <span className={`text-2xl font-bold ${COLORS.text.dark}`}>CodeCraft</span>
          </Link>
          <h2 className={`text-3xl font-bold ${COLORS.text.dark} mb-2`}>
            Create your account
          </h2>
          <p className={`${COLORS.text.secondary}`}>
            Join thousands of developers learning to code
          </p>
        </div>

        {/* Registration Form */}
        <div className={`${COLORS.background.white} py-8 px-6 shadow-lg rounded-xl ${COLORS.border.secondary} border`}>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {errors.submit && (
              <div className={`${COLORS.status.error.bg} ${COLORS.border.secondary} border rounded-lg p-4 flex items-center gap-3`}>
                <AlertCircle size={20} className={COLORS.status.error.text} />
                <span className={`text-sm ${COLORS.status.error.text}`}>{errors.submit}</span>
              </div>
            )}

            {/* Username Field */}
            <div>
              <label htmlFor="username" className={`block text-sm font-medium ${COLORS.text.dark} mb-2`}>
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <User className={`h-5 w-5 ${COLORS.text.tertiary}`} />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className={`w-full pl-10 pr-3 py-3 ${COLORS.border.secondary} border rounded-lg ${COLORS.interactive.focus.outline} ${COLORS.interactive.focus.ring} ${COLORS.interactive.focus.border} transition-colors duration-200 ${
                    errors.username ? `border-red-500 ${COLORS.status.error.bg}` : ''
                  }`}
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              {errors.username && (
                <p className={`mt-1 text-sm ${COLORS.status.error.text}`}>{errors.username}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className={`block text-sm font-medium ${COLORS.text.dark} mb-2`}>
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Mail className={`h-5 w-5 ${COLORS.text.tertiary}`} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`w-full pl-10 pr-3 py-3 ${COLORS.border.secondary} border rounded-lg ${COLORS.interactive.focus.outline} ${COLORS.interactive.focus.ring} ${COLORS.interactive.focus.border} transition-colors duration-200 ${
                    errors.email ? `border-red-500 ${COLORS.status.error.bg}` : ''
                  }`}
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className={`mt-1 text-sm ${COLORS.status.error.text}`}>{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className={`block text-sm font-medium ${COLORS.text.dark} mb-2`}>
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Lock className={`h-5 w-5 ${COLORS.text.tertiary}`} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className={`w-full pl-10 pr-10 py-3 ${COLORS.border.secondary} border rounded-lg ${COLORS.interactive.focus.outline} ${COLORS.interactive.focus.ring} ${COLORS.interactive.focus.border} transition-colors duration-200 ${
                    errors.password ? `border-red-500 ${COLORS.status.error.bg}` : ''
                  }`}
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className={`absolute inset-y-0 right-0 pr-3 flex items-center ${COLORS.text.tertiary} hover:${COLORS.text.secondary}`}
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className={COLORS.text.secondary}>Password strength:</span>
                    <span className={`font-medium ${
                      passwordStrength.strength >= 3 ? COLORS.text.primary : 
                      passwordStrength.strength >= 2 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className={`w-full ${COLORS.background.tertiary} rounded-full h-1.5`}>
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${(passwordStrength.strength / 4) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
              {errors.password && (
                <p className={`mt-1 text-sm ${COLORS.status.error.text}`}>{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className={`block text-sm font-medium ${COLORS.text.dark} mb-2`}>
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Lock className={`h-5 w-5 ${COLORS.text.tertiary}`} />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className={`w-full pl-10 pr-10 py-3 ${COLORS.border.secondary} border rounded-lg ${COLORS.interactive.focus.outline} ${COLORS.interactive.focus.ring} ${COLORS.interactive.focus.border} transition-colors duration-200 ${
                    errors.confirmPassword ? `border-red-500 ${COLORS.status.error.bg}` : ''
                  }`}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className={`absolute inset-y-0 right-0 pr-3 flex items-center ${COLORS.text.tertiary} hover:${COLORS.text.secondary}`}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className={`mt-1 text-sm ${COLORS.status.error.text}`}>{errors.confirmPassword}</p>
              )}
              {formData.confirmPassword && !errors.confirmPassword && formData.password === formData.confirmPassword && (
                <div className="mt-1 flex items-center gap-1">
                  <CheckCircle size={16} className="text-green-500" />
                  <span className="text-sm text-green-600">Passwords match</span>
                </div>
              )}
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className={`h-4 w-4 mt-1 ${COLORS.text.primary} ${COLORS.interactive.focus.ring} ${COLORS.border.secondary} rounded`}
              />
              <label htmlFor="terms" className={`ml-2 block text-sm ${COLORS.text.secondary}`}>
                I agree to the{' '}
                <Link to="/terms" className={`${COLORS.text.primary} hover:${COLORS.text.primaryHover}`}>
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className={`${COLORS.text.primary} hover:${COLORS.text.primaryHover}`}>
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-3 px-4 ${COLORS.button.primary} rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 hover:shadow-lg`}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader size={20} className="animate-spin" />
                  <span>Creating account...</span>
                </div>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className={`text-sm ${COLORS.text.secondary}`}>
              Already have an account?{' '}
              <Link
                to="/login"
                className={`${COLORS.text.primary} hover:${COLORS.text.primaryHover} font-medium transition-colors`}
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;