// Loading Screen
window.addEventListener('load', () => {
  const loadingScreen = document.getElementById('loadingScreen');
  setTimeout(() => {
    loadingScreen.classList.add('hidden');
  }, 800);
});

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to 'light'
const currentTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', currentTheme);

themeToggle?.addEventListener('click', () => {
  const currentTheme = htmlElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  htmlElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  
  // Add animation effect
  themeToggle.style.transform = 'rotate(360deg)';
  setTimeout(() => {
    themeToggle.style.transform = '';
  }, 300);
});

// Mobile Menu
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

mobileMenuToggle.addEventListener('click', () => {
  mobileMenuToggle.classList.toggle('active');
  navMenu.classList.toggle('active');
  mobileMenuOverlay.classList.toggle('active');
  document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

mobileMenuOverlay.addEventListener('click', () => {
  mobileMenuToggle.classList.remove('active');
  navMenu.classList.remove('active');
  mobileMenuOverlay.classList.remove('active');
  document.body.style.overflow = '';
});

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenuToggle.classList.remove('active');
    navMenu.classList.remove('active');
    mobileMenuOverlay.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// Navbar Scroll Effect
let lastScroll = 0;
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 100) {
    if (currentScroll > lastScroll) {
      navbar.classList.add('hidden');
    } else {
      navbar.classList.remove('hidden');
    }
  }
  
  lastScroll = currentScroll;
});

// Active Navigation
const sections = document.querySelectorAll('section[id]');

function updateActiveNav() {
  const scrollY = window.pageYOffset;
  
  sections.forEach(section => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 150;
    const sectionId = section.getAttribute('id');
    
    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      document.querySelector('.nav-link.active')?.classList.remove('active');
      document.querySelector(`.nav-link[href="#${sectionId}"]`)?.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveNav);

// Hero Slider
class HeroSlider {
  constructor() {
    this.slides = document.querySelectorAll('.hero-slide');
    this.currentSlide = 0;
    this.slideInterval = null;
    this.autoSlideDelay = 4000; // 4 seconds
    
    if (this.slides.length > 0) {
      this.init();
    }
  }
  
  init() {
    const prevBtn = document.querySelector('.hero-prev');
    const nextBtn = document.querySelector('.hero-next');
    const heroSection = document.querySelector('.hero-section');
    
    if (prevBtn) prevBtn.addEventListener('click', () => {
      this.stopAutoSlide();
      this.prevSlide();
      this.startAutoSlide();
    });
    
    if (nextBtn) nextBtn.addEventListener('click', () => {
      this.stopAutoSlide();
      this.nextSlide();
      this.startAutoSlide();
    });
    
    if (heroSection) {
      heroSection.addEventListener('mouseenter', () => this.stopAutoSlide());
      heroSection.addEventListener('mouseleave', () => this.startAutoSlide());
    }
    
    this.startAutoSlide();
  }
  
  showSlide(index) {
    this.slides.forEach(slide => slide.classList.remove('active'));
    if (this.slides[index]) {
      this.slides[index].classList.add('active');
    }
  }
  
  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    this.showSlide(this.currentSlide);
  }
  
  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.showSlide(this.currentSlide);
  }
  
  startAutoSlide() {
    this.stopAutoSlide();
    this.slideInterval = setInterval(() => this.nextSlide(), this.autoSlideDelay);
  }
  
  stopAutoSlide() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
      this.slideInterval = null;
    }
  }
}

new HeroSlider();

// Destinations Slider
class DestinationsSlider {
  constructor() {
    this.slider = document.getElementById('destinationsSlider');
    this.track = document.getElementById('destinationsTrack');
    this.prevBtn = document.querySelector('.slider-prev');
    this.nextBtn = document.querySelector('.slider-next');
    this.cards = document.querySelectorAll('.destination-card');
    
    this.currentIndex = 0;
    this.isDragging = false;
    this.startX = 0;
    this.currentX = 0;
    this.translateX = 0;
    this.autoSlideInterval = null;
    this.autoSlideDelay = 3000; // 3 seconds
    this.autoSlideDirection = 1; // 1 for forward, -1 for backward
    
    this.init();
  }
  
