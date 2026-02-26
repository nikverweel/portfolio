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
    const experienceIndex = document.getElementById('experience-index');
    const experienceGlobe = document.getElementById('experience-globe');

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
            htmlElement.style.colorScheme = 'light';
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
            htmlElement.style.colorScheme = 'dark';
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
    }, { passive: true });

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
    // Variables
    const rotationSpeed = -0.05;
    const zoomToLevel = 14;      
    let userInteracted = false;
    let isSpinning = true; 
    let mapMarkers = [];
    let activePopup = null;
    let map = null;
    let hasInitializedMap = false;

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
            description: 'Internship as part of my BSc International Land and Water Management at Palm Lake Gunjur, an eco-tourism project aimed at natural-based regeneration of sand excavation areas. Simultaneously, writing my award-winning BSc thesis "<em>Flood hazard in tourism development area Gunjur, the Gambia</em>", read my thesis <a href="docs/bsc-thesis-nikverweel.pdf" target="_blank" rel="noopener noreferrer">here</a>.'
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
            description: 'As part of my MSc Geo-information Science, performed an Academic Consultancy project for Antea Group Netherlands aimed at automated rubble stone detection. Read the report <a href="docs/act-finalreport.pdf" target="_blank" rel="noopener noreferrer">here</a>.'
        },
        {
            coordinates: [5.499818, 52.003074],
            title: 'MSc Thesis',
            description: 'MSc Thesis "<em>Sensing the forest through the trees, a data driven approach to Dutch forest reserve monitoring using AHN</em>", awarded with a 9.0/10. This thesis aimed to explore the possibilities of ALS point clouds for forest reserve monitoring. <a href="https://nikverweel.github.io/dfr_webmap/" target="_blank" rel="noopener noreferrer">This online webmap</a> is part of my thesis. Read the thesis <a href="docs/msc-thesis-nikverweel.pdf" target="_blank" rel="noopener noreferrer">here</a>.'
        },
        {
            coordinates: [5.667986, 51.968629],
            title: 'MSc Internship - Remote Sensing @ SmartCane',
            description: 'MSc Internship as Remote Sensing researcher at <a href="https://smartcane.ag/" target="_blank" rel="noopener noreferrer">SmartCane</a>. During my internship explored the possibilities of PlanetScope imagery for the distinction between sugarcane, weeds and gaps during the emergence phase of sugarcane in Tanzania, achieved through the development of Machine Learning models. Read my report <a href="docs/msc-internshipreport-nikverweel.pdf" target="_blank">here</a>'
        },
        {
            coordinates: [5.1492017, 52.0220347],
            title: 'Project coordinator @ Vialis',
            description: '2026 - <em>current</em>. Function as project coordinator in managament and maintanence tunnels at Vialis.'
        }
    ];

    function initializeMap() {
        if (hasInitializedMap || !experienceGlobe || typeof mapboxgl === 'undefined') {
            return;
        }

        hasInitializedMap = true;
        mapboxgl.accessToken = 'pk.eyJ1IjoibmlrdmVyd2VlbCIsImEiOiJjbWJvMnM5czIxbmx2MmpwanJ2N2tqcGJqIn0.yJ4esKuvXvday0EFNVrrHQ';

        const isMobile = window.innerWidth < 900;

        map = new mapboxgl.Map({
            container: 'experience-globe',
            projection: 'globe',
            style: 'mapbox://styles/nikverweel/cmbo2y5th00tl01sc23c168hr',
            zoom: isMobile ? 0.6 : 1
        });

        map.on('load', () => {
            setMapTheme();
            map.on('style.load', addMapElements);
            spinGlobe();
        });

        const stopSpinning = () => {
            userInteracted = true;
            isSpinning = false;
        };

        map.on('mousedown', stopSpinning);
        map.on('touchstart', stopSpinning);
        map.on('dragstart', stopSpinning);
        map.on('zoomstart', stopSpinning);
    }

    function spinGlobe() {
        if (!map) {
            return;
        }

        if (isSpinning && !userInteracted) {
            const center = map.getCenter();
            center.lng += rotationSpeed;
            map.setCenter(center);
            requestAnimationFrame(spinGlobe);
        }
    }

    function navigateToLocation(location, marker) {
        if (!map) {
            return;
        }

        const currentScrollY = window.scrollY;

        userInteracted = true;
        isSpinning = false;

        map.flyTo({
            center: location.coordinates,
            zoom: zoomToLevel,
            speed: 0.8,
            curve: 1.3,
            essential: true
        });

        const popup = marker.getPopup();
        if (popup) {
            if (activePopup && activePopup !== popup) {
                activePopup.remove();
            }
            popup.addTo(map);
            activePopup = popup;
        }

        requestAnimationFrame(() => {
            if (window.scrollY !== currentScrollY) {
                window.scrollTo({
                    top: currentScrollY,
                    left: 0,
                    behavior: 'auto'
                });
            }
        });
    }

    function addMapElements() {
        if (!map) {
            return;
        }

        const markerColor = getComputedStyle(document.documentElement).getPropertyValue('--background-colour').trim();

        mapMarkers.forEach(marker => marker.remove());
        mapMarkers = [];

        if (experienceIndex) {
            experienceIndex.innerHTML = '';
        }
        
        // Add markers and popups for each location
        projectLocations.forEach((location) => {
            const popup = new mapboxgl.Popup({ offset: 25, focusAfterOpen: false })
                .setHTML(`<h3>${location.title}</h3><p>${location.description}</p>`);

            const marker = new mapboxgl.Marker({ color: markerColor })
                .setLngLat(location.coordinates)
                .setPopup(popup)
                .addTo(map);

            mapMarkers.push(marker);

            marker.getElement().addEventListener('click', () => {
                navigateToLocation(location, marker);
            });

            if (experienceIndex) {
                const listItem = document.createElement('li');
                const listButton = document.createElement('button');
                listButton.type = 'button';
                listButton.className = 'experience-index-item';
                listButton.textContent = location.title;

                listButton.addEventListener('mousedown', (event) => {
                    event.preventDefault();
                });

                listButton.addEventListener('click', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    navigateToLocation(location, marker);
                });

                listItem.appendChild(listButton);
                experienceIndex.appendChild(listItem);
            }

        });
    }

    // Change map style based on theme
    function setMapTheme() {
        if (!map) {
            return;
        }

        const isDarkMode = document.documentElement.hasAttribute('data-theme');
        const styleUrl = isDarkMode ? 'mapbox://styles/nikverweel/cmbo43omv00nl01qx3m4aex3e' : 'mapbox://styles/nikverweel/cmbo2y5th00tl01sc23c168hr';
        map.setStyle(styleUrl);
    }

    if (experienceGlobe && 'IntersectionObserver' in window) {
        const mapObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    initializeMap();
                    observer.disconnect();
                }
            });
        }, {
            root: null,
            rootMargin: '300px 0px',
            threshold: 0.01
        });

        mapObserver.observe(experienceGlobe);
    } else {
        initializeMap();
    }

    // --- Set current year in footer ---
    const yearSpan = document.getElementById('year');
    const currentYear = new Date().getFullYear();
    yearSpan.textContent = currentYear;

    // --- Clear contact form ---
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', () => {
            // Wait 1 second to ensure submission starts, then clear fields
            setTimeout(() => {
                contactForm.reset();
            }, 1000);
        });
    }

});