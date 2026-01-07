export function setupBurgerMenu() {
  const burgerBtn = document.querySelector(".burger-menu-btn");
  const closeBtn = document.querySelector(".menu-close-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  if (!burgerBtn || !mobileMenu) return;

  // Global variable for storing scroll position
  let scrollPosition = 0;

  const toggleMenu = () => {
    const isExpanded = mobileMenu.classList.contains("is-open");

    // 1. TOGGLING MENU AND ARIA
    mobileMenu.classList.toggle("is-open");
    burgerBtn.setAttribute("aria-expanded", !isExpanded);

    if (!isExpanded) {
      // --- OPENING THE MENU (Fixation) ---
      scrollPosition = window.scrollY; // 1. Saving current scroll

      /// 2. Applying the scroll as a negative offset and fixing it
      document.body.style.top = `-${scrollPosition}px`;
      document.body.classList.add("no-scroll");
    } else {
      // --- CLOSING THE MENU (Unfixation) ---
      document.body.classList.remove("no-scroll");
      document.body.style.top = ""; // 3. Reseting top

      // 4. Restore the scroll position
      window.scrollTo(0, scrollPosition);
    }
  };

  burgerBtn.addEventListener("click", toggleMenu);

  if (closeBtn) {
    closeBtn.addEventListener("click", toggleMenu);
  }
}