  init() {
    if (!this.slider || !this.track) return;
    
    // Wait for layout to be ready
    setTimeout(() => {
      this.updatePosition(false);
    }, 100);
    
    this.prevBtn?.addEventListener('click', () => {
      this.stopAutoSlide();
      this.slide(-1);
      this.startAutoSlide();
    });
    
    this.nextBtn?.addEventListener('click', () => {
      this.stopAutoSlide();
      this.slide(1);
      this.startAutoSlide();
    });
    
    // Touch/Mouse events
    this.slider.addEventListener('mousedown', (e) => this.startDrag(e));
    this.slider.addEventListener('mousemove', (e) => this.drag(e));
    this.slider.addEventListener('mouseup', () => this.endDrag());
    this.slider.addEventListener('mouseleave', () => this.endDrag());
    
    this.slider.addEventListener('touchstart', (e) => this.startDrag(e.touches[0]));
    this.slider.addEventListener('touchmove', (e) => this.drag(e.touches[0]));
    this.slider.addEventListener('touchend', () => this.endDrag());
    
    // Stop auto-slide on hover
    this.slider.addEventListener('mouseenter', () => this.stopAutoSlide());
    this.slider.addEventListener('mouseleave', () => this.startAutoSlide());
    
    // Card click for modal
    this.cards.forEach(card => {
      card.addEventListener('click', (e) => {
        if (!this.isDragging) {
          this.openModal(card);
        }
      });
    });
    
    window.addEventListener('resize', () => {
      const maxIndex = this.getMaxIndex();
      this.currentIndex = Math.min(this.currentIndex, maxIndex);
      this.updatePosition(false); // Recalculate without animation
    });
    
    // Start auto-slide
    this.startAutoSlide();
  }
  
  getCardWidth() {
    // Fixed card width from CSS: 320px card + 24px gap = 344px
    return 344;
  }
  
  getVisibleCards() {
    const sliderWidth = this.slider.offsetWidth;
    const cardWidth = 344; // 320px card + 24px gap
    
    if (sliderWidth === 0) return 1;
    
    // Calculate how many cards fit
    const visibleCards = Math.floor(sliderWidth / cardWidth);
    
    // Return at least 1, maximum total cards available
    return Math.max(1, Math.min(visibleCards, this.cards.length));
  }
  
  getMaxIndex() {
    const cardWidth = 344; // 320px + 24px gap
    const sliderWidth = this.slider.offsetWidth;
    const totalTrackWidth = this.cards.length * cardWidth;
    
    // If all cards fit in the slider, no scrolling needed
    if (totalTrackWidth <= sliderWidth) {
      return 0;
    }
    
    // Calculate how much we can scroll (in pixels)
    const maxScrollDistance = totalTrackWidth - sliderWidth;
    
    // Convert to index (how many card-widths we can scroll)
    const maxIndex = Math.ceil(maxScrollDistance / cardWidth);
    
    return maxIndex;
  }
  
