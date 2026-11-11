/* Site-wide behavior: the light / dark theme toggle and keyboard-scrollable wide tables. No dependencies.
   The theme is applied before first paint by a tiny inline script in _includes/head.html. */
(function () {
  'use strict';

  var root = document.documentElement;
  var toggle = document.querySelector('[data-theme-toggle]');
  var meta = document.querySelector('meta[name="theme-color"]');
  var KEY = 'theme';

  function stored() {
    try {
      var v = localStorage.getItem(KEY);
      return v === 'light' || v === 'dark' ? v : null;
    } catch (e) {
      return null;
    }
  }

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#09090b' : '#ffffff');
    if (toggle) {
      toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    }
  }

  // Sync the button label and browser color with whatever the head script chose.
  apply(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');

  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      apply(next);
      try { localStorage.setItem(KEY, next); } catch (e) { /* private mode: ignore */ }
    });
  }

  // Follow the operating system until the visitor makes an explicit choice.
  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var onChange = function (e) { if (!stored()) apply(e.matches ? 'dark' : 'light'); };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }
})();

/* A table wider than the screen scrolls sideways inside its .table-wrap box. While it does, give the box a tab stop
   (and a name) so keyboard users can scroll it with the arrow keys. */
(function () {
  'use strict';

  var wraps = document.querySelectorAll('.table-wrap');
  if (!wraps.length) return;

  function name(wrap) {
    var el = wrap.previousElementSibling;
    while (el && !/^H[1-6]$/.test(el.tagName)) el = el.previousElementSibling;
    return (el ? el.textContent.trim() + ': ' : '') + 'table';
  }

  function update() {
    Array.prototype.forEach.call(wraps, function (wrap) {
      if (wrap.scrollWidth > wrap.clientWidth + 1) {
        wrap.setAttribute('tabindex', '0');
        wrap.setAttribute('role', 'region');
        wrap.setAttribute('aria-label', name(wrap));
      } else {
        wrap.removeAttribute('tabindex');
        wrap.removeAttribute('role');
        wrap.removeAttribute('aria-label');
      }
    });
  }

  update();
  window.addEventListener('resize', update);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(update);
})();
