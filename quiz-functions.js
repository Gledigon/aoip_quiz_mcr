// Quiz Functions
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

function sanitizeInput(element) {
    const clean = element.value.replace(/[<>]/g, '');
    if (clean !== element.value) {
        element.value = clean;
    }
}

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

function validateAndPrint() {
    if (validateForm()) {
        window.print();
    }
}

function initQuiz() {
    const container = document.getElementById('questionContainer');
    
    // Check if questions are already loaded
    if (container.children.length > 0) {
        console.log('Questions already loaded');
        return;
    }

    if (!container) {
        console.error('Feil: Finner ikke spørsmålsbeholderen!');
        return;
    }

    questions.forEach((question, index) => {
        const card = document.createElement('div');
        card.innerHTML = `
            <h3>Spørsmål ${index + 1}</h3>
            <p>${question.text}</p>
            <textarea 
                id="answer-${question.id}" 
                placeholder="${question.placeholder}"
                style="width: 100%; height: 200px;"
                onpaste="handlePastedImage(event, ${question.id})"
            ></textarea>
            <div id="image-container-${question.id}" class="image-container"></div>
            <input 
                type="file" 
                accept="image/*" 
                style="margin-top: 10px;"
                onchange="handleFileUpload(event, ${question.id})"
            >
        `;
        container.appendChild(card);
    });
}

function handlePastedImage(event, questionId) {
    const items = event.clipboardData.items;
    const container = document.getElementById(`image-container-${questionId}`);

    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
            const blob = items[i].getAsFile();
            const reader = new FileReader();

            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.maxWidth = '100%';
                img.style.maxHeight = '300px';
                img.style.margin = '10px 0';

                const removeBtn = document.createElement('button');
                removeBtn.textContent = 'Fjern bilde';
                removeBtn.onclick = () => {
                    container.removeChild(img);
                    container.removeChild(removeBtn);
                };

                container.appendChild(img);
                container.appendChild(removeBtn);
            };

            reader.readAsDataURL(blob);
        }
    }
}

function handleFileUpload(event, questionId) {
    const file = event.target.files[0];
    const container = document.getElementById(`image-container-${questionId}`);

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.maxWidth = '100%';
            img.style.maxHeight = '300px';
            img.style.margin = '10px 0';

            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Fjern bilde';
            removeBtn.onclick = () => {
                container.removeChild(img);
                container.removeChild(removeBtn);
                event.target.value = ''; // Reset file input
            };

            container.appendChild(img);
            container.appendChild(removeBtn);
        };
        reader.readAsDataURL(file);
    }
}

// Kjør initialisering når dokumentet er lastet
document.addEventListener('DOMContentLoaded', initQuiz);
