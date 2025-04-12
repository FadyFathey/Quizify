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

// Add event listeners to the quiz options
const options = document.querySelectorAll(".option");
options.forEach((option) => {
  option.addEventListener("click", function () {
    // Remove selected class from all options
    options.forEach((opt) => opt.classList.remove("selected"));
    // Add selected class to clicked option
    this.classList.add("selected");
  });
});

// start main logic

// Select DOM elements for quiz UI
let questionsNumDiv = document.querySelector("#questionsNum");
let currentQuestionIndexSpan = document.querySelector(
  "#currentQuestionIndexSpan"
);
let questionTitle = document.querySelector("#question-title");
let nextBtn = document.querySelector(".next");
let previousBtn = document.querySelector(".previous");

// Select each answer span by its ID
const option1 = document.querySelector("#option-1");
const option2 = document.querySelector("#option-2");
const option3 = document.querySelector("#option-3");
const option4 = document.querySelector("#option-4");

// Select the progress bar fill element
let progress = document.querySelector(".progress");

// Initialize the current question index
let currentQuestionIndex = 0;

// Store the selected value and all user answers
let selectedValue = "";
let userSelectedAnswers = [];

// Fetch questions from a local JSON file
axios
  .get("html_questions.json")
  .then((response) => {
    const questions = response.data;
    let questionsNum = questions.length;

    // Display total number of questions
    questionsNumDiv.innerHTML = questionsNum;

    // Display the first question and answers
    currentQuestionIndexSpan.innerHTML = currentQuestionIndex + 1;
    questionTitle.textContent = questions[currentQuestionIndex].title;
    option1.textContent = questions[currentQuestionIndex].answer_1;
    option2.textContent = questions[currentQuestionIndex].answer_2;
    option3.textContent = questions[currentQuestionIndex].answer_3;
    option4.textContent = questions[currentQuestionIndex].answer_4;

    // Update progress bar based on current question
    let progressPercentage =
      ((currentQuestionIndex + 1) / questions.length) * 100;
    progress.style.width = `${progressPercentage}%`;

    // Disable previous button at the first question
    if (currentQuestionIndex === 0) {
      previousBtn.classList.add("disabled");
    }

    // Disable next button if only one question exists
    if (currentQuestionIndex === questions.length - 1) {
      nextBtn.classList.add("disabled");
    }

    // Handle click on any option to get selected value
    const optionSpans = document.querySelectorAll(".option span");
    optionSpans.forEach((span) => {
      span.addEventListener("click", () => {
        selectedValue = span.textContent.trim(); // Save selected value globally
        userSelectedAnswers[currentQuestionIndex] = selectedValue; // Save answer at correct index
        console.log("Selected value:", selectedValue);
        console.log("Current userSelectedAnswers:", userSelectedAnswers); // 👈 added here
      });
    });

    // Handle click event for the "Next" button
    nextBtn.addEventListener("click", () => {
      // If next button is disabled, apply shake animation and exit
      if (nextBtn.classList.contains("disabled")) {
        nextBtn.classList.add("shake");
        setTimeout(() => nextBtn.classList.remove("shake"), 300);
        return;
      }

      // Move to the next question
      currentQuestionIndex += 1;

      // Update question title and answer options
      questionTitle.textContent = questions[currentQuestionIndex].title;
      currentQuestionIndexSpan.innerHTML = currentQuestionIndex + 1;
      option1.textContent = questions[currentQuestionIndex].answer_1;
      option2.textContent = questions[currentQuestionIndex].answer_2;
      option3.textContent = questions[currentQuestionIndex].answer_3;
      option4.textContent = questions[currentQuestionIndex].answer_4;

      // Update progress bar
      progressPercentage =
        ((currentQuestionIndex + 1) / questions.length) * 100;
      progress.style.width = `${progressPercentage}%`;

      // Enable previous button if moving forward
      previousBtn.classList.remove("disabled");

      // Disable next button at the last question
      if (currentQuestionIndex === questions.length - 1) {
        nextBtn.classList.add("disabled");
      }

      // Optionally clear selectedValue for next question
      selectedValue = "";
    });

    // Handle click event for the "Previous" button
    previousBtn.addEventListener("click", () => {
      // If previous button is disabled, apply shake animation and exit
      if (previousBtn.classList.contains("disabled")) {
        previousBtn.classList.add("shake");
        setTimeout(() => previousBtn.classList.remove("shake"), 300);
        return;
      }

      // Move to the previous question
      currentQuestionIndex -= 1;

      // Update question title and answer options
      questionTitle.textContent = questions[currentQuestionIndex].title;
      currentQuestionIndexSpan.innerHTML = currentQuestionIndex + 1;
      option1.textContent = questions[currentQuestionIndex].answer_1;
      option2.textContent = questions[currentQuestionIndex].answer_2;
      option3.textContent = questions[currentQuestionIndex].answer_3;
      option4.textContent = questions[currentQuestionIndex].answer_4;

      // Update progress bar
      progressPercentage =
        ((currentQuestionIndex + 1) / questions.length) * 100;
      progress.style.width = `${progressPercentage}%`;

      // Enable next button if moving back
      nextBtn.classList.remove("disabled");

      // Disable previous button at the first question
      if (currentQuestionIndex === 0) {
        previousBtn.classList.add("disabled");
      }

      // Restore selectedValue if available (optional for future use)
      selectedValue = userSelectedAnswers[currentQuestionIndex] || "";
    });
  })
  .catch((error) => {
    // Log error if JSON fails to load
    console.error("Error loading questions:", error);
  });
