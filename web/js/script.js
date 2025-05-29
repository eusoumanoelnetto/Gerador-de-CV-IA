const chat = document.getElementById('chat');
const userInput = document.getElementById('userInput');
const previewContainer = document.getElementById('preview-container');
const curriculoPreview = document.getElementById('curriculo-preview');

let curriculo = {
    nome: '',
    cargo: '',
    email: '',
    telefone: '',
    experiencias: [],
    formacoes: [],
    hard: '',
    soft: '',
    idiomas: ''
};

let etapa = 0;

window.onload = () => {
    botMessage("Olá! Vamos criar seu currículo. Qual seu nome completo?");
};

function handleUserInput() {
    const input = userInput.value.trim();
    if (!input) return;
    addMessage(input, 'user');
    userInput.value = '';
    processInput(input);
}

function botMessage(message) {
    const msg = document.createElement('div');
    msg.className = 'message bot';
    msg.innerText = '...';
    chat.appendChild(msg);
    chat.scrollTop = chat.scrollHeight;

    setTimeout(() => {
        msg.innerText = message;
    }, 500);
}

function addMessage(message, sender) {
    const msg = document.createElement('div');
    msg.className = `message ${sender}`;
    msg.innerText = message;
    chat.appendChild(msg);
    chat.scrollTop = chat.scrollHeight;
}

function processInput(input) {
    switch(etapa) {
        case 0:
            curriculo.nome = input;
            botMessage("Perfeito! Qual seu cargo?");
            etapa++;
            break;
        case 1:
            curriculo.cargo = input;
            botMessage("Digite seu e-mail:");
            etapa++;
            break;
        case 2:
            curriculo.email = input;
            botMessage("Digite seu telefone:");
            etapa++;
            break;
        case 3:
            curriculo.telefone = input;
            botMessage("Agora me fale sua primeira experiência (Cargo, Empresa, Período, Descrição):");
            etapa++;
            break;
        case 4:
            curriculo.experiencias.push(input);
            botMessage("Quer adicionar mais uma experiência? (sim/não)");
            etapa++;
            break;
        case 5:
            if (input.toLowerCase() === 'sim') {
                etapa = 4;
                botMessage("Ok, me fale a experiência:");
            } else {
                botMessage("Agora sua formação (Curso, Instituição, Período):");
                etapa++;
            }
            break;
        case 6:
            curriculo.formacoes.push(input);
            botMessage("Quer adicionar mais uma formação? (sim/não)");
            etapa++;
            break;
        case 7:
            if (input.toLowerCase() === 'sim') {
                etapa = 6;
                botMessage("Ok, me fale a formação:");
            } else {
                botMessage("Liste suas hard skills (separadas por vírgula):");
                etapa++;
            }
            break;
        case 8:
            curriculo.hard = input;
            botMessage("Agora suas soft skills (separadas por vírgula):");
            etapa++;
            break;
        case 9:
            curriculo.soft = input;
            botMessage("Quais idiomas você fala? (separados por vírgula):");
            etapa++;
            break;
        case 10:
            curriculo.idiomas = input;
            botMessage("Perfeito! Gerando preview do seu currículo...");
            setTimeout(() => {
                gerarPreview();
            }, 1000);
            break;
    }
}

function gerarPreview() {
    previewContainer.style.display = 'block';
    curriculoPreview.innerHTML = `
        <h1>Currículo ${curriculo.nome}</h1>
        <p><b>Cargo:</b> ${curriculo.cargo}</p>
        <p><b>Email:</b> ${curriculo.email}</p>
        <p><b>Telefone:</b> ${curriculo.telefone}</p>
        <h2>Experiências</h2>
        <ul>${curriculo.experiencias.map(e => `<li>${e}</li>`).join('')}</ul>
        <h2>Formação</h2>
        <ul>${curriculo.formacoes.map(f => `<li>${f}</li>`).join('')}</ul>
        <h2>Habilidades</h2>
        <p><b>Hard Skills:</b> ${curriculo.hard}</p>
        <p><b>Soft Skills:</b> ${curriculo.soft}</p>
        <p><b>Idiomas:</b> ${curriculo.idiomas}</p>
    `;
}

function baixarPDF() {
    const opt = {
        margin: 0.5,
        filename: `curriculo-${curriculo.nome}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().from(curriculoPreview).set(opt).save();
}
