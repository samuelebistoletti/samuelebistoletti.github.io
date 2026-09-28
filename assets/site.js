(function () {
  var root = document.documentElement;
  var isIt = (root.getAttribute('lang') || '').indexOf('it') === 0;
  var t = isIt
    ? { copied: 'Copiato negli appunti', open: 'Apri menu', close: 'Chiudi menu' }
    : { copied: 'Copied to clipboard', open: 'Open menu', close: 'Close menu' };

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Sticky header border once the page scrolls
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Reveal-on-scroll (.js is set in <head> so hidden state never flashes)
  var reveals = document.querySelectorAll('.reveal');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Copy buttons: copy data-copy to the clipboard; mailto links still open natively via href
  var live = document.createElement('div');
  live.className = 'sr-only';
  live.setAttribute('role', 'status');
  live.setAttribute('aria-live', 'polite');
  document.body.appendChild(live);

  document.querySelectorAll('.copy-btn').forEach(function (el) {
    el.addEventListener('click', function () {
      var value = el.getAttribute('data-copy');
      if (!value || !navigator.clipboard || !navigator.clipboard.writeText) return;
      navigator.clipboard.writeText(value).then(function () {
        el.classList.add('is-copied');
        live.textContent = t.copied + ': ' + value;
        setTimeout(function () {
          el.classList.remove('is-copied');
          live.textContent = '';
        }, 2000);
      }).catch(function () {});
    });
  });

  // Mobile menu toggle
  var navToggle = document.querySelector('.nav-toggle');
  var primaryNav = document.getElementById('primary-nav');
  if (navToggle && primaryNav) {
    var setNavOpen = function (open) {
      primaryNav.classList.toggle('is-open', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navToggle.setAttribute('aria-label', open ? t.close : t.open);
    };
    navToggle.addEventListener('click', function () {
      setNavOpen(!primaryNav.classList.contains('is-open'));
    });
    primaryNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setNavOpen(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && primaryNav.classList.contains('is-open')) {
        setNavOpen(false);
        navToggle.focus();
      }
    });
  }
})();
