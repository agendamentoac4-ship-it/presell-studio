/**
 * Presell Studio App (app.js)
 * Real-time code generation, interactive iframe preview, multi-platform parameter engine,
 * pixel injectors (GTM, GA4, GTag, Meta, TikTok), and 1-click ZIP export.
 */

document.addEventListener('DOMContentLoaded', () => {

  // State Store
  const state = {
    platform: 'clickbank',
    afflink: 'https://62379g035eoa2xdeo7nx0qlsf9.hop.clickbank.net',
    productName: 'Femicore Supplement',
    bgUrl: 'https://s3.eu-central-2.wasabisys.com/w.storage.screenshotapi.net/getfemicore_com_text_nhl2_php_hopid_1cb1f747_e730__4e1054324d85.webp',
    blur: 8,
    overlayOpacity: 45,
    modalTitle: 'Configurações de cookies',
    modalText: 'Usamos cookies e tecnologias semelhantes para ajudar a personalizar o conteúdo, adaptar e medir anúncios e fornecer uma melhor experiência de navegação. Ao clicar em aceitar, você concorda com este uso, conforme descrito em nossa Política de Privacidade.',
    btnAccept: 'Sim, eu aceito',
    btnDecline: 'Eu não aceito',
    showClose: true,
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

  // DOM Element Handles
  const elements = {
    platform: document.getElementById('input-platform'),
    afflink: document.getElementById('input-afflink'),
    productName: document.getElementById('input-product-name'),
    bgUrl: document.getElementById('input-bg-url'),
    blur: document.getElementById('input-blur'),
    valBlur: document.getElementById('val-blur'),
    overlayOpacity: document.getElementById('input-overlay-opacity'),
    valOverlay: document.getElementById('val-overlay'),
    modalTitle: document.getElementById('input-modal-title'),
    modalText: document.getElementById('input-modal-text'),
    btnAccept: document.getElementById('input-btn-accept'),
    btnDecline: document.getElementById('input-btn-decline'),
    showClose: document.getElementById('input-show-close'),
    pixelGtag: document.getElementById('input-pixel-gtag'),
    pixelGtagLabel: document.getElementById('input-pixel-gtag-label'),
    pixelGtm: document.getElementById('input-pixel-gtm'),
    pixelGa4: document.getElementById('input-pixel-ga4'),
    pixelFb: document.getElementById('input-pixel-fb'),
    pixelTiktok: document.getElementById('input-pixel-tiktok'),
    customHead: document.getElementById('input-custom-head'),
    customBody: document.getElementById('input-custom-body'),
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
    btnViewCodeFooter: document.getElementById('btn-view-code-footer')
  };

  let toastTimeout = null;

  function showToast(msg) {
    if (!elements.statusToast) return;
    elements.statusToast.textContent = msg || '✓ Presell atualizada em tempo real!';
    elements.statusToast.classList.remove('hidden');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      elements.statusToast.classList.add('hidden');
    }, 2500);
  }

  // Bind Form Event Listeners to Update State
  function bindInputEvents() {
    elements.platform.addEventListener('change', (e) => { state.platform = e.target.value; render(); showToast('Plataforma atualizada!'); });
    elements.afflink.addEventListener('input', (e) => { 
      state.afflink = e.target.value.trim(); 
      render(); 
      showToast('Link de Afiliado atualizado no preview e no código!'); 
    });

    elements.productName.addEventListener('input', (e) => { state.productName = e.target.value; render(); });
    elements.bgUrl.addEventListener('input', (e) => { state.bgUrl = e.target.value.trim(); render(); showToast('Imagem de fundo atualizada!'); });
    
    elements.blur.addEventListener('input', (e) => {
      state.blur = e.target.value;
      elements.valBlur.textContent = `${state.blur}px`;
      render();
    });

    elements.overlayOpacity.addEventListener('input', (e) => {
      state.overlayOpacity = e.target.value;
      elements.valOverlay.textContent = `${state.overlayOpacity}%`;
      render();
    });

    elements.modalTitle.addEventListener('input', (e) => { state.modalTitle = e.target.value; render(); });
    elements.modalText.addEventListener('input', (e) => { state.modalText = e.target.value; render(); });
    elements.btnAccept.addEventListener('input', (e) => { state.btnAccept = e.target.value; render(); });
    elements.btnDecline.addEventListener('input', (e) => { state.btnDecline = e.target.value; render(); });
    elements.showClose.addEventListener('change', (e) => { state.showClose = e.target.checked; render(); });

    elements.pixelGtag.addEventListener('input', (e) => { state.pixelGtag = e.target.value.trim(); render(); });
    elements.pixelGtagLabel.addEventListener('input', (e) => { state.pixelGtagLabel = e.target.value.trim(); render(); });
    elements.pixelGtm.addEventListener('input', (e) => { state.pixelGtm = e.target.value.trim(); render(); });
    elements.pixelGa4.addEventListener('input', (e) => { state.pixelGa4 = e.target.value.trim(); render(); });
    elements.pixelFb.addEventListener('input', (e) => { state.pixelFb = e.target.value.trim(); render(); });
    elements.pixelTiktok.addEventListener('input', (e) => { state.pixelTiktok = e.target.value.trim(); render(); });
    elements.customHead.addEventListener('input', (e) => { state.customHead = e.target.value; render(); });
    elements.customBody.addEventListener('input', (e) => { state.customBody = e.target.value; render(); });

    // UI Tab Navigation
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

  function switchTab(tabId, btnEl) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
    const targetTab = document.getElementById(tabId);
    if (targetTab) targetTab.classList.add('active');
    updateCodeView();
  }

  // Code Generator Functions
  function generateCss() {
    return `/* Presell Studio Generated Styles */
*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: 100%; height: 100%; font-family: system-ui, -apple-system, sans-serif; color: #0f172a; background-color: #0b0f19; overflow: hidden; }
.backdrop-wrapper { position: fixed; inset: 0; width: 100vw; height: 100vh; z-index: 0; pointer-events: none; }
.backdrop-image { position: absolute; inset: 0; width: 100%; height: 100%; background-size: cover; background-position: center top; background-repeat: no-repeat; background-image: url('${state.bgUrl || "assets/producer_preview.webp"}'); filter: blur(${state.blur}px) brightness(0.85); transform: scale(1.05); }
.backdrop-overlay { position: absolute; inset: 0; background: rgba(15, 23, 42, ${state.overlayOpacity / 100}); backdrop-filter: blur(2px); }
.modal-container { position: relative; z-index: 10; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 1.25rem; }
.cookie-modal { position: relative; background: #ffffff; border-radius: 16px; padding: 2.5rem 2rem; width: 100%; max-width: 580px; box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1); text-align: center; }
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
 * Platform: ${state.platform.toUpperCase()}
 */
(function() {
  'use strict';

  // Platform Parameter Mappings
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

      // Forward any extra custom params
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
    // Google Ads GTag Click Conversion
    ${state.pixelGtagLabel ? `
    if (typeof gtag === 'function') {
      gtag('event', 'conversion', { 'send_to': '${state.pixelGtagLabel}' });
    }` : ''}

    // Google Analytics 4 Click Event
    ${state.pixelGa4 ? `
    if (typeof gtag === 'function') {
      gtag('event', 'click_presell', { 'event_category': 'Engagement', 'event_label': '${state.productName}' });
    }` : ''}

    // Meta/Facebook Lead Event
    ${state.pixelFb ? `
    if (typeof fbq === 'function') {
      fbq('track', 'Lead', { content_name: '${state.productName}' });
    }` : ''}

    // TikTok Click Event
    ${state.pixelTiktok ? `
    if (typeof ttq === 'object' && typeof ttq.track === 'function') {
      ttq.track('ClickButton');
    }` : ''}
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

    // Google GTag (Google Ads or GA4)
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

    // Facebook / Meta Pixel
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
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=${state.pixelFb}&ev=PageView&noscript=1"
/></noscript>
<!-- End Meta Pixel Code -->`);
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

    const closeBtnHtml = state.showClose ? `
      <a href="${state.afflink}" class="modal-close-btn cb-hoplink" aria-label="Fechar">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
          <path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 1 0 5.7 7.11L10.59 12 5.7 16.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4Z"/>
        </svg>
      </a>` : '';

    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(state.productName)} - Verificação</title>
  <link rel="stylesheet" href="styles.css" />
  ${headScripts.join('\n  ')}
  <script src="tracking.js" defer></script>
</head>
<body>
  ${bodyScripts.join('\n  ')}

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
        <a href="${state.afflink}" class="btn btn-primary cb-hoplink">${escapeHtml(state.btnAccept)}</a>
        <a href="${state.afflink}" class="btn btn-secondary cb-hoplink">${escapeHtml(state.btnDecline)}</a>
      </div>
    </div>
  </main>
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

    // Bundle inline for iframe sandbox preview
    const fullDoc = htmlContent
      .replace('<link rel="stylesheet" href="styles.css" />', `<style>${cssContent}</style>`)
      .replace('<script src="tracking.js" defer></script>', `<script>${jsContent}</script>`);

    elements.previewIframe.srcdoc = fullDoc;

    if (elements.previewUrlBadge) {
      const shortUrl = state.afflink.length > 28 ? state.afflink.substring(0, 25) + '...' : state.afflink;
      elements.previewUrlBadge.textContent = `Link Ativo: ${shortUrl}`;
    }
  }

  function render() {
    renderPreview();
    updateCodeView();
  }

  function exportZipPackage() {
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
      a.download = `presell_${state.platform}_${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  // Initialize
  bindInputEvents();
  render();
});
