/*
  counters.js
  Animates numeric counters when they scroll into view.
  NOTE: this works only when serving pages from a local web server.
*/

function animateNumber(element, target) {
  const duration = 1400;
  const stepTime = Math.max(Math.floor(duration / target), 8);
  let current = 0;
  const timer = setInterval(() => {
    current += 1;
    element.textContent = current.toLocaleString();
    if (current >= target) {
      clearInterval(timer);
    }
  }, stepTime);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-target]');
  if (!counters.length) return;
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const target = parseInt(element.dataset.target, 10);
        animateNumber(element, target);
        obs.unobserve(element);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach((counter) => observer.observe(counter));
}

document.addEventListener('DOMContentLoaded', initCounters);
