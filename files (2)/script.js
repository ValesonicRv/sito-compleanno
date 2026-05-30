/* ===========================
   SCRIPT.JS — Animazioni & Interattività
   =========================== */

// ── 1. PARTICELLE HERO ──────────────────────────────────────────────
(function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const COUNT = 36;
  for (let i = 0; i < COUNT; i++) {
    const el = document.createElement('div');
    el.className = 'particle';

    const size   = Math.random() * 5 + 2;
    const left   = Math.random() * 100;
    const delay  = Math.random() * 14;
    const dur    = Math.random() * 14 + 10;
    const hue    = Math.random() > 0.5 ? 'rgba(126,200,227,0.55)' : 'rgba(232,201,122,0.45)';

    el.style.cssText = `
      width:${size}px; height:${size}px;
      left:${left}%;
      background:${hue};
      animation-duration:${dur}s;
      animation-delay:-${delay}s;
    `;
    container.appendChild(el);
  }
})();


// ── 2. CUORI NELLA SEZIONE FINALE ───────────────────────────────────
(function initHearts() {
  const container = document.getElementById('hearts');
  if (!container) return;

  const symbols = ['♡', '♥', '✦', '❋', '✿', '♡'];
  const COUNT   = 22;

  for (let i = 0; i < COUNT; i++) {
    const el  = document.createElement('div');
    el.className = 'heart';
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];

    const left   = Math.random() * 100;
    const delay  = Math.random() * 20;
    const dur    = Math.random() * 14 + 14;
    const size   = Math.random() * 1.2 + 0.6;
    const colorR = Math.random();
    el.style.cssText = `
      left:${left}%;
      font-size:${size}rem;
      color:${colorR > 0.5 ? 'rgba(126,200,227,0.55)' : 'rgba(232,201,122,0.5)'};
      animation-duration:${dur}s;
      animation-delay:-${delay}s;
    `;
    container.appendChild(el);
  }
})();


// ── 3. ROTAZIONI POLAROID ────────────────────────────────────────────
(function setPolaroidRotations() {
  document.querySelectorAll('.polaroid').forEach(card => {
    const rot = card.dataset.rotate || '0';
    card.style.setProperty('--rot', rot + 'deg');
  });
})();


// ── 4. SCROLL-REVEAL (Intersection Observer) ────────────────────────
(function initScrollReveal() {
  // Selettori da animare all'entrata
  const targets = [
    '.section-label',
    '.section-title',
    '.polaroid',
    '.media-frame',
    '.media-caption',
    '.final-message',
    '.final-deco',
  ];

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px',
  });

  targets.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, idx) => {
      // Stagger per la griglia polaroid
      if (el.classList.contains('polaroid')) {
        el.style.transitionDelay = `${idx * 0.1}s`;
      }
      observer.observe(el);
    });
  });
})();


// ── 5. EFFETTO CLICK SUI POLAROID ────────────────────────────────────
(function initPolaroidClick() {
  document.querySelectorAll('.polaroid').forEach(card => {
    card.addEventListener('click', () => {
      // Shimmer temporaneo
      card.style.transition = 'transform 0.2s, box-shadow 0.2s';
      card.style.transform  = 'scale(1.08) rotate(0deg)';
      card.style.boxShadow  = '0 28px 70px rgba(37,99,184,0.45)';
      setTimeout(() => {
        card.style.transform  = '';
        card.style.boxShadow  = '';
        card.style.transition = '';
      }, 320);

      // Coriandoli leggeri intorno al polaroid
      spawnConfetti(card);
    });
  });
})();


// ── 6. CORIANDOLI AL CLICK ───────────────────────────────────────────
function spawnConfetti(origin) {
  const rect  = origin.getBoundingClientRect();
  const cx    = rect.left + rect.width  / 2 + window.scrollX;
  const cy    = rect.top  + rect.height / 2 + window.scrollY;
  const colors = ['#4a90d9', '#7ec8e3', '#e8c97a', '#b8d9f0', '#f5e0a0'];

  for (let i = 0; i < 18; i++) {
    const dot = document.createElement('div');
    const size  = Math.random() * 7 + 4;
    const angle = Math.random() * Math.PI * 2;
    const dist  = Math.random() * 80 + 40;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const dur   = Math.random() * 400 + 500;

    dot.style.cssText = `
      position:absolute;
      width:${size}px; height:${size}px;
      border-radius:50%;
      background:${color};
      left:${cx}px; top:${cy}px;
      pointer-events:none;
      z-index:9999;
      transition:transform ${dur}ms ease-out, opacity ${dur}ms ease-out;
      opacity:1;
    `;
    document.body.appendChild(dot);

    // Force reflow
    dot.getBoundingClientRect();

    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist - 30;
    dot.style.transform = `translate(${tx}px, ${ty}px)`;
    dot.style.opacity   = '0';

    setTimeout(() => dot.remove(), dur + 50);
  }
}


// ── 7. CURSORE PERSONALIZZATO (stelline) ─────────────────────────────
(function initCursor() {
  // Solo su desktop
  if (window.matchMedia('(hover: none)').matches) return;

  const trail = [];
  const TRAIL_LEN = 8;

  for (let i = 0; i < TRAIL_LEN; i++) {
    const dot = document.createElement('div');
    const s   = 6 - i * 0.5;
    dot.style.cssText = `
      position:fixed; pointer-events:none; z-index:99999;
      width:${s}px; height:${s}px; border-radius:50%;
      background:rgba(126,200,227,${0.7 - i * 0.08});
      transform:translate(-50%,-50%);
      transition:left ${i * 40}ms ease, top ${i * 40}ms ease;
    `;
    document.body.appendChild(dot);
    trail.push(dot);
  }

  document.addEventListener('mousemove', e => {
    trail.forEach(dot => {
      dot.style.left = e.clientX + 'px';
      dot.style.top  = e.clientY + 'px';
    });
  });
})();


// ── 8. SCROLL PROGRESS (sfumatura aziendale sulla scroll bar) ─────────
(function initProgressBar() {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position:fixed; top:0; left:0; height:3px; z-index:99998;
    background:linear-gradient(90deg, #2563b8, #7ec8e3, #e8c97a);
    width:0%; transition:width 0.1s linear;
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct   = (window.scrollY / total) * 100;
    bar.style.width = pct + '%';
  }, { passive: true });
})();
