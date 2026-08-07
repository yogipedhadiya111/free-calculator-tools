const select = (selector, scope = document) => scope.querySelector(selector);
const selectAll = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const initTheme = () => {
  const toggle = select('#theme-toggle');
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  if (toggle) {
    toggle.textContent = current === 'dark' ? '🌙' : '☀️';
    toggle.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      toggle.textContent = next === 'dark' ? '🌙' : '☀️';
    });
  }
};

const initNavigation = () => {
  const hamburger = select('#hamburger');
  const mobileMenu = select('#mobile-menu');
  hamburger?.addEventListener('click', () => {
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', String(!expanded));
    mobileMenu.style.display = expanded ? 'none' : 'flex';
  });
};

const initFaq = () => {
  selectAll('.faq-item').forEach((item) => {
    const button = select('.faq-question', item);
    button?.addEventListener('click', () => {
      const active = item.classList.contains('active');
      selectAll('.faq-item').forEach((entry) => entry.classList.remove('active'));
      if (!active) {
        item.classList.add('active');
        button.setAttribute('aria-expanded', 'true');
      } else {
        button.setAttribute('aria-expanded', 'false');
      }
    });
  });
};

const initBackToTop = () => {
  const button = select('#back-to-top');
  const progress = select('.scroll-progress');
  const update = () => {
    const scrollTop = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? scrollTop / max : 0;
    progress.style.transform = `scaleX(${ratio})`;
    button.style.display = scrollTop > 400 ? 'inline-flex' : 'none';
  };
  window.addEventListener('scroll', update, { passive: true });
  button?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  update();
};

const initFooterYear = () => {
  const yearTarget = select('#year');
  if (yearTarget) {
    yearTarget.textContent = new Date().getFullYear();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initFaq();
  initBackToTop();
  initFooterYear();
});
