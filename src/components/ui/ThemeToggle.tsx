import { motion } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../hooks/useThemeHook';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: 'light', icon: Sun, label: 'Claro' },
    { value: 'dark', icon: Moon, label: 'Oscuro' },
    { value: 'auto', icon: Monitor, label: 'Auto' }
  ] as const;

  return (
    <div className="relative">
      <motion.div
        className="flex bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-600 rounded-2xl p-1"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        {themes.map(({ value, icon: Icon, label }) => (
          <motion.button
            key={value}
            onClick={() => setTheme(value)}
            className={`
              relative flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300
              ${theme === value
                ? 'text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {theme === value && (
              <motion.div
                layoutId="theme-indicator"
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <div className="relative z-10 flex items-center gap-2">
              <Icon size={16} />
              <span className="text-sm">{label}</span>
            </div>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}