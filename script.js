// Initialize AOS Animation Library
document.addEventListener('DOMContentLoaded', function () {
    // Hide loader
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
        }, 1500);
    }

    // Initialize AOS
    AOS.init({
        duration: 1000,
        easing: 'ease-out-cubic',
        once: true,
        mirror: false,
        offset: 50
    });

    // Custom Cursor
    const cursor = document.getElementById('cursor-glow');
    if (cursor && window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        // Add hover effect for clickable elements
        const clickables = document.querySelectorAll('a, button, input, textarea');
        clickables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.width = '100px';
                cursor.style.height = '100px';
                cursor.style.background = 'radial-gradient(circle, rgba(188, 19, 254, 0.2) 0%, transparent 70%)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.width = '300px';
                cursor.style.height = '300px';
                cursor.style.background = 'radial-gradient(circle, rgba(0, 243, 255, 0.15) 0%, transparent 70%)';
            });
        });
    }

    // Sticky Header
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Hamburger Menu
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.header__nav-links');
    const navItems = document.querySelectorAll('.header__nav-links a');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Parallax effect on hero image
    const heroImage = document.querySelector('.hero__image-wrapper');
    if (heroImage && window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener('mousemove', function (e) {
            const x = (window.innerWidth - e.pageX * 2) / 100;
            const y = (window.innerHeight - e.pageY * 2) / 100;
            heroImage.style.transform = `translateX(${x}px) translateY(${y}px)`;
        });
    }

    // Smooth Scrolling for anchor links (Optimized Fallback)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Exact calculation considering fixed navbar
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Web3Forms Contact Form Submission
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const toastContainer = document.getElementById('toast-container');

    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Add loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;

            const formData = new FormData(form);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: json
                });

                const result = await response.json();

                if (response.status == 200) {
                    showToast('Transmission Successful. I will contact you soon.', 'success');
                    form.reset();
                } else {
                    console.log(response);
                    showToast(result.message || 'Transmission Failed. Please try again.', 'error');
                }
            } catch (error) {
                console.log(error);
                showToast('Network error. Transmission Failed.', 'error');
            } finally {
                // Remove loading state
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
        });
    }

    // Toast Notification System
    function showToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icon = type === 'success' ? '✓' : '✕';

        toast.innerHTML = `
            <span class="toast-icon">${icon}</span>
            <span class="toast-message">${message}</span>
        `;

        toastContainer.appendChild(toast);

        // Trigger reflow for animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        // Remove toast after 5 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 400); // Wait for transition
        }, 5000);
    }
});

// Global functions for Dashboard Modal
window.openDashboardModal = function () {
    const modal = document.getElementById('dashboardModal');
    const iframe = document.getElementById('dashboardIframe');

    // Only load the iframe src when opening to save resources
    if (!iframe.src || iframe.src === window.location.href || iframe.src === '') {
        iframe.src = 'dashboard.html';
    }

    modal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
};

window.closeDashboardModal = function () {
    const modal = document.getElementById('dashboardModal');
    modal.classList.remove('show');
    document.body.style.overflow = ''; // Restore background scrolling
};

// Close modal on outside click
window.addEventListener('click', function (e) {
    const modal = document.getElementById('dashboardModal');
    if (e.target === modal) {
        closeDashboardModal();
    }
});

// WhatsApp Widget Logic
document.addEventListener('DOMContentLoaded', function() {
    const whatsappBtn = document.getElementById('whatsapp-btn');
    const whatsappChat = document.getElementById('whatsapp-chat');
    const whatsappClose = document.getElementById('whatsapp-close');
    const whatsappSend = document.getElementById('whatsapp-send');
    const whatsappInput = document.getElementById('whatsapp-input');

    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', () => {
            whatsappChat.classList.toggle('show');
        });
    }

    if (whatsappClose) {
        whatsappClose.addEventListener('click', () => {
            whatsappChat.classList.remove('show');
        });
    }

    if (whatsappSend) {
        whatsappSend.addEventListener('click', () => {
            sendWhatsAppMessage();
        });
    }

    if (whatsappInput) {
        whatsappInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                sendWhatsAppMessage();
            }
        });
    }

    function sendWhatsAppMessage() {
        const message = whatsappInput.value;
        if (message.trim() !== "") {
            const phoneNumber = "918573009453"; // Your WhatsApp number
            const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            window.open(url, '_blank');
            whatsappInput.value = "";
            whatsappChat.classList.remove('show');
        }
    }
});
