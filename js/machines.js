// Load machines data and render cards with modal details
async function loadMachines(){
  try{
    const res = await fetch('data/machines.json');
    const machines = await res.json();
    const grid = document.getElementById('machinesGrid');
    machines.forEach((m,idx)=>{
      const card = document.createElement('div');
      card.className = 'bg-white rounded-xl shadow p-4 hover:shadow-lg transition cursor-pointer flex flex-col';
      card.setAttribute('data-aos','fade-up');
      card.innerHTML = `
        <div class="overflow-hidden rounded-xl bg-gray-50">
          <img src="${m.image}" alt="${m.name}" class="w-full h-44 md:h-52 lg:h-64 object-cover" loading="lazy">
        </div>
        <div class="mt-3 flex-1">
          <h5 class="font-semibold">${m.name}</h5>
          <p class="text-sm text-gray-600 mt-1">${m.shortDesc}</p>
        </div>
        <div class="mt-3 flex justify-end"><button data-id="${m.id}" class="learnBtn bg-[color:var(--primary-color)] text-white px-3 py-2 rounded text-sm min-h-[44px]">Learn More</button></div>
      `;
      grid.appendChild(card);
    });

    document.querySelectorAll('.learnBtn').forEach(btn=>{
      btn.addEventListener('click',(e)=>{
        const id = e.currentTarget.getAttribute('data-id');
        openMachineModal(id);
      });
    });
  }catch(e){console.error('Error loading machines',e)}
}

async function openMachineModal(id){
  const res = await fetch('data/machines.json');
  const machines = await res.json();
  const m = machines.find(x=>x.id===id);
  if(!m) return;

  const overlay = document.createElement('div');
  overlay.className = 'tmp-modal-overlay';
  overlay.innerHTML = `
    <div class="tmp-modal" role="dialog" aria-modal="true">
      <div class="modal-body p-4">
        <div class="flex justify-between items-start gap-4">
          <h3 class="text-xl font-bold">${m.name}</h3>
          <button id="modalClose" class="text-gray-500">&times;</button>
        </div>
        <div class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><img src="${m.image}" alt="${m.name}"></div>
          <div>
            <p class="text-sm text-gray-700">${m.fullDesc}</p>
            <p class="mt-2"><strong>Category:</strong> ${m.category}</p>
            <div class="mt-2">
              <h6 class="font-semibold">How It Works</h6>
              <p class="text-sm text-gray-700">${m.howItWorks}</p>
            </div>
            <div class="mt-2">
              <h6 class="font-semibold">Applications</h6>
              <ul class="text-sm text-gray-700 list-disc ml-5">${m.applications.map(a=>`<li>${a}</li>`).join('')}</ul>
            </div>
            <div class="mt-2">
              <h6 class="font-semibold">Benefits</h6>
              <ul class="text-sm text-gray-700 list-disc ml-5">${m.benefits.map(b=>`<li>${b}</li>`).join('')}</ul>
            </div>
          </div>
        </div>
        <div class="mt-4 flex gap-2">
          <button id="modalCloseBtn" class="bg-gray-200 px-3 py-1 rounded">Close</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('modalRoot').appendChild(overlay);

  function close(){
    overlay.remove();
    document.removeEventListener('keydown',onKey);
  }
  function onKey(e){ if(e.key==='Escape') close(); }
  document.getElementById('modalClose').addEventListener('click',close);
  document.getElementById('modalCloseBtn').addEventListener('click',close);
  overlay.addEventListener('click',(ev)=>{ if(ev.target===overlay) close(); });
  document.addEventListener('keydown',onKey);
}

document.addEventListener('DOMContentLoaded',loadMachines);
