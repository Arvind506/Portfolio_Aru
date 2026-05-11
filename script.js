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

    // Custom Cursor (Dot & Outline)
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');

    if (cursorDot && cursorOutline && window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            // Dot moves instantly
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Outline moves with a slight delay for smooth effect
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        // Add hover effect for clickable elements
        const clickables = document.querySelectorAll('a, button, input, textarea, .glass-tag');
        clickables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorDot.style.transform = 'translate(-50%, -50%) scale(2)';
                cursorOutline.style.width = '60px';
                cursorOutline.style.height = '60px';
                cursorOutline.style.background = 'rgba(0, 243, 255, 0.1)';
                cursorOutline.style.borderColor = 'transparent';
            });
            el.addEventListener('mouseleave', () => {
                cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorOutline.style.width = '40px';
                cursorOutline.style.height = '40px';
                cursorOutline.style.background = 'transparent';
                cursorOutline.style.borderColor = 'var(--neon-cyan)';
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
    // Custom Slower Smooth Scroll Function
    function slowScrollTo(targetY, duration = 1500) {
        const startPosition = window.scrollY;
        const distance = targetY - startPosition;
        const startTime = performance.now();

        function easeOutCubic(t) {
            return 1 - Math.pow(1 - t, 3);
        }

        function scrollAnimation(currentTime) {
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const easedProgress = easeOutCubic(progress);
            
            window.scrollTo(0, startPosition + (distance * easedProgress));

            if (timeElapsed < duration) {
                requestAnimationFrame(scrollAnimation);
            }
        }

        requestAnimationFrame(scrollAnimation);
    }

    // Smooth Scrolling for anchor links (Custom Slow Version)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const targetY = elementPosition + window.scrollY - headerOffset;

                slowScrollTo(targetY, 1500);
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
window.openDashboardModal = function (url = 'dashboard.html', title = 'SYSTEM_DASHBOARD.EXE') {
    const modal = document.getElementById('dashboardModal');
    const iframe = document.getElementById('dashboardIframe');
    const loader = document.querySelector('.iframe-loader');
    const modalTitleSpan = document.querySelector('.modal-title');

    // Update modal title
    if (modalTitleSpan) {
        modalTitleSpan.innerHTML = `<i class="fas fa-terminal"></i> <span class="neon-text">SYSTEM</span>_${title}`;
    }

    // Show loader initially
    if (loader) {
        loader.style.display = 'flex';
        loader.style.opacity = '1';
    }

    // Always set the iframe src to ensure we load the correct page for the clicked project
    iframe.src = url;
    
    // Hide loader when iframe finishes loading
    iframe.onload = function() {
        if (loader) {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 500);
            }, 300);
        }
    };

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
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
    // Scroll To Top Logic
    const progressPath = document.querySelector('.progress-wrap path');
    if (progressPath) {
        const pathLength = progressPath.getTotalLength();
        progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
        progressPath.style.strokeDasharray = pathLength + ' ' + pathLength;
        progressPath.style.strokeDashoffset = pathLength;
        progressPath.getBoundingClientRect();
        progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';

        const updateProgress = function () {
            const scroll = window.scrollY;
            const height = document.documentElement.scrollHeight - window.innerHeight;
            const progress = pathLength - (scroll * pathLength / height);
            progressPath.style.strokeDashoffset = progress;
        };

        updateProgress();
        window.addEventListener('scroll', updateProgress);

        const offset = 50;
        window.addEventListener('scroll', function () {
            if (window.scrollY > offset) {
                document.querySelector('.progress-wrap').classList.add('active-progress');
            } else {
                document.querySelector('.progress-wrap').classList.remove('active-progress');
            }
        });

        document.querySelector('.progress-wrap').addEventListener('click', function (event) {
            event.preventDefault();
            slowScrollTo(0, 1500);
            return false;
        });
    }
});

/* ============================================================
   ARVIND_CORE_SHIELD: ENTERPRISE OBFUSCATION
   ============================================================ */

