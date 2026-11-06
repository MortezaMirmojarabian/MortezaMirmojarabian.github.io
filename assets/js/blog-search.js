/* Blog search: a search box, an Articles / Exercises filter and topic chips on the Blog page.
   No dependencies. It reads /search.json (built from your posts) the first time a visitor searches or picks a topic.

   The address always reflects the choice, so a result is a link you can share or bookmark:
     /blog/?topic=present-perfect         every post tagged "present perfect"
     /blog/?q=present+perfect             search words
     /blog/?topic=grammar&type=exercise   combine them (type is "article" or "exercise")
   The topic links on each post page use the same addresses. */
(function () {
  'use strict';

  var tools = document.querySelector('[data-blog-tools]');
  var results = document.querySelector('[data-blog-results]');
  var stock = document.querySelector('[data-blog-default]');     // the normal, paginated list
  if (!tools || !results || !stock) return;
  if (!window.fetch || !window.Promise || !window.URLSearchParams) { tools.hidden = true; return; }

  var form = tools.querySelector('form');
  var input = tools.querySelector('.search-input');
  var typeChips = [].slice.call(tools.querySelectorAll('[data-type]'));
  var topicBox = tools.querySelector('[data-topics]');
  var topicChips = topicBox ? [].slice.call(topicBox.querySelectorAll('[data-topic]')) : [];
  var statusEl = results.querySelector('[data-status]');
  var listEl = results.querySelector('[data-results]');
  var moreBtn = results.querySelector('[data-more]');
  var clearBtn = results.querySelector('[data-clear]');

  var PAGE = 10;            // results shown at a time
  var SHOW_TOPICS = 8;      // topic chips shown before "More topics"
  var DELAY = 180;          // ms to wait after typing

  var state = { q: '', topic: '', type: '' };
  var shown = PAGE;
  var matches = [];
  var index = null;
  var loading = null;
  var ticket = 0;
  var timer = 0;
  var topicMore = null;
  var collapsed = true;

  /* ---------------------------------------------------------------- text */

  // Lower-case, no accents, no punctuation: "Café" and "cafe", "don't" and "dont" match.
  var NON_WORD, MARKS;
  try {
    NON_WORD = new RegExp('[^\\p{L}\\p{N}]+', 'gu');
    MARKS = new RegExp('\\p{M}+', 'gu');
  } catch (e) {
    NON_WORD = new RegExp('[^a-z0-9' + String.fromCharCode(192) + '-' + String.fromCharCode(65535) + ']+', 'g');
    MARKS = null;
  }
  var APOSTROPHES = /['‘’ʼ´`]/g;

  function norm(s) {
    s = String(s === null || s === undefined ? '' : s).toLowerCase();
    if (s.normalize) s = s.normalize('NFD');
    if (MARKS) s = s.replace(MARKS, '');
    return s.replace(APOSTROPHES, '').replace(NON_WORD, ' ').replace(/\s+/g, ' ').trim();
  }

  // The post text in the index still has HTML entities (&ldquo; and so on). A textarea turns them back into
  // characters and never runs anything.
  var decoder = document.createElement('textarea');
  function decode(s) {
    s = String(s || '');
    if (s.indexOf('&') === -1) return s;
    decoder.innerHTML = s;
    return decoder.value;
  }

  function plural(n, word) { return n + ' ' + word + (n === 1 ? '' : 's'); }

  /* --------------------------------------------------------------- index */

  function prepare(row) {
    // every field starts with a space, so " pres" finds words that BEGIN with "pres"
    return {
      row: row,
      title: ' ' + norm(row.title),
      tags: ' ' + norm((row.tags || []).join(' ')),
      desc: ' ' + norm(row.desc),
      meta: ' ' + norm(row.type + ' ' + (row.level ? 'level ' + row.level : '')),
      body: ' ' + norm(decode(row.text)),
      slugs: row.slugs ? String(row.slugs).split('|') : []
    };
  }

  function loadIndex() {
    if (index) return Promise.resolve(index);
    if (loading) return loading;
    loading = fetch(tools.getAttribute('data-index'), { credentials: 'same-origin' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (rows) { index = rows.map(prepare); return index; })
      .catch(function (e) { loading = null; throw e; });
    return loading;
  }

  /* -------------------------------------------------------------- search */

  // Where a word is found decides how much it counts: title, then topics, then the description, then the text.
  var FIELDS = [['title', 10], ['tags', 8], ['desc', 4], ['meta', 3], ['body', 1]];
  var PHRASE = { title: 20, tags: 16, desc: 8, body: 3 };      // bonus when the words appear together, in order

  function words(q) {
    return norm(q).split(' ').filter(Boolean).slice(0, 8).map(function (w) {
      var forms = [w];
      if (w.length > 3 && w.charAt(w.length - 1) === 's') forms.push(w.slice(0, -1));   // "tenses" also finds "tense"
      return forms;
    });
  }

  function wordScore(item, forms) {
    var best = 0;
    for (var f = 0; f < FIELDS.length; f++) {
      var hay = item[FIELDS[f][0]];
      for (var i = 0; i < forms.length; i++) {
        if (hay.indexOf(' ' + forms[i]) !== -1) { if (FIELDS[f][1] > best) best = FIELDS[f][1]; break; }
      }
    }
    return best;
  }

  function search() {
    var parts = words(state.q);
    var phrase = parts.length > 1 ? ' ' + norm(state.q) : '';
    var found = [];
    for (var n = 0; n < index.length; n++) {
      var item = index[n];
      if (state.type && item.row.type !== state.type) continue;
      if (state.topic && item.slugs.indexOf(state.topic) === -1) continue;
      var score = 0;
      var ok = true;
      for (var w = 0; w < parts.length; w++) {      // every word has to be found somewhere
        var s = wordScore(item, parts[w]);
        if (!s) { ok = false; break; }
        score += s;
      }
      if (!ok) continue;
      if (phrase) for (var key in PHRASE) if (item[key].indexOf(phrase) !== -1) score += PHRASE[key];
      found.push({ row: item.row, score: score });
    }
    found.sort(function (a, b) {
      return b.score - a.score || (a.row.date < b.row.date ? 1 : a.row.date > b.row.date ? -1 : 0);   // then newest first
    });
    return found.map(function (f) { return f.row; });
  }

  /* ------------------------------------------------------------- results */

  function topicName(slug) {
    for (var i = 0; i < topicChips.length; i++) {
      if (topicChips[i].getAttribute('data-topic') === slug) return topicChips[i].getAttribute('data-name');
    }
    return slug.replace(/-/g, ' ');
  }

  function summary(n) {
    var noun = state.type === 'article' ? 'article' : state.type === 'exercise' ? 'exercise' : 'post';
    var q = state.q.trim();
    var topic = state.topic ? topicName(state.topic) : '';
    var what = (q ? ' matching “' + q + '”' : '') + (topic ? (q ? ' in ' : ' on ') + '“' + topic + '”' : '');
    if (n === 0) return 'No ' + noun + 's found' + what + '.' + (q ? ' Try other words, or pick a topic.' : '');
    return plural(n, noun) + what;
  }

  function render() {
    var html = '';
    matches.slice(0, shown).forEach(function (row) { html += row.card; });
    listEl.innerHTML = html;          // the cards were written by this site's own templates when it was built
    var left = matches.length - shown;
    moreBtn.hidden = left <= 0;
    if (left > 0) moreBtn.textContent = 'Show more (' + left + ' left)';
    statusEl.textContent = summary(matches.length);
  }

  function showStock() {
    results.hidden = true;
    stock.hidden = false;
    listEl.textContent = '';
    statusEl.textContent = '';
  }

  function update() {
    syncControls();
    var active = !!(state.q.trim() || state.topic || state.type);
    var mine = ++ticket;
    if (!active) { showStock(); return; }
    stock.hidden = true;
    results.hidden = false;
    if (!index) { moreBtn.hidden = true; statusEl.textContent = 'Searching…'; }
    loadIndex().then(function () {
      if (mine !== ticket) return;              // the visitor has already changed the search
      matches = search();
      shown = PAGE;
      render();
    }, function () {
      if (mine !== ticket) return;
      listEl.textContent = '';
      moreBtn.hidden = true;
      stock.hidden = false;                     // fall back to the normal list
      statusEl.textContent = 'Search isn’t available right now. You can still browse all the posts below.';
    });
  }

  /* ---------------------------------------------- controls and the address */

  function writeUrl() {
    var p = new URLSearchParams();
    if (state.q.trim()) p.set('q', state.q.trim());
    if (state.topic) p.set('topic', state.topic);
    if (state.type) p.set('type', state.type);
    var qs = p.toString();
    try { history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + location.hash); } catch (e) { /* file:// and the like */ }
  }

  function readUrl() {
    var p = new URLSearchParams(location.search);
    var type = p.get('type');
    state.q = (p.get('q') || '').slice(0, 100);
    state.topic = (p.get('topic') || '').toLowerCase();
    state.type = type === 'article' || type === 'exercise' ? type : '';
  }

  function applyCollapse() {
    if (!topicMore) return;
    topicChips.forEach(function (chip, i) {
      chip.hidden = collapsed && i >= SHOW_TOPICS && chip.getAttribute('data-topic') !== state.topic;
    });
    topicMore.textContent = collapsed ? 'More topics (' + (topicChips.length - SHOW_TOPICS) + ')' : 'Fewer topics';
    topicMore.setAttribute('aria-expanded', String(!collapsed));
  }

  function syncControls() {
    typeChips.forEach(function (chip) {
      chip.setAttribute('aria-pressed', String(chip.getAttribute('data-type') === state.type));
    });
    topicChips.forEach(function (chip) {
      chip.setAttribute('aria-pressed', String(chip.getAttribute('data-topic') === state.topic));
    });
    if (input.value !== state.q) input.value = state.q;
    applyCollapse();
  }

  function change() { update(); writeUrl(); }

  // Most-used topics first. Spellings that differ only in capitals ("Grammar" / "grammar") become one chip.
  function setupTopics() {
    if (!topicBox) return;
    var seen = {};
    topicChips = topicChips.filter(function (chip) {
      var slug = chip.getAttribute('data-topic');
      var first = seen[slug];
      if (!first) { seen[slug] = chip; return true; }
      var total = +first.getAttribute('data-count') + (+chip.getAttribute('data-count'));
      first.setAttribute('data-count', String(total));
      first.querySelector('.chip-count').textContent = String(total);
      chip.parentNode.removeChild(chip);
      return false;
    });
    topicChips.sort(function (a, b) {
      return (+b.getAttribute('data-count')) - (+a.getAttribute('data-count')) ||
        a.getAttribute('data-name').toLowerCase().localeCompare(b.getAttribute('data-name').toLowerCase());
    });
    topicChips.forEach(function (chip) { topicBox.appendChild(chip); });
    if (topicChips.length > SHOW_TOPICS + 2) {
      topicMore = document.createElement('button');
      topicMore.type = 'button';
      topicMore.className = 'chip chip-more';
      topicMore.addEventListener('click', function () { collapsed = !collapsed; applyCollapse(); });
      topicBox.appendChild(topicMore);
    } else {
      collapsed = false;
    }
  }

  /* --------------------------------------------------------------- start */

  setupTopics();

  input.addEventListener('focus', function () { loadIndex().catch(function () {}); });      // get ready while they type
  input.addEventListener('input', function () {
    state.q = input.value;
    clearTimeout(timer);
    timer = setTimeout(change, DELAY);
  });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && input.value) {
      e.preventDefault();
      clearTimeout(timer);
      state.q = '';
      change();
    }
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearTimeout(timer);
    state.q = input.value;
    change();
    if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) input.blur();   // close the phone keyboard
  });

  typeChips.forEach(function (chip) {
    chip.addEventListener('click', function () { state.type = chip.getAttribute('data-type'); change(); });
  });
  topicChips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var slug = chip.getAttribute('data-topic');
      state.topic = state.topic === slug ? '' : slug;       // a second click on the chosen topic clears it
      change();
    });
  });
  moreBtn.addEventListener('click', function () { shown += PAGE; render(); });
  clearBtn.addEventListener('click', function () {
    state.q = '';
    state.topic = '';
    state.type = '';
    change();
    input.focus();
  });

  readUrl();
  update();
})();
