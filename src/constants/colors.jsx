// src/constants/colors.jsx
export const COLORS = {
  // Primary brand colors
  primary: {
    50: 'bg-emerald-50',
    100: 'bg-emerald-100',
    500: 'bg-emerald-500',
    600: 'bg-emerald-600',
    700: 'bg-emerald-700',
    800: 'bg-emerald-800',
    900: 'bg-emerald-900',
  },
  
  // Text colors
  text: {
    primary: 'text-emerald-600',
    primaryHover: 'text-emerald-700',
    primaryDark: 'text-emerald-800',
    secondary: 'text-gray-600',
    tertiary: 'text-gray-500',
    dark: 'text-gray-900',
    light: 'text-gray-700',
    white: 'text-white',
  },
  
  // Background colors
  background: {
    primary: 'bg-emerald-600',
    primaryHover: 'bg-emerald-700',
    primaryLight: 'bg-emerald-50',
    secondary: 'bg-gray-50',
    tertiary: 'bg-gray-100',
    white: 'bg-white',
    dark: 'bg-gray-900',
  },
  
  // Border colors
  border: {
    primary: 'border-emerald-200',
    primaryDark: 'border-emerald-500',
    secondary: 'border-gray-200',
    tertiary: 'border-gray-300',
    transparent: 'border-transparent',
  },
  
  // Gradient combinations
  gradients: {
    primary: 'from-emerald-500 to-emerald-600',
    secondary: 'from-emerald-600 to-emerald-700',
    hero: 'from-emerald-50 to-blue-50',
    card: 'from-white to-emerald-50',
  },
  
  // Status colors
  status: {
    success: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
    },
    error: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
    },
    warning: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
      border: 'border-yellow-200',
    },
    info: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
    },
  },
  
  // Interactive states
  interactive: {
    hover: {
      primary: 'hover:bg-emerald-700',
      secondary: 'hover:bg-gray-50',
      tertiary: 'hover:bg-gray-100',
      text: 'hover:text-emerald-700',
    },
    focus: {
      ring: 'focus:ring-emerald-500',
      border: 'focus:border-emerald-500',
      outline: 'focus:outline-none',
    },
    active: {
      primary: 'active:bg-emerald-800',
      scale: 'active:scale-95',
    },
  },
  
  // Component-specific color combinations
  button: {
    primary: `bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 focus:ring-emerald-500`,
    secondary: `bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500`,
    outline: `border border-emerald-600 text-emerald-600 hover:bg-emerald-50 focus:ring-emerald-500`,
    ghost: `text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700`,
  },
  
  // Card styles
  card: {
    default: `bg-white border border-gray-200 shadow-sm hover:shadow-md`,
    featured: `bg-gradient-to-br from-white to-emerald-50 border border-emerald-200 shadow-sm hover:shadow-md`,
    interactive: `bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all`,
  },
  
  // Difficulty levels
  difficulty: {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-blue-100 text-blue-800',
    advanced: 'bg-purple-100 text-purple-800',
  },
  
  // Domain-specific colors
  domains: {
    web: { bg: 'from-blue-500 to-cyan-500', border: 'border-blue-200', text: 'text-blue-700' },
    mobile: { bg: 'from-purple-500 to-pink-500', border: 'border-purple-200', text: 'text-purple-700' },
    data: { bg: 'from-green-500 to-teal-500', border: 'border-green-200', text: 'text-green-700' },
    ai: { bg: 'from-orange-500 to-red-500', border: 'border-orange-200', text: 'text-orange-700' },
    game: { bg: 'from-indigo-500 to-blue-500', border: 'border-indigo-200', text: 'text-indigo-700' },
    design: { bg: 'from-pink-500 to-rose-500', border: 'border-pink-200', text: 'text-pink-700' },
    security: { bg: 'from-gray-600 to-gray-800', border: 'border-gray-200', text: 'text-gray-700' },
    cloud: { bg: 'from-sky-500 to-blue-500', border: 'border-sky-200', text: 'text-sky-700' },
  },
};