/**
 * MAGE QR REST — Anti-Scraping Shield v1.0
 * Підключається на всіх сторінках: <script src="anti-scraping.js">
 * Рівень 2: захист контенту після завантаження сторінки
 */
(function MageShield() {
  'use strict';

  // ─── 1. ЗАХИСТ КОНТЕНТУ ──────────────────────────────────────

  // Вимикаємо правий клік на публічному меню
  const isMenu = document.body.classList.contains('public-menu');
  if (isMenu) {
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('selectstart', e => e.preventDefault());
  }

  // Блокуємо PrintScreen / DevTools shortcuts
  document.addEventListener('keydown', e => {
    // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U (view source)
    if (
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && ['I','J','C'].includes(e.key)) ||
      (e.ctrlKey && e.key === 'U')
    ) {
      e.preventDefault();
      return false;
    }
  });

  // ─── 2. DEVTOOLS DETECTION ───────────────────────────────────
  let devtoolsOpen = false;
  const devtoolsCheck = () => {
    const threshold = 160;
    if (
      window.outerWidth - window.innerWidth > threshold ||
      window.outerHeight - window.innerHeight > threshold
    ) {
      if (!devtoolsOpen) {
        devtoolsOpen = true;
        // Очищаємо чутливі дані з DOM якщо відкрито DevTools
        document.querySelectorAll('[data-price],[data-id]').forEach(el => {
          el.removeAttribute('data-price');
          el.removeAttribute('data-id');
        });
      }
    } else {
      devtoolsOpen = false;
    }
  };
  setInterval(devtoolsCheck, 1000);

  // ─── 3. IFRAME PROTECTION ────────────────────────────────────
  // Сторінка не повинна завантажуватись в iframe чужого сайту
  if (window.self !== window.top) {
    try {
      const parentHost = window.top.location.hostname;
      const allowedHosts = ['mageqrrest.github.io', 'mageqrrest.com', 'localhost'];
      if (!allowedHosts.includes(parentHost)) {
        window.top.location = window.self.location;
      }
    } catch {
      // Якщо top.location недоступний — це cross-origin iframe → блокуємо
      document.body.innerHTML = '';
    }
  }

  // ─── 4. COPY PROTECTION ──────────────────────────────────────
  if (isMenu) {
    document.addEventListener('copy', e => {
      e.clipboardData.setData('text/plain', 'Mage QR Rest — mageqrrest.com');
      e.preventDefault();
    });
  }

  // ─── 5. DATA OBFUSCATION ─────────────────────────────────────
  // Ціни і ID ніколи не кладемо в атрибути напряму.
  // Використовуємо закодований формат при рендерингу:
  window.MageQR = window.MageQR || {};

  // Кодуємо ID перед вставкою в DOM (простий XOR + base64)
  window.MageQR.encodeId = function(id, venueKey) {
    const key = (venueKey || 'mq').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    return btoa(String.fromCharCode(...[...String(id)].map(c => c.charCodeAt(0) ^ (key % 256))));
  };

  window.MageQR.decodeId = function(encoded, venueKey) {
    const key = (venueKey || 'mq').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    return atob(encoded).split('').map(c => String.fromCharCode(c.charCodeAt(0) ^ (key % 256))).join('');
  };

  // ─── 6. REQUEST FINGERPRINTING ───────────────────────────────
  // Кожен запит до Firebase підписується сесійним токеном
  window.MageQR.sessionToken = (function() {
    const arr = new Uint8Array(16);
    crypto.getRandomValues(arr);
    return Array.from(arr, b => b.toString(16).padStart(2, '0')).join('');
  })();

  // ─── 7. ANTI-AUTOMATION TIMING ───────────────────────────────
  // Відстежуємо підозріло швидкі кліки (бот-патерн)
  let lastClick = 0;
  let rapidClicks = 0;
  document.addEventListener('click', () => {
    const now = Date.now();
    if (now - lastClick < 50) {
      rapidClicks++;
      if (rapidClicks > 10) {
        // Блокуємо на 5 секунд
        document.body.style.pointerEvents = 'none';
        setTimeout(() => {
          document.body.style.pointerEvents = '';
          rapidClicks = 0;
        }, 5000);
      }
    } else {
      rapidClicks = 0;
    }
    lastClick = now;
  }, true);

  // ─── 8. CSS ЗАХИСТ ───────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    /* Забороняємо виділення на публічному меню */
    .public-menu * { user-select: none; -webkit-user-select: none; }
    .public-menu img { pointer-events: none; -webkit-user-drag: none; }

    /* Приховуємо від print scraper */
    @media print {
      .public-menu .dish-price,
      .public-menu .dish-desc { display: none !important; }
    }
  `;
  document.head.appendChild(style);

  console.log('%c✦ Mage QR Rest', 'color:#C1440E;font-size:20px;font-weight:bold');
  console.log('%cЗахищена платформа для ресторанів. Несанкціонований доступ заборонений.', 'color:#888;font-size:12px');

})();
