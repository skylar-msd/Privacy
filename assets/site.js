(function () {
  var root = document.documentElement;

  /* tema: siempre claro por defecto; el modo oscuro solo se activa con el botón */
  var btn = document.getElementById('tema');
  if (btn) {
    btn.addEventListener('click', function () {
      var dark = root.getAttribute('data-theme') === 'dark';
      var next = dark ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('tema', next); } catch (e) {}
    });
  }

  /* al ir a una sección, centrarla en pantalla (si cabe); si es más alta, dejarla bajo la barra */
  function go(id, smooth) {
    var el = document.getElementById(id);
    if (!el) return;
    var nav = document.querySelector('.top');
    var navH = nav ? nav.offsetHeight : 0;
    var r = el.getBoundingClientRect();
    var cs = getComputedStyle(el);
    var pt = parseFloat(cs.paddingTop) || 0, pb = parseFloat(cs.paddingBottom) || 0;
    var h = r.height - pt - pb;               /* altura del contenido, sin el relleno */
    var top = r.top + window.scrollY + pt;    /* inicio del contenido */
    var avail = window.innerHeight - navH;
    var y = h < avail
      ? top - navH - (avail - h) / 2
      : top - navH - 24;
    var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: Math.max(0, y), behavior: smooth && !reduce ? 'smooth' : 'auto' });
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href*="#"]');
    if (!a) return;
    var u = new URL(a.href, location.href);
    if (u.pathname.replace(/\/$/, '') !== location.pathname.replace(/\/$/, '') || !u.hash) return;
    var id = decodeURIComponent(u.hash.slice(1));
    if (!document.getElementById(id)) return;
    e.preventDefault();
    history.pushState(null, '', u.hash);
    go(id, true);
  });

  if (location.hash.length > 1) {
    var id = decodeURIComponent(location.hash.slice(1));
    window.addEventListener('load', function () { setTimeout(function () { go(id, false); }, 60); });
  }

  var y = document.getElementById('y');
  if (y) y.textContent = new Date().getFullYear();
})();
