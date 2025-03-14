// Intersection Observer for animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Get all animated elements within the section
            const animatedElements = entry.target.querySelectorAll('[data-animate]');
            
            animatedElements.forEach(element => {
                // Add the animate class to trigger the animation
                element.classList.add('animate');
            });
            
            // Unobserve the section after animation
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
}); 