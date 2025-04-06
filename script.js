// script.js
document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const htmlElement = document.documentElement;
    const themeToggleButton = document.getElementById('theme-toggle');
    const themeToggleIcon = document.getElementById('theme-toggle-icon');
    const headerLogo = document.getElementById('header-logo');

    // --- Icon and logo paths ---
    const lightThemeIcon = 'icons/sun-light.svg'
    const darkThemeIcon = 'icons/moon-dark.png'
    const lightLogo = 'res/logo-light.svg'
    const darkLogo = 'res/logo-dark.svg'

    // --- Theme function ---
    function applyTheme(theme) {
        if (theme === 'light') {
            // Set theme to light
            htmlElement.removeAttribute('data-theme');
            themeToggleIcon.src = darkThemeIcon;
            themeToggleIcon.alt = "Switch to dark mode";
            if (headerLogo) headerLogo.src = darkLogo;
            localStorage.setItem('theme', 'light');
        } else {
            // Set theme to dark
            htmlElement.setAttribute('data-theme', 'dark');
            themeToggleIcon.src = lightThemeIcon;
            themeToggleIcon.alt = "Switch to light mode";
            if (headerLogo) headerLogo.src = lightLogo;
            localStorage.setItem('theme', 'dark')
        }
    }

    // --- Initial theme setup ---

    // Check localStorage
    const savedTheme = localStorage.getItem('theme');

    // Check system preferences
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let currentTheme;

    if (savedTheme) {
        currentTheme = savedTheme;
    } else {
        // Set default theme based on system preferences
        currentTheme = prefersDark ? 'dark' : 'light';
    }

    // Apply theme on initial load
    applyTheme(currentTheme);

    // --- Event listener for toggle theme button ---
    themeToggleButton.addEventListener('click', () => {
        // Check the current theme
        const isDarkMode = htmlElement.hasAttribute('data-theme');
        // Toggle the opposite theme
        applyTheme(isDarkMode ? 'light' : 'dark');
    });

});