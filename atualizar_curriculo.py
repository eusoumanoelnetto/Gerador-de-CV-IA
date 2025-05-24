import webbrowser
import os
import requests
from playwright.sync_api import sync_playwright
import instaloader

def input_nonempty(prompt):
    while True:
        res = input(prompt).strip()
        if res:
            return res
        print("Não pode deixar vazio, tenta de novo.")

def input_yes_no(prompt):
    while True:
        res = input(prompt + " (s/n): ").strip().lower()
        if res in ('s', 'n'):
            return res == 's'
        print("Só responde com 's' ou 'n'.")

def baixar_imagem(url, caminho):
    try:
        resp = requests.get(url)
        resp.raise_for_status()
        os.makedirs(os.path.dirname(caminho), exist_ok=True)
        with open(caminho, 'wb') as f:
            f.write(resp.content)
        print(f"📥 Imagem salva em {caminho}")
        return True
    except Exception as e:
        print(f"❌ Erro ao baixar imagem: {e}")
        return False

def obter_foto_instagram(username):
    L = instaloader.Instaloader()
    try:
        profile = instaloader.Profile.from_username(L.context, username)
        if profile.is_private:
            print("⚠️ Perfil privado. Não é possível obter a foto automaticamente.")
            return None
        return profile.profile_pic_url
    except Exception as e:
        print(f"❌ Erro ao buscar a foto no Instagram: {e}")
        return None

def obter_foto_url():
    while True:
        print("\nEscolha a rede social para foto de perfil:")
        print("1) Instagram (username)")
        print("2) Facebook (username)")
        print("3) LinkedIn (username)")
        escolha = input_nonempty("Digite 1, 2 ou 3: ")

        username = input_nonempty("Digite seu nome de usuário (sem @): ")

        if escolha == "1":
            url = obter_foto_instagram(username)
            if url:
                local = f"assets/{username}.jpg"
                if baixar_imagem(url, local):
                    return local
                else:
                    print("Usando URL remota em fallback.")
                    return url
            else:
                if input_yes_no("Deseja colar link direto ou tentar outra rede? [s=link/n=outra]"):
                    link = input_nonempty("Cole o link completo da imagem: ")
                    return link
                else:
                    continue
        elif escolha == "2":
            return f"https://graph.facebook.com/{username}/picture?type=large"
        elif escolha == "3":
            return f"https://www.linkedin.com/in/{username}/picture"
        else:
            print("Opção inválida. Tente novamente.")

def coletar_experiencias():
    exps = []
    while True:
        print("\n--- Nova experiência ---")
        titulo = input_nonempty("Cargo / Título: ")
        empresa = input_nonempty("Empresa: ")
        periodo = input_nonempty("Período (ex: Jan 2020 - Dez 2021): ")
        descricao = input_nonempty("Descrição (breve): ")
        exps.append({"titulo": titulo, "empresa": empresa, "periodo": periodo, "descricao": descricao})
        if not input_yes_no("Adicionar outra experiência?"):
            break
    return exps

def coletar_formacoes():
    forms = []
    while True:
        print("\n--- Nova formação ---")
        curso = input_nonempty("Curso / Título: ")
        instituicao = input_nonempty("Instituição: ")
        periodo = input_nonempty("Período (ex: 2017 - 2021): ")
        forms.append({"curso": curso, "instituicao": instituicao, "periodo": periodo})
        if not input_yes_no("Adicionar outra formação?"):
            break
    return forms

def coletar_habilidades():
    print("\n--- Habilidades ---")
    hard = input_nonempty("Habilidades Profissionais (vírgula): ")
    soft = input_nonempty("Habilidades Pessoais (vírgula): ")
    idiomas = input_nonempty("Idiomas (vírgula): ")
    return {"hard": [h.strip() for h in hard.split(",") if h.strip()],
            "soft": [s.strip() for s in soft.split(",") if s.strip()],
            "idiomas": [i.strip() for i in idiomas.split(",") if i.strip()]}

