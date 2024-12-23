// Quiz Functions with Debugging
function sanitizeInput(element) {
    const clean = element.value.replace(/[<>]/g, '');
    if (clean !== element.value) {
        element.value = clean;
    }
}

function validateForm(event) {
    if (event) event.preventDefault();
    
    const groupName = document.getElementById('groupName').value;
    const date = document.getElementById('date').value;

    if (!groupName || !date) {
        alert('Vennligst fyll ut alle påkrevde felt');
        return false;
    }

    return true;
}

function validateAndPrint() {
    if (validateForm()) {
        window.print();
    }
}

// Question Card Creation
function createQuestionCard(question, index) {
    const card = document.createElement('div');
    card.className = 'question-card';
    
    const content = `
        <div class="question-header">
            <div class="question-number">${index + 1}</div>
            <div class="question-text">${question.text}</div>
        </div>
        <textarea 
            id="answer-${question.id}"
            name="answer-${question.id}"
            placeholder="${question.placeholder || 'Skriv svaret ditt her...'}"
            maxlength="10000"
        ></textarea>
    `;
    
    card.innerHTML = content;
    return card;
}

// Debug function to log questions
function logQuestions() {
    console.log('Questions:', questions);
    console.log('Number of questions:', questions.length);
}

// Quiz Initialization
function initQuiz() {
    const container = document.getElementById('questionContainer');
    
    // Debugging
    console.log('Initializing quiz...');
    logQuestions();

    // Ensure container exists
    if (!container) {
        console.error('Question container not found!');
        return;
    }
    
    // Clear any existing questions first
    container.innerHTML = '';

    // Defensive check for questions
    if (!questions || questions.length === 0) {
        console.error('No questions found!');
        return;
    }

    // Create question cards
    questions.forEach((question, index) => {
        const questionCard = createQuestionCard(question, index);
        container.appendChild(questionCard);
        console.log(`Added question ${index + 1}`);
    });
    
    // Set today's date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
}

// Initialize quiz when document is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');
    initQuiz();
});
