/**
 * Presell Studio App (app.js v3.0 Multi-Template Engine)
 * Real-time code generation for 3 templates:
 * 1) Cookie Consent Bridge
 * 2) Interactive Quiz / Survey Presell
 * 3) Advertorial / Article Review Presell
 */

document.addEventListener('DOMContentLoaded', () => {

  const STORAGE_KEY = 'presell_studio_saved_state_v3';
  const PROJECTS_KEY = 'presell_studio_projects_v4';

  // Default Initial State
  const defaultState = {
    template: 'cookie',
    platform: 'clickbank',
    afflink: 'https://62379g035eoa2xdeo7nx0qlsf9.hop.clickbank.net',
    productName: 'Femicore Supplement',
    bgUrl: 'https://s3.eu-central-2.wasabisys.com/w.storage.screenshotapi.net/getfemicore_com_text_nhl2_php_hopid_1cb1f747_e730__4e1054324d85.webp',
    blur: 8,
    overlayOpacity: 45,
    
    // Cookie Template Copy
    modalTitle: 'Configurações de cookies',
    modalText: 'Usamos cookies e tecnologias semelhantes para ajudar a personalizar o conteúdo, adaptar e medir anúncios e fornecer uma melhor experiência de navegação. Ao clicar em aceitar, você concorda com este uso, conforme descrito em nossa Política de Privacidade.',
    btnAccept: 'Sim, eu aceito',
    btnDecline: 'Eu não aceito',
    showClose: true,

    // Quiz Template Copy
    quizQ1: 'Qual é o seu objetivo principal de saúde ou bem-estar hoje?',
    quizQ2: 'Com que frequência você busca soluções ou métodos naturais?',
    quizQ3: 'Você tem mais de 25 anos de idade?',

    // Advertorial Template Copy
    advHeadline: 'Descubra o Novo Método Natural que Está Impressionando Especialistas',
    advSubheadline: 'Saiba como milhares de pessoas estão alcançando resultados extraordinários utilizando uma fórmula natural comprovada.',
    advButton: 'Assistir à Apresentação Oficial Agora »',

    // Pixels
    pixelGtag: '',
    pixelGtagLabel: '',
    pixelGtm: '',
    pixelGa4: '',
    pixelFb: '',
    pixelTiktok: '',
    customHead: '',
    customBody: '',
    activeCodeTab: 'code-html',
    testQueryString: ''
  };

  const emptyState = {
    ...defaultState,
    afflink: '',
    productName: '',
    bgUrl: '',
    pixelGtag: '',
    pixelGtagLabel: '',
    pixelGtm: '',
    pixelGa4: '',
    pixelFb: '',
    pixelTiktok: '',
    customHead: '',
    customBody: ''
  };

  // Projects Store State
  let projects = {
    'default': {
      id: 'default',
      name: 'Femicore - ClickBank (Exemplo)',
      state: { ...defaultState }
    }
  };
  let activeProjectId = 'default';
  let state = { ...defaultState };

  // DOM Element Handles
  const elements = {
    // Project Bar Controls
    selectProject: document.getElementById('select-project'),
    btnSaveProject: document.getElementById('btn-save-project'),
    btnNewProject: document.getElementById('btn-new-project'),
    btnDeleteProject: document.getElementById('btn-delete-project'),

    // AI Generator Controls
    selectAiLang: document.getElementById('select-ai-lang'),
    selectAiNiche: document.getElementById('select-ai-niche'),
    btnGenerateAiCopy: document.getElementById('btn-generate-ai-copy'),

    // Inputs
    platform: document.getElementById('input-platform'),
    afflink: document.getElementById('input-afflink'),
    productName: document.getElementById('input-product-name'),
    bgUrl: document.getElementById('input-bg-url'),
    bgFile: document.getElementById('input-bg-file'),
    blur: document.getElementById('input-blur'),
    valBlur: document.getElementById('val-blur'),
    overlayOpacity: document.getElementById('input-overlay-opacity'),
    valOverlay: document.getElementById('val-overlay'),
    
    // Cookie Copy Inputs
    modalTitle: document.getElementById('input-modal-title'),
    modalText: document.getElementById('input-modal-text'),
    btnAccept: document.getElementById('input-btn-accept'),
    btnDecline: document.getElementById('input-btn-decline'),
    showClose: document.getElementById('input-show-close'),

    // Quiz Copy Inputs
    quizQ1: document.getElementById('input-quiz-q1'),
    quizQ2: document.getElementById('input-quiz-q2'),
    quizQ3: document.getElementById('input-quiz-q3'),

    // Advertorial Copy Inputs
    advHeadline: document.getElementById('input-adv-headline'),
    advSubheadline: document.getElementById('input-adv-subheadline'),
    advButton: document.getElementById('input-adv-button'),

    // Sections
    copyCookie: document.getElementById('copy-fields-cookie'),
    copyQuiz: document.getElementById('copy-fields-quiz'),
    copyAdvertorial: document.getElementById('copy-fields-advertorial'),
    groupAutoScreenshot: document.getElementById('group-auto-screenshot'),

    // Pixels
    pixelGtag: document.getElementById('input-pixel-gtag'),
    pixelGtagLabel: document.getElementById('input-pixel-gtag-label'),
    pixelGtm: document.getElementById('input-pixel-gtm'),
    pixelGa4: document.getElementById('input-pixel-ga4'),
    pixelFb: document.getElementById('input-pixel-fb'),
    pixelTiktok: document.getElementById('input-pixel-tiktok'),
    customHead: document.getElementById('input-custom-head'),
    customBody: document.getElementById('input-custom-body'),
    
    // UI Preview & Controls
    previewIframe: document.getElementById('preview-iframe'),
    codeDisplay: document.getElementById('code-display'),
    btnCopyCode: document.getElementById('btn-copy-code'),
    btnTestLink: document.getElementById('btn-test-link'),
    viewportContainer: document.getElementById('viewport-container'),
    viewDesktop: document.getElementById('view-desktop'),
    viewMobile: document.getElementById('view-mobile'),
    statusToast: document.getElementById('status-toast'),
    previewUrlBadge: document.getElementById('preview-url-badge'),
    btnTabCode: document.getElementById('btn-tab-code'),
    btnViewCodeFooter: document.getElementById('btn-view-code-footer'),
    btnResetState: document.getElementById('btn-reset-state'),
    btnAutoScreenshot: document.getElementById('btn-auto-screenshot')
  };

  let toastTimeout = null;

  function loadProjectsFromLocalStorage() {
    try {
      const savedProjects = localStorage.getItem(PROJECTS_KEY);
      if (savedProjects) {
        const parsed = JSON.parse(savedProjects);
        if (parsed.projects && Object.keys(parsed.projects).length > 0) {
          projects = parsed.projects;
          activeProjectId = parsed.activeProjectId || Object.keys(projects)[0];
        }
      } else {
        const legacySaved = localStorage.getItem(STORAGE_KEY);
        if (legacySaved) {
          const parsedLegacy = JSON.parse(legacySaved);
          projects['default'].state = { ...defaultState, ...parsedLegacy };
        }
      }
    } catch (e) {
      console.warn('Projects load failed:', e);
    }

    if (!projects[activeProjectId]) {
      activeProjectId = Object.keys(projects)[0] || 'default';
    }

    state = { ...defaultState, ...(projects[activeProjectId] ? projects[activeProjectId].state : {}) };
    updateProjectDropdown();
    syncStateToInputs();
  }

  function saveProjectsToLocalStorage() {
    try {
      if (projects[activeProjectId]) {
        projects[activeProjectId].state = { ...state };
        if (state.productName && state.productName.trim() !== '') {
          projects[activeProjectId].name = state.productName;
        }
      }
      localStorage.setItem(PROJECTS_KEY, JSON.stringify({
        projects,
        activeProjectId
      }));
      updateProjectDropdown();
    } catch (e) {
      console.warn('Projects save failed:', e);
    }
  }

  function updateProjectDropdown() {
    if (!elements.selectProject) return;
    elements.selectProject.innerHTML = '';
    Object.keys(projects).forEach(id => {
      const option = document.createElement('option');
      option.value = id;
      option.textContent = projects[id].name || `Projeto ${id}`;
      if (id === activeProjectId) option.selected = true;
      elements.selectProject.appendChild(option);
    });
  }

  function switchProject(id) {
    if (!projects[id]) return;
    activeProjectId = id;
    state = { ...defaultState, ...projects[id].state };
    saveProjectsToLocalStorage();
    syncStateToInputs();
    render();
    showToast(`📁 Projeto alternado para: "${projects[id].name}"`);
  }

  function createNewProject() {
    const projName = prompt('Digite o nome do novo projeto de Presell:', 'Novo Projeto - ' + (Object.keys(projects).length + 1));
    if (!projName || !projName.trim()) return;

    const newId = 'proj_' + Date.now();
    projects[newId] = {
      id: newId,
      name: projName.trim(),
      state: { ...emptyState, productName: projName.trim() }
    };
    switchProject(newId);
    showToast(`✨ Novo projeto "${projName.trim()}" criado com sucesso!`);
  }

  function deleteCurrentProject() {
    const keys = Object.keys(projects);
    if (keys.length <= 1) {
      alert('Você precisa ter pelo menos um projeto cadastrado!');
      return;
    }

    const currentName = projects[activeProjectId] ? projects[activeProjectId].name : activeProjectId;
    if (!confirm(`Tem certeza que deseja excluir o projeto "${currentName}"?`)) return;

    delete projects[activeProjectId];
    activeProjectId = Object.keys(projects)[0];
    state = { ...defaultState, ...projects[activeProjectId].state };
    saveProjectsToLocalStorage();
    syncStateToInputs();
    render();
    showToast(`🗑️ Projeto excluído com sucesso!`);
  }

  function generateAiCopy() {
    const lang = elements.selectAiLang ? elements.selectAiLang.value : 'pt';
    const niche = elements.selectAiNiche ? elements.selectAiNiche.value : 'health';
    const prodName = state.productName || (lang === 'en' ? 'Official Solution' : lang === 'es' ? 'Solución Oficial' : 'Fórmula Oficial');

    const copyBank = {
      pt: {
        health: {
          cookie: {
            title: 'Aviso de Verificação & Termos de Uso',
            text: `Para garantir a segurança dos nossos utilizadores e a conformidade com as diretrizes oficiais de saúde do ${prodName}, utilizamos cookies de sessão temporários. Ao prosseguir, você confirma que possui idade legal e aceita visualizar a apresentação em vídeo.`,
            accept: 'Continuar para a Apresentação Oficial',
            decline: 'Sair da Página'
          },
          quiz: {
            q1: 'Você busca uma alternativa 100% natural e comprovada para melhorar sua saúde diária?',
            q2: 'Com que frequência você sente cansaço ou falta de disposição ao longo do dia?',
            q3: 'Você está preparado(a) para assistir a uma explicação em vídeo de 5 minutos com a solução?'
          },
          adv: {
            headline: `REVELADO: Descubra o Ritual Matinal Natural que Está Impressionando Médicos e Nutricionistas em 2026`,
            subheadline: `Nova pesquisa científica em universidades de ponta revela como o composto do ${prodName} atua na causa raiz sem a necessidade de dietas extremas.`,
            button: 'Assistir ao Vídeo Explicativo e Oferta Especial »'
          }
        },
        brand: {
          cookie: {
            title: 'Portal Oficial de Distribuição',
            text: `Bem-vindo à página de validação direta do fornecedor oficial do ${prodName}. Usamos cookies de rastreamento de estoque para garantir a reserva do seu desconto de até 75% durante esta sessão.`,
            accept: 'Garantir Meu Desconto do Produtor',
            decline: 'Recusar Oferta'
          },
          quiz: {
            q1: 'Você está buscando adquirir o produto com garantia de autenticidade direta do fabricante?',
            q2: 'Deseja ter direito a frete grátis e aos bônus exclusivos da campanha de lançamento?',
            q3: 'Pronto para verificar a disponibilidade de estoque na sua região em tempo real?'
          },
          adv: {
            headline: `ALERTAS AO CONSUMIDOR: Onde Comprar o ${prodName} com Garantia Total do Fabricante e Entrega Rápida`,
            subheadline: `Confira a análise completa de satisfação do cliente, tabela de preços promocionais e como evitar réplicas não autorizadas na internet.`,
            button: 'Ir para o Site Oficial com Garantia de 60 Dias »'
          }
        },
        finance: {
          cookie: {
            title: 'Verificação de Elegibilidade de Acesso',
            text: `Utilizamos cookies de criptografia para proteger seu acesso ao método exclusivo. Ao continuar, você concorda que esta apresentação contém estratégias práticas e confidenciais de resultados diários.`,
            accept: 'Acessar Treinamento Exclusivo',
            decline: 'Não Tenho Interesse'
          },
          quiz: {
            q1: 'Você tem pelo menos 30 minutos livres por dia para aplicar um passo a passo simples?',
            q2: 'Qual é a sua meta de faturamento mensal complementar para os próximos 90 dias?',
            q3: 'Você possui um celular ou computador com conexão de internet para começar hoje?'
          },
          adv: {
            headline: `NOVA DESCOBERTA: Como Pessoas Comuns Estão Gerando Renda Extra Diária Utilizando a Internet`,
            subheadline: `Sem precisar de experiência prévia ou grandes investimentos inicial. Entenda a metodologia simplificada passo a passo nesta aula gratuita.`,
            button: 'Ver Apresentação Gratuita de Acesso Imediato »'
          }
        }
      },
      en: {
        health: {
          cookie: {
            title: 'User Verification & Privacy Consent Notice',
            text: `To ensure security standards and compliance for ${prodName}, we use temporary session cookies. By clicking accept below, you confirm eligibility to watch the official educational video.`,
            accept: 'Continue to Official Video Presentation',
            decline: 'Decline & Exit'
          },
          quiz: {
            q1: 'Are you looking for a 100% natural and safe daily solution to support your overall wellness?',
            q2: 'How often do you experience mid-day fatigue or sluggish energy levels?',
            q3: 'Are you prepared to watch a short 5-minute video presenting the scientific breakthrough?'
          },
          adv: {
            headline: `BREAKTHROUGH REPORT: Top Experts Discover Natural Daily Ritual Taking The Wellness World By Storm in 2026`,
            subheadline: `Recent clinical trials reveal how the active formula in ${prodName} targets the core root cause without harsh side effects or strict regimens.`,
            button: 'Watch the Official Presentation Now »'
          }
        },
        brand: {
          cookie: {
            title: 'Official Distribution & Inventory Gateway',
            text: `Welcome to the official vendor validation portal for ${prodName}. We use session cookies to secure your reserved discount of up to 75% for this browser session.`,
            accept: 'Claim My Producer Discount Now',
            decline: 'No Thanks'
          },
          quiz: {
            q1: 'Are you looking to order directly from the official manufacturer with authentic supply guarantee?',
            q2: 'Would you like to qualify for free shipping and bonus guide digital downloads?',
            q3: 'Are you ready to check current inventory availability for your zip code?'
          },
          adv: {
            headline: `BUYER\'S GUIDE: How to Secure ${prodName} with 100% Money-Back Guarantee & Special Pricing`,
            subheadline: `Read the verified customer review breakdown, price comparison, and official order dispatch protocols for instant savings.`,
            button: 'Visit Official Manufacturer Website »'
          }
        },
        finance: {
          cookie: {
            title: 'Security Verification & Access Consent',
            text: `We utilize encrypted browser cookies to protect access to this training. By proceeding, you acknowledge this video contains proprietary step-by-step strategies.`,
            accept: 'Proceed to Free Masterclass',
            decline: 'Leave Page'
          },
          quiz: {
            q1: 'Do you have 30 to 45 minutes of spare time daily to follow a structured online workflow?',
            q2: 'What is your primary income target over the next 90 days?',
            q3: 'Do you have access to a smartphone or computer with internet connection?'
          },
          adv: {
            headline: `FINANCIAL TREND 2026: Simple Online Method Empowers Everyday People to Build Extra Daily Cashflow`,
            subheadline: `No prior technical experience required. Watch the official breakdown showing how the automated blueprint works from scratch.`,
            button: 'Watch Instant Free Presentation »'
          }
        }
      },
      es: {
        health: {
          cookie: {
            title: 'Aviso de Verificación y Consentimiento de Privacidad',
            text: `Para garantizar los estándares de seguridad y cumplimiento normativo para ${prodName}, utilizamos cookies de sesión. Al hacer clic en aceptar, confirma su elegibilidad para ver la presentación oficial.`,
            accept: 'Continuar a la Presentación Oficial',
            decline: 'Rechazar y Salir'
          },
          quiz: {
            q1: '¿Busca una alternativa 100% natural y segura para optimizar su bienestar diario?',
            q2: '¿Con qué frecuencia siente falta de energía o fatiga a lo largo del día?',
            q3: '¿Está preparado(a) para ver un breve video explicativo de 5 minutos con la solución?'
          },
          adv: {
            headline: `REPORTE REVELADOR: Expertos Descubren Método Natural que Está Revolucionando la Industria en 2026`,
            subheadline: `Nuevos estudios clínicos muestran cómo la fórmula activa de ${prodName} combate la causa raíz de forma segura y efectiva.`,
            button: 'Ver Presentación Oficial en Video »'
          }
        },
        brand: {
          cookie: {
            title: 'Portal Oficial de Distribución y Garantía',
            text: `Bienvenido al portal oficial del fabricante de ${prodName}. Utilizamos cookies para asegurar su descuento exclusivo de hasta un 75% durante esta sesión.`,
            accept: 'Obtener Mi Descuento de Fabricante',
            decline: 'Rechazar Oferta'
          },
          quiz: {
            q1: '¿Desea adquirir el producto original directamente de la fuente oficial con garantía total?',
            q2: '¿Quiere calificar para envío gratuito y bonos exclusivos de la campaña oficial?',
            q3: '¿Listo para verificar la disponibilidad de inventario en su región en tiempo real?'
          },
          adv: {
            headline: `GUÍA DEL COMPRADOR: Cómo Adquirir el ${prodName} Original con Garantía de 60 Días`,
            subheadline: `Revise el análisis de satisfacción de los clientes, tabla de precios promocionales y cómo asegurar su pedido sin intermediarios.`,
            button: 'Ir al Sitio Oficial con Garantía Total »'
          }
        },
        finance: {
          cookie: {
            title: 'Verificación de Acceso Seguro',
            text: `Utilizamos cookies cifradas para proteger el acceso a esta presentación exclusiva. Al continuar, acepta que los métodos presentados son de carácter educativo.`,
            accept: 'Acceder a la Clase Gratuita',
            decline: 'Salir'
          },
          quiz: {
            q1: '¿Dispone de 30 a 45 minutos libres al día para seguir un método paso a paso?',
            q2: '¿Cuál es su meta de ingresos adicionales para los próximos 90 días?',
            q3: '¿Cuenta con un celular o computadora con conexión a internet para comenzar hoy?'
          },
          adv: {
            headline: `TENDENCIA 2026: Descubra el Método en Línea que Permite Generar Ingresos Extra Diarios`,
            subheadline: `Sin necesidad de experiencia previa ni grandes inversiones. Vea la presentación oficial en video y aprenda cómo comenzar.`,
            button: 'Ver Presentación Gratuita Ahora »'
          }
        }
      }
    };

    const selectedCopy = (copyBank[lang] && copyBank[lang][niche]) ? copyBank[lang][niche] : copyBank.pt.health;

    if (state.template === 'cookie') {
      state.modalTitle = selectedCopy.cookie.title;
      state.modalText = selectedCopy.cookie.text;
      state.btnAccept = selectedCopy.cookie.accept;
      state.btnDecline = selectedCopy.cookie.decline;
    } else if (state.template === 'quiz') {
      state.quizQ1 = selectedCopy.quiz.q1;
      state.quizQ2 = selectedCopy.quiz.q2;
      state.quizQ3 = selectedCopy.quiz.q3;
    } else if (state.template === 'advertorial') {
      state.advHeadline = selectedCopy.adv.headline;
      state.advSubheadline = selectedCopy.adv.subheadline;
      state.advButton = selectedCopy.adv.button;
    }

    saveProjectsToLocalStorage();
    syncStateToInputs();
    render();
    showToast(`✨ Copy em ${lang.toUpperCase()} (${niche.toUpperCase()}) gerada com sucesso!`);
  }

  function syncStateToInputs() {
    // Template Selector Cards
    document.querySelectorAll('.template-card').forEach(card => {
      if (card.dataset.template === state.template) {
        card.classList.add('active');
        const radio = card.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
      } else {
        card.classList.remove('active');
      }
    });

    updateCopyTabVisibility();

    if (elements.platform) elements.platform.value = state.platform || 'clickbank';
    if (elements.afflink) elements.afflink.value = state.afflink || '';
    if (elements.productName) elements.productName.value = state.productName || '';
    if (elements.bgUrl) elements.bgUrl.value = state.bgUrl || '';
    if (elements.bgFile) elements.bgFile.value = '';
    if (elements.blur) {
      elements.blur.value = state.blur || 8;
      elements.valBlur.textContent = `${state.blur || 8}px`;
    }
    if (elements.overlayOpacity) {
      elements.overlayOpacity.value = state.overlayOpacity || 45;
      elements.valOverlay.textContent = `${state.overlayOpacity || 45}%`;
    }

    // Cookie Copy
    if (elements.modalTitle) elements.modalTitle.value = state.modalTitle || '';
    if (elements.modalText) elements.modalText.value = state.modalText || '';
    if (elements.btnAccept) elements.btnAccept.value = state.btnAccept || '';
    if (elements.btnDecline) elements.btnDecline.value = state.btnDecline || '';
    if (elements.showClose) elements.showClose.checked = state.showClose !== false;

    // Quiz Copy
    if (elements.quizQ1) elements.quizQ1.value = state.quizQ1 || '';
    if (elements.quizQ2) elements.quizQ2.value = state.quizQ2 || '';
    if (elements.quizQ3) elements.quizQ3.value = state.quizQ3 || '';

    // Advertorial Copy
    if (elements.advHeadline) elements.advHeadline.value = state.advHeadline || '';
    if (elements.advSubheadline) elements.advSubheadline.value = state.advSubheadline || '';
    if (elements.advButton) elements.advButton.value = state.advButton || '';

    // Pixels
    if (elements.pixelGtag) elements.pixelGtag.value = state.pixelGtag || '';
    if (elements.pixelGtagLabel) elements.pixelGtagLabel.value = state.pixelGtagLabel || '';
    if (elements.pixelGtm) elements.pixelGtm.value = state.pixelGtm || '';
    if (elements.pixelGa4) elements.pixelGa4.value = state.pixelGa4 || '';
    if (elements.pixelFb) elements.pixelFb.value = state.pixelFb || '';
    if (elements.pixelTiktok) elements.pixelTiktok.value = state.pixelTiktok || '';
    if (elements.customHead) elements.customHead.value = state.customHead || '';
    if (elements.customBody) elements.customBody.value = state.customBody || '';
  }

  function updateCopyTabVisibility() {
    if (elements.copyCookie) elements.copyCookie.classList.add('hidden');
    if (elements.copyQuiz) elements.copyQuiz.classList.add('hidden');
    if (elements.copyAdvertorial) elements.copyAdvertorial.classList.add('hidden');

    if (state.template === 'cookie' && elements.copyCookie) {
      elements.copyCookie.classList.remove('hidden');
    } else if (state.template === 'quiz' && elements.copyQuiz) {
      elements.copyQuiz.classList.remove('hidden');
    } else if (state.template === 'advertorial' && elements.copyAdvertorial) {
      elements.copyAdvertorial.classList.remove('hidden');
    }
  }

  function showToast(msg) {
    if (!elements.statusToast) return;
    elements.statusToast.textContent = msg || '✓ Presell atualizada e salva automaticamente!';
    elements.statusToast.classList.remove('hidden');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      elements.statusToast.classList.add('hidden');
    }, 3000);
  }

  function captureAutoScreenshot() {
    if (!state.afflink) {
      alert('Por favor, insira o seu Link de Afiliado para capturar o print da VSL!');
      if (elements.afflink) elements.afflink.focus();
      return;
    }

    const targetUrl = state.afflink;
    const screenshotUrl = `https://image.thum.io/get/width/1200/crop/800/${targetUrl}`;

    state.bgUrl = screenshotUrl;
    if (elements.bgUrl) elements.bgUrl.value = screenshotUrl;

    onStateChanged('📸 Print da página do produtor capturado automaticamente!');
  }

  // Event Listeners
  function bindInputEvents() {

    // Project Management Listeners
    if (elements.selectProject) {
      elements.selectProject.addEventListener('change', (e) => {
        switchProject(e.target.value);
      });
    }
    if (elements.btnSaveProject) {
      elements.btnSaveProject.addEventListener('click', () => {
        saveProjectsToLocalStorage();
        showToast(`💾 Projeto "${projects[activeProjectId]?.name || activeProjectId}" salvo com sucesso!`);
      });
    }
    if (elements.btnNewProject) {
      elements.btnNewProject.addEventListener('click', createNewProject);
    }
    if (elements.btnDeleteProject) {
      elements.btnDeleteProject.addEventListener('click', deleteCurrentProject);
    }

    // AI Copy Generator Listener
    if (elements.btnGenerateAiCopy) {
      elements.btnGenerateAiCopy.addEventListener('click', generateAiCopy);
    }


    // Template Radio Cards Switcher
    document.querySelectorAll('.template-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.template-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        state.template = card.dataset.template;
        updateCopyTabVisibility();
        onStateChanged(`Template alterado para: ${state.template.toUpperCase()}`);
      });
    });

    elements.platform.addEventListener('change', (e) => { state.platform = e.target.value; onStateChanged('Plataforma atualizada!'); });
    elements.afflink.addEventListener('input', (e) => { 
      state.afflink = e.target.value.trim(); 
      onStateChanged('Link de Afiliado atualizado!'); 
    });

    if (elements.btnAutoScreenshot) {
      elements.btnAutoScreenshot.addEventListener('click', captureAutoScreenshot);
    }

    elements.productName.addEventListener('input', (e) => { state.productName = e.target.value; onStateChanged(); });
    elements.bgUrl.addEventListener('input', (e) => { state.bgUrl = e.target.value.trim(); onStateChanged('Imagem de fundo atualizada!'); });
    
    // File Upload Reader for Producer Page Image Screenshot
    if (elements.bgFile) {
      elements.bgFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            state.bgUrl = event.target.result;
            elements.bgUrl.value = state.bgUrl;
            onStateChanged('Imagem enviada do computador com sucesso!');
          };
          reader.readAsDataURL(file);
        }
      });
    }

    elements.blur.addEventListener('input', (e) => {
      state.blur = e.target.value;
      elements.valBlur.textContent = `${state.blur}px`;
      onStateChanged();
    });

    elements.overlayOpacity.addEventListener('input', (e) => {
      state.overlayOpacity = e.target.value;
      elements.valOverlay.textContent = `${state.overlayOpacity}%`;
      onStateChanged();
    });

    // Cookie copy
    elements.modalTitle.addEventListener('input', (e) => { state.modalTitle = e.target.value; onStateChanged(); });
    elements.modalText.addEventListener('input', (e) => { state.modalText = e.target.value; onStateChanged(); });
    elements.btnAccept.addEventListener('input', (e) => { state.btnAccept = e.target.value; onStateChanged(); });
    elements.btnDecline.addEventListener('input', (e) => { state.btnDecline = e.target.value; onStateChanged(); });
    elements.showClose.addEventListener('change', (e) => { state.showClose = e.target.checked; onStateChanged(); });

    // Quiz copy
    elements.quizQ1.addEventListener('input', (e) => { state.quizQ1 = e.target.value; onStateChanged(); });
    elements.quizQ2.addEventListener('input', (e) => { state.quizQ2 = e.target.value; onStateChanged(); });
    elements.quizQ3.addEventListener('input', (e) => { state.quizQ3 = e.target.value; onStateChanged(); });

    // Advertorial copy
    elements.advHeadline.addEventListener('input', (e) => { state.advHeadline = e.target.value; onStateChanged(); });
    elements.advSubheadline.addEventListener('input', (e) => { state.advSubheadline = e.target.value; onStateChanged(); });
    elements.advButton.addEventListener('input', (e) => { state.advButton = e.target.value; onStateChanged(); });

    // Pixels
    elements.pixelGtag.addEventListener('input', (e) => { state.pixelGtag = e.target.value.trim(); onStateChanged(); });
    elements.pixelGtagLabel.addEventListener('input', (e) => { state.pixelGtagLabel = e.target.value.trim(); onStateChanged(); });
    elements.pixelGtm.addEventListener('input', (e) => { state.pixelGtm = e.target.value.trim(); onStateChanged(); });
    elements.pixelGa4.addEventListener('input', (e) => { state.pixelGa4 = e.target.value.trim(); onStateChanged(); });
    elements.pixelFb.addEventListener('input', (e) => { state.pixelFb = e.target.value.trim(); onStateChanged(); });
    elements.pixelTiktok.addEventListener('input', (e) => { state.pixelTiktok = e.target.value.trim(); onStateChanged(); });
    elements.customHead.addEventListener('input', (e) => { state.customHead = e.target.value; onStateChanged(); });
    elements.customBody.addEventListener('input', (e) => { state.customBody = e.target.value; onStateChanged(); });

    // Reset Button
    if (elements.btnResetState) {
      elements.btnResetState.addEventListener('click', () => {
        localStorage.removeItem(STORAGE_KEY);
        state = { ...emptyState };
        syncStateToInputs();
        render();
        showToast('✨ Formulário limpo! Insira os dados da nova Presell.');
        if (elements.afflink) elements.afflink.focus();
      });
    }

    // Navigation Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        switchTab(btn.dataset.tab, btn);
      });
    });

    if (elements.btnViewCodeFooter) {
      elements.btnViewCodeFooter.addEventListener('click', () => {
        switchTab('tab-code', elements.btnTabCode);
      });
    }

    // Code Tab Switcher
    document.querySelectorAll('.code-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.code-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.activeCodeTab = btn.dataset.codetab;
        updateCodeView();
      });
    });

    // Viewport Mode Switcher
    elements.viewDesktop.addEventListener('click', () => {
      elements.viewDesktop.classList.add('active');
      elements.viewMobile.classList.remove('active');
      elements.viewportContainer.className = 'viewport-wrapper device-desktop';
    });

    elements.viewMobile.addEventListener('click', () => {
      elements.viewMobile.classList.add('active');
      elements.viewDesktop.classList.remove('active');
      elements.viewportContainer.className = 'viewport-wrapper device-mobile';
    });

    // Test Link Button
    elements.btnTestLink.addEventListener('click', () => {
      state.testQueryString = '?gclid=TESTE_GCLID_99999&tid=TESTE_SUBID_555&utm_source=google&utm_campaign=campanha_teste';
      render();
      alert('Modo de teste ativado! Parâmetros de exemplo foram injetados na Presell. Clique nos botões dentro do preview para testar o repasse.');
    });

    // Copy Code Button
    elements.btnCopyCode.addEventListener('click', () => {
      const codeText = elements.codeDisplay.textContent;
      navigator.clipboard.writeText(codeText).then(() => {
        const originalText = elements.btnCopyCode.textContent;
        elements.btnCopyCode.textContent = 'Copiado! ✓';
        setTimeout(() => elements.btnCopyCode.textContent = originalText, 2000);
      });
    });

    // Export ZIP Triggers
    document.querySelectorAll('.btn-export-zip-trigger').forEach(btn => {
      btn.addEventListener('click', exportZipPackage);
    });
  }

  function onStateChanged(toastMsg) {
    saveProjectsToLocalStorage();
    render();
    if (toastMsg) showToast(toastMsg);
  }

  function switchTab(tabId, btnEl) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
    const targetTab = document.getElementById(tabId);
    if (targetTab) targetTab.classList.add('active');
    updateCodeView();
  }

  // --- Code Generation for All 3 Templates ---

  function generateCss() {
    if (state.template === 'quiz') {
      return `/* Presell Studio Generated Styles - Quiz Template */
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: 100%; height: 100%; font-family: system-ui, -apple-system, sans-serif; color: #0f172a; background-color: #0b0f19; overflow-x: hidden; }
.backdrop-wrapper { position: fixed; inset: 0; width: 100vw; height: 100vh; z-index: 0; pointer-events: none; }
.backdrop-image { position: absolute; inset: 0; width: 100%; height: 100%; background-size: cover; background-position: center top; background-repeat: no-repeat; background-image: url('${state.bgUrl || "assets/producer_preview.webp"}'); filter: blur(${state.blur}px) brightness(0.85); transform: scale(1.05); }
.backdrop-overlay { position: absolute; inset: 0; background: rgba(15, 23, 42, ${state.overlayOpacity / 100}); backdrop-filter: blur(2px); }
.modal-container { position: relative; z-index: 10; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 1.25rem; }
.quiz-card { position: relative; background: #ffffff; border-radius: 16px; padding: 2.5rem 2rem; width: 100%; max-width: 580px; box-shadow: 0 20px 40px -15px rgba(0,0,0,0.3); text-align: center; }
.quiz-progress-bar { width: 100%; height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden; margin-bottom: 1.5rem; }
.quiz-progress-fill { height: 100%; width: 33%; background: #3b82f6; transition: width 0.3s ease; }
.quiz-step { display: none; }
.quiz-step.active { display: block; animation: fadeIn 0.3s ease; }
.quiz-step h2 { font-size: 1.35rem; color: #0f172a; margin-bottom: 1.5rem; }
.quiz-options { display: flex; flex-direction: column; gap: 0.75rem; }
.quiz-opt-btn { width: 100%; padding: 0.85rem 1rem; font-size: 0.95rem; font-weight: 600; color: #1e293b; background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 10px; cursor: pointer; transition: all 0.2s ease; }
.quiz-opt-btn:hover { background: #3b82f6; color: #ffffff; border-color: #3b82f6; }
.analyzing-box { text-align: center; padding: 2rem 0; }
.spinner { width: 42px; height: 42px; border: 4px solid #e2e8f0; border-top-color: #3b82f6; border-radius: 50%; animation: spin 1s infinite linear; margin: 0 auto 1.25rem auto; }
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }`;
    } else if (state.template === 'advertorial') {
      return `/* Presell Studio Generated Styles - Advertorial Template */
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: 100%; min-height: 100%; font-family: system-ui, -apple-system, sans-serif; color: #1e293b; background-color: #f8fafc; line-height: 1.6; }
header.adv-header { background: #0f172a; color: #ffffff; padding: 0.85rem 1.5rem; font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; display: flex; justify-content: space-between; align-items: center; }
.adv-container { max-width: 780px; margin: 2rem auto; padding: 0 1.25rem; }
.adv-badge { display: inline-block; background: #eff6ff; color: #2563eb; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; padding: 4px 10px; border-radius: 6px; margin-bottom: 0.85rem; }
h1.adv-headline { font-size: 1.85rem; font-weight: 800; color: #0f172a; line-height: 1.3; margin-bottom: 1rem; }
.adv-subheadline { font-size: 1.05rem; color: #475569; margin-bottom: 1.5rem; border-left: 4px solid #3b82f6; padding-left: 1rem; }
.adv-hero-img { width: 100%; max-height: 420px; object-fit: cover; border-radius: 12px; margin-bottom: 1.5rem; }
.adv-content p { font-size: 1rem; margin-bottom: 1.25rem; color: #334155; }
.adv-cta-box { background: #ffffff; border: 2px solid #3b82f6; border-radius: 14px; padding: 2rem; text-align: center; margin: 2.5rem 0; box-shadow: 0 10px 25px -5px rgba(59,130,246,0.15); }
.btn-cta { display: inline-flex; align-items: center; justify-content: center; width: 100%; max-width: 420px; padding: 1rem 1.5rem; font-size: 1.1rem; font-weight: 700; color: #ffffff; background: #2563eb; border-radius: 10px; text-decoration: none; transition: background 0.2s ease; }
.btn-cta:hover { background: #1d4ed8; }
footer.adv-footer { text-align: center; font-size: 0.75rem; color: #94a3b8; border-top: 1px solid #e2e8f0; padding: 2rem 1.25rem; margin-top: 3rem; }`;
    }

    // Default Cookie Template CSS
    return `/* Presell Studio Generated Styles - Cookie Template */
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: 100%; height: 100%; font-family: system-ui, -apple-system, sans-serif; color: #0f172a; background-color: #0b0f19; overflow: hidden; }
.backdrop-wrapper { position: fixed; inset: 0; width: 100vw; height: 100vh; z-index: 0; pointer-events: none; }
.backdrop-image { position: absolute; inset: 0; width: 100%; height: 100%; background-size: cover; background-position: center top; background-repeat: no-repeat; background-image: url('${state.bgUrl || "assets/producer_preview.webp"}'); filter: blur(${state.blur}px) brightness(0.85); transform: scale(1.05); }
.backdrop-overlay { position: absolute; inset: 0; background: rgba(15, 23, 42, ${state.overlayOpacity / 100}); backdrop-filter: blur(2px); }
.modal-container { position: relative; z-index: 10; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 1.25rem; }
.cookie-modal { position: relative; background: #ffffff; border-radius: 16px; padding: 2.5rem 2rem; width: 100%; max-width: 580px; box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.3); text-align: center; }
.modal-close-btn { position: absolute; top: 1rem; right: 1rem; display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 50%; color: #64748b; text-decoration: none; transition: background-color 0.2s ease; }
.modal-close-btn:hover { background-color: #f1f5f9; color: #0f172a; }
.modal-header h1 { font-size: 1.5rem; font-weight: 700; color: #0f172a; margin-bottom: 0.85rem; }
.modal-body p { font-size: 0.875rem; line-height: 1.5; color: #475569; margin-bottom: 1.75rem; }
.modal-actions { display: flex; flex-direction: row; justify-content: center; align-items: center; gap: 0.75rem; }
.btn { display: inline-flex; align-items: center; justify-content: center; height: 46px; width: 100%; max-width: 210px; padding: 0 1.25rem; font-size: 0.95rem; font-weight: 600; border-radius: 10px; text-decoration: none; cursor: pointer; transition: all 0.2s ease; user-select: none; }
.btn-primary { background-color: #0f172a; color: #ffffff; border: 1px solid #0f172a; }
.btn-primary:hover { background-color: #1e293b; }
.btn-secondary { background-color: #e2e8f0; color: #1e293b; border: 1px solid #cbd5e1; }
.btn-secondary:hover { background-color: #cbd5e1; }
@media (max-width: 480px) { .cookie-modal { padding: 2rem 1.25rem; } .modal-actions { flex-direction: column; width: 100%; } .btn { max-width: 100%; } }`;
  }

  function generateJs() {
    return `/**
 * Multi-Platform Tracking & Parameter Propagator (tracking.js)
 * Template: ${state.template.toUpperCase()}
 * Platform: ${state.platform.toUpperCase()}
 */
(function() {
  'use strict';

  const PLATFORM_PARAMS = {
    clickbank: ['gclid', 'tid', 'traffic_source', 'traffic_type', 'campaign', 'adgroup', 'keyword', 'utm_source', 'utm_medium', 'utm_campaign', 'aff_sub1', 'aff_sub2', 'aff_sub3', 'aff_sub4', 'aff_sub5'],
    buygoods: ['gclid', 'subid', 'subid2', 'subid3', 'subid4', 'subid5', 'utm_source', 'utm_medium', 'utm_campaign'],
    braip: ['gclid', 'src', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'],
    hotmart: ['gclid', 'src', 'sck', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content'],
    perfectpay: ['gclid', 'src', 'utm_source', 'utm_medium', 'utm_campaign'],
    custom: ['gclid', 'tid', 'src', 'subid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
  };

  const activeParams = PLATFORM_PARAMS['${state.platform}'] || PLATFORM_PARAMS.custom;

  function buildUrlWithParams(targetUrlStr) {
    if (!targetUrlStr) return targetUrlStr;
    try {
      const currentParams = new URLSearchParams(window.location.search);
      const targetUrl = new URL(targetUrlStr, window.location.href);

      activeParams.forEach(param => {
        if (currentParams.has(param) && currentParams.get(param)) {
          targetUrl.searchParams.set(param, currentParams.get(param));
        }
      });

      currentParams.forEach((val, key) => {
        if (!targetUrl.searchParams.has(key) && val) {
          targetUrl.searchParams.set(key, val);
        }
      });

      return targetUrl.href;
    } catch (e) {
      return targetUrlStr;
    }
  }

  function triggerPixelEvents() {
    ${state.pixelGtagLabel ? `if (typeof gtag === 'function') { gtag('event', 'conversion', { 'send_to': '${state.pixelGtagLabel}' }); }` : ''}
    ${state.pixelGa4 ? `if (typeof gtag === 'function') { gtag('event', 'click_presell', { 'event_category': 'Engagement', 'event_label': '${state.productName}' }); }` : ''}
    ${state.pixelFb ? `if (typeof fbq === 'function') { fbq('track', 'Lead', { content_name: '${state.productName}' }); }` : ''}
    ${state.pixelTiktok ? `if (typeof ttq === 'object' && typeof ttq.track === 'function') { ttq.track('ClickButton'); }` : ''}
  }

  function initTracking() {
    const links = document.querySelectorAll('a.cb-hoplink, a[href*="http"]');
    links.forEach(link => {
      link.href = buildUrlWithParams(link.href);
    });

    document.addEventListener('click', function(e) {
      let target = e.target;
      while (target && target !== document.body && target.nodeName !== 'A') {
        target = target.parentNode;
      }
      if (target && target.nodeName === 'A' && target.href) {
        triggerPixelEvents();
        target.href = buildUrlWithParams(target.href);
      }
    }, true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTracking);
  } else {
    initTracking();
  }
})();`;
  }

  function generateHtml() {
    const headScripts = [];
    const bodyScripts = [];

    // GTM Head Script
    if (state.pixelGtm) {
      headScripts.push(`<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${state.pixelGtm}');</script>
<!-- End Google Tag Manager -->`);

      bodyScripts.push(`<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${state.pixelGtm}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->`);
    }

    // Google GTag
    if (state.pixelGtag || state.pixelGa4) {
      const mainTagId = state.pixelGtag || state.pixelGa4;
      headScripts.push(`<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${mainTagId}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  ${state.pixelGtag ? `gtag('config', '${state.pixelGtag}');` : ''}
  ${state.pixelGa4 ? `gtag('config', '${state.pixelGa4}');` : ''}
</script>`);
    }

    // Meta Pixel
    if (state.pixelFb) {
      headScripts.push(`<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${state.pixelFb}');
fbq('track', 'PageView');
</script>`);
    }

    // TikTok Pixel
    if (state.pixelTiktok) {
      headScripts.push(`<!-- TikTok Pixel Code -->
<script>
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
  ttq.load('${state.pixelTiktok}');
  ttq.page();
}(window, document, 'ttq');
</script>`);
    }

    if (state.customHead) headScripts.push(state.customHead);
    if (state.customBody) bodyScripts.push(state.customBody);

    // Render Body according to Selected Template
    let bodyContent = '';

    if (state.template === 'quiz') {
      bodyContent = `
  <div class="backdrop-wrapper" aria-hidden="true">
    <div class="backdrop-image"></div>
    <div class="backdrop-overlay"></div>
  </div>

  <main class="modal-container">
    <div class="quiz-card">
      <div class="quiz-progress-bar">
        <div id="quiz-progress" class="quiz-progress-fill"></div>
      </div>

      <!-- Step 1 -->
      <div id="step-1" class="quiz-step active">
        <h2>${escapeHtml(state.quizQ1)}</h2>
        <div class="quiz-options">
          <button class="quiz-opt-btn" onclick="nextStep(2)">Sim, com certeza</button>
          <button class="quiz-opt-btn" onclick="nextStep(2)">Busco uma solução rápida</button>
          <button class="quiz-opt-btn" onclick="nextStep(2)">Quero conhecer mais</button>
        </div>
      </div>

      <!-- Step 2 -->
      <div id="step-2" class="quiz-step">
        <h2>${escapeHtml(state.quizQ2)}</h2>
        <div class="quiz-options">
          <button class="quiz-opt-btn" onclick="nextStep(3)">Sempre prefiro métodos naturais</button>
          <button class="quiz-opt-btn" onclick="nextStep(3)">Às vezes experimentando novos produtos</button>
          <button class="quiz-opt-btn" onclick="nextStep(3)">Esta é minha primeira vez</button>
        </div>
      </div>

      <!-- Step 3 -->
      <div id="step-3" class="quiz-step">
        <h2>${escapeHtml(state.quizQ3)}</h2>
        <div class="quiz-options">
          <button class="quiz-opt-btn" onclick="finishQuiz()">Sim</button>
          <button class="quiz-opt-btn" onclick="finishQuiz()">Não</button>
        </div>
      </div>

      <!-- Analyzing Final Screen -->
      <div id="step-analyzing" class="quiz-step">
        <div class="analyzing-box">
          <div class="spinner"></div>
          <h2>Analisando suas respostas...</h2>
          <p>Gerando recomendação personalizada para você...</p>
        </div>
      </div>
    </div>
  </main>

  <script>
    function nextStep(stepNum) {
      document.querySelectorAll('.quiz-step').forEach(s => s.classList.remove('active'));
      document.getElementById('step-' + stepNum).classList.add('active');
      document.getElementById('quiz-progress').style.width = (stepNum * 33) + '%';
    }

    function finishQuiz() {
      document.querySelectorAll('.quiz-step').forEach(s => s.classList.remove('active'));
      document.getElementById('step-analyzing').classList.add('active');
      document.getElementById('quiz-progress').style.width = '100%';
      setTimeout(function() {
        var targetLink = '${state.afflink || "#"}';
        if (typeof buildUrlWithParams === 'function') {
          targetLink = buildUrlWithParams(targetLink);
        }
        window.location.href = targetLink;
      }, 1500);
    }
  </script>`;
    } else if (state.template === 'advertorial') {
      bodyContent = `
  <header class="adv-header">
    <div>Portal Notícias & Saúde</div>
    <div>Relatório Especial</div>
  </header>

  <div class="adv-container">
    <span class="adv-badge">Artigo de Análise & Investigação</span>
    <h1 class="adv-headline">${escapeHtml(state.advHeadline)}</h1>
    <div class="adv-subheadline">${escapeHtml(state.advSubheadline)}</div>

    <img src="${state.bgUrl || "assets/producer_preview.webp"}" alt="Review Produto" class="adv-hero-img" />

    <div class="adv-content">
      <p>Especialistas em saúde e bem-estar têm chamado a atenção para uma nova abordagem natural que vem revolucionando os resultados observados em milhares de pessoas este ano.</p>
      <p>Estudos recentes apontam que a combinação de ingredientes certos pode otimizar a experiência sem necessitar de rotinas exaustivas ou métodos mirabolantes.</p>
    </div>

    <div class="adv-cta-box">
      <h2>Deseja Conhecer a Apresentação Completa?</h2>
      <p style="margin-bottom: 1.25rem;">Clique no botão abaixo para assistir ao vídeo oficial de apresentação da fórmula original.</p>
      <a href="${state.afflink || '#'}" class="btn-cta cb-hoplink">${escapeHtml(state.advButton)}</a>
    </div>
  </div>

  <footer class="adv-footer">
    <p>Aviso Legal: Esta é uma página de verificação e avaliação patrocinada. Os resultados podem variar de pessoa para pessoa.</p>
  </footer>`;
    } else {
      // Cookie Template Default
      const closeBtnHtml = state.showClose ? `
      <a href="${state.afflink || '#'}" class="modal-close-btn cb-hoplink" aria-label="Fechar">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
          <path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 1 0 5.7 7.11L10.59 12 5.7 16.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4Z"/>
        </svg>
      </a>` : '';

      bodyContent = `
  <div class="backdrop-wrapper" aria-hidden="true">
    <div class="backdrop-image"></div>
    <div class="backdrop-overlay"></div>
  </div>

  <main class="modal-container">
    <div class="cookie-modal">
      ${closeBtnHtml}
      <div class="modal-header">
        <h1>${escapeHtml(state.modalTitle)}</h1>
      </div>
      <div class="modal-body">
        <p>${escapeHtml(state.modalText)}</p>
      </div>
      <div class="modal-actions">
        <a href="${state.afflink || '#'}" class="btn btn-primary cb-hoplink">${escapeHtml(state.btnAccept)}</a>
        <a href="${state.afflink || '#'}" class="btn btn-secondary cb-hoplink">${escapeHtml(state.btnDecline)}</a>
      </div>
    </div>
  </main>`;
    }

    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(state.productName || 'Verificação')}</title>
  <link rel="stylesheet" href="styles.css" />
  ${headScripts.join('\n  ')}
  <script src="tracking.js" defer></script>
