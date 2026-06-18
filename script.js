document.addEventListener('DOMContentLoaded', () => {

  // ---- Theme (dark mode) toggle ----
  const root = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle ? themeToggle.querySelector('.theme-icon') : null;

  const applyTheme = theme => {
    root.setAttribute('data-theme', theme);
    if (themeToggle) themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    if (themeIcon) themeIcon.textContent = theme === 'dark' ? '☼' : '☾';
  };

  const stored = (() => { try { return localStorage.getItem('theme'); } catch (e) { return null; } })();
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(stored || (prefersDark ? 'dark' : 'light'));

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  // ---- Generic collapsible (funnel steps + project cards) ----
  const wireCollapsible = (cardSelector, toggleSelector, headSelector, expandedClass) => {
    document.querySelectorAll(cardSelector).forEach(card => {
      const toggle = card.querySelector(toggleSelector);
      const head = headSelector ? card.querySelector(headSelector) : null;
      if (!toggle) return;

      const setState = open => {
        card.classList.toggle(expandedClass, open);
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.textContent = open ? '−' : '+';
      };

      const handler = event => {
        if (event.target.closest('a, button, select, input, textarea') && event.target !== toggle && event.target !== head) return;
        event.preventDefault();
        setState(!card.classList.contains(expandedClass));
      };

      toggle.addEventListener('click', handler);
      if (head) head.addEventListener('click', handler);
    });
  };

  wireCollapsible('.step-card', '.step-toggle', '.step-header', 'expanded');
  wireCollapsible('.project-card.collapsible', '.collapse-toggle', '.project-card-head', 'expanded');

  // ---- Contact form (Web3Forms) ----
  const form = document.querySelector('.contact-form');
  const status = document.getElementById('form-status');

  if (form && status) {
    form.addEventListener('submit', async event => {
      event.preventDefault();
      status.hidden = false;
      status.className = 'form-status';
      status.textContent = 'Sending…';

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.success !== false) {
          form.reset();
          status.className = 'form-status success';
          status.textContent = "Got it — I'll reply when I can.";
        } else {
          status.className = 'form-status error';
          status.innerHTML = "Couldn't send. Reach me on <a href=\"https://www.linkedin.com/in/kerrypp/\" target=\"_blank\" rel=\"noopener\">LinkedIn</a> instead.";
        }
      } catch (err) {
        status.className = 'form-status error';
        status.innerHTML = "Couldn't send. Reach me on <a href=\"https://www.linkedin.com/in/kerrypp/\" target=\"_blank\" rel=\"noopener\">LinkedIn</a> instead.";
      }
    });
  }

  // ---- Hide CV link until cv.pdf exists ----
  const cvLink = document.getElementById('cv-link');
  if (cvLink) {
    fetch('cv.pdf', { method: 'HEAD' })
      .then(res => { if (!res.ok) cvLink.hidden = true; })
      .catch(() => { cvLink.hidden = true; });
  }

  // ---- Modal (legacy diagram-card support) ----
  const modalOverlay = document.getElementById('modal-overlay');
  if (!modalOverlay) return;
  const modalTitle = document.getElementById('modal-title');
  const modalDescription = document.getElementById('modal-description');
  const modalTools = document.getElementById('modal-tools');
  const modalImpact = document.getElementById('modal-impact');

  document.querySelectorAll('.modal-open').forEach(button => {
    button.addEventListener('click', () => {
      const card = button.closest('.diagram-card');
      if (!card) return;
      modalTitle.textContent = card.dataset.title || '';
      modalDescription.textContent = card.dataset.description || '';
      modalTools.textContent = card.dataset.tools || '';
      modalImpact.textContent = card.dataset.impact || '';
      modalOverlay.classList.remove('hidden');
    });
  });

  const closeBtn = document.querySelector('.modal-close');
  if (closeBtn) closeBtn.addEventListener('click', () => modalOverlay.classList.add('hidden'));

  modalOverlay.addEventListener('click', event => {
    if (event.target === modalOverlay) modalOverlay.classList.add('hidden');
  });

  window.addEventListener('keydown', event => {
    if (event.key === 'Escape') modalOverlay.classList.add('hidden');
  });
});
