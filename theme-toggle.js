// Theme management
const THEME = {
    initialize: function() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;

        // Initialiser tema fra localStorage
        const savedTheme = localStorage.getItem('quizTheme') || 'dark';
        this.applyTheme(savedTheme);
        
        // Sett opp click handler
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            this.applyTheme(newTheme);
        });

        // Sett opp keyboard shortcut (Alt + T)
        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.key === 't') {
                e.preventDefault();
                themeToggle.click();
            }
        });
    },

    applyTheme: function(theme) {
        const html = document.documentElement;
        const themeToggle = document.getElementById('theme-toggle');
        
        // Oppdater classList
        html.classList.remove('dark', 'light');
        html.classList.add(theme);
        
        // Oppdater toggle-ikonet
        if (themeToggle) {
            themeToggle.innerHTML = theme === 'dark' 
                ? '<i class="fas fa-sun"></i>' 
                : '<i class="fas fa-moon"></i>';
        }
        
        // Lagre valget
        localStorage.setItem('quizTheme', theme);
        
        // Dispatch en custom event for andre komponenter
        document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    }
};

// Initialiser tema når dokumentet er klart
document.addEventListener('DOMContentLoaded', () => THEME.initialize());
