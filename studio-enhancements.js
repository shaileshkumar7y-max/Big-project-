/* Phase 6 — additive, local-only Creator tools. Does not replace the existing OAuth/generation module. */
'use strict';
(() => {
  const form=document.getElementById('creatorSubject');
  const prompt=document.getElementById('creatorPrompt');
  if(!form||!prompt)return;
  const DRAFT_KEY='bp-creative-studio-drafts-v1';
  const OUTPUT_KEY='bp-creative-studio-outputs-v1';
  const $=id=>document.getElementById(id);
  const presets={
    noir:{preset:'portrait',medium:'Contemporary digital fine art',pose:'Close-up portrait composition',lighting:'Low-key cinematic light',palette:'Deep burgundy and warm ivory',subject:'A clearly adult fashion model in an elegant, fully covered black editorial outfit, photographed in a deep charcoal studio with subtle antique-gold accents. Premium Halloween fashion campaign, polished art direction, non-explicit, no nudity or sexual activity.'},
    lace:{preset:'draped',medium:'Contemporary digital fine art',pose:'Standing contrapposto',lighting:'Warm studio softbox',palette:'Monochrome charcoal and paper',subject:'A clearly adult fashion model wearing an opaque black lace-inspired innerwear look, styled as a refined, non-explicit fashion editorial. Show garment texture and construction in a tasteful studio composition; no nudity or sexual activity.'},
    velvet:{preset:'portrait',medium:'Classical oil painting',pose:'Close-up portrait composition',lighting:'Rembrandt chiaroscuro',palette:'Deep burgundy and warm ivory',subject:'A clearly adult portrait subject in a fully styled dark outfit with velvet draping, soft wine-coloured highlights and a calm confident expression. Gothic luxury fashion portrait, non-explicit.'},
    classic:{preset:'academic',medium:'Charcoal on textured paper',pose:'Standing contrapposto',lighting:'Soft north-window light',palette:'Warm sepia, ivory and umber',subject:'A clearly adult, non-explicit academic figure study focused on gesture, proportion, balance and sculptural light. Respectful fine-art atelier setting with no explicit content.'},
    couple:{preset:'duo',medium:'Contemporary digital fine art',pose:'Expressive full-body movement',lighting:'Warm studio softbox',palette:'Deep burgundy and warm ivory',subject:'Two clearly adult fashion models in fully styled, coordinated black-and-burgundy editorial outfits. Balanced non-contact composition, confident posture, respectful personal space and a premium campaign atmosphere.'},
    ember:{preset:'portrait',medium:'Contemporary digital fine art',pose:'Seated, relaxed posture',lighting:'Warm studio softbox',palette:'Muted earth tones',subject:'A clearly adult fashion model in an opaque rose-and-black styled outfit, photographed in warm amber light with a soft editorial background. Elegant, confident, non-explicit seasonal fashion campaign.'}
  };
  function safeStorageRead(key){try{const value=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(value)?value:[];}catch{return[];}}
  function safeStorageWrite(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{return false;}}
  function textStatus(message){const el=$('studioUpgradeStatus');if(el)el.textContent=message;}
  function applyPreset(key){
    const item=presets[key];if(!item)return;
    $('creatorPreset').value=item.preset;$('creatorMedium').value=item.medium;$('creatorPose').value=item.pose;
    $('creatorLighting').value=item.lighting;$('creatorPalette').value=item.palette;form.value=item.subject;
    $('buildCreatorPrompt').click();textStatus('Creative direction applied. Review and edit the generated brief before sending it.');
    $('creatorPrompt').focus({preventScroll:true});
  }
  document.querySelectorAll('[data-studio-preset]').forEach(button=>button.addEventListener('click',()=>applyPreset(button.dataset.studioPreset)));

  function renderDrafts(){
    const host=$('studioPromptShelf');if(!host)return;host.replaceChildren();
    const drafts=safeStorageRead(DRAFT_KEY).filter(x=>x&&typeof x.prompt==='string'&&x.prompt.length<=3000).slice(0,12);
    if(!drafts.length){const empty=document.createElement('p');empty.className='studio-shelf-empty';empty.textContent='Save a creative brief to keep it for later.';host.append(empty);return;}
    drafts.forEach((draft,index)=>{
      const row=document.createElement('article');row.className='studio-shelf-item';
      const copy=document.createElement('div');const title=document.createElement('strong');title.textContent=draft.title||'Saved prompt';
      const meta=document.createElement('small');meta.textContent=new Date(draft.savedAt||Date.now()).toLocaleString();copy.append(title,meta);
      const actions=document.createElement('div');actions.className='studio-shelf-actions';
      const load=document.createElement('button');load.type='button';load.textContent='Load';load.addEventListener('click',()=>{prompt.value=draft.prompt;textStatus('Draft loaded. Review the brief, then build or generate.');prompt.focus();});
      const remove=document.createElement('button');remove.type='button';remove.textContent='Delete';remove.addEventListener('click',()=>{const next=drafts.filter((_,i)=>i!==index);safeStorageWrite(DRAFT_KEY,next);renderDrafts();textStatus('Saved prompt removed.');});
      actions.append(load,remove);row.append(copy,actions);host.append(row);
    });
  }
  $('saveCreatorPrompt')?.addEventListener('click',()=>{
    const value=prompt.value.trim();if(!value){textStatus('Build a prompt before saving a draft.');return;}
    const drafts=safeStorageRead(DRAFT_KEY).filter(x=>x&&typeof x.prompt==='string');
    const title=value.split(/[.!?\n]/)[0].trim().slice(0,54)||'Creative brief';
    const next=[{id:`draft-${Date.now()}`,title,prompt:value,savedAt:Date.now()},...drafts.filter(x=>x.prompt!==value)].slice(0,12);
    textStatus(safeStorageWrite(DRAFT_KEY,next)?'Prompt draft saved on this device.':'Browser storage is unavailable; prompt was not saved.');renderDrafts();
  });

  function trustedOutputUrl(raw){
    if(typeof raw!=='string'||!raw||raw.startsWith('blob:')||raw.startsWith('data:'))return null;
    try{const url=new URL(raw,location.href);const host=url.hostname.toLowerCase();if(url.protocol!=='https:'||(host!=='pollinations.ai'&&!host.endsWith('.pollinations.ai'))||url.username||url.password)return null;return url.href;}catch{return null;}
  }
  function trustedGeneratedUrl(){
    const image=$('creatorOutputImage');if(!image)return null;
    return trustedOutputUrl(image.getAttribute('src')||'');
  }
  function renderOutputs(){
    const host=$('studioOutputShelf');if(!host)return;host.replaceChildren();
    const items=safeStorageRead(OUTPUT_KEY).filter(x=>x&&trustedOutputUrl(x.url)&&typeof x.prompt==='string').slice(0,12);
    if(!items.length){const empty=document.createElement('p');empty.className='studio-shelf-empty';empty.textContent='After generating an image, save its provider link here. Download important images to keep your own permanent copy.';host.append(empty);return;}
    items.forEach((item,index)=>{
      const row=document.createElement('article');row.className='studio-shelf-item';const copy=document.createElement('div');
      const title=document.createElement('strong');title.textContent=item.title||'Generated artwork';const meta=document.createElement('small');meta.textContent=new Date(item.savedAt||Date.now()).toLocaleString()+' · link only';copy.append(title,meta);
      const actions=document.createElement('div');actions.className='studio-shelf-actions';const open=document.createElement('a');open.href=item.url;open.target='_blank';open.rel='noopener noreferrer';open.textContent='Open';
      const remove=document.createElement('button');remove.type='button';remove.textContent='Delete';remove.addEventListener('click',()=>{safeStorageWrite(OUTPUT_KEY,items.filter((_,i)=>i!==index));renderOutputs();textStatus('Saved output link removed.');});
      actions.append(open,remove);row.append(copy,actions);host.append(row);
    });
  }
  function refreshSaveOutput(){
    const button=$('saveCreatorOutput');if(!button)return;
    const url=trustedGeneratedUrl();button.disabled=!url;
    button.title=url?'Save the secure Pollinations image link to My Studio':'Download the image first; only HTTPS Pollinations links can be saved to this shelf.';
  }
  $('saveCreatorOutput')?.addEventListener('click',()=>{
    const url=trustedGeneratedUrl();if(!url){textStatus('This result is a temporary browser image. Download it to keep a permanent copy; only secure Pollinations links can be saved here.');return;}
    const outputs=safeStorageRead(OUTPUT_KEY).filter(x=>x&&trustedOutputUrl(x.url));
    if(outputs.some(item=>item.url===url)){textStatus('This image link is already in My Studio.');return;}
    const title=(form.value.trim().split(/[.!?\n]/)[0]||'Generated artwork').slice(0,65);
    const next=[{id:`output-${Date.now()}`,title,url,prompt:prompt.value.slice(0,3000),savedAt:Date.now()},...outputs].slice(0,12);
    textStatus(safeStorageWrite(OUTPUT_KEY,next)?'Generated image link saved to My Studio on this device.':'Browser storage is unavailable; output link was not saved.');renderOutputs();
  });
  const image=$('creatorOutputImage');
  if(image){image.addEventListener('load',refreshSaveOutput);image.addEventListener('error',refreshSaveOutput);new MutationObserver(refreshSaveOutput).observe(image,{attributes:true,attributeFilter:['src','class']});}
  $('generateCreatorImage')?.addEventListener('click',()=>window.setTimeout(refreshSaveOutput,500));
  $('disconnectPollinations')?.addEventListener('click',()=>window.setTimeout(refreshSaveOutput,0));
  renderDrafts();renderOutputs();refreshSaveOutput();
})();
