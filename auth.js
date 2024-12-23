// Authentication handling
const AUTH = {
    QUIZ_PASSWORD: 'mcr!',
    ADMIN_PASSWORD: 'tv2tv2',
    
    initialize: function() {
        if (!this.isAuthenticated()) {
            this.showLoginModal();
        }
        this.setupAdminCheck();
    },

    isAuthenticated: function() {
        return localStorage.getItem('quizAuth') === 'true';
    },

    isAdmin: function() {
        return localStorage.getItem('isAdmin') === 'true';
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

    showAdminLogin: function() {
        if (this.isAdmin()) return;
        
        const modal = document.createElement('div');
        modal.className = 'auth-modal';
        modal.innerHTML = `
            <div class="auth-content">
                <h2>Admin Innlogging</h2>
                <form id="adminLoginForm" onsubmit="return AUTH.validateAdminLogin(event)">
                    <div class="form-group">
                        <label for="adminPassword">Admin Passord</label>
                        <input 
                            type="password" 
                            id="adminPassword" 
                            required
                            autocomplete="current-password"
                        >
                    </div>
                    <div class="error-message" id="adminLoginError"></div>
                    <div class="button-group">
                        <button type="submit" class="btn">Logg inn</button>
                        <button type="button" class="btn-secondary" onclick="AUTH.closeAdminLogin()">
                            Avbryt
                        </button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        // Focus on admin password input
        setTimeout(() => {
            document.getElementById('adminPassword')?.focus();
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

    validateAdminLogin: function(event) {
        event.preventDefault();
        const password = document.getElementById('adminPassword')?.value;
        
        if (password === this.ADMIN_PASSWORD) {
            try {
                localStorage.setItem('isAdmin', 'true');
                const modal = document.querySelector('.auth-modal');
                if (modal) modal.remove();
                location.reload();
            } catch (error) {
                console.error('Admin login error:', error);
                this.showNotification('Kunne ikke logge inn som admin', 'error');
            }
        } else {
            const errorDiv = document.getElementById('adminLoginError');
            if (errorDiv) {
                errorDiv.textContent = 'Feil admin passord';
                errorDiv.style.display = 'block';
            }
            const passwordInput = document.getElementById('adminPassword');
            if (passwordInput) {
                passwordInput.value = '';
                passwordInput.focus();
            }
        }
        return false;
    },

    setupAdminCheck: function() {
        // Admin shortcut (Ctrl + Alt + A)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.altKey && e.key === 'a') {
                e.preventDefault();
                if (!this.isAdmin()) {
                    this.showAdminLogin();
                }
            }
        });

        // Show admin panel if already logged in
        if (this.isAdmin()) {
            const adminPanel = document.getElementById('adminPanel');
            if (adminPanel) {
                adminPanel.style.display = 'block';
            }
        }
    },

    closeAdminLogin: function() {
        const modal = document.querySelector('.auth-modal');
        if (modal) modal.remove();
    },

    logout: function() {
        if (confirm('Er du sikker på at du vil logge ut?')) {
            try {
                localStorage.removeItem('quizAuth');
                localStorage.removeItem('isAdmin');
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
