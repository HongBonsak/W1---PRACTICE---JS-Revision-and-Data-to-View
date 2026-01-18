// DOM Elements for Editor View
const dom_editor = document.querySelector("#editor");
const questionsList = document.querySelector("#questionsList");
const addQuestionBtn = document.querySelector("#addQuestionBtn");
const editQuestionsBtn = document.querySelector("#editQuestionsBtn");

// Dialog elements
const editDialog = document.querySelector("#editDialog");
const dialogTitle = document.querySelector("#dialogTitle");
const closeDialogBtn = document.querySelector("#closeDialog");
const cancelBtn = document.querySelector("#cancelBtn");
const saveBtn = document.querySelector("#saveBtn");
const questionInput = document.querySelector("#questionInput");
const answersInputContainer = document.querySelector("#answersInputContainer");
const correctAnswerSelect = document.querySelector("#correctAnswerSelect");

// Current editing question ID
let currentEditingQuestionId = null;

// Initialize Editor
function initEditor() {
    renderQuestionsList();
}

// Render all questions in editor
function renderQuestionsList() {
    const allQuestions = getAllQuestions();
    questionsList.innerHTML = "";
    
    if (allQuestions.length === 0) {
        questionsList.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: var(--text-muted);">
                <p style="font-size: 1.2rem; margin-bottom: 10px;">No questions yet</p>
                <p>Click "Add New Question" to create your first quiz question</p>
            </div>
        `;
        return;
    }
    
    allQuestions.forEach((question, index) => {
        const card = createQuestionCard(question, index);
        questionsList.appendChild(card);
    });
}

// Create question card element
function createQuestionCard(question, index) {
    const card = document.createElement("div");
    card.className = "question-card";
    card.style.animationDelay = `${index * 0.05}s`;
    
    const header = document.createElement("div");
    header.className = "question-card-header";
    
    const title = document.createElement("div");
    title.className = "question-card-title";
    title.textContent = `${index + 1}. ${question.question}`;
    
    const actions = document.createElement("div");
    actions.className = "question-card-actions";
    
    const editBtn = document.createElement("button");
    editBtn.className = "btn btn-primary btn-small";
    editBtn.innerHTML = '<span class="icon">✎</span> Edit';
    editBtn.addEventListener("click", () => openEditDialog(question.id));
    
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-secondary btn-small";
    deleteBtn.innerHTML = '<span class="icon">🗑</span> Delete';
    deleteBtn.addEventListener("click", () => confirmDeleteQuestion(question.id));
    
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    
    header.appendChild(title);
    header.appendChild(actions);
    
    const answersDiv = document.createElement("div");
    answersDiv.className = "question-card-answers";
    
    question.answers.forEach((answer, answerIndex) => {
        const answerItem = document.createElement("div");
        answerItem.className = "answer-item";
        
        if (answerIndex === question.correct) {
            answerItem.classList.add("correct");
            answerItem.innerHTML = `<span class="icon">✓</span> ${answer}`;
        } else {
            answerItem.textContent = answer;
        }
        
        answersDiv.appendChild(answerItem);
    });
    
    card.appendChild(header);
    card.appendChild(answersDiv);
    
    return card;
}

// Open edit dialog for adding or editing
function openEditDialog(questionId = null) {
    currentEditingQuestionId = questionId;
    
    if (questionId === null) {
        // Adding new question
        dialogTitle.textContent = "Add New Question";
        questionInput.value = "";
        resetAnswerInputs();
        correctAnswerSelect.value = "0";
    } else {
        // Editing existing question
        dialogTitle.textContent = "Edit Question";
        const question = getQuestionById(questionId);
        
        if (question) {
            questionInput.value = question.question;
            populateAnswerInputs(question.answers);
            correctAnswerSelect.value = question.correct.toString();
        }
    }
    
    show(editDialog);
}

// Reset answer inputs to default state
function resetAnswerInputs() {
    answersInputContainer.innerHTML = "";
    
    for (let i = 0; i < 4; i++) {
        const wrapper = document.createElement("div");
        wrapper.className = "answer-input-wrapper";
        
        const numberBadge = document.createElement("div");
        numberBadge.className = "answer-number";
        numberBadge.textContent = i + 1;
        
        const input = document.createElement("input");
        input.type = "text";
        input.className = "form-input";
        input.placeholder = `Answer ${i + 1}`;
        input.setAttribute("data-answer-index", i);
        
        wrapper.appendChild(numberBadge);
        wrapper.appendChild(input);
        answersInputContainer.appendChild(wrapper);
    }
}

// Populate answer inputs with existing data
function populateAnswerInputs(answers) {
    resetAnswerInputs();
    
    const inputs = answersInputContainer.querySelectorAll("input");
    inputs.forEach((input, index) => {
        if (answers[index]) {
            input.value = answers[index];
        }
    });
}

// Close dialog
function closeDialog() {
    hide(editDialog);
    currentEditingQuestionId = null;
}

// Save question (add or update)
function saveQuestion() {
    // Validate inputs
    const questionText = questionInput.value.trim();
    
    if (!questionText) {
        alert("Please enter a question");
        return;
    }
    
    // Get all answers
    const answerInputs = answersInputContainer.querySelectorAll("input");
    const answers = [];
    
    answerInputs.forEach(input => {
        const answerText = input.value.trim();
        if (!answerText) {
            answers.push(""); // Allow empty for now, will validate
        } else {
            answers.push(answerText);
        }
    });
    
    // Validate that we have at least 2 answers
    const nonEmptyAnswers = answers.filter(a => a !== "");
    if (nonEmptyAnswers.length < 2) {
        alert("Please provide at least 2 answers");
        return;
    }
    
    const correctAnswer = parseInt(correctAnswerSelect.value);
    
    // Validate correct answer is not empty
    if (!answers[correctAnswer]) {
        alert("The correct answer cannot be empty");
        return;
    }
    
    const questionData = {
        question: questionText,
        answers: answers,
        correct: correctAnswer
    };
    
    if (currentEditingQuestionId === null) {
        // Add new question
        addQuestion(questionData);
    } else {
        // Update existing question
        updateQuestion(currentEditingQuestionId, questionData);
    }
    
    // Refresh the list and close dialog
    renderQuestionsList();
    closeDialog();
    
    // Show success feedback
    showNotification(currentEditingQuestionId === null ? "Question added successfully!" : "Question updated successfully!");
}

// Confirm and delete question
function confirmDeleteQuestion(questionId) {
    const question = getQuestionById(questionId);
    if (!question) return;
    
    const confirmed = confirm(`Are you sure you want to delete this question?\n\n"${question.question}"`);
    
    if (confirmed) {
        deleteQuestion(questionId);
        renderQuestionsList();
        showNotification("Question deleted successfully!");
    }
}

// Show notification (simple implementation)
function showNotification(message) {
    const notification = document.createElement("div");
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: linear-gradient(135deg, var(--success), #059669);
        color: white;
        padding: 15px 25px;
        border-radius: var(--radius-sm);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 3000;
        animation: slideIn 0.3s ease;
        font-weight: 600;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = "fadeOut 0.3s ease";
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2500);
}

// Event Listeners
addQuestionBtn.addEventListener("click", () => openEditDialog(null));
closeDialogBtn.addEventListener("click", closeDialog);
cancelBtn.addEventListener("click", closeDialog);
saveBtn.addEventListener("click", saveQuestion);
editQuestionsBtn.addEventListener("click", () => {
    switchView("editor");
});

// Close dialog when clicking outside
editDialog.addEventListener("click", (e) => {
    if (e.target === editDialog) {
        closeDialog();
    }
});

// Initialize editor when needed
document.addEventListener("DOMContentLoaded", () => {
    initEditor();
});
