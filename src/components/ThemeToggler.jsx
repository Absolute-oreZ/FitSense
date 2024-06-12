import React, { useState, useEffect } from "react";

const ThemeToggler = () => {
  // State to manage the current theme
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if theme is stored in localStorage
    const storedTheme = localStorage.getItem("theme");
    // Check if the user has a preferred theme
    const systemTheme = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    // Return the stored theme or the system theme
    return storedTheme === "dark" || (storedTheme === null && systemTheme);
  });

  // Function to toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  // Effect to add or remove dark mode class based on the theme state
  useEffect(() => {
    const body = document.querySelector("body");
    if (isDarkMode) {
      body.classList.add("dark");
    } else {
      body.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div>
      <button
        className="sun"
        style={{ display: isDarkMode ? "none" : "block" }}
        onClick={toggleTheme}
      >
        ☀️
      </button>
      <button
        className="moon"
        style={{ display: isDarkMode ? "block" : "none" }}
        onClick={toggleTheme}
      >
        🌙
      </button>
    </div>
  );
};

export default ThemeToggler;
