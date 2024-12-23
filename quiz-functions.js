// Input Sanitization
function sanitizeInput(element) {
    const clean = element.value.replace(/[<>]/g, '');
    if (clean !== element.value) {
        element.value = clean;
    }
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Form Validation
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
            placeholder="Skriv svaret ditt her..."
            maxlength="10000"
        ></textarea>
    `;
    
    card.innerHTML = content;
    return card;
}

// Quiz Initialization
function initQuiz() {
    const container = document.getElementById('questionContainer');
    
    // Clear any existing questions first
    container.innerHTML = '';

    // Create question cards
    questions.forEach((question, index) => {
        container.appendChild(createQuestionCard(question, index));
    });
    
    // Set today's date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
}

// Initialize quiz when document is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuiz);
} else {
    initQuiz();
}
