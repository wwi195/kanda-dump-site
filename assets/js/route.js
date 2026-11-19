// 現在地ルート：スクロール量に合わせてトラックを進め、通過したセクションの点を点灯する
(function () {
  var route = document.querySelector('[data-route]');
  if (!route) return;
  var header = document.querySelector('[data-header]');
  var stops = Array.prototype.slice.call(route.querySelectorAll('[data-stop]'));
  var darkSections = document.querySelectorAll('.hero, .section--contact, .site-footer');
  var fractions = [];
  var ticking = false;
  var moveTimer = null;

  function maxScroll() {
    return Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  }

  function measure() {
    if (header) document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
    var max = maxScroll();
    fractions = stops.map(function (stop) {
      var target = document.getElementById(stop.dataset.stop);
      // セクションの少し手前（ヘッダー分）で到着扱いにする
      var top = target ? Math.max(0, target.offsetTop - 88) : 0;
      var f = Math.min(1, top / max);
      stop.style.setProperty('--at', f.toFixed(4));
      return f;
    });
    update();
  }

  function isOverDark() {
    var probeY = window.innerHeight * 0.5;
    for (var i = 0; i < darkSections.length; i++) {
      var r = darkSections[i].getBoundingClientRect();
      if (r.top <= probeY && r.bottom >= probeY) return true;
    }
    return false;
  }

  function update() {
    ticking = false;
    var p = Math.min(1, Math.max(0, window.scrollY / maxScroll()));
    route.style.setProperty('--p', p.toFixed(4));
    var current = 0;
    fractions.forEach(function (f, i) { if (p + 0.002 >= f) current = i; });
    stops.forEach(function (stop, i) {
      stop.classList.toggle('is-passed', i <= current);
      stop.classList.toggle('is-current', i === current);
      if (i === current) stop.setAttribute('aria-current', 'location');
      else stop.removeAttribute('aria-current');
    });
    route.classList.toggle('on-dark', isOverDark());
  }

  function onScroll() {
    route.classList.add('is-moving');
    clearTimeout(moveTimer);
    moveTimer = setTimeout(function () { route.classList.remove('is-moving'); }, 160);
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', measure);
  window.addEventListener('load', measure);
  measure();
})();

// 最初の画面の一連の動きを開始
(function () {
  function start() { document.documentElement.classList.add('is-loaded'); }
  requestAnimationFrame(function () { requestAnimationFrame(start); });
})();
