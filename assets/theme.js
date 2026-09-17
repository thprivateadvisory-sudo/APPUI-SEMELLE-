document.addEventListener('DOMContentLoaded', function () {
  // Cart count badge
  var cartIcon = document.querySelector('.cart-dot');
  if (cartIcon) {
    cartIcon.setAttribute('data-cart-count', cartIcon.getAttribute('data-cart-count') || '0');
  }

  // Sticky add-to-cart
  var mainBtn  = document.getElementById('atc-main-btn');
  var stickyBar = document.getElementById('sticky-atc');
  if (mainBtn && stickyBar) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var visible = !entry.isIntersecting;
        stickyBar.classList.toggle('visible', visible);
        stickyBar.setAttribute('aria-hidden', String(!visible));
      });
    }, { threshold: 0.1 });
    observer.observe(mainBtn);
  }

  // Announcement bar — rotating messages
  var topbar = document.querySelector('.topbar');
  if (topbar) {
    var raw = topbar.getAttribute('data-messages');
    if (raw) {
      var msgs;
      try { msgs = JSON.parse(raw); } catch (e) { msgs = null; }
      var textEl = topbar.querySelector('.topbar-text');
      if (msgs && msgs.length > 1 && textEl) {
        var idx = 0;
        setInterval(function () {
          textEl.classList.add('fade');
          setTimeout(function () {
            idx = (idx + 1) % msgs.length;
            textEl.textContent = msgs[idx];
            textEl.classList.remove('fade');
          }, 350);
        }, 3800);
      }
    }
  }

  // ── Mini-cart drawer ────────────────────────────────
  var cartDrawer     = document.getElementById('cart-drawer');
  var cartOverlay    = document.getElementById('cart-drawer-overlay');
  var drawerItems    = document.getElementById('cart-drawer-items');
  var drawerTotalEl  = document.getElementById('drawer-total');
  var drawerCloseBtn = document.getElementById('cart-drawer-close');

  function moneyFR(cents) {
    return (cents / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
  }

  function updateCartBadge(count) {
    var badge = document.querySelector('.cart-dot');
    if (badge) badge.setAttribute('data-cart-count', count);
  }

  function renderDrawer(cart) {
    if (!drawerItems || !drawerTotalEl) return;
    updateCartBadge(cart.item_count);
    drawerTotalEl.textContent = moneyFR(cart.total_price);
    if (!cart.items.length) {
      drawerItems.innerHTML = '<p class="drawer-empty">Votre panier est vide.</p>';
      return;
    }
    drawerItems.innerHTML = cart.items.map(function (item) {
      var imgSrc = item.image ? item.image.replace(/(\.\w+)(\?|$)/, '_120x120$1$2') : '';
      var variant = (item.variant_title && item.variant_title !== 'Default Title')
        ? '<span class="drawer-item-variant">' + item.variant_title + '</span>' : '';
      return '<div class="drawer-item">' +
        (imgSrc ? '<img src="' + imgSrc + '" alt="" class="drawer-item-img" loading="lazy">' : '<div class="drawer-item-img drawer-item-img--ph"></div>') +
        '<div class="drawer-item-info"><strong>' + item.product_title + '</strong>' + variant +
        '<span class="drawer-item-qty">Qté : ' + item.quantity + '</span></div>' +
        '<span class="drawer-item-price">' + moneyFR(item.final_line_price) + '</span>' +
        '</div>';
    }).join('');
  }

  function openCartDrawer() {
    if (!cartDrawer) return;
    cartDrawer.classList.add('open');
    if (cartOverlay) cartOverlay.classList.add('open');
    cartDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (drawerCloseBtn) setTimeout(function () { drawerCloseBtn.focus(); }, 60);
  }

  function closeCartDrawer() {
    if (!cartDrawer) return;
    cartDrawer.classList.remove('open');
    if (cartOverlay) cartOverlay.classList.remove('open');
    cartDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (cartOverlay) cartOverlay.addEventListener('click', closeCartDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeCartDrawer);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && cartDrawer && cartDrawer.classList.contains('open')) closeCartDrawer();
  });

  // Intercept ATC form submit
  var productForm = document.getElementById('product-form');
  if (productForm && cartDrawer) {
    productForm.addEventListener('submit', function (e) {
      var sub = e.submitter;
      if (sub && (sub.name === 'checkout' || sub.closest('.shopify-payment-button'))) return;
      e.preventDefault();
      var atcBtn = document.getElementById('atc-main-btn');
      var origHTML = atcBtn ? atcBtn.innerHTML : null;
      if (atcBtn) { atcBtn.disabled = true; atcBtn.textContent = '…'; }
      fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        body: new URLSearchParams(new FormData(productForm))
      })
      .then(function () { return fetch('/cart.js', { headers: { 'X-Requested-With': 'XMLHttpRequest' } }); })
      .then(function (r) { return r.json(); })
      .then(function (cart) {
        renderDrawer(cart);
        openCartDrawer();
        if (atcBtn && origHTML) { atcBtn.disabled = false; atcBtn.innerHTML = origHTML; }
      })
      .catch(function () { productForm.submit(); });
    });
  }

  // Open drawer from cart icon
  var cartIconLink = document.querySelector('a.cart-dot');
  if (cartIconLink && cartDrawer) {
    cartIconLink.addEventListener('click', function (e) {
      e.preventDefault();
      fetch('/cart.js', { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
        .then(function (r) { return r.json(); })
        .then(function (cart) { renderDrawer(cart); openCartDrawer(); })
        .catch(function () { window.location.href = cartIconLink.href; });
    });
  }

  // Thumbnail image switcher on product page
  var thumbs = document.querySelectorAll('.product-thumbs img');
  var mainImg = document.querySelector('.product-page-media > img');
  if (thumbs.length && mainImg) {
    thumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        mainImg.src = this.src.replace('width=160', 'width=900');
        mainImg.alt = this.alt;
        thumbs.forEach(function (t) { t.style.borderColor = ''; });
        this.style.borderColor = 'var(--accent)';
      });
    });
  }
});
