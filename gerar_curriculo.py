import os

# Ler o template
with open('index.html', 'r', encoding='utf-8') as file:
    template = file.read()

# Dados do usuário (Exemplo)
dados = {
    "nome": "Ana Souza",
    "email": "ana.souza@email.com",
    "cidade": "São Paulo, SP",
    "cargo": "Desenvolvedora Full Stack",
    "telefone": "(11) 99999-8888",
    "foto": "ana.jpg",
    "hard_skills": "<ul><li>Python</li><li>React</li><li>Docker</li></ul>",
    "soft_skills": "<ul><li>Comunicação</li><li>Trabalho em equipe</li></ul>",
    "idiomas": "<p>Português - Nativo</p><p>Inglês - Avançado</p>",
    "experiencias": """
        <div>
            <h5 class='w3-opacity'><b>Desenvolvedora | TechX</b></h5>
            <h6 class='w3-text-teal'><i class='fa fa-calendar fa-fw w3-margin-right'></i>2022 - Atual</h6>
            <p>Desenvolvimento de aplicações web modernas.</p>
            <hr>
        </div>
    """,
    "formacao": """
        <div>
            <h5 class='w3-opacity'><b>Engenharia de Computação | USP</b></h5>
            <h6 class='w3-text-teal'><i class='fa fa-calendar fa-fw w3-margin-right'></i>2018 - 2022</h6>
            <p>Graduação em Engenharia de Computação.</p>
            <hr>
        </div>
    """,
    "certificados": "<ul><li>Certificação AWS</li><li>Scrum Master</li></ul>",
    "projetos": "<ul><li>App de Delivery</li><li>Site de Portfólio</li></ul>",
    "pdf_link": "ana_souza_cv.pdf",
    "linkedin": "https://linkedin.com/in/ana-souza",
    "instagram": "https://instagram.com/ana.souza",
    "github": "https://github.com/ana-souza",
    "assinatura": "Gerado por Ana Souza"
}

# Substituir os placeholders
for key, value in dados.items():
    template = template.replace(f'{{{{{key}}}}}', value)

# Salvar o currículo novo
output_path = 'curriculo.html'
with open(output_path, 'w', encoding='utf-8') as output_file:
    output_file.write(template)

print(f"✅ Currículo gerado com sucesso em: {os.path.abspath(output_path)}")
