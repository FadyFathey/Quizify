// JavaScript for Mobile Menu
// Get menu elements
const openMenuBtn = document.getElementById("openMenu");
const closeMenuBtn = document.getElementById("closeMenu");
const mobileMenu = document.getElementById("mobileMenu");
const mobileMenuLinks = document.querySelectorAll(".mobile-menu ul li a");

// Open menu function
openMenuBtn.addEventListener("click", function () {
  mobileMenu.classList.add("active");
  document.body.style.overflow = "hidden"; // Prevent scrolling when menu is open
});

// Close menu function
closeMenuBtn.addEventListener("click", function () {
  mobileMenu.classList.remove("active");
  document.body.style.overflow = ""; // Restore scrolling
});

// Close menu when clicking on a menu item
mobileMenuLinks.forEach((link) => {
  link.addEventListener("click", function () {
    mobileMenu.classList.remove("active");
    document.body.style.overflow = ""; // Restore scrolling
  });
});
// custom alert
// Add this function to your JS
function showAlert(type, message) {
  const alertContainer = document.getElementById("alertContainer");
  const alertBox = document.getElementById("alertBox");

  // Reset classes and add the new type
  alertBox.className = "alert";
  alertBox.classList.add("alert-" + type);

  // Set icon based on type
  let icon = "";
  switch (type) {
    case "success":
      icon = "✓";
      break;
    case "error":
      icon = "✗";
      break;
    case "warning":
      icon = "⚠";
      break;
    case "info":
      icon = "ℹ";
      break;
    default:
      icon = "ℹ";
  }

  alertBox.innerHTML = `
      <div class="alert-icon">${icon}</div>
      <div class="alert-message">${message}</div>
  `;

  // Show the alert
  alertContainer.style.display = "block";

  // Hide the alert after 2 seconds
  setTimeout(() => {
    alertContainer.style.display = "none";
  }, 2000);
}

// ===== QUIZ APPLICATION MAIN LOGIC =====

// DOM element references
let questionsNumDiv = document.querySelector("#questionsNum");
let currentQuestionIndexSpan = document.querySelector(
  "#currentQuestionIndexSpan"
);
let questionTitle = document.querySelector("#question-title");
let nextBtn = document.querySelector(".next");
let previousBtn = document.querySelector(".previous");

const option1 = document.querySelector("#option-1");
const option2 = document.querySelector("#option-2");
const option3 = document.querySelector("#option-3");
const option4 = document.querySelector("#option-4");
let progress = document.querySelector(".progress");

// State management variables
let currentQuestionIndex = 0;
let selectedValue = "";
let userSelectedAnswers = [];
let correctAnswersArr = [];

/**
 * Sanitizes string to prevent XSS attacks
 * @param {string} str - Input string to be escaped
 * @return {string} Escaped HTML string
 */
