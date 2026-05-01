# 📚 StudyFlow

**StudyFlow** é um aplicativo web leve e organizado para auxiliar nos seus estudos, permitindo gerenciar tarefas, anotações ou cronogramas de forma intuitiva. O projeto está estruturado em três versões principais, cada uma com seu propósito específico.

![Status](https://img.shields.io/badge/status-ativo-brightgreen) ![Licença](https://img.shields.io/badge/licença-MIT-blue)

---

## 🌿 Branches e Versões

O repositório contém três branches que representam diferentes formas de uso e distribuição do aplicativo:

---

### 📌 Branch `main`

**Versão:** Modular (HTML/CSS/JS separados)

**Funcionamento:**  
Código fonte organizado em arquivos distintos. Ideal para desenvolvimento, manutenção ou estudo do código.

**Como usar:**  
1. Clone o repositório:  
   `git clone https://github.com/seu-usuario/StudyFlow.git`  
2. Acesse a branch main:  
   `git checkout main`  
3. Abra o arquivo `index.html` no navegador  

> ⚠️ **Atenção:** Requer que os arquivos `.css` e `.js` estejam no mesmo diretório do `index.html`.

---

### 📌 Branch `versão-1.0.1-html-com-js-e-css-imbutido`

**Versão:** Autocontido (HTML único)

**Funcionamento:**  
Tudo em um único arquivo HTML (estilo e script internos, não inline). Perfeito para execução local sem preocupações com arquivos externos.

**Como usar:**  
1. Acesse a branch:  
   `git checkout versão-1.0.1-html-com-js-e-css-imbutido`  
2. Baixe apenas o arquivo `index.html`  
3. Abra com qualquer navegador moderno (Chrome, Firefox, Edge, etc.)  

> ✅ **Vantagem:** Não depende de estrutura de pastas, funciona direto.

---

### 📌 Branch `versão-PWA-js-e-css-inline`

**Versão:** Progressive Web App (PWA)

**Funcionamento:**  
Versão com funcionalidade PWA: estilo e JavaScript **inline** no HTML + manifest e service worker. Pode ser instalada como app no dispositivo.

**Como usar:**  
1. Acesse a branch:  
   `git checkout versão-PWA-js-e-css-inline`  
2. Hospede os arquivos em um servidor HTTPS (ou use localhost para testes)  
3. Acesse via navegador compatível (Chrome, Edge, Safari, etc.)  
4. Clique em "Instalar aplicativo" (ou "Adicionar à tela inicial")  

> 📱 **Resultado:** O app funciona offline e pode ser usado como um aplicativo nativo.

---

## 🚀 Como executar cada versão

### 🔹 Branch `main` (para desenvolvimento ou estudo)
```bash
git clone https://github.com/seu-usuario/StudyFlow.git
cd StudyFlow
git checkout main
# Abra o arquivo index.html no seu navegador
```
- ✅ Estrutura organizada para edição
- ❌ Requer que os arquivos `style.css` e `script.js` estejam no mesmo nível

### 🔹 Branch `versão-1.0.1-html-com-js-e-css-imbutido` (uso local simplificado)
```bash
git checkout versão-1.0.1-html-com-js-e-css-imbutido
# Baixe o index.html (ou clone a branch) e abra diretamente no navegador
```
- ✅ Um único arquivo, sem dependências externas
- ❌ Sem suporte a instalação como app (PWA)

### 🔹 Branch `versão-PWA-js-e-css-inline` (experiência de aplicativo)
```bash
git checkout versão-PWA-js-e-css-inline
# Hospede o conteúdo em um servidor local ou remoto (ex: npx http-server .)
```
- ✅ Suporte a instalação, ícone na tela inicial, modo offline básico
- ❌ Requer servir via HTTPS (ou localhost) para registrar o Service Worker

---

## 📁 Estrutura de cada branch

```plaintext
main/
├── index.html
├── style.css
└── script.js

versão-1.0.1-html-com-js-e-css-imbutido/
└── index.html   (com <style> e <script> internos)

versão-PWA-js-e-css-inline/
├── index.html   (estilos e scripts inline)
├── manifest.json
└── sw.js       (service worker)
```

---

## ⚙️ Funcionalidades (todas as versões)

- ✅ Adicionar/remover tarefas de estudo  
- ✅ Marcar conclusão  
- ✅ Armazenamento local (`localStorage`) – mantém dados ao recarregar  
- ✅ Interface responsiva (mobile/desktop)
