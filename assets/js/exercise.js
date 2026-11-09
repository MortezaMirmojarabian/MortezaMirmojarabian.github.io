/* Interactive exercises: vanilla JavaScript, no dependencies.

   An exercise is written in a post's front matter (see README.md). _includes/exercise.html
   hands it to this script as JSON, and the script builds the form inside [data-exercise-body].

   Question types (set `kind:` on the exercise, or on a single question to mix them):
     choice  multiple choice. Each option is a button-like radio; a blank (___) in the sentence fills itself in.
     fill    type the missing word(s). Case, curly quotes and extra spaces are ignored; several answers can be accepted.
     order   build a sentence by tapping the shuffled words. `answer` may be a list when more than one order is correct.
*/
(function () {
  'use strict';

  var mount = document.querySelector('[data-exercise-body]');
  var dataEl = document.getElementById('exercise-data');
  if (!mount || !dataEl) return;

  var cfg;
  try { cfg = JSON.parse(dataEl.textContent); } catch (err) { return; }
  var questions = cfg && Array.isArray(cfg.questions) ? cfg.questions : [];
  if (!questions.length) return;

  var defaultKind = cfg.kind || 'choice';
  var via = mount.getAttribute('data-via') || '';
  var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var SVG_NS = 'http://www.w3.org/2000/svg';

  /* ------------------------------------------------------------------ helpers */

  function el(tag, props, kids) {
    var node = document.createElement(tag);
    Object.keys(props || {}).forEach(function (key) {
      var value = props[key];
      if (value === false || value === null || value === undefined) return;
      if (key === 'text') node.textContent = value;
      else if (key === 'class') node.className = value;
      else node.setAttribute(key, value === true ? '' : value);
    });
    (kids || []).forEach(function (kid) {
      if (kid === null || kid === undefined) return;
      node.appendChild(typeof kid === 'string' ? document.createTextNode(kid) : kid);
    });
    return node;
  }

  function icon(id) {
    var svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', 'icon');
    svg.setAttribute('aria-hidden', 'true');
    var use = document.createElementNS(SVG_NS, 'use');
    use.setAttribute('href', '#' + id);
    svg.appendChild(use);
    return svg;
  }

  // **bold**, *italic* and `code` become real elements. Nothing is ever parsed as HTML.
  function rich(text) {
    var frag = document.createDocumentFragment();
    String(text === null || text === undefined ? '' : text)
      .split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g)
      .forEach(function (part) {
        if (!part) return;
        var m;
        if ((m = /^\*\*([^*]+)\*\*$/.exec(part))) frag.appendChild(el('strong', { text: m[1] }));
        else if ((m = /^\*([^*]+)\*$/.exec(part))) frag.appendChild(el('em', { text: m[1] }));
        else if ((m = /^`([^`]+)`$/.exec(part))) frag.appendChild(el('code', { text: m[1] }));
        else frag.appendChild(document.createTextNode(part));
      });
    return frag;
  }

  // Forgiving comparison for typed answers.
  function norm(value) {
    return String(value === null || value === undefined ? '' : value)
      .toLowerCase()
      .replace(/[‘’ʼ´`]/g, "'")
      .replace(/[“”]/g, '"')
      .replace(/\s+/g, ' ')
      .replace(/^[\s.,!?;:]+|[\s.,!?;:]+$/g, '');
  }

  function indexOfText(list, text) {
    var wanted = String(text).trim().toLowerCase();
    for (var k = 0; k < list.length; k++) {
      if (String(list[k]).trim().toLowerCase() === wanted) return k;
    }
    return -1;
  }

  function shuffle(list) {
    var out = list.slice();
    for (var k = out.length - 1; k > 0; k--) {
      var j = Math.floor(Math.random() * (k + 1));
      var tmp = out[k]; out[k] = out[j]; out[j] = tmp;
    }
    return out;
  }

  // Shuffle, but never hand the learner the sentence already solved.
  function mix(list) {
    var out = list;
    for (var tries = 0; tries < 12; tries++) {
      out = shuffle(list);
      if (list.length < 2 || out.join() !== list.join()) break;
    }
    return out;
  }

  function promptLine(i, id, parts) {
    return el('p', { class: 'ex-prompt', id: id }, [
      el('span', { class: 'ex-num', 'aria-hidden': 'true', text: String(i + 1) }),
      el('span', { class: 'ex-text' }, parts)
    ]);
  }

  function showFeedback(li, box, ok, empty, answers, explain) {
    li.classList.remove('is-correct', 'is-wrong');
    li.classList.add(ok ? 'is-correct' : 'is-wrong');
    box.textContent = '';

    var verdict = el('p', { class: 'ex-verdict' }, [icon(ok ? 'i-check' : 'i-close')]);
    if (ok) {
      verdict.appendChild(el('strong', { text: 'Correct.' }));
    } else {
      verdict.appendChild(el('strong', { text: empty ? 'No answer yet.' : 'Not quite.' }));
      verdict.appendChild(document.createTextNode(' Answer: '));
      verdict.appendChild(el('strong', { class: 'ex-answer', text: answers.join(' / ') }));
    }
    box.appendChild(verdict);
    if (explain) box.appendChild(el('p', { class: 'ex-explain' }, [rich(explain)]));
    box.hidden = false;
  }

  function hideFeedback(li, box) {
    li.classList.remove('is-correct', 'is-wrong');
    box.textContent = '';
    box.hidden = true;
  }

  /* ------------------------------------------------------------ question types */

  function buildChoice(q, i, changed) {
    var options = (q.options || []).map(String);
    var answer = typeof q.answer === 'number' ? q.answer : indexOfText(options, q.answer);
    var name = 'ex' + i;
    var split = String(q.q || '').split('___');
    var blank = null;
    var parts = [rich(split[0])];
    if (split.length > 1) {
      blank = el('span', { class: 'ex-blank' });
      parts.push(blank, rich(split.slice(1).join('___')));
    }

    var li = el('li', { class: 'ex-q', 'data-kind': 'choice' });
    var group = el('div', { class: 'ex-options', role: 'radiogroup', 'aria-labelledby': name + '-prompt' });
    var box = el('div', { class: 'ex-feedback', hidden: true });
    var inputs = [];
    var labels = [];

    function emptyBlank() {
      if (!blank) return;
      blank.textContent = '';
      blank.classList.remove('is-filled');
      blank.appendChild(el('span', { class: 'sr-only', text: 'blank' }));
    }
    function clearMarks() {
      labels.forEach(function (label) { label.classList.remove('is-answer', 'is-wrong-pick'); });
      hideFeedback(li, box);
    }
    function picked() {
      for (var k = 0; k < inputs.length; k++) if (inputs[k].checked) return k;
      return -1;
    }

    emptyBlank();
    options.forEach(function (option) {
      var k = inputs.length;
      var input = el('input', { type: 'radio', name: name, value: String(k) });
      var label = el('label', { class: 'ex-opt' }, [input, el('span', { class: 'ex-opt-ui', text: option })]);
      input.addEventListener('change', function () {
        clearMarks();
        if (blank) {
          blank.textContent = option;
          blank.classList.add('is-filled');
        }
        changed();
      });
      inputs.push(input);
      labels.push(label);
      group.appendChild(label);
    });

    li.appendChild(promptLine(i, name + '-prompt', parts));
    li.appendChild(group);
    li.appendChild(box);

    return {
      el: li,
      check: function () {
        var pick = picked();
        var ok = pick === answer;
        labels.forEach(function (label, k) {
          label.classList.toggle('is-answer', k === answer);
          label.classList.toggle('is-wrong-pick', k === pick && !ok);
        });
        showFeedback(li, box, ok, pick === -1, [options[answer] || String(q.answer)], q.explain);
        return { ok: ok, empty: pick === -1 };
      },
      reset: function () {
        inputs.forEach(function (input) { input.checked = false; });
        emptyBlank();
        clearMarks();
      }
    };
  }

  function buildFill(q, i, changed) {
    var accepted = [].concat(q.answer === undefined || q.answer === null ? [] : q.answer).map(String);
    var acceptedNorm = accepted.map(norm);
    var name = 'ex' + i;
    var split = String(q.q || '').split('___');

    var input = el('input', {
      type: 'text', class: 'ex-input', autocomplete: 'off', autocapitalize: 'off',
      autocorrect: 'off', spellcheck: 'false', 'aria-label': 'Answer for question ' + (i + 1)
    });
    var parts = [rich(split[0])];
    if (split.length > 1) parts.push(input, rich(split.slice(1).join('___')));

    var li = el('li', { class: 'ex-q', 'data-kind': 'fill' });
    var box = el('div', { class: 'ex-feedback', hidden: true });
    li.appendChild(promptLine(i, name + '-prompt', parts));
    if (split.length === 1) li.appendChild(el('div', { class: 'ex-fill-row' }, [input]));
    li.appendChild(box);

    input.addEventListener('input', function () {
      hideFeedback(li, box);
      changed();
    });

    return {
      el: li,
      check: function () {
        var given = norm(input.value);
        var ok = given !== '' && acceptedNorm.indexOf(given) !== -1;
        showFeedback(li, box, ok, given === '', accepted, q.explain);
        return { ok: ok, empty: given === '' };
      },
      reset: function () {
        input.value = '';
        hideFeedback(li, box);
      }
    };
  }

  // Word-order answers are compared without capital letters or punctuation, so a sentence that starts with a
  // different word ("We will stay..." / "If it rains...") still matches a listed alternative.
  function sentenceKey(text) {
    return norm(text).replace(/[.,!?;:"()]/g, '').replace(/\s+/g, ' ').trim();
  }

  function buildOrder(q, i, changed) {
    // `answer` is one sentence, or a list of acceptable sentences that use the same words (the first one is the model answer).
    var accepted = [].concat(q.answer === undefined || q.answer === null ? [] : q.answer)
      .map(function (a) { return String(a).trim().replace(/\s+/g, ' '); })
      .filter(function (a) { return a; });
    var answer = accepted[0] || '';
    var wanted = accepted.map(sentenceKey);
    var words = answer ? answer.split(' ') : [];
    var name = 'ex' + i;
    var order = mix(words.map(function (w, k) { return k; }));
    var placed = [];

    var li = el('li', { class: 'ex-q', 'data-kind': 'order' });
    var line = el('div', {
      class: 'ex-line', role: 'group', 'aria-label': 'Your sentence',
      'data-placeholder': 'Tap the words below to build the sentence'
    });
    var bank = el('div', { class: 'ex-bank', role: 'group', 'aria-label': 'Available words' });
    var clear = el('button', { type: 'button', class: 'ex-clear', text: 'Clear', hidden: true });
    var box = el('div', { class: 'ex-feedback', hidden: true });

    var buttons = words.map(function (word, k) {
      var button = el('button', { type: 'button', class: 'ex-token', text: word });
      button.addEventListener('click', function () {
        var at = placed.indexOf(k);
        if (at === -1) placed.push(k); else placed.splice(at, 1);
        hideFeedback(li, box);
        render();
        button.focus();
        changed();
      });
      return button;
    });

    function render() {
      placed.forEach(function (k) { line.appendChild(buttons[k]); });
      order.forEach(function (k) { if (placed.indexOf(k) === -1) bank.appendChild(buttons[k]); });
      clear.hidden = placed.length === 0;
    }

    clear.addEventListener('click', function () {
      placed = [];
      hideFeedback(li, box);
      render();
      changed();
    });

    li.appendChild(promptLine(i, name + '-prompt', [rich(q.q || 'Put the words in the correct order.')]));
    li.appendChild(line);
    li.appendChild(bank);
    li.appendChild(el('div', { class: 'ex-line-tools' }, [clear]));
    li.appendChild(box);
    render();

    return {
      el: li,
      check: function () {
        var built = placed.map(function (k) { return words[k]; }).join(' ');
        var ok = wanted.indexOf(sentenceKey(built)) !== -1;
        showFeedback(li, box, ok, placed.length === 0, accepted, q.explain);
        return { ok: ok, empty: placed.length === 0 };
      },
      reset: function () {
        placed = [];
        order = mix(words.map(function (w, k) { return k; }));
        hideFeedback(li, box);
        render();
      }
    };
  }

  /* ----------------------------------------------------------------- the form */

  var form = el('form', { class: 'ex-form', novalidate: true });
  var list = el('ol', { class: 'ex-list' });
  var result = el('div', { class: 'ex-result', role: 'status', 'aria-live': 'polite' });

  function clearResult() {
    result.textContent = '';
    result.classList.remove('is-visible');
  }

  var items = questions.map(function (q, i) {
    var kind = q.kind || defaultKind;
    var build = kind === 'fill' ? buildFill : kind === 'order' ? buildOrder : buildChoice;
    var item = build(q, i, clearResult);
    list.appendChild(item.el);
    return item;
  });

  function shareLink(score, total) {
    var heading = document.querySelector('.post-heading') || document.querySelector('h1');
    var title = ((heading && heading.textContent) || document.title).trim();
    var canonical = document.querySelector('link[rel="canonical"]');
    var url = canonical && canonical.href ? canonical.href : location.href.split('#')[0];
    var text = 'I scored ' + score + '/' + total + ' on “' + title + '”';
    return 'https://x.com/intent/post?text=' + encodeURIComponent(text) +
      '&url=' + encodeURIComponent(url) + (via ? '&via=' + encodeURIComponent(via) : '');
  }

  function showResult(score, total, blanks) {
    var ratio = score / total;
    var message =
      blanks === total ? 'Nothing answered yet. Answer each question, then check again.' :
      ratio === 1 ? 'Perfect score. Well done!' :
      ratio >= 0.75 ? 'Great job. Look at the notes on the ones you missed.' :
      ratio >= 0.5 ? 'Good effort. Read the explanations, then try again.' :
      'Keep practicing: read the explanations, then try again.';
    if (blanks > 0 && blanks < total) {
      message += ' ' + blanks + (blanks === 1 ? ' question was' : ' questions were') + ' left blank.';
    }

    result.textContent = '';
    result.classList.add('is-visible');
    result.appendChild(el('div', { class: 'ex-result-main' }, [
      el('p', { class: 'ex-score' }, [
        el('span', { class: 'sr-only', text: 'Your score: ' }),
        el('strong', { text: String(score) }),
        ' / ' + total
      ]),
      el('p', { class: 'ex-message', text: message })
    ]));
    if (blanks < total) {
      result.appendChild(el('a', {
        class: 'btn btn-primary', href: shareLink(score, total), target: '_blank', rel: 'noopener noreferrer'
      }, [icon('i-x'), el('span', { text: 'Share my score on X' }), el('span', { class: 'sr-only', text: '(opens in a new tab)' })]));
    }
    result.scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var correct = 0;
    var blanks = 0;
    items.forEach(function (item) {
      var r = item.check();
      if (r.ok) correct++;
      if (r.empty) blanks++;
    });
    showResult(correct, items.length, blanks);
  });

  var submit = el('button', { type: 'submit', class: 'btn btn-accent', text: 'Check answers' });
  var again = el('button', { type: 'button', class: 'btn btn-secondary', text: 'Start over' });
  again.addEventListener('click', function () {
    items.forEach(function (item) { item.reset(); });
    clearResult();
    form.scrollIntoView({ block: 'start', behavior: reduceMotion ? 'auto' : 'smooth' });
    var first = form.querySelector('input, .ex-token');
    if (first && first.focus) first.focus({ preventScroll: true });
  });

  form.appendChild(list);
  form.appendChild(el('div', { class: 'ex-actions' }, [submit, again]));
  form.appendChild(result);
  mount.appendChild(form);
})();
