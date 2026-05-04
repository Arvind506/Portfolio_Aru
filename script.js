// Initialize AOS Animation Library
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
        offset: 50
    });

    // Optional: Add a subtle parallax effect to the hero image on mousemove
    const heroImage = document.querySelector('.hero__image-wrapper');
    if (heroImage) {
        document.addEventListener('mousemove', function(e) {
            const x = (window.innerWidth - e.pageX * 2) / 100;
            const y = (window.innerHeight - e.pageY * 2) / 100;
            heroImage.style.transform = `translateX(${x}px) translateY(${y}px)`;
        });
    }
});
