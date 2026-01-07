import { addToCart } from "./cart.js";

// Helper functions
function updateMainRating(product) {
  const roundedRating = Math.round(product.rating);
  for (let i = 1; i <= 5; i++) {
    const useEl = document.querySelector(`.star-${i}`);
    if (useEl) {
      const iconName = i <= roundedRating ? "icon-star" : "icon-empty-star";
      useEl.setAttribute("href", `/assets/images/sprite.svg#${iconName}`);
    }
  }
}

function updateDynamicData(product) {
  document.getElementById("product-title").textContent = product.name;
  document.getElementById("product-price").textContent = `$${product.price}`;
}

function updateMainImage(product) {
  const base = product.imageUrl;
  const folder = product.imageFolder || "homepage";
  const img = document.querySelector("#main-img img");
  const picture = document.querySelector("#main-img");

  if (img) {
    img.src = `/assets/images/${folder}/${base}@1x.jpg`;
    img.alt = product.name;
  }

  if (picture) {
    picture.innerHTML = `
      <source srcset="/assets/images/${folder}/webp/${base}@1x.webp 1x, /assets/images/${folder}/webp/${base}@2x.webp 2x" type="image/webp">
      <source srcset="/assets/images/${folder}/${base}@1x.jpg 1x, /assets/images/${folder}/${base}@2x.jpg 2x" type="image/jpeg">
      <img src="/assets/images/${folder}/${base}@1x.jpg" alt="${product.name}" loading="lazy">
    `;
  }
}

function fillSelect(selectId, value) {
  const select = document.getElementById(selectId);
  if (!select || !value) return;

  select.innerHTML = '<option value="">Choose option</option>';
  const values = value
    .split(",")
    .map((v) => v.trim())
    .filter((v) => v);

  values.forEach((val) => {
    const option = document.createElement("option");
    option.value = val;
    option.textContent = val;
    select.appendChild(option);
  });
}

function setupQuantityControls(product) {
  let quantity = 1;
  const qtySpan = document.getElementById("qty-span");
  const qtyMinus = document.getElementById("qty-minus");
  const qtyPlus = document.getElementById("qty-plus");

  if (qtyMinus) {
    qtyMinus.addEventListener("click", () => {
      if (quantity > 1) {
        quantity--;
        if (qtySpan) qtySpan.textContent = quantity;
      }
    });
  }

  if (qtyPlus) {
    qtyPlus.addEventListener("click", () => {
      quantity++;
      if (qtySpan) qtySpan.textContent = quantity;
    });
  }

  const addToCartBtn = document.getElementById("add-to-cart");
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", () => {
      const size = document.getElementById("size-select").value || product.size;
      const color =
        document.getElementById("color-select").value || product.color;
      addToCart(product, size, color, quantity);
      displayMessage(`"${product.name}" added to cart`, "success");
    });
  }
}

function setupTabs() {
  const tabs = document.querySelectorAll(".product-tabs__tab");
  const panes = document.querySelectorAll(".product-tabs__pane");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active-tab"));
      panes.forEach((p) => (p.style.display = "none"));
      tab.classList.add("active-tab");
      const pane = document.getElementById(`${tab.dataset.tab}-pane`);
      if (pane) pane.style.display = "block";
    });
  });
}

function setupRatingAndReview(product) {
  let selectedRating = 0;
  const ratingStars = document.getElementById("rating-stars");

  function fillStars(
    count,
    filledIcon = "icon-star",
    emptyIcon = "icon-bordered-star"
  ) {
    if (!ratingStars) return;
    const allStars = ratingStars.querySelectorAll(".rating__stars-icon");
    allStars.forEach((star, i) => {
      const useEl = star.querySelector("use");
      if (useEl) {
        const iconName = i < count ? filledIcon : emptyIcon;
        useEl.setAttribute("href", `/assets/images/sprite.svg#${iconName}`);
      }
    });
  }

  const reviewForm = document.getElementById("review-form");
  if (reviewForm) {
    reviewForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("review-name")?.value.trim();
      const email = document.getElementById("review-email")?.value.trim();
      const text = document.getElementById("review-text")?.value.trim();
      if (!name || !email || !text) {
        displayMessage("Please fill all required fields.", "error");
        return;
      }

      selectedRating = 0;
      fillStars(0, "icon-star", "icon-bordered-star");
      displayMessage("Thank you for your review!", "success");
      reviewForm.reset();
    });
  }

  if (ratingStars) {
    const reviewsTitle = document.querySelector(".reviews-amount__title");
    if (reviewsTitle) {
      reviewsTitle.textContent = `1 review for ${product.name}`;
    }

    ratingStars.addEventListener("mouseover", (e) => {
      const star = e.target.closest(".rating__stars-icon");
      if (star) {
        const index = parseInt(star.dataset.index);
        fillStars(index, "icon-star", "icon-bordered-star");
      }
    });

    ratingStars.addEventListener("mouseout", () => {
      if (selectedRating > 0) {
        fillStars(selectedRating, "icon-star", "icon-bordered-star");
      } else {
        fillStars(0, "icon-star", "icon-bordered-star");
      }
    });

    ratingStars.addEventListener("click", (e) => {
      const star = e.target.closest(".rating__stars-icon");
      if (star) {
        selectedRating = parseInt(star.dataset.index);
        fillStars(selectedRating, "icon-star", "icon-bordered-star");
      }
    });

    fillStars(0, "icon-star", "icon-bordered-star");
  }
}

