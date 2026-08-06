/**
 * File: navigation.js
 * Purpose: Sticky header behavior, mobile navigation, and progress tracking.
 * Notes: Keeps the shared header interactive and accessible.
 */

const initNavigation = () => {
  const header = select('.header');
  const progressBar = select('.scroll-progress');
  const hamburger = select('#hamburger');
  const mobileMenu = select('#mobile-menu');

  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 12);
      if (progressBar) {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = `${Math.min(100, Math.max(0, scrollPercent))}%`;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const expanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!expanded));
      mobileMenu.style.display = expanded ? 'none' : 'flex';
    });
  }
};
