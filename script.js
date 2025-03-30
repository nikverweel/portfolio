// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Get elements from HTML
    const body = document.body;
    const headerLogo = document.getElementById('header-logo');
    const nightButton = document.querySelector('.nightmode-button button');
    const htmlElement = document.querySelector('html'); 

    // Define CSS variables
    const cssVariableNames = [
        "--dark-background",
        "--light-text"
    ];

    // Function for light mode
    function lightMode() {
        // Change colours etc
        nightButton.querySelector('img').src = "icons/moon-dark.png";
        nightButton.querySelector('alt') = "Light Mode";
        localStorage.setItem('theme', 'light');
        htmlElement.setAttribute('data-theme', 'light');

        // Set CSS Variables
        document.documentElement.style.setProperty(cssVariableNames[0], '#CAD2C5');
        document.documentElement.style.setProperty(cssVariableNames[1], '#2f3e46');

    }

    // Function for dark mode
    function darkMode() {
        // Change colours etc
        nightButton.querySelector('img').src = "icons/sun-light.svg";
        nightButton.querySelector('alt') = "Dark Mode";
        localStorage.setItem('theme', 'dark');
        htmlElement.setAttribute('data-theme', 'dark');

        // Set CSS Variables
        document.documentElement.style.setProperty(cssVariableNames[0], '#2f3e46');
        document.documentElement.style.setProperty(cssVariableNames[1], '#CAD2C5');

    }

    // Set mode automatically based on application preference
    if (localStorage.getItem('theme') === 'light') {
        lightMode();
    } else if (localStorage.getItem('theme') === 'dark') {
        darkMode();
    } else {
        // Check system preference
        if (window.matchMedia('(prefers-color-scheme: light)').matches) {
            lightMode();
        } else {
            darkMode();
        }
    }

    // Change modes on click
    nightButton.addEventListener('click', () => {
        if (nightButton.querySelector('img').src === "icons/sun-light.svg") {
            darkMode();
        } else {
            lightMode();
        }
    });
});