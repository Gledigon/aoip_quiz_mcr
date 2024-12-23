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
            maxlength="${CONFIG.maxAnswerLength}"
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
            <button 
                type="button" 
                class="btn-danger btn-remove-image" 
                onclick="removeImage(${questionId})"
                style="display: none;">
                Fjern bilde
            </button>
        </div>
    `;
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

        // Show loading indicator
        const uploadSection = document.getElementById(`upload-${questionId}`);
        if (uploadSection) {
            uploadSection.classList.add('loading');
        }

        const compressedImage = await UTILS.image.compress(file);
        
        const reader = new FileReader();
        reader.onload = function(e) {
            updateImagePreview(questionId, e.target.result);
            quizState.images[questionId] = e.target.result;
            saveState();
            
            // Show remove button
            const removeButton = uploadSection?.querySelector('.btn-remove-image');
            if (removeButton) {
                removeButton.style.display = 'block';
            }
        };
        reader.onerror = function() {
            throw new Error('Kunne ikke lese filen.');
        };
        reader.readAsDataURL(compressedImage);
    } catch (error) {
        console.error('Image upload error:', error);
        UTILS.notification.show(error.message || 'Kunne ikke laste opp bilde', 'error');
        input.value = '';
    } finally {
        // Remove loading indicator
        const uploadSection = document.getElementById(`upload-${questionId}`);
        if (uploadSection) {
            uploadSection.classList.remove('loading');
        }
    }
}

function removeImage(questionId) {
    try {
        // Remove image from state
        delete quizState.images[questionId];
        saveState();

        // Clear file input
        const input = document.getElementById(`image-${questionId}`);
        if (input) {
            input.value = '';
        }

        // Clear preview
        updateImagePreview(questionId, null);

        // Hide remove button
        const removeButton = document.querySelector(`#upload-${questionId} .btn-remove-image`);
        if (removeButton) {
            removeButton.style.display = 'none';
        }

        UTILS.notification.show('Bilde fjernet', 'success');
    } catch (error) {
        console.error('Remove image error:', error);
        UTILS.notification.show('Kunne ikke fjerne bilde', 'error');
    }
}

function updateImagePreview(questionId, imageData) {
    const preview = document.getElementById(`image-preview-${questionId}`);
    if (preview) {
        preview.innerHTML = imageData 
            ? `<img src="${imageData}" alt="Forhåndsvisning" class="preview-image">` 
            : '';
    }
}

function saveAnswer(questionId, value) {
    try {
        if (value.length > CONFIG.maxAnswerLength) {
            value = value.substring(0, CONFIG.maxAnswerLength);
        }
        
        quizState.answers[questionId] = UTILS.string.sanitize(value);
        saveState();
    } catch (error) {
        console.error('Save answer error:', error);
        UTILS.notification.show('Kunne ikke lagre svar', 'error');
    }
}

function saveState() {
    try {
        const serializedState = JSON.stringify(quizState);
        if (serializedState.length > 5242880) { // 5MB
            throw new Error('Dataene er for store til å lagre');
        }
        localStorage.setItem(CONFIG.storagePrefix.quiz, serializedState);
        localStorage.setItem('lastSaved', new Date().toISOString());
        showSaveIndicator();
    } catch (error) {
        console.error('Save state error:', error);
        UTILS.notification.show('Kunne ikke lagre fremgang', 'error');
    }
}

function loadSavedState() {
    try {
        const saved = localStorage.getItem(CONFIG.storagePrefix.quiz);
        if (saved) {
            const parsedState = JSON.parse(saved);
            // Handle version updates if needed
            quizState = {
                version: CONFIG.storageVersion,
                answers: parsedState.answers || {},
                images: parsedState.images || {}
            };
        }
    } catch (error) {
        console.error('Load state error:', error);
        UTILS.notification.show('Kunne ikke laste lagret fremgang', 'error');
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
            const removeButton = document.querySelector(`#upload-${questionId} .btn-remove-image`);
            if (removeButton) {
                removeButton.style.display = 'block';
            }
        });
    } catch (error) {
        console.error('Restore answers error:', error);
        UTILS.notification.show('Kunne ikke gjenopprette svarene', 'error');
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

        if (!VALIDATION.validateGroupName(groupName)) {
            throw new Error('Ugyldig gruppenavn format');
        }

        if (!VALIDATION.validateDate(date)) {
            throw new Error('Ugyldig dato');
        }

        const unansweredQuestions = QUESTIONS
            .filter(q => q.required && !quizState.answers[q.id])
            .map(q => q.id);

        if (unansweredQuestions.length > 0) {
            throw new Error(`Vennligst svar på alle påkrevde spørsmål (${unansweredQuestions.join(', ')})`);
        }

        // Validate answer lengths
        for (const question of QUESTIONS) {
            const answer = quizState.answers[question.id];
            if (answer && !VALIDATION.validateAnswer(answer, question.id)) {
                throw new Error(`Svaret på spørsmål ${question.id} er for kort eller for langt`);
            }
        }

        saveState();
        showSaveIndicator('Svar lagret');
        return true;
    } catch (error) {
        console.error('Form validation error:', error);
        UTILS.notification.show(error.message || 'Kunne ikke validere skjema', 'error');
        return false;
    }
}

function showSaveIndicator(message = 'Lagret') {
    const indicator = UTILS.dom.create('div', {
        className: 'save-indicator'
    }, [message]);
    
    document.body.appendChild(indicator);
    
    setTimeout(() => {
        indicator.classList.add('fade-out');
        setTimeout(() => indicator.remove(), CONFIG.fadeOutDuration);
    }, CONFIG.notificationDuration);
}

function validateAndPrint() {
    if (validateForm()) {
        window.print();
    }
}

// Setup admin panel if user is admin
function setupAdminPanel() {
    if (AUTH.isAdmin()) {
        const adminPanel = document.getElementById('adminPanel');
        if (adminPanel) {
            adminPanel.style.display = 'block';
        }
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initQuiz);
