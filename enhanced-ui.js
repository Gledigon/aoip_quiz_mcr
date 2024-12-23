// Enhanced UI Features
const UI = {
    initialize: function() {
        this.setupKeyboardShortcuts();
        this.setupDragAndDrop();
        this.setupImageZoom();
    },

    // Keyboard Shortcuts
    setupKeyboardShortcuts: function() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + S to save
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.saveCurrentProgress();
            }
            
            // Alt + N for new question (admin only)
            if (e.altKey && e.key === 'n' && ADMIN.isAdmin()) {
                e.preventDefault();
                ADMIN.addQuestion();
            }

            // Alt + P for print
            if (e.altKey && e.key === 'p') {
                e.preventDefault();
                validateAndPrint();
            }

            // Esc to close modals
            if (e.key === 'Escape') {
                const modal = document.querySelector('.admin-modal');
                if (modal) modal.remove();
            }
        });
    },

    // Drag and Drop
    setupDragAndDrop: function() {
        document.querySelectorAll('.image-upload').forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                zone.classList.add('drag-over');
            });

            zone.addEventListener('dragleave', () => {
                zone.classList.remove('drag-over');
            });

            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('drag-over');
                
                const files = e.dataTransfer.files;
                if (files.length) {
                    const questionId = zone.closest('.question-card')
                        .querySelector('textarea').id.replace('answer-', '');
                    
                    const input = document.getElementById(`image-${questionId}`);
                    input.files = files;
                    input.dispatchEvent(new Event('change'));
                }
            });
        });
    },

    // Image Zoom
    setupImageZoom: function() {
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'IMG' && e.target.closest('.image-preview')) {
                this.toggleImageZoom(e.target);
            }
        });
    },

    toggleImageZoom: function(img) {
        if (img.classList.contains('zoomed')) {
            img.classList.remove('zoomed');
            document.querySelector('.zoom-overlay')?.remove();
        } else {
            const overlay = document.createElement('div');
            overlay.className = 'zoom-overlay';
            
            const zoomedImg = img.cloneNode();
            zoomedImg.classList.add('zoomed');
            
            overlay.appendChild(zoomedImg);
            document.body.appendChild(overlay);

            overlay.addEventListener('click', () => {
                overlay.remove();
                img.classList.remove('zoomed');
            });
        }
    },

    // Save Progress
    saveCurrentProgress: function() {
        const form = document.getElementById('quizForm');
        if (validateForm()) {
            saveState();
            this.showNotification('Fremgang lagret!');
        }
    },

    showNotification: function(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
};

// Initialize enhanced UI features
document.addEventListener('DOMContentLoaded', () => UI.initialize());