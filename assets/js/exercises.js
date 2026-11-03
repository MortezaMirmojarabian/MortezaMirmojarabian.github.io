(() => {
  document.querySelectorAll('[data-quiz]').forEach((quiz) => {
    const form = quiz.querySelector('form');
    const result = quiz.querySelector('[data-quiz-result]');
    if (!form || !result) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const questions = Array.from(form.querySelectorAll('[data-correct]'));
      let score = 0;
      let unanswered = 0;

      questions.forEach((question) => {
        const selected = question.querySelector('input[type="radio"]:checked');
        const feedback = question.querySelector('[data-question-feedback]');
        const correct = question.dataset.correct;
        question.classList.remove('is-correct', 'is-incorrect', 'is-unanswered');

        if (!selected) {
          unanswered += 1;
          question.classList.add('is-unanswered');
          if (feedback) feedback.textContent = `Choose an answer. ${question.dataset.explanation || ''}`.trim();
        } else if (selected.value === correct) {
          score += 1;
          question.classList.add('is-correct');
          if (feedback) feedback.textContent = `Correct. ${question.dataset.explanation || ''}`.trim();
        } else {
          question.classList.add('is-incorrect');
          if (feedback) feedback.textContent = `Not quite. The correct answer is ${correct.toUpperCase()}. ${question.dataset.explanation || ''}`.trim();
        }
      });

      result.textContent = `You got ${score} out of ${questions.length} correct.${unanswered ? ` ${unanswered} question${unanswered === 1 ? ' is' : 's are'} unanswered.` : ''}`;
      result.classList.add('is-visible');
      result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    const reset = quiz.querySelector('[data-quiz-reset]');
    if (reset) {
      reset.addEventListener('click', () => {
        form.reset();
        form.querySelectorAll('[data-correct]').forEach((question) => {
          question.classList.remove('is-correct', 'is-incorrect', 'is-unanswered');
          const feedback = question.querySelector('[data-question-feedback]');
          if (feedback) feedback.textContent = '';
        });
        result.textContent = '';
        result.classList.remove('is-visible');
      });
    }
  });
})();
