/*
  includeHTML.js
  Loads shared header/footer into every page, sets the active nav link,
  and adds floating WhatsApp + back-to-top actions.
  NOTE: Browsers block fetch() on local file:// requests. Use a local server.
*/

async function loadPartial(src, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  try {
    const response = await fetch(src);
    if (!response.ok) {
      throw new Error(`Unable to load partial: ${src}`);
    }
    container.innerHTML = await response.text();
  } catch (error) {
    console.error(error);
  }
}

function setActiveNav() {
  const path = window.location.pathname.split('/').pop();
  const current = path || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-link').forEach((link) => {
    const href = link.getAttribute('href') || '';
    if (href.includes(current) || (current === 'index.html' && href.includes('index.html'))) {
      link.classList.add('text-gold', 'font-semibold');
    }
  });
}

function initMobileNav() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileCloseBtn = document.getElementById('mobileCloseBtn');
  const mobileNav = document.getElementById('mobileNav');
  if (!mobileNav || !mobileMenuBtn || !mobileCloseBtn) return;

  const toggleMobileNav = (open) => {
    mobileNav.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };

  mobileMenuBtn.addEventListener('click', () => toggleMobileNav(true));
  mobileCloseBtn.addEventListener('click', () => toggleMobileNav(false));
  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => toggleMobileNav(false));
  });
}

function addFloatingActions() {
  if (document.getElementById('floating-actions')) return;
  document.body.insertAdjacentHTML('beforeend', `
    <button id="backToTop" class="hidden fixed text-xl" aria-label="Back to top">
      <i class="fa-solid fa-chevron-up"></i>
    </button>
    <a id="whatsappButton" class="fixed" href="https://wa.me/919000000000?text=Hello%20TMP" target="_blank" rel="noreferrer noopener" aria-label="WhatsApp us">
      <i class="fa-brands fa-whatsapp"></i>
    </a>
  `);

  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 220) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

async function initializeSharedLayout() {
  await loadPartial('partials/header.html', 'header-placeholder');
  await loadPartial('partials/footer.html', 'footer-placeholder');
  setActiveNav();
  initMobileNav();
  addFloatingActions();
  const yearElement = document.getElementById('currentYear');
  if (yearElement) yearElement.textContent = new Date().getFullYear();
  AOS?.init({ duration: 700, once: true, anchorPlacement: 'top-bottom' });
  // Initialize translations (language toggle)
  initLanguageToggle();
}

const TRANSLATIONS = {
  en: {
    'nav.home': 'Home',
    'nav.machinery': 'Machinery',
    'nav.gallery': 'Gallery',
    'nav.visit': 'Visit Us',
    'nav.enquire': 'Enquire Now',
    'site.tagline': 'We Print Your Vision, We Deliver Perfection.',
    'hero.title': 'We Print Your Vision, We Deliver Perfection.',
    'hero.lead': 'A full-service print and packaging studio in Avvai Nagar, Tirupattur, offering gold foil, UV, die-cut, lamination, binding and customised print products under one roof.',
    'btn.quote': 'Get a Free Quote',
    'btn.explore': 'Explore Machinery'
  },
  ta: {
    'nav.home': 'முகப்பு',
    'nav.machinery': 'எந்திரங்கள்',
    'nav.gallery': 'கேலரி',
    'nav.visit': 'எங்களை காணவும்',
    'nav.enquire': 'கேள்வி பதியுங்கள்',
    'site.tagline': 'உங்கள் பார்வையை நாங்கள் அச்சிடுகிறோம், நாங்கள் சிறப்பாக வழங்குகிறோம்.'
    , 'hero.title': 'உங்கள் பார்வையை நாங்கள் அச்சிடுகிறோம், நாங்கள் சிறப்பாக வழங்குகிறோம்.',
    'hero.lead': 'அவ்வை நகர், திருப்பத்தூர் - உள்ள முழுமையான அச்சு மற்றும் பொதிஉலக சேவைகள்: தங்கப்பதக்கம், UV, டை-கட், லமினேஷன், பைனிஷிங் மற்றும் தனிப்பயன் அச்சு தயாரிப்புகள்.',
    'btn.quote': 'ஒரு இலவசக் குறிப்பு பெறுக',
    'btn.explore': 'எந்திரங்களை காண்க'
  }
};

function getSiteLang() {
  return localStorage.getItem('siteLang') || 'en';
}

function setSiteLang(lang) {
  localStorage.setItem('siteLang', lang);
}

function applyTranslations(lang) {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const translated = TRANSLATIONS[lang] && TRANSLATIONS[lang][key];
    if (translated) el.textContent = translated;
  });
  // Update language toggle labels
  const desktopBtn = document.getElementById('langToggle');
  const mobileBtn = document.getElementById('langToggleMobile');
  if (desktopBtn) desktopBtn.textContent = lang === 'en' ? 'தமிழ்' : 'EN';
  if (mobileBtn) mobileBtn.textContent = lang === 'en' ? 'தமிழ்' : 'EN';
}

function initLanguageToggle() {
  const current = getSiteLang();
  applyTranslations(current);
  const desktopBtn = document.getElementById('langToggle');
  const mobileBtn = document.getElementById('langToggleMobile');
  [desktopBtn, mobileBtn].forEach((btn) => {
    if (!btn) return;
    btn.addEventListener('click', () => {
      const newLang = getSiteLang() === 'en' ? 'ta' : 'en';
      setSiteLang(newLang);
      applyTranslations(newLang);
    });
  });
}

document.addEventListener('DOMContentLoaded', initializeSharedLayout);
