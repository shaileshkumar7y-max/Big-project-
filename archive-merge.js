/* Phase 5 — curated 47-work art archive from the user's Art- repository. */
'use strict';
(() => {
  const root=document.getElementById('archive-section'); if(!root)return;
  const BASE='https://raw.githubusercontent.com/shaileshkumar7y-max/Art-/main/';
  const SAVED_KEY='bp-art-archive-saved-v1';
  const RECENT_KEY='bp-art-archive-recent-v1';
  const collections=[
    {id:'figure',label:'Figure studies'}, {id:'graphite',label:'Graphite & charcoal'}, {id:'anatomy',label:'Anatomy & movement'},
    {id:'classical',label:'Classical & Renaissance'}, {id:'couples',label:'Couple studies'}, {id:'portrait',label:'Portraits'},
    {id:'sculpture',label:'Sculpture & atelier'}, {id:'editorial',label:'Drapery & editorial'}, {id:'movement',label:'Movement & pose'}
  ];
  const rows=[
    ['Antique Sepia Figure Study','Sepia drawing plate exploring classical figure proportions and gesture.','Sepia / study plate',['classical','figure']],
    ['Classical Figure Study Sheet','Academic figure reference sheet with proportion and pose studies.','Sepia / figure sheet',['classical','figure','anatomy']],
    ['Renaissance Figure Studies','A Renaissance-inspired arrangement of figure and portrait studies.','Renaissance / collage',['classical','figure']],
    ['Classical Figure Collection','A curated sheet of classical figure sketches and gesture references.','Sepia / collage',['classical','figure']],
    ['Sculptor’s Studio Studies','A studio-themed art plate connecting figure drawing and sculpture.','Atelier / study plate',['sculpture','classical']],
    ['Vintage Graphite Figure Sheet','Graphite reference sheet focused on form, proportion and expression.','Graphite / study sheet',['graphite','figure','anatomy']],
    ['Graphite Figure Sketchbook','Monochrome graphite studies arranged like a sketchbook page.','Graphite / collage',['graphite','figure']],
    ['Male Anatomy Study','Educational anatomy and proportion studies in a classical drawing style.','Anatomy / study sheet',['anatomy','graphite']],
    ['Paired Figure Studies','Academic paired-figure studies emphasizing posture and balance.','Graphite / duet',['couples','graphite','figure']],
    ['Classical Life Drawing','Life-drawing references arranged as an academic studio sheet.','Life drawing / sheet',['figure','anatomy']],
    ['Vintage Sepia Sketches','A sepia sketchbook collection focused on gesture and figure form.','Sepia / sketchbook',['figure','classical']],
    ['Charcoal Figure Studies','Charcoal-style figure studies with varied poses and tonal work.','Charcoal / collage',['graphite','figure']],
    ['Sepia Life Drawing','A life-drawing reference sheet with classical academic styling.','Sepia / life drawing',['figure','anatomy']],
    ['Atelier Figure Sheet','A traditional atelier-inspired study with warm archival tones.','Atelier / figure sheet',['classical','sculpture','figure']],
    ['Graphite Drawing Studies','Graphite pose studies and portrait details on a vintage paper field.','Graphite / studies',['graphite','figure']],
    ['Graphite Anatomy Notes','A paired anatomy-study reference with proportion and gesture notes.','Graphite / anatomy',['anatomy','graphite']],
    ['Classical Portrait Studies','Portrait expressions and figure details in an old-master study style.','Portrait / study sheet',['portrait','classical']],
    ['Mirror Portrait Study','A mirror-themed portrait study in a warm sepia palette.','Sepia / portrait',['portrait','classical']],
    ['Muse in the Atelier','A classical atelier composition with sculpture and portrait references.','Atelier / portrait',['portrait','sculpture','classical']],
    ['Crimson Drapery Portrait','A Renaissance-inspired portrait built around rich fabric and warm light.','Drapery / portrait',['editorial','portrait','classical']],
    ['Portrait & Figure Archive','A combined archive of portrait expression and academic figure sketches.','Portrait / collage',['portrait','figure']],
    ['Life Drawing Triptych','Three-part life-drawing arrangement for studying posture and line.','Triptych / life drawing',['figure','anatomy']],
    ['Monochrome Figure Sketchbook','Monochrome figure studies arranged like a vintage sketchbook.','Graphite / sketchbook',['graphite','figure']],
    ['Roman Bathhouse Study','A historical bathhouse-inspired composition presented as classical art study.','Classical / historical scene',['classical','figure']],
    ['Courtyard & Drapery','A classical courtyard composition studying fabric, posture and light.','Drapery / classical',['classical','editorial']],
    ['Temple Courtyard Portrait','A soft classical portrait set among architectural details.','Classical / portrait',['portrait','classical']],
    ['The Atelier & the Muse','An atelier scene exploring the relationship between artist and sculpture.','Atelier / editorial',['sculpture','classical','portrait']],
    ['Contemplative Figure','A quiet figure study using a coastal setting and painterly light.','Coastal / figure study',['figure','classical']],
    ['Terrace & Draped Fabric','A portrait composition focused on draping, silhouette and natural light.','Drapery / portrait',['editorial','portrait','classical']],
    ['Amber Editorial Portrait','A modern, fully styled portrait with warm evening lighting.','Editorial / portrait',['editorial','portrait']],
    ['Royal Palace Portrait','A traditional fashion portrait with warm architectural styling.','Fashion / portrait',['editorial','portrait']],
    ['Yoga & Figure Studies','A classical movement reference with a focus on pose and alignment.','Movement / study collage',['movement','anatomy','figure']],
    ['Courtyard Movement Study','An ancient-courtyard movement study in a sepia drawing style.','Movement / courtyard',['movement','classical']],
    ['Classical Yoga Study','A classical pose study arranged as an educational reference sheet.','Movement / figure sheet',['movement','anatomy']],
    ['Classical Figure Montage','A montage of figure and expression studies in an archival palette.','Sepia / montage',['classical','figure']],
    ['Garden Figure Study','A garden-inspired figure study focused on line, shape and composition.','Garden / figure study',['classical','figure']],
    ['Sepia Figure Collage','A multi-panel figure-study composition with a vintage paper finish.','Sepia / collage',['figure','classical']],
    ['Garden Reverie in Graphite','A graphite figure study set in a classical garden composition.','Graphite / garden',['graphite','figure']],
    ['Classical Figure Triad','A three-part academic arrangement of figure proportions and posture.','Classical / triad',['figure','classical']],
    ['Couple Figure Studies','A paired-figure study arranged as a classical drawing reference.','Classical / duet',['couples','figure','classical']],
    ['Sepia Life Drawing Archive','A vintage-style drawing sheet for pose and proportion study.','Sepia / life drawing',['figure','anatomy']],
    ['Renaissance Figure Archive','A classical figure-study collage with portrait details and pose references.','Renaissance / archive',['classical','figure']],
    ['Vintage Yoga Anatomy','A yoga anatomy reference for studying pose and alignment.','Vintage / anatomy',['movement','anatomy']],
    ['Classical Figure Study Collage','A multi-panel academic figure study focused on pose, proportion and gesture.','Classical / collage',['figure','classical','couples']],
    ['Yoga Study in the Garden Ruin','A classical movement study in a garden-ruin setting.','Movement / classical',['movement','classical']],
    ['Sepia Yoga Anatomy Sheet','A yoga anatomy reference sheet for studying pose and alignment.','Sepia / anatomy',['movement','anatomy']],
    ['Sepia Yoga Anatomy Collage','A multi-panel educational movement and figure study.','Sepia / movement collage',['movement','anatomy','figure']]
  ];
  const artworks=rows.map((row,index)=>({id:`work-${String(index+1).padStart(2,'0')}`,title:row[0],description:row[1],medium:row[2],categories:row[3],file:`artwork-${String(index+1).padStart(2,'0')}.webp`,year:'Collection archive',source:'User-owned Art- repository',src:BASE+`artwork-${String(index+1).padStart(2,'0')}.webp`}));
  const $=id=>document.getElementById(id);
  const grid=$('bpArchiveGrid'),search=$('bpArchiveSearch'),filters=$('bpArchiveFilters');
  let activeFilter='all',sort='featured',view='grid',limit=16,activeIndex=0;
  let saved=readArray(SAVED_KEY).filter(id=>artworks.some(item=>item.id===id));
  let recent=readArray(RECENT_KEY).filter(id=>artworks.some(item=>item.id===id));
  function readArray(key){try{const data=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(data)?data:[];}catch{return[];}}
  function write(key,value){try{localStorage.setItem(key,JSON.stringify(value));}catch{setStatus('Browser storage is unavailable. Saved and recent lists may not persist.');}}
  function esc(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function setStatus(message){const el=$('bpArchiveStatus');if(el)el.textContent=message;}
  function isSaved(id){return saved.includes(id);}
  function collectionLabel(id){return collections.find(item=>item.id===id)?.label||'Art study';}
  function filtered(){
    const q=(search?.value||'').trim().toLowerCase();
    let items=artworks.filter(item=>(activeFilter==='all'||item.categories.includes(activeFilter))&&(!q||`${item.title} ${item.description} ${item.medium} ${item.categories.join(' ')}`.toLowerCase().includes(q)));
    if(sort==='az')items.sort((a,b)=>a.title.localeCompare(b.title));
    if(sort==='za')items.sort((a,b)=>b.title.localeCompare(a.title));
    return items;
  }
  function card(item){
    const article=document.createElement('article');article.className='bp-archive-card';article.tabIndex=0;article.setAttribute('role','button');article.setAttribute('aria-label',`Open ${item.title}`);article.dataset.artId=item.id;
    const visual=document.createElement('div');visual.className='bp-archive-image';
    const img=document.createElement('img');img.src=item.src;img.alt=`${item.title} — art archive`;img.loading='lazy';img.decoding='async';img.addEventListener('error',()=>{visual.classList.add('bp-failed');img.alt=`${item.title} image unavailable`;},{once:true});
    const save=document.createElement('button');save.className='bp-archive-save';save.type='button';save.textContent=isSaved(item.id)?'♥':'♡';save.setAttribute('aria-label',isSaved(item.id)?'Remove saved artwork':'Save artwork');save.setAttribute('aria-pressed',String(isSaved(item.id)));save.dataset.saveId=item.id;save.addEventListener('click',event=>{event.stopPropagation();toggleSaved(item.id);});
    visual.append(img,save);
    const copy=document.createElement('div');copy.className='bp-archive-card-copy';
    const h=document.createElement('h3');h.textContent=item.title;
    const p=document.createElement('p');p.textContent=item.medium;
    const meta=document.createElement('div');meta.className='bp-archive-meta';
    const cat=document.createElement('span');cat.textContent=collectionLabel(item.categories[0]);
    const idx=document.createElement('span');idx.textContent=`${item.id.toUpperCase()}`;meta.append(cat,idx);
    copy.append(h,p,meta);article.append(visual,copy);
    article.addEventListener('click',()=>open(item.id));
    article.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();open(item.id);}});
    return article;
  }
  function render(){
    if(!grid)return;
    const items=filtered(),visible=items.slice(0,limit);grid.replaceChildren();grid.classList.toggle('is-list',view==='list');
    visible.forEach(item=>grid.append(card(item)));
    $('bpArchiveCount').textContent=`Showing ${visible.length} of ${items.length} artworks · ${artworks.length} total in the archive`;
    $('bpArchiveEmpty').hidden=items.length!==0;
    $('bpArchiveLoadMore').disabled=visible.length>=items.length;
    $('bpArchiveLoadMore').textContent=visible.length>=items.length?'All matching artworks shown':'Load more artworks ↓';
    $('bpArchiveGridToggle').setAttribute('aria-pressed',String(view==='grid'));
    $('bpArchiveListToggle').setAttribute('aria-pressed',String(view==='list'));
    renderPersonal();
  }
  function toggleSaved(id){
    saved=isSaved(id)?saved.filter(x=>x!==id):[id,...saved].slice(0,47);write(SAVED_KEY,saved);render();
    if($('bpArchiveViewer')&&!$('bpArchiveViewer').hidden)updateViewerSaved();
    setStatus(isSaved(id)?'Artwork saved on this device.':'Artwork removed from your saved shelf.');
  }
  function renderPersonal(){
    const favourites=$('bpArchiveFavourites'),recents=$('bpArchiveRecent');if(!favourites||!recents)return;
    const draw=(target,ids)=>{target.replaceChildren();const selected=ids.slice(0,8);if(!selected.length){const p=document.createElement('p');p.className='bp-result-note';p.textContent='Nothing here yet. Open an artwork and save it to build this shelf.';target.append(p);return;}selected.forEach(id=>{const item=artworks.find(x=>x.id===id);if(!item)return;const button=document.createElement('button');button.type='button';button.className='bp-archive-mini';const img=document.createElement('img');img.src=item.src;img.alt='';img.loading='lazy';const label=document.createElement('span');label.textContent=item.title;button.append(img,label);button.addEventListener('click',()=>open(item.id));target.append(button);});};
    draw(favourites,saved);draw(recents,recent);
  }
  function open(id){
    const item=artworks.find(x=>x.id===id);if(!item)return;
    activeIndex=artworks.findIndex(x=>x.id===id);recent=[id,...recent.filter(x=>x!==id)].slice(0,12);write(RECENT_KEY,recent);
    $('bpArchiveViewerImage').src=item.src;$('bpArchiveViewerImage').alt=`${item.title} — art archive`;
    $('bpArchiveViewerTitle').textContent=item.title;$('bpArchiveViewerDescription').textContent=item.description;
    $('bpArchiveViewerMedium').textContent=item.medium;$('bpArchiveViewerCollection').textContent=item.categories.map(collectionLabel).join(' · ');
    $('bpArchiveViewerOriginal').href=item.src;$('bpArchiveViewerIndex').textContent=`${activeIndex+1} / ${artworks.length}`;
    updateViewerSaved();$('bpArchiveViewer').hidden=false;document.body.style.overflow='hidden';$('bpArchiveViewerClose').focus();renderPersonal();
  }
  function updateViewerSaved(){const item=artworks[activeIndex];const button=$('bpArchiveViewerSave');if(item&&button){button.textContent=isSaved(item.id)?'♥ Saved':'♡ Save artwork';button.setAttribute('aria-pressed',String(isSaved(item.id)));}}
  function move(direction){const item=artworks[(activeIndex+direction+artworks.length)%artworks.length];open(item.id);}
  function closeViewer(){ $('bpArchiveViewer').hidden=true;if($('bpLookModal')?.hidden!==false&&$('artModal')?.classList.contains('hidden')&&$('poseModal')?.classList.contains('hidden')&&$('collectionModal')?.classList.contains('hidden')&&$('studioArtModal')?.classList.contains('hidden'))document.body.style.overflow=''; }
  async function share(){const item=artworks[activeIndex];if(!item)return;const shareData={title:item.title,text:`${item.title} — BLACKED PUSSY Art Archive`,url:item.src};try{if(navigator.share)await navigator.share(shareData);else if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(item.src);setStatus('Artwork image link copied.');}else setStatus('Sharing is not available in this browser.');}catch(error){if(error?.name!=='AbortError')setStatus('Could not share this artwork.');}}
  filters?.addEventListener('click',event=>{const button=event.target.closest('[data-archive-filter]');if(!button)return;activeFilter=button.dataset.archiveFilter;filters.querySelectorAll('[data-archive-filter]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));limit=16;render();});
  search?.addEventListener('input',()=>{limit=16;render();});
  $('bpArchiveSort')?.addEventListener('change',event=>{sort=event.target.value;render();});
  $('bpArchiveGridToggle')?.addEventListener('click',()=>{view='grid';render();});$('bpArchiveListToggle')?.addEventListener('click',()=>{view='list';render();});
  $('bpArchiveLoadMore')?.addEventListener('click',()=>{limit+=16;render();});
  $('bpArchiveClearFilters')?.addEventListener('click',()=>{activeFilter='all';sort='featured';limit=16;if(search)search.value='';if($('bpArchiveSort'))$('bpArchiveSort').value='featured';filters?.querySelectorAll('[data-archive-filter]').forEach(item=>item.setAttribute('aria-pressed',String(item.dataset.archiveFilter==='all')));render();setStatus('Archive filters cleared.');});
  $('bpArchiveViewerClose')?.addEventListener('click',closeViewer);$('bpArchiveViewerPrev')?.addEventListener('click',()=>move(-1));$('bpArchiveViewerNext')?.addEventListener('click',()=>move(1));
  $('bpArchiveViewer')?.addEventListener('click',event=>{if(event.target===$('bpArchiveViewer'))closeViewer();});
  $('bpArchiveViewerSave')?.addEventListener('click',()=>{const item=artworks[activeIndex];if(item)toggleSaved(item.id);});$('bpArchiveViewerShare')?.addEventListener('click',share);
  document.addEventListener('keydown',event=>{if($('bpArchiveViewer')?.hidden!==false)return;if(event.key==='Escape')closeViewer();if(event.key==='ArrowLeft')move(-1);if(event.key==='ArrowRight')move(1);});
  render();
})();
