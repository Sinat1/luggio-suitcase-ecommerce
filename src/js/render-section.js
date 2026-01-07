import { addToCart } from "./cart.js";
import { displayMessage } from "./modal.js";

/**
 * Renders a product section based on the value from the "blocks" field
 * @param {string} blockName - value from blocks (e.g., "Selected Products")
 * @param {string} listSelector - <ul> selector (e.g., ".selected-products__list")
 * @param {string} buttonText - button text ("Add To Cart" or "View Product")
 */
export async function renderProductSection(
  blockName,
  listSelector,
  buttonText = "Add To Cart"
) {
  try {
    const response = await fetch("./assets/data.json");
    if (!response.ok) throw new Error(`Failed to load data for "${blockName}"`);

    const { data } = await response.json();

    // Filter products by blockName
    const products = data.filter(
      (product) =>
        Array.isArray(product.blocks) && product.blocks.includes(blockName)
    );

    const list = document.querySelector(listSelector);
    if (!list) {
      return;
    }

    // Generating a base CSS class from blockName
    const baseClass = blockName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, ""); // "New Products Arrival" → "new-products-arrival"

    list.innerHTML = "";

    products.forEach((product) => {
      const li = document.createElement("li");
      li.classList.add(`${baseClass}__item`);

      const base = product.imageUrl;

      const folder = product.imageFolder || "homepage";

      li.innerHTML = `
  <div class="${baseClass}__img-wrapper">
    <picture class="${baseClass}__img">
      <source
        srcset="./assets/images/${folder}/webp/${base}@1x.webp 1x, ./assets/images/${folder}/webp/${base}@2x.webp 2x"
        type="image/webp">
      <source
        srcset="./assets/images/${folder}/${base}@1x.jpg 1x, ./assets/images/${folder}/${base}@2x.jpg 2x"
        type="image/jpeg">
      <img
        src="./assets/images/${folder}/${base}@1x.jpg"
        alt="${product.name}"
        loading="lazy">
    </picture>
    ${
      product.salesStatus ? `<span class="${baseClass}__badge">SALE</span>` : ""
    }
  </div>
  <p class="${baseClass}__name">${product.name}</p>
  <p class="${baseClass}__price">$${product.price}</p>
  <button class="homepage-btn ${baseClass}__btn" type="button">${buttonText}</button>
`;

      list.appendChild(li);

      li.addEventListener("click", (e) => {
        if (e.target.closest(`.${baseClass}__btn`)) {
          if (buttonText === "Add To Cart") {
            return;
          }
        }
        window.location.href = `/html/product.html?id=${product.id}`;
      });

      if (buttonText === "View Product") {
        const btn = li.querySelector(`.${baseClass}__btn`);
        if (btn) {
          btn.addEventListener("click", (e) => {
            e.stopPropagation(); // ← Preventing double-click
            window.location.href = `/html/product.html?id=${product.id}`;
          });
        }
      }

      if (buttonText === "Add To Cart") {
        const btn = li.querySelector(`.${baseClass}__btn`);
        if (btn) {
          btn.addEventListener("click", (e) => {
            e.stopPropagation(); // ← does not interfere with clicking on the card
            addToCart(product);
            displayMessage(`"${product.name}" added to cart`, "success");
          });
        }
      }
    });
  } catch (err) {
    return err;
  }
}
