document.addEventListener('DOMContentLoaded', function() {
    const splashScreen = document.getElementById('splash-screen');
    const mainContent = document.getElementById('main-content');

    // Show splash screen and hide main content initially
    splashScreen.style.display = 'flex';
    mainContent.style.display = 'none';

    // After 4 seconds, hide splash screen and show main content
    setTimeout(() => {
        splashScreen.style.opacity = '0';
        setTimeout(() => {
            splashScreen.style.display = 'none';
            mainContent.style.display = 'block';
            
            // Initialize quiz after splash screen
            initQuiz();
        }, 500); // This matches the CSS transition time
    }, 4000);
});
