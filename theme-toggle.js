// Theme management
const THEME = {
    initialize: function() {
        try {
            const themeToggle = document.getElementById('theme-toggle');
            if (!themeToggle) return;

            // Initialize theme from localStorage
            const savedTheme = localStorage.getItem('quizTheme') || 'dark';
            this.applyTheme(savedTheme);
            
            // Set up click handler
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                this.applyTheme(newTheme);
            });

            // Set up keyboard shortcut (Alt + T)
            document.addEventListener('keydown', (e) => {
                if (e.altKey && e.key === 't') {
                    e.preventDefault();
                    themeToggle.click();
                }
            });
        } catch (error) {
            console.error('Theme initialization error:', error);
        }
    },

    applyTheme: function(theme) {
        try {
            const html = document.documentElement;
            const themeToggle = document.getElementById('theme-toggle');
            
            if (!html || !theme || !['dark', 'light'].includes(theme)) {
                throw new Error('Invalid theme parameters');
            }

            // Update classList
            html.classList.remove('dark', 'light');
            html.classList.add(theme);
            
            // Update toggle icon
            if (themeToggle) {
                themeToggle.innerHTML = theme === 'dark' 
                    ? '<i class="fas fa-sun"></i>' 
                    : '<i class="fas fa-moon"></i>';
            }
            
            // Save preference
            localStorage.setItem('quizTheme', theme);
            
            // Dispatch theme change event
            document.dispatchEvent(new CustomEvent('themeChanged', { 
                detail: { theme },
                bubbles: true,
                cancelable: true
            }));
        } catch (error) {
            console.error('Theme application error:', error);
        }
    },

    // Helper method to get current theme
    getCurrentTheme: function() {
        return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    }
};

// Initialize theme when document is ready
document.addEventListener('DOMContentLoaded', () => THEME.initialize());
