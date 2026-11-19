/* ============================================================
   THE SACRED SHROUD — polish: sound & music, battle juice,
   tutorial tips, resume where you left off
   ============================================================ */

/* ---------------- AUDIO ---------------- */
const AU = { ctx: null, master: null, mus: null, fx: null, noise: null, want: null, track: null, timer: null, step: 0, next: 0, last: {}, ther: null };
if (OPT.music == null) OPT.music = true;
if (OPT.sfx == null) OPT.sfx = true;
if (OPT.tips == null) OPT.tips = true;

function auInit() {
  if (AU.ctx) { if (AU.ctx.state === 'suspended') AU.ctx.resume(); return; }
  const C = window.AudioContext || window.webkitAudioContext; if (!C) return;
  try {
    const c = AU.ctx = new C();
    AU.master = c.createGain(); AU.master.gain.value = 0.85; AU.master.connect(c.destination);
    AU.mus = c.createGain(); AU.mus.gain.value = OPT.music ? 0.3 : 0; AU.mus.connect(AU.master);
    AU.fx = c.createGain(); AU.fx.gain.value = OPT.sfx ? 0.5 : 0; AU.fx.connect(AU.master);
    const buf = c.createBuffer(1, c.sampleRate, c.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    AU.noise = buf;
    if (AU.want) { const w = AU.want; AU.want = null; music(w); }
  } catch (e) { AU.ctx = null; }
}
['pointerdown', 'keydown', 'touchstart'].forEach(ev => document.addEventListener(ev, auInit, { capture: true, passive: true }));

function tone(f, t, d, o) {
  o = o || {};
  const c = AU.ctx, osc = c.createOscillator(), g = c.createGain();
  osc.type = o.type || 'square'; osc.frequency.setValueAtTime(f, t);
  if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t + d);
  const v = o.vol == null ? 0.2 : o.vol, a = o.attack || 0.005;
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
  osc.connect(g); g.connect(o.dest || AU.fx); osc.start(t); osc.stop(t + d + 0.05);
}
function noiseHit(t, d, o) {
  o = o || {};
  const c = AU.ctx, src = c.createBufferSource(), g = c.createGain();
  src.buffer = AU.noise; let node = src;
  if (o.hp) { const f = c.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = o.hp; node.connect(f); node = f; }
  if (o.lp) { const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = o.lp; node.connect(f); node = f; }
  const v = o.vol == null ? 0.2 : o.vol;
  g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
  node.connect(g); g.connect(o.dest || AU.fx); src.start(t, Math.random() * 0.5); src.stop(t + d + 0.05);
}
const SFX = {
  click: t => tone(1250, t, 0.035, { vol: 0.05 }),
  hit: t => { noiseHit(t, 0.12, { vol: 0.35, lp: 1800 }); tone(130, t, 0.12, { type: 'sine', vol: 0.3, to: 50 }); },
  weak: t => { SFX.hit(t); tone(880, t, 0.12, { type: 'triangle', vol: 0.16, to: 1400 }); },
  crit: t => { noiseHit(t, 0.22, { vol: 0.4, lp: 3500 }); tone(1700, t, 0.28, { type: 'sawtooth', vol: 0.12, to: 180 }); },
  brk: t => { noiseHit(t, 0.5, { vol: 0.42, hp: 2400 }); [1760, 1320, 990, 660, 440].forEach((f, i) => tone(f, t + i * 0.045, 0.2, { type: 'triangle', vol: 0.13 })); },
  heal: t => [523, 659, 784, 1046].forEach((f, i) => tone(f, t + i * 0.06, 0.28, { type: 'sine', vol: 0.13 })),
  miss: t => noiseHit(t, 0.2, { vol: 0.12, hp: 1200, lp: 4000 }),
  dot: t => noiseHit(t, 0.08, { vol: 0.12, lp: 900 }),
  boost: t => { tone(260, t, 0.32, { type: 'sawtooth', vol: 0.09, to: 1300 }); tone(390, t + 0.04, 0.3, { type: 'square', vol: 0.05, to: 1950 }); },
  victory: t => { [[523, 0, .14], [659, .13, .14], [784, .26, .14], [1046, .39, .5]].forEach(([f, s, d]) => { tone(f, t + s, d, { vol: 0.12 }); tone(f / 2, t + s, d, { type: 'triangle', vol: 0.12 }); }); },
  defeat: t => [392, 330, 262, 196].forEach((f, i) => tone(f, t + i * 0.22, 0.4, { type: 'triangle', vol: 0.15 })),
  level: t => [784, 988, 1175, 1568].forEach((f, i) => tone(f, t + i * 0.07, 0.16, { vol: 0.09 })),
  coin: t => { tone(1320, t, 0.06, { vol: 0.08 }); tone(1760, t + 0.06, 0.12, { vol: 0.08 }); },
  tip: t => { tone(660, t, 0.12, { type: 'sine', vol: 0.12 }); tone(990, t + 0.1, 0.18, { type: 'sine', vol: 0.12 }); }
};
function sfx(name) {
  if (!AU.ctx || !OPT.sfx || !SFX[name]) return;
  const now = AU.ctx.currentTime;
  if (AU.last[name] && now - AU.last[name] < 0.045) return;
  AU.last[name] = now;
  try { SFX[name](now + 0.01); } catch (e) {}
}
function buzz(ms) { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) {} }

