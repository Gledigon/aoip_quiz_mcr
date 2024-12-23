document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Initializing theme from localStorage
    const savedTheme = localStorage.getItem('aoipQuizTheme') || 'dark';
    htmlElement.classList.toggle('dark', savedTheme === 'dark');
    htmlElement.classList.toggle('light', savedTheme === 'light');

    // Update theme toggle icon
    function updateThemeIcon() {
        const isDark = htmlElement.classList.contains('dark');
        themeToggle.innerHTML = isDark 
            ? '<i class="fas fa-sun"></i>' 
            : '<i class="fas fa-moon"></i>';
    }

    // Initial icon set
    updateThemeIcon();

    // Theme toggle functionality
    themeToggle.addEventListener('click', () => {
        htmlElement.classList.toggle('dark');
        htmlElement.classList.toggle('light');

        // Determine current theme
        const newTheme = htmlElement.classList.contains('dark') ? 'dark' : 'light';
        
        // Save to localStorage
        localStorage.setItem('aoipQuizTheme', newTheme);

        // Update icon
        updateThemeIcon();
    });
});
