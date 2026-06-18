/*
  machinery.js
  Loads machine data from data/machines.json and renders cards + detail modal.
  NOTE: fetch() fails on file://. Use a local server to preview the site.
*/

let machineRecords = [];
let galleryRecords = [];

function getInitialCategory() {
  const params = new URLSearchParams(window.location.search);
  return params.get('category') || 'All';
}

async function loadMachines() {
  try {
    const [machineRes, galleryRes] = await Promise.all([
      fetch('data/machines.json'),
      fetch('data/gallery.json'),
    ]);
    if (!machineRes.ok || !galleryRes.ok) {
      throw new Error('Unable to fetch machine or gallery data.');
    }
    machineRecords = await machineRes.json();
    galleryRecords = await galleryRes.json();
    const initialCategory = getInitialCategory();
    renderMachineFilters(initialCategory);
    renderMachineCards(initialCategory);
    attachModalListeners();
  } catch (error) {
    console.error(error);
  }
}

function renderMachineFilters(activeCategory = 'All') {
  const filterContainer = document.getElementById('machine-filter');
  if (!filterContainer) return;
  const categories = ['All', ...new Set(machineRecords.map((item) => item.category))];
  filterContainer.innerHTML = categories
    .map(
      (category) => `
      <button type="button" data-category="${category}" class="pill px-4 py-2 rounded-full text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gold">${category}</button>
    `
    )
    .join('');

  filterContainer.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', () => {
      filterContainer.querySelectorAll('button').forEach((btn) => btn.classList.remove('pill-active'));
      button.classList.add('pill-active');
      renderMachineCards(button.dataset.category);
    });
  });
  const selectedButton = filterContainer.querySelector(`button[data-category="${activeCategory}"]`) || filterContainer.querySelector('button[data-category="All"]');
  selectedButton?.classList.add('pill-active');
}

function renderMachineCards(category = 'All') {
  const iconMap = {
    stamp: 'fa-stamp',
    sun: 'fa-sun',
    layers: 'fa-layer-group',
    scissors: 'fa-scissors',
    palette: 'fa-palette',
    shield: 'fa-shield-halved',
    flame: 'fa-fire',
    book: 'fa-book-open',
    'rotate-cw': 'fa-rotate-right',
    'book-marked': 'fa-bookmark'
  };
  const grid = document.getElementById('machine-grid');
  if (!grid) return;
  const filtered = category === 'All'
    ? machineRecords
    : machineRecords.filter((item) => item.category === category);

  grid.innerHTML = filtered
    .map((machine) => {
      const iconClass = iconMap[machine.icon] || 'fa-industry';
      return `
      <article class="card card-glow overflow-hidden rounded-3xl p-0 transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
        <button type="button" class="w-full text-left" onclick="openMachineModal('${machine.id}')">
          <div class="relative overflow-hidden">
            <img src="${machine.image}" alt="${machine.name}" loading="lazy" onerror="this.src='images/logo/tmp-mark.svg'; this.style.objectFit='contain'" class="h-64 w-full object-cover transition duration-500 hover:scale-105" />
            <span class="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-xs uppercase tracking-[0.2em] text-gold">${machine.category}</span>
          </div>
          <div class="p-6">
            <div class="flex items-center gap-3 text-gold text-lg font-semibold">
              <i class="fa-solid ${iconClass}"></i>
              <h3>${machine.name}</h3>
            </div>
            <p class="mt-3 text-sm leading-6 text-gray-300">${machine.shortDescription}</p>
          </div>
        </button>
      </article>
    `;
    })
    .join('');
}

function buildRelatedThumbnails(category) {
  const related = galleryRecords.filter((item) => item.category === category).slice(0, 3);
  if (!related.length) return '<p class="text-sm text-gray-400">No related samples available yet.</p>';
  return related
    .map(
      (item) => `
        <div class="w-1/3 overflow-hidden rounded-3xl border border-gold/20 bg-[#111]">
          <img src="${item.image}" alt="${item.title}" loading="lazy" class="h-24 w-full object-cover" />
          <div class="p-3 text-xs text-gray-300">${item.title}</div>
        </div>
      `
    )
    .join('');
}

function openMachineModal(id) {
  const machine = machineRecords.find((item) => item.id === id);
  if (!machine) return;
  const modal = document.getElementById('machine-modal');
  const modalBody = document.getElementById('machine-modal-body');
  if (!modal || !modalBody) return;
  modalBody.innerHTML = `
    <div class="modal-panel p-6">
      <div class="flex items-center justify-between gap-4 mb-6">
        <div>
          <p class="text-gold uppercase tracking-[0.26em] text-sm">${machine.category}</p>
          <h2 class="mt-3 text-3xl font-display text-soft">${machine.name}</h2>
        </div>
        <button type="button" class="modal-close text-2xl text-gray-300">&times;</button>
      </div>
      <img src="${machine.image}" alt="${machine.name}" loading="lazy" onerror="this.src='images/logo/tmp-mark.svg'; this.style.objectFit='contain'" class="mb-6 rounded-3xl border border-gold/15" />
      <div class="grid gap-6 lg:grid-cols-2">
        <div class="space-y-4">
          <h3 class="font-semibold text-gold">How it Works</h3>
          <p class="text-gray-300 leading-7">${machine.howItWorks}</p>
        </div>
        <div class="space-y-4">
          <h3 class="font-semibold text-gold">Why We Use It</h3>
          <p class="text-gray-300 leading-7">${machine.whyUsed}</p>
        </div>
      </div>
      <div class="mt-8">
        <h4 class="text-gold font-semibold">Related job samples</h4>
        <div class="mt-4 flex flex-wrap gap-4">${buildRelatedThumbnails(machine.relatedGalleryCategory)}</div>
      </div>
    </div>
  `;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMachineModal() {
  const modal = document.getElementById('machine-modal');
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

function attachModalListeners() {
  const modal = document.getElementById('machine-modal');
  if (!modal) return;
  modal.addEventListener('click', (event) => {
    if (event.target === modal || event.target.closest('.modal-close')) {
      closeMachineModal();
    }
  });
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMachineModal();
    }
  });
}

window.openMachineModal = openMachineModal;

document.addEventListener('DOMContentLoaded', loadMachines);
