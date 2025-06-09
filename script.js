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
        // Change the globe theme
        if (map) {
            setMapTheme();
        }
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
    function setupTimelineListeners() {
    
        timelineEvents.forEach(event => {
            const clickableArea = event.querySelector('.timeline-event-visuals');
            if (clickableArea && clickableArea.eventListener) {
                clickableArea.removeEventListener('click', clickableArea.eventListener);
            }
        });

        if (window.innerWidth > 1000) {
            timelineEvents.forEach(event => {
                const clickableArea = event.querySelector('.timeline-event-visuals');

                if (clickableArea) {
                    // Define the handler function
                    const eventHandler = () => {
                        const isCurrentlyActive = event.classList.contains('active');

                        // Close all other active events
                        timelineEvents.forEach(otherEvent => {
                            if (otherEvent !== event) {
                                otherEvent.classList.remove('active');
                            }
                        });
                        
                        // Toggle the current event
                        if (isCurrentlyActive) {
                            event.classList.remove('active');
                        } else {
                            event.classList.add('active');
                        }
                    };

                    // Store listener reference and add it
                    clickableArea.eventListener = eventHandler;
                    clickableArea.addEventListener('click', eventHandler);
                }
            });
        } else {
            timelineEvents.forEach(event => {
                event.classList.remove('active');
            });
        }
    }

    // Initial setup on page load
    setupTimelineListeners();

    // Re-run when resizing window
    let resizeTimer;

    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            setupTimelineListeners();
        }, 250);
    });

    // --- Experience Globe ---
    mapboxgl.accessToken = 'pk.eyJ1IjoibmlrdmVyd2VlbCIsImEiOiJjbWJvMnM5czIxbmx2MmpwanJ2N2tqcGJqIn0.yJ4esKuvXvday0EFNVrrHQ';

    // Variables
    const rotationSpeed = -0.05;
    const zoomToLevel = 10;      
    let userInteracted = false;
    let isSpinning = true; 

    // Project information
    const projectLocations = [
        {
            coordinates: [5.663677, 51.985239],
            title: 'Student Assistant functions at Wageningen University & Research',
            description: 'A range of Student Assistant functions during my BSc International Land and Water Management and MSc Geo-information Science at Wageningen University and Research. Helped develop, organise or provided support during practicals in the following courses: Geo-scripting, Geo-information Tools, Advanced Earth Observation, MGI Visualisation Portfolio, Land and Water Engineering, Design in Land and Water Management, Crops and Cropping Systems.'
        },
        {
            coordinates: [-16.772268, 13.139132],
            title: 'BSc Thesis and Internship in the Gambia',
            description: 'Interhsip as part of my BSc International Land and Water Management at Palm Lake Gunjur, an eco-tourism project aimed at natural regeneration of sand excavation areas. Simultaneously, writing my award-winning BSc thesis "<em>Flood hazard in tourism development area Gunjur, the Gambia</em>", read my thesis <a href="docs/bsc-thesis-nikverweel.pdf" target="_blank" rel="noopener noreferrer">here</a>.'
        },
        {
            coordinates: [5.665488, 51.987112],
            title: 'S.A. Artemis Board Year',
            description: 'Chair of Board II of <a href="https://sa-artemis.nl/" target="_blank" rel="noopener noreferrer">Study Assocation Artemis</a> during my MSc Geo-information Science at Wageningen University and Research. As Chair of Board II, increased membership of the association and expanded the number of activities, redesigned the online presence.'
        },
        {
            coordinates: [5.096943, 52.079516],
            title: 'Waterhandjes - Working student in the Water sector',
            description: 'A range of projects for <a href="https://www.waterhandjes.nl/" target="_blank" rel="noopener noreferrer">Waterhandjes</a>, including geo-data management at Watershap Limburg and multiple soil map digitisation projects for <a href="https://www.bij12.nl/onderwerp/adviescommissie-schade-grondwater/" target="_blank" rel="noopener noreferrer">ACSG</a>.'
        },
        {
            coordinates: [3.722533, 51.652916],
            title: 'Academic Consultancy for Antea Group NL',
            description: 'As part of my MSc Geo-information Science, performed an Academic Consultancy project for Antea Group Netherlands aimed at automated rubble stone detection. Read the report <a href="docs/act-finalreport.pdf">here</a>.'
        },
        {
            coordinates: [5.499818, 52.003074],
            title: 'MSc Thesis',
            description: 'Currently in progress, my MSc Thesis "<em>Sensing the forest through the trees, a data driven approach to Dutch forest reserve monitoring using AHN</em>". This thesis aims to explore the possibilities of ALS point clouds for forest reserve monitoring. <a href="https://nikverweel.github.io/dfr_webmap/" target="_blank" rel="noopener noreferrer">This online webmap</a> is part of my thesis.'
        }
    ];

    // Create map
    const map = new mapboxgl.Map({
        container: 'experience-globe',
        projection: 'globe',
        style: 'mapbox://styles/nikverweel/cmbo2y5th00tl01sc23c168hr',
        zoom: 1
    });

    function spinGlobe() {
        if (isSpinning && !userInteracted) {
            const center = map.getCenter();
            center.lng += rotationSpeed;
            map.setCenter(center);
            requestAnimationFrame(spinGlobe);
        }
    }

    function addMapElements() {
        const markerColor = getComputedStyle(document.documentElement).getPropertyValue('--background-colour').trim();
        
        // Add markers and popups for each location
        projectLocations.forEach(location => {
            const popup = new mapboxgl.Popup({ offset: 25 })
                .setHTML(`<h3>${location.title}</h3><p>${location.description}</p>`);

            const marker = new mapboxgl.Marker({ color: markerColor })
                .setLngLat(location.coordinates)
                .setPopup(popup)
                .addTo(map);

            marker.getElement().addEventListener('click', () => {
                userInteracted = true;
                isSpinning = false;

                map.flyTo({
                    center: location.coordinates,
                    zoom: zoomToLevel,
                    speed: 0.8,
                    curve: 1.3,
                    essential: true
                });
            });

        });
    }

    // Change map style based on theme
    function setMapTheme() {
        const isDarkMode = document.documentElement.hasAttribute('data-theme');
        const styleUrl = isDarkMode ? 'mapbox://styles/nikverweel/cmbo43omv00nl01qx3m4aex3e' : 'mapbox://styles/nikverweel/cmbo2y5th00tl01sc23c168hr';
        map.setStyle(styleUrl);
    }   

    // Load the map
    map.on('load', () => {
        setMapTheme();
        map.on('style.load', addMapElements);

        // Spin the globe
        spinGlobe();
    });

    // Stop spinning on interaction
    const stopSpinning = () => {
        userInteracted = true;
        isSpinning = false;
    };

    map.on('mousedown', stopSpinning);
    map.on('touchstart', stopSpinning);
    map.on('dragstart', stopSpinning);
    map.on('zoomstart', stopSpinning);

});