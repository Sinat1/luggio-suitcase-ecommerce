document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".contact-form__body");
  const emailInput = document.getElementById("email");
  const submitButton = form.querySelector(".form-submit-btn");

  // === REAL-TIME VALIDATION (Email Format) ===
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  emailInput.addEventListener("input", () => {
    if (!emailPattern.test(emailInput.value) && emailInput.value !== "") {
      emailInput.setCustomValidity(
        "Пожалуйста, введите корректный адрес электронной почты."
      );
      emailInput.classList.add("is-invalid");
    } else {
      emailInput.setCustomValidity("");
      emailInput.classList.remove("is-invalid");
    }
  });

  // === ON SUBMIT (AJAX Submission - IMITATION) ===
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

    const mockSuccess = true; // Set to false to test for error
    const mockDelay = 1500;

    setTimeout(() => {
      if (mockSuccess) {
        displayMessage("Thank you! Your message has been sent.", "success");
        form.reset();
      } else {
        displayMessage("An Error occurred. Please try again later.", "error");
      }

      submitButton.disabled = false;
      submitButton.textContent = "SEND";
    }, mockDelay);
  });

  // === Display Message Utility ===
  function displayMessage(message, type) {
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

    setTimeout(() => {
      toast.classList.add("show");
    }, 10);

    setTimeout(() => {
      toast.classList.remove("show");
      toast.addEventListener("transitionend", () => toast.remove(), {
        once: true,
      });
    }, 5000);
  }
});
