// Romantic Birthday Experience JavaScript

class RomanticBirthdayExperience {
    constructor() {
        this.currentChapter = 1;
        this.totalChapters = 6;
        this.isTransitioning = false;
        this.confettiParticles = [];
        this.memories = {
            'first-meeting': {
                title: 'Our First Meeting',
                content: 'I remember the exact moment when our eyes first met. The way you smiled, the way your voice sounded, everything about that moment is etched in my heart forever. That simple hello changed my entire world.',
                emoji: '💕'
            },
            'first-kiss': {
                title: 'Our First Kiss',
                content: 'That magical moment when our lips touched for the first time. Time seemed to stand still, and I knew in that instant that you were the one I wanted to spend my life with.',
                emoji: '💋'
            },
            'movie-night': {
                title: 'Movie Nights Together',
                content: 'Cuddling on the couch, watching our favorite movies, sharing popcorn and laughter. These quiet moments with you are some of my most treasured memories.',
                emoji: '🎬'
            },
            'dinner': {
                title: 'Romantic Dinners',
                content: 'Every candlelit dinner, every fancy restaurant, every home-cooked meal we\'ve shared. The way you light up when you talk about your day makes every meal special.',
                emoji: '🍽️'
            },
            'dance': {
                title: 'Dancing Together',
                content: 'Whether it\'s slow dancing in the living room or dancing like crazy at parties, every moment moving with you feels like pure magic.',
                emoji: '💃'
            }
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.createConfetti();
        this.setupChapterAnimations();
        this.setupSwipeGestures();
        this.startLoading();
    }

    startLoading() {
        // Simulate loading progress
        setTimeout(() => {
            this.hideLoading();
            this.showWelcome();
        }, 3000);
    }

    hideLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 1000);
        }
    }

    showWelcome() {
        const welcomeScreen = document.getElementById('welcome-screen');
        if (welcomeScreen) {
            welcomeScreen.classList.remove('hidden');
            welcomeScreen.style.opacity = '1';
        }
    }

    setupEventListeners() {
        // Start journey button
        const startBtn = document.getElementById('start-journey');
        if (startBtn) {
            startBtn.addEventListener('click', () => this.startJourney());
        }

        // Navigation buttons
        const prevBtn = document.getElementById('prev-chapter');
        const nextBtn = document.getElementById('next-chapter');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevChapter());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextChapter());
        }

        // Memory buttons
        const memoryBtns = document.querySelectorAll('.memory-btn');
        memoryBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const memory = e.target.dataset.memory;
                this.showMemory(memory);
            });
        });

        // Love meter boost
        const boostBtn = document.querySelector('.boost-btn');
        if (boostBtn) {
            boostBtn.addEventListener('click', () => this.boostLove());
        }

        // Adventure map points
        const mapPoints = document.querySelectorAll('.map-point');
        mapPoints.forEach(point => {
            point.addEventListener('click', (e) => {
                const location = e.target.dataset.location;
                this.showLocation(location);
            });
        });

        // Memory cards
        const memoryCards = document.querySelectorAll('.memory-card');
        memoryCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const memory = e.target.closest('.memory-card').dataset.memory;
                this.showMemory(memory);
            });
        });

        // Heart buttons
        const heartBtns = document.querySelectorAll('.heart-btn');
        heartBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const message = e.target.dataset.message;
                this.showHeartMessage(message);
            });
        });

        // Birthday celebration
        const celebrationBtn = document.getElementById('birthday-celebration');
        if (celebrationBtn) {
            celebrationBtn.addEventListener('click', () => this.startCelebration());
        }

        // Modal close
        const closeModal = document.querySelector('.close-modal');
        if (closeModal) {
            closeModal.addEventListener('click', () => this.closeModal());
        }

        // Add touch feedback for mobile
        this.addTouchFeedback();
    }

    addTouchFeedback() {
        const buttons = document.querySelectorAll('button, .memory-card, .map-point, .heart-btn');
        buttons.forEach(btn => {
            btn.addEventListener('touchstart', (e) => {
                btn.style.transform = 'scale(0.95)';
            });
            
            btn.addEventListener('touchend', (e) => {
                setTimeout(() => {
                    btn.style.transform = '';
                }, 150);
            });
        });
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

            // Horizontal swipe detection
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50 && duration < 500) {
                e.preventDefault();
                e.stopPropagation();
                if (diffX > 0) {
                    this.nextChapter();
                } else {
                    this.prevChapter();
                }
            }
        }, { passive: false });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.prevChapter();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.nextChapter();
            }
        });
    }

    startJourney() {
        const welcomeScreen = document.getElementById('welcome-screen');
        const mainExperience = document.getElementById('main-experience');
        
        welcomeScreen.style.opacity = '0';
        welcomeScreen.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            welcomeScreen.style.display = 'none';
            mainExperience.classList.remove('hidden');
            mainExperience.style.opacity = '1';
            this.showChapter(1);
        }, 1000);
    }

    prevChapter() {
        if (this.isTransitioning) return;
        
        if (this.currentChapter > 1) {
            this.showChapter(this.currentChapter - 1);
        }
    }

    nextChapter() {
        if (this.isTransitioning) return;
        
        if (this.currentChapter < this.totalChapters) {
            this.showChapter(this.currentChapter + 1);
        }
    }

    showChapter(chapterNumber) {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        
        // Hide all chapters first
        const allChapters = document.querySelectorAll('.chapter');
        allChapters.forEach(chapter => {
            chapter.classList.remove('active', 'prev');
            chapter.style.opacity = '0';
            chapter.style.transform = 'translateX(100%)';
        });
        
        // Show the new chapter
        const newChapter = document.querySelector(`.chapter[data-chapter="${chapterNumber}"]`);
        if (newChapter) {
            newChapter.classList.add('active');
            newChapter.style.opacity = '1';
            newChapter.style.transform = 'translateX(0)';
        }
        
        // Update current chapter
        this.currentChapter = chapterNumber;
        
        // Update navigation
        this.updateNavigation();
        
        // Add chapter transition effects
        this.addChapterTransitionEffects();
        
        // Special effects for specific chapters
        if (chapterNumber === 6) { // Birthday chapter
            this.activateBirthdayChapter();
        }
        
        setTimeout(() => {
            this.isTransitioning = false;
        }, 600);
    }

    updateNavigation() {
        const prevBtn = document.getElementById('prev-chapter');
        const nextBtn = document.getElementById('next-chapter');
        const chapterIndicator = document.getElementById('chapter-indicator');
        
        if (prevBtn) {
            prevBtn.disabled = this.currentChapter === 1;
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.currentChapter === this.totalChapters;
        }
        
        if (chapterIndicator) {
            chapterIndicator.textContent = `Chapter ${this.currentChapter} of ${this.totalChapters}`;
        }
    }

    addChapterTransitionEffects() {
        // Add sparkle effect
        this.createSparkles();
        
        // Add haptic feedback for mobile
        if ('vibrate' in navigator) {
            navigator.vibrate(50);
        }
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
        
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                this.createSparkle(sparkleContainer);
            }, i * 100);
        }
        
        document.body.appendChild(sparkleContainer);
        
        setTimeout(() => {
            sparkleContainer.remove();
        }, 2000);
    }

    createSparkle(container) {
        const sparkle = document.createElement('div');
        sparkle.innerHTML = '✨';
        sparkle.style.cssText = `
            position: absolute;
            font-size: 1.5rem;
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

    showMemory(memoryKey) {
        const memory = this.memories[memoryKey];
        if (!memory) return;
        
        const modal = document.getElementById('memory-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalContent = document.getElementById('modal-content');
        
        if (modal && modalTitle && modalContent) {
            modalTitle.textContent = memory.title;
            modalContent.innerHTML = `
                <div style="text-align: center; margin-bottom: 2rem;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">${memory.emoji}</div>
                    <p style="font-size: 1.1rem; line-height: 1.8;">${memory.content}</p>
                </div>
            `;
            
            modal.classList.add('show');
        }
    }

    showLocation(location) {
        const modal = document.getElementById('memory-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalContent = document.getElementById('modal-content');
        
        if (modal && modalTitle && modalContent) {
            modalTitle.textContent = location;
            modalContent.innerHTML = `
                <div style="text-align: center; margin-bottom: 2rem;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">📍</div>
                    <p style="font-size: 1.1rem; line-height: 1.8;">This is where we created beautiful memories together. Every place we've visited holds a special piece of our love story.</p>
                </div>
            `;
            
            modal.classList.add('show');
        }
    }

    showHeartMessage(message) {
        // Create floating heart message
        const heartMessage = document.createElement('div');
        heartMessage.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 107, 107, 0.9);
            color: white;
            padding: 1rem 2rem;
            border-radius: 25px;
            font-size: 1.2rem;
            font-weight: 600;
            z-index: 1000;
            animation: heartMessageFloat 3s ease-out forwards;
        `;
        heartMessage.textContent = message;
        
        document.body.appendChild(heartMessage);
        
        setTimeout(() => {
            heartMessage.remove();
        }, 3000);
    }

    boostLove() {
        const meterFill = document.querySelector('.meter-fill');
        if (meterFill) {
            meterFill.style.transform = 'scale(1.1)';
            setTimeout(() => {
                meterFill.style.transform = 'scale(1)';
            }, 300);
        }
        
        // Add love boost effect
        this.createLoveHearts();
    }

    createLoveHearts() {
        const heartContainer = document.createElement('div');
        heartContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 150;
        `;
        
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                this.createFloatingHeart(heartContainer);
            }, i * 200);
        }
        
        document.body.appendChild(heartContainer);
        
        setTimeout(() => {
            heartContainer.remove();
        }, 5000);
    }

    createFloatingHeart(container) {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.style.cssText = `
            position: absolute;
            font-size: 1.5rem;
            left: ${Math.random() * 100}%;
            top: 100%;
            animation: floatingHeart 4s ease-out forwards;
        `;
        
        container.appendChild(heart);
        
        setTimeout(() => {
            if (heart.parentNode) {
                heart.remove();
            }
        }, 4000);
    }

    activateBirthdayChapter() {
        // Add special birthday effects
        this.createBirthdaySparkles();
        
        // Animate the cake
        const cake = document.querySelector('.birthday-cake-large');
        if (cake) {
            cake.style.animation = 'bounce 0.8s ease-in-out';
            setTimeout(() => {
                cake.style.animation = '';
            }, 800);
        }
    }

    createBirthdaySparkles() {
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
            }, i * 150);
        }
        
        document.body.appendChild(sparkleContainer);
        
        setTimeout(() => {
            sparkleContainer.remove();
        }, 3000);
    }

    startCelebration() {
        // Start confetti
        this.startConfetti();
        
        // Add celebration effects
        this.addCelebrationEffects();
        
        // Show celebration message
        this.showCelebrationMessage();
    }

    startConfetti() {
        const confettiContainer = document.querySelector('.confetti-container');
        if (!confettiContainer) return;
        
        // Create more confetti particles
        for (let i = 0; i < 200; i++) {
            setTimeout(() => {
                this.createConfettiParticle(confettiContainer);
            }, i * 20);
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

    addCelebrationEffects() {
        // Add glow effect to celebration button
        const celebrationBtn = document.getElementById('birthday-celebration');
        if (celebrationBtn) {
            celebrationBtn.style.animation = 'glow 1s ease-in-out infinite alternate';
            setTimeout(() => {
                celebrationBtn.style.animation = '';
            }, 5000);
        }
    }

    showCelebrationMessage() {
        const celebrationMessage = document.createElement('div');
        celebrationMessage.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 217, 61, 0.9);
            color: white;
            padding: 2rem 3rem;
            border-radius: 25px;
            font-size: 1.5rem;
            font-weight: 600;
            z-index: 1000;
            text-align: center;
            animation: celebrationMessageFloat 4s ease-out forwards;
        `;
        celebrationMessage.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 1rem;">🎉</div>
            <div>Happy Birthday, My Love!</div>
            <div style="font-size: 1rem; margin-top: 1rem; opacity: 0.9;">May your day be as magical as you are</div>
        `;
        
        document.body.appendChild(celebrationMessage);
        
        setTimeout(() => {
            celebrationMessage.remove();
        }, 4000);
    }

    closeModal() {
        const modal = document.getElementById('memory-modal');
        if (modal) {
            modal.classList.remove('show');
        }
    }

    setupChapterAnimations() {
        // Add entrance animation to chapters
        const chapters = document.querySelectorAll('.chapter');
        chapters.forEach((chapter, index) => {
            chapter.style.opacity = '0';
            chapter.style.transform = 'translateX(100%)';
            chapter.classList.remove('active', 'prev');
            
            if (index === 0) {
                chapter.style.opacity = '1';
                chapter.style.transform = 'translateX(0)';
                chapter.classList.add('active');
            }
        });
    }

    createConfetti() {
        // Initialize confetti container
        const confettiContainer = document.querySelector('.confetti-container');
        if (!confettiContainer) return;
    }
}

// Enhanced CSS animations
const enhancedStyles = `
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
    
    @keyframes heartMessageFloat {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
        }
        20% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 1;
        }
        80% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
        }
    }
    
    @keyframes celebrationMessageFloat {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
        }
        20% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 1;
        }
        80% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
        }
    }
    
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
`;

// Inject enhanced styles
const styleSheet = document.createElement('style');
styleSheet.textContent = enhancedStyles;
document.head.appendChild(styleSheet);

// Initialize the experience when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RomanticBirthdayExperience();
}); 