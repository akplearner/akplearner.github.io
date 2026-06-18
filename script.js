document.addEventListener('DOMContentLoaded', () => {
  // ---- Funnel step toggle (collapse / expand) ----
  document.querySelectorAll('.step-card').forEach(card => {
    const toggle = card.querySelector('.step-toggle');
    const header = card.querySelector('.step-header');
    if (!toggle) return;

    const setState = open => {
      card.classList.toggle('expanded', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.textContent = open ? '−' : '+';
    };

    const handler = event => {
      if (event.target.closest('a, button') && event.target !== toggle) return;
      event.preventDefault();
      setState(!card.classList.contains('expanded'));
    };

    toggle.addEventListener('click', handler);
    if (header) header.addEventListener('click', handler);
  });

  // ---- Modal (kept for compatibility with any diagram-card content) ----
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
