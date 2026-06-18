/*
  contact-form.js
  Builds service options from machines.json and validates the enquiry form.
  NOTE: browsers block fetch() on JSON when opening pages directly from file://.
*/

async function loadServiceOptions() {
  const select = document.getElementById('serviceSelect');
  if (!select) return;
  try {
    const response = await fetch('data/machines.json');
    if (!response.ok) throw new Error('Unable to load services.');
    const machines = await response.json();
    const categories = [...new Set(machines.map((item) => item.category))];
    select.innerHTML = `
      <option value="">Select a service</option>
      ${categories.map((category) => `<option value="${category}">${category}</option>`).join('')}
    `;
  } catch (error) {
    console.error(error);
  }
}

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function showAlert(type, title, text) {
  Swal.fire({
    icon: type,
    title,
    text,
    confirmButtonColor: '#d4af37',
  });
}

function handleContactSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('nameInput')?.value.trim();
  const phone = document.getElementById('phoneInput')?.value.trim();
  const email = document.getElementById('emailInput')?.value.trim();
  const service = document.getElementById('serviceSelect')?.value;
  const message = document.getElementById('messageInput')?.value.trim();

  if (!name || !phone || !email || !service || !message) {
    showAlert('error', 'Missing information', 'Please complete every field before sending your enquiry.');
    return;
  }
  if (!validateEmail(email)) {
    showAlert('error', 'Invalid email', 'Please enter a valid email address.');
    return;
  }

  Swal.fire({
    icon: 'success',
    title: 'Message sent',
    text: 'Thank you — we will contact you soon about your printing request.',
    confirmButtonColor: '#d4af37',
  });
  document.getElementById('contactForm')?.reset();
}

function confirmContactAction(url, title) {
  Swal.fire({
    icon: 'question',
    title,
    showCancelButton: true,
    confirmButtonText: 'Continue',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#d4af37',
  }).then((result) => {
    if (result.isConfirmed) {
      window.open(url, '_blank');
    }
  });
}

function attachContactHandlers() {
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', handleContactSubmit);
  }
  const callBtn = document.getElementById('callBtn');
  const whatsappBtn = document.getElementById('whatsappBtn');
  if (callBtn) {
    callBtn.addEventListener('click', () => confirmContactAction('tel:+91 95785 35324', 'Call Tirupattur Multi Print?'));
  }
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => confirmContactAction('https://wa.me/919578535324?text=Hello%20TMP', 'Chat on WhatsApp?'));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadServiceOptions();
  attachContactHandlers();
});
