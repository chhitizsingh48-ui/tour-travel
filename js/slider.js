document.addEventListener("DOMContentLoaded", () => {

  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  const modalTitle = document.getElementById("modalTitle");
  const modalDesc = document.getElementById("modalDesc");
  const closeModal = document.querySelector(".close-modal");

  document.querySelectorAll(".slider").forEach(slider => {

    const slides = slider.querySelectorAll(".slide");
    const nextBtn = slider.querySelector(".next");
    const prevBtn = slider.querySelector(".prev");

    let current = 0;
    let intervalTime = slider.dataset.interval || 3000;
    let autoSlide;

    function showSlide(index) {
      slides.forEach(s => s.classList.remove("active"));
      slides[index].classList.add("active");
    }

    function nextSlide() {
      current = (current + 1) % slides.length;
      showSlide(current);
    }

    function prevSlide() {
      current = (current - 1 + slides.length) % slides.length;
      showSlide(current);
    }

    function startAuto() {
      autoSlide = setInterval(nextSlide, intervalTime);
    }

    function stopAuto() {
      clearInterval(autoSlide);
    }

    if (nextBtn) {
      nextBtn.onclick = () => {
        stopAuto();
        nextSlide();
        startAuto();
      };
    }

    if (prevBtn) {
      prevBtn.onclick = () => {
        stopAuto();
        prevSlide();
        startAuto();
      };
    }

    /* Touch swipe */
    let startX = 0;
    slider.addEventListener("touchstart", e => {
      startX = e.touches[0].clientX;
    });

    slider.addEventListener("touchend", e => {
      let endX = e.changedTouches[0].clientX;
      if (startX - endX > 50) nextSlide();
      if (endX - startX > 50) prevSlide();
    });

    /* Click slide → open modal */
    slides.forEach(slide => {
      slide.addEventListener("click", () => {
        modalImg.src = slide.querySelector("img").src;
        modalTitle.textContent = slide.dataset.title || "";
        modalDesc.textContent = slide.dataset.desc || "";
        modal.classList.add("active");
        stopAuto();
      });
    });

    showSlide(current);
    startAuto();
  });

  /* Close modal */
  closeModal.onclick = () => {
    modal.classList.remove("active");
  };

  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
    }
  };

});
