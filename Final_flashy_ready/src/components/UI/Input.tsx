import React from 'react';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'time';
  required?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string;
  rows?: number;
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  required = false,
  disabled = false,
  className = '',
  error,
  rows
}) => {
  const inputClasses = `
    w-full px-4 py-2 rounded-lg border font-inter
    ${error 
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
      : 'border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-500'
    }
    bg-white dark:bg-gray-800 text-gray-900 dark:text-white
    placeholder-gray-500 dark:placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-opacity-50
    disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed
    transition-colors duration-200
    ${className}
  `;

  const InputComponent = rows ? 'textarea' : 'input';

  return (
    <div className="space-y-2">
      {label && (
        <label className="block font-inter font-medium text-sm text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <InputComponent
        type={rows ? undefined : type}
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        className={inputClasses}
      />
      {error && (
        <p className="text-red-500 text-xs font-inter">{error}</p>
      )}
    </div>
  );
};

export default Input;