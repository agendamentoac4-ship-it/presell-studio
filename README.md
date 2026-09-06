# Presell Studio App (v2.0) 🚀

Gerador interativo de páginas de **Presell Robusta** para anúncios no Google Ads, Meta Ads e TikTok Ads, com suporte a múltiplas plataformas de afiliados e acompanhamento completo de pixels de conversão.

---

## ⚡ Funcionalidades

- **Multi-Plataforma**: Suporte nativo para **ClickBank**, **BuyGoods**, **Braip**, **Hotmart**, **PerfectPay** e **Universal/Personalizada**.
- **Preservação de Parâmetros**: Repasse automático do `gclid` do Google Ads, `tid`, `subid`, `src` e parâmetros `utm_*`.
- **Rastreamento de Pixels**:
  - **Google Ads GTag**: Tag de conversão + disparo no clique do botão (`AW-XXXXX/Label`).
  - **Google Tag Manager (GTM)**: Snippets completos de `<head>` e `<body>` (`noscript`).
  - **Google Analytics 4 (GA4)**: Medição de acessos e eventos `click_presell`.
  - **Meta / Facebook Pixel**: Código base + disparo de evento `Lead` no clique.
  - **TikTok Pixel**: Código base + disparo de evento `ClickButton`.
- **Preview em Tempo Real**: Simulador responsivo (Desktop 💻 / Mobile 📱) com controle de blur e máscara escura.
- **Exportação Hostinger Ready**: Baixe o pacote em arquivo `.zip` com 1 clique para subir direto no Gerenciador de Arquivos da Hostinger.

---

## 🚀 Como Executar Localmente

```bash
# Clone este repositório
git clone https://github.com/lyedher/presell-studio.git

# Acesse a pasta do projeto
cd presell-studio

# Execute o servidor local
node serve.js
```

Acesse a aplicação em `http://localhost:3000`.

---

## 🌐 Publicação na Vercel

Esta aplicação está otimizada para implantação automática na **Vercel**:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

---

## 🛠️ Tecnologias Utilizadas

- **HTML5 / CSS3**: Design system moderno em tom escuro com glassmorphism.
- **Vanilla JavaScript**: Motor de geração de código e propagação de parâmetros de alta velocidade sem dependências pesadas.
- **JSZip**: Biblioteca client-side para geração instantânea de arquivos de download `.zip`.
