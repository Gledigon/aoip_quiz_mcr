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
                <div class="quiz-logo">
                    <i class="fas fa-graduation-cap"></i>
                </div>
                <h2>Logg inn for å starte quizen</h2>
                <form id="loginForm">
                    <div class="form-group">
                        <label for="quizPassword">
                            <i class="fas fa-lock"></i> Passord
                        </label>
                        <input 
                            type="password" 
                            id="quizPassword" 
                            required
                            placeholder="Skriv inn passordet"
                        >
                        <div class="error-message" id="loginError"></div>
                    </div>
                    <button type="submit" class="btn">
                        <i class="fas fa-sign-in-alt"></i> Logg inn
                    </button>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        const loginForm = document.getElementById('loginForm');
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.validateQuizLogin();
        });

        const passwordInput = document.getElementById('quizPassword');
        if (passwordInput) {
            passwordInput.focus();
        }
    },

    validateQuizLogin: function() {
        const passwordInput = document.getElementById('quizPassword');
        const password = passwordInput ? passwordInput.value : '';
        
        if (password === this.QUIZ_PASSWORD) {
            localStorage.setItem('quizAuth', 'true');
            const modal = document.querySelector('.auth-modal');
            if (modal) {
                modal.remove();
            }
            window.location.reload();
        } else {
            const errorDiv = document.getElementById('loginError');
            if (errorDiv) {
                errorDiv.textContent = 'Feil passord';
                errorDiv.style.display = 'block';
            }
            if (passwordInput) {
                passwordInput.value = '';
                passwordInput.focus();
            }
        }
    },

    logout: function() {
        if (confirm('Er du sikker på at du vil logge ut?')) {
            localStorage.removeItem('quizAuth');
            window.location.reload();
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    AUTH.initialize();
});
