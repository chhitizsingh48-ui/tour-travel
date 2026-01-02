document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     HERO SLIDER (SAFE)
  ================================ */
  document.querySelectorAll(".slider").forEach(slider => {

    const slides = slider.querySelectorAll(".slide");
    const nextBtn = slider.querySelector(".next");
    const prevBtn = slider.querySelector(".prev");

    let current = 0;
    let intervalTime = slider.dataset.interval || 3000;
    let heroInterval;

    function showSlide(i) {
      slides.forEach(s => s.classList.remove("active"));
      slides[i].classList.add("active");
    }

    function nextSlide() {
      current = (current + 1) % slides.length;
      showSlide(current);
    }

    function prevSlide() {
      current = (current - 1 + slides.length) % slides.length;
      showSlide(current);
    }

    function startHero() {
      heroInterval = setInterval(nextSlide, intervalTime);
    }

    function stopHero() {
      clearInterval(heroInterval);
    }

    if (nextBtn) {
      nextBtn.onclick = () => {
        stopHero();
        nextSlide();
        startHero();
      };
    }

    if (prevBtn) {
      prevBtn.onclick = () => {
        stopHero();
        prevSlide();
        startHero();
      };
    }

    showSlide(current);
    startHero();
  });

/* ===============================
   DESTINATION SLIDER (PING-PONG)
================================ */
const track = document.querySelector(".destination-track");
const nextBtn = document.querySelector(".dest-btn.next");
const prevBtn = document.querySelector(".dest-btn.prev");

if (track && nextBtn && prevBtn) {
  const cards = track.querySelectorAll(".destination-card");
  const cardWidth = 280; // card + margin
  let index = 0;
  let direction = 1; // 1 = forward, -1 = backward
  let autoTimer = null;

  function visibleCards() {
    const sliderWidth = document.querySelector(".destination-slider").offsetWidth;
    return Math.max(1, Math.floor(sliderWidth / cardWidth));
  }

  function maxIndex() {
    return Math.max(0, cards.length - visibleCards());
  }

  function update() {
    track.style.transform = `translateX(-${index * cardWidth}px)`;
  }

  function autoMove() {
    index += direction;

    if (index >= maxIndex()) {
      index = maxIndex();
      direction = -1; // reverse
    }

    if (index <= 0) {
      index = 0;
      direction = 1; // forward again
    }

    update();
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(autoMove, 1800); // 🔥 FASTER SPEED
  }

  function stopAuto() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  /* start auto */
  startAuto();

  /* arrows = manual control */
  nextBtn.addEventListener("click", () => {
    stopAuto();
    if (index < maxIndex()) index++;
    update();
    setTimeout(startAuto, 2500);
  });

  prevBtn.addEventListener("click", () => {
    stopAuto();
    if (index > 0) index--;
    update();
    setTimeout(startAuto, 2500);
  });

  /* pause on hover */
  track.addEventListener("mouseenter", stopAuto);
  track.addEventListener("mouseleave", startAuto);

  /* fix on resize */
  window.addEventListener("resize", () => {
    if (index > maxIndex()) index = maxIndex();
    update();
  });
}


  /* ===============================
     DESTINATION POPUP (UNCHANGED)
  ================================ */
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  const modalTitle = document.getElementById("modalTitle");
  const modalDesc = document.getElementById("modalDesc");
  const closeModal = document.querySelector(".close-modal");

  document.querySelectorAll(".destination-card").forEach(card => {
    card.addEventListener("click", () => {
      modalImg.src = card.dataset.img;
      modalTitle.textContent = card.dataset.title;
      modalDesc.textContent = card.dataset.desc;
      modal.classList.add("active");
    });
  });

  closeModal.onclick = () => modal.classList.remove("active");
  modal.onclick = e => {
    if (e.target === modal) modal.classList.remove("active");
  };

});
/* ===============================
   BOOK NOW → CLOSE MODAL & SCROLL
================================ */
const modalBookBtn = document.getElementById("modalBookBtn");

if (modalBookBtn) {
  modalBookBtn.addEventListener("click", function (e) {
    e.preventDefault(); // stop default jump

    // close popup immediately
    const modal = document.getElementById("imageModal");
    modal.classList.remove("active");

    // smooth scroll to packages
    document.getElementById("packages").scrollIntoView({
      behavior: "smooth"
    });
  });
}

