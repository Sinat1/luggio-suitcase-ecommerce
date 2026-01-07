import { setupBurgerMenu } from "./burger-menu.js";
import { initModal } from "./modal.js";
import { updateCartCounter } from "./cart.js";

function loadComponent(selector, filePath) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const response = await fetch(filePath);
        if (!response.ok) {
          throw new Error(`Failed to load component: ${response.status}`);
        }
        const html = await response.text();

        const targetElement = document.querySelector(selector);
        const tempContainer = document.createElement("div");
        tempContainer.innerHTML = html;

        targetElement.innerHTML = "";
        while (tempContainer.firstChild) {
          targetElement.appendChild(tempContainer.firstChild);
        }

        if (selector === "header") {
          highlightActiveLink(targetElement);
          setupBurgerMenu();
          initModal();
          updateCartCounter();

          document.body.classList.remove("page-loading");
        }

        resolve();
      } catch (error) {
        reject(error);
      }
    })();
  });
}

function highlightActiveLink(headerElement) {
  const currentFullUrl = window.location.pathname.replace(/\/$/, "");
  const currentFile = currentFullUrl.split("/").pop() || "index.html";

  const navLinks = headerElement.querySelectorAll("a");

  navLinks.forEach((link) => {
    const linkPath = link.getAttribute("href");
    if (!linkPath || linkPath.startsWith("#") || linkPath.startsWith("tel:")) {
      return;
    }

    const normalizedLinkPath = linkPath.replace(/^\.\//, "").replace(/^\//, "");
    const linkFile = normalizedLinkPath.split("/").pop();

    const isIndexMatch =
      currentFile === "index.html" &&
      (linkFile === "index.html" || linkFile === "");

    if (linkFile === currentFile || isIndexMatch) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadComponent("header", "/html/header.html");
  loadComponent("footer", "/html/footer.html");
});
