document.addEventListener('DOMContentLoaded',()=>{
  // populate contact info
  const phone = window.CONFIG.phoneNumber || '';
  const email = window.CONFIG.email || '';
  const address = window.CONFIG.address || '';
  const callEl = document.getElementById('callNow');
  const emailEl = document.getElementById('emailNow');
  const addressEl = document.getElementById('addressText');
  if(callEl){
    callEl.textContent = phone || '';
    callEl.href = phone ? `tel:${phone}` : '#';
  }
  if(emailEl){
    emailEl.textContent = email || '';
    emailEl.href = email ? `mailto:${email}` : '#';
  }
  if(addressEl) addressEl.textContent = address || '';

  // map
  const map = document.getElementById('mapEmbed');
  if(map && window.CONFIG.mapEmbedUrl){
    const v = window.CONFIG.mapEmbedUrl.trim();
    // if user accidentally put a full iframe string, extract src
    if(v.startsWith('<iframe')){
      const m = v.match(/src\s*=\s*\"([^\"]+)\"/i);
      if(m && m[1]) map.src = m[1];
      else console.warn('Map iframe provided but src not found');
    }else if(v.startsWith('http')){
      map.src = v;
    }else{
      console.warn('mapEmbedUrl not a valid URL or iframe:', v);
    }
  }

  // floating whatsapp
  const waBtn = document.getElementById('floatWhatsapp');
  const heroWa = document.getElementById('heroWhatsapp');
  const waNumber = (window.CONFIG.whatsappNumber || '').replace(/[^0-9]/g,'');
  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent('Hello, I would like to enquire about printing services')}`;
  function openWithConfirm(url){
    Swal.fire({
      title:'Open link?',
      text:'You are about to open an external link.',
      icon:'question',
      showCancelButton:true,
      confirmButtonText:'Open'
    }).then(res=>{ if(res.isConfirmed) window.open(url,'_blank'); });
  }
  if(waBtn) waBtn.addEventListener('click',()=>openWithConfirm(waUrl));
  if(heroWa) heroWa.addEventListener('click',()=>openWithConfirm(waUrl));

  // phone/email confirmations
  if(callEl){
    callEl.addEventListener('click',e=>{
      e.preventDefault();
      const tel = window.CONFIG.phoneNumber;
      Swal.fire({title:'Call Now?',text:tel,showCancelButton:true}).then(r=>{ if(r.isConfirmed) window.location.href = `tel:${tel}`; });
    });
  }
  if(emailEl){
    emailEl.addEventListener('click',e=>{
      e.preventDefault();
      const em = window.CONFIG.email;
      Swal.fire({title:'Send Email?',text:em,showCancelButton:true}).then(r=>{ if(r.isConfirmed) window.location.href = `mailto:${em}`; });
    });
  }

  // CTA contact scroll
  const cta = document.getElementById('ctaContact');
  if(cta){
    cta.addEventListener('click',(e)=>{
      e.preventDefault();
      const contactSection = document.querySelector('#contact');
      if(contactSection) contactSection.scrollIntoView({behavior:'smooth'});
    });
  }

  // Mobile menu toggle (prevent body scroll when open)
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileMenuBg = document.getElementById('mobileMenuBg');
  const mobileMenuClose = document.getElementById('mobileMenuClose');
  function openMobileMenu(){
    if(!mobileMenu) return;
    mobileMenu.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
    if(mobileBtn) mobileBtn.setAttribute('aria-expanded','true');
  }
  function closeMobileMenu(){
    if(!mobileMenu) return;
    mobileMenu.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
    if(mobileBtn) mobileBtn.setAttribute('aria-expanded','false');
  }
  if(mobileBtn) mobileBtn.addEventListener('click',openMobileMenu);
  if(mobileMenuBg) mobileMenuBg.addEventListener('click',closeMobileMenu);
  if(mobileMenuClose) mobileMenuClose.addEventListener('click',closeMobileMenu);
  // close when a menu link is clicked
  if(mobileMenu) mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMobileMenu));
});
