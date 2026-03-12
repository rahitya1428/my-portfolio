// Portfolio JavaScript - Modern ES6+ Implementation

class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupSmoothScrolling();
        this.setupFormValidation();
        this.setupScrollAnimations();
        this.setupNavbarScrollEffect();
        this.setupTypingAnimation();
    }

    // 1. Smooth scrolling between sections
    setupSmoothScrolling() {
        const navLinks = document.querySelectorAll('.nav-links a');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // 2. Contact form validation
    setupFormValidation() {
        const contactForm = document.querySelector('.contact-form');
        if (!contactForm) return;

        const formFields = {
            name: {
                element: document.getElementById('name'),
                validate: (value) => value.trim().length >= 2,
                errorMessage: 'Name must be at least 2 characters long'
            },
            email: {
                element: document.getElementById('email'),
                validate: (value) => {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    return emailRegex.test(value.trim());
                },
                errorMessage: 'Please enter a valid email address'
            },
            subject: {
                element: document.getElementById('subject'),
                validate: (value) => value.trim().length >= 5,
                errorMessage: 'Subject must be at least 5 characters long'
            },
            message: {
                element: document.getElementById('message'),
                validate: (value) => value.trim().length >= 10,
                errorMessage: 'Message must be at least 10 characters long'
            }
        };

        // Real-time validation
        Object.values(formFields).forEach(field => {
            field.element.addEventListener('blur', () => {
                this.validateField(field);
            });

            field.element.addEventListener('input', () => {
                this.clearFieldError(field);
            });
        });

        // Form submission
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let isFormValid = true;

            // Validate all fields
            Object.values(formFields).forEach(field => {
                if (!this.validateField(field)) {
                    isFormValid = false;
                }
            });

            if (isFormValid) {
                this.handleFormSubmission(contactForm);
            }
        });
    }

    validateField(field) {
        const { element, validate, errorMessage } = field;
        const value = element.value;
        const isValid = validate(value);

        this.clearFieldError(field);

        if (!isValid) {
            this.showFieldError(field, errorMessage);
            return false;
        }

        return true;
    }

    showFieldError(field, message) {
        const { element } = field;
        element.classList.add('error');

        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #ff6b6b;
            font-size: 0.875rem;
            margin-top: 0.25rem;
            animation: slideIn 0.3s ease-out;
        `;

        element.parentNode.appendChild(errorElement);
    }

    clearFieldError(field) {
        const { element } = field;
        element.classList.remove('error');

        const errorElement = element.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    // 3. Handle form submission with success alert
    async handleFormSubmission(form) {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;

        // Show loading state
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        try {
            // Simulate form submission (replace with actual API call)
            await this.simulateFormSubmission();

            // Show success message
            this.showSuccessAlert();

            // Reset form
            form.reset();

        } catch (error) {
            console.error('Form submission error:', error);
            this.showErrorAlert('Failed to send message. Please try again.');
        } finally {
            // Reset button state
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }

    simulateFormSubmission() {
        // Simulate network delay
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate random success/failure (90% success rate)
                if (Math.random() > 0.1) {
                    resolve();
                } else {
                    reject(new Error('Network error'));
                }
            }, 2000);
        });
    }

    showSuccessAlert() {
        this.showAlert('Message sent successfully! I\'ll get back to you soon.', 'success');
    }

    showErrorAlert(message) {
        this.showAlert(message, 'error');
    }

    showAlert(message, type) {
        // Remove existing alerts
        const existingAlert = document.querySelector('.alert');
        if (existingAlert) {
            existingAlert.remove();
        }

        // Create alert element
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `
            <div class="alert-content">
                <span class="alert-icon">${type === 'success' ? '✓' : '✕'}</span>
                <span class="alert-message">${message}</span>
                <button class="alert-close">&times;</button>
            </div>
        `;

        // Style the alert
        alert.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 10000;
            min-width: 300px;
            animation: slideInFromRight 0.5s ease-out;
        `;

        // Add to DOM
        document.body.appendChild(alert);

        // Close button functionality
        const closeButton = alert.querySelector('.alert-close');
        closeButton.addEventListener('click', () => {
            this.closeAlert(alert);
        });

        // Auto-close after 5 seconds
        setTimeout(() => {
            if (alert.parentNode) {
                this.closeAlert(alert);
            }
        }, 5000);
    }

    closeAlert(alert) {
        alert.style.animation = 'slideOutToRight 0.5s ease-in forwards';
        setTimeout(() => {
            if (alert.parentNode) {
                alert.parentNode.removeChild(alert);
            }
        }, 500);
    }

    // 4. Scroll animations for sections
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe all sections except hero
        const sections = document.querySelectorAll('section:not(.hero)');
        sections.forEach(section => {
            observer.observe(section);
        });

        // Observe cards and other elements
        const animatedElements = document.querySelectorAll('.skill-category, .idea-card, .project-card');
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    // Additional feature: Navbar scroll effect
    setupNavbarScrollEffect() {
        const navbar = document.querySelector('.navbar');
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down - hide navbar
                navbar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up or at top - show navbar
                navbar.style.transform = 'translateY(0)';
            }

            lastScrollY = currentScrollY;
        });
    }

    // 5. Animated skill bars
    setupSkillBarsAnimation() {
        const skillBars = document.querySelectorAll('.skill-fill');
        let animated = false;

        const animateSkillBars = () => {
            if (animated) return;
            animated = true;

            skillBars.forEach((bar, index) => {
                const skillLevel = bar.dataset.skill;
                const skillName = bar.parentElement.previousElementSibling;

                // Set CSS custom property for animation
                bar.style.setProperty('--skill-width', `${skillLevel}%`);

                // Animate percentage counter
                let currentPercent = 0;
                const increment = skillLevel / 60; // 60 frames for smooth animation

                const animateCounter = () => {
                    currentPercent += increment;
                    if (currentPercent >= skillLevel) {
                        currentPercent = skillLevel;
                        skillName.setAttribute('data-percentage', skillLevel);
                    } else {
                        skillName.setAttribute('data-percentage', Math.floor(currentPercent));
                        requestAnimationFrame(animateCounter);
                    }
                };

                // Start animations with stagger
                setTimeout(() => {
                    bar.classList.add('animate');
                    animateCounter();
                }, index * 100);
            });
        };

        // Use Intersection Observer to trigger animation when skills section is visible
        const skillsSection = document.querySelector('#skills');
        if (skillsSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateSkillBars();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });

            observer.observe(skillsSection);
        }
    }

    // 6. Creative morphing blob background
    setupParticleBackground() {
        const canvas = document.createElement('canvas');
        canvas.id = 'particle-canvas';
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            opacity: 0.4;
        `;
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let blobs = [];
        let animationId;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const createBlob = () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            size: Math.random() * 80 + 40,
            opacity: Math.random() * 0.3 + 0.1,
            hue: Math.random() * 60 + 240, // Purple to blue range
            morphSpeed: Math.random() * 0.02 + 0.01,
            morphOffset: Math.random() * Math.PI * 2,
            points: 8 + Math.floor(Math.random() * 4)
        });

        const initBlobs = () => {
            blobs = [];
            const blobCount = Math.min(6, Math.floor((canvas.width * canvas.height) / 80000));
            for (let i = 0; i < blobCount; i++) {
                blobs.push(createBlob());
            }
        };

        const updateBlobs = () => {
            blobs.forEach(blob => {
                blob.x += blob.vx;
                blob.y += blob.vy;
                blob.morphOffset += blob.morphSpeed;

                // Boundary wrapping
                if (blob.x < -blob.size) blob.x = canvas.width + blob.size;
                if (blob.x > canvas.width + blob.size) blob.x = -blob.size;
                if (blob.y < -blob.size) blob.y = canvas.height + blob.size;
                if (blob.y > canvas.height + blob.size) blob.y = -blob.size;
            });
        };

        const drawBlob = (blob) => {
            ctx.save();
            ctx.translate(blob.x, blob.y);
            ctx.beginPath();

            for (let i = 0; i < blob.points; i++) {
                const angle = (i / blob.points) * Math.PI * 2;
                const radius = blob.size + Math.sin(blob.morphOffset + angle * 2) * 20;

                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }

            ctx.closePath();

            // Create gradient
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, blob.size);
            gradient.addColorStop(0, `hsla(${blob.hue}, 70%, 60%, ${blob.opacity})`);
            gradient.addColorStop(0.7, `hsla(${blob.hue}, 60%, 50%, ${blob.opacity * 0.5})`);
            gradient.addColorStop(1, `hsla(${blob.hue}, 50%, 40%, 0)`);

            ctx.fillStyle = gradient;
            ctx.fill();
            ctx.restore();
        };

        const drawBlobs = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            blobs.forEach(drawBlob);
        };

        const animate = () => {
            updateBlobs();
            drawBlobs();
            animationId = requestAnimationFrame(animate);
        };

        resizeCanvas();
        initBlobs();
        animate();

        window.addEventListener('resize', () => {
            resizeCanvas();
            initBlobs();
        });
    }

    // 7. Floating elements animation
    setupFloatingElements() {
        const floatingElements = document.querySelectorAll('.skill-category, .idea-card, .project-card, .btn');

        floatingElements.forEach((element, index) => {
            element.style.animationDelay = `${index * 0.1}s`;
            element.classList.add('floating-element');
        });
    }

    // 8. Mouse follower effect
    setupMouseFollower() {
        const cursor = document.createElement('div');
        cursor.id = 'cursor-follower';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            border: 2px solid var(--neon-accent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: all 0.1s ease;
            opacity: 0;
        `;
        document.body.appendChild(cursor);

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.opacity = '1';
        });

        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
        });

        const updateCursor = () => {
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;

            cursor.style.left = `${cursorX - 10}px`;
            cursor.style.top = `${cursorY - 10}px`;

            requestAnimationFrame(updateCursor);
        };

        updateCursor();

        // Interactive cursor on hover
        const interactiveElements = document.querySelectorAll('a, button, .skill-category, .idea-card, .project-card');
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(1.5)';
                cursor.style.borderColor = 'var(--accent-purple)';
            });
            element.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
                cursor.style.borderColor = 'var(--neon-accent)';
            });
        });
    }

    // 9. Text reveal animation
    setupTextReveal() {
        const textElements = document.querySelectorAll('h1, h2, h3, p');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('text-reveal');
                }
            });
        }, { threshold: 0.1 });

        textElements.forEach(element => {
            observer.observe(element);
        });
    }

    // 10. Enhanced card hover effects
    setupCardHoverEffects() {
        const cards = document.querySelectorAll('.skill-category, .idea-card, .project-card');

        cards.forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});

