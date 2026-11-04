/* Phase 4 — source-backed innerwear campaign gallery and fit-guide interactions. */
'use strict';
(() => {
  const root = document.getElementById('innerwear-section');
  if (!root) return;
  const BASE = 'https://raw.githubusercontent.com/shaileshkumar7y-max/New-product-/main/';
  const STORE = 'bp-innerwear-saved-looks-v1';
  const VOTE_STORE = 'bp-innerwear-runway-vote-v1';
  const looks = [
    {id:'blxcked-night',title:'BLXCKED Luxury Night',category:'Black edition',tags:['black','editorial'],file:'blxcked-luxury-night.webp',copy:'A black-and-gold campaign direction with a premium after-dark mood.'},
    {id:'black-lace',title:'Black Lace Collection',category:'Lace edit',tags:['black','lace'],file:'black-lace-collection.webp',copy:'A close look at black lace styling, texture and considered detailing.'},
    {id:'boutique-editorial',title:'Blxcked Boutique Editorial',category:'Editorial',tags:['black','editorial'],file:'blxcked-boutique-editorial.webp',copy:'Boutique-inspired styling for a clean, confident brand story.'},
    {id:'runway',title:'Blxcked Runway',category:'Runway',tags:['black','editorial'],file:'blxcked-runway.webp',copy:'A runway-led visual direction for seasonal campaign storytelling.'},
    {id:'after-dark',title:'HER AFTER DARK',category:'After dark',tags:['afterdark','editorial'],file:'her-after-dark.webp',copy:'An after-hours editorial concept with restrained lighting and confident styling.'},
    {id:'private-chemistry',title:'Private Chemistry',category:'After dark',tags:['afterdark','couples'],file:'private-chemistry-after-dark.webp',copy:'A romantic campaign moodboard presented as non-explicit fashion editorial.'},
    {id:'confidence-together',title:'Confidence Together',category:'Together',tags:['couples','comfort'],file:'confidence-together-campaign.webp',copy:'A shared-confidence direction focused on connection and personal comfort.'},
    {id:'closer-together',title:'Stretch Closer Together',category:'Movement',tags:['couples','comfort'],file:'stretch-closer-together.webp',copy:'A movement-led comfort campaign reference.'},
    {id:'everyday-comfort',title:'Blxcked Everyday Comfort',category:'Comfort',tags:['comfort','black'],file:'blxcked-everyday-comfort.webp',copy:'A simple everyday-comfort styling direction.'},
    {id:'pink-lace',title:'Pink Lace Collection',category:'Lace edit',tags:['lace','editorial'],file:'pink-lace-collection.webp',copy:'A softer colour story for a contrasting lace campaign.'},
    {id:'elegance-after-dark',title:'Elegance After Dark',category:'After dark',tags:['afterdark','editorial'],file:'elegance-after-dark-pink-campaign.webp',copy:'A pink-and-black evening editorial concept.'},
    {id:'royal-palace',title:'Royal Palace',category:'Art direction',tags:['editorial','art'],file:'royal-palace-saree.webp',copy:'A heritage-inspired fashion direction for future editorial collections.'},
    {id:'mughal-romance',title:'Mughal Romance',category:'Art direction',tags:['editorial','art'],file:'mughal-royal-romance-poster.webp',copy:'A historical-poster-inspired romantic art direction.'},
    {id:'black-elegance',title:'Black Elegance',category:'Editorial',tags:['black','editorial'],file:'black-elegance-fashion.webp',copy:'A clean black-fashion reference from the existing campaign library.'}
  ].map(item => ({...item,src:BASE+item.file}));
  const $ = id => document.getElementById(id);
  const grid = $('bpLookGrid');
  const search = $('bpLookSearch');
  const filterRow = $('bpLookFilters');
  const count = $('bpLookCount');
  const empty = $('bpLookEmpty');
  const savedPanel = $('bpSavedLooks');
  let activeFilter = 'all';
  let activeLook = null;
  let saved = readSaved();
  function readSaved(){
    try {
      const value = JSON.parse(localStorage.getItem(STORE)||'[]');
      return Array.isArray(value) ? value.filter(x => x && looks.some(look=>look.id===x.id)).slice(0,30) : [];
    } catch { return []; }
  }
  function writeSaved(){
    try { localStorage.setItem(STORE,JSON.stringify(saved)); }
    catch { status('Browser storage is unavailable. Your saved looks may not persist.'); }
  }
  function status(message){ const el=$('bpLookStatus'); if(el) el.textContent=message; }
  function isSaved(id){ return saved.some(item=>item.id===id); }
  function filtered(){
    const q=(search?.value||'').trim().toLowerCase();
    return looks.filter(item=>{
      const categoryMatch=activeFilter==='all'||item.tags.includes(activeFilter);
      const textMatch=!q||`${item.title} ${item.category} ${item.copy} ${item.tags.join(' ')}`.toLowerCase().includes(q);
      return categoryMatch&&textMatch;
    });
  }
  function renderSaved(){
    if(!savedPanel) return;
    savedPanel.replaceChildren();
    if(!saved.length){ savedPanel.innerHTML='<p class="bp-result-note">Your saved campaign looks stay on this device.</p>'; return; }
    saved.forEach(entry=>{
      const look=looks.find(x=>x.id===entry.id); if(!look) return;
      const button=document.createElement('button'); button.className='bp-archive-mini'; button.type='button'; button.setAttribute('aria-label',`Open saved look ${look.title}`);
      const img=document.createElement('img'); img.src=look.src; img.alt=''; img.loading='lazy';
      const label=document.createElement('span'); label.textContent=look.title;
      button.append(img,label); button.addEventListener('click',()=>openLook(look)); savedPanel.append(button);
    });
  }
  function render(){
    if(!grid) return;
    const rows=filtered(); grid.replaceChildren();
    rows.forEach(look=>{
      const article=document.createElement('article'); article.className='bp-look-card';
      const visual=document.createElement('div'); visual.className='bp-look-visual';
      const img=document.createElement('img'); img.src=look.src; img.alt=`${look.title} campaign reference`; img.loading='lazy'; img.decoding='async'; img.addEventListener('error',()=>visual.classList.add('bp-failed'),{once:true});
      const category=document.createElement('span'); category.className='bp-look-category'; category.textContent=look.category;
      const save=document.createElement('button'); save.className='bp-look-save'; save.type='button'; save.textContent=isSaved(look.id)?'♥':'♡'; save.setAttribute('aria-label',isSaved(look.id)?`Remove ${look.title} from saved looks`:`Save ${look.title}`); save.setAttribute('aria-pressed',String(isSaved(look.id)));
      save.addEventListener('click',event=>{event.stopPropagation();toggleSave(look);});
      visual.append(img,category,save);
      const copy=document.createElement('div'); copy.className='bp-look-copy';
      const h=document.createElement('h3'); h.textContent=look.title;
      const p=document.createElement('p'); p.textContent=look.copy;
      const open=document.createElement('button'); open.type='button'; open.className='bp-look-open'; open.innerHTML='<span>View campaign detail</span><span aria-hidden="true">↗</span>'; open.addEventListener('click',()=>openLook(look));
      copy.append(h,p,open); article.append(visual,copy); grid.append(article);
    });
    if(count) count.textContent=`${rows.length} of ${looks.length} campaign references`;
    if(empty) empty.hidden=rows.length!==0;
    renderSaved();
  }
  function toggleSave(look){
    if(isSaved(look.id)){saved=saved.filter(x=>x.id!==look.id);status(`${look.title} removed from your saved looks.`);}
    else {saved.unshift({id:look.id,savedAt:Date.now()});saved=saved.slice(0,30);status(`${look.title} saved on this device.`);}
    writeSaved();render();
    if(activeLook?.id===look.id) updateModalSave();
  }
  function updateModalSave(){
    const button=$('bpLookModalSave'); if(button&&activeLook){button.textContent=isSaved(activeLook.id)?'♥ Saved':'♡ Save this look';button.setAttribute('aria-pressed',String(isSaved(activeLook.id)));}
  }
  function openLook(look){
    activeLook=look;
    $('bpLookModalImage').src=look.src; $('bpLookModalImage').alt=`${look.title} campaign image`;
    $('bpLookModalTitle').textContent=look.title; $('bpLookModalCategory').textContent=look.category.toUpperCase();
    $('bpLookModalCopy').textContent=look.copy;
    $('bpLookModalOriginal').href=look.src;
    $('bpLookModal').hidden=false; document.body.style.overflow='hidden'; updateModalSave(); $('bpLookClose').focus();
  }
  function closeLook(){ $('bpLookModal').hidden=true; if($('bpArchiveViewer')?.hidden!==false && $('artModal')?.classList.contains('hidden') && $('poseModal')?.classList.contains('hidden') && $('collectionModal')?.classList.contains('hidden') && $('studioArtModal')?.classList.contains('hidden')) document.body.style.overflow=''; }
  const runwayIds=['blxcked-night','black-lace','pink-lace'];
  function readVotes(){
    try{
      const value=JSON.parse(localStorage.getItem(VOTE_STORE)||'{}');
      const counts={};runwayIds.forEach(id=>{counts[id]=Math.max(0,Math.min(999,Number(value.counts?.[id])||0));});
      return {selected:runwayIds.includes(value.selected)?value.selected:null,counts};
    }catch{return {selected:null,counts:Object.fromEntries(runwayIds.map(id=>[id,0]))};}
  }
  let voteState=readVotes();
  function renderVotes(){
    root.querySelectorAll('[data-runway-vote]').forEach(button=>{
      const id=button.dataset.runwayVote;
      button.setAttribute('aria-pressed',String(voteState.selected===id));
      const countLabel=button.querySelector('[data-runway-count]');
      if(countLabel)countLabel.textContent=`${voteState.counts[id]||0} local votes`;
    });
    const status=$('bpRunwayStatus');
    if(status){
      const selected=looks.find(item=>item.id===voteState.selected);
      status.textContent=selected?`Your current local vote: ${selected.title}. Counts are stored on this device only.`:'Your local vote has not been placed yet. Counts are stored on this device only.';
    }
  }
  root.querySelectorAll('[data-runway-vote]').forEach(button=>button.addEventListener('click',()=>{
    const next=button.dataset.runwayVote;if(!runwayIds.includes(next))return;
    if(voteState.selected===next){renderVotes();return;}
    if(voteState.selected)voteState.counts[voteState.selected]=Math.max(0,(voteState.counts[voteState.selected]||0)-1);
    voteState.selected=next;voteState.counts[next]=Math.min(999,(voteState.counts[next]||0)+1);
    let persisted=true;try{localStorage.setItem(VOTE_STORE,JSON.stringify(voteState));}catch{persisted=false;}
    renderVotes();
    if(persisted)setRunwayStatus(`Vote saved for ${looks.find(item=>item.id===next)?.title||'this look'} on this device.`);
    else setRunwayStatus('Browser storage is unavailable; this vote may not persist.');
  }));
  function setRunwayStatus(message){const el=$('bpRunwayStatus');if(el)el.textContent=message;}
  filterRow?.addEventListener('click',event=>{
    const button=event.target.closest('[data-bp-filter]'); if(!button)return;
    activeFilter=button.dataset.bpFilter;
    filterRow.querySelectorAll('[data-bp-filter]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
    render();
  });
  search?.addEventListener('input',render);
  $('bpLookModalSave')?.addEventListener('click',()=>{if(activeLook)toggleSave(activeLook);});
  $('bpLookClose')?.addEventListener('click',closeLook);
  $('bpLookModal')?.addEventListener('click',event=>{if(event.target===$('bpLookModal'))closeLook();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&$('bpLookModal')&&!$('bpLookModal').hidden)closeLook();});
  render();
  renderVotes();
})();