function escapeHTML(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Displays temporary alert notification
 * @param {string} type - Alert type (success, warning, error)
 * @param {string} message - Alert message to display
 */
function showAlert(type, message) {
  const alertContainer = document.getElementById("alertContainer");
  const alertBox = document.getElementById("alertBox");

  alertBox.className = `alert alert-${type}`;
  alertBox.querySelector(".alert-message").textContent = message;

  alertContainer.style.display = "block";

  // Auto-hide the alert after 2 seconds
  setTimeout(() => {
    alertContainer.style.display = "none";
  }, 2000);
}

// Fetch questions data from JSON file
axios
  .get("html_questions.json")
  .then((response) => {
    const questions = response.data;
    let questionsNum = questions.length;

    // Extract correct answers
    questions.forEach((q) => correctAnswersArr.push(q.right_answer));

    // Initialize quiz UI
    questionsNumDiv.innerHTML = questionsNum;
    currentQuestionIndexSpan.innerHTML = currentQuestionIndex + 1;
    questionTitle.textContent = questions[currentQuestionIndex].title;
    option1.textContent = questions[currentQuestionIndex].answer_1;
    option2.textContent = questions[currentQuestionIndex].answer_2;
    option3.textContent = questions[currentQuestionIndex].answer_3;
    option4.textContent = questions[currentQuestionIndex].answer_4;

    // Set up option selection behavior
    const options = document.querySelectorAll(".option");
    options.forEach((option) => {
      option.addEventListener("click", () => {
        options.forEach((opt) => opt.classList.remove("selected"));
        option.classList.add("selected");
        const answerText = option.querySelector("span").textContent.trim();
        selectedValue = answerText;
        userSelectedAnswers[currentQuestionIndex] = selectedValue;
      });
    });

    // Initialize progress bar
    let progressPercentage =
      ((currentQuestionIndex + 1) / questions.length) * 100;
    progress.style.width = `${progressPercentage}%`;

    // Disable previous button on first question
    if (currentQuestionIndex === 0) previousBtn.classList.add("disabled");

    // Next button handler
    nextBtn.addEventListener("click", () => {
      // Return if button is disabled
      if (nextBtn.classList.contains("disabled")) {
        nextBtn.classList.add("shake");
        setTimeout(() => nextBtn.classList.remove("shake"), 300);
        return;
      }

      // Require answer selection
      if (!selectedValue) {
        showAlert("warning", "Please select an answer before continuing.");
        return;
      }

      // Handle quiz completion
      if (currentQuestionIndex === questions.length - 1) {
        let correctCount = 0;
        for (let i = 0; i < userSelectedAnswers.length; i++) {
          if (userSelectedAnswers[i] === correctAnswersArr[i]) {
            correctCount++;
          }
        }
        document.querySelector(".quiz-container").style.display = "none";
        document.querySelector(".results-container").style.display = "block";
        renderResults(
          correctCount,
          questions.length,
          questions,
          userSelectedAnswers
        );
        return;
      }

      // Update UI for next question
      currentQuestionIndex++;
      questionTitle.textContent = questions[currentQuestionIndex].title;
      currentQuestionIndexSpan.innerHTML = currentQuestionIndex + 1;
      option1.textContent = questions[currentQuestionIndex].answer_1;
      option2.textContent = questions[currentQuestionIndex].answer_2;
      option3.textContent = questions[currentQuestionIndex].answer_3;
      option4.textContent = questions[currentQuestionIndex].answer_4;
      progressPercentage =
        ((currentQuestionIndex + 1) / questions.length) * 100;
      progress.style.width = `${progressPercentage}%`;

      previousBtn.classList.remove("disabled");
      options.forEach((opt) => opt.classList.remove("selected"));
      selectedValue = "";
    });

    // Previous button handler
    previousBtn.addEventListener("click", () => {
      // Return if button is disabled
      if (previousBtn.classList.contains("disabled")) {
        previousBtn.classList.add("shake");
        setTimeout(() => previousBtn.classList.remove("shake"), 300);
        return;
      }

      // Update UI for previous question
      currentQuestionIndex--;
      questionTitle.textContent = questions[currentQuestionIndex].title;
      currentQuestionIndexSpan.innerHTML = currentQuestionIndex + 1;
      option1.textContent = questions[currentQuestionIndex].answer_1;
      option2.textContent = questions[currentQuestionIndex].answer_2;
      option3.textContent = questions[currentQuestionIndex].answer_3;
      option4.textContent = questions[currentQuestionIndex].answer_4;
      progressPercentage =
        ((currentQuestionIndex + 1) / questions.length) * 100;
      progress.style.width = `${progressPercentage}%`;
      nextBtn.classList.remove("disabled");
      if (currentQuestionIndex === 0) previousBtn.classList.add("disabled");

      // Restore previous selection if any
      const previousAnswer = userSelectedAnswers[currentQuestionIndex];
      if (previousAnswer) {
        options.forEach((option) => {
          const answerText = option.querySelector("span").textContent.trim();
          if (answerText === previousAnswer) {
            option.classList.add("selected");
            selectedValue = answerText;
          }
        });
      } else {
        options.forEach((opt) => opt.classList.remove("selected"));
        selectedValue = "";
      }
    });
  })
  .catch((error) => {
    console.error("Error loading questions:", error);
  });

/**
 * Renders quiz results and answer review
 * @param {number} correctCount - Number of correct answers
 * @param {number} totalQuestions - Total number of questions
 * @param {Array} questions - Questions data
 * @param {Array} userAnswers - User's selected answers
 */
function renderResults(correctCount, totalQuestions, questions, userAnswers) {
  const resultsContainer = document.querySelector(".results-container");
  resultsContainer.innerHTML = "";
  const incorrectCount = userAnswers.filter(
    (ans, i) => ans !== questions[i].right_answer
  ).length;
  const unansweredCount = totalQuestions - userAnswers.length;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  // Generate results summary UI
  resultsContainer.innerHTML += `
    <div class="results-header">
      <h2>Assessment Results</h2>
      <p>HTML Knowledge Assessment</p>
    </div>
    <div class="score-circle">
      <div class="score-text">${percentage}<span>%</span></div>
    </div>
    <div class="score-details">
      <div class="score-item"><div class="score-value correct">${correctCount}</div><div class="score-label">Correct</div></div>
      <div class="score-item"><div class="score-value incorrect">${incorrectCount}</div><div class="score-label">Incorrect</div></div>
      <div class="score-item"><div class="score-value unanswered">${unansweredCount}</div><div class="score-label">Unanswered</div></div>
    </div>
    <div class="results-message">
      <h3>${
        percentage >= 70 ? "Good knowledge of HTML!" : "Keep practicing!"
      }</h3>
      <p>${
        percentage >= 70
          ? "You demonstrated a solid understanding of HTML elements."
          : "Review HTML basics for better performance."
      }</p>
    </div>
    <div class="results-actions">
      <button class="btn btn-outline" id="reviewBtn">Review Answers</button>
      <button class="btn btn-primary" id="shareBtn">Share Results</button>
      <button class="btn btn-success" onclick="location.reload()">Take New Quiz</button>
    </div>
    <div class="answer-review"><h3>Review Your Answers</h3></div>
  `;

  const reviewContainer = resultsContainer.querySelector(".answer-review");

  // Generate individual question reviews
  questions.forEach((q, index) => {
    const userAnswer = userAnswers[index] || "";
    const isCorrect = userAnswer === q.right_answer;
    const isUnanswered = !userAnswer;

    let reviewHTML = `<div class="review-question">
      <h4><span class="status ${
        isUnanswered ? "unanswered" : isCorrect ? "correct" : "incorrect"
      }">${isUnanswered ? "!" : isCorrect ? "✓" : "✗"}</span>${escapeHTML(
      q.title
    )}</h4>
      <div class="review-choices">`;

    const choices = [q.answer_1, q.answer_2, q.answer_3, q.answer_4];
    choices.forEach((choice, idx) => {
      const isSelected = choice === userAnswer;
      const isRight = choice === q.right_answer;
      reviewHTML += `<div class="review-choice ${isRight ? "correct" : ""} ${
        isSelected && !isRight ? "incorrect selected" : ""
      } ${isSelected && isRight ? "selected" : ""}">
        <span class="choice-letter">${String.fromCharCode(65 + idx)}</span>
        <span>${escapeHTML(choice)}</span>
      </div>`;
    });

    reviewHTML += `</div><div class="explanation"><h5>Explanation:</h5><p>Right answer is: <strong>${escapeHTML(
      q.right_answer || "N/A"
    )}</strong></p></div></div>`;

    reviewContainer.innerHTML += reviewHTML;
  });

  // Handle "Review Answers" button
  document.getElementById("reviewBtn").addEventListener("click", () => {
    const reviewSection = document.querySelector(".answer-review");
    if (reviewSection) reviewSection.scrollIntoView({ behavior: "smooth" });
  });

  // Handle "Share Results" button
  document.getElementById("shareBtn").addEventListener("click", () => {
    const shareText = `I scored ${correctCount} out of ${totalQuestions} in the HTML quiz!`;
    navigator.clipboard
      .writeText(shareText)
      .then(() => showAlert("warning", "Result copied to clipboard ✅"))
      .catch(() => alert("Failed to copy ❌"));
  });


}
