document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.add('js-on');

  const topbar = document.getElementById('topbar');
  if (topbar) {
    const onScroll = () => topbar.classList.toggle('is-scrolled', window.scrollY > 32);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const revealSelectors = [
    'main .section',
    '.stage-card',
    '.skill-card',
    '.platform-card',
    '.project-card',
    '.guild-card',
    '.follow-card',
    '.endorse-col',
    '.metric-card'
  ].join(',');
  const revealTargets = Array.from(document.querySelectorAll(revealSelectors));

  if (reduced || !('IntersectionObserver' in window)) {
    revealTargets.forEach(el => el.classList.add('is-visible'));
  } else {
    const viewportHeight = window.innerHeight;
    const aboveFold = [];
    revealTargets.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < viewportHeight - 40) {
        aboveFold.push(el);
      } else {
        el.classList.add('reveal');
      }
    });
    aboveFold.forEach(el => el.classList.add('is-visible'));

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  }

  const counters = document.querySelectorAll('[data-count]');
  const animateCount = el => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    if (reduced || isNaN(target)) {
      el.textContent = (isNaN(target) ? el.textContent : target) + suffix;
      return;
    }
    const duration = 1300;
    const start = performance.now();
    const tick = now => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.floor(target * eased);
      el.textContent = value + suffix;
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = target + suffix;
    };
    requestAnimationFrame(tick);
  };

  if (counters.length) {
    if (!('IntersectionObserver' in window)) {
      counters.forEach(animateCount);
    } else {
      const cio = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            animateCount(e.target);
            cio.unobserve(e.target);
          }
        });
      }, { threshold: 0.4 });
      counters.forEach(el => cio.observe(el));
    }
  }
});