/* --- music: a tiny sequencer. Lead voice is a gliding, wobbling "theremin" --- */
const SCALES = { minor: [0, 2, 3, 5, 7, 8, 10], dorian: [0, 2, 3, 5, 7, 9, 10], mixo: [0, 2, 4, 5, 7, 9, 10], phryg: [0, 1, 3, 5, 7, 8, 10], lydian: [0, 2, 4, 6, 7, 9, 11], harm: [0, 2, 3, 5, 7, 8, 11] };
const TRACK_DEF = {
  title:   { bpm: 76, root: 220, sc: 'harm', chords: [0, 5, 3, 4], bass: 'whole', drums: 'none', lead: 'slow', seed: 7 },
  ship:    { bpm: 68, root: 174.6, sc: 'lydian', chords: [0, 4, 1, 4], bass: 'whole', drums: 'none', lead: 'slow', seed: 11 },
  explore: { bpm: 96, root: 196, sc: 'dorian', chords: [0, 3, 6, 4], bass: 'walk', drums: 'soft', lead: 'mid', seed: 3 },
  battle:  { bpm: 142, root: 220, sc: 'minor', chords: [0, 5, 6, 4], bass: 'drive', drums: 'full', lead: 'fast', seed: 21 },
  boss:    { bpm: 154, root: 207.65, sc: 'phryg', chords: [0, 1, 0, 6], bass: 'drive', drums: 'full', lead: 'fast', seed: 33 },
  vault:   { bpm: 118, root: 233.08, sc: 'mixo', chords: [0, 3, 4, 3], bass: 'swing', drums: 'swing', lead: 'mid', seed: 44 }
};
const LOC_MOOD = { eplaotune: ['dorian', 196], pliea: ['phryg', 185], eldania: ['lydian', 207.65], aegialeus: ['harm', 174.6], skuna: ['phryg', 164.8], wucury: ['minor', 155.6], ruenov: ['mixo', 233.08], unknown: ['harm', 146.8], snailshell: ['minor', 138.6], vault: ['mixo', 233.08] };
const TRACKS = {};
function mrng(seed) { let a = seed >>> 0; return () => { a = (a * 1664525 + 1013904223) >>> 0; return a / 4294967296; }; }
function buildTrack(name) {
  if (TRACKS[name]) return TRACKS[name];
  let base = name, mood = null;
  if (name.startsWith('explore:')) { base = 'explore'; mood = LOC_MOOD[name.slice(8)]; }
  const d = Object.assign({}, TRACK_DEF[base]);
  if (mood) { d.sc = mood[0]; d.root = mood[1]; d.seed = name.split('').reduce((a, ch) => a * 31 + ch.charCodeAt(0), 7) >>> 0; }
  const r = mrng(d.seed), steps = 64, lead = new Array(steps).fill(null);
  const rhythm = { slow: [0, 6, 8, 12], mid: [0, 3, 4, 6, 8, 11, 12, 14], fast: [0, 2, 3, 4, 6, 8, 10, 11, 12, 14] }[d.lead];
  const phrase = bar => {
    const out = {}; let deg = d.chords[bar] + [0, 2, 4][Math.floor(r() * 3)] + 7;
    rhythm.forEach(s => { if (r() < 0.82) { out[s] = deg; deg += [-2, -1, -1, 1, 1, 2, 0][Math.floor(r() * 7)]; deg = Math.max(4, Math.min(13, deg)); } });
    return out;
  };
  const A = phrase(0), B2 = phrase(2), A2 = phrase(1);
  [A, A2, B2, A].forEach((ph, bar) => { for (const [s, deg] of Object.entries(ph)) lead[bar * 16 + +s] = deg + (bar === 3 ? 0 : d.chords[bar] - d.chords[bar === 1 ? 1 : bar === 2 ? 2 : 0]) * 0; });
  // bar 4 resolves to the tonic
  lead[60] = 7;
  d.lead = lead; TRACKS[name] = d; return d;
}
function freq(d, deg) { const sc = SCALES[d.sc], o = Math.floor(deg / 7), i = ((deg % 7) + 7) % 7; return d.root * Math.pow(2, (sc[i] + 12 * o) / 12); }
function thereminInit() {
  const c = AU.ctx, o = c.createOscillator(), g = c.createGain(), lfo = c.createOscillator(), lg = c.createGain();
  o.type = 'sine'; lfo.frequency.value = 5.6; lg.gain.value = 7; lfo.connect(lg); lg.connect(o.frequency);
  g.gain.value = 0.0001; o.connect(g); g.connect(AU.mus); o.start(); lfo.start();
  AU.ther = { o, g };
}
function schedStep(d, s, t, sd) {
  const bar = Math.floor(s / 16), st = s % 16, ch = d.chords[bar];
  const M = AU.mus;
  // pad
  if (st === 0) [0, 2, 4].forEach(k => tone(freq(d, ch + k), t, sd * 16 * 0.98, { type: 'sine', vol: 0.035, attack: 0.3, dest: M }));
  // bass
  const bf = freq(d, ch - 7);
  if (d.bass === 'whole' && st === 0) tone(bf, t, sd * 15, { type: 'triangle', vol: 0.16, attack: 0.05, dest: M });
  if (d.bass === 'walk' && st % 4 === 0) tone(freq(d, ch - 7 + [0, 2, 4, 2][st / 4]), t, sd * 3.6, { type: 'triangle', vol: 0.17, dest: M });
  if (d.bass === 'drive' && st % 2 === 0) tone(st % 8 === 6 ? bf * 2 : bf, t, sd * 1.7, { type: 'sawtooth', vol: 0.07, dest: M });
  if (d.bass === 'swing' && [0, 3, 8, 11].includes(st)) tone(st > 7 ? freq(d, ch - 3) : bf, t, sd * 2.6, { type: 'triangle', vol: 0.17, dest: M });
  // drums
  if (d.drums !== 'none') {
    const kick = d.drums === 'full' ? [0, 6, 8, 11] : d.drums === 'swing' ? [0, 8] : [0, 8];
    if (kick.includes(st)) tone(110, t, 0.16, { type: 'sine', vol: 0.32, to: 40, dest: M });
    if ((d.drums === 'full' || d.drums === 'swing') && (st === 4 || st === 12)) noiseHit(t, 0.14, { vol: 0.16, hp: 1500, dest: M });
    const hat = d.drums === 'full' ? st % 2 === 0 : d.drums === 'swing' ? [0, 3, 4, 7, 8, 11, 12, 15].includes(st) : st % 4 === 2;
    if (hat) noiseHit(t, 0.03, { vol: d.drums === 'soft' ? 0.03 : 0.05, hp: 7000, dest: M });
  }
  // theremin lead
  const n = d.lead[s];
  if (AU.ther) {
    const g = AU.ther.g.gain, f = AU.ther.o.frequency;
    if (n != null) { f.setTargetAtTime(freq(d, n), t, 0.04); g.cancelScheduledValues(t); g.setTargetAtTime(0.085, t, 0.03); }
    else if (st % 4 === 3) g.setTargetAtTime(0.0001, t, 0.12);
  }
}
function tick() {
  if (!AU.ctx || !AU.track) return;
  const d = AU.track, sd = 60 / d.bpm / 4;
  while (AU.next < AU.ctx.currentTime + 0.12) {
    try { schedStep(d, AU.step, AU.next, sd); } catch (e) {}
    AU.step = (AU.step + 1) % 64; AU.next += sd;
  }
}
function music(name) {
  if (!name) return;
  if (!AU.ctx) { AU.want = name; return; }
  if (AU.trackName === name) return;
  AU.trackName = name;
  const t = AU.ctx.currentTime;
  if (!AU.ther) thereminInit();
  AU.ther.g.gain.setTargetAtTime(0.0001, t, 0.05);
  AU.mus.gain.setTargetAtTime(0.0001, t, 0.08);
  setTimeout(() => {
    if (AU.trackName !== name) return;
    AU.track = buildTrack(name); AU.step = 0; AU.next = AU.ctx.currentTime + 0.05;
    AU.mus.gain.setTargetAtTime(OPT.music ? 0.3 : 0, AU.ctx.currentTime, 0.2);
    if (!AU.timer) AU.timer = setInterval(tick, 25);
  }, 320);
}
function musicForScreen() {
  const on = id => document.getElementById(id) && document.getElementById(id).classList.contains('on');
  if (on('scr-battle')) return BT && (BT.opts.boss || BT.opts.final) ? 'boss' : 'battle';
  if (on('scr-title') || on('scr-select')) return 'title';
  if (!S) return 'title';
  if (S.place === 'ship') return 'ship';
  if (S.place === 'delve' || S.loc === 'vault') return 'vault';
  return 'explore:' + S.loc;
}
function polishOptions() {
  return B(`Music: ${OPT.music ? 'On' : 'Off'}`, () => { OPT.music = !OPT.music; saveOpts(); if (AU.mus) AU.mus.gain.setTargetAtTime(OPT.music ? 0.3 : 0, AU.ctx.currentTime, 0.1); systemSheet(); }, { sub: 'A different tune for every planet' })
    + B(`Sound effects: ${OPT.sfx ? 'On' : 'Off'}`, () => { OPT.sfx = !OPT.sfx; saveOpts(); if (AU.fx) AU.fx.gain.value = OPT.sfx ? 0.5 : 0; systemSheet(); })
    + B(`Tutorial tips: ${OPT.tips ? 'On' : 'Off'}`, () => { OPT.tips = !OPT.tips; saveOpts(); systemSheet(); }, { sub: 'Short tips the first time you see something new' })
    + B('Show all tips again', () => { S.tips = {}; save(); closeSheet(); sysLine('Tutorial tips will appear again as you play.'); }, { cls: 'small' });
}