// Add CSS animations for alerts and scroll effects
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }

    @keyframes slideInFromRight {
        from { opacity: 0; transform: translateX(100%); }
        to { opacity: 1; transform: translateX(0); }
    }

    @keyframes slideOutToRight {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(100%); }
    }

    .alert {
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        overflow: hidden;
    }

    .alert-success {
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
    }

    .alert-error {
        background: linear-gradient(135deg, #ef4444, #dc2626);
        color: white;
    }

    .alert-content {
        display: flex;
        align-items: center;
        padding: 1rem;
        gap: 0.75rem;
    }

    .alert-icon {
        font-size: 1.25rem;
        font-weight: bold;
    }

    .alert-close {
        background: none;
        border: none;
        color: inherit;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
        opacity: 0.8;
        transition: opacity 0.3s ease;
    }

    .alert-close:hover {
        opacity: 1;
    }

    .form-group input.error,
    .form-group textarea.error {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
    }

    /* Scroll animations */
    section:not(.hero) {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease-out;
    }

    section.animate-in {
        opacity: 1;
        transform: translateY(0);
    }

    .skill-category,
    .idea-card,
    .project-card {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease-out;
    }

    .skill-category.animate-in,
    .idea-card.animate-in,
    .project-card.animate-in {
        opacity: 1;
        transform: translateY(0);
    }

    /* Stagger animations for cards */
    .skill-category:nth-child(1) { transition-delay: 0.1s; }
    .skill-category:nth-child(2) { transition-delay: 0.2s; }
    .skill-category:nth-child(3) { transition-delay: 0.3s; }

    .idea-card:nth-child(1) { transition-delay: 0.1s; }
    .idea-card:nth-child(2) { transition-delay: 0.2s; }

    .project-card:nth-child(1) { transition-delay: 0.1s; }
    .project-card:nth-child(2) { transition-delay: 0.2s; }
    .project-card:nth-child(3) { transition-delay: 0.3s; }

    .cursor {
        animation: blink 1s infinite;
        color: var(--neon-accent);
        font-weight: bold;
    }

    @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
    }
`;
document.head.appendChild(style);
