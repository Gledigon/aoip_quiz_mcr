// Security Configuration
const CONFIG = {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif'],
    maxAnswerLength: 2000,
    maxGroupNameLength: 50
};

// Quiz Questions
const QUESTIONS = [
    {
        id: 1,
        text: "Hvilke porter må være åpne i brannmuren for å motta lyd fra en Tieline Via enhet?",
        placeholder: "Beskriv nødvendige porter og protokoller...",
        allowImage: true,
        required: true
    },
    {
        id: 2,
        text: "Hvordan verifiserer du at du mottar lyd fra en Prodys Quantum sender?",
        placeholder: "Forklar fremgangsmåten for lydverifisering...",
        allowImage: true,
        required: true
    },
    {
        id: 3,
        text: "Hva gjør du hvis lydstrømmen fra en Tieline Via plutselig forsvinner?",
        placeholder: "Beskriv feilsøkingstrinn...",
        allowImage: true,
        required: true
    }
];
