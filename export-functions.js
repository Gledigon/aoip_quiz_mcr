// Export and Share Functionality
const EXPORT = {
    initialize: function() {
        try {
            this.addExportButtons();
            this.loadSharedQuiz();
        } catch (error) {
            console.error('Export initialization error:', error);
        }
    },

    addExportButtons: function() {
        try {
            const btnGroup = document.querySelector('.btn-group');
            if (!btnGroup) return;

            btnGroup.insertAdjacentHTML('beforeend', `
                <button type="button" class="btn btn-secondary" onclick="EXPORT.exportToPDF()">
                    Eksporter som PDF
                </button>
                <button type="button" class="btn btn-secondary" onclick="EXPORT.shareViaEmail()">
                    Del via e-post
                </button>
                <button type="button" class="btn btn-secondary" onclick="EXPORT.generateShareableLink()">
                    Generer delbar lenke
                </button>
            `);
        } catch (error) {
            console.error('Add export buttons error:', error);
        }
    },

    exportToPDF: async function() {
        if (!validateForm()) return;

        try {
            // Create content copy for PDF
            const content = document.createElement('div');
            content.className = 'pdf-export';
            
            // Add header
            const groupName = document.getElementById('groupName')?.value || '';
            const date = document.getElementById('date')?.value || '';
            
            content.innerHTML = `
                <div class="pdf-header">
                    <h1>Quiz Besvarelse</h1>
                    <p>Gruppe: ${groupName}</p>
                    <p>Dato: ${date}</p>
                </div>
            `;

            // Add each question and answer
            QUESTIONS.forEach(question => {
                const answer = quizState.answers[question.id] || '';
                const imageData = quizState.images[question.id];

                const questionDiv = document.createElement('div');
                questionDiv.className = 'pdf-question';
                questionDiv.innerHTML = `
                    <h3>Spørsmål ${question.id}</h3>
                    <p class="question-text">${question.text}</p>
                    <div class="answer-text">${answer}</div>
                    ${imageData ? `<img src="${imageData}" alt="Bilde for spørsmål ${question.id}">` : ''}
                `;
                content.appendChild(questionDiv);
            });

            // Show loading screen
            this.showLoadingIndicator('Genererer PDF...');

            // Dynamically load html2pdf
            await this.loadHTML2PDF();

            try {
                const opt = {
                    margin: 1,
                    filename: 'quiz-besvarelse.pdf',
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2 },
                    jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' }
                };

                await html2pdf().set(opt).from(content).save();
                this.showNotification('PDF eksportert!', 'success');
            } catch (error) {
                throw new Error('PDF generering feilet');
            } finally {
                this.hideLoadingIndicator();
            }
        } catch (error) {
            console.error('Export to PDF error:', error);
            this.hideLoadingIndicator();
            this.showNotification('Kunne ikke generere PDF', 'error');
        }
    },

    loadHTML2PDF: function() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
            script.onload = resolve;
            script.onerror = () => reject(new Error('Kunne ikke laste HTML2PDF'));
            document.head.appendChild(script);
        });
    },

    shareViaEmail: function() {
        if (!validateForm()) return;

        try {
            const subject = encodeURIComponent('Quiz Besvarelse');
            const groupName = document.getElementById('groupName')?.value || '';
            const date = document.getElementById('date')?.value || '';
            
            // Generate email content
            let body = `Quiz besvart av ${groupName} (${date})\n\n`;
            
            QUESTIONS.forEach(question => {
                const answer = quizState.answers[question.id] || 'Ikke besvart';
                body += `Spørsmål ${question.id}: ${question.text}\n`;
                body += `Svar: ${answer}\n\n`;
            });

            // Add shareable link
            const shareableLink = this.generateShareableLink(false);
            body += `\nSe besvarelsen online: ${shareableLink}`;

            // Open email client
            window.location.href = `mailto:?subject=${subject}&body=${encodeURIComponent(body)}`;
        } catch (error) {
            console.error('Share via email error:', error);
            this.showNotification('Kunne ikke dele via e-post', 'error');
        }
    },

    generateShareableLink: function(showNotification = true) {
        if (!validateForm()) return;

        try {
            // Generate unique ID for response
            const quizData = {
                groupName: document.getElementById('groupName')?.value || '',
                date: document.getElementById('date')?.value || '',
                answers: quizState.answers,
                images: quizState.images,
                timestamp: new Date().toISOString()
            };

            // Generate unique ID based on content
            const uniqueId = this.generateUniqueId(quizData);
            
            // Save data in localStorage with unique ID
            localStorage.setItem(`shared_quiz_${uniqueId}`, JSON.stringify(quizData));

            // Generate shareable URL
            const shareableUrl = `${window.location.origin}${window.location.pathname}?quiz=${uniqueId}`;

            if (showNotification) {
                // Copy to clipboard
                navigator.clipboard.writeText(shareableUrl)
                    .then(() => this.showNotification('Lenke kopiert til utklippstavlen!', 'success'))
                    .catch(() => this.showNotification('Kunne ikke kopiere lenke', 'error'));
            }

            return shareableUrl;
        } catch (error) {
            console.error('Generate shareable link error:', error);
            this.showNotification('Kunne ikke generere delbar lenke', 'error');
            return '';
        }
    },

    generateUniqueId: function(data) {
        // Generate a simple hash of the data
        const str = JSON.stringify(data);
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(36);
    },

    loadSharedQuiz: function() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const quizId = urlParams.get('quiz');

            if (quizId) {
                const sharedData = localStorage.getItem(`shared_quiz_${quizId}`);
                if (sharedData) {
                    const quizData = JSON.parse(sharedData);
                    
                    // Fill out form
                    const groupNameInput = document.getElementById('groupName');
                    const dateInput = document.getElementById('date');
                    
                    if (groupNameInput) groupNameInput.value = quizData.groupName || '';
                    if (dateInput) dateInput.value = quizData.date || '';
                    
                    // Restore answers and images
                    quizState.answers = quizData.answers || {};
                    quizState.images = quizData.images || {};
                    
                    // Update UI
                    renderQuiz();
                    
                    this.showNotification('Delt quiz lastet!', 'success');
                }
            }
        } catch (error) {
            console.error('Load shared quiz error:', error);
            this.showNotification('Kunne ikke laste delt quiz', 'error');
        }
    },

    showLoadingIndicator: function(message) {
        const loader = document.createElement('div');
        loader.className = 'loading-indicator';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="spinner"></div>
                <p>${message}</p>
            </div>
        `;
        document.body.appendChild(loader);
    },

    hideLoadingIndicator: function() {
        const loader = document.querySelector('.loading-indicator');
        if (loader) {
            loader.remove();
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

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    EXPORT.initialize();
});
