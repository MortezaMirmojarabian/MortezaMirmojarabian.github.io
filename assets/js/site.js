document.querySelectorAll("[data-exercise]").forEach((form) => {
  const feedback = form.querySelector("[data-feedback]");
  const reset = form.querySelector("[data-reset]");
  const submit = form.querySelector("[type='submit']");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const selected = form.querySelector("input[type='radio']:checked");
    if (!selected) return;

    const isCorrect = Number(selected.value) === Number(form.dataset.answerIndex);
    const answer = form.querySelector(`input[value="${form.dataset.answerIndex}"]`);
    feedback.textContent = isCorrect
      ? `That's right. ${answer?.nextElementSibling?.textContent ?? ""}`
      : `Not quite. The best answer is “${answer?.nextElementSibling?.textContent ?? ""}”. Read the explanation in the article and give it another thought.`;
    feedback.classList.toggle("is-correct", isCorrect);
    feedback.classList.toggle("is-incorrect", !isCorrect);
    feedback.hidden = false;
    reset.hidden = false;
    submit.disabled = true;
  });

  form.addEventListener("reset", () => {
    window.setTimeout(() => {
      feedback.hidden = true;
      feedback.textContent = "";
      feedback.classList.remove("is-correct", "is-incorrect");
      reset.hidden = true;
      submit.disabled = false;
    }, 0);
  });
});
