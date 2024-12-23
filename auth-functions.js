// Authentication handling
const AUTH = {
    QUIZ_PASSWORD: 'mcr!',
    ADMIN_PASSWORD: 'tv2tv2',
    
    initialize: function() {
        if (!this.isAuthenticated()) {
            this.showLoginModal();
        }
        
        // Setup admin shortcut
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.altKey && e.key === 'a') {
                this.showAdminLogin();
            }
        });
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
    },

    showAdminLogin: function() {
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
    },

    validateQuizLogin: function(event) {
        event.preventDefault();
        const password = document.getElementById('quizPassword').value;
        
        if (password === this.QUIZ_PASSWORD) {
            localStorage.setItem('quizAuth', 'true');
            document.querySelector('.auth-modal').remove();
            location.reload();
        } else {
            const errorDiv = document.getElementById('loginError');
            errorDiv.textContent = 'Feil passord';
            errorDiv.style.display = 'block';
        }
        return false;
    },

    validateAdminLogin: function(event) {
        event.preventDefault();
        const password = document.getElementById('adminPassword').value;
        
        if (password === this.ADMIN_PASSWORD) {
            localStorage.setItem('isAdmin', 'true');
            document.querySelector('.auth-modal').remove();
            location.reload();
        } else {
            const errorDiv = document.getElementById('adminLoginError');
            errorDiv.textContent = 'Feil admin passord';
            errorDiv.style.display = 'block';
        }
        return false;
    },

    closeAdminLogin: function() {
        document.querySelector('.auth-modal').remove();
    },

    logout: function() {
        localStorage.removeItem('quizAuth');
        localStorage.removeItem('isAdmin');
        location.reload();
    }
};

// Initialize authentication on page load
document.addEventListener('DOMContentLoaded', () => AUTH.initialize());