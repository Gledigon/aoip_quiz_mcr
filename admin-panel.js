// Admin Panel Functionality
const ADMIN = {
    questions: QUESTIONS,
    
    initialize: function() {
        if (!this.isAdmin()) return;
        this.createAdminPanel();
        this.setupEventListeners();
    },

    isAdmin: function() {
        return localStorage.getItem('isAdmin') === 'true';
    },

    createAdminPanel: function() {
        const adminPanel = document.createElement('div');
        adminPanel.className = 'admin-panel';
        adminPanel.innerHTML = `
            <div class="admin-header">
                <h2>Administrasjonspanel</h2>
                <button class="btn" onclick="ADMIN.addQuestion()">Legg til spørsmål</button>
            </div>
            <div class="question-list">
                ${this.renderQuestionList()}
            </div>
            <div class="stats-panel">
                <h3>Statistikk</h3>
                <div id="statsContent"></div>
            </div>
        `;
        document.querySelector('.container').prepend(adminPanel);
        this.updateStats();
    },

    renderQuestionList: function() {
        return this.questions.map(q => `
            <div class="admin-question-card" data-id="${q.id}">
                <div class="question-content">
                    <p>${q.text}</p>
                </div>
                <div class="question-actions">
                    <button onclick="ADMIN.editQuestion(${q.id})" class="btn-secondary">
                        Rediger
                    </button>
                    <button onclick="ADMIN.deleteQuestion(${q.id})" class="btn-danger">
                        Slett
                    </button>
                </div>
            </div>
        `).join('');
    },

    addQuestion: function() {
        const newQuestion = {
            id: this.questions.length + 1,
            text: '',
            placeholder: '',
            allowImage: true,
            required: true
        };

        const modal = this.createModal('Legg til spørsmål', `
            <div class="form-group">
                <label>Spørsmålstekst</label>
                <textarea id="newQuestionText" class="admin-input"></textarea>
            </div>
            <div class="form-group">
                <label>Placeholder tekst</label>
                <input type="text" id="newQuestionPlaceholder" class="admin-input">
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="newQuestionRequired" checked>
                    Obligatorisk
                </label>
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="newQuestionAllowImage" checked>
                    Tillat bilder
                </label>
            </div>
        `);

        modal.querySelector('form').addEventListener('submit', (e) => {
            e.preventDefault();
            newQuestion.text = document.getElementById('newQuestionText').value;
            newQuestion.placeholder = document.getElementById('newQuestionPlaceholder').value;
            newQuestion.required = document.getElementById('newQuestionRequired').checked;
            newQuestion.allowImage = document.getElementById('newQuestionAllowImage').checked;

            this.questions.push(newQuestion);
            this.saveQuestions();
            this.refreshQuestionList();
            modal.remove();
        });
    },

    editQuestion: function(id) {
        const question = this.questions.find(q => q.id === id);
        if (!question) return;

        const modal = this.createModal('Rediger spørsmål', `
            <div class="form-group">
                <label>Spørsmålstekst</label>
                <textarea id="editQuestionText" class="admin-input">${question.text}</textarea>
            </div>
            <div class="form-group">
                <label>Placeholder tekst</label>
                <input type="text" id="editQuestionPlaceholder" class="admin-input" 
                       value="${question.placeholder}">
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="editQuestionRequired" 
                           ${question.required ? 'checked' : ''}>
                    Obligatorisk
                </label>
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="editQuestionAllowImage" 
                           ${question.allowImage ? 'checked' : ''}>
                    Tillat bilder
                </label>
            </div>
        `);

        modal.querySelector('form').addEventListener('submit', (e) => {
            e.preventDefault();
            question.text = document.getElementById('editQuestionText').value;
            question.placeholder = document.getElementById('editQuestionPlaceholder').value;
            question.required = document.getElementById('editQuestionRequired').checked;
            question.allowImage = document.getElementById('editQuestionAllowImage').checked;

            this.saveQuestions();
            this.refreshQuestionList();
            modal.remove();
        });
    },

    deleteQuestion: function(id) {
        if (!confirm('Er du sikker på at du vil slette dette spørsmålet?')) return;
        
        this.questions = this.questions.filter(q => q.id !== id);
        this.saveQuestions();
        this.refreshQuestionList();
    },

    createModal: function(title, content) {
        const modal = document.createElement('div');
        modal.className = 'admin-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>${title}</h3>
                <form>
                    ${content}
                    <div class="button-group">
                        <button type="submit" class="btn">Lagre</button>
                        <button type="button" class="btn-secondary" onclick="this.closest('.admin-modal').remove()">
                            Avbryt
                        </button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
        return modal;
    },

    saveQuestions: function() {
        localStorage.setItem('quizQuestions', JSON.stringify(this.questions));
        location.reload(); // Refresh for å vise oppdaterte spørsmål
    },

    refreshQuestionList: function() {
        const list = document.querySelector('.question-list');
        if (list) {
            list.innerHTML = this.renderQuestionList();
        }
    },

    updateStats: function() {
        const statsContent = document.getElementById('statsContent');
        if (!statsContent) return;

        // Hent lagrede svar
        const savedAnswers = Object.keys(localStorage)
            .filter(key => key.startsWith('aoip_quiz_'))
            .map(key => JSON.parse(localStorage.getItem(key)));

        const stats = {
            totalResponses: savedAnswers.length,
            averageLength: Math.round(
                savedAnswers.reduce((acc, curr) => acc + curr.answer.length, 0) / 
                savedAnswers.length || 0
            ),
            completionRate: Math.round(
                (savedAnswers.length / (this.questions.length || 1)) * 100
            )
        };

        statsContent.innerHTML = `
            <div class="stat-item">
                <span class="stat-label">Totale svar:</span>
                <span class="stat-value">${stats.totalResponses}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Gjennomsnittlig svarlengde:</span>
                <span class="stat-value">${stats.averageLength} tegn</span>
            </div>
            <div class="stat-item">
                <span class="stat-label">Fullføringsrate:</span>
                <span class="stat-value">${stats.completionRate}%</span>
            </div>
        `;
    }
};

// Initialize admin panel when document is ready
document.addEventListener('DOMContentLoaded', () => ADMIN.initialize());