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

document.addEventListener("DOMContentLoaded", () => {
  addBotMessage("Sed ut perspiciatis unde mnis iste natus error sit?");
  addUserMessage("Nemo enim ipsam voluptatem quia voluptas");
  addBotMessage("Sed ut perspiciatis unde mnis iste natus error sit?");

  // Enviar com Enter
  document.getElementById('chatbot-input').addEventListener("keydown", function(e){
    if(e.key === "Enter") handleSend();
  });
});

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

// Função para adicionar mensagens ao chat com avatar
function addMessage(text, sender = "bot") {
    const chat = document.getElementById('chat');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);

    if (sender === "bot") {
        messageDiv.innerHTML = `
            <img src="assets/avatar.gif" class="avatar-bubble" alt="Bot">
            <span>${text}</span>
        `;
    } else {
        messageDiv.innerHTML = `
            <span>${text}</span>
            <img src="assets/user.png" class="avatar-bubble user-avatar" alt="Usuário">
        `;
    }
    chat.appendChild(messageDiv);
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

// Função de resposta simples do bot
function respostaBot(userText) {
    // Exemplo de respostas automáticas (personalize conforme seu projeto)
    let resposta = "";
    const lower = userText.toLowerCase();

    if (lower.includes("currículo") || lower.includes("cv")) {
        resposta = "Posso gerar um currículo pra você! Me envie suas informações ou escolha um modelo.";
    } else if (lower.includes("oi") || lower.includes("olá")) {
        resposta = "Oi! Em que posso ajudar você hoje?";
    } else if (lower.includes("pdf")) {
        resposta = "Assim que terminar, clique em 'Baixar PDF' para exportar seu currículo.";
    } else {
        resposta = "Não entendi muito bem. Tente ser mais específico ou peça para gerar seu currículo!";
    }

    addMessage(resposta, "bot");
}

// Função para abrir o preview do currículo
function abrirPreview(dados) {
    localStorage.setItem('dadosCurriculo', JSON.stringify(dados));
    window.open('preview.html', '_blank');
}

// js/script.js

// --- CHAT: MANTENHA O SEU CÓDIGO ATUAL AQUI ---
// Só adicione/ajuste a função finalizarChat e a função mostrarPreviewNoIndex abaixo!

// EXEMPLO: quando quiser mostrar o preview (chame isso ao finalizar o chat)
function finalizarChat(dadosCurriculo) {
    // Salve os dados no localStorage igual ao preview.html
    localStorage.setItem('dadosCurriculo', JSON.stringify(dadosCurriculo));
    mostrarPreviewNoIndex();
}

// Função que insere o preview HTML fiel
function mostrarPreviewNoIndex() {
  fetch('preview.html')
    .then(response => response.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Extrai o conteúdo principal do preview.html
      const conteudoPreview = doc.querySelector('body').innerHTML;

      // Insere o conteúdo completo no preview-area do index.html
      document.getElementById('preview-area').innerHTML = conteudoPreview;

      // Executa script do preview.html para preencher dados automaticamente
      const script = document.createElement('script');
      script.textContent = `
        const dados = JSON.parse(localStorage.getItem('dadosCurriculo'));
        if (dados) {
          document.querySelectorAll('#nome-placeholder').forEach(el => el.innerText = dados.nome);
          document.querySelectorAll('#nome-placeholder2').forEach(el => el.innerText = dados.nome);
          document.getElementById('cargo-placeholder').innerText = dados.cargo;
          document.getElementById('email-placeholder').innerText = dados.email;
          document.getElementById('telefone-placeholder').innerText = dados.telefone;
          document.getElementById('hard-placeholder').innerText = Array.isArray(dados.hardSkills) ? dados.hardSkills.join(', ') : dados.hardSkills;
          document.getElementById('soft-placeholder').innerText = Array.isArray(dados.softSkills) ? dados.softSkills.join(', ') : dados.softSkills;
          document.getElementById('idiomas-placeholder').innerText = Array.isArray(dados.idiomas) ? dados.idiomas.join(', ') : dados.idiomas;

          const exp = (dados.experiencias || []).map(e => '<li>' + e + '</li>').join('');
          document.getElementById('exp-placeholder').innerHTML = exp;

          const form = (dados.formacoes || []).map(f => '<li>' + f + '</li>').join('');
          document.getElementById('form-placeholder').innerHTML = form;

          if (dados.foto && document.querySelector('img.profile-img')) {
              document.querySelector('img.profile-img').src = dados.foto;
          }
        }
      `;
      document.getElementById('preview-area').appendChild(script);
    })
    .catch(error => console.error('Erro ao carregar preview:', error));
}


// EXEMPLO DE USO NA FINALIZAÇÃO DO CHAT:
/*
finalizarChat({
    nome: "Tony Stark",
    cargo: "Gênio, Bilionário, Playboy, Filantropo",
    email: "tony@starkindustries.com",
    telefone: "9999-9999",
    hardSkills: ["Inventor", "Engenharia", "IA", "Combate"],
    softSkills: ["Liderança", "Criatividade"],
    idiomas: ["Inglês", "Português"],
    experiencias: ["CEO Stark Industries", "Vingadores"],
    formacoes: ["MIT Engenharia", "Pós em Física"],
    foto: "assets/tony.png"
});
*/

// Exemplo de chamada ao finalizar a coleta dos dados no chatbot:
// const dados = {
//     nome: "Manoel Neto",
//     cargo: "IA Agent | Software Engineer | Cybersecurity Student",
//     email: "manoelccoelho@gmail.com",
//     telefone: "+55 00 00000-0000",
//     hardSkills: ["IA Generativa", "Python", "Git", "AWS", "Azure"],