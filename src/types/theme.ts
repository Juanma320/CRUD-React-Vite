export type Theme = 'light' | 'dark' | 'auto';

export interface ThemeContextType {
  theme: Theme;
  actualTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}