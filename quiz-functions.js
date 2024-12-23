// Simplified Quiz Functions with Image Support
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

function createImageContainer(questionId) {
    const container = document.createElement('div');
    container.id = `image-container-${questionId}`;
    container.className = 'image-container';
    return container;
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

function initQuiz() {
    const container = document.getElementById('questionContainer');
    
    if (!container) {
        alert('Feil: Finner ikke spørsmålsbeholderen!');
        return;
    }

    container.innerHTML = ''; // Tøm tidligere innhold

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
        `;
        container.appendChild(card);

        // Add file upload option
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.marginTop = '10px';
        fileInput.onchange = function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const container = document.getElementById(`image-container-${question.id}`);
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
                        fileInput.value = ''; // Reset file input
                    };

                    container.appendChild(img);
                    container.appendChild(removeBtn);
                };
                reader.readAsDataURL(file);
            }
        };
        card.appendChild(fileInput);
    });
}

// Kjør initialisering når dokumentet er lastet
document.addEventListener('DOMContentLoaded', initQuiz);
