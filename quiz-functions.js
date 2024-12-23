// Comprehensive Quiz Functionality

// Logging Utility
function log(level, message, data = null) {
    if (LOGGING_CONFIG.enableClientSideLogging) {
        const logLevels = ['error', 'warn', 'info', 'debug'];
        if (logLevels.indexOf(level) <= logLevels.indexOf(LOGGING_CONFIG.logLevel)) {
            console[level](`[AoIP Challenge] ${message}`, data);
        }
    }
}

// Input Sanitization and Validation
function sanitizeInput(element) {
    const clean = element.value.replace(/[<>]/g, '');
    if (clean !== element.value) {
        element.value = clean;
        log('warn', 'Potentially dangerous characters removed from input');
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

// Timer Management
let quizTimer;
let remainingTime;

function startTimer() {
    const timerDisplay = document.getElementById('quiz-timer');
    remainingTime = CONFIG.timeLimitMinutes * 60;

    quizTimer = setInterval(() => {
        const hours = Math.floor(remainingTime / 3600);
        const minutes = Math.floor((remainingTime % 3600) / 60);
        const seconds = remainingTime % 60;

        timerDisplay.textContent = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (remainingTime <= 0) {
            clearInterval(quizTimer);
            alert('Tiden er ute! Besvarelsen din vil bli sendt inn automatisk.');
            validateAndSubmit();
        }

        remainingTime--;
    }, 1000);
}

// Auto-save Functionality
function autoSaveProgress() {
    const groupName = document.getElementById('groupName').value;
    const date = document.getElementById('date').value;
    const answers = {};

    questions.forEach(q => {
        const answer = document.getElementById(`answer-${q.id}`).value;
        answers[q.id] = answer;
    });

    const saveData = {
        groupName,
        date,
        answers,
        timestamp: new Date().toISOString()
    };

    try {
        localStorage.setItem('aoipQuizDraft', JSON.stringify(saveData));
        log('info', 'Draft auto-saved', saveData);
    } catch (error) {
        log('error', 'Auto-save failed', error);
    }
}

function loadDraftIfExists() {
    try {
        const draftData = localStorage.getItem('aoipQuizDraft');
        if (draftData) {
            const parsedData = JSON.parse(draftData);
            
            document.getElementById('groupName').value = parsedData.groupName;
            document.getElementById('date').value = parsedData.date;

            questions.forEach(q => {
                const answerElement = document.getElementById(`answer-${q.id}`);
                if (answerElement && parsedData.answers[q.id]) {
                    answerElement.value = parsedData.answers[q.id];
                }
            });

            log('info', 'Draft loaded successfully');
        }
    } catch (error) {
        log('error', 'Failed to load draft', error);
    }
}

function saveProgress() {
    autoSaveProgress();
    alert('Utkast lagret lokalt!');
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

    if (groupName.length > CONFIG.maxGroupNameLength) {
        alert(`Gruppenavn kan ikke være lengre enn ${CONFIG.maxGroupNameLength} tegn`);
        return false;
    }

    let valid = true;
    questions.forEach(q => {
        const answer = document.getElementById(`answer-${q.id}`).value;
        if (answer && answer.length > CONFIG.maxAnswerLength) {
            alert(`Svaret på spørsmål ${q.id} er for langt. Maksimal lengde er ${CONFIG.maxAnswerLength} tegn.`);
            valid = false;
        }
    });

    return valid;
}

function validateAndSubmit() {
    if (validateForm()) {
        clearInterval(quizTimer);
        autoSaveProgress();
        alert('Besvarelse sendt inn!');
        // Here you could add logic to actually submit the form
    }
}

function validateAndPrint() {
    if (validateForm()) {
        window.print();
    }
}

// Progress Bar
function updateProgressBar() {
    const questionContainer = document.getElementById('questionContainer');
    const progressBar = document.getElementById('progress-bar');
    const totalQuestions = questions.length;
    
    let completedQuestions = 0;
    questions.forEach(q => {
        const answer = document.getElementById(`answer-${q.id}`);
        if (answer && answer.value.trim().length > 0) {
            completedQuestions++;
        }
    });

    const progressPercentage = (completedQuestions / totalQuestions) * 100;
    progressBar.style.width = `${progressPercentage}%`;
}

// Question Card Creation
function createQuestionCard(question, index) {
    const card = document.createElement('div');
    card.className = 'question-card';
    
    const content = `
        <div class="question-header">
            <div class="question-number">${index + 1}</div>
            <div class="question-text">${question.text}</div>
            <div class="question-help-text">${question.helpText || ''}</div>
        </div>
        <textarea 
            id="answer-${question.id}"
            name="answer-${question.id}"
            placeholder="${question.placeholder || 'Skriv svaret ditt her...'}"
            maxlength="${CONFIG.maxAnswerLength}"
            onkeyup="sanitizeInput(this); update
            // Continuing the Question Card and Initialization Functions
function createQuestionCard(question, index) {
    const card = document.createElement('div');
    card.className = 'question-card';
    
    const content = `
        <div class="question-header">
            <div class="question-number">${index + 1}</div>
            <div class="question-text">${question.text}</div>
            <div class="question-help-text">${question.helpText || ''}</div>
        </div>
        <textarea 
            id="answer-${question.id}"
            name="answer-${question.id}"
            placeholder="${question.placeholder || 'Skriv svaret ditt her...'}"
            maxlength="${CONFIG.maxAnswerLength}"
            onkeyup="sanitizeInput(this); updateProgressBar(); autoSaveProgress();"
            oninput="updateCharCount(this)"
        ></textarea>
        <div class="char-count" id="char-count-${question.id}">0 / ${CONFIG.maxAnswerLength}</div>
        ${question.allowImage ? `
            <div class="image-upload-container">
                <div class="image-upload" onclick="triggerFileUpload(${question.id})">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Last opp bilde (Maks ${CONFIG.maxFileSize / 1024 / 1024}MB)</p>
                    <input 
                        type="file" 
                        id="file-${question.id}"
                        accept="${CONFIG.allowedImageTypes.join(',')}"
                        style="display: none"
                        onchange="handleFileUpload(${question.id})"
                    >
                </div>
                <div id="preview-${question.id}" class="image-preview"></div>
            </div>
        ` : ''}
    `;
    
    card.innerHTML = content;
    return card;
}

// Character Count Tracking
function updateCharCount(textarea) {
    const charCountElement = document.getElementById(`char-count-${textarea.id.split('-')[1]}`);
    charCountElement.textContent = `${textarea.value.length} / ${CONFIG.maxAnswerLength}`;
}

// File Handling
function triggerFileUpload(id) {
    document.getElementById(`file-${id}`).click();
}

function handleFileUpload(id) {
    const fileInput = document.getElementById(`file-${id}`);
    const file = fileInput.files[0];
    const preview = document.getElementById(`preview-${id}`);

    if (!file) return;

    if (!CONFIG.allowedImageTypes.includes(file.type)) {
        alert('Kun følgende bildetyper er tillatt: ' + CONFIG.allowedImageTypes.join(', '));
        fileInput.value = '';
        return;
    }

    if (file.size > CONFIG.maxFileSize) {
        alert(`Filen er for stor. Maksimal størrelse er ${CONFIG.maxFileSize / 1024 / 1024}MB`);
        fileInput.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        preview.innerHTML = `
            <img src="${e.target.result}" alt="Opplastet bilde" class="uploaded-image">
            <button type="button" class="remove-image" onclick="removeImage(${id})">
                <i class="fas fa-trash"></i> Fjern bilde
            </button>
        `;
    };
    reader.readAsDataURL(file);
}

function removeImage(id) {
    const preview = document.getElementById(`preview-${id}`);
    const fileInput = document.getElementById(`file-${id}`);
    
    preview.innerHTML = '';
    fileInput.value = '';
}

// Help Modal Functionality
function initHelpModal() {
    const helpModal = document.getElementById('help-modal');
    const helpTrigger = document.createElement('button');
    helpTrigger.innerHTML = '<i class="fas fa-question-circle"></i>';
    helpTrigger.className = 'help-trigger';
    helpTrigger.onclick = () => {
        helpModal.style.display = 'block';
    };

    const closeModal = helpModal.querySelector('.close-modal');
    closeModal.onclick = () => {
        helpModal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target == helpModal) {
            helpModal.style.display = 'none';
        }
    };

    document.body.appendChild(helpTrigger);
}

// Quiz Initialization
function initQuiz() {
    const container = document.getElementById('questionContainer');
    
    // Clear any existing questions first
    container.innerHTML = '';

    // Create question cards
    questions.slice(0, 3).forEach((question, index) => {
        container.appendChild(createQuestionCard(question, index));
    });
    
    // Set today's date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;

    // Load any existing draft
    loadDraftIfExists();

    // Start the timer
    startTimer();

    // Set up auto-save
    setInterval(autoSaveProgress, CONFIG.autoSaveInterval);

    // Update progress bar when page loads
    updateProgressBar();

    // Initialize help modal
    initHelpModal();

    // Add event listeners for real-time progress tracking
    questions.forEach(q => {
        const answerElement = document.getElementById(`answer-${q.id}`);
        answerElement.addEventListener('input', updateProgressBar);
    });
}

// Initialize quiz when document is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuiz);
} else {
    initQuiz();
}
