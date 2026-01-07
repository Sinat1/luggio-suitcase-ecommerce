import { renderProductSection } from "./render-section.js";

document.addEventListener("DOMContentLoaded", () => {
  renderProductSection(
    "Selected Products",
    ".selected-products__list",
    "Add To Cart"
  );
  renderProductSection(
    "New Products Arrival",
    ".new-products-arrival__list",
    "View Product"
  );
});