def gerar_html(d):
    exp_html = "".join(
        f"""<div class='w3-container'><h5 class='w3-opacity'><b>{e['titulo']} | {e['empresa']}</b></h5><h6 class='w3-text-teal'><i class='fa fa-calendar fa-fw w3-margin-right'></i>{e['periodo']}</h6><p>{e['descricao']}</p><hr/></div>""" for e in d['experiencias'])
    form_html = "".join(
        f"""<div class='w3-container'><h5 class='w3-opacity'><b>{f['curso']}</b></h5><h6 class='w3-text-teal'><i class='fa fa-calendar fa-fw w3-margin-right'></i>{f['periodo']}</h6><p>{f['instituicao']}</p><hr/></div>""" for f in d['formacoes'])
    hab_html = f"<p><b>Hard Skills:</b> {', '.join(d['habilidades']['hard'])}</p><p><b>Soft Skills:</b> {', '.join(d['habilidades']['soft'])}</p><p><b>Idiomas:</b> {', '.join(d['habilidades']['idiomas'])}</p>"
    return f"""<!DOCTYPE html><html lang='pt-br'><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width,initial-scale=1.0'><title>{d['nome']} - Currículo</title><link rel='stylesheet' href='https://www.w3schools.com/w3css/4/w3.css'><link rel='stylesheet' href='style.css'></head><body class='w3-light-grey'><div class='w3-content w3-margin-top' style='max-width:1400px;'><div class='w3-row-padding'><div class='w3-third'><div class='w3-white w3-text-grey w3-card-4'><div class='w3-display-container'><img src='{d['foto_url']}' style='width:100%' alt='Avatar'><div class='w3-display-bottomleft w3-container w3-text-white'><h2>{d['nome']}</h2></div></div><div class='w3-container'><p><i class='fa fa-briefcase fa-fw w3-margin-right w3-large w3-text-teal'></i>{d['cargo']}</p><p><i class='fa fa-envelope fa-fw w3-margin-right w3-large w3-text-teal'></i>{d['email']}</p><p><i class='fa fa-phone fa-fw w3-margin-right w3-large w3-text-teal'></i>{d['telefone']}</p><hr>{hab_html}</div></div><br><div style='margin-top:20px;text-align:center;'><a href='curriculo.pdf' download class='w3-button w3-black'><i class='fa fa-download'></i> Baixar PDF</a></div></div><div class='w3-twothird'><div class='w3-container w3-card w3-white w3-margin-bottom'><h2 class='w3-text-grey w3-padding-16'><i class='fa fa-suitcase fa-fw w3-margin-right w3-xxlarge w3-text-teal'></i>Experiência</h2>{exp_html}</div><div class='w3-container w3-card w3-white'><h2 class='w3-text-grey w3-padding-16'><i class='fa fa-certificate fa-fw w3-margin-right w3-xxlarge w3-text-teal'></i>Formação</h2>{form_html}</div></div></div></div></body></html>"""

def gerar_pdf(html_file, pdf_file):
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto(f"file://{os.path.abspath(html_file)}")
        page.pdf(path=pdf_file, format="A4")
        browser.close()
    print(f"✅ PDF gerado: {pdf_file}")

def escolher_acao_pos_gerar(html_name):
    pdf_name = 'curriculo.pdf'
    gerar_pdf(html_name, pdf_name)
    while True:
        print("\nO que deseja agora?")
        print("1) Visualizar HTML no navegador")
        print("2) Baixar PDF")
        esc = input_nonempty("Digite 1 ou 2: ")
        if esc == '1':
            webbrowser.open('file://' + os.path.realpath(html_name))
            break
        if esc == '2':
            print(f"🗂️ '{pdf_name}' pronto.")
            break
        print("Opcão inválida, tenta de novo.")

def main():
    print("=== 🧠 Atualizador de Currículo ===")
    nome = input_nonempty("Nome completo: ")
    foto_url = obter_foto_url()
    cargo = input_nonempty("Cargo / profissão: ")
    email = input_nonempty("Email: ")
    telefone = input_nonempty("Telefone: ")
    experiencias = coletar_experiencias()
    formacoes = coletar_formacoes()
    habilidades = coletar_habilidades()
    d = {"nome": nome, "foto_url": foto_url, "cargo": cargo, "email": email, "telefone": telefone, "experiencias": experiencias, "formacoes": formacoes, "habilidades": habilidades}
    if input_yes_no("\nDeseja atualizar o currículo (s/n):"):
        html_file = 'curriculo.html'
        with open(html_file, 'w', encoding='utf-8') as f:
            f.write(gerar_html(d))
        print("\n✅ Currículo atualizado")
        escolher_acao_pos_gerar(html_file)
    else:
        print("🚫 Cancelado.")

if __name__ == '__main__':
    main()
