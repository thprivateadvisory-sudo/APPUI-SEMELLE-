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

  // Viewer count — social urgency on product page
  var viewerEl = document.getElementById('viewer-count');
  var viewerText = document.getElementById('viewer-count-text');
  if (viewerEl && viewerText) {
    var viewerCount = Math.floor(Math.random() * 14) + 8; // 8–21
    function updateViewer() {
      viewerText.textContent = viewerCount + ' personnes regardent ce produit en ce moment';
    }
    updateViewer();
    setInterval(function () {
      var delta = Math.random() < 0.5 ? 1 : -1;
      viewerCount = Math.max(5, Math.min(28, viewerCount + delta));
      viewerEl.classList.add('viewer-count--update');
      setTimeout(function () {
        updateViewer();
        viewerEl.classList.remove('viewer-count--update');
      }, 200);
    }, Math.floor(Math.random() * 12000) + 14000); // toutes les 14–26s
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
