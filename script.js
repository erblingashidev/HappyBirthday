// Our Love Story - Interactive Photo Book JavaScript

class InteractivePhotoBook {
    constructor() {
        this.currentPage = 1;
        this.totalPages = 8;
        this.isTransitioning = false;
        this.confettiParticles = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.createConfetti();
        this.setupPageAnimations();
        this.setupSwipeGestures();
        this.setupMobileExperience();
    }

    setupMobileExperience() {
        // Check if device is mobile
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                        (window.innerWidth <= 768);
        
        if (isMobile) {
            // Show swipe indicator after a delay
            setTimeout(() => {
                this.showSwipeIndicator();
            }, 2000);
            
            // Add mobile-specific optimizations
            this.addMobileOptimizations();
        }
    }

    showSwipeIndicator() {
        const swipeIndicator = document.getElementById('swipe-indicator');
        if (swipeIndicator) {
            swipeIndicator.classList.add('show');
            
            // Hide after 3 seconds
            setTimeout(() => {
                swipeIndicator.classList.remove('show');
            }, 3000);
        }
    }

    addMobileOptimizations() {
        // Prevent zoom on double tap
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });
        
        // Prevent pull-to-refresh and handle horizontal scrolling
        document.addEventListener('touchmove', (e) => {
            // Only prevent default for horizontal swipes
            if (e.touches.length === 1) {
                const touch = e.touches[0];
                const startX = this.lastTouchX || touch.clientX;
                const startY = this.lastTouchY || touch.clientY;
                
                const diffX = Math.abs(touch.clientX - startX);
                const diffY = Math.abs(touch.clientY - startY);
                
                // If horizontal movement is greater than vertical, prevent default
                if (diffX > diffY && diffX > 10) {
                    e.preventDefault();
                }
                
                this.lastTouchX = touch.clientX;
                this.lastTouchY = touch.clientY;
            }
        }, { passive: false });
        
        // Reset touch coordinates
        document.addEventListener('touchend', () => {
            this.lastTouchX = null;
            this.lastTouchY = null;
        });
        
        // Add haptic feedback for page changes
        if ('vibrate' in navigator) {
            this.addHapticFeedback = true;
        }
        
        // Prevent horizontal scrolling on the body
        document.body.style.overflowX = 'hidden';
        document.body.style.touchAction = 'pan-y';
    }

    setupEventListeners() {
        // Open book button
        const openBookBtn = document.getElementById('open-book');
        if (openBookBtn) {
            openBookBtn.addEventListener('click', () => this.openBook());
        }

        // Navigation buttons
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        
        console.log('Navigation buttons found:', { prevBtn, nextBtn });
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                console.log('Prev button clicked');
                this.prevPage();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                console.log('Next button clicked');
                this.nextPage();
            });
        }

        // Add touch feedback for mobile
        [prevBtn, nextBtn].forEach(btn => {
            if (btn) {
                btn.addEventListener('touchstart', (e) => {
                    this.addTouchFeedback(e.target);
                });

                btn.addEventListener('touchend', (e) => {
                    this.removeTouchFeedback(e.target);
                });
            }
        });

        // Gallery items for modal
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach(item => {
            item.addEventListener('click', () => this.showGalleryModal(item));
            item.addEventListener('mouseenter', () => this.addGalleryHoverEffect(item));
            item.addEventListener('mouseleave', () => this.removeGalleryHoverEffect(item));
            
            // Add touch interactions for mobile
            item.addEventListener('touchstart', () => this.addGalleryTouchEffect(item));
        });

        // Special effects for birthday page
        this.setupBirthdayEffects();
    }

    setupSwipeGestures() {
        let startX = 0;
        let startY = 0;
        let startTime = 0;
        let isSwiping = false;
        
        // Touch events for mobile
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            startTime = Date.now();
            isSwiping = false;
        }, { passive: false });

        document.addEventListener('touchmove', (e) => {
            if (!isSwiping) {
                const diffX = Math.abs(e.touches[0].clientX - startX);
                const diffY = Math.abs(e.touches[0].clientY - startY);
                
                if (diffX > 10 || diffY > 10) {
                    isSwiping = true;
                }
            }
            
            // Prevent default scrolling when swiping horizontally
            if (isSwiping) {
                const diffX = Math.abs(e.touches[0].clientX - startX);
                const diffY = Math.abs(e.touches[0].clientY - startY);
                
                if (diffX > diffY) {
                    e.preventDefault();
                }
            }
        }, { passive: false });

        document.addEventListener('touchend', (e) => {
            if (!isSwiping) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;
            const duration = Date.now() - startTime;

            // Horizontal swipe detection with minimum distance and speed
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50 && duration < 500) {
                e.preventDefault();
                e.stopPropagation();
                if (diffX > 0) {
                    console.log('Swipe right - next page');
                    this.nextPage();
                } else {
                    console.log('Swipe left - prev page');
                    this.prevPage();
                }
            }
        }, { passive: false });

        // Mouse events for desktop
        let mouseStartX = 0;
        let mouseStartY = 0;
        let mouseStartTime = 0;
        let isMouseSwiping = false;

        document.addEventListener('mousedown', (e) => {
            mouseStartX = e.clientX;
            mouseStartY = e.clientY;
            mouseStartTime = Date.now();
            isMouseSwiping = false;
        });

        document.addEventListener('mousemove', (e) => {
            if (!isMouseSwiping) {
                const diffX = Math.abs(e.clientX - mouseStartX);
                const diffY = Math.abs(e.clientY - mouseStartY);
                
                if (diffX > 10 || diffY > 10) {
                    isMouseSwiping = true;
                }
            }
        });

        document.addEventListener('mouseup', (e) => {
            if (!isMouseSwiping) return;
            
            const diffX = mouseStartX - e.clientX;
            const diffY = mouseStartY - e.clientY;
            const duration = Date.now() - mouseStartTime;

            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50 && duration < 500) {
                if (diffX > 0) {
                    console.log('Mouse swipe right - next page');
                    this.nextPage();
                } else {
                    console.log('Mouse swipe left - prev page');
                    this.prevPage();
                }
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.prevPage();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.nextPage();
            }
        });
    }

    openBook() {
        const welcomeScreen = document.getElementById('welcome-screen');
        const bookContainer = document.getElementById('book-container');
        
        // Enhanced entrance animation
        welcomeScreen.style.opacity = '0';
        welcomeScreen.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            welcomeScreen.style.display = 'none';
            bookContainer.classList.remove('hidden');
            bookContainer.style.opacity = '1';
            bookContainer.style.transform = 'scale(1)';
        }, 1000);

        // Add enhanced entrance effects
        this.animateBookEntrance();
    }

    animateBookEntrance() {
        // Add entrance sparkle effect
        this.createEnhancedSparkles();
        
        // Add floating particles
        this.createFloatingParticles();
        
        // Show first page
        this.showPage(1);
    }

    createEnhancedSparkles() {
        const sparkleContainer = document.createElement('div');
        sparkleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 100;
        `;
        
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                this.createSparkle(sparkleContainer, true);
            }, i * 80);
        }
        
        document.body.appendChild(sparkleContainer);
        
        setTimeout(() => {
            sparkleContainer.remove();
        }, 4000);
    }

    createFloatingParticles() {
        const particleContainer = document.createElement('div');
        particleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 50;
        `;
        
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                this.createFloatingParticle(particleContainer);
            }, i * 200);
        }
        
        document.body.appendChild(particleContainer);
        
        setTimeout(() => {
            particleContainer.remove();
        }, 6000);
    }

    createFloatingParticle(container) {
        const particle = document.createElement('div');
        const colors = ['#ff6b6b', '#ffd93d', '#a8e6cf', '#ffb347'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.cssText = `
            position: absolute;
            width: 8px;
            height: 8px;
            background: ${color};
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: 100%;
            animation: floatingParticle 4s ease-out forwards;
        `;
        
        container.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, 4000);
    }

    prevPage() {
        if (this.isTransitioning) return;
        
        if (this.currentPage > 1) {
            this.showPage(this.currentPage - 1);
        }
    }

    nextPage() {
        if (this.isTransitioning) return;
        
        if (this.currentPage < this.totalPages) {
            this.showPage(this.currentPage + 1);
        }
    }

    showPage(pageNumber) {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        
        // Add haptic feedback for mobile
        if (this.addHapticFeedback && 'vibrate' in navigator) {
            navigator.vibrate(50);
        }
        
        // Hide all pages first
        const allPages = document.querySelectorAll('.book-page');
        allPages.forEach(page => {
            page.classList.remove('active', 'prev');
            page.style.opacity = '0';
            page.style.transform = 'translateX(100%)';
        });
        
        // Show the new page
        const newPage = document.querySelector(`.book-page[data-page="${pageNumber}"]`);
        if (newPage) {
            newPage.classList.add('active');
            newPage.style.opacity = '1';
            newPage.style.transform = 'translateX(0)';
        }
        
        // Update current page
        this.currentPage = pageNumber;
        
        // Update navigation
        this.updateNavigation();
        
        // Add page transition effects
        this.addPageTransitionEffects();
        
        // Special effects for specific pages
        if (pageNumber === 8) { // Birthday page
            this.activateBirthdayPage();
        }
        
        // Hide swipe indicator after first page change
        const swipeIndicator = document.getElementById('swipe-indicator');
        if (swipeIndicator && swipeIndicator.classList.contains('show')) {
            swipeIndicator.classList.remove('show');
        }
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, 600);
    }

    updateNavigation() {
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');
        const pageIndicator = document.getElementById('page-indicator');
        
        if (prevBtn) {
            prevBtn.disabled = this.currentPage === 1;
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.currentPage === this.totalPages;
        }
        
        if (pageIndicator) {
            pageIndicator.textContent = `Page ${this.currentPage} of ${this.totalPages}`;
        }
    }

    addPageTransitionEffects() {
        // Add sparkle effect
        this.createPageSparkles();
        
        // Add page turn sound effect (visual feedback)
        this.addPageTurnEffect();
    }

    createPageSparkles() {
        const sparkleContainer = document.createElement('div');
        sparkleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 100;
        `;
        
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                this.createSparkle(sparkleContainer, false);
            }, i * 100);
        }
        
        document.body.appendChild(sparkleContainer);
        
        setTimeout(() => {
            sparkleContainer.remove();
        }, 2000);
    }

    addPageTurnEffect() {
        const bookPages = document.getElementById('book-pages');
        if (bookPages) {
            bookPages.style.transform = 'perspective(1000px) rotateY(5deg)';
            setTimeout(() => {
                bookPages.style.transform = 'perspective(1000px) rotateY(0deg)';
            }, 300);
        }
    }

    showGalleryModal(item) {
        const placeholder = item.querySelector('.photo-placeholder');
        const emoji = placeholder.querySelector('span').textContent;
        const title = placeholder.querySelector('p').textContent;
        
        this.createGalleryModal(title, emoji);
    }

    createGalleryModal(title, emoji) {
        const modal = document.createElement('div');
        modal.className = 'gallery-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-emoji">${emoji}</div>
                <h3>${title}</h3>
                <p class="modal-hint">💡 Tap to add your own photo here!</p>
                <p class="modal-description">This is where your beautiful photo will be displayed. You can replace this placeholder with your actual photo by editing the HTML file.</p>
                <button class="close-modal">Close</button>
            </div>
        `;
        
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease-out;
        `;
        
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.cssText = `
            background: rgba(255,255,255,0.1);
            backdrop-filter: blur(20px);
            padding: 2rem;
            border-radius: 20px;
            text-align: center;
            color: white;
            border: 1px solid rgba(255,255,255,0.2);
            max-width: 350px;
            margin: 1rem;
        `;
        
        modalContent.querySelector('.modal-emoji').style.fontSize = '4rem';
        modalContent.querySelector('h3').style.marginBottom = '1rem';
        modalContent.querySelector('.modal-hint').style.marginBottom = '1rem';
        modalContent.querySelector('.modal-hint').style.fontSize = '0.9rem';
        modalContent.querySelector('.modal-hint').style.opacity = '0.8';
        modalContent.querySelector('.modal-description').style.marginBottom = '2rem';
        modalContent.querySelector('.modal-description').style.fontSize = '0.9rem';
        modalContent.querySelector('.modal-description').style.lineHeight = '1.5';
        
        const closeBtn = modalContent.querySelector('.close-modal');
        closeBtn.style.cssText = `
            background: linear-gradient(45deg, #ff6b6b, #ee5a24);
            color: white;
            border: none;
            padding: 0.8rem 2rem;
            border-radius: 25px;
            cursor: pointer;
            font-weight: 500;
        `;
        
        closeBtn.addEventListener('click', () => {
            modal.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => modal.remove(), 300);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeBtn.click();
            }
        });
        
        document.body.appendChild(modal);
    }

    setupBirthdayEffects() {
        // Add click listener to birthday page for special effects
        const birthdayPage = document.querySelector('.book-page[data-page="8"]');
        if (birthdayPage) {
            birthdayPage.addEventListener('click', () => {
                if (this.currentPage === 8) {
                    this.activateBirthdayPage();
                }
            });
        }
    }

    activateBirthdayPage() {
        // Start confetti
        this.startConfetti();
        
        // Animate cake
        this.animateCake();
        
        // Add birthday effects
        this.addBirthdayEffects();
    }

    startConfetti() {
        const confettiContainer = document.querySelector('.confetti-container');
        if (!confettiContainer) return;
        
        // Create more confetti particles
        for (let i = 0; i < 150; i++) {
            setTimeout(() => {
                this.createConfettiParticle(confettiContainer);
            }, i * 30);
        }
    }

    createConfettiParticle(container) {
        const particle = document.createElement('div');
        const colors = ['#ff6b6b', '#ffd93d', '#a8e6cf', '#ffb347', '#ff9ff3'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const shapes = ['circle', 'square', 'triangle'];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        
        let shapeStyle = 'border-radius: 50%;';
        if (shape === 'square') {
            shapeStyle = 'border-radius: 0;';
        } else if (shape === 'triangle') {
            shapeStyle = 'clip-path: polygon(50% 0%, 0% 100%, 100% 100%);';
        }
        
        particle.style.cssText = `
            position: absolute;
            width: 8px;
            height: 8px;
            background: ${color};
            left: ${Math.random() * 100}%;
            top: -10px;
            ${shapeStyle}
            animation: confettiFall 4s linear forwards;
        `;
        
        container.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, 4000);
    }

    animateCake() {
        const cake = document.querySelector('.birthday-cake');
        if (!cake) return;
        
        cake.style.animation = 'bounce 0.8s ease-in-out';
        setTimeout(() => {
            cake.style.animation = '';
        }, 800);
    }

    addBirthdayEffects() {
        // Add sparkle effect to birthday page
        const birthdayPage = document.querySelector('.book-page[data-page="8"]');
        if (birthdayPage) {
            birthdayPage.style.animation = 'glow 2s ease-in-out infinite alternate';
            setTimeout(() => {
                birthdayPage.style.animation = '';
            }, 4000);
        }
    }

    addTouchFeedback(button) {
        button.style.transform = 'scale(0.95)';
        button.style.background = 'rgba(255, 255, 255, 0.3)';
    }

    removeTouchFeedback(button) {
        setTimeout(() => {
            button.style.transform = '';
            button.style.background = '';
        }, 150);
    }

    addGalleryHoverEffect(item) {
        item.style.transform = 'scale(1.05)';
        item.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
    }

    removeGalleryHoverEffect(item) {
        item.style.transform = '';
        item.style.boxShadow = '';
    }

    addGalleryTouchEffect(item) {
        item.style.transform = 'scale(1.05)';
        item.style.filter = 'brightness(1.1)';
        
        setTimeout(() => {
            item.style.transform = '';
            item.style.filter = '';
        }, 300);
    }

    setupPageAnimations() {
        // Add entrance animation to pages
        const pages = document.querySelectorAll('.book-page');
        pages.forEach((page, index) => {
            page.style.opacity = '0';
            page.style.transform = 'translateX(100%)';
            page.classList.remove('active', 'prev');
            
            if (index === 0) {
                page.style.opacity = '1';
                page.style.transform = 'translateX(0)';
                page.classList.add('active');
            }
        });
    }

    createSparkles() {
        const sparkleContainer = document.createElement('div');
        sparkleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 100;
        `;
        
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                this.createSparkle(sparkleContainer);
            }, i * 100);
        }
        
        document.body.appendChild(sparkleContainer);
        
        setTimeout(() => {
            sparkleContainer.remove();
        }, 3000);
    }

    createSparkle(container, enhanced = false) {
        const sparkle = document.createElement('div');
        sparkle.innerHTML = enhanced ? '✨' : '⭐';
        sparkle.style.cssText = `
            position: absolute;
            font-size: ${enhanced ? '2rem' : '1.5rem'};
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: sparkleFloat 2s ease-out forwards;
        `;
        
        container.appendChild(sparkle);
        
        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.remove();
            }
        }, 2000);
    }

    createConfetti() {
        // Initialize confetti container
        const confettiContainer = document.querySelector('.confetti-container');
        if (!confettiContainer) return;
    }
}

