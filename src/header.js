let lastScrollTop = 0;
let isScrolling = false;
let scrollTimeout;
let isHeaderVisible = true;

const header = document.querySelector('header');
const navContainer = document.querySelector('.nav-container');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelectorAll('.nav-link');

// Function to toggle body scroll
function toggleBodyScroll(disable) {
    if (disable) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

// Function to close menu
function closeMenu() {
    hamburger.classList.remove('cross');
    navContainer.classList.remove('show');
    toggleBodyScroll(false);
}

// Function to handle scroll events
function handleScroll() {
    if (!isScrolling) {
        isScrolling = true;
        window.requestAnimationFrame(() => {
            const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Determine scroll direction
            if (currentScrollTop > lastScrollTop) {
                // Scrolling down
                header.classList.add('hidden');
                header.classList.remove('visible');
                isHeaderVisible = false;
            } else {
                // Scrolling up
                header.classList.remove('hidden');
                header.classList.add('visible');
                isHeaderVisible = true;
            }
            
            lastScrollTop = currentScrollTop;
            isScrolling = false;
        });
    }
}

// Add scroll event listener with throttling
window.addEventListener('scroll', () => {
    if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
            handleScroll();
            scrollTimeout = null;
        }, 10);
    }
});

// Only show header at the very top of the page
window.addEventListener('scroll', () => {
    if (window.pageYOffset === 0) {
        header.classList.remove('hidden');
        header.classList.add('visible');
        isHeaderVisible = true;
    }
});

// Handle menu open/close
hamburger.addEventListener('click', () => {
    // First toggle the menu classes
    hamburger.classList.toggle('cross');
    navContainer.classList.toggle('show');
    
    // Then disable scroll if menu is now open
    if (navContainer.classList.contains('show')) {
        toggleBodyScroll(true);
    } else {
        toggleBodyScroll(false);
    }
});

// Handle menu item clicks
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        closeMenu();
    });
}); 