(function () {
    // 1. Self-Destruct Script Tag (Removes 'script.js' from the DOM tree)
    const _scripts = document.getElementsByTagName('script');
    for (let _i = 0; _i < _scripts.length; _i++) {
        if (_scripts[_i].src.indexOf('script.js') !== -1) {
            _scripts[_i].parentNode.removeChild(_scripts[_i]);
        }
    }

    const _0x5a2e = ['\x63\x6f\x6e\x74\x65\x78\x74\x6d\x65\x6e\x75', '\x70\x72\x65\x76\x65\x6e\x74\x44\x65\x66\x61\x75\x6c\x74', '\x6b\x65\x79\x64\x6f\x77\x6e', '\x46\x31\x32', '\x69\x6e\x6e\x65\x72\x48\x54\x4d\x4c', '\x62\x6f\x64\x79', '\x73\x74\x6f\x70', '\x63\x6c\x65\x61\x72'];
    
    const config = {
        lockdownMessage: `
            <div class="security-lockdown">
                <div class="lockdown-content">
                    <div class="lockdown-icon"><i class="fas fa-user-shield"></i></div>
                    <h1 class="neon-text">SYSTEM SECURED</h1>
                    <p class="glow-text">Developer tools are open. Please close them to continue using the site.</p>
                    <div class="terminal-loader">
                        <span class="command">Executing Security Protocol...</span>
                        <span class="status">ENCRYPTING_DOM: [SUCCESS]</span>
                        <span class="status">ACCESS_DENIED: [LOCKED]</span>
                    </div>
                    <div class="developer-info">Developed By: Arvind R. Kushwaha</div>
                    <button onclick="location.reload()" class="btn btn--primary btn--small" style="margin-top: 2rem;">RETRY AUTHENTICATION</button>
                </div>
            </div>
        `
    };

    let isLockdown = false;

    // 2. Download Guard (Blocks common extension download triggers)

    const _originalCreateElement = document.createElement;
    document.createElement = function (tagName) {
        const element = _originalCreateElement.call(document, tagName);
        if (tagName.toLowerCase() === 'a') {
            Object.defineProperty(element, 'click', {
                value: function () {
                    if (element.download) {
                        triggerLockdown();
                        return false;
                    }
                    return HTMLAnchorElement.prototype.click.apply(element, arguments);
                }
            });
        }
        return element;
    };

    function triggerLockdown() {

        if (isLockdown) return;
        isLockdown = true;
        document.head.innerHTML = `<style>body{background:#050505;color:#fff;font-family:sans-serif;margin:0;height:100vh;overflow:hidden;display:flex;align-items:center;justify-content:center;}.security-lockdown{text-align:center;background:rgba(0,243,255,0.05);padding:4rem;border:1px solid rgba(0,243,255,0.2);border-radius:20px;backdrop-filter:blur(20px);border-top:4px solid #00f3ff;}.lockdown-icon{font-size:5rem;color:#00f3ff;margin-bottom:2rem;}.neon-text{color:#00f3ff;font-size:3rem;letter-spacing:0.2em;text-shadow:0 0 20px rgba(0,243,255,0.5);}.glow-text{color:#94a3b8;font-size:1.2rem;}.terminal-loader{background:rgba(0,0,0,0.5);padding:1.5rem;border-radius:8px;margin:2rem 0;text-align:left;font-family:monospace;font-size:0.9rem;border-left:3px solid #00f3ff;}.command{color:#00f3ff;}.status{color:#0f0;}.btn--primary{background:#00f3ff;color:#000;border:none;padding:0.8rem 2rem;font-weight:bold;cursor:pointer;border-radius:4px;}</style>`;
        document.body.innerHTML = config.lockdownMessage;
        window[_0x5a2e[6]]();
        setInterval(() => console[_0x5a2e[7]](), 100);
    }

    function check() {
        if (window.outerWidth - window.innerWidth > 160 || window.outerHeight - window.innerHeight > 160) triggerLockdown();
    }

    setInterval(check, 500);
    setInterval(() => { debugger; }, 50);

    document.addEventListener(_0x5a2e[0], e => e[_0x5a2e[1]]());
    document.addEventListener(_0x5a2e[2], e => {
        if (e.key === _0x5a2e[3] || (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) || (e.ctrlKey && e.key.toUpperCase() === 'U')) {
            e[_0x5a2e[1]]();
            triggerLockdown();
        }
    });

    // Detect if page was saved/printed
    window.addEventListener('beforeprint', () => { triggerLockdown(); });

    const noOp = () => {};
    const methods = ['log', 'warn', 'error', 'debug', 'dir', 'table', 'clear'];
    methods.forEach(m => {
        try {
            Object.defineProperty(console, m, {
                value: noOp,
                writable: false,
                configurable: false
            });
        } catch (e) {}
    });
    try { Object.freeze(console); } catch (e) {}


})();