  startAutoSlide() {
    this.stopAutoSlide();
    this.autoSlideInterval = setInterval(() => {
      const maxIndex = this.getMaxIndex();
      
      // Only auto-slide if there are cards to show
      if (maxIndex === 0) {
        this.stopAutoSlide();
        return;
      }
      
      // Move in current direction
      this.currentIndex += this.autoSlideDirection;
      
      // Reverse direction at boundaries
      if (this.currentIndex >= maxIndex) {
        this.currentIndex = maxIndex;
        this.autoSlideDirection = -1;
      } else if (this.currentIndex <= 0) {
        this.currentIndex = 0;
        this.autoSlideDirection = 1;
      }
      
      this.updatePosition(true);
    }, this.autoSlideDelay);
  }
  
  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }
  
  updatePosition(animate = true) {
    const cardWidth = 344; // 320px + 24px gap
    const sliderWidth = this.slider.offsetWidth;
    const totalTrackWidth = this.cards.length * cardWidth;
    
    // Detect mobile (screens under 768px)
    const isMobile = window.innerWidth < 768;
    
    let finalTranslateX;
    
    if (isMobile) {
      // MOBILE: Center-snap each card
      const singleCardWidth = 320; // Card width without gap
      const centerOffset = (sliderWidth - singleCardWidth) / 2;
      
      // Calculate position to center the current card
      finalTranslateX = -(this.currentIndex * cardWidth) + centerOffset;
      
      // Clamp to prevent scrolling past first/last card
      const maxTranslateX = -(totalTrackWidth - sliderWidth);
      finalTranslateX = Math.max(finalTranslateX, maxTranslateX);
      finalTranslateX = Math.min(finalTranslateX, centerOffset);
      
    } else {
      // DESKTOP: Left-align (original behavior)
      let desiredTranslateX = -this.currentIndex * cardWidth;
      const maxTranslateX = -(totalTrackWidth - sliderWidth);
      
      finalTranslateX = Math.max(desiredTranslateX, maxTranslateX);
      finalTranslateX = Math.min(finalTranslateX, 0);
    }
    
    this.translateX = finalTranslateX;
    this.track.style.transition = animate ? 'transform 0.5s ease' : 'none';
    this.track.style.transform = `translateX(${this.translateX}px)`;
  }
  
  slide(direction) {
    this.stopAutoSlide();
    const maxIndex = this.getMaxIndex();
    this.currentIndex = Math.max(0, Math.min(this.currentIndex + direction, maxIndex));
    
    // Update auto-slide direction based on manual interaction
    this.autoSlideDirection = direction;
    
    this.updatePosition(true);
    this.startAutoSlide();
  }
  
  startDrag(e) {
    this.stopAutoSlide();
    this.isDragging = true;
    this.startX = e.clientX || e.pageX;
    this.slider.style.cursor = 'grabbing';
    this.track.style.transition = 'none';
  }
  
  drag(e) {
    if (!this.isDragging) return;
    e.preventDefault();
    
    this.currentX = e.clientX || e.pageX;
    const diff = this.currentX - this.startX;
    this.track.style.transform = `translateX(${this.translateX + diff}px)`;
  }
  
  endDrag() {
    if (!this.isDragging) return;
    
    this.isDragging = false;
    this.slider.style.cursor = 'grab';
    this.track.style.transition = 'transform 0.5s ease';
    
    const diff = this.currentX - this.startX;
    const cardWidth = 344;
    
    if (Math.abs(diff) > cardWidth / 3) {
      if (diff > 0) {
        this.slide(-1);
      } else {
        this.slide(1);
      }
    } else {
      this.updatePosition(true);
      this.startAutoSlide();
    }
  }
  
  openModal(card) {
    const title = card.dataset.title;
    const desc = card.dataset.desc;
    const img = card.dataset.img;
    
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalDescription').textContent = desc;
    document.getElementById('modalImage').src = img;
    
    const modal = document.getElementById('destinationModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

new DestinationsSlider();

// Modal
const modal = document.getElementById('destinationModal');
const modalClose = document.getElementById('modalClose');
const modalOverlay = document.querySelector('.modal-overlay');
const modalBookBtn = document.getElementById('modalBookBtn');

function closeModal() {
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

modalClose?.addEventListener('click', closeModal);
modalOverlay?.addEventListener('click', closeModal);
modalBookBtn?.addEventListener('click', closeModal);

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('active')) {
    closeModal();
  }
});

// Booking Form
const bookingForm = document.getElementById('bookingForm');

bookingForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const formData = new FormData(bookingForm);
  const data = Object.fromEntries(formData);
  
  console.log('Booking Data:', data);
  
  alert('Thank you for your booking request! We will contact you shortly.');
  bookingForm.reset();
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    
    if (target) {
      const navbarHeight = navbar.offsetHeight;
      const targetPosition = target.offsetTop - navbarHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Set minimum date for booking
const dateInput = document.getElementById('date');
if (dateInput) {
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);
}

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('.destination-card, .package-card, .booking-feature, .contact-method').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});