function setupYouMayAlsoLike(data, productId) {
  const alsoLikeList = document.querySelector(".you-may-also-like__list");
  if (!alsoLikeList) return;

  const randomProducts = data
    .filter((p) => p.id !== productId)
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  alsoLikeList.innerHTML = randomProducts
    .map((p) => {
      const base = p.imageUrl;
      const folder = p.imageFolder || "homepage";
      return `
        <li class="you-may-also-like__item" data-product-id="${p.id}">
          <div class="you-may-also-like__img-wrapper">
            <picture class="you-may-also-like__img">
              <source srcset="/assets/images/${folder}/webp/${base}@1x.webp 1x, /assets/images/${folder}/webp/${base}@2x.webp 2x" type="image/webp">
              <source srcset="/assets/images/${folder}/${base}@1x.jpg 1x, /assets/images/${folder}/${base}@2x.jpg 2x" type="image/jpeg">
              <img src="/assets/images/${folder}/${base}@1x.jpg" alt="${
        p.name
      }" loading="lazy">
            </picture>
            ${
              p.salesStatus
                ? '<span class="you-may-also-like__badge">SALE</span>'
                : ""
            }
          </div>
          <p class="you-may-also-like__name">${p.name}</p>
          <p class="you-may-also-like__price">$${p.price}</p>
          <button class="homepage-btn you-may-also-like__btn" data-id="${
            p.id
          }">Add To Cart</button>
        </li>
      `;
    })
    .join("");

  document.querySelectorAll(".you-may-also-like__btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const prod = data.find((p) => p.id === btn.dataset.id);
      if (prod) {
        addToCart(prod);
        displayMessage(`"${prod.name}" added to cart`, "success");
      }
    });
  });

  document.querySelectorAll(".you-may-also-like__item").forEach((item) => {
    item.addEventListener("click", () => {
      const id = item.dataset.productId;
      if (id) {
        window.location.href = `/html/product.html?id=${id}`;
      }
    });
  });
}

// Main initialization
document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("id");

  if (!productId) {
    document.body.innerHTML = '<h1 class="container">Product not found</h1>';
    return;
  }

  try {
    const response = await fetch("/assets/data.json");
    if (!response.ok) throw new Error("Failed to load products");

    const { data } = await response.json();
    const product = data.find((p) => p.id === productId);

    if (!product) {
      document.body.innerHTML = '<h1 class="container">Product not found</h1>';
      return;
    }

    // Initialization in parts
    updateMainRating(product);
    updateDynamicData(product);
    updateMainImage(product);

    fillSelect("size-select", product.size);
    fillSelect("color-select", product.color);
    fillSelect("category-select", product.category);

    setupQuantityControls(product);
    setupTabs();
    setupRatingAndReview(product);
    setupYouMayAlsoLike(data, productId);

    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (err) {
    document.body.innerHTML = `<h1 class="container">Something went wrong. Error: ${err.message}</h1>`;
  }
});

// Helper function
function displayMessage(message, type) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }
  const toast = document.createElement("div");
  toast.classList.add("toast-notification", `toast-${type}`);
  toast.textContent = message;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => {
    toast.classList.remove("show");
    toast.addEventListener("transitionend", () => toast.remove(), {
      once: true,
    });
  }, 5000);
}
