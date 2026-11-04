/* Site behavior: sticky-header shadow + selection fallback for older browsers. */
(function () {
  'use strict';

  var header = document.querySelector('.site-header');

  if (header) {
    var updateHeader = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 4);
    };
    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();
  }

  // Highlight the chosen quiz option for browsers without CSS :has().
  document.querySelectorAll('[data-quiz]').forEach(function (quiz) {
    quiz.addEventListener('change', function (event) {
      var target = event.target;
      if (!target || target.type !== 'radio') { return; }

      var group = target.closest('.quiz-options');
      if (!group) { return; }

      group.querySelectorAll('.quiz-option').forEach(function (label) {
        label.classList.remove('is-selected');
      });

      var label = target.closest('.quiz-option');
      if (label) { label.classList.add('is-selected'); }
    });
  });
})();
