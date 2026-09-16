document.addEventListener('DOMContentLoaded', function () {
  var cartIcon = document.querySelector('.cart-dot');
  if (cartIcon) {
    cartIcon.setAttribute('data-cart-count', cartIcon.getAttribute('data-cart-count') || '0');
  }
});
