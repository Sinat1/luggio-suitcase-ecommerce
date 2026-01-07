import { addToCart } from "./cart.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("/assets/data.json");
    if (!response.ok) throw new Error("Failed to load products");

    const { data } = await response.json();
    let products = [...data];

    // === FILTERS ON HOVER + CLICK ===
    const filtersTrigger = document.querySelector(".filters-dropdown__trigger");
    const filtersContent = document.querySelector(".filters-dropdown__content");

    if (filtersTrigger && filtersContent) {
      // Hover (desktop)
      filtersTrigger.addEventListener("mouseenter", () => {
        setTimeout(() => {
          filtersContent.classList.remove("is-hidden");
        }, 250);
      });
      filtersContent.addEventListener("mouseleave", () => {
        filtersContent.classList.add("is-hidden");
      });
      filtersContent.addEventListener("mouseenter", () => {
        filtersContent.classList.remove("is-hidden");
      });

      // Click (mobile + desktop)
      filtersTrigger.addEventListener("click", (e) => {
        e.stopPropagation();
        filtersContent.classList.toggle("is-hidden");
      });

      // Close on click outside
      document.addEventListener("click", (e) => {
        if (
          !filtersTrigger.contains(e.target) &&
          !filtersContent.contains(e.target)
        ) {
          filtersContent.classList.add("is-hidden");
        }
      });
    }

    // === INITIALIZING FILTERS ===
    const filterSize = document.getElementById("filter-size");
    const filterColor = document.getElementById("filter-color");
    const filterCategory = document.getElementById("filter-category");
    const filterSales = document.getElementById("filter-sales");
    const clearFiltersBtn = document.getElementById("clear-filters");
    const hideFiltersBtn = document.getElementById("hide-filters");

    function populateFilters() {
      const sizes = [
        ...new Set(data.flatMap((p) => p.size.split(",").map((v) => v.trim()))),
      ];
      filterSize.innerHTML = '<option value="">Choose option</option>';
      sizes.forEach((size) => {
        const option = document.createElement("option");
        option.value = size;
        option.textContent = size;
        filterSize.appendChild(option);
      });

      const colors = [...new Set(data.map((p) => p.color))];
      filterColor.innerHTML = '<option value="">Choose option</option>';
      colors.forEach((color) => {
        const option = document.createElement("option");
        option.value = color;
        option.textContent = color;
        filterColor.appendChild(option);
      });

      const categories = [...new Set(data.map((p) => p.category))];
      filterCategory.innerHTML = '<option value="">Choose option</option>';
      categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        filterCategory.appendChild(option);
      });
    }

    populateFilters();

    // === FILTERING ===
    function applyFilters() {
      let filtered = [...data];

      if (filterSize.value) {
        filtered = filtered.filter((p) => p.size.includes(filterSize.value));
      }
      if (filterColor.value) {
        filtered = filtered.filter((p) => p.color === filterColor.value);
      }
      if (filterCategory.value) {
        filtered = filtered.filter((p) => p.category === filterCategory.value);
      }
      if (filterSales.checked) {
        filtered = filtered.filter((p) => p.salesStatus === true);
      }

      products = filtered;
      renderProducts(products);
      updatePagination(products);
    }

    filterSize.addEventListener("change", applyFilters);
    filterColor.addEventListener("change", applyFilters);
    filterCategory.addEventListener("change", applyFilters);
    filterSales.addEventListener("change", applyFilters);

    clearFiltersBtn.addEventListener("click", () => {
      filterSize.value = "";
      filterColor.value = "";
      filterCategory.value = "";
      filterSales.checked = false;
      products = [...data];
      renderProducts(products);
      updatePagination(products);
    });

    hideFiltersBtn.addEventListener("click", () => {
      if (filtersContent) filtersContent.classList.add("is-hidden");
    });

    // === SORTING ===
    const sortSelect = document.getElementById("sort-select");

    function sortProducts() {
      const sortBy = sortSelect.value;
      switch (sortBy) {
        case "price-low-high":
          products.sort((a, b) => a.price - b.price);
          break;
        case "price-high-low":
          products.sort((a, b) => b.price - a.price);
          break;
        case "popularity":
          products.sort((a, b) => b.popularity - a.popularity);
          break;
        case "rating":
          products.sort((a, b) => b.rating - a.rating);
          break;
      }
      renderProducts(products);
      updatePagination(products);
    }

    sortSelect.addEventListener("change", sortProducts);

    // === SEARCH (MAIN AND MOBILE) ===
    const searchInput = document.getElementById("search-input");
    const searchBtn = document.getElementById("search-btn");
    const searchInputMobile = document.getElementById("search-input-mobile");
    const searchBtnMobile = document.getElementById("search-btn-mobile");
    const notFoundModal = document.getElementById("not-found-modal");
    const closeNotFoundBtn = document.getElementById("close-not-found");

    function searchProducts(query) {
      if (!query.trim()) {
        products = [...data];
        renderProducts(products);
        updatePagination(products);
        return;
      }
      const results = data.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
      );
      if (results.length === 0) {
        notFoundModal.classList.remove("is-hidden");
      } else {
        products = results;
        renderProducts(products);
        updatePagination(products);
      }
    }

    // Main search
    if (searchBtn) {
      searchBtn.addEventListener("click", () =>
        searchProducts(searchInput.value)
      );
    }
    if (searchInput) {
      searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") searchProducts(searchInput.value);
      });
    }

    // Mobile search
    if (searchBtnMobile) {
      searchBtnMobile.addEventListener("click", () =>
        searchProducts(searchInputMobile.value)
      );
    }
    if (searchInputMobile) {
      searchInputMobile.addEventListener("keypress", (e) => {
        if (e.key === "Enter") searchProducts(searchInputMobile.value);
      });
    }

    closeNotFoundBtn.addEventListener("click", () => {
      notFoundModal.classList.add("is-hidden");
      if (searchInput) searchInput.value = "";
      if (searchInputMobile) searchInputMobile.value = "";
      products = [...data];
      renderProducts(products);
      updatePagination(products);
    });

    // === PAGINATION ===
    const productsList = document.getElementById("products-list");
    const pagination = document.getElementById("pagination");
    let currentPage = 1;
    const itemsPerPage = 12;

    function renderProducts(products) {
      if (!products || products.length === 0) {
        productsList.innerHTML =
          '<p class="catalog-products__empty">No products found.</p>';
        return;
      }

      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const pageProducts = products.slice(start, end);

      productsList.innerHTML = pageProducts
        .map((product) => {
          const base = product.imageUrl;
          const folder = product.imageFolder || "homepage";
          return `
          <li class="catalog-product-item">
            <div class="catalog-product-item__img-wrapper">
              <picture class="catalog-product-item__img">
                <source srcset="/assets/images/${folder}/webp/${base}@1x.webp 1x, /assets/images/${folder}/webp/${base}@2x.webp 2x" type="image/webp">
                <source srcset="/assets/images/${folder}/${base}@1x.jpg 1x, /assets/images/${folder}/${base}@2x.jpg 2x" type="image/jpeg">
                <img src="/assets/images/${folder}/${base}@1x.jpg" alt="${
            product.name
          }" loading="lazy">
              </picture>
              ${
                product.salesStatus
                  ? '<span class="catalog-product-item__badge">SALE</span>'
                  : ""
              }
            </div>
            <div class="catalog-product-item__info">
              <h3 class="catalog-product-item__name">${product.name}</h3>
              <p class="catalog-product-item__price">$${product.price}</p>
              <button class="homepage-btn catalog-product-item__add-to-cart" data-id="${
                product.id
              }">Add To Cart</button>
            </div>
          </li>
        `;
        })
        .join("");
    }

    function updatePagination(products) {
      const totalItems = products.length;
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      const start = (currentPage - 1) * itemsPerPage + 1;
      const end = Math.min(currentPage * itemsPerPage, totalItems);
      document.getElementById(
        "results-info"
      ).textContent = `Showing ${start}–${end} of ${totalItems} Results`;

      let paginationHTML = "";
      if (totalPages > 1) {
        if (currentPage > 1)
          paginationHTML += `<button class="pagination__btn pagination__btn--prev" data-page="${
            currentPage - 1
          }">← Previous</button>`;
        for (let i = 1; i <= totalPages; i++) {
          paginationHTML += `<button class="pagination__btn ${
            i === currentPage ? "pagination__btn--active" : ""
          }" data-page="${i}">${i}</button>`;
        }
        if (currentPage < totalPages)
          paginationHTML += `<button class="pagination__btn pagination__btn--next" data-page="${
            currentPage + 1
          }">Next →</button>`;
      }
      pagination.innerHTML = paginationHTML;

      document.querySelectorAll(".pagination__btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const page = parseInt(btn.dataset.page);
          if (page !== currentPage) {
            currentPage = page;
            renderProducts(products);
            updatePagination(products);
          }
        });
      });
    }

    // === CARD HANDLERS ===
    productsList.addEventListener("click", (e) => {
      if (e.target.closest(".catalog-product-item__add-to-cart")) {
        e.preventDefault();
        const id = e.target.closest(".catalog-product-item__add-to-cart")
          .dataset.id;
        const product = data.find((p) => p.id === id);
        if (product) {
          addToCart(product);
          displayMessage(`"${product.name}" added to cart`, "success");
        }
      } else if (e.target.closest(".catalog-product-item")) {
        const id = e.target
          .closest(".catalog-product-item")
          .querySelector(".catalog-product-item__add-to-cart").dataset.id;
        if (id) window.location.href = `/html/product.html?id=${id}`;
      }
    });

    // === TOP BEST SETS ===
    const bestSetsList = document.getElementById("best-sets-list");
    const bestSets = data
      .filter((p) => p.category === "luggage sets")
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);

    bestSetsList.innerHTML = bestSets
      .map((set) => {
        const base = set.imageUrl;
        const folder = set.imageFolder || "homepage";
        return `
        <li class="top-best-set-item" data-id="${set.id}">
          <picture class="top-best-set-item__img">
            <source srcset="/assets/images/${folder}/webp/${base}@1x.webp 1x, /assets/images/${folder}/webp/${base}@2x.webp 2x" type="image/webp">
            <source srcset="/assets/images/${folder}/${base}@1x.jpg 1x, /assets/images/${folder}/${base}@2x.jpg 2x" type="image/jpeg">
            <img src="/assets/images/${folder}/${base}@1x.jpg" alt="${
          set.name
        }" loading="lazy">
          </picture>
          <div class="top-best-set-item__info">
            <h4 class="top-best-set-item__name">${set.name}</h4>
            <div class="top-best-set-item__rating">
              ${"★".repeat(Math.floor(set.rating))}${"☆".repeat(
          5 - Math.floor(set.rating)
        )}
            </div>
            <p class="top-best-set-item__price">$${set.price}</p>
          </div>
        </li>
      `;
      })
      .join("");

    // Click on Top Best Sets → product page
    bestSetsList.addEventListener("click", (e) => {
      const item = e.target.closest(".top-best-set-item");
      if (item) {
        const id = item.dataset.id;
        if (id) window.location.href = `/html/product.html?id=${id}`;
      }
    });

    // === CLONING TOP BEST SETS ON MOBILE ===
    const mobileTopBestSets = document.querySelector(
      ".catalog-top-best-sets-mobile"
    );
    if (mobileTopBestSets) {
      const title = document.createElement("h2");
      title.className = "top-best-sets__title";
      title.textContent = "Top Best Sets";
      mobileTopBestSets.appendChild(title);

      const clone = bestSetsList.cloneNode(true);
      mobileTopBestSets.appendChild(clone);

      clone.addEventListener("click", (e) => {
        const item = e.target.closest(".top-best-set-item");
        if (item) {
          const id = item.dataset.id;
          if (id) window.location.href = `/html/product.html?id=${id}`;
        }
      });
    }

    // === INITIALIZATION ===
    renderProducts(products);
    updatePagination(products);
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (err) {
    document.body.innerHTML = `<h1 class="container">Something went wrong. Error: ${err}</h1>`;
  }
});

// === TOAST ===
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
