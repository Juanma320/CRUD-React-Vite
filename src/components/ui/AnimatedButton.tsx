import { motion } from 'framer-motion';
import type { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface AnimatedButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragEnd' | 'onDragStart' | 'onAnimationStart' | 'onAnimationEnd'> {
  readonly variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'gradient';
  readonly size?: 'sm' | 'md' | 'lg';
  readonly loading?: boolean;
  readonly icon?: React.ReactNode;
}

export default function AnimatedButton({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}: AnimatedButtonProps) {
  const baseClasses = 'relative font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group';

  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl focus:ring-blue-500/50',
    secondary: 'bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow-md focus:ring-gray-500/50',
    danger: 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl focus:ring-red-500/50',
    ghost: 'bg-transparent hover:bg-white text-gray-600 dark:text-gray-300 hover:text-gray-900 focus:ring-gray-500/50',
    gradient: 'bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-2xl focus:ring-purple-500/50'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <motion.button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 600, damping: 20, duration: 0.15 }}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      <div className="relative flex items-center justify-center gap-2">
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : icon}
        {children}
      </div>
    </motion.button>
  );
}