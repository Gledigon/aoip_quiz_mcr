// Security Configuration
const CONFIG = {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif'],
    maxAnswerLength: 2000,
    maxGroupNameLength: 50
};

// Quiz Questions
const questions = [
    {
        id: 1,
        text: "Toby er onsite i oppgjøret mellom Gneist - Jubb FK. Han har med seg en via Tieline, men mener noen porter må være stengt i brannmuren for å motta lyd fra en Tieline Via enhet?",
        allowImage: true
    },
    {
        id: 2,
        text: "Hvordan verifiserer du at du mottar lyd fra en Prodys Quantum sender?",
        allowImage: true
    },
    {
        id: 3,
        text: "Hva gjør du hvis lydstrømmen fra en Tieline Via plutselig forsvinner?",
        allowImage: true
    }
];
