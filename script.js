// Our Love Story - Floating Photo Album JavaScript

class FloatingPhotoAlbum {
    constructor() {
        this.currentCategory = 'all';
        this.isBirthdayCardActive = false;
        this.isApologyCardActive = false;
        this.confettiParticles = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.createConfetti();
        this.setupCardAnimations();
        this.setupSpecialCards();
    }

    setupEventListeners() {
        // Enter album button
        const enterBtn = document.getElementById('enter-album');
        if (enterBtn) {
            enterBtn.addEventListener('click', () => this.enterAlbum());
        }

        // Back to home button
        const backBtn = document.getElementById('back-to-home');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.goHome());
        }

        // Navigation buttons
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.dataset.category;
                this.filterCards(category);
                this.addButtonClickEffect(e.target);
            });

            // Add touch feedback for mobile
            btn.addEventListener('touchstart', (e) => {
                this.addTouchFeedback(e.target);
            });

            btn.addEventListener('touchend', (e) => {
                this.removeTouchFeedback(e.target);
            });
        });

        // Photo card interactions
        const photoCards = document.querySelectorAll('.photo-card');
        photoCards.forEach(card => {
            card.addEventListener('click', () => this.showCardModal(card));
            card.addEventListener('mouseenter', () => this.addCardHoverEffect(card));
            card.addEventListener('mouseleave', () => this.removeCardHoverEffect(card));
            
            // Add touch interactions for mobile
            card.addEventListener('touchstart', () => this.addCardTouchEffect(card));
        });

        // Special cards
        const apologyCard = document.getElementById('apology-card');
        const birthdayCard = document.getElementById('birthday-card');
        
        if (apologyCard) {
            apologyCard.addEventListener('click', () => this.showApologyCard());
        }
        
        if (birthdayCard) {
            birthdayCard.addEventListener('click', () => this.showBirthdayCard());
        }

        // Add swipe gestures for mobile
        this.setupSwipeGestures();
    }

    setupSwipeGestures() {
        let startX = 0;
        let startY = 0;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;

            // Horizontal swipe detection
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                this.handleSwipeNavigation(diffX > 0 ? 'next' : 'prev');
            }
        });
    }

    handleSwipeNavigation(direction) {
        const categories = ['all', 'memories', 'dates', 'travel', 'special'];
        const currentIndex = categories.indexOf(this.currentCategory);
        let nextIndex;

        if (direction === 'next') {
            nextIndex = (currentIndex + 1) % categories.length;
        } else {
            nextIndex = (currentIndex - 1 + categories.length) % categories.length;
        }

        this.filterCards(categories[nextIndex]);
    }

    enterAlbum() {
        const welcomeScreen = document.getElementById('welcome-screen');
        const albumContainer = document.getElementById('album-container');
        
        // Enhanced entrance animation
        welcomeScreen.style.opacity = '0';
        welcomeScreen.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            welcomeScreen.style.display = 'none';
            albumContainer.classList.remove('hidden');
            albumContainer.style.opacity = '1';
            albumContainer.style.transform = 'scale(1)';
        }, 1000);

        // Add enhanced entrance effects
        this.animateEntrance();
    }

    animateEntrance() {
        // Add entrance sparkle effect
        this.createEnhancedSparkles();
        
        // Add floating particles
        this.createFloatingParticles();
        
        // Animate cards entrance
        this.animateCardsEntrance();
    }

    animateCardsEntrance() {
        const cards = document.querySelectorAll('.photo-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.animation = 'fadeInUp 0.6s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
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

    filterCards(category) {
        this.currentCategory = category;
        
        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');

        // Filter cards
        const cards = document.querySelectorAll('.photo-card');
        cards.forEach(card => {
            const cardCategory = card.dataset.category;
            
            if (category === 'all' || cardCategory === category) {
                card.classList.remove('hidden');
                card.style.animation = 'fadeInUp 0.6s ease-out';
            } else {
                card.classList.add('hidden');
            }
        });

        // Add filter sparkles
        this.createFilterSparkles();
    }

    createFilterSparkles() {
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
        
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                this.createSparkle(sparkleContainer, false);
            }, i * 100);
        }
        
        document.body.appendChild(sparkleContainer);
        
        setTimeout(() => {
            sparkleContainer.remove();
        }, 2000);
    }

    showCardModal(card) {
        const cardInfo = card.querySelector('.card-info');
        const title = cardInfo.querySelector('h3').textContent;
        const date = cardInfo.querySelector('.card-date').textContent;
        const description = cardInfo.querySelector('.card-description').textContent;
        const emoji = card.querySelector('.photo-emoji').textContent;
        
        this.createCardModal(title, date, description, emoji);
    }

    createCardModal(title, date, description, emoji) {
        const modal = document.createElement('div');
        modal.className = 'card-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-emoji">${emoji}</div>
                <h3>${title}</h3>
                <p class="modal-date">${date}</p>
                <p class="modal-description">${description}</p>
                <p class="modal-hint">💡 Tap to add your own photo here!</p>
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
        modalContent.querySelector('.modal-date').style.marginBottom = '1rem';
        modalContent.querySelector('.modal-date').style.color = '#a8e6cf';
        modalContent.querySelector('.modal-description').style.marginBottom = '1.5rem';
        modalContent.querySelector('.modal-hint').style.marginBottom = '2rem';
        modalContent.querySelector('.modal-hint').style.fontSize = '0.9rem';
        modalContent.querySelector('.modal-hint').style.opacity = '0.8';
        
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

    showApologyCard() {
        if (!this.isApologyCardActive) {
            this.isApologyCardActive = true;
            const apologyCard = document.getElementById('apology-card');
            if (apologyCard) {
                apologyCard.classList.add('visible');
                this.createApologyEffects();
            }
        }
    }

    showBirthdayCard() {
        if (!this.isBirthdayCardActive) {
            this.isBirthdayCardActive = true;
            const birthdayCard = document.getElementById('birthday-card');
            if (birthdayCard) {
                birthdayCard.classList.add('visible');
                this.createBirthdayEffects();
            }
        }
    }

    createApologyEffects() {
        // Add floating hearts
        this.createFloatingHearts();
        
        // Add vibration feedback
        if ('vibrate' in navigator) {
            navigator.vibrate([100, 50, 100]);
        }
    }

    createBirthdayEffects() {
        // Start confetti
        this.startConfetti();
        
        // Animate cake
        this.animateCake();
        
        // Add birthday effects
        this.addBirthdayEffects();
    }

    createFloatingHearts() {
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
        
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                this.createFloatingHeart(heartContainer);
            }, i * 200);
        }
        
        document.body.appendChild(heartContainer);
        
        setTimeout(() => {
            heartContainer.remove();
        }, 8000);
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
        // Add sparkle effect to birthday card
        const birthdayCard = document.getElementById('birthday-card');
        if (birthdayCard) {
            birthdayCard.style.animation = 'glow 2s ease-in-out infinite alternate';
        }
    }

    goHome() {
        // Hide special cards
        const apologyCard = document.getElementById('apology-card');
        const birthdayCard = document.getElementById('birthday-card');
        
        if (apologyCard) {
            apologyCard.classList.remove('visible');
            this.isApologyCardActive = false;
        }
        
        if (birthdayCard) {
            birthdayCard.classList.remove('visible');
            this.isBirthdayCardActive = false;
        }
        
        // Reset to all cards
        this.filterCards('all');
    }

    addButtonClickEffect(button) {
        button.style.transform = 'scale(0.9)';
        button.style.filter = 'brightness(1.2)';
        
        setTimeout(() => {
            button.style.transform = '';
            button.style.filter = '';
        }, 200);
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

    addCardHoverEffect(card) {
        card.style.transform = 'translateY(-15px) scale(1.05) rotateY(5deg)';
        card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
        card.style.borderColor = 'rgba(255, 255, 255, 0.5)';
    }

    removeCardHoverEffect(card) {
        card.style.transform = '';
        card.style.boxShadow = '';
        card.style.borderColor = '';
    }

    addCardTouchEffect(card) {
        card.style.transform = 'scale(1.05)';
        card.style.filter = 'brightness(1.1)';
        
        setTimeout(() => {
            card.style.transform = '';
            card.style.filter = '';
        }, 300);
    }

    setupCardAnimations() {
        // Add staggered entrance animation to cards
        const cards = document.querySelectorAll('.photo-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    setupSpecialCards() {
        // Add click listeners to show special cards
        const cards = document.querySelectorAll('.photo-card');
        cards.forEach(card => {
            const category = card.dataset.category;
            const date = card.dataset.date;
            
            // Show apology card for special category
            if (category === 'special' && date === '2024-08-30') {
                card.addEventListener('click', () => this.showApologyCard());
            }
            
            // Show birthday card for special category
            if (category === 'special' && date === '2024-04-10') {
                card.addEventListener('click', () => this.showBirthdayCard());
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

// Initialize the album when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FloatingPhotoAlbum();
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