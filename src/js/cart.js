const CART_KEY = "bestshop_cart";

// Get the cart from LocalStorage
export function getCart() {
  const cartStr = localStorage.getItem(CART_KEY);
  return cartStr ? JSON.parse(cartStr) : [];
}

// SAve the cart in LocalStorage
export function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Update counter in header
export function updateCartCounter() {
  const counter = document.querySelector("[data-cart-count]");
  const count = getCart().reduce((total, item) => total + item.quantity, 0);

  if (counter) {
    if (count > 0) {
      counter.textContent = count;
      counter.style.display = "flex";
    } else {
      counter.style.display = "none";
    }
  }
}

export function addToCart(product, size = "", color = "", quantity = 1) {
  const cart = getCart();

  const existingItem = cart.find(
    (item) =>
      item.id === product.id && item.size === size && item.color === color
  );

  if (existingItem) {
    existingItem.quantity += quantity; // ← add the specified quantity
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      imageFolder: product.imageFolder || "homepage",
      size,
      color,
      quantity,
    });
  }

  saveCart(cart);
  updateCartCounter();
}

function removeFromCart(id, size, color) {
  let cart = getCart();
  cart = cart.filter(
    (item) => !(item.id === id && item.size === size && item.color === color)
  );
  saveCart(cart);
  updateCartCounter();
}

function updateQuantity(id, size, color, newQuantity) {
  let cart = getCart();
  const item = cart.find(
    (item) => item.id === id && item.size === size && item.color === color
  );
  if (item && newQuantity > 0) {
    item.quantity = newQuantity;
    saveCart(cart);
    updateCartCounter();
  }
}

function calculateTotals() {
  const cart = getCart();
  const subTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = subTotal >= 3000 ? subTotal * 0.1 : 0;
  const total = subTotal - discount + 30; // +$30 shipping

  return { subTotal, discount, total };
}

function renderCart() {
  const cart = getCart();
  const tbody = document.querySelector(".cart-table tbody");
  const emptyMessage = document.getElementById("cart-empty-message");
  const cartTable = document.querySelector(".cart-table");
  const cartSummaryWrapper = document.querySelector(".cart-summary__wrapper");

  if (cart.length === 0) {
    tbody.innerHTML = "";
    if (emptyMessage) emptyMessage.style.display = "block";
    if (cartTable) cartTable.style.display = "none";
    if (cartSummaryWrapper) cartSummaryWrapper.style.display = "none";
    updateSummary(0, 0, 30);
    return;
  }

  if (emptyMessage) emptyMessage.style.display = "none";
  if (cartTable) cartTable.style.display = "table";
  if (cartSummaryWrapper) cartSummaryWrapper.style.display = "flex";

  tbody.innerHTML = cart
    .map((item) => {
      const base = item.imageUrl;
      const folder = item.imageFolder || "homepage";

      const webpSrcset = `../assets/images/${folder}/webp/${base}@1x.webp 1x, ../assets/images/${folder}/webp/${base}@2x.webp 2x`;
      const jpgSrcset = `../assets/images/${folder}/${base}@1x.jpg 1x, ../assets/images/${folder}/${base}@2x.jpg 2x`;

      return `
        <tr class="cart-table__row" data-product-id="${item.id}">
          <td class="cart-table__data-img" data-label="Image">
            <picture class="cart-table__img">
              <source srcset="${webpSrcset}" type="image/webp">
              <source srcset="${jpgSrcset}" type="image/jpeg">
              <img 
                src="../assets/images/${folder}/${base}@1x.jpg" 
                alt="${item.name}"
                loading="lazy">
            </picture>
          </td>
          <td class="cart-table__data-name" data-label="Product Name">${
            item.name
          }</td>
          <td class="cart-table__data-price" data-label="Price">$${
            item.price
          }</td>
          <td class="cart-table__data-quantity" data-label="Quantity">
            <div class="quantity-controls">
              <button class="quantity-controls__btn qty-minus" 
                data-id="${item.id}" 
                data-size="${item.size}" 
                data-color="${item.color}">-</button>
              <span class="quantity-controls__span">${item.quantity}</span>
              <button class="quantity-controls__btn qty-plus" 
                data-id="${item.id}" 
                data-size="${item.size}" 
                data-color="${item.color}">+</button>
            </div>
          </td>
          <td class="cart-table__data-total" data-label="Total">$${(
            item.price * item.quantity
          ).toFixed(2)}</td>
          <td class="cart-table__data-button" data-label="Delete">
            <button type="button" class="delete-btn" 
              data-id="${item.id}" 
              data-size="${item.size}" 
              data-color="${item.color}">
              <svg class="delete-btn__icon">
                <use href="../assets/images/sprite.svg#icon-trash"></use>
              </svg>
            </button>
          </td>
        </tr>
      `;
    })
    .join("");

  document.querySelectorAll(".cart-table__row").forEach((row) => {
    row.addEventListener("click", (e) => {
      if (
        e.target.closest(".qty-minus") ||
        e.target.closest(".qty-plus") ||
        e.target.closest(".delete-btn")
      ) {
        return;
      }

      const productId = row.dataset.productId;
      if (productId) {
        window.location.href = `/html/product.html?id=${productId}`;
      }
    });
  });

  // === CONTROL BUTTONS ===
  document.querySelectorAll(".qty-minus").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = e.target.dataset.id;
      const size = e.target.dataset.size || "";
      const color = e.target.dataset.color || "";
      const currentQty = parseInt(e.target.nextElementSibling.textContent);
      if (currentQty > 1) {
        updateQuantity(id, size, color, currentQty - 1);
        renderCart();
        updateCartCounter(); // ← updating the counter in real time
      }
    });
  });

  document.querySelectorAll(".qty-plus").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = e.target.dataset.id;
      const size = e.target.dataset.size || "";
      const color = e.target.dataset.color || "";
      const currentQty = parseInt(e.target.previousElementSibling.textContent);
      updateQuantity(id, size, color, currentQty + 1);
      renderCart();
      updateCartCounter(); // ← updating the counter in real time
    });
  });

  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = e.target.closest(".delete-btn").dataset.id;
      const size = e.target.closest(".delete-btn").dataset.size || "";
      const color = e.target.closest(".delete-btn").dataset.color || "";
      removeFromCart(id, size, color);
      renderCart();
      updateCartCounter(); // ← updating the counter in real time
    });
  });

  // Updating the totals
  const { subTotal, discount, total } = calculateTotals();
  updateSummary(subTotal, discount, total);
}

