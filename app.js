// HALO IT Services - Enhanced Interactive JavaScript

class HALOWebsite {
    constructor() {
        this.header = document.getElementById('header');
        this.navToggle = document.getElementById('navToggle');
        this.nav = document.getElementById('nav');
        this.contactForm = document.getElementById('contactForm');
        this.navLinks = document.querySelectorAll('.nav__link');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupScrollEffects();
        this.setupSmoothScrolling();
        this.setupFormHandling();
        this.setupAnimations();
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
        this.navT