/* ---------------- TUTORIAL TIPS ---------------- */
const TIPS = {
  battle: { t: 'Battle basics', b: 'Every enemy has a shield (the number) and hidden weaknesses (the ? chips). Hit a weakness to knock its shield down. At zero the enemy BREAKS: it loses its next turn and takes heavy damage. Tap an enemy to target it.' },
  boost:  { t: 'Boost', b: 'Each crew member gains 1 BP per round (the dots). Tap + before acting to spend up to 3. Attacks hit extra times and skills hit harder. Save BP for broken enemies.' },
  brk:    { t: 'Break!', b: 'That enemy is broken. It skips its next turn and takes 75% more damage until it recovers. Pour your boosts into it now.' },
  hub:    { t: 'Towns', b: 'Gold ★ buttons move the main story. Teal buttons are crew stories. Trade, bounties and the locals are here too. Board the Last Hope to rest for free and to travel.' },
  explore:{ t: 'Exploring', b: 'Explore to fight, find loot and run into events. Open areas never run out, so they’re good for leveling.' },
  dungeon:{ t: 'Dungeons', b: 'Press deeper to make progress. The heart holds a story fight or treasure. Leaving resets your progress, so heal with items instead of walking out.' },
  ship:   { t: 'The Last Hope', b: 'Rest in Crew Quarters to heal fully for free. Julius cooks buffs, Katey upgrades weapons with scrap, Formation swaps your party, and Spectro finds you things.' },
  crewq:  { t: 'Crew stories', b: 'Each crew member has a three-part story. They must be in your party to start it. Finishing one unlocks their ultimate skill.' },
  reserve:{ t: 'Reserve crew', b: 'Only four crew fight at once. Swap them at Formation aboard the Last Hope. Crew on the ship still earn half XP.' },
  auto:   { t: 'Auto-battle', b: 'Tap AUTO in the top corner and the crew fights on its own. Tap it again to take over. Boss fights always start in manual.' },
  weak:   { t: 'Weak enemies', b: 'When you badly outlevel a pack you can scare it off for some XP instead of fighting. Change this in System → Weak enemies.' }
};
window.TIP_WAIT = null;
let tipQueue = [];
function showTip(key) {
  if (!OPT.tips || !S || !TIPS[key]) return;
  S.tips = S.tips || {};
  if (S.tips[key]) return;
  S.tips[key] = 1; save();
  tipQueue.push(key);
  if (!window.TIP_WAIT) nextTip();
}
function nextTip() {
  const key = tipQueue.shift();
  if (!key) return;
  let done; window.TIP_WAIT = new Promise(r => done = r);
  const el = document.getElementById('tip');
  el.innerHTML = `<div class="tip-card" role="dialog" aria-labelledby="tipT"><div class="tip-stamp">Crew Manual</div><h3 id="tipT">${esc(TIPS[key].t)}</h3><p>${esc(TIPS[key].b)}</p><button type="button" class="btn primary" id="tipOk"><span class="bl"><span class="bt">Got it</span></span></button></div>`;
  el.classList.add('on'); sfx('tip');
  document.getElementById('tipOk').addEventListener('click', e => {
    e.stopPropagation(); el.classList.remove('on'); el.innerHTML = '';
    const w = done; window.TIP_WAIT = null; w();
    if (tipQueue.length) setTimeout(nextTip, 150);
  });
}