function updateSummary(subTotal, discount, total) {
  const subTotalEl = document.getElementById("sub-total");
  const discountEl = document.getElementById("discount");
  const totalEl = document.getElementById("total");

  if (subTotalEl) subTotalEl.textContent = `$${subTotal.toFixed(2)}`;
  if (discountEl) {
    if (discount > 0) {
      discountEl.textContent = `$${discount.toFixed(2)}`;
      discountEl.parentElement.style.display = "flex"; // ← showing the discount
    } else {
      discountEl.textContent = `$${discount.toFixed(2)}`;
      discountEl.parentElement.style.display = "none"; // ← hiding the discount
    }
  }
  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

// === INITIALIZING THE CART PAGE ===

document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".cart-table")) {
    renderCart();

    // "Clear Cart" button
    const clearCartBtn = document.getElementById("clear-cart");
    if (clearCartBtn) {
      clearCartBtn.addEventListener("click", () => {
        localStorage.removeItem(CART_KEY);
        updateCartCounter();
        renderCart();

        // Scroll to top
        requestAnimationFrame(() => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        });
      });
    }

    // Checkout button
    const checkoutBtn = document.getElementById("checkout");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", () => {
        localStorage.removeItem(CART_KEY);
        updateCartCounter();

        const cartTableBlock = document.querySelector(".cart-table__block");
        if (cartTableBlock) {
          cartTableBlock.innerHTML = `
        <div class="container">
          <p class="cart-thank-you">Thank you for your purchase!🫶🏼</p>
          <a href="/html/catalog.html" class="homepage-btn homepage-btn--cart">Continue Shopping</a>
        </div>
      `;
        }

        const cartSummary = document.querySelector(".cart-summary");
        if (cartSummary) cartSummary.style.display = "none";

        const clearCart = document.getElementById("clear-cart");
        const continueShopping = document.getElementById("continue-shopping");
        if (clearCart) clearCart.style.display = "none";
        if (continueShopping) continueShopping.style.display = "none";

        // Scroll to top
        requestAnimationFrame(() => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        });
      });
    }

    // "Continue Shopping" button
    const continueBtn = document.getElementById("continue-shopping");
    if (continueBtn) {
      continueBtn.addEventListener("click", () => {
        window.location.href = "/html/catalog.html";
      });
    }
  }
});
