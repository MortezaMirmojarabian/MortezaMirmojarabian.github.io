/* Main scripts: navigation highlighting + quiz engine. */
(function () {
  "use strict";

  /* ----- Nav current-page highlighting ----- */

  var here = window.location.pathname.replace(/index\.html$/, "");

  document.querySelectorAll(".site-nav a").forEach(function (link) {
    var href = (link.getAttribute("href") || "").replace(/index\.html$/, "");
    if (!href) return;

    var isCurrent =
      href === "/" ? here === "/" : here === href || here.indexOf(href) === 0;

    if (isCurrent) link.setAttribute("aria-current", "page");
  });

  /* ----- Quiz engine ----- */

  document.querySelectorAll("[data-quiz]").forEach(function (quiz) {
    var items = Array.prototype.slice.call(
      quiz.querySelectorAll(".quiz-item")
    );
    if (!items.length) return;

    var score = document.createElement("p");
    score.className = "quiz-score";
    score.setAttribute("role", "status");
    quiz.appendChild(score);

    var actions = document.createElement("div");
    actions.className = "quiz-actions";

    var check = document.createElement("button");
    check.type = "button";
    check.className = "btn btn-primary btn-sm";
    check.textContent = "Check answers";

    var retry = document.createElement("button");
    retry.type = "button";
    retry.className = "btn btn-ghost btn-sm";
    retry.textContent = "Try again";
    retry.hidden = true;

    actions.appendChild(check);
    actions.appendChild(retry);
    quiz.appendChild(actions);

    function answeredAll() {
      return items.every(function (item) {
        return item.querySelector("input[type='radio']:checked");
      });
    }

    check.addEventListener("click", function () {
      if (!answeredAll()) {
        score.style.display = "block";
        score.textContent = "Please answer all the questions first.";
        return;
      }

      var correct = 0;

      items.forEach(function (item) {
        var answer = item.getAttribute("data-answer");

        item.querySelectorAll(".quiz-option").forEach(function (option) {
          var input = option.querySelector("input[type='radio']");
          option.classList.remove("is-correct", "is-wrong");

          if (input.value === answer) {
            option.classList.add("is-correct");
          }
          if (input.checked) {
            if (input.value === answer) {
              correct += 1;
            } else {
              option.classList.add("is-wrong");
            }
          }
          input.disabled = true;
        });
      });

      quiz.classList.add("is-graded");
      score.style.display = "block";
      score.textContent =
        "You scored " + correct + " out of " + items.length + "." +
        (correct === items.length ? " Perfect!" : "");

      check.hidden = true;
      retry.hidden = false;
    });

    retry.addEventListener("click", function () {
      items.forEach(function (item) {
        item.querySelectorAll(".quiz-option").forEach(function (option) {
          option.classList.remove("is-correct", "is-wrong");
        });
        item.querySelectorAll("input[type='radio']").forEach(function (input) {
          input.checked = false;
          input.disabled = false;
        });
      });

      quiz.classList.remove("is-graded");
      score.style.display = "";
      score.textContent = "";

      retry.hidden = true;
      check.hidden = false;
    });
  });
})();
