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
                <form id="loginForm">
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

        // Add form submit handler
        const form = modal.querySelector('#loginForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.validateQuizLogin();
        });

        // Focus on password input
        setTimeout(() => {
            document.getElementById('quizPassword')?.focus();
        }, 100);
    },

    validateQuizLogin: function() {
        const passwordInput = document.getElementById('quizPassword');
        const errorDiv = document.getElementById('loginError');
        
        if (!passwordInput || !errorDiv) return;

        const password = passwordInput.value;
        
        if (password === this.QUIZ_PASSWORD) {
            try {
                localStorage.setItem('quizAuth', 'true');
                const modal = document.querySelector('.auth-modal');
                if (modal) modal.remove();
                location.reload();
            } catch (error) {
                console.error('Login error:', error);
                errorDiv.textContent = 'Kunne ikke logge inn. Prøv igjen.';
                errorDiv.style.display = 'block';
            }
        } else {
            errorDiv.textContent = 'Feil passord';
            errorDiv.style.display = 'block';
            passwordInput.value = '';
            passwordInput.focus();
        }
    },

    logout: function() {
        if (confirm('Er du sikker på at du vil logge ut?')) {
            try {
                localStorage.removeItem('quizAuth');
                location.reload();
            } catch (error) {
                console.error('Logout error:', error);
                alert('Kunne ikke logge ut. Prøv igjen.');
            }
        }
    }
};

// Initialize authentication on page load
document.addEventListener('DOMContentLoaded', () => AUTH.initialize());
