// script.js
document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const htmlElement = document.documentElement;
    const themeToggleButton = document.getElementById('theme-toggle');
    const themeToggleIcon = document.getElementById('theme-toggle-icon');
    const headerLogo = document.getElementById('header-logo');
    const header = document.querySelector('header');
    const contentBoxes = document.querySelectorAll('.content-box');
    const scrollTopButton = document.getElementById('scroll-top');
    const navLinks = document.querySelectorAll('nav ul li a');

    // --- Icon and logo paths ---
    const lightThemeIcon = 'icons/sun-light.svg'
    const darkThemeIcon = 'icons/moon-dark.png'
    const lightLogo = 'res/logo-light.svg'
    const darkLogo = 'res/logo-dark.svg'

    // --- Social icons --- 
    const linkedinIcon = document.getElementById('linkedin-icon');
    const githubIcon = document.getElementById('github-icon');
    const emailIcon = document.getElementById('email-icon');
    const linkedDark = 'icons/linkedin-dark.svg'
    const linkedLight = 'icons/linkedin-light.svg'
    const githubDark = 'icons/github-dark.svg'
    const githubLight = 'icons/github-light.svg'
    const emailLight = 'icons/email-light.png'
    const emailDark = 'icons/email-dark.png'

    // --- Education timeline ---
    const timelineEvents = document.querySelectorAll('.education-timeline .timeline-event');

    // --- Theme function ---
    function applyTheme(theme) {
        if (theme === 'light') {
            // Set theme to light
            htmlElement.removeAttribute('data-theme');
            themeToggleIcon.src = darkThemeIcon;
            themeToggleIcon.alt = "Switch to dark mode";
            if (headerLogo) headerLogo.src = darkLogo;
            linkedinIcon.src = linkedDark;
            emailIcon.src = emailDark;
            githubIcon.src = githubDark;
            localStorage.setItem('theme', 'light');
        } else {
            // Set theme to dark
            htmlElement.setAttribute('data-theme', 'dark');
            themeToggleIcon.src = lightThemeIcon;
            themeToggleIcon.alt = "Switch to light mode";
            if (headerLogo) headerLogo.src = lightLogo;
            linkedinIcon.src = linkedLight;
            emailIcon.src = emailLight;
            githubIcon.src = githubLight;
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

    // --- Header slide-in animation on load ---
    setTimeout(() => {
        header.classList.remove('header-initial');
        header.classList.add('header-animated');
    }, 100);

    // --- Content box fade-in on scroll ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.25
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    contentBoxes.forEach(box => {
        observer.observe(box);
    });

    // --- Sticky header blur and scroll-to-top button ---
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;

        // Sticky header blur for desktop
        if (window.innerWidth > 768) {
            if (scrollTop > 0) {
                header.classList.add('sticky');
            } else {
                header.classList.remove('sticky');
            }
        }

        // Scroll-to-top button for mobile
        if (window.innerWidth <= 768) {
            if (scrollTop > 100) {
                scrollTopButton.classList.add('visible');
            } else {
                scrollTopButton.classList.remove('visible');
            }
        }
    });

    scrollTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // --- Smooth nav link scrolling ---
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only apply this behavior on desktop where the header is sticky
            if (window.innerWidth > 768) {
                e.preventDefault();

                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    const headerHeight = header.offsetHeight;
                    const scrollToPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight - 35;

                    window.scrollTo({
                        top: scrollToPosition,
                        behavior: 'smooth'
                    });
                }
            }

        });
    });

    // --- Education Timeline functioning ---
    timelineEvents.forEach(event => {
        const clickableArea = event.querySelector('.timeline-event-visuals');

        if (clickableArea) {
            clickableArea.addEventListener('click', () => {
                const isCurrentlyActive = event.classList.contains('active');

                timelineEvents.forEach(otherEvent => {
                    if (otherEvent !== event && otherEvent.classList.contains('active')) {
                        otherEvent.classList.remove('active');

                        if (window.innerWidth <= 1000) {
                            const otherDetails = otherEvent.querySelector('.timeline-event-details');
                            if (otherDetails) {
                                otherDetails.style.maxHeight = '0px';
                            }
                        }
                    }
                });

                if (isCurrentlyActive) {
                    event.classList.remove('active');
                    if (window.innerWidth <= 1000) {
                        const details = event.querySelector('.timeline-event-details');
                        if (details) {
                            details.style.maxHeight = '0px';
                        }
                    }
                } else {
                    event.classList.add('active');
                    if (window.innerWidth <= 1000) {
                        const details = event.querySelector('.timeline-details'); 
                        if (details) {
                            details.style.maxHeight = 'auto';
                            const scrollHeight = details.scrollHeight;
                            details.style.maxHeight = '0px';

                            requestAnimationFrame(() => {
                                details.style.maxHeight = scrollHeight + 'px';
                            });
                        }
                    }
                }

            });
        }

    });

});