// DOM Elements for Player View
const dom_start = document.querySelector("#start");
const dom_quiz = document.querySelector("#quiz");
const dom_score = document.querySelector("#scoreContainer");
const dom_menu = document.querySelector("#menu");

const startBtn = document.querySelector("#startBtn");
const restartBtn = document.querySelector("#restartBtn");
const answersContainer = document.querySelector("#answersContainer");
const questionText = document.querySelector("#questionText");
const questionNumber = document.querySelector("#questionNumber");
const totalQuestions = document.querySelector("#totalQuestions");
const currentScoreDisplay = document.querySelector("#currentScore");
const finalScoreDisplay = document.querySelector("#finalScore");
const emojiDisplay = document.querySelector("#emojiDisplay");
const scoreMessage = document.querySelector("#scoreMessage");
const progressBar = document.querySelector("#progressBar");
const questionCount = document.querySelector("#questionCount");

// Utility functions to show/hide elements
function hide(element) {
    element.classList.add("hidden");
}

function show(element) {
    element.classList.remove("hidden");
}

// Initialize the app
function initPlayer() {
    // Update question count on start screen
    questionCount.textContent = getTotalQuestions();
    totalQuestions.textContent = getTotalQuestions();
    
    // Show start view
    show(dom_start);
    hide(dom_quiz);
    hide(dom_score);
    hide(dom_menu);
    
    // Reset game state
    resetGameState();
}

// Start the quiz
function onStarted() {
    // Hide start view, show quiz view and menu
    hide(dom_start);
    show(dom_quiz);
    show(dom_menu);
    
    // Reset game state
    resetGameState();
    
    // Render first question
    renderQuestion(getCurrentQuestionIndex());
    updateScoreDisplay();
    updateProgressBar();
}

// Render a question
function renderQuestion(questionIndex) {
    const question = getQuestion(questionIndex);
    
    if (!question) {
        console.error("Question not found at index:", questionIndex);
        return;
    }
    
    // Update question text
    questionText.textContent = question.question;
    
    // Update question counter
    questionNumber.textContent = questionIndex + 1;
    totalQuestions.textContent = getTotalQuestions();
    
    // Clear previous answers
    answersContainer.innerHTML = "";
    
    // Create answer buttons
    question.answers.forEach((answer, index) => {
        const button = document.createElement("button");
        button.className = "answer-btn";
        button.textContent = answer;
        button.setAttribute("data-answer-id", index);
        
        // Add click event
        button.addEventListener("click", () => onPlayerSubmit(index, question.correct));
        
        // Add animation delay for staggered effect
        button.style.animationDelay = `${index * 0.1}s`;
        
        answersContainer.appendChild(button);
    });
}

// Handle player answer submission
function onPlayerSubmit(answerId, correctAnswerId) {
    // Check if answer is correct
    const isCorrect = answerId === correctAnswerId;
    
    if (isCorrect) {
        updateScore(POINTS_PER_QUESTION);
        updateScoreDisplay();
    }
    
    // Visual feedback for answer
    const buttons = answersContainer.querySelectorAll(".answer-btn");
    buttons.forEach((btn, index) => {
        btn.disabled = true;
        if (index === correctAnswerId) {
            btn.style.borderColor = "var(--success)";
            btn.style.background = "rgba(16, 185, 129, 0.2)";
        } else if (index === answerId && !isCorrect) {
            btn.style.borderColor = "var(--danger)";
            btn.style.background = "rgba(239, 68, 68, 0.2)";
        }
    });
    
    // Wait a bit before moving to next question
    setTimeout(() => {
        // Move to next question
        nextQuestion();
        
        // Check if quiz is finished
        if (isQuizFinished()) {
            renderScore();
        } else {
            renderQuestion(getCurrentQuestionIndex());
            updateProgressBar();
        }
    }, 800);
}

// Update score display
function updateScoreDisplay() {
    currentScoreDisplay.textContent = getCurrentScore();
}

// Update progress bar
function updateProgressBar() {
    const progress = ((getCurrentQuestionIndex() + 1) / getTotalQuestions()) * 100;
    progressBar.style.width = progress + "%";
}

// Render final score
function renderScore() {
    hide(dom_quiz);
    show(dom_score);
    
    const finalScore = getCurrentScore();
    const maxScore = getTotalQuestions() * POINTS_PER_QUESTION;
    
    // Display final score
    finalScoreDisplay.textContent = finalScore;
    
    // Display emoji
    emojiDisplay.textContent = getScoreEmoji(finalScore);
    
    // Display message
    scoreMessage.textContent = getScoreMessage(finalScore);
}

// Restart the quiz
function restartQuiz() {
    hide(dom_score);
    show(dom_start);
    hide(dom_menu);
    resetGameState();
    
    // Update question count in case questions were edited
    questionCount.textContent = getTotalQuestions();
}

// Event Listeners
startBtn.addEventListener("click", onStarted);
restartBtn.addEventListener("click", restartQuiz);

// Initialize player on page load
document.addEventListener("DOMContentLoaded", () => {
    // Don't initialize player if we're on editor view
    if (!window.location.hash || window.location.hash === "#player") {
        initPlayer();
    }
});
