// Museum of Us - Enhanced Mobile Interactive JavaScript

class MuseumOfUs {
    constructor() {
        this.currentRoom = 'entrance';
        this.isBirthdayRoomActive = false;
        this.confettiParticles = [];
        this.floatingNavButtons = [];
        this.navigationHidden = false;
        this.shakeDetector = null;
        this.lastShakeTime = 0;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.createConfetti();
        this.setup3DEffects();
        this.setupFloatingNav();
        this.addMobileEnhancements();
        this.setupShakeDetection();
    }

    setupEventListeners() {
        // Enter museum button
        const enterBtn = document.getElementById('enter-museum');
        if (enterBtn) {
            enterBtn.addEventListener('click', () => this.enterMuseum());
        }

        // Back to entrance button
        const backBtn = document.getElementById('back-to-entrance');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.switchRoom('entrance');
                this.showNavigation();
            });
        }

        // Navigation buttons with enhanced mobile interactions
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const room = e.target.dataset.room;
                this.switchRoom(room);
                this.addButtonClickEffect(e.target);
                
                // Hide navigation after clicking (except for entrance)
                if (room !== 'entrance') {
                    this.hideNavigation();
                }
            });

            // Add touch feedback for mobile
            btn.addEventListener('touchstart', (e) => {
                this.addTouchFeedback(e.target);
            });

            btn.addEventListener('touchend', (e) => {
                this.removeTouchFeedback(e.target);
            });
        });

        // Enhanced memory items with mobile gestures
        const memoryItems = document.querySelectorAll('.memory-item');
        memoryItems.forEach(item => {
            item.addEventListener('mouseenter', () => this.addHoverEffect(item));
            item.addEventListener('mouseleave', () => this.removeHoverEffect(item));
            
            // Add touch interactions for mobile
            item.addEventListener('touchstart', () => this.addTouchEffect(item));
            item.addEventListener('touchend', () => this.removeTouchEffect(item));
        });

        // Enhanced photo interactions
        const photoItems = document.querySelectorAll('.photo-item');
        photoItems.forEach(item => {
            item.addEventListener('click', () => this.showPhotoModal(item));
            item.addEventListener('touchstart', () => this.addPhotoTouchEffect(item));
        });

        // Enhanced quote animations
        const quoteItems = document.querySelectorAll('.quote-item');
        quoteItems.forEach(item => {
            item.addEventListener('mouseenter', () => this.animateQuote(item));
            item.addEventListener('touchstart', () => this.addQuoteTouchEffect(item));
        });

        // Add tap to reveal navigation
        document.addEventListener('click', (e) => {
            if (this.navigationHidden && !e.target.closest('.nav-btn') && !e.target.closest('.back-to-entrance')) {
                this.showNavigation();
            }
        });

        // Add double tap to reveal navigation
        let lastTap = 0;
        document.addEventListener('touchend', (e) => {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            if (tapLength < 500 && tapLength > 0 && this.navigationHidden) {
                this.showNavigation();
                e.preventDefault();
            }
            lastTap = currentTime;
        });
    }

    setupShakeDetection() {
        if (window.DeviceMotionEvent) {
            let lastUpdate = 0;
            let lastX = 0, lastY = 0, lastZ = 0;
            const threshold = 15;
            const timeThreshold = 1000;

            window.addEventListener('devicemotion', (event) => {
                const currentTime = new Date().getTime();
                if ((currentTime - lastUpdate) > 100) {
                    const diffTime = currentTime - lastUpdate;
                    lastUpdate = currentTime;

                    const acceleration = event.accelerationIncludingGravity;
                    if (!acceleration) return;

                    const speed = Math.abs(acceleration.x + acceleration.y + acceleration.z - lastX - lastY - lastZ) / diffTime * 10000;

                    if (speed > threshold && this.navigationHidden && (currentTime - this.lastShakeTime) > timeThreshold) {
                        this.showNavigation();
                        this.lastShakeTime = currentTime;
                        this.addShakeEffect();
                    }

                    lastX = acceleration.x;
                    lastY = acceleration.y;
                    lastZ = acceleration.z;
                }
            });
        }
    }

    addShakeEffect() {
        // Add visual shake effect
        document.body.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 500);

        // Add vibration feedback
        if ('vibrate' in navigator) {
            navigator.vibrate([100, 50, 100]);
        }

        // Add sparkle effect
        this.createShakeSparkles();
    }

    createShakeSparkles() {
        const sparkleContainer = document.createElement('div');
        sparkleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 200;
        `;
        
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                this.createSparkle(sparkleContainer, true);
            }, i * 50);
        }
        
        document.body.appendChild(sparkleContainer);
        
        setTimeout(() => {
            sparkleContainer.remove();
        }, 2000);
    }

    hideNavigation() {
        const nav = document.getElementById('museum-nav');
        const backBtn = document.getElementById('back-to-entrance');
        const shakeArea = document.getElementById('shake-area');
        
        if (nav) {
            nav.classList.add('hidden');
        }
        
        if (backBtn) {
            backBtn.classList.add('visible');
        }
        
        if (shakeArea) {
            shakeArea.classList.add('active');
        }
        
        this.navigationHidden = true;
        
        // Add hint text
        this.addNavigationHint();
    }

    showNavigation() {
        const nav = document.getElementById('museum-nav');
        const backBtn = document.getElementById('back-to-entrance');
        const shakeArea = document.getElementById('shake-area');
        
        if (nav) {
            nav.classList.remove('hidden');
        }
        
        if (backBtn) {
            backBtn.classList.remove('visible');
        }
        
        if (shakeArea) {
            shakeArea.classList.remove('active');
        }
        
        this.navigationHidden = false;
        
        // Remove hint text
        this.removeNavigationHint();
        
        // Add entrance sparkles
        this.createRoomSparkles(document.querySelector('.room.active'));
    }

    addNavigationHint() {
        const hint = document.createElement('div');
        hint.id = 'navigation-hint';
        hint.innerHTML = '💡 Shake device or tap screen to show navigation';
        hint.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 25px;
            font-size: 0.9rem;
            text-align: center;
            z-index: 300;
            animation: fadeIn 0.5s ease-out;
            max-width: 80%;
        `;
        
        document.body.appendChild(hint);
        
        setTimeout(() => {
            if (hint.parentNode) {
                hint.style.opacity = '0';
                setTimeout(() => hint.remove(), 500);
            }
        }, 3000);
    }

    removeNavigationHint() {
        const hint = document.getElementById('navigation-hint');
        if (hint) {
            hint.remove();
        }
    }

    setupFloatingNav() {
        // Add random floating movement to nav buttons
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach((btn, index) => {
            this.addFloatingAnimation(btn, index);
        });
    }

    addFloatingAnimation(button, index) {
        const randomX = (Math.random() - 0.5) * 20;
        const randomY = (Math.random() - 0.5) * 20;
        const randomDelay = Math.random() * 2;
        
        button.style.animation = `float 6s ease-in-out infinite`;
        button.style.animationDelay = `${randomDelay}s`;
        
        // Add subtle rotation
        setInterval(() => {
            const rotation = Math.sin(Date.now() * 0.001 + index) * 2;
            button.style.transform += ` rotate(${rotation}deg)`;
        }, 100);
    }

    addMobileEnhancements() {
        // Add swipe gestures for room navigation
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

        // Add vibration feedback for mobile
        if ('vibrate' in navigator) {
            const interactiveElements = document.querySelectorAll('.nav-btn, .memory-item, .photo-item, .quote-item');
            interactiveElements.forEach(element => {
                element.addEventListener('click', () => {
                    navigator.vibrate(50);
                });
            });
        }
    }

    handleSwipeNavigation(direction) {
        const rooms = ['entrance', 'memories', 'quotes', 'photos', 'apology', 'birthday'];
        const currentIndex = rooms.indexOf(this.currentRoom);
        let nextIndex;

        if (direction === 'next') {
            nextIndex = (currentIndex + 1) % rooms.length;
        } else {
            nextIndex = (currentIndex - 1 + rooms.length) % rooms.length;
        }

        this.switchRoom(rooms[nextIndex]);
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

    addTouchEffect(element) {
        element.style.transform = 'scale(0.98)';
        element.style.boxShadow = '0 8px 25px rgba(0,0,0,0.4)';
    }

    removeTouchEffect(element) {
        setTimeout(() => {
            element.style.transform = '';
            element.style.boxShadow = '';
        }, 200);
    }

    addPhotoTouchEffect(element) {
        element.style.transform = 'scale(1.05)';
        element.style.filter = 'brightness(1.1)';
        
        setTimeout(() => {
            element.style.transform = '';
            element.style.filter = '';
        }, 300);
    }

    addQuoteTouchEffect(element) {
        element.style.transform = 'scale(1.08) rotate(2deg)';
        element.style.boxShadow = '0 15px 40px rgba(255, 215, 0, 0.4)';
        
        setTimeout(() => {
            element.style.transform = '';
            element.style.boxShadow = '';
        }, 400);
    }

    enterMuseum() {
        const welcomeScreen = document.getElementById('welcome-screen');
        const museumContainer = document.getElementById('museum-container');
        
        // Enhanced entrance animation
        welcomeScreen.style.opacity = '0';
        welcomeScreen.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            welcomeScreen.style.display = 'none';
            museumContainer.classList.remove('hidden');
            museumContainer.style.opacity = '1';
            museumContainer.style.transform = 'scale(1)';
        }, 1000);

        // Add enhanced entrance effects
        this.animateEntrance();
    }

    animateEntrance() {
        const entranceContent = document.querySelector('#entrance .room-content');
        entranceContent.style.animation = 'fadeInUp 1s ease-out';
        
        // Add enhanced sparkle effect
        this.createEnhancedSparkles();
        
        // Add floating particles
        this.createFloatingParticles();
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

    switchRoom(roomName) {
        this.currentRoom = roomName;
        
        // Update navigation with enhanced effects
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-room="${roomName}"]`).classList.add('active');

        // Hide all rooms with fade effect
        document.querySelectorAll('.room').forEach(room => {
            room.style.opacity = '0';
            room.style.transform = 'translateY(20px)';
            room.classList.remove('active');
        });

        // Show selected room with enhanced animation
        const targetRoom = document.getElementById(roomName);
        targetRoom.classList.add('active');
        
        setTimeout(() => {
            targetRoom.style.opacity = '1';
            targetRoom.style.transform = 'translateY(0)';
        }, 100);

        // Special effects for birthday room
        if (roomName === 'birthday' && !this.isBirthdayRoomActive) {
            this.activateBirthdayRoom();
        }

        // Add room transition effect
        this.addRoomTransitionEffect(targetRoom);
    }

    addRoomTransitionEffect(room) {
        room.style.animation = 'fadeIn 0.6s ease-in-out';
        
        // Add entrance sparkles for each room
        this.createRoomSparkles(room);
        
        setTimeout(() => {
            room.style.animation = '';
        }, 600);
    }

    createRoomSparkles(room) {
        const sparkleContainer = document.createElement('div');
        sparkleContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 10;
        `;
        
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                this.createSparkle(sparkleContainer, false);
            }, i * 100);
        }
        
        room.appendChild(sparkleContainer);
        
        setTimeout(() => {
            sparkleContainer.remove();
        }, 2000);
    }

    addHoverEffect(element) {
        element.style.transform = 'translateY(-8px) scale(1.02)';
        element.style.boxShadow = '0 15px 40px rgba(0,0,0,0.3)';
        element.style.border = '2px solid rgba(255, 255, 255, 0.5)';
    }

    removeHoverEffect(element) {
        element.style.transform = '';
        element.style.boxShadow = '';
        element.style.border = '';
    }

    animateQuote(element) {
        element.style.transform = 'scale(1.08) rotate(1deg)';
        element.style.boxShadow = '0 15px 40px rgba(255, 215, 0, 0.3)';
        
        setTimeout(() => {
            element.style.transform = '';
            element.style.boxShadow = '';
        }, 300);
    }

    showPhotoModal(photoItem) {
        const placeholder = photoItem.querySelector('.photo-placeholder');
        const emoji = placeholder.querySelector('span').textContent;
        const title = placeholder.querySelector('p').textContent;
        
        this.createEnhancedPhotoModal(emoji, title);
    }

    createEnhancedPhotoModal(emoji, title) {
        const modal = document.createElement('div');
        modal.className = 'photo-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-emoji">${emoji}</div>
                <h3>${title}</h3>
                <p>Tap to add your own photo here!</p>
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
            max-width: 300px;
            margin: 1rem;
        `;
        
        modalContent.querySelector('.modal-emoji').style.fontSize = '3rem';
        modalContent.querySelector('h3').style.marginBottom = '1rem';
        modalContent.querySelector('p').style.marginBottom = '1.5rem';
        
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

    activateBirthdayRoom() {
        this.isBirthdayRoomActive = true;
        
        // Enhanced confetti
        this.startEnhancedConfetti();
        
        // Animate cake with bounce
        this.animateCake();
        
        // Add birthday effects
        this.addBirthdayEffects();
    }

    startEnhancedConfetti() {
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
        const birthdayMessage = document.querySelector('.birthday-message');
        if (birthdayMessage) {
            birthdayMessage.style.animation = 'glow 2s ease-in-out infinite alternate';
        }
        
        // Add floating hearts around the cake
        this.createBirthdayHearts();
    }

    createBirthdayHearts() {
        const heartContainer = document.createElement('div');
        heartContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 10;
        `;
        
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                this.createFloatingHeart(heartContainer);
            }, i * 200);
        }
        
        document.querySelector('#birthday').appendChild(heartContainer);
        
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

    setup3DEffects() {
        // Enhanced 3D tilt effect for mobile
        const memoryItems = document.querySelectorAll('.memory-item');
        memoryItems.forEach(item => {
            item.addEventListener('mousemove', (e) => {
                this.add3DTilt(item, e);
            });
            
            item.addEventListener('mouseleave', () => {
                this.reset3DTilt(item);
            });
        });

        const quoteItems = document.querySelectorAll('.quote-item');
        quoteItems.forEach(item => {
            item.addEventListener('mousemove', (e) => {
                this.add3DTilt(item, e);
            });
            
            item.addEventListener('mouseleave', () => {
                this.reset3DTilt(item);
            });
        });
    }

    add3DTilt(element, event) {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;
        
        element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    }

    reset3DTilt(element) {
        element.style.transform = '';
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

// Initialize the museum when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MuseumOfUs();
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
    loadingText.textContent = 'Loading The Museum of Us...';
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