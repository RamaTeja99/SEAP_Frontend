import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../store/themeSlice';
import { Sun, Moon } from 'lucide-react';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className={`theme-toggle-btn ${isDarkMode ? 'dark' : 'light'}`}
      aria-label="Toggle theme"
    >
      {isDarkMode ? (
        <Sun className="theme-icon" />
      ) : (
        <Moon className="theme-icon" />
      )}
    </button>
  );
};

export default ThemeToggle;
