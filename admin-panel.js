// Admin Panel Functionality
const ADMIN = {
    initialize: function() {
        try {
            if (AUTH.isAdmin()) {
                this.showAdminPanel();
                this.updateQuestionList();
                this.loadStatistics();
                this.setupEventListeners();
            }
        } catch (error) {
            console.error('Admin initialization error:', error);
        }
    },

    setupEventListeners: function() {
        // Listen for question updates
        document.addEventListener('questionUpdated', () => {
            this.updateQuestionList();
            this.loadStatistics();
        });
    },

    showAdminPanel: function() {
        const adminPanel = document.getElementById('adminPanel');
        if (adminPanel) {
            adminPanel.style.display = 'block';
        }
    },

    addQuestion: function() {
        try {
            const newQuestion = {
                id: QUESTIONS.length + 1,
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
                newQuestion.text = document.getElementById('newQuestionText')?.value || '';
                newQuestion.placeholder = document.getElementById('newQuestionPlaceholder')?.value || '';
                newQuestion.required = document.getElementById('newQuestionRequired')?.checked || false;
                newQuestion.allowImage = document.getElementById('newQuestionAllowImage')?.checked || false;

                if (!newQuestion.text.trim()) {
                    alert('Spørsmålstekst kan ikke være tom');
                    return;
                }

                QUESTIONS.push(newQuestion);
                this.saveQuestions();
                this.updateQuestionList();
                modal.remove();
            });
        } catch (error) {
            console.error('Add question error:', error);
            this.showNotification('Kunne ikke legge til spørsmål', 'error');
        }
    },

    editQuestion: function(id) {
        try {
            const question = QUESTIONS.find(q => q.id === id);
            if (!question) {
                throw new Error('Question not found');
            }

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
                question.text = document.getElementById('editQuestionText')?.value || '';
                question.placeholder = document.getElementById('editQuestionPlaceholder')?.value || '';
                question.required = document.getElementById('editQuestionRequired')?.checked || false;
                question.allowImage = document.getElementById('editQuestionAllowImage')?.checked || false;

                if (!question.text.trim()) {
                    alert('Spørsmålstekst kan ikke være tom');
                    return;
                }

                this.saveQuestions();
                this.updateQuestionList();
                modal.remove();
            });
        } catch (error) {
            console.error('Edit question error:', error);
            this.showNotification('Kunne ikke redigere spørsmål', 'error');
        }
    },

    deleteQuestion: function(id) {
        try {
            if (!confirm('Er du sikker på at du vil slette dette spørsmålet?')) return;
            
            const index = QUESTIONS.findIndex(q => q.id === id);
            if (index !== -1) {
                QUESTIONS.splice(index, 1);
                // Update IDs for remaining questions
                QUESTIONS.forEach((q, i) => q.id = i + 1);
                this.saveQuestions();
                this.updateQuestionList();
                this.showNotification('Spørsmål slettet', 'success');
            }
        } catch (error) {
            console.error('Delete question error:', error);
            this.showNotification('Kunne ikke slette spørsmål', 'error');
        }
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
                        <button type="button" class="btn-secondary" 
                                onclick="this.closest('.admin-modal').remove()">
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
        try {
            localStorage.setItem('quizQuestions', JSON.stringify(QUESTIONS));
            this.showNotification('Spørsmål lagret', 'success');
            document.dispatchEvent(new CustomEvent('questionUpdated'));
        } catch (error) {
            console.error('Save questions error:', error);
            this.showNotification('Kunne ikke lagre spørsmål', 'error');
        }
    },

    updateQuestionList: function() {
        try {
            const list = document.getElementById('questionList');
            if (!list) return;

            list.innerHTML = QUESTIONS.map(q => `
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
        } catch (error) {
            console.error('Update question list error:', error);
        }
    },

    toggleStatistics: function() {
        try {
            const statsPanel = document.getElementById('statisticsPanel');
            if (statsPanel) {
                if (statsPanel.style.display === 'none') {
                    statsPanel.style.display = 'block';
                    this.loadStatistics();
                } else {
                    statsPanel.style.display = 'none';
                }
            }
        } catch (error) {
            console.error('Toggle statistics error:', error);
        }
    },

    loadStatistics: function() {
        try {
            const statsContent = document.getElementById('statsContent');
            if (!statsContent) return;

            // Gather statistics
            const stats = {
                totalAnswers: 0,
                averageLength: 0,
                completionRate: 0
            };

            // Get all saved answers
            const savedAnswers = Object.keys(localStorage)
                .filter(key => key.startsWith('quizState'))
                .map(key => {
                    try {
                        return JSON.parse(localStorage.getItem(key));
                    } catch {
                        return null;
                    }
                })
                .filter(Boolean);

            if (savedAnswers.length > 0) {
                stats.totalAnswers = savedAnswers.length;
                
                // Calculate average answer length
                const totalLength = savedAnswers.reduce((acc, curr) => {
                    return acc + Object.values(curr.answers || {}).reduce((sum, answer) => 
                        sum + (answer ? answer.length : 0), 0);
                }, 0);
                
                stats.averageLength = Math.round(totalLength / stats.totalAnswers);
                
                // Calculate completion rate
                const completedAnswers = savedAnswers.filter(data => 
                    Object.keys(data.answers || {}).length === QUESTIONS.length
                ).length;
                
                stats.completionRate = Math.round((completedAnswers / stats.totalAnswers) * 100);
            }

            // Display statistics
            statsContent.innerHTML = `
                <div class="stat-item">
                    <span>Totale besvarelser:</span>
                    <span>${stats.totalAnswers}</span>
                </div>
                <div class="stat-item">
                    <span>Gjennomsnittlig svarlengde:</span>
                    <span>${stats.averageLength} tegn</span>
                </div>
                <div class="stat-item">
                    <span>Fullføringsrate:</span>
                    <span>${stats.completionRate}%</span>
                </div>
            `;
        } catch (error) {
            console.error('Load statistics error:', error);
            this.showNotification('Kunne ikke laste statistikk', 'error');
        }
    },

    showNotification: function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
};

// Initialize admin panel when document is ready
document.addEventListener('DOMContentLoaded', () => ADMIN.initialize());
