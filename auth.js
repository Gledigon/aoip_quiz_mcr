// Authentication handling
const AUTH = {
    QUIZ_PASSWORD: 'mcr!',
    
    initialize: function() {
        if (!this.isAuthenticated()) {
            this.showLoginModal();
        }
    },

    isAuthenticated: function() {
        return localStorage.getItem('quizAuth') === 'true';
    },

    showLoginModal: function() {
        const modal = document.createElement('div');
        modal.className = 'auth-modal';
        modal.innerHTML = `
            <div class="auth-content">
                <h2>Logg inn for å starte quizen</h2>
                <form id="loginForm" onsubmit="return AUTH.validateQuizLogin(event)">
                    <div class="form-group">
                        <label for="quizPassword">Passord</label>
                        <input 
                            type="password" 
                            id="quizPassword" 
                            required
                            autocomplete="current-password"
                        >
                    </div>
                    <div class="error-message" id="loginError"></div>
                    <button type="submit" class="btn">Logg inn</button>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        // Focus on password input
        setTimeout(() => {
            document.getElementById('quizPassword')?.focus();
        }, 100);
    },

    validateQuizLogin: function(event) {
        event.preventDefault();
        const password = document.getElementById('quizPassword')?.value;
        
        if (password === this.QUIZ_PASSWORD) {
            try {
                localStorage.setItem('quizAuth', 'true');
                const modal = document.querySelector('.auth-modal');
                if (modal) modal.remove();
                location.reload();
            } catch (error) {
                console.error('Login error:', error);
                this.showNotification('Kunne ikke logge inn', 'error');
            }
        } else {
            const errorDiv = document.getElementById('loginError');
            if (errorDiv) {
                errorDiv.textContent = 'Feil passord';
                errorDiv.style.display = 'block';
            }
            const passwordInput = document.getElementById('quizPassword');
            if (passwordInput) {
                passwordInput.value = '';
                passwordInput.focus();
            }
        }
        return false;
    },

    logout: function() {
        if (confirm('Er du sikker på at du vil logge ut?')) {
            try {
                localStorage.removeItem('quizAuth');
                location.reload();
            } catch (error) {
                console.error('Logout error:', error);
                this.showNotification('Kunne ikke logge ut', 'error');
            }
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

// Initialize authentication on page load
document.addEventListener('DOMContentLoaded', () => AUTH.initialize());
