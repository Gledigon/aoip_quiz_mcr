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

// Print Function
function validateAndPrint() {
    if (validateForm()) {
        window.print();
    }
}

// File Handling
function triggerFileUpload(id) {
    document.getElementById(`file-${id}`).click();
}

function handleFileUpload(id) {
    const fileInput = document.getElementById(`file-${id}`);
    const file = fileInput.files[0];

    if (!file) return;

    if (!CONFIG.allowedImageTypes.includes(file.type)) {
        alert('Kun JPG, PNG og GIF bilder er tillatt');
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
        showPreview(id, e.target.result);
    };
    reader.onerror = function() {
        alert('Det oppstod en feil ved lesing av filen');
        fileInput.value = '';
    };
    reader.readAsDataURL(file);
}

function showPreview(id, src) {
    const preview = document.getElementById(`preview-${id}`);
    if (preview) {
        const img = document.createElement('img');
        img.src = src;
        img.className = 'preview-image';
        img.alt = 'Opplastet bilde';
        preview.innerHTML = '';
        preview.appendChild(img);
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
            maxlength="${CONFIG.maxAnswerLength}"
            onkeyup="sanitizeInput(this)"
        ></textarea>
        ${question.allowImage ? `
            <div class="image-upload" onclick="triggerFileUpload(${question.id})">
                <p>Klikk eller dra og slipp bilde her (Maks ${CONFIG.maxFileSize / 1024 / 1024}MB)</p>
                <input 
                    type="file" 
                    id="file-${question.id}"
                    accept="${CONFIG.allowedImageTypes.join(',')}"
                    style="display: none"
                    onchange="handleFileUpload(${question.id})"
                >
            </div>
            <div id="preview-${question.id}"></div>
        ` : ''}
    `;
    
    card.innerHTML = content;
    return card;
}

// Quiz Initialization
function initQuiz() {
    const container = document.getElementById('questionContainer');
    questions.forEach((question, index) => {
        container.appendChild(createQuestionCard(question, index));
    });
    
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
}

// Initialize quiz when document is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuiz);
} else {
    initQuiz();
}