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
                <div class="veritas-shield" style="text-align: center; margin-bottom: 2rem;">
                    <i class="fas fa-shield-alt" style="font-size: 3rem; color: var(--harvard-crimson);"></i>
                </div>
                <h2>Velkommen til AoIP Quiz</h2>
                <form id="loginForm">
                    <div class="form-group">
                        <label for="quizPassword">
                            <i class="fas fa-lock"></i> Angi passord
                        </label>
                        <input 
                            type="password" 
                            id="quizPassword" 
                            required
                            placeholder="Skriv inn passordet"
                            autocomplete="current-password"
                        >
                        <div class="error-message" id="loginError"></div>
                    </div>
                    <button type="submit" class="btn">
                        <i class="fas fa-sign-in-alt"></i> Fortsett
                    </button>
                </form>
                <div style="text-align: center; margin-top: 2rem; font-size: 0.9rem; color: var(--text-secondary); font-family: var(--font-serif); font-style: italic;">
                    "Veritas" - I søken etter sannhet
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.validateQuizLogin();
            });
        }

        const passwordInput = document.getElementById('quizPassword');
        if (passwordInput) {
            passwordInput.focus();
            
            // Add enter key support
            passwordInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.validateQuizLogin();
                }
            });
        }
    },

    validateQuizLogin: function() {
        const passwordInput = document.getElementById('quizPassword');
        const errorDiv = document.getElementById('loginError');
        
        if (!passwordInput || !errorDiv) return;

        const password = passwordInput.value.trim();
        
        if (password === this.QUIZ_PASSWORD) {
            try {
                localStorage.setItem('quizAuth', 'true');
                const modal = document.querySelector('.auth-modal');
                if (modal) {
                    // Add fade-out animation
                    modal.style.opacity = '0';
                    setTimeout(() => {
                        modal.remove();
                        window.location.reload();
                    }, 300);
                }
            } catch (error) {
                console.error('Login error:', error);
                this.showError('En feil oppstod ved innlogging. Vennligst prøv igjen.');
            }
        } else {
            this.showError('Feil passord. Vennligst prøv igjen.');
            passwordInput.value = '';
            passwordInput.focus();
        }
    },

    showError: function(message) {
        const errorDiv = document.getElementById('loginError');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            
            // Add shake animation to input
            const passwordInput = document.getElementById('quizPassword');
            if (passwordInput) {
                passwordInput.classList.add('shake');
                setTimeout(() => passwordInput.classList.remove('shake'), 500);
            }
        }
    },

    logout: function() {
        if (confirm('Er du sikker på at du vil logge ut?')) {
            try {
                localStorage.removeItem('quizAuth');
                
                // Add fade-out animation to main content
                const mainContent = document.getElementById('main-content');
                if (mainContent) {
                    mainContent.style.opacity = '0';
                    setTimeout(() => {
                        window.location.reload();
                    }, 300);
                } else {
                    window.location.reload();
                }
            } catch (error) {
                console.error('Logout error:', error);
                alert('Kunne ikke logge ut. Vennligst prøv igjen.');
            }
        }
    },

    // Helper method to check if local storage is available
    isLocalStorageAvailable: function() {
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            return true;
        } catch (e) {
            return false;
        }
    }
};

// Add shake animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
    
    .shake {
        animation: shake 0.5s ease-in-out;
        border-color: var(--harvard-crimson) !important;
    }
`;
document.head.appendChild(style);

// Initialize authentication when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (AUTH.isLocalStorageAvailable()) {
        AUTH.initialize();
    } else {
        alert('Din nettleser støtter ikke lokal lagring. Vennligst aktiver dette eller bruk en annen nettleser.');
    }
});
