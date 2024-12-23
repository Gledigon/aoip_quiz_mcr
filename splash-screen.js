document.addEventListener('DOMContentLoaded', function() {
    const splashScreen = document.getElementById('splash-screen');
    const mainContent = document.getElementById('main-content');
    const countdownElement = document.getElementById('countdown');

    // Show splash screen and hide main content initially
    splashScreen.style.display = 'flex';
    mainContent.style.display = 'none';

    // Countdown logic
    let countdown = 4;
    const countdownInterval = setInterval(() => {
        countdown--;
        countdownElement.textContent = countdown;

        if (countdown <= 0) {
            clearInterval(countdownInterval);
            
            // Fade out splash screen
            splashScreen.style.opacity = '0';
            
            // Show main content after fade
            setTimeout(() => {
                splashScreen.style.display = 'none';
                mainContent.style.display = 'block';
                
                // Initialize quiz if not already done
                if (typeof initQuiz === 'function') {
                    initQuiz();
                } else {
                    console.error('initQuiz function not found!');
                }
            }, 500);
        }
    }, 1000);
});
