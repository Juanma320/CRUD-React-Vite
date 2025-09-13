import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useState } from 'react';

interface SearchBarProps {
  readonly onSearch: (query: string) => void;
  readonly placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = "Buscar..." }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const handleChange = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
          <Search size={20} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="
            w-full pl-12 pr-12 py-4 
            bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm 
            border-2 border-gray-200 dark:border-gray-600 rounded-2xl
            focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none
            transition-all duration-300 text-gray-900 dark:text-white 
            placeholder-gray-400 dark:placeholder-gray-500
            hover:border-gray-300 dark:hover:border-gray-500 hover:bg-white/90 dark:hover:bg-gray-800/90
          "
        />
        {query && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X size={20} />
          </motion.button>
        )}
      </div>
      <motion.div
        className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: focused ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ transformOrigin: 'center' }}
      />
    </motion.div>
  );
}