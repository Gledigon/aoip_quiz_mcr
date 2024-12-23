// Splash Screen Controller
const SPLASH = {
    countdown: 4,
    initialize: function() {
        try {
            const splashScreen = document.getElementById('splash-screen');
            const mainContent = document.getElementById('main-content');
            const countdownElement = document.getElementById('countdown');

            if (!splashScreen || !mainContent || !countdownElement) {
                throw new Error('Required elements not found');
            }

            // Show splash screen and hide main content initially
            splashScreen.style.display = 'flex';
            mainContent.style.display = 'none';

            // Start countdown
            this.startCountdown(splashScreen, mainContent, countdownElement);
        } catch (error) {
            console.error('Splash screen initialization error:', error);
            this.handleError();
        }
    },

    startCountdown: function(splashScreen, mainContent, countdownElement) {
        let countdown = this.countdown;
        
        const countdownInterval = setInterval(() => {
            try {
                countdown--;
                if (countdownElement) {
                    countdownElement.textContent = countdown;
                }

                if (countdown <= 0) {
                    clearInterval(countdownInterval);
                    this.transitionToMain(splashScreen, mainContent);
                }
            } catch (error) {
                console.error('Countdown error:', error);
                clearInterval(countdownInterval);
                this.handleError();
            }
        }, 1000);

        // Failsafe: Force transition after 6 seconds
        setTimeout(() => {
            if (splashScreen.style.display !== 'none') {
                clearInterval(countdownInterval);
                this.transitionToMain(splashScreen, mainContent);
            }
        }, 6000);
    },

    transitionToMain: function(splashScreen, mainContent) {
        try {
            // Fade out splash screen
            splashScreen.style.opacity = '0';
            
            // Show main content after fade
            setTimeout(() => {
                splashScreen.style.display = 'none';
                mainContent.style.display = 'block';
                
                // Initialize quiz if available
                if (typeof initQuiz === 'function') {
                    initQuiz();
                } else {
                    console.warn('initQuiz function not found');
                }

                // Dispatch event for other components
                document.dispatchEvent(new CustomEvent('splashScreenComplete'));
            }, 500);
        } catch (error) {
            console.error('Transition error:', error);
            this.handleError();
        }
    },

    handleError: function() {
        // In case of error, just show the main content
        try {
            const splashScreen = document.getElementById('splash-screen');
            const mainContent = document.getElementById('main-content');

            if (splashScreen) splashScreen.style.display = 'none';
            if (mainContent) mainContent.style.display = 'block';

            if (typeof initQuiz === 'function') {
                initQuiz();
            }
        } catch (error) {
            console.error('Error recovery failed:', error);
        }
    },

    // Skip splash screen if needed (e.g., for automated testing)
    skip: function() {
        this.handleError();
    }
};

// Initialize splash screen when document is ready
document.addEventListener('DOMContentLoaded', () => SPLASH.initialize());

// Listen for errors during initialization
window.addEventListener('error', () => SPLASH.handleError());
