const chat = document.getElementById('chat');
const userInput = document.getElementById('userInput');
const previewContainer = document.getElementById('preview-container');
const curriculoPreview = document.getElementById('curriculo-preview');

let dados = {
    nome: "",
    cargo: "",
    email: "",
    telefone: "",
    hardSkills: "",
    softSkills: "",
    idiomas: "",
    experiencias: [],
    formacoes: []
};

let etapa = 0;

window.onload = () => botMessage("Olá! Vamos criar seu currículo. Qual seu nome completo?");

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
            dados.nome = input;
            botMessage("Perfeito! Qual seu cargo?");
            etapa++;
            break;
        case 1:
            dados.cargo = input;
            botMessage("Digite seu e-mail:");
            etapa++;
            break;
        case 2:
            dados.email = input;
            botMessage("Digite seu telefone:");
            etapa++;
            break;
        case 3:
            dados.telefone = input;
            botMessage("Primeira experiência (Cargo, Empresa, Período, Descrição):");
            etapa++;
            break;
        case 4:
            dados.experiencias.push(input);
            botMessage("Adicionar outra experiência? (sim/não)");
            etapa++;
            break;
        case 5:
            if (input.toLowerCase() === 'sim') {
                etapa = 4;
                botMessage("Ok, me fale a experiência:");
            } else {
                botMessage("Primeira formação (Curso, Instituição, Período):");
                etapa++;
            }
            break;
        case 6:
            dados.formacoes.push(input);
            botMessage("Adicionar outra formação? (sim/não)");
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
            dados.hardSkills = input;
            botMessage("Agora suas soft skills (separadas por vírgula):");
            etapa++;
            break;
        case 9:
            dados.softSkills = input;
            botMessage("Quais idiomas você fala? (separados por vírgula):");
            etapa++;
            break;
        case 10:
            dados.idiomas = input;
            botMessage("Perfeito! Gerando preview do seu currículo...");
            setTimeout(() => {
                gerarPreview();
            }, 1000);
            break;
    }
}

function gerarPreview() {
    previewContainer.style.display = 'block';

    document.getElementById('nome-placeholder').innerText = dados.nome;
    document.getElementById('nome-placeholder2').innerText = dados.nome;
    document.getElementById('cargo-placeholder').innerText = dados.cargo;
    document.getElementById('email-placeholder').innerText = dados.email;
    document.getElementById('telefone-placeholder').innerText = dados.telefone;
    document.getElementById('hard-placeholder').innerText = dados.hardSkills;
    document.getElementById('soft-placeholder').innerText = dados.softSkills;
    document.getElementById('idiomas-placeholder').innerText = dados.idiomas;

    document.getElementById('exp-placeholder').innerHTML = dados.experiencias.map(e => `<li>${e}</li>`).join('');
    document.getElementById('form-placeholder').innerHTML = dados.formacoes.map(f => `<li>${f}</li>`).join('');
}

function baixarPDF() {
    const element = document.querySelector('.curriculo');
    html2pdf().from(element).set({
        margin: 0.5,
        filename: `curriculo-${dados.nome}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    }).save();
}
/**
 * Ajusta o preenchimento dos placeholders para usar arrays e formatação igual ao exemplo Python.
 */
function preencherPlaceholders() {
    document.getElementById('nome-placeholder').innerText = dados.nome;
    document.getElementById('nome-placeholder2').innerText = dados.nome;
    document.getElementById('cargo-placeholder').innerText = dados.cargo;
    document.getElementById('email-placeholder').innerText = dados.email;
    document.getElementById('telefone-placeholder').innerText = dados.telefone;

    // Garante que hardSkills, softSkills e idiomas sejam arrays
    const hardSkills = Array.isArray(dados.hardSkills) ? dados.hardSkills : dados.hardSkills.split(',').map(s => s.trim()).filter(Boolean);
    const softSkills = Array.isArray(dados.softSkills) ? dados.softSkills : dados.softSkills.split(',').map(s => s.trim()).filter(Boolean);
    const idiomas = Array.isArray(dados.idiomas) ? dados.idiomas : dados.idiomas.split(',').map(s => s.trim()).filter(Boolean);

    document.getElementById('hard-placeholder').innerText = hardSkills.join(', ');
    document.getElementById('soft-placeholder').innerText = softSkills.join(', ');
    document.getElementById('idiomas-placeholder').innerText = idiomas.join(', ');

    document.getElementById('exp-placeholder').innerHTML = dados.experiencias.map(exp => `
      <div class="w3-container">
        <h5 class="w3-opacity"><b>${exp}</b></h5>
        <hr>
      </div>
    `).join('');

    document.getElementById('form-placeholder').innerHTML = dados.formacoes.map(form => `
      <div class="w3-container">
        <h5 class="w3-opacity"><b>${form}</b></h5>
        <hr>
      </div>
    `).join('');
}

// Chame preencherPlaceholders dentro de gerarPreview
const originalGerarPreview = gerarPreview;
gerarPreview = function() {
    previewContainer.style.display = 'block';
    preencherPlaceholders();
};

function abrirPreview(dados) {
    localStorage.setItem('dadosCurriculo', JSON.stringify(dados));
    window.open('preview.html', '_blank');
}

// Exemplo de chamada ao finalizar a coleta dos dados no chatbot:
// const dados = {
//     nome: "Manoel Neto",
//     cargo: "IA Agent | Software Engineer | Cybersecurity Student",
//     email: "manoelccoelho@gmail.com",
//     telefone: "+55 00 00000-0000",
//     hardSkills: ["IA Generativa", "Python", "Git", "AWS", "Azure"],