/* ---------------- HOOKS (wrap engine functions) ---------------- */
const _show = show;
show = function (id) {
  _show(id);
  setTimeout(() => music(musicForScreen()), 0);
  if (id === 'scr-battle' && S) setTimeout(() => {
    showTip('battle');
    if (S.stats && S.stats.battles >= 6) showTip('auto');
  }, 700);
};
const _render = render;
render = function () {
  _render();
  if (!S || !$('#scr-game').classList.contains('on')) return;
  music(musicForScreen());
  if (S.ms >= 0 && !$('#actions .scene-ctl')) {
    if (S.place === 'hub' && S.loc !== 'vault') showTip('hub');
    if (S.place === 'ship') showTip('ship');
    const z = typeof curZone === 'function' ? curZone() : null;
    if (z) showTip(z.depth ? 'dungeon' : 'explore');
    if (Object.keys(S.crew).filter(recruited).length > 4) showTip('reserve');
    if (typeof crewQuestsHere === 'function' && (crewQuestsHere(S.loc).length || (S.place === 'ship' && crewQuestsHere('lasthope').length))) showTip('crewq');
  }
};
const _popup = popup;
popup = function (u, val, kind) {
  _popup(u, val, kind);
  kind = kind || '';
  if (kind.includes('crit')) { sfx('crit'); shakeStage(); buzz(30); }
  else if (kind.includes('weak')) sfx('weak');
  else if (kind === 'heal') sfx('heal');
  else if (kind === 'miss') sfx('miss');
  else if (kind === 'dot') sfx('dot');
  else sfx('hit');
};
const _banner = banner;
banner = function (text, col) {
  _banner(text, col);
  if (text === 'BREAK!') { sfx('brk'); shakeStage(); buzz([20, 30, 40]); setTimeout(() => showTip('brk'), 500); }
  else if (text.startsWith('BOOST')) sfx('boost');
  else if (text === 'VICTORY') { if (AU.ther && AU.ctx) AU.ther.g.gain.setTargetAtTime(0.0001, AU.ctx.currentTime, 0.05); if (AU.mus && AU.ctx) AU.mus.gain.setTargetAtTime(0.0001, AU.ctx.currentTime, 0.1); AU.trackName = null; sfx('victory'); }
  else if (text === 'DEFEATED') { if (AU.mus && AU.ctx) AU.mus.gain.setTargetAtTime(0.0001, AU.ctx.currentTime, 0.1); AU.trackName = null; sfx('defeat'); }
};
const _highlight = highlight;
highlight = function (uid) {
  _highlight(uid);
  const el = document.querySelector(`[data-uid="${uid}"]`);
  if (el) { el.classList.remove('lunge'); void el.offsetWidth; el.classList.add('lunge'); setTimeout(() => el.classList.remove('lunge'), 450); }
};
const _drawCommands = drawCommands;
drawCommands = function (m, view) {
  _drawCommands(m, view);
  if (!view && m.bp >= 2) showTip('boost');
};
const _gainXp = gainXp;
gainXp = function (id, xp) {
  const out = _gainXp(id, xp);
  if (out.length) sfx('level');
  return out;
};
const _maybeScare = maybeScare;
maybeScare = async function (list) {
  const r = await _maybeScare(list);
  if (r) sfx('coin');
  return r;
};
function shakeStage() { const st = document.querySelector('.b-stage'); if (!st) return; st.classList.remove('shake'); void st.offsetWidth; st.classList.add('shake'); }
document.addEventListener('click', e => { if (e.target.closest('.btn, #nav button, .autobtn, #sheetClose')) sfx('click'); }, true);

