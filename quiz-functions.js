// Questions
const questions = [
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

    // Ensure container is visible
    container.style.display = 'block';
    container.innerHTML = ''; // Clear previous content

    // Create question cards
    questions.forEach((question, index) => {
        const card = document.createElement('div');
        card.className = 'question-card';
        card.style.backgroundColor = '#1e293b';
        card.style.color = 'white';
        card.style.padding = '15px';
        card.style.marginBottom = '15px';
        card.style.borderRadius = '8px';
        card.innerHTML = `
            <h3 style="color: white; margin-bottom: 10px;">Spørsmål ${index + 1}</h3>
            <p style="margin-bottom: 10px;">${question.text}</p>
            <textarea 
                id="answer-${question.id}" 
                placeholder="${question.placeholder}"
                style="width: 100%; height: 200px; background-color: #2d3748; color: white; border: none; padding: 10px; border-radius: 8px;"
            ></textarea>
        `;
        container.appendChild(card);
    });

    console.log('Quiz initialized with ' + questions.length + ' questions');
}

// Multiple initialization triggers
document.addEventListener('DOMContentLoaded', initQuiz);
window.addEventListener('load', initQuiz);

// Ensure initialization after splash screen
function forceQuizInit() {
    initQuiz();
    console.log('Quiz forcibly initialized');
}
setTimeout(forceQuizInit, 5000);
