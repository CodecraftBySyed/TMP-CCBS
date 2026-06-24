// Google Translate integration with safer handling and fallbacks
function loadGoogleTranslate(){
  if(window.google && window.google.translate) return;
  const s=document.createElement('script');
  s.src='https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  s.defer = true;
  document.head.appendChild(s);
}

function setGoogleCookie(lang){
  try{
    // set cookie for current path and for hostname (some browsers require domain)
    const value = `/en/${lang}`;
    document.cookie = `googtrans=${value};path=/`;
    try{ document.cookie = `googtrans=${value};path=/;domain=${location.hostname}`; }catch(_){ }
    console.log('googtrans cookie set ->', value);
  }catch(e){ console.warn('setGoogleCookie error', e); }
}

// Expose the global callback name Google expects
window.googleTranslateElementInit = function(){
  try{
    new google.translate.TranslateElement({
      pageLanguage: 'en',
      includedLanguages: 'en,ta,hi',
      autoDisplay: false
    }, 'google_translate_element');

    // if a language was saved, ensure cookie is present and apply
    const saved = localStorage.getItem('siteLang');
    if(saved && saved !== 'en'){
      setGoogleCookie(saved);
      waitForTranslate(()=>{
        applyGTranslate(saved);
      });
    }
  }catch(e){ console.warn('googleTranslateElementInit error', e); }
};

function waitForTranslate(cb, timeout = 8000){
  const start = Date.now();
  const interval = setInterval(()=>{
    const combo = document.querySelector('.goog-te-combo');
    if(combo){ clearInterval(interval); cb(combo); return; }
    if(Date.now() - start > timeout){ clearInterval(interval); cb(null); }
  }, 300);
}

function applyGTranslate(lang){
  try{
    localStorage.setItem('siteLang', lang);
    setGoogleCookie(lang);
    const combo = document.querySelector('.goog-te-combo');
    if(combo){
      combo.value = lang;
      combo.dispatchEvent(new Event('change'));
      return;
    }
    // if combo not present, reload to let cookie take effect
    location.reload();
  }catch(e){ console.warn('applyGTranslate failed', e); }
}

// Attach selector action
document.addEventListener('DOMContentLoaded', ()=>{
  const sel = document.getElementById('langSelect');

  // ensure the translate mount exists (user must have <div id="google_translate_element"></div>)
  if(!document.getElementById('google_translate_element')){
    const div = document.createElement('div');
    div.id = 'google_translate_element';
    div.style.display = 'none';
    document.body.appendChild(div);
  }

  if(sel){
    const saved = localStorage.getItem('siteLang') || 'en';
    sel.value = saved;
    sel.addEventListener('change', (e)=>{
      const v = e.target.value;
      try{ if(window.Swal){ Swal.fire({toast:true,position:'top-end',title:'Applying language...',showConfirmButton:false,timer:700}); } }catch(_){ }
      if(v === 'en'){
        // reset to English explicitly
        localStorage.setItem('siteLang','en');
        try{ document.cookie = 'googtrans=/en/en;path=/'; }catch(_){ }
        try{ document.cookie = `googtrans=/en/en;path=/;domain=${location.hostname}`; }catch(_){ }
        location.reload();
      }else{
        // set cookie first then apply when widget available
        setGoogleCookie(v);
        if(window.google && window.google.translate){
          waitForTranslate(()=>applyGTranslate(v));
        }else{
          loadGoogleTranslate();
          waitForTranslate(()=>applyGTranslate(v));
        }
      }
    });
  }

  // If a saved language exists, ensure cookie set before loading
  const pre = localStorage.getItem('siteLang');
  if(pre && pre !== 'en') setGoogleCookie(pre);

  loadGoogleTranslate();
});
