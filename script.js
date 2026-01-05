/* ===============================
   LOADING SCREEN
================================ */
window.addEventListener('load', () => {
  const loadingScreen = document.getElementById('loadingScreen');
  if (loadingScreen) {
    setTimeout(() => loadingScreen.classList.add('hidden'), 800);
  }
});

/* ===============================
   THEME TOGGLE
================================ */
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

const currentTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', currentTheme);

themeToggle?.addEventListener('click', () => {
  const newTheme = htmlElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  htmlElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
});

/* ===============================
   MOBILE MENU
================================ */
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

function closeMenu() {
  mobileMenuToggle?.classList.remove('active');
  navMenu?.classList.remove('active');
  mobileMenuOverlay?.classList.remove('active');
  document.body.style.overflow = '';
}

mobileMenuToggle?.addEventListener('click', () => {
  mobileMenuToggle.classList.toggle('active');
  navMenu.classList.toggle('active');
  mobileMenuOverlay.classList.toggle('active');
  document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

mobileMenuOverlay?.addEventListener('click', closeMenu);
navLinks.forEach(link => link.addEventListener('click', closeMenu));

/* ===============================
   NAVBAR SCROLL + ACTIVE LINK
================================ */
let lastScroll = 0;
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 100) {
    navbar?.classList.toggle('hidden', currentScroll > lastScroll);
  }
  lastScroll = currentScroll;

  sections.forEach(section => {
    const top = section.offsetTop - 150;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');

    if (currentScroll > top && currentScroll <= top + height) {
      document.querySelector('.nav-link.active')?.classList.remove('active');
      document.querySelector(`.nav-link[href="#${id}"]`)?.classList.add('active');
    }
  });
});

/* ===============================
   HERO SLIDER
================================ */
class HeroSlider {
  constructor() {
    this.slides = document.querySelectorAll('.hero-slide');
    this.index = 0;
    this.delay = 4000;
    this.timer = null;
    if (this.slides.length) this.init();
  }

  init() {
    document.querySelector('.hero-prev')?.addEventListener('click', () => this.move(-1));
    document.querySelector('.hero-next')?.addEventListener('click', () => this.move(1));
    this.start();
  }

  move(dir) {
    this.stop();
    this.index = (this.index + dir + this.slides.length) % this.slides.length;
    this.update();
    this.start();
  }

  update() {
    this.slides.forEach(s => s.classList.remove('active'));
    this.slides[this.index]?.classList.add('active');
  }

  start() {
    this.timer = setInterval(() => this.move(1), this.delay);
  }

  stop() {
    clearInterval(this.timer);
  }
}
new HeroSlider();

/* ===============================
   DESTINATIONS SLIDER (FIXED)
================================ */
class DestinationsSlider {
  constructor() {
    this.slider = document.getElementById('destinationsSlider');
    this.track = document.getElementById('destinationsTrack');
    this.cards = [...document.querySelectorAll('.destination-card')];

    this.index = 0;
    this.translateX = 0;
    this.startX = 0;
    this.currentX = 0;
    this.dragging = false;

    this.delay = 3000;
    this.timer = null;
    this.direction = 1;

    if (this.slider && this.cards.length) this.init();
  }

  init() {
    setTimeout(() => this.update(false), 100);

    this.slider.addEventListener('mousedown', e => this.startDrag(e));
    this.slider.addEventListener('mousemove', e => this.drag(e));
    this.slider.addEventListener('mouseup', () => this.endDrag());
    this.slider.addEventListener('mouseleave', () => this.endDrag());

    this.slider.addEventListener('touchstart', e => this.startDrag(e));
    this.slider.addEventListener('touchmove', e => this.drag(e), { passive: false });
    this.slider.addEventListener('touchend', () => this.endDrag());

    window.addEventListener('resize', () => this.update(false));
    this.start();
  }

  getMetrics() {
    const a = this.cards[0].getBoundingClientRect();
    let gap = 0;
    if (this.cards[1]) {
      const b = this.cards[1].getBoundingClientRect();
      gap = b.left - a.right;
    }
    return { width: a.width, gap };
  }

  getMaxIndex() {
    return window.innerWidth < 768
      ? this.cards.length - 1
      : Math.max(0, this.cards.length - 3);
  }

  start() {
    this.stop();
    this.timer = setInterval(() => {
      this.index += this.direction;
      if (this.index >= this.getMaxIndex()) this.direction = -1;
      if (this.index <= 0) this.direction = 1;
      this.update(true);
    }, this.delay);
  }

  stop() {
    clearInterval(this.timer);
  }

  update(animate = true) {
    const isMobile = window.innerWidth < 768;
    let x = 0;

    if (isMobile) {
      const { width, gap } = this.getMetrics();
      const step = width + gap;
      const center = this.slider.offsetWidth / 2;
      x = center - (this.index * step + width / 2);

      const min = this.slider.offsetWidth - (this.cards.length * step - gap);
      x = Math.max(min, Math.min(x, 0));
    } else {
      x = -this.index * 344;
    }

    this.translateX = x;
    this.track.style.transition = animate ? 'transform .45s ease' : 'none';
    this.track.style.transform = `translateX(${x}px)`;
  }

  startDrag(e) {
    this.stop();
    this.dragging = true;
    document.body.classList.add('dragging');
    this.startX = e.touches ? e.touches[0].clientX : e.clientX;
    this.track.style.transition = 'none';
  }

  drag(e) {
    if (!this.dragging) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const diff = x - this.startX;
    if (Math.abs(diff) > 6 && e.cancelable) e.preventDefault();
    this.track.style.transform = `translateX(${this.translateX + diff}px)`;
    this.currentX = x;
  }

  endDrag() {
    if (!this.dragging) return;
    this.dragging = false;
    document.body.classList.remove('dragging');
    this.update(true);
    this.start();
  }
}
new DestinationsSlider();

/* ===============================
   DESTINATION POPUP (MODAL)
================================ */
const modal = document.getElementById('destinationModal');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDescription');
const modalImage = document.getElementById('modalImage');
const modalClose = document.getElementById('modalClose');
const modalOverlay = document.querySelector('.modal-overlay');
const modalBookBtn = document.getElementById('modalBookBtn');

function openDestinationModal(card) {
  modalTitle.textContent = card.dataset.title || '';
  modalDesc.textContent = card.dataset.desc || '';
  modalImage.src = card.dataset.img || '';
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

document.querySelectorAll('.destination-card').forEach(card => {
  card.addEventListener('click', () => {
    if (document.body.classList.contains('dragging')) return;
    openDestinationModal(card);
  });
});

modalClose?.addEventListener('click', closeModal);
modalOverlay?.addEventListener('click', closeModal);
modalBookBtn?.addEventListener('click', closeModal);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modal.classList.contains('active')) {
    closeModal();
  }
});

/* ===============================
   BOOKING FORM
================================ */
const bookingForm = document.getElementById('bookingForm');
bookingForm?.addEventListener('submit', e => {
  e.preventDefault();
  alert('Thank you for your booking request! We will contact you shortly.');
  bookingForm.reset();
});

/* ===============================
   SMOOTH SCROLL
================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    window.scrollTo({
      top: target.offsetTop - navbar.offsetHeight,
      behavior: 'smooth'
    });
  });
});

/* ===============================
   INTERSECTION OBSERVER
================================ */
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document
  .querySelectorAll('.destination-card, .package-card, .booking-feature, .contact-method')
  .forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity .6s ease, transform .6s ease';
    observer.observe(el);
  });
