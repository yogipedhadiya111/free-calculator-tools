/**
 * File: theme.js
 * Purpose: Theme switching and persistence for light and dark mode.
 * Notes: This keeps the interface accessible and consistent across pages.
 */

const applyTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
};

const initTheme = () => {
  const toggleButton = select('#theme-toggle');
  if (!toggleButton) return;

  const icon = select('#theme-toggle .icon', toggleButton.parentElement || document);
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';

  const updateButton = (theme) => {
    if (icon) {
      icon.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
    toggleButton.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  };

  updateButton(currentTheme);

  toggleButton.addEventListener('click', () => {
    const nextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    updateButton(nextTheme);
  });
};
