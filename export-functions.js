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
                questionDiv.className = 'p
