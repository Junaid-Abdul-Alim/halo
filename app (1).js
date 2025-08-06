// HALO IT Services - Enhanced Interactive JavaScript

class HALOWebsite {
    constructor() {
        this.header = document.getElementById('header');
        this.navToggle = document.getElementById('navToggle');
        this.nav = document.getElementById('nav');
        this.contactForm = document.getElementById('contactForm');
        this.navLinks = document.querySelectorAll('.nav__link');
        this.faqItems = document.querySelectorAll('[data-faq]');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupScrollEffects();
        this.setupSmoothScrolling();
        this.setupFormHandling();
        this.setupAnimations();
        this.setupFAQ();
        this.setupEnhancedInteractions();
    }

    setupEventListeners() {
        // Mobile navigation toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => this.toggleMobileNav());
        }

        // Window scroll events with slower response
        window.addEventListener('scroll', this.debounce(() => {
            this.handleScroll();
            this.updateActiveNavLink();
        }, 16));

        // Window resize events
        window.addEventListener('resize', () => this.handleResize());

        // Close mobile nav when clicking outside
        document.addEventListener('click', (e) => {
            if (this.nav && this.navToggle && 
                !this.nav.contains(e.target) && 
                !this.navToggle.contains(e.target)) {
                this.closeMobileNav();
            }
        });

