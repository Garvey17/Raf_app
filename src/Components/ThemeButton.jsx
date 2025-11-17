"use client";
import { useTheme } from "../contexts/ThemeContext";
import { Sun } from 'lucide-react';
import { Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-2 rounded-2xl shadow  bg-gray-200 dark:bg-gray-700 text-black dark:text-white cursor-pointer"
    >
      {theme === "light" ? <Moon/> : <Sun/>} 
    </button>
  );
}
