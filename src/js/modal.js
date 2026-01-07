// === TOAST MESSAGE ===
export function displayMessage(message, type) {
  let toastContainer = document.getElementById("toast-container");
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toast-container";
    document.body.appendChild(toastContainer);
  }
  const toast = document.createElement("div");
  toast.classList.add("toast-notification", `toast-${type}`);
  toast.textContent = message;
  toastContainer.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add("show"));

  setTimeout(() => {
    toast.classList.remove("show");
    toast.addEventListener("transitionend", () => toast.remove(), {
      once: true,
    });
  }, 5000);
}

// === MODAL CLOSE ===
function closeModal(modal) {
  modal.classList.add("is-hidden");
  document.body.classList.remove("modal-open");
  const form = document.getElementById("loginForm");
  if (form) form.reset();
}

// === MODAL OPEN ===
function openModal(modal) {
  modal.classList.remove("is-hidden");
  document.body.classList.add("modal-open");
  const firstInput = modal.querySelector("input");
  if (firstInput) firstInput.focus();
}

// === MAIN INFORMATION ===
export function initModal() {
  const openBtn = document.querySelector("[data-modal-open]");
  const modal = document.querySelector("[data-modal]");

  if (!modal) return;

  // ===  OPENING BY BUTTON ===
  if (openBtn) {
    openBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openModal(modal);
    });
  }

  // ===  CLOSING BY CLICKING ON BACKDROP ===
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal(modal);
    }
  });

  // === CLOSING BY ESC ===
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.classList.contains("is-hidden")) {
      closeModal(modal);
    }
  });

  // ===  PASSWORD TOGGLE ===
  const passwordInput = document.getElementById("login-password");
  const toggleBtn = modal.querySelector("[data-password-toggle]");
  const eyeIcon = toggleBtn?.querySelector(".eye-icon");

  if (passwordInput && toggleBtn && eyeIcon) {
    toggleBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const isPassword = passwordInput.type === "password";
      passwordInput.type = isPassword ? "text" : "password";

      eyeIcon.style.fill = isPassword ? "#B92770" : "#727174";

      toggleBtn.setAttribute("aria-pressed", String(isPassword));
      toggleBtn.setAttribute(
        "aria-label",
        isPassword ? "Hide password" : "Show password"
      );
    });
  }

  // === SUBMITTING THE FORM ===
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Validation HTML5 (email + required)
      if (!loginForm.checkValidity()) {
        loginForm.reportValidity();
        return;
      }

      const submitBtn = loginForm.querySelector(".login-submit-btn");
      if (submitBtn) {
        submitBtn.disabled = true;
        const originalText = submitBtn.textContent;
        submitBtn.textContent = "Logging In...";

        // Request imitation
        setTimeout(() => {
          // Successful login
          displayMessage("Login successful! Welcome.", "success");
          closeModal(modal);

          // Restoring the button
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }, 1500);
      }
    });
  }
}
