document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector(".travel-suitcases__list");
  const nextBtn = document.querySelector(".travel-suitcases__btn--next");
  const prevBtn = document.querySelector(".travel-suitcases__btn--prev");

  if (!slider || !nextBtn || !prevBtn) return;

  // === BUTTONS AND KEYBOARD ===
  function nextSlide() {
    slider.classList.add("slide-out-next");
    setTimeout(() => {
      const last = slider.lastElementChild;
      if (last) {
        slider.insertBefore(last, slider.firstElementChild);
      }
      slider.classList.remove("slide-out-next");
    }, 500);
  }

  function prevSlide() {
    slider.classList.add("slide-in-prev");
    setTimeout(() => {
      const first = slider.firstElementChild;
      if (first) {
        slider.appendChild(first);
      }
      slider.classList.remove("slide-in-prev");
    }, 500);
  }

  // === SWIPES (LOGIC) ===
  function swipeNext() {
    slider.classList.add("slide-out-next");
    setTimeout(() => {
      const first = slider.firstElementChild;
      if (first) slider.appendChild(first);
      slider.classList.remove("slide-out-next");
    }, 500);
  }

  function swipePrev() {
    slider.classList.add("slide-in-prev");
    setTimeout(() => {
      const last = slider.lastElementChild;
      if (last) slider.insertBefore(last, slider.firstElementChild);
      slider.classList.remove("slide-in-prev");
    }, 500);
  }

  nextBtn.addEventListener("click", nextSlide);
  prevBtn.addEventListener("click", prevSlide);

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") nextSlide();
    else if (e.key === "ArrowLeft") prevSlide();
  });

  // SWIPES
  let startX = 0;
  slider.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });
  slider.addEventListener("touchend", (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (diff > 50) {
      swipeNext();
    } else if (diff < -50) {
      swipePrev();
    }
  });
});
