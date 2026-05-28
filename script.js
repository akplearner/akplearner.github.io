document.addEventListener('DOMContentLoaded', () => {
  const modalOverlay = document.getElementById('modal-overlay');
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

  document.querySelector('.modal-close').addEventListener('click', () => {
    modalOverlay.classList.add('hidden');
  });

  modalOverlay.addEventListener('click', event => {
    if (event.target === modalOverlay) {
      modalOverlay.classList.add('hidden');
    }
  });

  window.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      modalOverlay.classList.add('hidden');
    }
  });
});
