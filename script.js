document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.add('js-on');

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─── Sticky nav state ─────────────────────────── */
  const topbar = document.getElementById('topbar');
  if (topbar) {
    const onScroll = () => topbar.classList.toggle('is-scrolled', window.scrollY > 32);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ─── Scroll progress bar ──────────────────────── */
  const progress = document.querySelector('.scroll-progress span');
  if (progress) {
    let ticking = false;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      document.documentElement.style.setProperty('--scroll-progress', pct.toFixed(2) + '%');
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    update();
  }

  /* ─── Reveal on scroll ─────────────────────────── */
  const revealSelectors = [
    'main .section',
    '.metric-chip',
    '.router-card',
    '.acc-item',
    '.platform-card',
    '.project-card',
    '.guild-card'
  ].join(',');
  const revealTargets = Array.from(document.querySelectorAll(revealSelectors));

  if (reduced || !('IntersectionObserver' in window)) {
    revealTargets.forEach(el => el.classList.add('is-visible'));
  } else {
    const viewportHeight = window.innerHeight;
    revealTargets.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < viewportHeight - 40) {
        el.classList.add('is-visible');
      } else {
        el.classList.add('reveal');
      }
    });
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

  /* ─── Animated metric counters ─────────────────── */
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
      el.textContent = Math.floor(target * eased) + suffix;
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

  /* ─── Live countdown to CMMC deadline ──────────── */
  const countdownEl = document.querySelector('.countdown[data-deadline]');
  if (countdownEl) {
    const deadline = new Date(countdownEl.dataset.deadline).getTime();
    const fields = {
      days: countdownEl.querySelector('[data-unit="days"]'),
      hours: countdownEl.querySelector('[data-unit="hours"]'),
      minutes: countdownEl.querySelector('[data-unit="minutes"]'),
      seconds: countdownEl.querySelector('[data-unit="seconds"]')
    };
    const pad = (n, w = 2) => String(Math.max(0, n)).padStart(w, '0');
    const render = () => {
      const diff = deadline - Date.now();
      if (diff <= 0) {
        if (fields.days) fields.days.textContent = '000';
        if (fields.hours) fields.hours.textContent = '00';
        if (fields.minutes) fields.minutes.textContent = '00';
        if (fields.seconds) fields.seconds.textContent = '00';
        return false;
      }
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      if (fields.days) fields.days.textContent = pad(days, 3);
      if (fields.hours) fields.hours.textContent = pad(hours);
      if (fields.minutes) fields.minutes.textContent = pad(minutes);
      if (fields.seconds) fields.seconds.textContent = pad(seconds);
      return true;
    };
    if (render()) setInterval(render, 1000);
  }

  /* ─── Scroll-spy active nav link ───────────────── */
  const navLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
  const sectionMap = new Map();
  navLinks.forEach(a => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) sectionMap.set(target, a);
  });
  if (sectionMap.size && 'IntersectionObserver' in window) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(e => {
        const link = sectionMap.get(e.target);
        if (!link) return;
        if (e.isIntersecting) {
          navLinks.forEach(a => a.classList.remove('is-active'));
          link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    sectionMap.forEach((_link, section) => spy.observe(section));
  }

  /* ─── Cursor-follow glow on cards ──────────────── */
  if (!reduced && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('[data-glow]').forEach(card => {
      card.addEventListener('pointermove', e => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--glow-x', x + '%');
        card.style.setProperty('--glow-y', y + '%');
      });
    });
  }

  /* ─── Services accordion (single-open) ─────────── */
  const accItems = Array.from(document.querySelectorAll('.acc-item'));
  accItems.forEach(item => {
    const trigger = item.querySelector('.acc-trigger');
    if (!trigger) return;
    trigger.addEventListener('click', () => {
      const willOpen = !item.classList.contains('is-open');
      accItems.forEach(other => {
        other.classList.remove('is-open');
        const t = other.querySelector('.acc-trigger');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
      if (willOpen) {
        item.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ─── Proof-of-Work tabs ───────────────────────── */
  const tabs = Array.from(document.querySelectorAll('.tab[data-tab]'));
  const panels = Array.from(document.querySelectorAll('.tab-panel[data-panel]'));
  const activateTab = name => {
    let matched = false;
    tabs.forEach(tab => {
      const on = tab.dataset.tab === name;
      if (on) matched = true;
      tab.classList.toggle('is-active', on);
      tab.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    if (!matched) return;
    panels.forEach(panel => {
      const on = panel.dataset.panel === name;
      panel.classList.toggle('is-active', on);
      if (on) panel.removeAttribute('hidden');
      else panel.setAttribute('hidden', '');
    });
  };
  tabs.forEach(tab => {
    tab.addEventListener('click', () => activateTab(tab.dataset.tab));
  });

  /* ─── Router cards that open a specific Work tab ── */
  document.querySelectorAll('[data-open-tab]').forEach(card => {
    card.addEventListener('click', () => activateTab(card.dataset.openTab));
  });
});
