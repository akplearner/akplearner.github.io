document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#primary-nav');

  if (menuToggle && navigation) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
      navigation.dataset.open = String(!isOpen);
    });

    navigation.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        navigation.dataset.open = 'false';
      });
    });
  }

  const pathTabs = Array.from(document.querySelectorAll('.path-tab[data-path]'));
  const pathPanels = Array.from(document.querySelectorAll('.path-panel[data-path-panel]'));

  const activatePath = (name, moveFocus = false) => {
    const selectedTab = pathTabs.find(tab => tab.dataset.path === name);
    if (!selectedTab) return;

    pathTabs.forEach(tab => {
      const isActive = tab === selectedTab;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
      tab.tabIndex = isActive ? 0 : -1;
    });

    pathPanels.forEach(panel => {
      const isActive = panel.dataset.pathPanel === name;
      panel.hidden = !isActive;
      panel.classList.toggle('is-active', isActive);
    });

    if (moveFocus) selectedTab.focus();
  };

  pathTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activatePath(tab.dataset.path));
    tab.addEventListener('keydown', event => {
      let nextIndex;
      if (event.key === 'ArrowRight') nextIndex = (index + 1) % pathTabs.length;
      else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + pathTabs.length) % pathTabs.length;
      else if (event.key === 'Home') nextIndex = 0;
      else if (event.key === 'End') nextIndex = pathTabs.length - 1;
      else return;

      event.preventDefault();
      activatePath(pathTabs[nextIndex].dataset.path, true);
    });
  });

  const serviceType = document.querySelector('#service-type');
  const serviceContactLink = document.querySelector('#service-contact-link');
  if (serviceType && serviceContactLink) {
    serviceType.addEventListener('change', () => {
      const service = serviceType.value;
      if (!service) return;

      serviceContactLink.href = `mailto:kerry.p.pro@gmail.com?subject=${encodeURIComponent(`Service inquiry: ${service}`)}`;
      serviceContactLink.textContent = 'Ask about this service →';
      serviceContactLink.classList.remove('is-disabled');
      serviceContactLink.removeAttribute('aria-disabled');
      serviceContactLink.removeAttribute('tabindex');
    });
  }

  const year = document.querySelector('#current-year');
  if (year) year.textContent = String(new Date().getFullYear());
});
