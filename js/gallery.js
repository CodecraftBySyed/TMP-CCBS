/*
  gallery.js
  Loads gallery data from data/gallery.json, renders category filters, grid, and lightbox.
  NOTE: fetch() on JSON requires a local server, not file://.
*/

let galleryItems = [];
let activeGalleryItems = [];
let activeGalleryIndex = 0;
let galleryCategory = 'All';
let touchStartX = 0;
let touchEndX = 0;

async function loadGallery() {
  try {
    const response = await fetch('data/gallery.json');
    if (!response.ok) throw new Error('Unable to fetch gallery data.');
    galleryItems = await response.json();
    buildGalleryTabs();
    renderGallery();
    attachLightboxControls();
  } catch (error) {
    console.error(error);
  }
}

function buildGalleryTabs() {
  const container = document.getElementById('gallery-filter');
  if (!container) return;
  const categories = ['All', ...new Set(galleryItems.map((item) => item.categoryLabel))];
  container.innerHTML = categories
    .map(
      (category) => `
      <button type="button" data-category="${category}" class="pill px-4 py-2 rounded-full text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gold">${category}</button>
    `
    )
    .join('');

  container.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', () => {
      container.querySelectorAll('button').forEach((btn) => btn.classList.remove('pill-active'));
      button.classList.add('pill-active');
      galleryCategory = button.dataset.category;
      renderGallery(galleryCategory);
    });
  });
  container.querySelector('button[data-category="All"]').classList.add('pill-active');
}

function renderGallery(category = 'All') {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;
  const filtered = category === 'All'
    ? galleryItems
    : galleryItems.filter((item) => item.categoryLabel === category);
  activeGalleryItems = filtered;

  if (!filtered.length) {
    grid.innerHTML = '<p class="text-gray-300">No items found for this category.</p>';
    return;
  }

  grid.innerHTML = filtered
    .map(
      (item, index) => `
        <button type="button" class="group overflow-hidden rounded-3xl border border-gold/10 bg-[#111] transition hover:-translate-y-1 hover:shadow-2xl" onclick="openGalleryLightbox(${index})">
          <img src="${item.image}" alt="${item.title}" loading="lazy" onerror="this.src='images/logo/tmp-mark.svg'; this.style.objectFit='contain'" class="h-72 w-full object-cover transition duration-500 group-hover:scale-105" />
          <div class="p-4 text-left">
            <p class="text-xs uppercase tracking-[0.24em] text-gold">${item.categoryLabel}</p>
            <h3 class="mt-3 text-lg font-semibold text-soft">${item.title}</h3>
            <p class="mt-2 text-sm text-gray-400">${item.description}</p>
          </div>
        </button>
      `
    )
    .join('');
}

function openGalleryLightbox(index) {
  activeGalleryIndex = index;
  const overlay = document.getElementById('gallery-lightbox');
  if (!overlay) return;
  updateLightbox();
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeGalleryLightbox() {
  const overlay = document.getElementById('gallery-lightbox');
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

function updateLightbox() {
  const item = activeGalleryItems[activeGalleryIndex];
  if (!item) return;
  const imageElement = document.getElementById('lightbox-image');
  const titleElement = document.getElementById('lightbox-title');
  const descriptionElement = document.getElementById('lightbox-description');
  if (imageElement) imageElement.src = item.image;
  if (titleElement) titleElement.textContent = item.title;
  if (descriptionElement) descriptionElement.textContent = item.description;
}

function showNextGalleryItem() {
  if (!activeGalleryItems.length) return;
  activeGalleryIndex = (activeGalleryIndex + 1) % activeGalleryItems.length;
  updateLightbox();
}

function showPrevGalleryItem() {
  if (!activeGalleryItems.length) return;
  activeGalleryIndex = (activeGalleryIndex - 1 + activeGalleryItems.length) % activeGalleryItems.length;
  updateLightbox();
}

function attachLightboxControls() {
  const overlay = document.getElementById('gallery-lightbox');
  if (!overlay) return;
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay || event.target.closest('.lightbox-close')) {
      closeGalleryLightbox();
    }
  });
  document.addEventListener('keydown', (event) => {
    if (!overlay.classList.contains('open')) return;
    if (event.key === 'Escape') closeGalleryLightbox();
    if (event.key === 'ArrowRight') showNextGalleryItem();
    if (event.key === 'ArrowLeft') showPrevGalleryItem();
  });

  const lightboxPanel = document.querySelector('.lightbox-panel');
  if (!lightboxPanel) return;
  lightboxPanel.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0].screenX;
  });
  lightboxPanel.addEventListener('touchend', (event) => {
    touchEndX = event.changedTouches[0].screenX;
    if (touchEndX - touchStartX > 40) showPrevGalleryItem();
    if (touchStartX - touchEndX > 40) showNextGalleryItem();
  });
}

window.openGalleryLightbox = openGalleryLightbox;
window.showNextGalleryItem = showNextGalleryItem;
window.showPrevGalleryItem = showPrevGalleryItem;

document.addEventListener('DOMContentLoaded', loadGallery);
