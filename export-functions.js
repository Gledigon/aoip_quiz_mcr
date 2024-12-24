// Export and Share Functionality
const EXPORT = {
    initialize: function() {
        try {
            this.loadSharedQuiz();
        } catch (error) {
            console.error('Export initialization error:', error);
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
