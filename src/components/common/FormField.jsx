import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

/**
 * A responsive form field component with support for validation errors and various input types
 */
const FormField = ({
  id,
  name,
  label,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error = '',
  required = false,
  disabled = false,
  autoComplete = '',
  icon = null,
  className = '',
  helperText = '',
  showPasswordToggle = false,
  showPassword = false,
  onTogglePassword = null,
  min,
  max,
  pattern,
  rows = 3
}) => {
  // Determine if the input is a textarea or select
  const isTextArea = type === 'textarea';
  const isSelect = type === 'select';
  const isCheckbox = type === 'checkbox';
  const isPassword = type === 'password';
  
  // Generate unique IDs for accessibility if not provided
  const inputId = id || `field-${name}`;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;
  
  return (
    <div className={`${isCheckbox ? 'flex items-start' : ''} ${className}`}>
      {/* Label - positioned differently for checkboxes */}
      {!isCheckbox && label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className={`${isCheckbox ? 'flex-shrink-0 mr-2 pt-0.5' : 'relative'}`}>
        {/* Checkbox input */}
        {isCheckbox ? (
          <input
            id={inputId}
            name={name}
            type="checkbox"
            checked={value}
            onChange={onChange}
            disabled={disabled}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            aria-invalid={!!error}
            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
          />
        ) : isTextArea ? (
          /* Textarea */
          <textarea
            id={inputId}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            rows={rows}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            aria-invalid={!!error}
            className={`appearance-none block w-full px-3 py-2 border ${
              error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500'
            } rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm ${
              icon ? 'pl-10' : ''
            }`}
          />
        ) : isSelect ? (
          /* Select input */
          <select
            id={inputId}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            aria-invalid={!!error}
            className={`appearance-none block w-full px-3 py-2 border ${
              error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500'
            } rounded-md shadow-sm focus:outline-none sm:text-sm ${
              icon ? 'pl-10' : ''
            }`}
          >
            {/* Children (options) are passed as children */}
            {React.Children.map(children, child => child)}
          </select>
        ) : (
          /* Regular input */
          <input
            id={inputId}
            name={name}
            type={isPassword ? (showPassword ? 'text' : 'password') : type}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            autoComplete={autoComplete}
            min={min}
            max={max}
            pattern={pattern}
            required={required}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            aria-invalid={!!error}
            className={`appearance-none block w-full px-3 py-2 border ${
              error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500'
            } rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm ${
              icon ? 'pl-10' : ''
            } ${isPassword ? 'pr-10' : ''}`}
          />
        )}
        
        {/* Icon at the left of input */}
        {icon && !isCheckbox && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            {icon}
          </div>
        )}
        
        {/* Password toggle button */}
        {isPassword && showPasswordToggle && onTogglePassword && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            onClick={onTogglePassword}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      
      {/* Label placement for checkboxes */}
      {isCheckbox && label && (
        <label 
          htmlFor={inputId} 
          className={`text-sm ${error ? 'text-red-600' : 'text-gray-700'}`}
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      {/* Error message */}
      {error && (
        <p className="mt-1 text-sm text-red-600" id={errorId}>
          {error}
        </p>
      )}
      
      {/* Helper text */}
      {!error && helperText && (
        <p className="mt-1 text-xs text-gray-500" id={helperId}>
          {helperText}
        </p>
      )}
    </div>
  );
};

export default FormField;