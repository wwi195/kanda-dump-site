(function () {
  var header = document.querySelector('[data-header]');
  var navToggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('site-nav');

  function updateHeaderState() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 10);
  }

  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
})();
