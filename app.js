'use strict';
(() => {
  const STORAGE_KEY = 'after-dark-halloween-phase2';
  const DEFAULT_STATE = { name: '', xp: 0, rounds: 0, accent: 'blood' };
  const $ = id => document.getElementById(id);
  const safeText = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const loadState = () => {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return { ...DEFAULT_STATE, ...value, name: typeof value.name === 'string' ? value.name.slice(0, 24) : '', xp: Number.isFinite(value.xp) ? Math.max(0, Math.floor(value.xp)) : 0, rounds: Number.isFinite(value.rounds) ? Math.max(0, Math.floor(value.rounds)) : 0, accent: value.accent === 'haunted' ? 'haunted' : 'blood' };
    } catch { return { ...DEFAULT_STATE }; }
  };
  let state = loadState();
  let activeView = 'home';
  let toastTimer = 0;
  let quiz = null;
  let chemistry = null;
  let lastFocus = null;
  const modalLayer = $('modalLayer');

  const dareDecks = {
    flirty: [
      'Give someone a sincere compliment about their confidence or style.',
      'Choose a song for a fictional midnight romance scene.',
      'Deliver your smoothest Halloween-themed pickup line. Keep it kind.',
      'Describe your dream grown-up date in exactly five words.',
      'Hold a dramatic movie-star gaze for five seconds, then laugh it off.',
      'Invent a charming nickname. The other person gets veto power.'
    ],
    bold: [
      'Do a ten-second runway walk like you own the haunted mansion.',
      'Give a dramatic villain monologue about stealing the last dessert.',
      'Let the group choose a harmless stage name for your next round.',
      'Strike a confident magazine-cover pose—no photo needed.',
      'Perform a 15-second dance to a song chosen by the group.',
      'Make a luxury fashion advert for the nearest ordinary object.'
    ],
    spooky: [
      'Tell a 20-second ghost story with a ridiculous plot twist.',
      'Speak like a vampire royalty for the next two turns.',
      'Invent a secret password for the haunted house.',
      'Choose a mystery object and give it a spooky backstory.',
      'Make your best witch laugh without scaring the neighbours.',
      'Name the ghost who would definitely be the house manager.'
    ]
  };
  const vampireQuestions = [
    { q: 'Your perfect Halloween entrance?', a: ['A velvet cape and a quiet smirk', 'A sparkling spell and a big entrance', 'A mysterious mask and zero clues'] },
    { q: 'Choose your after-hours setting.', a: ['A candlelit gothic library', 'A moonlit garden party', 'A secret rooftop lounge'] },
    { q: 'Your signature power?', a: ['Magnetic confidence', 'Creative mischief', 'Calm mystery'] },
    { q: 'Pick your night-time soundtrack.', a: ['Dark orchestral romance', 'Witchy pop and playful beats', 'Slow cinematic jazz'] }
  ];
  const archetypes = [
    { name: 'The Velvet Vampire', text: 'Elegant, quietly confident and impossible to rush. Your look: deep wine, black satin and one dramatic detail.', emoji: '🦇' },
    { name: 'The Spellbound Muse', text: 'Playful, expressive and full of surprises. Your look: plum tones, soft shimmer and a little magical mischief.', emoji: '🪄' },
    { name: 'The Midnight Phantom', text: 'Mysterious, composed and effortlessly cinematic. Your look: sculpted black, antique gold and a hidden signature.', emoji: '🌙' }
  ];
  const chemistryQuestions = [
    { q: 'Pick the ideal Halloween plan.', a: ['A private movie night', 'A costume party'] },
    { q: 'Choose your shared playlist.', a: ['Dark romance', 'Playful pop'] },
    { q: 'Your perfect date-night setting?', a: ['Candlelit dinner', 'Moonlit city walk'] },
    { q: 'Choose a duo costume mood.', a: ['Gothic royalty', 'Vampire & witch'] },
    { q: 'What makes a great night?', a: ['Good conversation', 'Unexpected adventures'] }
  ];
  const dateIdeas = [
    ['The Haunted Dessert Tour', 'Pick two new dessert spots, rate the atmosphere and crown a midnight favourite.'],
    ['Candlelight & Mystery', 'Take turns choosing a song and sharing the memory or mood behind it.'],
    ['Masquerade Mini-Date', 'Create two mystery outfits from what you already own, then reveal the looks.'],
    ['Moonlight Photo Walk', 'Explore a well-lit public route, collect spooky architecture details and skip photos of people unless they agree.'],
    ['Horror Double Feature', 'Choose one classic and one comedy-horror film, then invent a silly award for each.'],
    ['The Secret Menu Challenge', 'Choose a café, order a new-to-you treat and give it a dramatic review.']
  ];
  const outfitIdeas = [
    ['Vampire Velvet', 'Black tailored layers, oxblood accents, velvet texture and a single antique-gold accessory.', '../blacked-luxury-campaign.webp'],
    ['Midnight Masquerade', 'A sleek dark outfit, sculptural mask, polished shoes and one statement detail.', '../black-elegance-fashion.webp'],
    ['Witching Hour', 'Deep plum layers, a flowing silhouette, subtle metallic accents and comfortable shoes.', '../mughal-royal-romance-poster.webp'],
    ['Dark Rose', 'Black base, rose-toned accents, soft lace-inspired texture and understated jewellery.', '../pink-lace-collection.webp'],
    ['Gothic Royalty', 'A structured silhouette, rich fabric texture and a restrained gold finish.', '../royal-palace-saree.webp']
  ];
  const masqueradeLooks = [
    ['The Blood Moon Mask', 'A deep-red mask, velvet details and a confident entrance. Icebreaker: “Which song would play when you enter a haunted ballroom?”'],
    ['The Golden Phantom', 'A brushed-gold mask, monochrome styling and a secret signature. Icebreaker: “What is your most underrated superpower?”'],
    ['The Midnight Rose', 'A rose-dark mask, soft shimmer and a touch of old-Hollywood drama. Icebreaker: “Which fictional world would you visit for one night?”'],
    ['The Silver Spell', 'A silver mask, dark tailoring and cool moonlit details. Icebreaker: “What tiny thing instantly improves your mood?”']
  ];

  function persist() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch { showToast('Storage unavailable — this change may not be saved.'); }
  }
  function updateProfileUI() {
    const label = state.name || 'Night Guest';
    $('welcomeTitle').textContent = `Welcome, ${label}.`;
    $('profileName').textContent = label;
    $('displayName').value = state.name;
    $('xpValue').textContent = String(state.xp).padStart(3, '0');
    document.documentElement.dataset.accent = state.accent;
    document.querySelectorAll('[data-accent]').forEach(button => button.classList.toggle('is-selected', button.dataset.accent === state.accent));
  }
  function showToast(message) {
    const toast = $('toast');
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2300);
  }
  function addXP(amount, message) {
    state.xp += amount;
    state.rounds += 1;
    persist();
    updateProfileUI();
    if (message) showToast(message);
  }
  function navigate(view) {
    if (!['home', 'shop', 'play', 'art', 'more'].includes(view)) return;
    activeView = view;
    document.querySelectorAll('[data-view-panel]').forEach(panel => {
      const selected = panel.dataset.viewPanel === view;
      panel.classList.toggle('is-active', selected);
      panel.hidden = !selected;
    });
    document.querySelectorAll('.nav-item[data-view]').forEach(button => button.classList.toggle('is-active', button.dataset.view === view));
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }
  function openModal(title, eyebrow, content, buttons = []) {
    lastFocus = document.activeElement;
    $('modalTitle').textContent = title;
    $('modalEyebrow').textContent = eyebrow;
    $('modalContent').innerHTML = content;
    $('modalFoot').innerHTML = buttons.map(button => `<button class="button ${button.secondary ? 'button-secondary' : 'button-primary'}" data-action="${safeText(button.action)}">${safeText(button.label)}</button>`).join('');
    modalLayer.hidden = false;
    document.body.classList.add('modal-open');
    modalLayer.querySelector('[data-action="close-modal"]').focus();
  }
  function closeModal() {
    modalLayer.hidden = true;
    document.body.classList.remove('modal-open');
    quiz = null;
    chemistry = null;
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }
  function revealResult(title, text, label = 'YOUR RESULT', emoji = '✦') {
    openModal(title, 'AFTER DARK / REVEAL', `<div class="result-card"><span class="result-kicker">${safeText(label)}</span><div class="wheel-result"><div class="wheel-emoji">${safeText(emoji)}</div><h3>${safeText(title)}</h3><p>${safeText(text)}</p></div></div><p class="modal-note">For entertainment and style inspiration only. Your result is not a personality assessment.</p>`, [{ label: 'Done', action: 'close-modal' }]);
    addXP(5, '+5 XP · A little Halloween magic');
  }
  function startVampireQuiz() {
    quiz = { step: 0, answers: [] };
    renderVampireQuestion();
  }
  function renderVampireQuestion() {
    if (!quiz) return;
    const q = vampireQuestions[quiz.step];
    const content = `<div class="quiz-progress"><span style="width:${(quiz.step / vampireQuestions.length) * 100}%"></span></div><p class="modal-lede">Question ${quiz.step + 1} of ${vampireQuestions.length}</p><h3 class="modal-question">${safeText(q.q)}</h3><div class="choice-list">${q.a.map((answer, index) => `<button class="choice-button" data-action="vampire-answer" data-choice="${index}">${safeText(answer)}</button>`).join('')}</div><p class="modal-note">Choose what feels most like your Halloween alter ego. You can close the quiz at any time.</p>`;
    openModal('Vampire Match', 'HALLOWEEN / PERSONALITY QUIZ', content, [{ label: 'Cancel', action: 'close-modal', secondary: true }]);
  }
  function chooseVampireAnswer(index) {
    if (!quiz || !Number.isInteger(index) || index < 0 || index > 2) return;
    quiz.answers.push(index);
    quiz.step += 1;
    if (quiz.step < vampireQuestions.length) return renderVampireQuestion();
    const counts = [0, 0, 0];
    quiz.answers.forEach(answer => { counts[answer] += 1; });
    const result = archetypes[counts.indexOf(Math.max(...counts))];
    quiz = null;
    revealResult(result.name, result.text, 'YOUR HALLOWEEN ARCHETYPE', result.emoji);
  }
  function startChemistry() {
    chemistry = { player: 0, answers: [[], []] };
    renderChemistryQuestion();
  }
  function renderChemistryQuestion() {
    if (!chemistry) return;
    const qIndex = chemistry.answers[chemistry.player].length;
    if (qIndex >= chemistryQuestions.length) {
      if (chemistry.player === 0) {
        chemistry.player = 1;
        openModal('Pass the phone', 'MIDNIGHT CHEMISTRY / PLAYER TWO', '<div class="result-card"><h3>Player One is done.</h3><p>Hand the device to Player Two. Their picks stay hidden until both players finish.</p></div><p class="modal-note">No answers are saved or shared remotely.</p>', [{ label: 'Player Two is ready', action: 'chemistry-next-player' }, { label: 'Cancel', action: 'close-modal', secondary: true }]);
      } else {
        const matches = chemistry.answers[0].filter((answer, i) => answer === chemistry.answers[1][i]).length;
        const score = Math.round((matches / chemistryQuestions.length) * 100);
        const verdict = score >= 80 ? 'Same moon, same mischief.' : score >= 40 ? 'Different spells, interesting chemistry.' : 'Opposites make a memorable duo.';
        chemistry = null;
        revealResult(`${score}% playful match`, `${verdict} You matched on ${matches} of ${chemistryQuestions.length} fun choices. This is a party-game score—not a real relationship or compatibility measure.`, 'MIDNIGHT CHEMISTRY', '♡');
      }
      return;
    }
    const q = chemistryQuestions[qIndex];
    const content = `<div class="quiz-progress"><span style="width:${(qIndex / chemistryQuestions.length) * 100}%"></span></div><p class="modal-lede">Player ${chemistry.player + 1} · Question ${qIndex + 1} of ${chemistryQuestions.length}</p><h3 class="modal-question">${safeText(q.q)}</h3><div class="choice-list">${q.a.map((answer, index) => `<button class="choice-button" data-action="chemistry-answer" data-choice="${index}">${safeText(answer)}</button>`).join('')}</div><p class="modal-note">Answer privately, then pass the phone. No pressure to explain a choice.</p>`;
    openModal('Midnight Chemistry', 'TWO ADULTS / ONE DEVICE', content, [{ label: 'Cancel', action: 'close-modal', secondary: true }]);
  }
  function chooseChemistryAnswer(index) {
    if (!chemistry || (index !== 0 && index !== 1)) return;
    chemistry.answers[chemistry.player].push(index);
    renderChemistryQuestion();
  }
  function spinWheel(category) {
    const deck = dareDecks[category];
    if (!deck) return;
    const prompt = deck[Math.floor(Math.random() * deck.length)];
    const categoryLabel = category === 'flirty' ? 'FLIRTY' : category === 'bold' ? 'BOLD' : 'SPOOKY';
    openModal('Your prompt is ready', `HAUNTING DARE WHEEL / ${categoryLabel}`, `<div class="wheel-result"><div class="wheel-emoji">${category === 'spooky' ? '🎃' : category === 'bold' ? '🖤' : '♡'}</div><span class="result-kicker">${categoryLabel} PROMPT</span><p>${safeText(prompt)}</p></div><p class="modal-note">Only play when everyone involved is comfortable. Pass, pause or stop at any point. No physical contact or private media is required.</p>`, [{ label: 'Another spin', action: 'wheel-again', secondary: true }, { label: 'I played this', action: 'complete-round' }, { label: 'Pass this one', action: 'pass-round', secondary: true }]);
    window.__afterDarkWheel = category;
  }
  function openFeature(feature) {
    switch (feature) {
      case 'vampire': return startVampireQuiz();
      case 'chemistry': return startChemistry();
      case 'wheel': return openModal('Haunting Dare Wheel', 'CHOOSE YOUR COMFORT ZONE', '<p class="modal-lede">Pick the energy for this round. Prompts stay non-explicit and can be skipped without explanation.</p><div class="choice-list"><button class="choice-button" data-action="wheel-category" data-category="flirty">♡ Flirty — sweet banter and compliments</button><button class="choice-button" data-action="wheel-category" data-category="bold">⚡ Bold — confidence and harmless performance</button><button class="choice-button" data-action="wheel-category" data-category="spooky">🎃 Spooky — Halloween mischief</button></div><p class="modal-note">Everyone must be an adult and comfortable. No touching, recording or sexual activity is part of these prompts.</p>', [{ label: 'Close', action: 'close-modal', secondary: true }]);
      case 'masquerade': {
        const item = masqueradeLooks[Math.floor(Math.random() * masqueradeLooks.length)];
        return revealResult(item[0], item[1], 'MASQUERADE REVEAL', '🎭');
      }
      case 'date': {
        const item = dateIdeas[Math.floor(Math.random() * dateIdeas.length)];
        return revealResult(item[0], item[1], 'HAUNTED DATE ORACLE', '☾');
      }
      case 'outfit': {
        const item = outfitIdeas[Math.floor(Math.random() * outfitIdeas.length)];
        openModal(item[0], 'NIGHT OUTFIT ORACLE / STYLE INSPIRATION', `<div class="result-card"><img class="result-image" src="${safeText(item[2])}" alt="${safeText(item[0])} fashion inspiration"><span class="result-kicker">YOUR LOOK</span><p>${safeText(item[1])}</p></div><p class="modal-note">Style inspiration only. Choose what feels comfortable and appropriate for your setting.</p>`, [{ label: 'Shuffle another look', action: 'outfit-again', secondary: true }, { label: 'Done', action: 'close-modal' }]);
        return;
      }
      default: return;
    }
  }
  function handleAction(button) {
    const action = button.dataset.action;
    switch (action) {
      case 'confirm-age':
        try { sessionStorage.setItem('after-dark-age-confirmed', '1'); } catch { /* session storage may be unavailable */ }
        $('ageGate').hidden = true;
        document.body.classList.remove('gate-open');
        navigate('home');
        showToast('Welcome to After Dark. Stay in control.');
        return;
      case 'leave-age':
        $('ageGate').innerHTML = '<div class="gate-card"><p class="eyebrow">THANK YOU FOR CHECKING</p><h1>This night is<br><em>for adults only.</em></h1><p>Please leave this experience. You can return when you are 18 or older.</p></div>';
        return;
      case 'navigate': return navigate(button.dataset.view);
      case 'go-home': return navigate('home');
      case 'go-shop': return navigate('shop');
      case 'go-play': return navigate('play');
      case 'go-profile': return navigate('more');
      case 'open-feature': return openFeature(button.dataset.feature);
      case 'close-modal': return closeModal();
      case 'mood': return revealResult(button.dataset.mood, 'Your mood is set. Pick a game, style idea or date-night prompt that matches this energy.', 'TONIGHT’S MOOD', '✦');
      case 'vampire-answer': return chooseVampireAnswer(Number(button.dataset.choice));
      case 'chemistry-answer': return chooseChemistryAnswer(Number(button.dataset.choice));
      case 'chemistry-next-player':
        if (chemistry) { chemistry.player = 1; renderChemistryQuestion(); }
        return;
      case 'wheel-category': return spinWheel(button.dataset.category);
      case 'wheel-again': return spinWheel(window.__afterDarkWheel || 'flirty');
      case 'complete-round': addXP(10, '+10 XP · Round completed'); return closeModal();
      case 'pass-round': addXP(1, 'No pressure. +1 XP for checking in.'); return closeModal();
      case 'outfit-again': return openFeature('outfit');
      case 'accent':
        state.accent = button.dataset.accent === 'haunted' ? 'haunted' : 'blood';
        persist(); updateProfileUI(); showToast('Visual mood updated.'); return;
      case 'reset-progress':
        state = { ...DEFAULT_STATE };
        persist(); updateProfileUI(); showToast('Local progress reset.'); return;
      default: return;
    }
  }
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    if (button.tagName === 'A' && button.target === '_blank') return;
    handleAction(button);
  });
  $('profileForm').addEventListener('submit', event => {
    event.preventDefault();
    state.name = $('displayName').value.trim().slice(0, 24);
    persist(); updateProfileUI(); showToast(state.name ? 'Your display name is saved on this device.' : 'Display name cleared.');
  });
  modalLayer.addEventListener('click', event => { if (event.target === modalLayer) closeModal(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !modalLayer.hidden) closeModal();
    if (event.key === 'Tab' && !modalLayer.hidden) {
      const focusable = [...modalLayer.querySelectorAll('button:not([disabled]),a[href],input:not([disabled])')];
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });

  updateProfileUI();
  let ageConfirmed = false;
  try { ageConfirmed = sessionStorage.getItem('after-dark-age-confirmed') === '1'; } catch { ageConfirmed = false; }
  $('ageGate').hidden = ageConfirmed;
  if (!ageConfirmed) document.body.classList.add('gate-open');
  navigate('home');
})();