/* ---------------- VICTORY XP BARS ---------------- */
function xpBars(pre) {
  return `<div class="xpwrap">${S.party.map(id => {
    const c = S.crew[id], p = pre[id]; if (!p) return '';
    const now = c.lv >= 40 ? 1 : c.xp / xpNeed(c.lv), up = c.lv > p.lv;
    return `<div class="xprow" style="--hc:${CREW[id].col}"><span class="xn">${esc(CREW[id].short)}</span><span class="xb"><i style="width:${Math.round(p.p * 100)}%" data-to="${Math.round(now * 100)}" data-up="${up ? 1 : 0}"></i></span><span class="xl">${up ? `<b>Lv ${c.lv}</b>` : `Lv ${c.lv}`}</span>${up ? '<span class="xup">LEVEL UP</span>' : ''}</div>`;
  }).join('')}</div>`;
}
function animateXpBars() {
  document.querySelectorAll('.xprow .xb i').forEach(el => {
    const to = +el.dataset.to, up = el.dataset.up === '1';
    if (up) { el.style.width = '100%'; setTimeout(() => { el.style.transition = 'none'; el.style.width = '0%'; void el.offsetWidth; el.style.transition = ''; el.style.width = to + '%'; el.closest('.xprow').classList.add('leveled'); }, 650); }
    else el.style.width = to + '%';
  });
}

