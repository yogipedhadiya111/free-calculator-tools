/**
 * File: search.js
 * Purpose: Search behavior for calculator cards and quick discovery.
 * Notes: The filtering stays lightweight and can scale to larger data sets later.
 */

const initSearch = () => {
  const searchInput = select('#calculator-search');
  const quickSearchInput = select('#quick-search');
  const cards = selectAll('.calculator-card');

  const filterCards = (query) => {
    const normalizedQuery = query.trim().toLowerCase();

    cards.forEach((card) => {
      const text = card.dataset.search || card.textContent.toLowerCase();
      const match = text.includes(normalizedQuery);
      card.classList.toggle('is-hidden', normalizedQuery && !match);
    });
  };

  const onInput = (event) => {
    filterCards(event.target.value);
  };

  if (searchInput) {
    searchInput.addEventListener('input', onInput);
    searchInput.closest('form')?.addEventListener('submit', (event) => {
      event.preventDefault();
      filterCards(searchInput.value);
    });
  }

  if (quickSearchInput) {
    quickSearchInput.addEventListener('input', onInput);
  }
};
