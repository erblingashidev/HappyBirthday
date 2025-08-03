class StoryBook {
  constructor() {
    this.pages = document.querySelectorAll('.page');
    this.currentPage = 0;
    this.totalPages = this.pages.length;
    this.isTransitioning = false;
    this.autoAdvanceInterval = null;
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchEndX = 0;
    this.touchEndY = 0;
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateUI();
    // this.startAutoAdvance(); // Disabled auto-advance
    this.hideLoading();
  }

  setupEventListeners() {
    // Navigation buttons
    document.getElementById('prevBtn').addEventListener('click', () => this.previousPage());
    document.getElementById('nextBtn').addEventListener('click', () => this.nextPage());
    
    // Share button removed
    
    // Modal
    document.getElementById('modalClose').addEventListener('click', () => this.closeModal());
    document.getElementById('modal').addEventListener('click', (e) => {
      if (e.target.id === 'modal') this.closeModal();
    });
    
    // Image click handlers
    document.querySelectorAll('.clickable-image').forEach(img => {
      img.addEventListener('click', (e) => this.openModal(e.target.src, e.target.alt));
    });
    
    // Touch/swipe gestures
    document.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
    document.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    
    // Click to advance (only on non-interactive elements)
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-btn') && 
          !e.target.closest('.clickable-image') &&
          !e.target.closest('.modal')) {
        this.nextPage();
      }
    });
    
    // Auto-advance disabled - removed pause functionality
  }

  handleTouchStart(e) {
    this.touchStartX = e.changedTouches[0].screenX;
    this.touchStartY = e.changedTouches[0].screenY;
  }

  handleTouchEnd(e) {
    this.touchEndX = e.changedTouches[0].screenX;
    this.touchEndY = e.changedTouches[0].screenY;
    this.handleSwipe();
  }

  handleSwipe() {
    const diffX = this.touchStartX - this.touchEndX;
    const diffY = this.touchStartY - this.touchEndY;
    const minSwipeDistance = 50;

    // Check if it's a horizontal swipe (not vertical)
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > minSwipeDistance) {
      if (diffX > 0) {
        // Swipe left - next page
        this.nextPage();
      } else {
        // Swipe right - previous page
        this.previousPage();
      }
    }
  }

  handleKeyPress(e) {
    switch(e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        this.previousPage();
        break;
      case 'ArrowRight':
      case ' ':
        e.preventDefault();
        this.nextPage();
        break;
      case 'Escape':
        this.closeModal();
        break;
    }
  }

  nextPage() {
    if (this.isTransitioning || this.currentPage >= this.totalPages - 1) return;
    
    this.isTransitioning = true;
    this.pages[this.currentPage].classList.add('slide-out');
    
    setTimeout(() => {
      this.pages[this.currentPage].classList.remove('active', 'slide-out');
      this.currentPage++;
      this.pages[this.currentPage].classList.add('active');
      this.updateUI();
      this.isTransitioning = false;
    }, 300);
  }

  previousPage() {
    if (this.isTransitioning || this.currentPage <= 0) return;
    
    this.isTransitioning = true;
    this.pages[this.currentPage].classList.remove('active');
    this.currentPage--;
    this.pages[this.currentPage].classList.add('active');
    this.updateUI();
    this.isTransitioning = false;
  }

  updateUI() {
    // Update progress dots
    document.querySelectorAll('.progress-dot').forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentPage);
    });
    
    // Update page counter
    document.getElementById('pageCounter').textContent = `${this.currentPage + 1} / ${this.totalPages}`;
    
    // Update navigation buttons
    document.getElementById('prevBtn').disabled = this.currentPage === 0;
    document.getElementById('nextBtn').disabled = this.currentPage === this.totalPages - 1;
    
    // Add sound effect (optional)
    this.playPageSound();
  }

  playPageSound() {
    // Create a subtle sound effect for page transitions
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  }

  startAutoAdvance() {
    this.autoAdvanceInterval = setInterval(() => {
      if (this.currentPage < this.totalPages - 1) {
        this.nextPage();
      }
    }, 10000); // 10 seconds
  }

  pauseAutoAdvance() {
    if (this.autoAdvanceInterval) {
      clearInterval(this.autoAdvanceInterval);
      // Restart after 30 seconds of inactivity
      setTimeout(() => this.startAutoAdvance(), 30000);
    }
  }

  openModal(imageSrc, imageAlt) {
    const modal = document.getElementById('modal');
    const modalImage = document.getElementById('modalImage');
    
    modalImage.src = imageSrc;
    modalImage.alt = imageAlt;
    modal.classList.add('active');
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }



  showToast(message) {
    // Create a simple toast notification
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 12px 20px;
      border-radius: 25px;
      font-size: 14px;
      z-index: 10000;
      transition: opacity 0.3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 2000);
  }

  hideLoading() {
    // Simulate loading time and hide loading screen
    setTimeout(() => {
      const loading = document.getElementById('loading');
      loading.classList.add('hidden');
      setTimeout(() => {
        loading.style.display = 'none';
      }, 500);
    }, 1500);
  }
}

// Initialize the story book when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new StoryBook();
});

// Add some additional mobile optimizations
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => console.log('SW registered'))
      .catch(error => console.log('SW registration failed'));
  });
}

// Prevent zoom on double tap (iOS)
let lastTouchEnd = 0;
document.addEventListener('touchend', (event) => {
  const now = (new Date()).getTime();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, false);