</head>
<body>
  ${bodyScripts.join('\n  ')}
  ${bodyContent}
</body>
</html>`;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function updateCodeView() {
    if (state.activeCodeTab === 'code-html') {
      elements.codeDisplay.textContent = generateHtml();
    } else if (state.activeCodeTab === 'code-css') {
      elements.codeDisplay.textContent = generateCss();
    } else if (state.activeCodeTab === 'code-js') {
      elements.codeDisplay.textContent = generateJs();
    }
  }

  function renderPreview() {
    const htmlContent = generateHtml();
    const cssContent = generateCss();
    const jsContent = generateJs();

    const fullDoc = htmlContent
      .replace('<link rel="stylesheet" href="styles.css" />', `<style>${cssContent}</style>`)
      .replace('<script src="tracking.js" defer></script>', `<script>${jsContent}</script>`);

    elements.previewIframe.srcdoc = fullDoc;

    if (elements.previewUrlBadge) {
      if (!state.afflink) {
        elements.previewUrlBadge.textContent = 'Aguardando Link de Afiliado...';
      } else {
        const shortUrl = state.afflink.length > 28 ? state.afflink.substring(0, 25) + '...' : state.afflink;
        elements.previewUrlBadge.textContent = `Link Ativo: ${shortUrl}`;
      }
    }
  }

  function render() {
    renderPreview();
    updateCodeView();
  }

  function exportZipPackage() {
    if (!state.afflink) {
      alert('Por favor, insira o seu Link de Afiliado antes de baixar a Presell!');
      if (elements.afflink) elements.afflink.focus();
      return;
    }

    if (typeof JSZip === 'undefined') {
      alert('Iniciando download do pacote...');
    }

    const zip = new JSZip();
    zip.file('index.html', generateHtml());
    zip.file('styles.css', generateCss());
    zip.file('tracking.js', generateJs());
    zip.file('README_HOSTINGER.md', `# Como subir sua Presell na Hostinger

1. Acesse o hPanel da Hostinger -> Gerenciador de Arquivos.
2. Navegue até a pasta da sua oferta (ex: public_html/oferta/).
3. Extraia todos os arquivos (.html, .css, .js) desta pasta zip.
4. Acesse seu link no navegador (ex: seudominio.com/oferta/) e teste o rastreamento!`);

    zip.generateAsync({ type: 'blob' }).then(function(blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `presell_${state.template}_${state.platform}_${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  // Initialize
  loadProjectsFromLocalStorage();
  bindInputEvents();
  render();
});
