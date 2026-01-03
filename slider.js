document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     HERO SLIDER
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

    nextBtn?.addEventListener("click", () => {
      stopHero();
      nextSlide();
      startHero();
    });

    prevBtn?.addEventListener("click", () => {
      stopHero();
      prevSlide();
      startHero();
    });

    showSlide(current);
    startHero();
  });

  /* ===============================
     DESTINATION SLIDER (FINAL)
  ================================ */
  const slider = document.querySelector(".destination-slider");
  const track = document.querySelector(".destination-track");
  const nextBtn = document.querySelector(".dest-btn.next");
  const prevBtn = document.querySelector(".dest-btn.prev");

  if (!slider || !track) return;

  const cards = track.querySelectorAll(".destination-card");
  const cardWidth = 305; // 280px card + 25px gap
  let index = 0;
  let autoTimer = null;

  /* helpers */
  function visibleCards() {
    return Math.max(1, Math.floor(slider.offsetWidth / cardWidth));
  }

  function maxIndex() {
    return Math.max(0, cards.length - visibleCards());
  }

  function update() {
    track.style.transition = "transform 0.4s ease";
    track.style.transform = `translateX(-${index * cardWidth}px)`;
  }

  /* auto slide */
  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => {
      index = index >= maxIndex() ? 0 : index + 1;
      update();
    }, 2500);
  }

  function stopAuto() {
    clearInterval(autoTimer);
  }

  startAuto();

  /* arrows */
  nextBtn?.addEventListener("click", () => {
    stopAuto();
    if (index < maxIndex()) index++;
    update();
    setTimeout(startAuto, 3000);
  });

  prevBtn?.addEventListener("click", () => {
    stopAuto();
    if (index > 0) index--;
    update();
    setTimeout(startAuto, 3000);
  });

  /* ===============================
     DRAG + TOUCH (PC + MOBILE)
  ================================ */
  let isDragging = false;
  let startX = 0;
  let currentX = 0;

  function dragStart(e, x) {
    e.preventDefault();
    stopAuto();
    isDragging = true;
    startX = x;
    track.style.transition = "none";
  }

  function dragMove(e, x) {
    if (!isDragging) return;
    e.preventDefault();
    currentX = x;
    const diff = startX - currentX;
    track.style.transform =
      `translateX(-${index * cardWidth + diff}px)`;
  }

  function dragEnd() {
    if (!isDragging) return;
    isDragging = false;

    const diff = startX - currentX;
    track.style.transition = "transform 0.4s ease";

    if (diff > 60 && index < maxIndex()) index++;
    else if (diff < -60 && index > 0) index--;

    update();
    setTimeout(startAuto, 3000);
  }

  /* mouse */
  slider.addEventListener("mousedown", e => dragStart(e, e.clientX));
  slider.addEventListener("mousemove", e => dragMove(e, e.clientX));
  slider.addEventListener("mouseup", dragEnd);
  slider.addEventListener("mouseleave", dragEnd);

  /* touch */
  slider.addEventListener(
    "touchstart",
    e => dragStart(e, e.touches[0].clientX),
    { passive: false }
  );
  slider.addEventListener(
    "touchmove",
    e => dragMove(e, e.touches[0].clientX),
    { passive: false }
  );
  slider.addEventListener("touchend", dragEnd);

  window.addEventListener("resize", () => {
    if (index > maxIndex()) index = maxIndex();
    update();
  });

  /* ===============================
     DESTINATION MODAL
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
   BOOK NOW → SCROLL
================================ */
const modalBookBtn = document.getElementById("modalBookBtn");
if (modalBookBtn) {
  modalBookBtn.addEventListener("click", e => {
    e.preventDefault();
    document.getElementById("imageModal").classList.remove("active");
    document.getElementById("packages")
      .scrollIntoView({ behavior: "smooth" });
  });
}
