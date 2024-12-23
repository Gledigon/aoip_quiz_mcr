// Hardcoded Questions
var questions = [
    {
        id: 1,
        text: "Hvilke porter må være åpne i brannmuren for å motta lyd fra en Tieline Via enhet?",
        placeholder: "Beskriv nødvendige porter og protokoller..."
    },
    {
        id: 2,
        text: "Hvordan verifiserer du at du mottar lyd fra en Prodys Quantum sender?",
        placeholder: "Forklar fremgangsmåten for lydverifisering..."
    },
    {
        id: 3,
        text: "Hva gjør du hvis lydstrømmen fra en Tieline Via plutselig forsvinner?",
        placeholder: "Beskriv feilsøkingstrinn..."
    }
];

// Sanitize Input
function sanitizeInput(element) {
    const clean = element.value.replace(/[<>]/g, '');
    if (clean !== element.value) {
        element.value = clean;
    }
}

// Validate Form
function validateForm(event) {
    if (event) event.preventDefault();
    
    const groupName = document.getElementById('groupName').value;
    const date = document.getElementById('date').value;

    if (!groupName || !date) {
        alert('Vennligst fyll ut alle påkrevde felt');
        return false;
    }

    return true;
}

// Print Function
function validateAndPrint() {
    if (validateForm()) {
        window.print();
    }
}

// Initialize Quiz
function initQuiz() {
    console.log('Initiating quiz...');
    const container = document.getElementById('questionContainer');
    
    if (!container) {
        console.error('FEIL: Kan ikke finne spørsmålsbeholderen!');
        return;
    }

    // Clear any existing content
    container.innerHTML = '';

    // Create question cards
    questions.forEach((question, index) => {
        const card = document.createElement('div');
        card.className = 'question-card';
        card.innerHTML = `
            <div class="question-header">
                <div class="question-number">${index + 1}</div>
                <div class="question-text">${question.text}</div>
            </div>
            <textarea 
                id="answer-${question.id}" 
                placeholder="${question.placeholder}"
                style="width: 100%; height: 200px;"
            ></textarea>
        `;
        container.appendChild(card);
    });

    console.log('Quiz initialized with ' + questions.length + ' questions');
}

// Multiple initialization methods
document.addEventListener('DOMContentLoaded', initQuiz);
window.addEventListener('load', initQuiz);