        // Enhanced keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileNav();
                this.closeFAQItems();
            }
        });
    }

    toggleMobileNav() {
        const isOpen = this.nav.classList.contains('nav--open');
        
        if (isOpen) {
            this.closeMobileNav();
        } else {
            this.openMobileNav();
        }
    }

    openMobileNav() {
        this.nav.classList.add('nav--open');
        this.navToggle.classList.add('nav__toggle--active');
        document.body.style.overflow = 'hidden';
        
        // Slower hamburger menu animation
        const spans = this.navToggle.querySelectorAll('span');
        spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
        spans[0].style.transition = 'all 600ms cubic-bezier(0.16, 1, 0.3, 1)';
        spans[1].style.opacity = '0';
        spans[1].style.transition = 'all 600ms cubic-bezier(0.16, 1, 0.3, 1)';
        spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
        spans[2].style.transition = 'all 600ms cubic-bezier(0.16, 1, 0.3, 1)';
    }

    closeMobileNav() {
        this.nav.classList.remove('nav--open');
        this.navToggle.classList.remove('nav__toggle--active');
        document.body.style.overflow = '';
        
        // Reset hamburger menu with slower animation
        const spans = this.navToggle.querySelectorAll('span');
        spans.forEach(span => {
            span.style.transform = '';
            span.style.opacity = '';
            span.style.transition = 'all 600ms cubic-bezier(0.16, 1, 0.3, 1)';
        });
    }

    handleScroll() {
        const scrollY = window.scrollY;
        
        // Header scroll effects with slower transition
        if (scrollY > 50) {
            this.header.classList.add('header--scrolled');
        } else {
            this.header.classList.remove('header--scrolled');
        }

        // Enhanced parallax effect for hero shapes
        const heroShapes = document.querySelectorAll('.hero__shape');
        heroShapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.3; // Slower parallax
            const yPos = -(scrollY * speed);
            shape.style.transform = `translateY(${yPos}px)`;
        });

        // Reveal animations for sections
        this.handleScrollAnimations();
    }

    handleScrollAnimations() {
        const sections = document.querySelectorAll('section:not(.hero)');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const windowHeight = window.innerHeight;
            const scrollTop = window.scrollY;
            
            if (scrollTop + windowHeight > sectionTop + 100) {
                section.classList.add('section--visible');
                
                // Animate cards within the section with stagger effect
                const cards = section.querySelectorAll('.service-card, .industry-card, .project-card, .benefit-card, .blog-card, .process-step');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('animate-in');
                    }, index * 100); // Stagger animation
                });
            }
        });
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                // Remove active class from all nav links
                this.navLinks.forEach(link => link.classList.remove('nav__link--active'));
                
                // Add active class to current section's nav link
                const activeLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('nav__link--active');
                }
            }
        });
    }

    setupSmoothScrolling() {
        // Smooth scroll for navigation links with slower duration
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    this.smoothScrollTo(targetSection);
                    this.closeMobileNav();
                }
            });
        });

        // Smooth scroll for CTA buttons and footer links
        const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
        smoothScrollLinks.forEach(button => {
            // Skip if it's already handled by nav links
            if (button.classList.contains('nav__link')) return;
            
            button.addEventListener('click', (e) => {
                const href = button.getAttribute('href');
                if (href.startsWith('#') && href.length > 1) {
                    e.preventDefault();
                    const targetSection = document.querySelector(href);
                    
                    if (targetSection) {
                        this.smoothScrollTo(targetSection);
                    }
                }
            });
        });
    }

    smoothScrollTo(targetElement) {
        const headerHeight = this.header.offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;
        
        // Custom smooth scroll implementation for better control
        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;
        const duration = 1200; // Slower scroll duration
        let startTime = null;

        const animation = (currentTime) => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = this.easeInOutQuad(timeElapsed, startPosition, distance, duration);
            
            window.scrollTo(0, run);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        };
        
        requestAnimationFrame(animation);
    }

    easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    setupFormHandling() {
        if (this.contactForm) {
            this.contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission();
            });

            // Enhanced form validation with slower transitions
            const formInputs = this.contactForm.querySelectorAll('.form-control');
            formInputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => this.clearFieldError(input));
                input.addEventListener('focus', () => this.handleFieldFocus(input));
            });
        }
    }

    handleFieldFocus(field) {
        // Add subtle focus animation
        field.style.transform = 'scale(1.01)';
        field.style.transition = 'all 300ms cubic-bezier(0.16, 1, 0.3, 1)';
        
        setTimeout(() => {
            field.style.transform = '';
        }, 300);
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove existing error styles
        field.classList.remove('form-control--error');
        this.removeFieldError(field);

        // Check if required field is empty
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required.';
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address.';
            }
        }

        // Show error if invalid
        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('form-control--error');
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.opacity = '0';
        errorElement.style.transform = 'translateY(-10px)';
        
        field.parentNode.appendChild(errorElement);
        
        // Animate error message in
        setTimeout(() => {
            errorElement.style.opacity = '1';
            errorElement.style.transform = 'translateY(0)';
            errorElement.style.transition = 'all 300ms cubic-bezier(0.16, 1, 0.3, 1)';
        }, 10);
    }

    removeFieldError(field) {
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.style.opacity = '0';
            errorElement.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                if (errorElement.parentNode) {
                    errorElement.remove();
                }
            }, 300);
        }
    }

    clearFieldError(field) {
        field.classList.remove('form-control--error');
        this.removeFieldError(field);
    }

    handleFormSubmission() {
        const formInputs = this.contactForm.querySelectorAll('.form-control');
        let isFormValid = true;

        // Validate all fields
        formInputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            this.showFormMessage('Please correct the errors above.', 'error');
            return;
        }

        // Show loading state with animation
        const submitButton = this.contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending Message...';
        submitButton.disabled = true;
        submitButton.style.transform = 'scale(0.95)';
        submitButton.style.transition = 'all 300ms cubic-bezier(0.16, 1, 0.3, 1)';

        // Simulate successful form submission
        setTimeout(() => {
            this.showFormMessage(
                'Thank you for your message! We\'ll get back to you within 24 hours with a comprehensive consultation.',
                'success'
            );
            
            // Reset form
            this.contactForm.reset();
            
            // Reset button with animation
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            submitButton.style.transform = '';
            
            // Scroll to success message
            const formMessage = this.contactForm.querySelector('.form-message');
            if (formMessage) {
                formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }, 2000);
    }

    showFormMessage(message, type) {
        // Remove existing message
        const existingMessage = this.contactForm.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const messageElement = document.createElement('div');
        messageElement.className = `form-message form-message--${type}`;
        messageElement.textContent = message;
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translateX(-20px)';

        // Insert message at the top of the form
        this.contactForm.insertBefore(messageElement, this.contactForm.firstChild);

        // Animate message in
        setTimeout(() => {
            messageElement.style.opacity = '1';
            messageElement.style.transform = 'translateX(0)';
            messageElement.style.transition = 'all 400ms cubic-bezier(0.16, 1, 0.3, 1)';
        }, 10);

        // Auto-remove success messages after 8 seconds
        if (type === 'success') {
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.style.opacity = '0';
                    messageElement.style.transform = 'translateX(-20px)';
                    setTimeout(() => {
                        if (messageElement.parentNode) {
                            messageElement.remove();
                        }
                    }, 400);
                }
            }, 8000);
        }
    }

    setupFAQ() {
        // Setup FAQ toggle functionality
        this.faqItems.forEach(item => {
            const questionButton = item.querySelector('.faq-item__question');
            
            if (questionButton) {
                questionButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggleFAQItem(item);
                });
            }
        });
    }

    toggleFAQItem(item) {
        const isActive = item.classList.contains('faq-item--active');
        
        // Close all other FAQ items first
        this.faqItems.forEach(faqItem => {
            if (faqItem !== item && faqItem.classList.contains('faq-item--active')) {
                faqItem.classList.remove('faq-item--active');
            }
        });
        
        // Toggle current item
        if (isActive) {
            item.classList.remove('faq-item--active');
        } else {
            item.classList.add('faq-item--active');
            
            // Scroll to the opened item after animation
            setTimeout(() => {
                item.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'nearest' 
                });
            }, 300);
        }
    }

    closeFAQItems() {
        this.faqItems.forEach(item => {
            item.classList.remove('faq-item--active');
        });
    }

    setupAnimations() {
        // Enhanced Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Stagger animations for better visual effect
                    setTimeout(() => {
                        entry.target.classList.add('animate-in');
                    }, Math.random() * 200);
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll(
            '.service-card, .industry-card, .benefit-card, .project-card, .tech-category, .process-step, .blog-card, .faq-item'
        );
        
        animateElements.forEach(element => {
            element.classList.add('animate-element');
            observer.observe(element);
        });

        // Hero elements animation on load
        setTimeout(() => {
            const heroElements = document.querySelectorAll('.hero__title, .hero__subtitle, .hero__actions');
            heroElements.forEach((element, index) => {
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * 400); // Slower stagger
            });
        }, 300);
    }

    setupEnhancedInteractions() {
        // Enhanced card hover effects
        this.setupCardInteractions();
        
        // Service card detailed interactions
        this.setupServiceCardInteractions();
        
        // Technology tag interactions
        this.setupTechTagInteractions();
        
        // Process step interactions
        this.setupProcessInteractions();
        
        // Blog card interactions
        this.setupBlogInteractions();
    }

    setupCardInteractions() {
        const cards = document.querySelectorAll('.service-card, .project-card, .industry-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                this.handleCardHover(card, true);
            });
            
            card.addEventListener('mouseleave', (e) => {
                this.handleCardHover(card, false);
            });
            
            card.addEventListener('mousemove', (e) => {
                this.handleCardMouseMove(card, e);
            });
        });
    }

    handleCardHover(card, isEntering) {
        const icon = card.querySelector('.icon');
        
        if (isEntering) {
            card.style.transition = 'all 600ms cubic-bezier(0.16, 1, 0.3, 1)';
            if (icon) {
                icon.style.transition = 'all 400ms cubic-bezier(0.16, 1, 0.3, 1)';
            }
        } else {
            card.style.transform = '';
            if (icon) {
                icon.style.transform = '';
            }
        }
    }

    handleCardMouseMove(card, e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 30;
        const rotateY = (centerX - x) / 30;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    }

    setupServiceCardInteractions() {
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach(card => {
            const listItems = card.querySelectorAll('.service-card__list li');
            
            listItems.forEach((item) => {
                item.addEventListener('mouseenter', () => {
                    item.style.transform = 'translateX(5px)';
                    item.style.transition = 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)';
                });
                
                item.addEventListener('mouseleave', () => {
                    item.style.transform = '';
                });
            });
        });
    }

    setupTechTagInteractions() {
        const techTags = document.querySelectorAll('.tech-tag');
        
        techTags.forEach(tag => {
            tag.addEventListener('mouseenter', () => {
                // Create ripple effect
                const ripple = document.createElement('span');
                ripple.classList.add('tech-tag-ripple');
                ripple.style.position = 'absolute';
                ripple.style.borderRadius = '50%';
                ripple.style.background = 'rgba(255, 255, 255, 0.6)';
                ripple.style.transform = 'scale(0)';
                ripple.style.animation = 'ripple 600ms linear';
                ripple.style.pointerEvents = 'none';
                
                tag.style.position = 'relative';
                tag.appendChild(ripple);
                
                setTimeout(() => {
                    if (ripple.parentNode) {
                        ripple.remove();
                    }
                }, 600);
            });
        });
    }

    setupProcessInteractions() {
        const processSteps = document.querySelectorAll('.process-step');
        
        processSteps.forEach((step) => {
            step.addEventListener('mouseenter', () => {
                const number = step.querySelector('.process-step__number');
                if (number) {
                    number.style.transform = 'scale(1.1) rotate(5deg)';
                    number.style.transition = 'all 300ms cubic-bezier(0.16, 1, 0.3, 1)';
                }
            });
            
            step.addEventListener('mouseleave', () => {
                const number = step.querySelector('.process-step__number');
                if (number) {
                    number.style.transform = '';
                }
            });
        });
    }

    setupBlogInteractions() {
        const blogCards = document.querySelectorAll('.blog-card');
        
        blogCards.forEach(card => {
            card.addEventListener('click', () => {
                // Add click animation
                card.style.transform = 'scale(0.98)';
                card.style.transition = 'all 150ms cubic-bezier(0.16, 1, 0.3, 1)';
                
                setTimeout(() => {
                    card.style.transform = '';
                }, 150);
                
                // In a real application, you would navigate to the blog post here
                const title = card.querySelector('.blog-card__title');
                if (title) {
                    console.log('Navigate to blog post:', title.textContent);
                }
            });
        });
    }

    handleResize() {
        // Close mobile nav on resize to desktop
        if (window.innerWidth > 768) {
            this.closeMobileNav();
        }
        
        // Recalculate animations on resize
        this.debounce(() => {
            this.handleScrollAnimations();
        }, 250)();
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Enhanced CSS for additional interactions
const additionalCSS = `
    .tech-tag {
        position: relative;
        overflow: hidden;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .section--visible {
        opacity: 1;
    }
    
    .hero__title,
    .hero__subtitle,
    .hero__actions {
        opacity: 0;
        transform: translateY(30px);
        transition: all 900ms cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .process-step {
        opacity: 0;
        transform: translateX(-30px);
        transition: all 800ms cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .process-step.animate-in {
        opacity: 1;
        transform: translateX(0);
    }
    
    .tech-category {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
        transition: all 600ms cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .tech-category.animate-in {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
    
    .blog-card {
        opacity: 0;
        transform: translateY(20px);
        transition: all 700ms cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .blog-card.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .industry-card {
        opacity: 0;
        transform: translateY(20px) rotate(-2deg);
        transition: all 650ms cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .industry-card.animate-in {
        opacity: 1;
        transform: translateY(0) rotate(0deg);
    }
    
    .faq-item {
        opacity: 0;
        transform: translateY(10px);
        transition: all 500ms cubic-bezier(0.16, 1, 0.3, 1);
    }
    
    .faq-item.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    @media (max-width: 768px) {
        .nav {
            display: none;
        }
        
        .nav--open {
            display: flex;
        }
        
        .service-card:hover {
            transform: translateY(-4px);
        }
        
        .project-card:hover,
        .blog-card:hover,
        .industry-card:hover {
            transform: translateY(-3px);
        }
    }
`;

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add additional CSS
    const style = document.createElement('style');
    style.textContent = additionalCSS;
    document.head.appendChild(style);
    
    // Initialize the website
    const website = new HALOWebsite();
    
    // Add enhanced loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.opacity = '1';
        document.body.style.transition = 'opacity 800ms cubic-bezier(0.16, 1, 0.3, 1)';
    }, 100);
    
    // Initialize additional features
    setupAdvancedFeatures();
});

// Additional advanced features
function setupAdvancedFeatures() {
    // Add scroll progress indicator
    createScrollProgress();
    
    // Add lazy loading for better performance
    setupLazyLoading();
    
    // Add keyboard navigation
    setupKeyboardNavigation();
    
    // Add performance monitoring
    setupPerformanceMonitoring();
}

function createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: var(--halo-accent);
        z-index: 9999;
        transition: width 100ms cubic-bezier(0.16, 1, 0.3, 1);
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = Math.min(scrollPercent, 100) + '%';
    });
}

function setupLazyLoading() {
    // Lazy load animations for better performance
    const lazyElements = document.querySelectorAll('.service-card, .project-card, .blog-card');
    
    const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
                lazyObserver.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '50px'
    });
    
    lazyElements.forEach(element => {
        lazyObserver.observe(element);
    });
}

function setupKeyboardNavigation() {
    // Enhanced keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-nav');
    });
}

function setupPerformanceMonitoring() {
    // Simple performance monitoring
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`HALO IT Services website loaded in ${Math.round(loadTime)}ms`);
    });
}