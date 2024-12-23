// Export and Share Functionality
const EXPORT = {
    initialize: function() {
        this.addExportButtons();
    },

    addExportButtons: function() {
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
    },

    exportToPDF: async function() {
        // Sjekk om vi har svar å eksportere
        if (!validateForm()) return;

        try {
            // Lag en kopi av innholdet for PDF
            const content = document.createElement('div');
            content.className = 'pdf-export';
            
            // Legg til header
            content.innerHTML = `
                <div class="pdf-header">
                    <h1>Quiz Besvarelse</h1>
                    <p>Gruppe: ${document.getElementById('groupName').value}</p>
                    <p>Dato: ${document.getElementById('date').value}</p>
                </div>
            `;

            // Legg til hvert spørsmål og svar
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

            // Generer PDF
            const element = content;
            const opt = {
                margin: 1,
                filename: 'quiz-besvarelse.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'cm', format: 'a4', orientation: 'portrait' }
            };

            // Vis lasteskjerm
            this.showLoadingIndicator('Genererer PDF...');

            // Last inn html2pdf dynamisk
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
            script.onload = async () => {
                try {
                    await html2pdf().set(opt).from(element).save();
                    this.hideLoadingIndicator();
                    this.showNotification('PDF eksportert!', 'success');
                } catch (error) {
                    console.error('PDF generering feilet:', error);
                    this.hideLoadingIndicator();
                    this.showNotification('Kunne ikke generere PDF', 'error');
                }
            };
            document.head.appendChild(script);
        } catch (error) {
            console.error('Eksport feilet:', error);
            this.hideLoadingIndicator();
            this.showNotification('Eksport feilet', 'error');
        }
    },

    shareViaEmail: function() {
        if (!validateForm()) return;

        const subject = encodeURIComponent('Quiz Besvarelse');
        const groupName = document.getElementById('groupName').value;
        const date = document.getElementById('date').value;
        
        // Generer e-postinnhold
        let body = `Quiz besvart av ${groupName} (${date})\n\n`;
        
        QUESTIONS.forEach(question => {
            const answer = quizState.answers[question.id] || 'Ikke besvart';
            body += `Spørsmål ${question.id}: ${question.text}\n`;
            body += `Svar: ${answer}\n\n`;
        });

        // Legg til delbar lenke
        const shareableLink = this.generateShareableLink(false);
        body += `\nSe besvarelsen online: ${shareableLink}`;

        // Åpne e-postklient
        window.location.href = `mailto:?subject=${subject}&body=${encodeURIComponent(body)}`;
    },

    generateShareableLink: function(showNotification = true) {
        if (!validateForm()) return;

        // Generer unik ID for besvarelsen
        const quizData = {
            groupName: document.getElementById('groupName').value,
            date: document.getElementById('date').value,
            answers: quizState.answers,
            images: quizState.images,
            timestamp: new Date().toISOString()
        };

        // Generer unik ID basert på innholdet
        const uniqueId = this.generateUniqueId(quizData);
        
        // Lagre data i localStorage med unik ID
        localStorage.setItem(`shared_quiz_${uniqueId}`, JSON.stringify(quizData));

        // Generer delbar URL
        const shareableUrl = `${window.location.origin}${window.location.pathname}?quiz=${uniqueId}`;

        if (showNotification) {
            // Kopier til utklippstavle
            navigator.clipboard.writeText(shareableUrl)
                .then(() => this.showNotification('Lenke kopiert til utklippstavlen!', 'success'))
                .catch(() => this.showNotification('Kunne ikke kopiere lenke', 'error'));
        }

        return shareableUrl;
    },

    generateUniqueId: function(data) {
        // Generer en enkel hash av dataen
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
        const urlParams = new URLSearchParams(window.location.search);
        const quizId = urlParams.get('quiz');

        if (quizId) {
            const sharedData = localStorage.getItem(`shared_quiz_${quizId}`);
            if (sharedData) {
                try {
                    const quizData = JSON.parse(sharedData);
                    
                    // Fyll ut skjema
                    document.getElementById('groupName').value = quizData.groupName;
                    document.getElementById('date').value = quizData.date;
                    
                    // Gjenopprett svar og bilder
                    quizState.answers = quizData.answers;
                    quizState.images = quizData.images;
                    
                    // Oppdater UI
                    renderQuiz();
                    
                    this.showNotification('Delt quiz lastet!', 'success');
                } catch (error) {
                    console.error('Kunne ikke laste delt quiz:', error);
                    this.showNotification('Kunne ikke laste delt quiz', 'error');
                }
            }
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
    EXPORT.loadSharedQuiz(); // Sjekk om dette er en delt quiz
});