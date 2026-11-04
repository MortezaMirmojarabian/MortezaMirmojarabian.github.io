/* ==========================================================================
   Interactive exercise engine
   Works with the markup rendered by _includes/quiz.html:

   [data-quiz]                     the exercise container
   .quiz-question[data-type]       "mcq" (default) or "gap"
   .quiz-question[data-answer]     MCQ: zero-based option index
                                   Gap: accepted answer(s), "|" separated
   [data-quiz-check] / [data-quiz-reset] / .quiz-result
   ========================================================================== */
(function () {
  'use strict';

  /* Normalize a typed answer: case, spacing, apostrophes, edge punctuation,
     and an optional leading "to" (so "to get up" matches "get up"). */
  function normalize(value) {
    var s = String(value == null ? '' : value);
    s = s.toLowerCase().trim();
    s = s.replace(/[\u2018\u2019\u02BC]/g, "'");
    s = s.replace(/\s+/g, ' ');
    s = s.replace(/^to\s+/, '');
    s = s.replace(/^[.,!?;:"']+/g, '');
    s = s.replace(/[.,!?;:"']+$/g, '');
    return s.trim();
  }

  function acceptedAnswers(question) {
    return String(question.getAttribute('data-answer') || '')
      .split('|')
      .filter(function (answer) { return answer.length > 0; });
  }

  function setStatusChip(question, correct, answered) {
    var existing = question.querySelector('.quiz-status');
    if (existing && existing.parentNode) {
      existing.parentNode.removeChild(existing);
    }

    var chip = document.createElement('span');
    chip.className = 'quiz-status';
    chip.textContent = correct ? '\u2713 Correct' : (answered ? '\u2717 Not quite' : 'Not answered');

    var prompt = question.querySelector('.quiz-prompt');
    if (prompt) { prompt.appendChild(chip); }
  }

  function revealExplanation(question) {
    var explanation = question.querySelector('.quiz-explanation');
    if (explanation) { explanation.removeAttribute('hidden'); }
  }

  function gradeQuestion(question) {
    var isGap = question.getAttribute('data-type') === 'gap';
    var correct = false;
    var answered = false;

    if (isGap) {
      var input = question.querySelector('.quiz-input');
      var given = normalize(input ? input.value : '');
      var answers = acceptedAnswers(question);

      answered = given.length > 0;
      correct = answered && answers.some(function (answer) {
        return normalize(answer) === given;
      });

      if (input) {
        input.readOnly = true;
        input.classList.remove('is-correct', 'is-wrong');
        input.classList.add(correct ? 'is-correct' : 'is-wrong');
      }
    } else {
      var answer = String(question.getAttribute('data-answer'));
      var chosen = question.querySelector('input[type="radio"]:checked');

      answered = Boolean(chosen);
      correct = Boolean(chosen) && chosen.value === answer;

      question.querySelectorAll('.quiz-option').forEach(function (label) {
        var radio = label.querySelector('input[type="radio"]');
        if (!radio) { return; }

        radio.disabled = true;
        label.classList.remove('is-correct', 'is-wrong');

        if (radio.value === answer) { label.classList.add('is-correct'); }
      });

      if (chosen && !correct) {
        var chosenLabel = chosen.closest('.quiz-option');
        if (chosenLabel) { chosenLabel.classList.add('is-wrong'); }
      }
    }

    question.classList.remove('is-correct', 'is-wrong', 'is-unanswered');
    question.classList.add(correct ? 'is-correct' : (answered ? 'is-wrong' : 'is-unanswered'));

    setStatusChip(question, correct, answered);
    revealExplanation(question);

    return correct;
  }

  document.querySelectorAll('[data-quiz]').forEach(function (quiz) {
    var checkButton = quiz.querySelector('[data-quiz-check]');
    var resetButton = quiz.querySelector('[data-quiz-reset]');
    var result = quiz.querySelector('.quiz-result');
    var questions = Array.prototype.slice.call(quiz.querySelectorAll('.quiz-question'));

    /* Size each gap input to its longest accepted answer. */
    questions.forEach(function (question) {
      if (question.getAttribute('data-type') !== 'gap') { return; }

      var input = question.querySelector('.quiz-input');
      if (!input) { return; }

      var longest = acceptedAnswers(question).reduce(function (max, answer) {
        return Math.max(max, answer.trim().length);
      }, 4);

      input.style.setProperty('--w', Math.min(longest + 2, 18) + 'ch');

      input.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
          event.preventDefault();
          if (checkButton && !checkButton.disabled) { checkButton.click(); }
        }
      });
    });

    function checkAll() {
      var score = 0;
      questions.forEach(function (question) {
        if (gradeQuestion(question)) { score += 1; }
      });

      var total = questions.length;
      var percent = Math.round((score / total) * 100);

      var tier;
      var message;
      if (percent >= 80) {
        tier = 'quiz-result--great';
        message = 'Excellent work!';
      } else if (percent >= 50) {
        tier = 'quiz-result--good';
        message = 'Good effort — read the explanations and try again.';
      } else {
        tier = 'quiz-result--low';
        message = 'Keep practicing — review the explanations, then try again.';
      }

      if (result) {
        result.className = 'quiz-result show ' + tier;
        result.innerHTML = '<strong>You scored ' + score + ' of ' + total +
          '</strong> (' + percent + '%). ' + message;
      }

      if (checkButton) { checkButton.disabled = true; }
      if (resetButton) { resetButton.removeAttribute('hidden'); }
    }

    function resetAll() {
      questions.forEach(function (question) {
        question.classList.remove('is-correct', 'is-wrong', 'is-unanswered');

        question.querySelectorAll('.quiz-option').forEach(function (label) {
          label.classList.remove('is-correct', 'is-wrong', 'is-selected');
          var radio = label.querySelector('input[type="radio"]');
          if (radio) {
            radio.disabled = false;
            radio.checked = false;
          }
        });

        var input = question.querySelector('.quiz-input');
        if (input) {
          input.readOnly = false;
          input.value = '';
          input.classList.remove('is-correct', 'is-wrong');
        }

        var chip = question.querySelector('.quiz-status');
        if (chip && chip.parentNode) { chip.parentNode.removeChild(chip); }

        var explanation = question.querySelector('.quiz-explanation');
        if (explanation) { explanation.setAttribute('hidden', ''); }
      });

      if (result) {
        result.className = 'quiz-result';
        result.textContent = '';
      }

      if (checkButton) { checkButton.disabled = false; }
      if (resetButton) { resetButton.setAttribute('hidden', ''); }
    }

    if (checkButton) { checkButton.addEventListener('click', checkAll); }
    if (resetButton) { resetButton.addEventListener('click', resetAll); }
  });
})();
