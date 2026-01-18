// Quiz Data Management
let questions = [
    {
        id: 1,
        question: "What does HTML stand for?",
        answers: [
            "Hi Thierry More Laught",
            "How To Move Left",
            "Ho Theary Missed the Laundry",
            "Hypertext Markup Language"
        ],
        correct: 3
    },
    {
        id: 2,
        question: "What does CSS stand for?",
        answers: [
            "Cisco and Super Start",
            "Ci So Sa",
            "Cascading Style Sheets",
            "I don't know"
        ],
        correct: 2
    },
    {
        id: 3,
        question: "What does JS stand for?",
        answers: [
            "Junior Stars",
            "Justing Star",
            "JavaScript",
            "RonanScript"
        ],
        correct: 2
    },
    {
        id: 4,
        question: "Which language is used to style web pages?",
        answers: [
            "HTML",
            "Java",
            "CSS",
            "Python"
        ],
        correct: 2
    },
    {
        id: 5,
        question: "Which language is used to add interactivity to a web page?",
        answers: [
            "HTML",
            "CSS",
            "JavaScript",
            "SQL"
        ],
        correct: 2
    }
];

// Game state
let runningQuestionIndex = 0;
let score = 0;

// Points per correct answer (BALANCED TO 100)
const POINTS_PER_QUESTION = 100 / questions.length;

// Get total number of questions
function getTotalQuestions() {
    return questions.length;
}

// Get question by index
function getQuestion(index) {
    return questions[index];
}

// Reset game state
function resetGameState() {
    runningQuestionIndex = 0;
    score = 0;
}

// Update score (USED BY YOUR QUIZ UI)
function updateScore() {
    score += POINTS_PER_QUESTION;
}

// Get current score
function getCurrentScore() {
    return Math.round(score);
}

// Get next question index
function nextQuestion() {
    runningQuestionIndex++;
    return runningQuestionIndex;
}

// Check if quiz is finished
function isQuizFinished() {
    return runningQuestionIndex >= questions.length;
}

// Get current question index
function getCurrentQuestionIndex() {
    return runningQuestionIndex;
}

// Get emoji based on score
function getScoreEmoji(finalScore) {
    if (finalScore < 20) return "😢";
    if (finalScore < 40) return "😐";
    if (finalScore < 60) return "🙂";
    if (finalScore < 80) return "😊";
    return "🎉";
}

// Get score message
function getScoreMessage(finalScore) {
    if (finalScore < 20) return "Keep practicing! You'll do better next time.";
    if (finalScore < 40) return "Not bad! There's room for improvement.";
    if (finalScore < 60) return "Good job! You're on the right track.";
    if (finalScore < 80) return "Great work! You really know your stuff.";
    return "Outstanding! You're a quiz master!";
}

// ================= EDITOR FUNCTIONS (NOT REMOVED) =================

function addQuestion(questionData) {
    const newId =
        questions.length > 0
            ? Math.max(...questions.map(q => q.id)) + 1
            : 1;

    const newQuestion = {
        id: newId,
        question: questionData.question,
        answers: questionData.answers,
        correct: questionData.correct
    };

    questions.push(newQuestion);
    return newQuestion;
}

function updateQuestion(id, questionData) {
    const index = questions.findIndex(q => q.id === id);

    if (index !== -1) {
        questions[index] = {
            id: id,
            question: questionData.question,
            answers: questionData.answers,
            correct: questionData.correct
        };
        return questions[index];
    }
    return null;
}

function deleteQuestion(id) {
    const index = questions.findIndex(q => q.id === id);

    if (index !== -1) {
        questions.splice(index, 1);
        return true;
    }
    return false;
}

function getQuestionById(id) {
    return questions.find(q => q.id === id);
}

function getAllQuestions() {
    return questions;
}