// Enhanced CSS animations
const enhancedStyles = `
    @keyframes confettiFall {
        0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
    
    @keyframes sparkleFloat {
        0% {
            transform: translateY(0) scale(0) rotate(0deg);
            opacity: 0;
        }
        50% {
            transform: translateY(-20px) scale(1) rotate(180deg);
            opacity: 1;
        }
        100% {
            transform: translateY(-40px) scale(0) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes floatingParticle {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes floatingHeart {
        0% {
            transform: translateY(0) scale(0);
            opacity: 0;
        }
        50% {
            transform: translateY(-50px) scale(1);
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) scale(0);
            opacity: 0;
        }
    }
    
    @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
        }
        40% {
            transform: translateY(-15px);
        }
        60% {
            transform: translateY(-7px);
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: scale(1);
        }
        to {
            opacity: 0;
            transform: scale(0.9);
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes float {
        0%, 100% {
            transform: translateY(0) rotate(0deg);
        }
        25% {
            transform: translateY(-8px) rotate(1deg);
        }
        50% {
            transform: translateY(-4px) rotate(-1deg);
        }
        75% {
            transform: translateY(-12px) rotate(0.5deg);
        }
    }
    
    @keyframes shake {
        0%, 100% {
            transform: translateX(0);
        }
        10%, 30%, 50%, 70%, 90% {
            transform: translateX(-5px);
        }
        20%, 40%, 60%, 80% {
            transform: translateX(5px);
        }
    }
`;

// Inject enhanced styles
const styleSheet = document.createElement('style');
styleSheet.textContent = enhancedStyles;
document.head.appendChild(styleSheet);

// Initialize the book when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new InteractivePhotoBook();
});

// Enhanced loading animation
document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.style.scrollBehavior = 'smooth';
    
    const loadingScreen = document.createElement('div');
    loadingScreen.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        color: white;
        font-size: 1.3rem;
        font-family: 'Dancing Script', cursive;
        flex-direction: column;
    `;
    
    const loadingText = document.createElement('div');
    loadingText.textContent = 'Loading Our Love Story...';
    loadingText.style.marginBottom = '1rem';
    
    const loadingHearts = document.createElement('div');
    loadingHearts.innerHTML = '💕 💖 💝 💕';
    loadingHearts.style.fontSize = '1.5rem';
    loadingHearts.style.animation = 'pulse 1s infinite';
    
    loadingScreen.appendChild(loadingText);
    loadingScreen.appendChild(loadingHearts);
    
    document.body.appendChild(loadingScreen);
    
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.transform = 'scale(0.9)';
        setTimeout(() => {
            loadingScreen.remove();
        }, 500);
    }, 2000);
}); 