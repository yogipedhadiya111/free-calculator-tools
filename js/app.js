/**
 * File: app.js
 * Purpose: Application bootstrap and core interactive initialization.
 * Notes: This file wires the homepage template together with the shared modules.
 */

const initFaq = () => {
  const items = selectAll('.faq-item');
  items.forEach((item) => {
    const button = select('.faq-question', item);
    button?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      items.forEach((entry) => entry.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });
};

const initNewsletter = () => {
  const form = select('#newsletter-form');
  const message = select('#form-message');

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (message) {
      message.textContent = 'Thanks for subscribing. New updates are on the way.';
    }
  });
};

const initStats = () => {
  const countElements = selectAll('[data-count]');
  countElements.forEach((element) => {
    const target = Number(element.dataset.count || 0);
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 25));
    const timer = window.setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        window.clearInterval(timer);
      }
      setText(element, current.toString());
    }, 50);
  });
};

const initPage = () => {
  initTheme();
  initNavigation();
  initSearch();
  initFaq();
  initNewsletter();
  initStats();
  setText(select('#year'), new Date().getFullYear().toString());
};

document.addEventListener('DOMContentLoaded', initPage);
