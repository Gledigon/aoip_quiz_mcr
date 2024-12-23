// Quiz state management
let quizState = {
    answers: {},
    images: {},
    version: '1.0'
};

// Initialize Quiz
function initQuiz() {
    if (!AUTH.isAuthenticated()) {
        return;
    }
    
    loadSavedState();
    renderQuiz();
    setupAdminPanel();
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
            ${question.required ? 'required' : ''}
        >${quizState.answers[question.id] || ''}</textarea>
        ${question.allowImage ? createImageUploadSection(question.id) : ''}
    `;
    
    card.innerHTML = content;
    return card;
}

function createImageUploadSection(questionId) {
    return `
        <div class="image-upload" id="upload-${questionId}">
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

async function compressImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                
                // Max dimensions
                const MAX_WIDTH = 1024;
                const MAX_HEIGHT = 1024;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => resolve(new File([blob], file.name, { type: 'image/jpeg' })),
                    'image/jpeg',
                    0.7
                );
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

async function handleImageUpload(questionId, input) {
    try {
        const file = input.files[0];
        if (!file) return;

        if (!CONFIG.allowedImageTypes.includes(file.type)) {
            throw new Error('Ugyldig filtype. Kun JPEG, PNG og GIF er tillatt.');
        }

        if (file.size > CONFIG.maxFileSize) {
            throw new Error('Filen er for stor. Maksimal størrelse er 5MB.');
        }

        const compressedImage = await compressImage(file);
        
        const reader = new FileReader();
        reader.onload = function(e) {
            updateImagePreview(questionId, e.target.result);
            quizState.images[questionId] = e.target.result;
            saveState();
        };
        reader.onerror = function(e) {
            throw new Error('Kunne ikke lese filen.');
        };
        reader.readAsDataURL(compressedImage);
    } catch (error) {
        console.error('Image upload error:', error);
        showNotification(error.message || 'Kunne ikke laste opp bilde', 'error');
        input.value = '';
    }
}

function updateImagePreview(questionId, imageData) {
    const preview = document.getElementById(`image-preview-${questionId}`);
    if (preview) {
        preview.innerHTML = `<img src="${imageData}" alt="Forhåndsvisning" class="preview-image">`;
    }
}

function saveAnswer(questionId, value) {
    try {
        quizState.answers[questionId] = value;
        saveState();
    } catch (error) {
        console.error('Save answer error:', error);
        showNotification('Kunne ikke lagre svar', 'error');
    }
}

function saveState() {
    try {
        const serializedState = JSON.stringify(quizState);
        if (serializedState.length > 5242880) { // 5MB
            throw new Error('Dataene er for store til å lagre');
        }
        localStorage.setItem('quizState', serializedState);
        localStorage.setItem('lastSaved', new Date().toISOString());
        showSaveIndicator();
    } catch (error) {
        console.error('Save state error:', error);
        showNotification('Kunne ikke lagre fremgang', 'error');
    }
}

function loadSavedState() {
    try {
        const saved = localStorage.getItem('quizState');
        if (saved) {
            const parsedState = JSON.parse(saved);
            // Handle version updates if needed
            quizState = {
                version: '1.0',
                answers: parsedState.answers || {},
                images: parsedState.images || {}
            };
        }
    } catch (error) {
        console.error('Load state error:', error);
        showNotification('Kunne ikke laste lagret fremgang', 'error');
    }
}

function restoreSavedAnswers() {
    try {
        Object.entries(quizState.answers).forEach(([questionId, answer]) => {
            const textarea = document.getElementById(`answer-${questionId}`);
            if (textarea) {
                textarea.value = answer;
            }
        });

        Object.entries(quizState.images).forEach(([questionId, imageData]) => {
            updateImagePreview(questionId, imageData);
        });
    } catch (error) {
        console.error('Restore answers error:', error);
        showNotification('Kunne ikke gjenopprette svarene', 'error');
    }
}

function validateForm(event) {
    if (event) event.preventDefault();
    
    try {
        const groupName = document.getElementById('groupName')?.value;
        const date = document.getElementById('date')?.value;

        if (!groupName || !date) {
            throw new Error('Vennligst fyll ut alle påkrevde felt');
        }

        const unansweredQuestions = QUESTIONS
            .filter(q => q.required && !quizState.answers[q.id])
            .map(q => q.id);

        if (unansweredQuestions.length > 0) {
            throw new Error(`Vennligst svar på alle påkrevde spørsmål (${unansweredQuestions.join(', ')})`);
        }

        saveState();
        showSaveIndicator('Svar
