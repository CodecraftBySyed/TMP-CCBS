// Load gallery items, filters and lightbox
async function loadGallery(){
  try{
    const res = await fetch('data/gallery.json');
    const data = await res.json();
    const grid = document.getElementById('galleryGrid');
    const filters = document.getElementById('galleryFilters');

    const categories = Array.from(new Set(data.map(i=>i.category)));
    const allBtn = document.createElement('button');
    allBtn.className='px-3 py-1 bg-[color:var(--primary-color)] text-white rounded text-sm';
    allBtn.textContent='All';
    allBtn.addEventListener('click',()=>renderGallery(data));
    filters.appendChild(allBtn);

    categories.forEach(cat=>{
      const b=document.createElement('button');
      b.className='px-3 py-1 bg-white border rounded text-sm';
      b.textContent=cat;
      b.addEventListener('click',()=>{
        renderGallery(data.filter(i=>i.category===cat));
      });
      filters.appendChild(b);
    });

    renderGallery(data);
  }catch(e){console.error('gallery',e)}
}

function renderGallery(items){
  const grid = document.getElementById('galleryGrid');
  grid.innerHTML='';
  items.forEach(it=>{
    const el = document.createElement('div');
    el.className='overflow-hidden rounded-lg bg-gray-50 cursor-pointer';
    el.innerHTML = `<img src="${it.image}" alt="${it.title}" loading="lazy" class="w-full h-40 sm:h-44 md:h-48 object-cover rounded-lg">`;
    el.addEventListener('click',()=>openLightbox(it.image,it.title));
    grid.appendChild(el);
  });
}

function openLightbox(src,alt){
  const lb = document.createElement('div');
  lb.className='tmp-lightbox';
  lb.innerHTML = `<img src="${src}" alt="${alt}">`;
  lb.addEventListener('click',()=>lb.remove());
  document.body.appendChild(lb);
}

document.addEventListener('DOMContentLoaded',loadGallery);
