import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface GlassCardProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly hover?: boolean;
}

export default function GlassCard({ children, className = '', hover = true }: GlassCardProps) {
  return (
    <motion.div
      className={`
        backdrop-blur-xl bg-white/90 dark:bg-gray-800/90 border border-white/20 dark:border-gray-600/20 rounded-2xl shadow-2xl
        ${hover ? 'hover:bg-white/95 dark:hover:bg-gray-800/95 hover:shadow-3xl' : ''}
        ${className}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={hover ? { y: -5, scale: 1.02 } : {}}
    >
      <div className="relative p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/3 to-pink-500/5 dark:from-blue-500/10 dark:via-purple-500/8 dark:to-pink-500/10 rounded-2xl"></div>
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </motion.div>
  );
}