import { motion } from 'framer-motion';
import { useState } from 'react';
import type { InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface ModernInputProps extends InputHTMLAttributes<HTMLInputElement> {
  readonly label?: string;
  readonly error?: string;
  readonly icon?: React.ReactNode;
}

export default function ModernInput({
  label,
  error,
  icon,
  type = 'text',
  className = '',
  ...props
}: ModernInputProps) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="space-y-2">
      {label && (
        <motion.label
          className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {label}
        </motion.label>
      )}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 transition-colors">
              {icon}
            </div>
          )}
          <input
            type={inputType}
            className={`
              w-full px-4 py-4 ${icon ? 'pl-12' : ''} ${isPassword ? 'pr-12' : ''}
              bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl
              focus:border-blue-500 focus:bg-white focus:outline-none
              transition-all duration-300 text-gray-900 placeholder-gray-400 dark:placeholder-gray-500
              hover:border-gray-300 hover:bg-white/90
              ${error ? 'border-red-400 focus:border-red-500' : ''}
              ${className}
            `}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>
        <motion.div
          className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: focused ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ transformOrigin: 'center' }}
        />
      </div>
      {error && (
        <motion.p
          className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="w-1 h-1 bg-red-500 rounded-full"></span>
          {error}
        </motion.p>
      )}
    </div>
  );
}