/* ---------------- RESUME WHERE YOU LEFT OFF ---------------- */
async function runThen(then) {
  if (!then) return;
  if (then.startsWith('scene:')) await playScene(then.slice(6));
  else if (then.startsWith('go:')) { busy = false; await arriveAt(then.slice(3)); }
}
async function afterLoad() {
  if (busy) return;
  busy = true;
  try {
    if (S.ms < 0) {
      const hero = S.hero, diff = S.diff;
      S = migrate(newState(hero)); S.diff = diff; addMember(hero);
      clearLog(); sysLine('Starting your prologue from the top.');
      busy = false; await runPrologue(); return;
    }
    const r = S.resume, st = curStep();
    if (r && st && r.id === st.arrive && !S.seen[st.id]) { S.resume = null; busy = false; await checkArrival(); return; }
    if (r && SCENES[r.id]) {
      sysLine('Picking up where you left off.');
      await playScene(r.id, r.idx, r.then);
      busy = false;
      await runThen(r.then);
      if (r.id === 'ch1_offer') { S.place = 'hub'; sysLine('Objective: ' + curStep().obj, 'obj'); }
      save(); render();
      return;
    }
    S.resume = null;
    busy = false;
    await checkArrival();
  } finally { busy = false; }
}
const _enterGame = enterGame;
enterGame = function (fresh) {
  _enterGame(fresh);
  if (!fresh) setTimeout(afterLoad, 50);
};

/* tip overlay element */
(function () {
  const t = document.createElement('div'); t.id = 'tip';
  (document.getElementById('app') || document.body).appendChild(t);
})();
