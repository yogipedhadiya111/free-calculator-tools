/**
 * File: utils.js
 * Purpose: Shared helpers for DOM selection, class management, and safe iteration.
 * Notes: Keep this logic lightweight and reusable.
 */

const select = (selector, context = document) => context.querySelector(selector);
const selectAll = (selector, context = document) => Array.from(context.querySelectorAll(selector));

const setText = (element, value) => {
  if (element) {
    element.textContent = value;
  }
};

const debounce = (callback, delay = 200) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...args), delay);
  };
};
