// Security and Configuration
const CONFIG = {
    maxFileSize: 10 * 1024 * 1024, // Increased to 10MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    maxAnswerLength: 10000, // Increased to 10,000 characters
    maxGroupNameLength: 50,
    autoSaveInterval: 30000, // Auto-save every 30 seconds
    timeLimitMinutes: 120, // 2-hour time limit
    darkMode: true
};

// Enhanced Quiz Questions with More Context
const questions = [
    {
        id: 1,
        text: "Hvilke porter må være åpne i brannmuren for å motta lyd fra en Tieline Via enhet? Gi en detaljert teknisk forklaring som inkluderer protokoller, potensielle sikkerhetshensyn og beste praksis for nettverkskonfigurasjon.",
        allowImage: true,
        placeholder: "Skriv en grundig teknisk redegjørelse som dekker alle aspekter ved portåpning og sikkerhet...",
        helpText: "Tenk på TCP/UDP-porter, sikkerhetsprotokoller, og hvordan disse påvirker lydoverføring."
    },
    {
        id: 2,
        text: "Hvordan verifiserer du at du mottar lyd fra en Prodys Quantum sender? Beskriv en komplett feilsøkingsprosess med tekniske detaljer, mulige feilscenarier og løsningsstrategier.",
        allowImage: true,
        placeholder: "Beskriv en systematisk tilnærming til lydverifisering, inkludert tekniske verktøy og metoder...",
        helpText: "Inkluder nettverksdiagnostikk, audiostreaming-protokoller og spesifikke Prodys Quantum-funksjoner."
    },
    {
        id: 3,
        text: "Hva gjør du hvis lydstrømmen fra en Tieline Via plutselig forsvinner? Presenter en omfattende feilsøkingsplan som dekker tekniske, nettverksrelaterte og utstyrsmessige aspekter.",
        allowImage: true,
        placeholder: "Lag en detaljert, trinnvis feilsøkingsprosedyre som systematisk adresserer mulige årsaker...",
        helpText: "Vurder nettverksinfrastruktur, enhetskonfigurasjon, brannmur og mulige programvarerelaterte problemer."
    }
];

// Enhanced Logging Configuration
const LOGGING_CONFIG = {
    enableClientSideLogging: true,
    logLevel: 'debug', // Options: 'error', 'warn', 'info', 'debug'
    sendLogsToServer: false // Can be enabled with backend support
};

// Accessibility Configuration
const ACCESSIBILITY_CONFIG = {
    enableHighContrastMode: true,
    fontSize: {
        small: 14,
        medium: 16,
        large: 18
    },
    keyboardNavigation: true
};
