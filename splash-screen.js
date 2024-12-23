document.addEventListener('DOMContentLoaded', function() {
    const splashScreen = document.getElementById('splash-screen');
    const mainContent = document.getElementById('main-content');
    const countdownElement = document.getElementById('countdown');

    // Debugging
    console.log('Splash screen script loaded');

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
            
            splashScreen.style.opacity = '0';
            setTimeout(() => {
                splashScreen.style.display = 'none';
                mainContent.style.display = 'block';
                
                // Ensure quiz is initialized
                console.log('Calling initQuiz()');
                if (typeof initQuiz === 'function') {
                    initQuiz();
                } else {
                    console.error('initQuiz function not found!');
                }
            }, 500);
        }
    }, 1000);
});
