// Security and Configuration Settings
const CONFIG = {
    // File upload settings
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif'],
    imageCompressionQuality: 0.7,
    maxImageDimensions: {
        width: 1024,
        height: 1024
    },

    // Form validation settings
    maxAnswerLength: 2000,
    maxGroupNameLength: 50,
    groupNamePattern: '[A-Za-zÆØÅæøå0-9\\s\\-_]{2,50}',
    minDate: '2024-01-01',

    // Storage settings
    storagePrefix: {
        quiz: 'quizState_',
        shared: 'shared_quiz_',
        theme: 'quizTheme',
        auth: 'quizAuth',
        admin: 'isAdmin'
    },

    // Storage version for backwards compatibility
    storageVersion: '1.0',

    // UI settings
    notificationDuration: 3000,
    fadeOutDuration: 300,
    splashScreenDuration: 4000,

    // Test mode settings (for development)
    isTestMode: false,
    skipSplashInTestMode: true
};

// Quiz Questions Configuration
const QUESTIONS = [
    {
        id: 1,
        text: "Toby er onsite med en Via boks, vi kan se Via boksen i Cloud Webgui, men den får ikke koble seg til vårt mottak",
        "Kan det være et nettverks problem. Hvordan går vi frem for å feilsøke problemet", 
        placeholder: "Beskriv nødvendige porter og protokoller...",
        allowImage: true,
        required: true,
        validation: {
            minLength: 10,
            maxLength: CONFIG.maxAnswerLength
        }
    },
    {
        id: 2,
        text: "Hvordan verifiserer du at du mottar lyd fra en Prodys Quantum sender?",
        placeholder: "Forklar fremgangsmåten for lydverifisering...",
        allowImage: true,
        required: true,
        validation: {
            minLength: 10,
            maxLength: CONFIG.maxAnswerLength
        }
    },
    {
        id: 3,
        text: "Hva gjør du hvis lydstrømmen fra en Tieline Via plutselig forsvinner?",
        placeholder: "Beskriv feilsøkingstrinn...",
        allowImage: true,
        required: true,
        validation: {
            minLength: 10,
            maxLength: CONFIG.maxAnswerLength
        }
    }
];

// Validation helper functions
const VALIDATION = {
    validateGroupName: function(name) {
        const regex = new RegExp(`^${CONFIG.groupNamePattern}$`);
        return regex.test(name);
    },

    validateDate: function(date) {
        const inputDate = new Date(date);
        const minDate = new Date(CONFIG.minDate);
        return inputDate >= minDate && inputDate <= new Date();
    },

    validateAnswer: function(answer, questionId) {
        const question = QUESTIONS.find(q => q.id === questionId);
        if (!question) return false;

        const { minLength, maxLength } = question.validation;
        const length = (answer || '').trim().length;
        
        return length >= minLength && length <= maxLength;
    },

    validateImage: function(file) {
        if (!file) return false;
        
        return CONFIG.allowedImageTypes.includes(file.type) && 
               file.size <= CONFIG.maxFileSize;
    }
};

// Export configuration if using modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CONFIG,
        QUESTIONS,
        VALIDATION
    };
}
