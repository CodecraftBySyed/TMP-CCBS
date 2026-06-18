/*
  testimonials.js
  Loads testimonials from data/testimonials.json and renders preview/full review sections.
  NOTE: fetch() must run from a local server due to browser file:// restrictions.
*/

let testimonialItems = [];

async function loadTestimonials() {
  try {
    const response = await fetch('data/testimonials.json');
    if (!response.ok) throw new Error('Unable to fetch testimonials.');
    testimonialItems = await response.json();
    renderTestimonialPreview(testimonialItems.slice(0, 3));
    renderReviewCards(testimonialItems);
    renderFullTestimonials(testimonialItems);
    renderReviewSummary(testimonialItems);
  } catch (error) {
    console.error(error);
  }
}

function renderTestimonialPreview(items) {
  const previewContainer = document.getElementById('testimonial-preview');
  if (!previewContainer) return;
  previewContainer.innerHTML = items
    .map(
      (item) => `
        <article class="card card-glow rounded-3xl p-6 text-left">
          <div class="flex items-center gap-4">
            <img src="${item.photo}" alt="${item.name}" loading="lazy" onerror="this.src='images/logo/tmp-mark.svg'; this.style.objectFit='contain'" class="h-16 w-16 rounded-2xl object-cover" />
            <div>
              <p class="font-semibold text-soft">${item.name}</p>
              <p class="text-sm uppercase tracking-[0.2em] text-gold">${'★'.repeat(item.rating)}${'☆'.repeat(5 - item.rating)}</p>
            </div>
          </div>
          <p class="mt-4 text-gray-300 leading-7">${item.text}</p>
        </article>
      `
    )
    .join('');
}

function renderReviewCards(items) {
  const cardContainer = document.getElementById('review-cards');
  if (!cardContainer) return;
  cardContainer.innerHTML = items
    .slice(0, 4)
    .map(
      (item) => `
        <article class="card card-glow rounded-3xl p-6 bg-[#111]">
          <div class="flex items-center gap-4">
            <img src="${item.photo}" alt="${item.name}" loading="lazy" onerror="this.src='images/logo/tmp-mark.svg'; this.style.objectFit='contain'" class="h-14 w-14 rounded-full object-cover" />
            <div>
              <h3 class="font-semibold text-soft">${item.name}</h3>
              <p class="text-sm text-gold">${'★'.repeat(item.rating)}${'☆'.repeat(5 - item.rating)}</p>
            </div>
          </div>
          <p class="mt-4 text-gray-300 leading-7">${item.text}</p>
        </article>
      `
    )
    .join('');
}

function renderFullTestimonials(items) {
  const fullContainer = document.getElementById('all-testimonials');
  if (!fullContainer) return;
  fullContainer.innerHTML = items
    .map(
      (item) => `
        <article class="card card-glow rounded-3xl p-6 bg-[#111]">
          <div class="flex items-center gap-4">
            <img src="${item.photo}" alt="${item.name}" loading="lazy" onerror="this.src='images/logo/tmp-mark.svg'; this.style.objectFit='contain'" class="h-14 w-14 rounded-full object-cover" />
            <div>
              <h3 class="font-semibold text-soft">${item.name}</h3>
              <p class="text-sm text-gold">${'★'.repeat(item.rating)}${'☆'.repeat(5 - item.rating)}</p>
            </div>
          </div>
          <p class="mt-4 text-gray-300 leading-7">${item.text}</p>
        </article>
      `
    )
    .join('');
}

function renderReviewSummary(items) {
  const summary = document.getElementById('rating-summary');
  if (!summary || items.length === 0) return;
  const average = (items.reduce((sum, review) => sum + review.rating, 0) / items.length).toFixed(1);
  summary.innerHTML = `
    <div class="rounded-3xl border border-gold/20 bg-[#111] p-6 text-center">
      <p class="text-sm uppercase tracking-[0.3em] text-gold">Trusted by clients</p>
      <p class="mt-3 text-4xl font-display text-soft">${average}<span class="text-base text-gray-400">/5</span></p>
      <p class="mt-2 text-gray-300">Based on ${items.length} reviews and local service excellence.</p>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', loadTestimonials);
