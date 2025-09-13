import { useEffect, useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { Theme } from '../types/theme';
import { ThemeContext } from '../contexts/ThemeContext';

interface ThemeProviderProps {
  readonly children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as Theme) || 'auto';
    }
    return 'auto';
  });

  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const updateTheme = () => {
      let newTheme: 'light' | 'dark';

      if (theme === 'auto') {
        newTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      } else {
        newTheme = theme;
      }

      setActualTheme(newTheme);
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

    updateTheme();

    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', updateTheme);
      return () => mediaQuery.removeEventListener('change', updateTheme);
    }
  }, [theme]);

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const contextValue = useMemo(() => ({
    theme,
    actualTheme,
    setTheme: handleSetTheme
  }), [theme, actualTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}