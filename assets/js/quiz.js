/* Interactive exercise engine: click an option → instant feedback. */
(function () {
  document.querySelectorAll(".quiz").forEach(function (quiz) {
    var options = quiz.querySelectorAll(".quiz-option");
    var feedback = quiz.querySelector(".quiz-feedback");
    var answered = false;

    options.forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (answered) return;
        answered = true;

        var correct = quiz.querySelector('.quiz-option[data-correct="true"]');
        var isRight = btn.hasAttribute("data-correct");
        options.forEach(function (o) { o.disabled = true; });
        if (correct) correct.classList.add("correct");
        if (!isRight) btn.classList.add("wrong");

        if (feedback) {
          var explain = quiz.getAttribute("data-explain") || "";
          feedback.innerHTML =
            (isRight ? '<span class="ok">Correct!</span> ' : '<span class="no">Not quite.</span> ') +
            (explain ? "<span>" + explain + "</span>" : "");
        }
      });
    });
  });
})();