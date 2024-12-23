// Quiz state management
let quizState = {
    answers: {},
    images: {}
};

// Initialize Quiz
function initQuiz() {
    loadSavedState();
    renderQuiz();
    setupAutosave();
}

function renderQuiz() {
    const container = document.getElementById('questionContainer');
    if (!container) {
        console.error('FEIL: Kan ikke finne spørsmålsbeholderen!');
        return;
    }

    container.innerHTML = '';

    QUESTIONS.forEach((question, index) => {
        const card = createQuestionCard(question, index);
        container.appendChild(card);
    });

    restoreSavedAnswers();
}

function createQuestionCard(question, index) {
    const card = document.createElement('div');
    card.className = 'question-card';
    
    const content = `
        <h3>Spørsmål ${index + 1}</h3>
        <p class="question-text">${question.text}</p>
        <textarea 
            id="answer-${question.id}" 
            placeholder="${question.placeholder}"
            onchange="saveAnswer(${question.id}, this.value)"
            required="${question.required}"
        >${quizState.answers[question.id] || ''}</textarea>
        ${question.allowImage ? createImageUploadSection(question.id) : ''}
    `;
    
    card.innerHTML = content;
    return card;
}

function createImageUploadSection(questionId) {
    return `
        <div class="image-upload">
            <label for="image-${questionId}" class="btn-secondary">
                Last opp bilde (valgfritt)
            </label>
            <input 
                type="file" 
                id="image-${questionId}"
                accept="image/*"
                onchange="handleImageUpload(${questionId}, this)"
                style="display: none"
            >
            <div id="image-preview-${questionId}" class="image-preview"></div>
        </div>
    `;
}

function handleImageUpload(questionId, input) {
    const file = input.files[0];
    if (!file) return;

    if (!CONFIG.allowedImageTypes.includes(file.type)) {
        alert('Ugyldig filtype. Kun JPEG, PNG og GIF er tillatt.');
        input.value = '';
        return;
    }

    if (file.size > CONFIG.maxFileSize) {
        alert('Filen er for stor. Maksimal størrelse er 5MB.');
        input.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const preview = document.getElementById(`image-preview-${questionId}`);
        preview.innerHTML = `<img src="${e.target.result}" alt="Forhåndsvisning">`;
        quizState.images[questionId] = e.target.result;
        saveState();
    };
    reader.readAsDataURL(file);
}

// Save and Load Functions
function saveAnswer(questionId, value) {
    quizState.answers[questionId] = value;
    saveState();
}

function saveState() {
    try {
        localStorage.setItem('quizState', JSON.stringify(quizState));
        localStorage.setItem('lastSaved', new Date().toISOString());
    } catch (error) {
        console.error('Feil ved lagring av tilstand:', error);
    }
}

function loadSavedState() {
    try {
        const saved = localStorage.getItem('quizState');
        if (saved) {
            quizState = JSON.parse(saved);
        }
    } catch (error) {
        console.error('Feil ved lasting av lagret tilstand:', error);
    }
}

function restoreSavedAnswers() {
    Object.entries(quizState.answers).forEach(([questionId, answer]) => {
        const textarea = document.getElementById(`answer-${questionId}`);
        if (textarea) {
            textarea.value = answer;
        }
    });

    Object.entries(quizState.images).forEach(([questionId, imageData]) => {
        const preview = document.getElementById(`image-preview-${questionId}`);
        if (preview) {
            preview.innerHTML = `<img src="${imageData}" alt="Forhåndsvisning">`;
        }
    });
}

// Form Validation and Submission
function validateForm(event) {
    if (event) event.preventDefault();
    
    const groupName = document.getElementById('groupName').value;
    const date = document.getElementById('date').value;

    if (!groupName || !date) {
        alert('Vennligst fyll ut alle påkrevde felt');
        return false;
    }

    const unansweredQuestions = QUESTIONS
        .filter(q => q.required && !quizState.answers[q.id])
        .map(q => q.id);

    if (unansweredQuestions.length > 0) {
        alert(`Vennligst svar på alle påkrevde spørsmål (${unansweredQuestions.join(', ')})`);
        return false;
    }

    saveState();
    return true;
}

// Autosave Setup
function setupAutosave() {
    setInterval(() => {
        saveState();
    }, CONFIG.autosaveInterval);
}

// Print Function
function validateAndPrint() {
    if (validateForm()) {
        window.print();
    }
}

// Cleanup Function
function resetQuiz() {
    if (confirm('Er du sikker på at du vil tilbakestille alle svar?')) {
        localStorage.removeItem('quizState');
        quizState = { answers: {}, images: {} };
        renderQuiz();
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initQuiz);
