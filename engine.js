/* ============================================================
   THE SACRED SHROUD — engine
   ============================================================ */
const SAVE_KEY = 'sacredshroud_save_v1';
const OPT_KEY = 'sacredshroud_opts_v1';
let S = null;
let OPT = { speed: 1 };
try { OPT = Object.assign(OPT, JSON.parse(localStorage.getItem(OPT_KEY) || '{}')); } catch (e) {}

/* ---------- utils ---------- */
const $ = s => document.querySelector(s);
const rnd = () => Math.random();
const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = a => a[Math.floor(Math.random() * a.length)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const sleep = ms => new Promise(r => setTimeout(r, ms / (OPT.speed || 1)));
const esc = s => String(s).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
const fmt = n => Math.round(n).toLocaleString('en-US');
const NUM = ['ZERO', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN'];

/* button builder: build HTML then mount() immediately */
let PEND = [];
function B(label, fn, o) {
  o = o || {};
  const i = PEND.length; PEND.push(fn);
  return `<button type="button" class="btn ${o.cls || ''}" data-i="${i}" ${o.dis ? 'disabled' : ''} ${o.style ? `style="${o.style}"` : ''}>${o.icon ? `<span class="ico">${o.icon}</span>` : ''}<span class="bl"><span class="bt">${label}</span>${o.sub ? `<span class="bs">${o.sub}</span>` : ''}</span>${o.right ? `<span class="br">${o.right}</span>` : ''}</button>`;
}
function mount(el, html) {
  const fns = PEND; PEND = [];
  el.innerHTML = html;
  el.querySelectorAll('[data-i]').forEach(b => {
    const f = fns[+b.dataset.i];
    b.addEventListener('click', e => { e.stopPropagation(); if (!b.disabled && f) f(e); });
  });
}
function chip(ty) { const d = DMG[ty]; return d ? `<span class="chip" style="--c:${d.c}">${d.ab}</span>` : ''; }

/* ---------- state ---------- */
function newState(hero) {
  return {
    v: 1, hero, ms: -1, done: {}, flags: {}, seen: {},
    crew: {}, party: [], cr: 150, scrap: 0, bag: { medgel: 4, psicell: 2, antitox: 1 }, upgrades: {},
    loc: 'eplaotune', place: PROLOGUES[hero].loc === 'lasthope' ? 'ship' : 'hub', depth: {}, cleared: {}, rewards: {},
    cq: {}, bounties: {}, jq: {}, banter: {}, codex: {}, known: {}, ult: {},
    meal: null, spectroReady: true, stats: { battles: 0, wins: 0, steps: 0 }, started: Date.now()
  };
}
const isDone = id => !id || id === 'start' || id === 'join' || !!S.done[id];
const recruited = id => !!(S.crew[id] && S.crew[id].joined);
const inParty = id => S.party.includes(id);
const curStep = () => S.ms >= 0 ? MAIN[S.ms] : null;
const chapter = () => { const st = curStep(); return st ? st.ch : 0; };
const locUnlocked = id => LOC_UNLOCK[id] === 'start' || isDone(LOC_UNLOCK[id]);
const partyLv = () => { const ls = S.party.map(id => S.crew[id].lv); return Math.round(ls.reduce((a, b) => a + b, 0) / ls.length); };
const maxLv = () => Math.max(...Object.keys(S.crew).filter(recruited).map(id => S.crew[id].lv));
const talent = id => inParty(id);
const bagAdd = (id, n) => { S.bag[id] = (S.bag[id] || 0) + (n == null ? 1 : n); if (S.bag[id] <= 0) delete S.bag[id]; };
const xpNeed = lv => Math.round(25 * Math.pow(lv, 1.55) + 15);

function bestGear(cat, tierMax, kind) {
  let best = null;
  for (const [id, it] of Object.entries(ITEMS)) {
    if (it.unique || it.price === 0) continue;
    if (kind === 'weapon' && it.k === 'weapon' && it.cat === cat && it.tier <= tierMax && (!best || it.atk > ITEMS[best].atk)) best = id;
    if (kind === 'armor' && it.k === 'armor' && it.tier <= tierMax && (!best || it.arm > ITEMS[best].arm)) best = id;
  }
  return best;
}
function addMember(id) {
  if (recruited(id)) return false;
  const lv = Object.keys(S.crew).length ? Math.max(1, maxLv()) : 1;
  const st = CREW[id].start;
  const eq = { weapon: st.weapon, armor: st.armor, acc: st.acc };
  const tier = Math.min(5, Math.floor((lv - 1) / 4) + 1);
  if (tier > 1) {
    if (!ITEMS[eq.weapon].unique) eq.weapon = bestGear(ITEMS[st.weapon].cat, tier, 'weapon') || eq.weapon;
    eq.armor = bestGear(null, tier, 'armor') || eq.armor;
  }
  S.crew[id] = { joined: true, lv, xp: 0, hp: 1, mp: 1, eq, status: {} };
  const cs = charStats(id); S.crew[id].hp = cs.mhp; S.crew[id].mp = cs.mmp;
  if (S.party.length < 4) S.party.push(id);
  return true;
}
function charStats(id) {
  const c = S.crew[id], cl = CLASSES[CREW[id].cls], L = c.lv - 1, st = {};
  ['str', 'dex', 'spd', 'int', 'end', 'arm'].forEach(k => st[k] = Math.floor(cl.base[k] + cl.grow[k] * L));
  let mhp = Math.floor(cl.base.hp + cl.grow.hp * L), mmp = Math.floor(cl.base.mp + cl.grow.mp * L);
  const bon = { crit: 0, eva: 0, regen: 0, mpRegen: 0, mp: 0, resist: [] };
  const armor = c.eq.armor ? ITEMS[c.eq.armor] : null, acc = c.eq.acc ? ITEMS[c.eq.acc] : null;
  if (armor) st.arm += armor.arm;
  [armor && armor.bon, acc && acc.bon].forEach(b => {
    if (!b) return;
    for (const [k, v] of Object.entries(b)) {
      if (k === 'resist') bon.resist.push(v);
      else if (st[k] != null) { st[k] += v; if (k === 'end') mhp += v * 8; }
      else bon[k] = (bon[k] || 0) + v;
    }
  });
  mmp += bon.mp;
  const w = ITEMS[c.eq.weapon], up = S.upgrades[c.eq.weapon] || 0;
  const atkW = w.atk + up * 3 * (w.upMult || 1), intW = (w.int || 0) + (w.int ? up * 2 : 0);
  return {
    ...st, mhp, mmp, atk: st.str + atkW, tec: st.int + intW, ty: w.ty,
    crit: Math.round(5 + st.dex * 0.12 + bon.crit), eva: Math.round(3 + st.spd * 0.08 + bon.eva),
    res: Math.round(st.end * 0.6 + st.int * 0.25), resist: bon.resist, regen: bon.regen, mpRegen: bon.mpRegen
  };
}
function skillsOf(id) {
  const lv = S.crew[id].lv;
  const list = CLASS_SKILLS[CREW[id].cls].filter(([, l]) => lv >= l).map(([s]) => s);
  if (S.ult[id]) list.push(ULTIMATES[id]);
  return list;
}
function gainXp(id, xp) {
  const c = S.crew[id], out = [];
  if (c.lv >= 40) return out;
  c.xp += Math.round(xp);
  while (c.xp >= xpNeed(c.lv) && c.lv < 40) {
    const before = charStats(id);
    c.xp -= xpNeed(c.lv); c.lv++;
    const after = charStats(id);
    c.hp += after.mhp - before.mhp; c.mp += after.mmp - before.mmp;
    out.push(`${CREW[id].short} reached level ${c.lv}!`);
    CLASS_SKILLS[CREW[id].cls].forEach(([s, l]) => { if (l === c.lv) out.push(`${CREW[id].short} learned ${SKILLS[s].n}.`); });
  }
  return out;
}
function healAll() { Object.keys(S.crew).forEach(id => { const cs = charStats(id); S.crew[id].hp = cs.mhp; S.crew[id].mp = cs.mmp; S.crew[id].status = {}; }); }
function unlockCodex(id) { if (CODEX[id] && !S.codex[id]) { S.codex[id] = 1; return true; } return false; }

/* ---------- save ---------- */
function save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch (e) {} }
function loadSave() { try { const t = localStorage.getItem(SAVE_KEY); return t ? JSON.parse(t) : null; } catch (e) { return null; } }
function saveOpts() { try { localStorage.setItem(OPT_KEY, JSON.stringify(OPT)); } catch (e) {} }
function exportCode() { return btoa(unescape(encodeURIComponent(JSON.stringify(S)))); }
function importCode(code) { const o = JSON.parse(decodeURIComponent(escape(atob(code.trim())))); if (!o || !o.hero || !o.crew) throw new Error('bad'); return o; }

/* ---------- screens ---------- */
function show(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.toggle('on', s.id === id));
}
function titleScreen() {
  show('scr-title');
  requestAnimationFrame(() => ART.paintTitle($('#titleArt')));
  const sv = loadSave();
  let h = '';
  if (sv) h += B('Continue', () => { S = sv; enterGame(); }, { cls: 'primary', sub: `${CREW[sv.hero].short} · ${sv.ms >= 0 && MAIN[sv.ms] ? 'Chapter ' + MAIN[sv.ms].ch : 'Prologue'} · ${fmt(sv.cr)} cr` });
  h += B('New Game', () => selectScreen(), { cls: sv ? '' : 'primary', sub: 'Choose your hero' });
  h += B('Import Save Code', () => importDialog(), { sub: 'Paste a code from another device' });
  mount($('#titleBtns'), h);
}
function selectScreen() {
  show('scr-select');
  let h = '';
  CREW_ORDER.forEach(id => {
    const c = CREW[id], cl = CLASSES[c.cls], b = cl.base;
    h += `<article class="hero-card" style="--hc:${c.col}">
      <div class="hc-top"><div class="badge">${c.glyph}</div><div><h3>${esc(c.n)}</h3><p class="hc-cls">${esc(cl.n)} · ${esc(c.title)}</p></div></div>
      <p class="hc-blurb">${esc(c.blurb)}</p>
      <div class="statrow">${['hp', 'mp', 'str', 'dex', 'spd', 'int', 'end', 'arm'].map(k => `<span><b>${k.toUpperCase()}</b>${b[k]}</span>`).join('')}</div>
      <p class="hc-talent"><b>${esc(c.talent.n)}</b> ${esc(c.talent.d)}</p>
      <p class="hc-wpn">Weapons: ${cl.wt.join(', ')}</p>
      ${B(`Play as ${esc(c.short)}`, () => startNew(id), { cls: 'primary' })}
    </article>`;
  });
  mount($('#heroList'), h + B('Back', () => titleScreen()));
  $('#heroList').scrollTop = 0;
}
async function startNew(hero) {
  S = newState(hero);
  addMember(hero);
  enterGame(true);
  clearLog();
  const P = PROLOGUES[hero];
  S.place = P.loc === 'lasthope' ? 'ship' : (P.zone ? 'zone:' + P.zone : 'hub');
  if (P.loc === 'lasthope') S.loc = 'eplaotune';
  render();
  await playScene(P.scene);
  const r = await battle(P.battle, { story: true, noFlee: true, tutorial: true });
  if (r !== 'win') return;
  await playScene(P.post);
  S.ms = 0; S.loc = 'eplaotune'; S.place = 'ship';
  render();
  await playScene('ch1_offer');
  S.place = 'hub';
  save(); render();
  sysLine('Objective: ' + curStep().obj, 'obj');
}
function enterGame(fresh) {
  show('scr-game');
  if (!fresh) { clearLog(); sysLine(`Welcome back, ${CREW[S.hero].short}.`); const st = curStep(); if (st) sysLine('Objective: ' + st.obj, 'obj'); }
  render();
}
function importDialog() {
  openSheet('Import Save', `<p class="muted">Paste a save code exported from the System menu.</p><textarea id="impText" rows="6" class="ta"></textarea><div id="impBtns"></div><p id="impMsg" class="muted"></p>`);
  mount($('#impBtns'), B('Load this save', () => {
    try { S = importCode($('#impText').value); save(); closeSheet(); enterGame(); }
    catch (e) { $('#impMsg').textContent = 'That code could not be read. Check that you copied all of it.'; }
  }, { cls: 'primary' }));
}

/* ---------- log & scenes ---------- */
function clearLog() { $('#log').innerHTML = ''; }
function addLog(html, cls) {
  const log = $('#log'); const p = document.createElement('p');
  p.className = cls || ''; p.innerHTML = html; log.appendChild(p);
  while (log.children.length > 90) log.removeChild(log.firstChild);
  log.scrollTop = log.scrollHeight;
  return p;
}
function sysLine(t, cls) { addLog(esc(t), 'sys ' + (cls || '')); }
function speakerName(sp) {
  if (sp.startsWith('N:')) return { n: sp.slice(2), c: '#c8442e' };
  if (sp === 'julius') return { n: 'Julius', c: '#b06a2a' };
  if (CREW[sp]) return { n: CREW[sp].short, c: CREW[sp].col };
  return { n: sp, c: '#c8442e' };
}
function lineOk(line) {
  const m = line.match(/^\[(h|nh|p|r):(\w+)\]/);
  if (!m) return [true, line];
  const rest = line.slice(m[0].length), [, k, id] = m;
  const ok = k === 'h' ? S.hero === id : k === 'nh' ? S.hero !== id : k === 'p' ? inParty(id) : recruited(id);
  return [ok, rest];
}
function runCmd(cmd) {
  const [k, v] = cmd.slice(1).split(':');
  if (k === 'join') { if (addMember(v)) { const c = CREW[v]; addLog(`★ ${esc(c.n)} joined the crew. <span class="muted">${S.party.includes(v) ? 'Added to the party.' : 'Waiting on the Last Hope. Swap them in at Formation.'}</span>`, 'sys join'); } }
  else if (k === 'item') { bagAdd(v); addLog(`Received <b>${esc(ITEMS[v].n)}</b>.`, 'sys'); }
  else if (k === 'cr') { S.cr += +v; addLog(`+${fmt(+v)} credits.`, 'sys'); }
  else if (k === 'codex') { if (unlockCodex(v)) addLog(`Codex: ${esc(CODEX[v].n)}`, 'sys codex'); }
  else if (k === 'flag') S.flags[v] = 1;
  else if (k === 'ult') { S.ult[v] = 1; addLog(`★ ${esc(CREW[v].short)} learned the ultimate skill ${esc(SKILLS[ULTIMATES[v]].n)}!`, 'sys join'); }
  else if (k === 'heal') healAll();
}
function renderLine(line) {
  line = line.replace(/\{hero\}/g, CREW[S.hero].short);
  if (/^(CHAPTER|EPILOGUE|THE END)/.test(line)) return addLog(esc(line), 'chapter');
  const i = line.indexOf('|');
  if (i > 0 && i < 30) {
    const sp = speakerName(line.slice(0, i));
    return addLog(`<span class="sp" style="--sc:${sp.c}">${esc(sp.n)}</span>${esc(line.slice(i + 1))}`, 'say');
  }
  return addLog(esc(line), 'nar');
}
function playScene(id) {
  const lines = typeof id === 'string' ? SCENES[id] : id;
  if (!lines) return Promise.resolve();
  return new Promise(resolve => {
    let idx = 0, skipping = false;
    const act = $('#actions');
    const next = () => {
      while (idx < lines.length) {
        const [ok, line] = lineOk(lines[idx++]);
        if (!ok) continue;
        if (line.startsWith('~')) { runCmd(line); continue; }
        const p = renderLine(line);
        p.classList.add('fresh');
        if (!skipping) return draw();
      }
      finish();
    };
    const draw = () => {
      mount(act, `<div class="scene-ctl">${B('Continue', next, { cls: 'primary', right: '▸' })}${B('Skip', () => { skipping = true; next(); }, { cls: 'ghost small' })}</div>`);
    };
    const finish = () => { $('#log').onclick = null; resolve(); };
    $('#log').onclick = () => { if (!skipping) next(); };
    next();
  });
}
function choose(opts) {
  return new Promise(res => {
    mount($('#actions'), `<div class="sec">${opts.map((o, i) => B(o.l, () => res(i), { cls: o.cls || '', sub: o.sub })).join('')}</div>`);
  });
}
function confirmBox(text, yes, no) {
  return new Promise(res => {
    openSheet('Are you sure?', `<p>${esc(text)}</p><div id="cfBtns" class="row2"></div>`);
    mount($('#cfBtns'), B(yes || 'Yes', () => { closeSheet(); res(true); }, { cls: 'primary' }) + B(no || 'Cancel', () => { closeSheet(); res(false); }));
  });
}

/* ---------- main render ---------- */
function placeArt() {
  const L = LOCS[S.loc];
  if (S.place === 'ship') return Object.assign({}, LOCS.lasthope.art, { view: S.loc });
  if (S.place.startsWith('zone:')) { const z = L.zones.find(z => z.id === S.place.slice(5)); return z ? z.art : L.art; }
  return L.hub ? L.hub.art : L.art;
}
let lastArtKey = '';
function render() {
  if (!S) return;
  const L = LOCS[S.loc];
  let name, sub;
  if (S.place === 'ship') { name = 'The Last Hope'; sub = `Docked at ${L.n}`; }
  else if (S.place.startsWith('zone:')) { const z = curZone(); name = z.n; sub = `${L.n} · Lv ${z.lv[0]}–${z.lv[1]}`; }
  else { name = L.hub.n; sub = `${L.n} · ${L.sys}`; }
  $('#locName').textContent = name; $('#locSub').textContent = sub;
  $('#hudCr').textContent = `${fmt(S.cr)} cr`;
  $('#hudCh').textContent = S.ms < 0 ? 'PROLOGUE' : chapter() >= 7 ? 'EPILOGUE' : `CH ${chapter()}`;
  const art = placeArt(), key = JSON.stringify([art.k, art.seed, art.view]);
  if (key !== lastArtKey) { lastArtKey = key; requestAnimationFrame(() => ART.paint($('#art'), art)); }
  renderPartyStrip();
  renderActions();
}
function renderPartyStrip() {
  $('#strip').innerHTML = S.party.map(id => {
    const c = S.crew[id], cs = charStats(id);
    return `<div class="pm" style="--hc:${CREW[id].col}"><b>${esc(CREW[id].short)}</b><span class="lv">Lv${c.lv}</span>
      <i class="bar hp"><i style="width:${clamp(c.hp / cs.mhp * 100, 0, 100)}%"></i></i><i class="bar mp"><i style="width:${clamp(c.mp / cs.mmp * 100, 0, 100)}%"></i></i></div>`;
  }).join('');
}
const curZone = () => S.place.startsWith('zone:') ? LOCS[S.loc].zones.find(z => z.id === S.place.slice(5)) : null;
function sec(title, inner) { return inner ? `<div class="sec"><h4>${title}</h4>${inner}</div>` : ''; }

function renderActions() {
  if (S.ms < 0) { mount($('#actions'), ''); return; }
  const act = $('#actions');
  if (S.place === 'ship') return mount(act, shipActions());
  if (S.place.startsWith('zone:')) return mount(act, zoneActions(curZone()));
  return mount(act, hubActions());
}

/* ---------- HUB ---------- */
function storyHere() {
  const st = curStep(); if (!st || st.loc !== S.loc) return null; return st;
}
function crewQuestsHere(locId) {
  const out = [];
  Object.keys(CREWQ).forEach(id => {
    if (!recruited(id)) return;
    const n = S.cq[id] || 0, part = CREWQ[id].parts[n];
    if (!part || part.loc !== locId || !isDone(part.req)) return;
    out.push({ id, part, n });
  });
  return out;
}
function hubActions() {
  const L = LOCS[S.loc], st = storyHere();
  let story = '';
  if (st && st.at === 'hub') story += B(st.btn, () => runMain(st), { cls: 'story', icon: '★', sub: `Main story · recommended Lv ${st.lv}` });
  if (st && st.zone) { const z = L.zones.find(z => z.id === st.zone); story += B(`Head to ${z.n}`, () => enterZone(z), { cls: 'story', icon: '★', sub: st.obj }); }
  // recruitment
  if (S.loc === 'eldania' && S.flags.ryder_avail && !recruited('ryder')) story += B('The Dry Rag: a pilot in trouble', () => recruitScene('ryder'), { cls: 'story', icon: '+', sub: 'Someone could join your crew' });
  if (S.loc === 'eldania' && S.flags.celeste_avail && isDone('m4') && !recruited('celeste')) story += B('Clearbourn camp: a woman cornered', () => recruitScene('celeste'), { cls: 'story', icon: '+', sub: 'Someone could join your crew' });
  let crew = '';
  crewQuestsHere(S.loc).forEach(({ id, part, n }) => {
    const ok = inParty(id);
    crew += B(`${CREW[id].short}: ${part.n}`, () => runCrewQuest(id), { cls: 'crew', icon: n + 1, dis: !ok, sub: ok ? `${CREWQ[id].n} · part ${n + 1} of 3 · Lv ${part.lv}` : `${CREW[id].short} must be in the party` });
  });
  const chats = BANTER.filter(b => b.loc === S.loc && !S.banter[b.id] && b.need.every(id => id === 'julius' || inParty(id)));
  if (chats.length) crew += B(`Party Chat`, () => runBanter(chats[0]), { icon: '”', sub: `${chats.length} conversation${chats.length > 1 ? 's' : ''} · ${chats[0].n}` });
  let zones = '';
  L.zones.forEach(z => {
    const locked = z.req && !isDone(z.req);
    const d = z.depth ? (S.cleared[z.id] ? 'Cleared' : `${S.depth[z.id] || 0}/${z.depth} deep`) : 'Open area';
    zones += B(z.n, () => enterZone(z), { dis: locked, sub: locked ? 'Not yet reachable' : `Lv ${z.lv[0]}–${z.lv[1]} · ${d}` });
  });
  let town = '';
  town += B('Board the Last Hope', () => goShip(), { icon: '▲', sub: 'Rest, travel, cook, upgrade, swap crew' });
  town += B('Trade', () => shopSheet(L.hub), { icon: '¤', sub: 'Buy and sell' });
  if (L.hub.board && L.hub.board.length) {
    const open = L.hub.board.filter(b => !S.bounties[b]).length;
    town += B('Bounty Board', () => boardSheet(L.hub.board), { icon: '◎', sub: open ? `${open} open bount${open > 1 ? 'ies' : 'y'}` : 'All bounties claimed' });
  }
  town += B('Talk to the locals', () => talkSheet(L.hub), { icon: '…', sub: L.hub.desc.split('.')[0] + '.' });
  return sec('Story', story) + sec('Crew', crew) + sec('Explore', zones) + sec('Town', town);
}
async function recruitScene(id) {
  await playScene('rec_' + id);
  const b = id === 'ryder' ? [['lsfrecruiter', 7], ['lsftrooper', 7]] : [['acolyte', 7], ['acolyte', 7], ['acolyte', 7]];
  const r = await battle(b, { story: true });
  if (r !== 'win') return;
  await playScene('rec_' + id + '_post');
  save(); render();
}
async function runBanter(b) {
  S.banter[b.id] = 1;
  addLog(esc('Party Chat · ' + b.n), 'chapter small');
  await playScene(b.lines);
  save(); render();
}

/* ---------- ZONE ---------- */
function enterZone(z) { S.place = 'zone:' + z.id; if (!S.depth[z.id]) S.depth[z.id] = 0; sysLine(z.desc); save(); render(); }
function leaveZone() {
  const z = curZone();
  if (z && z.depth && !S.cleared[z.id] && (S.depth[z.id] || 0) > 0 && (S.depth[z.id] || 0) < z.depth) { S.depth[z.id] = 0; sysLine('You fall back to town. The way in will have to be found again.'); }
  S.place = 'hub'; save(); render();
}
function zoneActions(z) {
  const st = storyHere(), d = S.depth[z.id] || 0;
  if (z.depth && !S.cleared[z.id] && d >= z.depth && !(st && st.zone === z.id) && !(z.reward && !S.rewards[z.id]) && !(z.boss && !S.flags['boss_' + z.id])) S.cleared[z.id] = true;
  const dun = z.depth && !S.cleared[z.id];
  let story = '', main = '';
  if (st && st.zone === z.id && d >= z.depth) story += B(st.btn, () => runMain(st), { cls: 'story', icon: '★', sub: `Main story · recommended Lv ${st.lv}` });
  if (dun) {
    if (d < z.depth) main += B('Press deeper', () => explore(z), { cls: 'primary', icon: '▼', sub: `Progress ${d}/${z.depth} · danger rises` });
    else if (!(st && st.zone === z.id)) {
      if (z.boss && !S.flags['boss_' + z.id]) main += B(z.boss.btn, () => runZoneBoss(z), { cls: 'story', icon: '☠', sub: `Optional superboss · Lv ${z.boss.lv}` });
      if (z.reward && !S.rewards[z.id]) main += B('Search the depths', () => claimZone(z), { cls: 'story', icon: '◆', sub: 'Something is hidden here' });
    }
    main += `<div class="depth">${Array.from({ length: z.depth }, (_, i) => `<i class="${i < d ? 'on' : ''}"></i>`).join('')}</div>`;
  } else {
    main += B('Explore', () => explore(z), { cls: 'primary', icon: '◇', sub: 'Fight, scavenge, discover' });
    if (z.reward && !S.rewards[z.id]) main += B('Search the depths', () => claimZone(z), { cls: 'story', icon: '◆', sub: 'Something is hidden here' });
  }
  const crew = crewQuestsHere(S.loc).length ? '' : '';
  let back = B('Use an item', () => bagSheet(), { icon: '+', sub: 'Heal up before pressing on' });
  back += B(`Return to ${LOCS[S.loc].hub.n}`, () => leaveZone(), { icon: '◂', sub: dun && d > 0 && d < z.depth ? 'Leaving resets your progress here' : 'Back to town' });
  return sec('Story', story) + sec(z.n, main) + crew + sec('Options', back);
}
async function runZoneBoss(z) {
  if (busy) return; busy = true;
  try {
    await playScene(z.boss.pre);
    const r = await battle(z.boss.battle, { story: true, boss: true, lv: z.boss.lv });
    if (r !== 'win') return;
    S.flags['boss_' + z.id] = 1;
    await playScene(z.boss.post);
    save(); render();
  } finally { busy = false; }
}
async function claimZone(z) {
  S.rewards[z.id] = true; S.cleared[z.id] = true;
  addLog(esc(z.reward.text), 'nar');
  bagAdd(z.reward.item); S.cr += z.reward.cr;
  addLog(`Found <b>${esc(ITEMS[z.reward.item].n)}</b> and ${fmt(z.reward.cr)} credits.`, 'sys');
  save(); render();
}
const QUIET = ['Nothing but wind and the sound of your own boots.', 'You find tracks, old ones. Whatever made them is long gone.', 'A quiet stretch. Spectro would have liked it.', 'You stop to check your gear. Everything holds. For now.'];
function lootPool(lv) {
  if (lv < 6) return ['medgel', 'medgel', 'psicell', 'antitox', 'fraggren'];
  if (lv < 12) return ['medgel2', 'medgel', 'psicell', 'cryogren', 'shockmine', 'lazarus'];
  return ['medgel2', 'psicell2', 'trauma', 'lazarus', 'psibomb', 'shockmine'];
}
function findLoot(z) {
  const lv = ri(z.lv[0], z.lv[1]);
  let cr = Math.round(lv * ri(6, 12)); if (talent('miles')) cr = Math.round(cr * 1.3);
  const bits = [`${fmt(cr)} credits`]; S.cr += cr;
  if (rnd() < 0.45) { const n = ri(1, 3); S.scrap += n; bits.push(`${n} scrap`); }
  if (rnd() < 0.5) { const it = pick(lootPool(lv)); bagAdd(it); bits.push(ITEMS[it].n); }
  addLog(`${esc(pick(['A cache wedged in a crack.', 'An abandoned pack.', 'A dead drone with its cargo intact.', 'Something glints under the debris.']))} Found ${esc(bits.join(', '))}.`, 'sys loot');
}
async function runEvent(L) {
  const ev = pick(L.events);
  addLog(esc(ev.t), 'nar event');
  if (ev.codex && unlockCodex(ev.codex)) addLog(`Codex: ${esc(CODEX[ev.codex].n)}`, 'sys codex');
  let r = ev.r, battleNow = ev.battle;
  if (ev.choices) {
    const i = await choose(ev.choices.map(c => ({ l: c.l })));
    const c = ev.choices[i]; addLog(esc(c.res), 'nar'); r = c.r; battleNow = c.battle;
  }
  if (r) giveReward(r);
  return battleNow;
}
function giveReward(r) {
  const bits = [];
  if (r.cr) { S.cr = Math.max(0, S.cr + r.cr); bits.push(`${r.cr > 0 ? '+' : ''}${fmt(r.cr)} credits`); }
  if (r.item) { bagAdd(r.item, r.n || 1); bits.push(`${ITEMS[r.item].n}${(r.n || 1) > 1 ? ' ×' + r.n : ''}`); }
  if (r.item2) { bagAdd(r.item2); bits.push(ITEMS[r.item2].n); }
  if (r.scrap) { S.scrap += r.scrap; bits.push(`${r.scrap} scrap`); }
  if (r.xp) { const lines = []; S.party.forEach(id => lines.push(...gainXp(id, r.xp))); bits.push(`+${r.xp} XP`); lines.forEach(l => addLog(esc(l), 'sys lvl')); }
  if (bits.length) addLog(esc(bits.join(' · ')), 'sys loot');
}
let busy = false;
async function explore(z) {
  if (busy) return; busy = true;
  try {
    const L = LOCS[S.loc], dun = z.depth && !S.cleared[z.id];
    S.stats.steps++;
    const roll = rnd();
    let fight = false;
    if (dun) { if (roll < 0.62) fight = true; else if (roll < 0.85) findLoot(z); else fight = await runEvent(L); }
    else { if (roll < 0.55) fight = true; else if (roll < 0.75) findLoot(z); else if (roll < 0.9) fight = await runEvent(L); else sysLine(pick(QUIET)); }
    if (fight) { const r = await battle(zoneEnemies(z), {}); if (r === 'lose') return; }
    if (dun) {
      S.depth[z.id] = Math.min(z.depth, (S.depth[z.id] || 0) + 1);
      const d = S.depth[z.id], st = storyHere();
      if (st && st.zone === z.id && st.mid && d === Math.ceil(z.depth / 2) && !S.seen[st.id + '_mid']) { S.seen[st.id + '_mid'] = 1; await playScene(st.mid); }
      if (d >= z.depth) sysLine(st && st.zone === z.id ? 'You have reached the heart of this place.' : 'You have reached the deepest point.');
    }
    save(); render();
  } finally { busy = false; }
}
function zoneEnemies(z) {
  const n = 1 + (rnd() < 0.6 ? 1 : 0) + (rnd() < 0.28 ? 1 : 0), out = [];
  for (let i = 0; i < n; i++) out.push([pick(z.enemies), ri(z.lv[0], z.lv[1])]);
  return out;
}

/* ---------- STORY ---------- */
async function arriveAt(locId) {
  S.loc = locId; S.place = 'hub'; S.spectroReady = true;
  unlockCodex(locId);
  sysLine(`Arrived at ${LOCS[locId].n}. ${LOCS[locId].blurb}`);
  save(); render();
  await checkArrival();
}
async function checkArrival() {
  const st = curStep();
  if (!st || st.loc !== S.loc || !st.arrive || S.seen[st.id]) return;
  S.seen[st.id] = 1;
  await playScene(st.arrive);
  if (st.arriveBattle) {
    const r = await battle(st.arriveBattle, { story: true, lv: st.lv - 2 });
    if (r !== 'win') { S.seen[st.id] = 0; return; }
    if (st.arrivePost) await playScene(st.arrivePost);
  }
  save(); render();
  sysLine('Objective: ' + st.obj, 'obj');
}
async function runMain(st) {
  if (busy) return; busy = true;
  try {
    await playScene(st.pre);
    let r = await battle(st.battle, { story: true, boss: true, lv: st.lv });
    if (r !== 'win') return;
    if (st.phase) {
      await playScene(st.phase.scene);
      healAll(); addLog('Katey jams the last of her stims into everyone. The crew stands up again.', 'sys join');
      r = await battle(st.phase.battle, { story: true, boss: true, lv: st.lv, noFlee: true });
      if (r !== 'win') return;
    }
    S.done[st.id] = true; if (st.zone) S.cleared[st.zone] = true;
    await playScene(st.post);
    S.ms++;
    if (st.final) { await playScene('ending'); }
    save();
    if (st.force) { busy = false; await arriveAt(st.force); return; }
    render();
    const nx = curStep();
    if (nx) sysLine('Objective: ' + nx.obj, 'obj');
  } finally { busy = false; }
}
async function runCrewQuest(id) {
  if (busy) return; busy = true;
  try {
    const n = S.cq[id] || 0, part = CREWQ[id].parts[n];
    addLog(esc(`${CREWQ[id].n} · ${part.n}`), 'chapter small');
    await playScene(part.pre);
    const r = await battle(part.battle, { story: true, lv: part.lv });
    if (r !== 'win') return;
    await playScene(part.post);
    S.cq[id] = n + 1;
    if (S.cq[id] >= 3) addLog(`★ ${esc(CREW[id].short)}’s story is complete.`, 'sys join');
    save(); render();
  } finally { busy = false; }
}

/* ---------- SHIP ---------- */
function goShip() { S.place = 'ship'; save(); render(); }
function shipActions() {
  let h = '';
  const st = curStep();
  let story = '';
  if (st && st.loc && st.loc !== S.loc && locUnlocked(st.loc)) story += B(`Set course for ${LOCS[st.loc].n}`, () => travel(st.loc), { cls: 'story', icon: '★', sub: st.obj });
  let crew = '';
  crewQuestsHere('lasthope').forEach(({ id, part, n }) => {
    const ok = inParty(id);
    crew += B(`${CREW[id].short}: ${part.n}`, () => runCrewQuest(id), { cls: 'crew', icon: n + 1, dis: !ok, sub: ok ? `${CREWQ[id].n} · part ${n + 1} of 3 · Lv ${part.lv}` : `${CREW[id].short} must be in the party` });
  });
  const shipChat = BANTER.filter(b => b.always && b.loc === S.loc && !S.banter[b.id] && b.need.every(id => id === 'julius' || recruited(id)));
  if (shipChat.length) crew += B('Galley gossip', () => runBanter(shipChat[0]), { icon: '”', sub: shipChat[0].n });
  h += B('Galaxy Map', () => mapSheet(), { icon: '✦', sub: 'Travel to another system' });
  h += B('Crew Quarters', () => rest(), { icon: '☾', sub: 'Rest: full HP and MP, and save' });
  h += B('Galley', () => galleySheet(), { icon: '♨', sub: S.meal ? `Eating: ${MEALS[S.meal.id].n} (${S.meal.left} battles left)` : 'Julius cooks buffs for your next 3 battles' });
  h += B('Katey’s Workbench', () => benchSheet(), { icon: '⚙', sub: `Upgrade weapons with scrap · ${S.scrap} scrap` });
  h += B('Formation', () => formationSheet(), { icon: '⇄', sub: `Choose your party of four` });
  h += B('Spectro', () => spectro(), { icon: '◕', sub: S.spectroReady ? 'He has something for you' : 'Napping on the console' });
  h += B('Disembark', () => { S.place = 'hub'; save(); render(); }, { icon: '▼', sub: `Back to ${LOCS[S.loc].hub.n}` });
  return sec('Story', story) + sec('Crew', crew) + sec('The Last Hope', h);
}
function rest() {
  healAll(); save(); render();
  sysLine(pick(['You sleep like the dead. Julius bangs a pot at dawn.', 'KAT dims the lights. The hull ticks. You sleep.', 'Spectro curls up on your chest. Eight hours, no dreams.', 'You sleep. Somewhere aft, Katey is still building something.']) + ' Party fully restored. Game saved.');
}
function spectro() {
  if (!S.spectroReady) { sysLine('Spectro is asleep on the navigation console, one leg twitching. Best not to wake him.'); return; }
  S.spectroReady = false;
  const lv = partyLv(); const pool = lootPool(lv).concat(['jerky', 'psicell']);
  const it = pick(pool); bagAdd(it);
  const extra = rnd() < 0.3 ? ri(2, 5) : 0; S.scrap += extra;
  sysLine(`${pick(['Spectro drags something out from under a bunk and drops it at your feet, very proud.', 'Spectro has been busy. He presents you with a find and a beetle. You keep the find.', 'Spectro chitters and leads you to his stash behind the reactor.'])} You get ${ITEMS[it].n}${extra ? ` and ${extra} scrap` : ''}.`);
  save(); render();
}

/* ---------- TRAVEL ---------- */
function unlockedLocs() { return TRAVEL_ORDER.filter(locUnlocked); }
function mapSheet() {
  const un = unlockedLocs(), st = curStep();
  openSheet('Galaxy Map', `<canvas id="galaxy" class="galaxy"></canvas><div id="mapList"></div>`);
  requestAnimationFrame(() => ART.paintGalaxy($('#galaxy'), un, S.loc));
  let h = '';
  TRAVEL_ORDER.forEach(id => {
    const L = LOCS[id], on = un.includes(id), here = id === S.loc;
    const star = st && st.loc === id ? '★ ' : '';
    if (!on) { h += `<div class="locked">Uncharted</div>`; return; }
    h += B(`${star}${L.n}`, () => { closeSheet(); travel(id); }, { dis: here, sub: here ? 'You are here' : `${L.region} · Lv ${L.lv}`, cls: star ? 'story' : '' });
  });
  mount($('#mapList'), h);
}
async function travel(id) {
  if (busy || id === S.loc) return; busy = true;
  try {
    S.place = 'ship'; render();
    sysLine(`The Last Hope jumps for ${LOCS[id].n}.`);
    const chance = talent('ryder') ? 0.08 : 0.26;
    if (chapter() >= 2 && rnd() < chance) {
      addLog(esc(pick(['Proximity alarms. A ship with no transponder drops out of hyperspace beside you and fires grapples.', 'Something chews through the hull plating mid-jump. Void mites.', 'A black-hulled cutter matches your speed. Boarders!'])), 'nar event');
      const lv = Math.max(4, partyLv());
      const r = await battle([['boarder', lv], [pick(['voidmite', 'boarder']), lv]], {});
      if (r === 'lose') return;
    } else if (talent('ryder') && chapter() >= 2 && rnd() < 0.3) {
      sysLine('Ryder spots a pirate picket and threads you around it without slowing down.');
    }
    busy = false;
    await arriveAt(id);
    S.place = 'hub'; render();
  } finally { busy = false; }
}

/* ---------- SHEETS (menus) ---------- */
function openSheet(title, html) {
  $('#sheetTitle').textContent = title; $('#sheetBody').innerHTML = html;
  $('#sheet').classList.add('on'); $('#sheetBody').scrollTop = 0;
}
function closeSheet() { $('#sheet').classList.remove('on'); if (S && $('#scr-game').classList.contains('on')) render(); }
function sheetMount(html) { mount($('#sheetBody'), html); }

function talkSheet(hub) {
  openSheet(hub.n, `<p class="muted">${esc(hub.desc)}</p><div id="talk"></div>`);
  mount($('#talk'), hub.npcs.map(n => B(n.n, () => { closeSheet(); addLog(`<span class="sp" style="--sc:#c8442e">${esc(n.n)}</span>${esc(pick(n.lines))}`, 'say'); })).join(''));
}
function boardSheet(ids) {
  openSheet('Bounty Board', '<div id="bb"></div>');
  mount($('#bb'), ids.map(id => {
    const b = BOUNTIES[id], done = S.bounties[id];
    return `<div class="card"><h3>${esc(b.n)} <span class="tag">Lv ${b.lv}</span></h3><p>${esc(b.desc)}</p><p class="muted">Reward: ${fmt(b.cr)} cr + ${esc(ITEMS[b.item].n)}</p>${done ? '<p class="done">CLAIMED</p>' : B('Hunt it down', () => { closeSheet(); runBounty(id); }, { cls: 'primary' })}</div>`;
  }).join(''));
}
async function runBounty(id) {
  if (busy) return; busy = true;
  try {
    const b = BOUNTIES[id];
    addLog(esc(`Bounty · ${b.n}`), 'chapter small');
    addLog(esc(b.desc + ' You track it down.'), 'nar');
    const r = await battle(b.battle, { lv: b.lv, elite: true, noFlee: false });
    if (r !== 'win') return;
    S.bounties[id] = true; S.cr += b.cr; bagAdd(b.item);
    addLog(`Bounty claimed: ${fmt(b.cr)} credits and <b>${esc(ITEMS[b.item].n)}</b>.`, 'sys join');
    save(); render();
  } finally { busy = false; }
}
function itemSummary(it) {
  if (it.k === 'weapon') { const up = S.upgrades[Object.keys(ITEMS).find(k => ITEMS[k] === it)] || 0; return `${it.cat} · ATK ${it.atk + up * 3 * (it.upMult || 1)}${it.int ? ` · TEC +${it.int}` : ''} ${chip(it.ty)}`; }
  if (it.k === 'armor') return `armor · ARM ${it.arm}${Object.entries(it.bon || {}).map(([k, v]) => ` · ${k.toUpperCase()} +${v}`).join('')}`;
  if (it.k === 'acc') return 'accessory · ' + Object.entries(it.bon).map(([k, v]) => k === 'resist' ? `resist ${v}` : k === 'regen' ? `regen ${v * 100}%` : `${k.toUpperCase()} +${v}`).join(' · ');
  return it.d || it.desc || '';
}
function whoCanUse(it) {
  if (it.k !== 'weapon') return '';
  const w = CREW_ORDER.filter(id => CLASSES[CREW[id].cls].wt.includes(it.cat)).map(id => CREW[id].short);
  return `<span class="muted">For: ${w.join(', ')}</span>`;
}
function shopSheet(hub, tab) {
  tab = tab || 'buy';
  openSheet(`Trade · ${hub.n}`, `<div class="tabs" id="shTabs"></div><p class="muted">You have ${fmt(S.cr)} credits.</p><div id="shList"></div>`);
  mount($('#shTabs'), B('Buy', () => shopSheet(hub, 'buy'), { cls: tab === 'buy' ? 'on' : '' }) + B('Sell', () => shopSheet(hub, 'sell'), { cls: tab === 'sell' ? 'on' : '' }));
  let h = '';
  if (tab === 'buy') {
    hub.shop.forEach(id => {
      const it = ITEMS[id];
      h += `<div class="row-item"><div><b>${esc(it.n)}</b><span class="own">${S.bag[id] ? '×' + S.bag[id] : ''}</span><div class="muted small">${itemSummary(it)} ${whoCanUse(it)}</div></div>${B(`${fmt(it.price)}`, () => { if (S.cr < it.price) return; S.cr -= it.price; bagAdd(id); save(); shopSheet(hub, 'buy'); }, { dis: S.cr < it.price, cls: 'small' })}</div>`;
    });
  } else {
    const mult = talent('miles') ? 0.625 : 0.5;
    Object.entries(S.bag).forEach(([id, n]) => {
      const it = ITEMS[id]; if (!it || it.k === 'key' || it.unique) return;
      const price = Math.max(1, Math.floor((it.price || 10) * mult));
      h += `<div class="row-item"><div><b>${esc(it.n)}</b><span class="own">×${n}</span><div class="muted small">${itemSummary(it)}</div></div>${B(`+${fmt(price)}`, () => { S.cr += price; bagAdd(id, -1); save(); shopSheet(hub, 'sell'); }, { cls: 'small' })}</div>`;
    });
    if (S.scrap > 0) h += `<div class="row-item"><div><b>Scrap</b><span class="own">×${S.scrap}</span><div class="muted small">Katey would rather you kept it.</div></div>${B('+15', () => { S.scrap--; S.cr += 15; save(); shopSheet(hub, 'sell'); }, { cls: 'small' })}</div>`;
    if (!h) h = '<p class="muted">Nothing to sell.</p>';
    if (talent('miles')) h = '<p class="muted small">Miles is haggling: +25% on everything.</p>' + h;
  }
  mount($('#shList'), h);
}
function galleySheet() {
  let h = '<p class="muted">Julius Spence, chef. Hates the Borrubari. Feeds everyone anyway.</p>';
  const q = JULIUS_Q.find(q => !S.jq[q.id] && isDone(q.req));
  if (q) {
    const have = S.bag[q.need] || 0;
    h += `<div class="card"><h3>Favor: ${esc(q.n)}</h3><p>${esc(q.ask.split('|')[1])}</p><p class="muted">Bring ${q.qty} × ${esc(ITEMS[q.need].n)} · you have ${have}</p>${B('Hand them over', () => {
      bagAdd(q.need, -q.qty); S.jq[q.id] = 1; S.cr += q.reward; closeSheet();
      addLog(`<span class="sp" style="--sc:#b06a2a">Julius</span>${esc(q.done.split('|')[1])}`, 'say');
      addLog(`New recipe: <b>${esc(MEALS[q.meal].n)}</b>. +${fmt(q.reward)} credits.`, 'sys join'); save(); render();
    }, { dis: have < q.qty, cls: 'primary' })}</div>`;
  }
  h += '<h4 class="sh4">Menu</h4>';
  Object.entries(MEALS).forEach(([id, m]) => {
    if (m.unlock && !S.jq[m.unlock]) return;
    h += `<div class="row-item"><div><b>${esc(m.n)}</b><div class="muted small">${esc(m.d)} Lasts 3 battles.</div></div>${B(fmt(m.cost), () => { S.cr -= m.cost; S.meal = { id, left: 3 }; closeSheet(); sysLine(`Julius slams down ${m.n}. The crew eats.`); save(); render(); }, { dis: S.cr < m.cost, cls: 'small' })}</div>`;
  });
  openSheet('Galley', '<div id="gal"></div>'); mount($('#gal'), h);
}
function upCost(id) { const it = ITEMS[id], n = S.upgrades[id] || 0; return { scrap: 3 + n * 3, cr: Math.round(90 * (n + 1) * (n + 1) * Math.sqrt(it.tier || 1)) }; }
function benchSheet() {
  const owned = new Set(Object.keys(S.bag).filter(id => ITEMS[id] && ITEMS[id].k === 'weapon'));
  Object.keys(S.crew).forEach(id => owned.add(S.crew[id].eq.weapon));
  let h = `<p class="muted">Katey can upgrade any weapon you own, up to +5. Every copy benefits. You have ${S.scrap} scrap and ${fmt(S.cr)} credits.</p>`;
  [...owned].forEach(id => {
    const it = ITEMS[id], n = S.upgrades[id] || 0, c = upCost(id);
    const users = Object.keys(S.crew).filter(m => S.crew[m].eq.weapon === id).map(m => CREW[m].short).join(', ');
    h += `<div class="row-item"><div><b>${esc(it.n)} ${n ? '+' + n : ''}</b><div class="muted small">${itemSummary(it)}${users ? ` · equipped: ${users}` : ''}${it.upMult ? ' · upgrades twice as well' : ''}</div></div>${n >= 5 ? '<span class="tag">MAX</span>' : B(`${c.scrap} scrap · ${fmt(c.cr)}`, () => {
      S.scrap -= c.scrap; S.cr -= c.cr; S.upgrades[id] = n + 1; save(); benchSheet();
    }, { dis: S.scrap < c.scrap || S.cr < c.cr, cls: 'small' })}</div>`;
  });
  openSheet('Katey’s Workbench', '<div id="bench"></div>'); mount($('#bench'), h);
}
function formationSheet() {
  const all = CREW_ORDER.filter(recruited);
  let h = `<p class="muted">Up to four crew fight. ${esc(CREW[S.hero].short)} always leads. Crew on the ship earn half XP.</p>`;
  all.forEach(id => {
    const on = inParty(id), c = S.crew[id];
    h += B(`${CREW[id].n}`, () => {
      if (id === S.hero) return;
      if (on) S.party = S.party.filter(x => x !== id);
      else if (S.party.length < 4) S.party.push(id);
      save(); formationSheet(); renderPartyStrip();
    }, { cls: on ? 'on' : '', sub: `${CLASSES[CREW[id].cls].n} · Lv ${c.lv}${id === S.hero ? ' · leader' : on ? ' · in party' : ' · on the ship'}`, right: on ? '✓' : '' });
  });
  openSheet('Formation', '<div id="form"></div>'); mount($('#form'), h);
}

/* ---------- nav menus ---------- */
function partySheet(sel) {
  const ids = CREW_ORDER.filter(recruited);
  sel = sel || ids[0];
  let h = `<div class="tabs scroll">${ids.map(id => B(CREW[id].short, () => partySheet(id), { cls: id === sel ? 'on' : '' })).join('')}</div>`;
  const c = S.crew[sel], cs = charStats(sel), cr = CREW[sel], cl = CLASSES[cr.cls];
  h += `<div class="pcard" style="--hc:${cr.col}"><div class="hc-top"><div class="badge">${cr.glyph}</div><div><h3>${esc(cr.n)}</h3><p class="hc-cls">${esc(cl.n)} · Lv ${c.lv} · ${inParty(sel) ? 'In party' : 'On the ship'}</p></div></div>
  <div class="xpbar"><i style="width:${c.lv >= 40 ? 100 : c.xp / xpNeed(c.lv) * 100}%"></i><span>XP ${fmt(c.xp)} / ${fmt(xpNeed(c.lv))}</span></div>
  <div class="stats">
    <span><b>HP</b>${fmt(c.hp)}/${fmt(cs.mhp)}</span><span><b>MP</b>${fmt(c.mp)}/${fmt(cs.mmp)}</span>
    <span><b>ATK</b>${cs.atk}</span><span><b>TEC</b>${cs.tec}</span>
    <span><b>STR</b>${cs.str}</span><span><b>DEX</b>${cs.dex}</span><span><b>SPD</b>${cs.spd}</span><span><b>INT</b>${cs.int}</span>
    <span><b>END</b>${cs.end}</span><span><b>ARM</b>${cs.arm}</span><span><b>CRIT</b>${cs.crit}%</span><span><b>EVA</b>${cs.eva}%</span>
  </div>
  <p class="hc-talent"><b>${esc(cr.talent.n)}</b> ${esc(cr.talent.d)}</p>
  <h4 class="sh4">Equipment</h4><div id="eqSlots"></div>
  <h4 class="sh4">Skills</h4>
  <div class="skl">${CLASS_SKILLS[cr.cls].map(([s, l]) => { const k = SKILLS[s], on = c.lv >= l; return `<div class="${on ? '' : 'lock'}"><b>${esc(k.n)}</b> ${k.ty ? chip(k.ty) : ''}<span class="tag">${on ? k.mp + ' MP' : 'Lv ' + l}</span><p class="small muted">${esc(k.d)}</p></div>`; }).join('')}
  ${(() => { const u = SKILLS[ULTIMATES[sel]]; return `<div class="${S.ult[sel] ? 'ult' : 'lock'}"><b>${esc(u.n)}</b> ${u.ty ? chip(u.ty) : ''}<span class="tag">${S.ult[sel] ? u.mp + ' MP' : 'Crew story'}</span><p class="small muted">${esc(u.d)}</p></div>`; })()}</div>
  <h4 class="sh4">Crew story · ${esc(CREWQ[sel].n)}</h4><p class="small muted">${(S.cq[sel] || 0) >= 3 ? 'Complete.' : `Part ${(S.cq[sel] || 0) + 1}: ${esc(CREWQ[sel].parts[S.cq[sel] || 0].n)} · ${esc(LOCS[CREWQ[sel].parts[S.cq[sel] || 0].loc].n)} · Lv ${CREWQ[sel].parts[S.cq[sel] || 0].lv}`}</p>
  <p class="small muted bio">${esc(cr.blurb)}</p></div>`;
  openSheet('Crew', '');
  sheetMount(h);
  const slot = (k, label) => {
    const id = c.eq[k], it = id ? ITEMS[id] : null;
    return B(`${label}: ${it ? esc(it.n) + (S.upgrades[id] ? ' +' + S.upgrades[id] : '') : '— none —'}`, () => equipSheet(sel, k), { sub: it ? itemSummary(it) : 'Tap to equip', cls: 'eq' });
  };
  mount($('#eqSlots'), slot('weapon', 'Weapon') + slot('armor', 'Armor') + slot('acc', 'Accessory'));
}
function equipSheet(id, slot) {
  const cl = CLASSES[CREW[id].cls], cur = S.crew[id].eq[slot];
  const opts = Object.keys(S.bag).filter(k => {
    const it = ITEMS[k]; if (!it) return false;
    if (slot === 'weapon') return it.k === 'weapon' && cl.wt.includes(it.cat);
    if (slot === 'armor') return it.k === 'armor';
    return it.k === 'acc';
  });
  const before = charStats(id);
  let h = `<p class="muted">${esc(CREW[id].short)} · ${slot}. Currently: ${cur ? esc(ITEMS[cur].n) : 'nothing'}.</p>`;
  opts.forEach(k => {
    const saveEq = S.crew[id].eq[slot]; S.crew[id].eq[slot] = k; const after = charStats(id); S.crew[id].eq[slot] = saveEq;
    const diffs = ['atk', 'tec', 'arm', 'spd', 'dex', 'str', 'int'].map(s => { const d = after[s] - before[s]; return d ? `<span class="${d > 0 ? 'up' : 'dn'}">${s.toUpperCase()} ${d > 0 ? '+' : ''}${d}</span>` : ''; }).join(' ');
    h += B(ITEMS[k].n + (S.upgrades[k] ? ' +' + S.upgrades[k] : ''), () => {
      const old = S.crew[id].eq[slot]; S.crew[id].eq[slot] = k; bagAdd(k, -1); if (old) bagAdd(old, 1);
      const cs = charStats(id); S.crew[id].hp = Math.min(S.crew[id].hp, cs.mhp); S.crew[id].mp = Math.min(S.crew[id].mp, cs.mmp);
      save(); partySheet(id);
    }, { sub: `${itemSummary(ITEMS[k])} ${diffs}`, right: '×' + S.bag[k] });
  });
  if (!opts.length) h += '<p class="muted">Nothing in the bag fits this slot.</p>';
  if (slot !== 'weapon' && cur) h += B('Unequip', () => { bagAdd(cur, 1); S.crew[id].eq[slot] = null; const cs = charStats(id); S.crew[id].hp = Math.min(S.crew[id].hp, cs.mhp); save(); partySheet(id); });
  h += B('Back', () => partySheet(id), { cls: 'ghost' });
  openSheet('Equip', ''); sheetMount(h);
}
function bagSheet(tab) {
  tab = tab || 'use';
  const groups = { use: ['use'], gear: ['weapon', 'armor', 'acc'], other: ['mat', 'key'] };
  let h = `<div class="tabs">${B('Usable', () => bagSheet('use'), { cls: tab === 'use' ? 'on' : '' })}${B('Gear', () => bagSheet('gear'), { cls: tab === 'gear' ? 'on' : '' })}${B('Materials', () => bagSheet('other'), { cls: tab === 'other' ? 'on' : '' })}</div>`;
  h += `<p class="muted small">${fmt(S.cr)} credits · ${S.scrap} scrap</p>`;
  const list = Object.entries(S.bag).filter(([id]) => ITEMS[id] && groups[tab].includes(ITEMS[id].k));
  if (!list.length) h += '<p class="muted">Empty.</p>';
  list.forEach(([id, n]) => {
    const it = ITEMS[id];
    const usable = it.k === 'use' && (it.heal || it.mp || it.revive || it.cleanse);
    h += `<div class="row-item"><div><b>${esc(it.n)}</b><span class="own">×${n}</span><div class="muted small">${itemSummary(it)} ${whoCanUse(it)}</div></div>${usable ? B('Use', () => useOutside(id), { cls: 'small' }) : ''}</div>`;
  });
  openSheet('Bag', ''); sheetMount(h);
}
function useOutside(itemId) {
  const it = ITEMS[itemId];
  let h = `<p class="muted">Use ${esc(it.n)} on whom?</p>`;
  const targets = it.t === 'allAllies' ? ['__all'] : CREW_ORDER.filter(recruited);
  targets.forEach(id => {
    if (id === '__all') { h += B('Whole party', () => { applyItemOutside(itemId, S.party); }); return; }
    const c = S.crew[id], cs = charStats(id), dead = c.hp <= 0;
    if (it.revive && !dead) return; if (!it.revive && dead) return;
    h += B(CREW[id].short, () => applyItemOutside(itemId, [id]), { sub: `HP ${fmt(c.hp)}/${fmt(cs.mhp)} · MP ${fmt(c.mp)}/${fmt(cs.mmp)}` });
  });
  h += B('Back', () => bagSheet('use'), { cls: 'ghost' });
  openSheet('Use Item', ''); sheetMount(h);
}
function applyItemOutside(itemId, ids) {
  const it = ITEMS[itemId];
  ids.forEach(id => {
    const c = S.crew[id], cs = charStats(id);
    if (it.revive) c.hp = Math.round(cs.mhp * it.revive);
    if (it.heal) c.hp = Math.min(cs.mhp, c.hp + it.heal);
    if (it.mp) c.mp = Math.min(cs.mmp, c.mp + it.mp);
    if (it.cleanse) c.status = {};
  });
  bagAdd(itemId, -1); save(); renderPartyStrip(); bagSheet('use');
}
function questSheet() {
  const st = curStep();
  let h = '<h4 class="sh4">Main Story</h4>';
  h += st ? `<div class="card story"><h3>${st.ch >= 7 ? 'Epilogue' : 'Chapter ' + st.ch}</h3><p>${esc(st.obj)}</p>${st.loc ? `<p class="muted">Location: ${esc(LOCS[st.loc].n)}${st.lv ? ' · recommended Lv ' + st.lv : ''}</p>` : ''}</div>` : '<div class="card"><p>Prologue.</p></div>';
  h += '<h4 class="sh4">Crew Stories</h4>';
  CREW_ORDER.filter(recruited).forEach(id => {
    const n = S.cq[id] || 0, q = CREWQ[id];
    if (n >= 3) { h += `<div class="row-item"><div><b>${esc(CREW[id].short)} · ${esc(q.n)}</b><div class="muted small">Complete. Ultimate skill unlocked.</div></div><span class="tag">3/3</span></div>`; return; }
    const p = q.parts[n], ready = isDone(p.req);
    h += `<div class="row-item"><div><b>${esc(CREW[id].short)} · ${esc(q.n)}</b><div class="muted small">Part ${n + 1}: ${esc(p.n)} · ${esc(LOCS[p.loc].n)} · Lv ${p.lv}${ready ? (inParty(id) ? '' : ' · needs ' + esc(CREW[id].short) + ' in party') : ' · later in the story'}</div></div><span class="tag">${n}/3</span></div>`;
  });
  const locked = CREW_ORDER.filter(id => !recruited(id));
  if (locked.length) h += `<p class="muted small">${locked.length} crew member${locked.length > 1 ? 's' : ''} not yet met.</p>`;
  h += '<h4 class="sh4">Bounties</h4>';
  const bs = Object.entries(BOUNTIES).filter(([, b]) => locUnlocked(b.loc));
  bs.forEach(([id, b]) => { h += `<div class="row-item"><div><b>${esc(b.n)}</b><div class="muted small">${esc(LOCS[b.loc].n)} · Lv ${b.lv} · ${fmt(b.cr)} cr</div></div><span class="tag">${S.bounties[id] ? 'DONE' : 'OPEN'}</span></div>`; });
  h += '<h4 class="sh4">Julius’s Favors</h4>';
  JULIUS_Q.forEach(q => { if (!isDone(q.req) && !S.jq[q.id]) return; h += `<div class="row-item"><div><b>${esc(q.n)}</b><div class="muted small">${q.qty} × ${esc(ITEMS[q.need].n)} · have ${S.bag[q.need] || 0}</div></div><span class="tag">${S.jq[q.id] ? 'DONE' : 'OPEN'}</span></div>`; });
  openSheet('Quests', h);
}
function codexSheet(sel) {
  const cats = ['Factions', 'People', 'Places', 'Lore'];
  let h = '';
  if (sel) { const c = CODEX[sel]; h = `<div class="card codex"><h3>${esc(c.n)}</h3><p>${esc(c.t)}</p></div>`; openSheet('Codex', h + '<div id="cxb"></div>'); mount($('#cxb'), B('Back', () => codexSheet(), { cls: 'ghost' })); return; }
  const got = Object.keys(S.codex).length, tot = Object.keys(CODEX).length;
  h += `<p class="muted small">${got} of ${tot} entries discovered.</p>`;
  cats.forEach(cat => {
    const es = Object.entries(CODEX).filter(([, c]) => c.cat === cat);
    h += `<h4 class="sh4">${cat}</h4>` + es.map(([id, c]) => S.codex[id] ? B(c.n, () => codexSheet(id), { cls: 'small' }) : `<div class="locked">???</div>`).join('');
  });
  openSheet('Codex', ''); sheetMount(h);
}
function systemSheet() {
  let h = `<div class="card"><p><b>${esc(CREW[S.hero].n)}</b>’s journey · ${S.stats.wins} battles won · ${Object.keys(S.codex).length} codex entries</p></div>`;
  h += B('Save now', () => { save(); closeSheet(); sysLine('Game saved.'); }, { sub: 'The game also saves automatically' });
  h += B(`Battle speed: ${OPT.speed >= 2 ? 'Fast' : 'Normal'}`, () => { OPT.speed = OPT.speed >= 2 ? 1 : 2.2; saveOpts(); systemSheet(); });
  h += B('Export save code', () => {
    openSheet('Export Save', `<p class="muted">Copy this code to move your game to another device or keep a backup.</p><textarea class="ta" rows="7" readonly id="expText">${exportCode()}</textarea><div id="expB"></div><p class="muted small" id="expMsg"></p>`);
    mount($('#expB'), B('Copy to clipboard', async () => { try { await navigator.clipboard.writeText($('#expText').value); $('#expMsg').textContent = 'Copied.'; } catch (e) { $('#expText').select(); $('#expMsg').textContent = 'Select the text and copy it manually.'; } }, { cls: 'primary' }));
  }, { sub: 'Back up or move your game' });
  h += B('Import save code', () => importDialog());
  h += B('Title screen', () => { save(); closeSheet(); titleScreen(); });
  h += B('Start a new game', async () => { if (await confirmBox('This erases your current save.', 'Erase and restart')) { try { localStorage.removeItem(SAVE_KEY); } catch (e) {} S = null; selectScreen(); } }, { cls: 'danger' });
  openSheet('System', ''); sheetMount(h);
}

/* ============================================================
   BATTLE
   ============================================================ */
let BT = null;
const BOOSTM = [1, 1.6, 2.2, 2.8];
function knownWeak(defId) { return S.known[defId] || (S.known[defId] = []); }
function reveal(defId, ty) { const k = knownWeak(defId); if (!k.includes(ty)) k.push(ty); }

async function battle(list, opts) {
  opts = opts || {};
  const snap = JSON.stringify(S);
  for (;;) {
    const res = await runBattle(list, opts);
    if (res === 'lose') {
      const c = await defeatScreen();
      S = JSON.parse(snap);
      if (c === 'retry') { continue; }
      S.cr = Math.floor(S.cr * 0.9); healAll();
      if (S.ms < 0) { continue; }
      const z = curZone(); if (z && z.depth && !S.cleared[z.id]) S.depth[z.id] = 0;
      S.place = 'ship'; save(); show('scr-game'); render();
      sysLine('You wake up in the Last Hope’s medbay. Katey patched everyone up. Somebody had to pay for the medgel: you lost 10% of your credits.');
      return 'lose';
    }
    return res;
  }
}
function mkEnemy(entry, opts, idx) {
  const [id, lvO] = Array.isArray(entry) ? entry : [entry, null];
  const def = ENEMIES[id];
  let lv = lvO || def.lv;
  if (opts.lv && !lvO) lv = def.boss ? Math.max(def.lv, opts.lv - 1) : Math.max(def.lv, opts.lv - 1);
  const s = enemyStats(def, lv);
  return { side: 'e', uid: 'e' + idx, id, def, n: def.n, ...s, mhp: s.hp, sh: def.sh, msh: def.sh, broken: 0, acted: false, status: {}, buffs: {}, dead: false, acts: def.acts || 1 };
}
function mkMember(id) {
  const cs = charStats(id), c = S.crew[id];
  return { side: 'p', id, uid: 'p' + id, n: CREW[id].short, ...cs, hp: c.hp, mp: c.mp, bp: 1, boostedThisRound: false, status: Object.assign({}, c.status || {}), buffs: {}, dead: c.hp <= 0, defending: false };
}
function mod(u, stat) {
  let m = 1;
  if (u.buffs[stat]) m *= u.buffs[stat].m;
  if (u.side === 'p' && S.meal && MEALS[S.meal.id].buff[stat]) m *= MEALS[S.meal.id].buff[stat];
  return m;
}
function addBuff(u, stat, m, turns) {
  if (stat === 'eva' || stat === 'crit' || stat === 'taunt') u.buffs[stat] = { m, turns };
  else u.buffs[stat] = { m, turns };
}

async function runBattle(list, opts) {
  const enemies = list.map((e, i) => mkEnemy(e, opts, i));
  const counts = {}; enemies.forEach(e => counts[e.n] = (counts[e.n] || 0) + 1);
  const seenN = {}; enemies.forEach(e => { if (counts[e.n] > 1) { seenN[e.n] = (seenN[e.n] || 0) + 1; e.n += ' ' + 'ABCD'[seenN[e.n] - 1]; } });
  BT = { enemies, party: S.party.map(mkMember), round: 0, log: [], opts, over: null, targeting: null, cmd: null, active: null };
  S.stats.battles++;
  show('scr-battle');
  const art = placeArt();
  requestAnimationFrame(() => { ART.paint($('#bArt'), art); renderBattle(true); });
  // talents
  if (talent('kat')) enemies.forEach(e => { const un = e.def.weak.filter(w => !knownWeak(e.id).includes(w)); if (un.length) reveal(e.id, pick(un)); });
  let first = null;
  const pre = talent('celeste') ? 0.25 : 0.1, amb = talent('jaxon') || opts.story || opts.elite ? 0 : 0.1;
  if (!opts.story && rnd() < pre) { first = 'p'; blog('Preemptive strike! Your crew moves first.'); }
  else if (rnd() < amb) { first = 'e'; blog('Ambush! The enemy strikes first.'); }
  else blog(enemies.length > 1 ? `${enemies.length} enemies appear!` : `${enemies[0].n} appears!`);
  if (opts.tutorial) blog('Hit enemy weaknesses to break their shields. Broken enemies lose turns and take extra damage. Spend BP to boost.');
  await sleep(500);
  for (;;) {
    BT.round++;
    const actors = [];
    BT.party.forEach(m => { if (!m.dead) actors.push({ u: m, sp: m.spd * mod(m, 'spd') * (0.9 + rnd() * 0.2) }); });
    BT.enemies.forEach(e => { if (!e.dead) for (let i = 0; i < e.acts; i++) actors.push({ u: e, sp: e.spd * mod(e, 'spd') * (0.9 + rnd() * 0.2) - i * 6 }); });
    actors.sort((a, b) => b.sp - a.sp);
    if (BT.round === 1 && first) actors.sort((a, b) => (a.u.side === first ? 0 : 1) - (b.u.side === first ? 0 : 1));
    for (const a of actors) {
      const u = a.u;
      if (u.dead) continue;
      if (BT.over) break;
      await startTurn(u);
      if (u.dead) { if (checkEnd()) break; continue; }
      if (u.side === 'p') {
        if (u.status.stun) { delete u.status.stun; blog(`${u.n} is stunned and can't act.`); renderBattle(); await sleep(450); }
        else { u.defending = false; await playerTurn(u); }
      } else {
        if (u.broken > 0) { blog(`${u.n} is broken and can't move.`); renderBattle(); await sleep(350); }
        else if (u.status.stun) { delete u.status.stun; blog(`${u.n} is stunned.`); await sleep(350); }
        else await enemyTurn(u);
        u.acted = true;
      }
      if (checkEnd()) break;
    }
    if (BT.over) break;
    endRound();
  }
  return await finishBattle();
}
function checkEnd() {
  if (BT.over) return true;
  if (BT.enemies.every(e => e.dead)) BT.over = 'win';
  else if (BT.party.every(m => m.dead)) BT.over = 'lose';
  return !!BT.over;
}
async function startTurn(u) {
  const mhp = u.mhp;
  for (const k of ['burn', 'toxin']) {
    if (u.status[k] && !u.dead) {
      const d = Math.max(1, Math.round(mhp * (k === 'burn' ? 0.05 : 0.06) * (u.side === 'e' && u.def.boss ? 0.4 : 1)));
      hurt(u, d); blog(`${u.n} takes ${d} ${k === 'burn' ? 'burn' : 'toxin'} damage.`); popup(u, d, 'dot');
      if (--u.status[k] <= 0) delete u.status[k];
      renderBattle(); await sleep(300);
    }
  }
  if (u.side === 'p' && !u.dead) {
    let regen = u.regen || 0; if (u.status.regen) { regen += 0.08; if (--u.status.regen <= 0) delete u.status.regen; }
    if (regen) { const h = Math.round(u.mhp * regen); u.hp = Math.min(u.mhp, u.hp + h); popup(u, h, 'heal'); }
    if (u.mpRegen) u.mp = Math.min(u.mmp, u.mp + u.mpRegen);
  }
}
function endRound() {
  const tick = u => { for (const k in u.buffs) { if (--u.buffs[k].turns <= 0) delete u.buffs[k]; } };
  BT.party.forEach(m => { tick(m); if (!m.dead) { if (!m.boostedThisRound) m.bp = Math.min(5, m.bp + 1); m.boostedThisRound = false; } });
  BT.enemies.forEach(e => {
    tick(e); e.acted = false;
    if (e.broken > 0) { e.broken--; if (e.broken === 0 && !e.dead) { e.sh = e.msh; blog(`${e.n} recovers. Shields restored.`); } }
  });
  renderBattle();
}
function hurt(u, d) { u.hp = Math.max(0, u.hp - d); if (u.hp <= 0) { u.dead = true; u.status = {}; u.buffs = {}; if (u.side === 'e') blog(`${u.n} is defeated!`); else blog(`${u.n} is down!`); } }
function blog(t) { BT.log.push(t); if (BT.log.length > 40) BT.log.shift(); const el = $('#bLog'); if (el) { el.innerHTML = BT.log.slice(-4).map((l, i, a) => `<p class="${i === a.length - 1 ? 'new' : ''}">${esc(l)}</p>`).join(''); } }
function popup(u, val, kind) {
  const el = document.querySelector(`[data-uid="${u.uid}"]`); if (!el) return;
  const p = document.createElement('span'); p.className = 'pop ' + (kind || '');
  p.textContent = kind === 'heal' ? '+' + val : kind === 'miss' ? 'MISS' : val; el.appendChild(p);
  if (kind !== 'heal' && kind !== 'miss') { el.classList.remove('hit'); void el.offsetWidth; el.classList.add('hit'); }
  setTimeout(() => p.remove(), 1100);
}
function banner(text, col) {
  const b = $('#bBanner'); b.textContent = text; b.style.setProperty('--bc', col || '#f2a33a');
  b.classList.remove('on'); void b.offsetWidth; b.classList.add('on');
}

/* damage */
function dealDamage(att, tgt, o) {
  // o: {kind:'phys'|'tech', ty, p, pierce, critBonus, flat}
  if (tgt.dead) return null;
  const isP = att && att.side === 'p';
  // evasion (physical only)
  if (o.kind === 'phys' && !o.flat) {
    const eva = tgt.side === 'p' ? (tgt.eva + (tgt.buffs.eva ? tgt.buffs.eva.m : 0)) : (tgt.buffs.eva ? tgt.buffs.eva.m : 3);
    if (rnd() * 100 < eva) { popup(tgt, 0, 'miss'); return { miss: true, dmg: 0 }; }
  }
  let base, def;
  if (o.flat) { base = o.flat; def = 0; }
  else if (o.kind === 'phys') {
    base = (isP ? att.atk : att.atk) * o.p * mod(att, 'atk');
    def = o.pierce ? 0 : tgt.arm * 0.5 * mod(tgt, 'arm');
  } else {
    base = (isP ? att.tec * 1.1 : att.int * 1.15) * o.p * mod(att, 'atk');
    def = tgt.side === 'e' ? tgt.int * 0.25 + tgt.arm * 0.2 : tgt.res;
  }
  let dmg = Math.max(1, base * (0.92 + rnd() * 0.16) - def);
  if (o.kind === 'tech' && tgt.side === 'p') dmg *= mod(tgt, 'res');
  let weak = false, crit = false, broke = false;
  if (tgt.side === 'e') {
    if (tgt.def.weak.includes(o.ty)) {
      weak = true; reveal(tgt.id, o.ty);
      if (tgt.broken <= 0) { tgt.sh--; if (tgt.sh <= 0) { tgt.sh = 0; tgt.broken = tgt.acted ? 1 : 2; broke = true; } }
      dmg *= 1.35;
    }
    if (tgt.broken > 0 && !broke) dmg *= 1.75;
    if (broke) dmg *= 1.4;
  } else {
    if (tgt.resist && tgt.resist.includes(o.ty)) dmg *= 0.5;
    if (tgt.defending) dmg *= 0.5;
  }
  const critCh = att ? (isP ? att.crit + (att.buffs.crit ? att.buffs.crit.m : 0) + (o.critBonus || 0) : 4) : 0;
  if (!o.flat && rnd() * 100 < critCh) { crit = true; dmg *= 1.6; }
  dmg = Math.round(dmg);
  hurt(tgt, dmg);
  popup(tgt, dmg, (crit ? 'crit ' : '') + (weak ? 'weak' : ''));
  if (broke) { banner('BREAK!', '#e8442e'); blog(`${tgt.n}’s shields shatter. BREAK!`); }
  return { dmg, weak, crit, broke };
}
function applyStatus(tgt, st, ch) {
  if (!st || tgt.dead || rnd() > ch) return;
  if (tgt.side === 'e' && tgt.def.boss && st === 'stun') return;
  tgt.status[st] = st === 'stun' ? 1 : st === 'burn' ? 3 : 4;
  blog(`${tgt.n} is ${st === 'burn' ? 'burning' : st === 'toxin' ? 'poisoned' : 'stunned'}!`);
}

/* enemy AI */
async function enemyTurn(e) {
  const moves = e.def.moves.filter(m => {
    if (m.heal) return e.hp < e.mhp * 0.7;
    if (m.buff) return !Object.keys(m.buff).some(k => e.buffs[k]);
    return true;
  });
  const m = pick(moves.length ? moves : e.def.moves);
  const alive = BT.party.filter(p => !p.dead);
  if (!alive.length) return;
  highlight(e.uid);
  if (m.heal) { const h = Math.round(e.mhp * m.heal); e.hp = Math.min(e.mhp, e.hp + h); blog(`${e.n} uses ${m.n}.`); popup(e, h, 'heal'); renderBattle(); await sleep(600); return; }
  if (m.buff) { for (const [k, v] of Object.entries(m.buff)) addBuff(e, k, v, 3); blog(`${e.n} uses ${m.n}.`); renderBattle(); await sleep(600); return; }
  blog(`${e.n} uses ${m.n}!`);
  const tgts = m.t === 'a' ? alive : [pickTarget(alive)];
  for (const t of tgts) {
    const r = dealDamage(e, t, { kind: m.k === 't' ? 'tech' : 'phys', ty: m.ty, p: m.p });
    if (r && !r.miss) applyStatus(t, m.st, m.ch || 0);
  }
  renderBattle(); await sleep(650);
}
function pickTarget(alive) {
  const taunt = alive.find(p => p.buffs.taunt);
  if (taunt && rnd() < 0.75) return taunt;
  return pick(alive);
}

/* player turn */
function playerTurn(m) {
  return new Promise(resolve => {
    BT.active = m; BT.boost = 0; BT.resolve = async (cmd) => { BT.active = null; BT.targeting = null; await execute(m, cmd); resolve(); };
    renderBattle(); drawCommands(m);
  });
}
function drawCommands(m, view) {
  const el = $('#bCmd');
  const boostCtl = `<div class="boost"><span class="bn">${esc(m.n)}</span>${B('−', () => { BT.boost = Math.max(0, BT.boost - 1); drawCommands(m, view); }, { cls: 'tiny', dis: BT.boost <= 0 })}<span class="bpips">${Array.from({ length: 5 }, (_, i) => `<i class="${i < m.bp ? (i < BT.boost ? 'use' : 'on') : ''}"></i>`).join('')}</span>${B('+', () => { BT.boost = Math.min(3, m.bp, BT.boost + 1); drawCommands(m, view); }, { cls: 'tiny', dis: BT.boost >= Math.min(3, m.bp) })}<span class="bl2">BOOST ${BT.boost}</span></div>`;
  if (view === 'skills') {
    const sk = skillsOf(m.id);
    mount(el, boostCtl + `<div class="cmdlist">${sk.map(s => { const k = SKILLS[s]; return B(k.n, () => chooseTarget(m, { type: 'skill', skill: s }), { dis: m.mp < k.mp || (k.t === 'deadAlly' && !BT.party.some(p => p.dead)), sub: k.d, right: `${k.ty ? chip(k.ty) : ''}<span class="mp">${k.mp}</span>` }); }).join('')}</div>` + B('Back', () => drawCommands(m), { cls: 'ghost small' }));
    return;
  }
  if (view === 'items') {
    const its = Object.entries(S.bag).filter(([id]) => ITEMS[id] && ITEMS[id].k === 'use');
    mount(el, `<div class="cmdlist">${its.map(([id, n]) => { const it = ITEMS[id]; return B(it.n, () => chooseTarget(m, { type: 'item', item: id }), { sub: it.d, right: `${it.ty ? chip(it.ty) : ''}<span class="mp">×${n}</span>`, dis: (it.flee && (BT.opts.story || BT.opts.boss)) || (it.t === 'deadAlly' && !BT.party.some(p => p.dead)) }); }).join('') || '<p class="muted">No usable items.</p>'}</div>` + B('Back', () => drawCommands(m), { cls: 'ghost small' }));
    return;
  }
  mount(el, boostCtl + `<div class="cmdgrid">
    ${B('Attack', () => chooseTarget(m, { type: 'attack' }), { cls: 'primary', right: chip(m.ty) })}
    ${B('Skills', () => drawCommands(m, 'skills'), { right: `<span class="mp">${m.mp}</span>` })}
    ${B('Items', () => drawCommands(m, 'items'))}
    ${B('Defend', () => BT.resolve({ type: 'defend' }), { sub: 'Halve damage' })}
    ${B('Flee', () => BT.resolve({ type: 'flee' }), { dis: !!(BT.opts.story || BT.opts.boss || BT.opts.noFlee || BT.opts.elite), cls: 'ghost' })}
  </div>`);
}
function chooseTarget(m, cmd) {
  let t;
  if (cmd.type === 'attack') t = 'enemy';
  else if (cmd.type === 'skill') t = SKILLS[cmd.skill].t;
  else t = ITEMS[cmd.item].t;
  cmd.boost = cmd.type === 'item' ? 0 : BT.boost;
  if (t === 'enemy' || t === 'ally' || t === 'deadAlly') {
    const cands = t === 'enemy' ? BT.enemies.filter(e => !e.dead) : t === 'ally' ? BT.party.filter(p => !p.dead) : BT.party.filter(p => p.dead);
    if (cands.length === 1 && t === 'enemy') { cmd.target = cands[0]; return BT.resolve(cmd); }
    BT.targeting = { t, cmd };
    renderBattle();
    mount($('#bCmd'), `<p class="tgt-hint">Choose a target${t === 'enemy' ? ' above' : ' below'}.</p>` + B('Cancel', () => { BT.targeting = null; renderBattle(); drawCommands(m); }, { cls: 'ghost small' }));
    return;
  }
  BT.resolve(cmd);
}
function onCardTap(uid) {
  if (!BT || !BT.targeting) return;
  const u = [...BT.enemies, ...BT.party].find(x => x.uid === uid);
  const t = BT.targeting.t;
  if (!u) return;
  if (t === 'enemy' && (u.side !== 'e' || u.dead)) return;
  if (t === 'ally' && (u.side !== 'p' || u.dead)) return;
  if (t === 'deadAlly' && (u.side !== 'p' || !u.dead)) return;
  const cmd = BT.targeting.cmd; cmd.target = u; BT.targeting = null; BT.resolve(cmd);
}
function aliveEnemies() { return BT.enemies.filter(e => !e.dead); }
function spendBoost(m, n) { if (n > 0) { m.bp -= n; m.boostedThisRound = true; } }
async function execute(m, cmd) {
  highlight(m.uid);
  const bst = cmd.boost || 0, bm = BOOSTM[bst];
  if (cmd.type === 'defend') { m.defending = true; blog(`${m.n} braces for impact.`); renderBattle(); await sleep(300); return; }
  if (cmd.type === 'flee') {
    const ps = BT.party.filter(p => !p.dead).reduce((a, p) => a + p.spd, 0) / Math.max(1, BT.party.filter(p => !p.dead).length);
    const es = aliveEnemies().reduce((a, e) => a + e.spd, 0) / Math.max(1, aliveEnemies().length);
    if (rnd() < clamp(0.5 + (ps - es) * 0.02, 0.2, 0.9)) { blog('You got away!'); BT.over = 'flee'; await sleep(400); }
    else { blog('Couldn’t escape!'); await sleep(450); }
    return;
  }
  spendBoost(m, bst);
  if (bst) { banner(`BOOST ×${bst}`, '#3fd0c9'); }
  if (cmd.type === 'attack') {
    blog(`${m.n} attacks${bst ? ` (×${bst + 1})` : ''}.`);
    let t = cmd.target;
    for (let i = 0; i < 1 + bst; i++) {
      if (!t || t.dead) t = pick(aliveEnemies()); if (!t) break;
      dealDamage(m, t, { kind: 'phys', ty: m.ty, p: 1 });
      renderBattle(); await sleep(260);
    }
    await sleep(250); return;
  }
  if (cmd.type === 'item') {
    const it = ITEMS[cmd.item]; bagAdd(cmd.item, -1);
    blog(`${m.n} uses ${it.n}.`);
    if (it.flee) { BT.over = 'flee'; blog('Smoke fills the air. You slip away.'); await sleep(400); return; }
    const scale = 1 + partyLv() * 0.09;
    const tg = it.t === 'allEnemies' ? aliveEnemies() : it.t === 'allAllies' ? BT.party.filter(p => !p.dead) : [cmd.target];
    tg.forEach(t => {
      if (!t) return;
      if (it.dmg) dealDamage(null, t, { kind: 'tech', ty: it.ty, flat: Math.round(it.dmg * scale) });
      if (it.revive && t.dead) { t.dead = false; t.hp = Math.round(t.mhp * it.revive); popup(t, t.hp, 'heal'); }
      if (it.heal && !t.dead) { const h = Math.min(t.mhp - t.hp, it.heal); t.hp += h; popup(t, h, 'heal'); }
      if (it.mp && !t.dead) { t.mp = Math.min(t.mmp, t.mp + it.mp); popup(t, it.mp, 'heal'); }
      if (it.cleanse) t.status = {};
    });
    renderBattle(); await sleep(500); return;
  }
  // skill
  const s = SKILLS[cmd.skill];
  m.mp -= s.mp;
  blog(`${m.n} uses ${s.n}${bst ? ` (boost ${bst})` : ''}!`);
  if (s.k === 'phys' || s.k === 'tech' || s.k === 'steal') {
    let p = s.p * bm;
    if (s.desperate) p = (1.5 + 2.5 * (1 - m.hp / m.mhp)) * bm;
    const hits = s.hits || 1;
    const tgs = s.t === 'allEnemies' ? aliveEnemies() : [cmd.target];
    for (let i = 0; i < hits; i++) {
      for (let t of tgs) {
        if (s.rnd || !t || t.dead) t = pick(aliveEnemies());
        if (!t) break;
        const r = dealDamage(m, t, { kind: s.k === 'tech' ? 'tech' : 'phys', ty: s.ty, p, pierce: s.pierce, critBonus: s.critBonus });
        if (r && !r.miss) {
          applyStatus(t, s.st, s.ch || 0);
          if (s.debuff && !t.dead) for (const [k, v] of Object.entries(s.debuff)) addBuff(t, k, v, 3);
          if (s.shred && !t.dead && t.broken <= 0) { t.sh = Math.max(0, t.sh - s.shred); if (t.sh === 0) { t.broken = t.acted ? 1 : 2; banner('BREAK!', '#e8442e'); blog(`${t.n}’s shields shatter. BREAK!`); } }
          if (s.k === 'steal' && rnd() < 0.45 + m.dex / 250) {
            const d = t.def.drop.filter(([, c]) => c < 1);
            if (d.length && rnd() < 0.6) { const it = pick(d)[0]; bagAdd(it); blog(`${m.n} pilfers ${ITEMS[it].n}!`); }
            else { const c = t.lv * 9; S.cr += c; blog(`${m.n} lifts ${c} credits!`); }
          }
        }
        renderBattle(); await sleep(220);
      }
    }
    if (s.partyBuff) BT.party.forEach(pm => { if (!pm.dead) for (const [k, v] of Object.entries(s.partyBuff)) addBuff(pm, k, v, 3); });
  } else if (s.k === 'heal') {
    const tgs = s.t === 'allAllies' ? BT.party.filter(p => !p.dead) : [cmd.target];
    tgs.forEach(t => {
      const h = Math.round((m.tec * 2.2 * s.p + 25) * bm);
      const real = Math.min(t.mhp - t.hp, h); t.hp += real; popup(t, real, 'heal');
      if (s.cleanse) t.status = {};
      if (s.regen) t.status.regen = s.regen + bst;
    });
  } else if (s.k === 'buff') {
    const tgs = s.t === 'allAllies' ? BT.party.filter(p => !p.dead) : s.t === 'self' ? [m] : [cmd.target];
    tgs.forEach(t => { for (const [k, v] of Object.entries(s.buff)) addBuff(t, k, v, (s.turns || 3) + bst); });
    blog(`${tgs.length > 1 ? 'The party is' : tgs[0].n + ' is'} empowered.`);
  } else if (s.k === 'revive') {
    if (s.all) BT.party.forEach(t => { if (t.dead) { t.dead = false; t.hp = 1; } const h = Math.round(t.mhp * s.p * (1 + bst * 0.15)); t.hp = Math.min(t.mhp, t.hp + h); popup(t, h, 'heal'); });
    else { const t = cmd.target; if (t && t.dead) { t.dead = false; t.hp = Math.round(t.mhp * Math.min(1, s.p + bst * 0.15)); popup(t, t.hp, 'heal'); } }
  } else if (s.k === 'scan') {
    aliveEnemies().forEach(e => e.def.weak.forEach(w => reveal(e.id, w)));
    blog('Scan complete. Weaknesses revealed.');
  } else if (s.k === 'bp') {
    const t = cmd.target; t.bp = Math.min(5, t.bp + 2 + bst); blog(`${t.n} is overclocked! +${2 + bst} BP.`);
  }
  renderBattle(); await sleep(450);
}
function highlight(uid) { document.querySelectorAll('.unit.act').forEach(e => e.classList.remove('act')); const el = document.querySelector(`[data-uid="${uid}"]`); if (el) el.classList.add('act'); }

let enemyPainted = '';
function renderBattle(first) {
  if (!BT) return;
  const tg = BT.targeting;
  const ekey = BT.enemies.map(e => e.uid + e.id).join();
  const ewrap = $('#bEnemies');
  if (first || enemyPainted !== ekey) {
    enemyPainted = ekey;
    ewrap.innerHTML = BT.enemies.map(e => `<div class="unit enemy ${e.def.boss ? 'boss' : ''}" data-uid="${e.uid}"><canvas class="ecv"></canvas><div class="einfo"></div></div>`).join('');
    ewrap.querySelectorAll('.unit').forEach((el, i) => {
      const e = BT.enemies[i];
      el.addEventListener('click', () => onCardTap(e.uid));
      requestAnimationFrame(() => ART.paintEnemy(el.querySelector('canvas'), e.id, e.def));
    });
  }
  ewrap.querySelectorAll('.unit').forEach((el, i) => {
    const e = BT.enemies[i], k = knownWeak(e.id);
    el.classList.toggle('dead', e.dead); el.classList.toggle('broken', e.broken > 0);
    el.classList.toggle('targetable', !!(tg && tg.t === 'enemy' && !e.dead));
    el.querySelector('.einfo').innerHTML = `<div class="enrow"><b class="en">${esc(e.n)}</b><span class="elv">Lv${e.lv}</span></div>
      <i class="bar hp"><i style="width:${e.hp / e.mhp * 100}%"></i></i>
      <div class="shrow"><span class="shield ${e.broken > 0 ? 'brk' : ''}">${e.broken > 0 ? 'BRK' : e.sh}</span>${e.def.weak.map(w => k.includes(w) ? chip(w) : '<span class="chip unk">?</span>').join('')}</div>
      <div class="st">${Object.keys(e.status).map(s => `<span class="stt ${s}">${s}</span>`).join('')}${Object.keys(e.buffs).map(s => `<span class="stt buff">${s}</span>`).join('')}</div>`;
  });
  const pw = $('#bParty');
  pw.innerHTML = BT.party.map(m => `<div class="unit pmc ${m.dead ? 'dead' : ''} ${BT.active === m ? 'turn' : ''} ${tg && ((tg.t === 'ally' && !m.dead) || (tg.t === 'deadAlly' && m.dead)) ? 'targetable' : ''}" data-uid="${m.uid}" style="--hc:${CREW[m.id].col}">
    <div class="pn"><b>${esc(m.n)}</b>${m.defending ? '<span class="stt buff">guard</span>' : ''}</div>
    <div class="nums"><span>HP ${fmt(m.hp)}</span><span>MP ${m.mp}</span></div>
    <i class="bar hp"><i style="width:${m.hp / m.mhp * 100}%"></i></i><i class="bar mp"><i style="width:${m.mp / m.mmp * 100}%"></i></i>
    <div class="bpips small">${Array.from({ length: 5 }, (_, i) => `<i class="${i < m.bp ? 'on' : ''}"></i>`).join('')}</div>
    <div class="st">${Object.keys(m.status).map(s => `<span class="stt ${s}">${s}</span>`).join('')}${Object.keys(m.buffs).map(s => `<span class="stt buff">${s}</span>`).join('')}</div>
  </div>`).join('');
  pw.querySelectorAll('.unit').forEach(el => el.addEventListener('click', () => onCardTap(el.dataset.uid)));
  if (!BT.active) { const el = $('#bCmd'); if (!el.querySelector('.waiting')) el.innerHTML = '<p class="waiting muted">…</p>'; }
}
async function finishBattle() {
  const res = BT.over;
  // write back HP/MP
  BT.party.forEach(m => { const c = S.crew[m.id]; c.hp = m.dead ? 0 : m.hp; c.mp = m.mp; c.status = {}; });
  if (res === 'lose') return 'lose';
  if (res === 'flee') { S.party.forEach(id => { if (S.crew[id].hp <= 0) S.crew[id].hp = 1; }); show('scr-game'); render(); sysLine('You escaped.'); return 'flee'; }
  S.stats.wins++;
  let xp = 0, cr = 0, scrap = 0; const drops = [];
  BT.enemies.forEach(e => {
    xp += e.xp; cr += e.cr;
    if (rnd() < (e.def.boss ? 1 : 0.35)) scrap += e.def.boss ? ri(4, 8) : ri(1, 2);
    e.def.drop.forEach(([it, ch]) => { if (rnd() < ch) { bagAdd(it); drops.push(ITEMS[it].n); } });
  });
  if (S.meal) { const mb = MEALS[S.meal.id].buff; if (mb.xp) xp *= mb.xp; }
  if (talent('miles')) cr = Math.round(cr * 1.15);
  S.cr += cr; S.scrap += scrap;
  const lines = [];
  Object.keys(S.crew).filter(recruited).forEach(id => {
    const c = S.crew[id];
    const share = inParty(id) ? (c.hp > 0 ? 1 : 0.5) : 0.5;
    lines.push(...gainXp(id, xp * share));
    if (c.hp <= 0) c.hp = 1;
  });
  if (talent('katey')) S.party.forEach(id => { const cs = charStats(id); S.crew[id].hp = Math.min(cs.mhp, S.crew[id].hp + Math.round(cs.mhp * 0.12)); });
  if (S.meal) { S.meal.left--; if (S.meal.left <= 0) { S.meal = null; lines.push('Julius’s meal has worn off.'); } }
  banner('VICTORY', '#f2a33a');
  await new Promise(res2 => {
    mount($('#bCmd'), `<div class="victory"><h3>Victory</h3><p>+${fmt(xp)} XP · +${fmt(cr)} credits${scrap ? ` · +${scrap} scrap` : ''}</p>${drops.length ? `<p>Found: ${esc(drops.join(', '))}</p>` : ''}${lines.map(l => `<p class="lvl">${esc(l)}</p>`).join('')}${talent('katey') ? '<p class="muted small">Katey patches everyone up.</p>' : ''}</div>` + B('Continue', () => res2(), { cls: 'primary' }));
  });
  BT = null;
  show('scr-game'); save(); render();
  return 'win';
}
function defeatScreen() {
  return new Promise(res => {
    banner('DEFEATED', '#e8442e');
    mount($('#bCmd'), `<div class="victory lose"><h3>The crew falls</h3><p class="muted">Try the battle again from the start, or retreat to the Last Hope and lose 10% of your credits.</p></div>` +
      B('Try again', () => res('retry'), { cls: 'primary' }) + B('Retreat to the Last Hope', () => res('retreat')));
  });
}

/* ---------- boot ---------- */
function boot() {
  $('#sheetClose').addEventListener('click', closeSheet);
  $('#sheet').addEventListener('click', e => { if (e.target.id === 'sheet') closeSheet(); });
  const nav = { navParty: () => partySheet(), navBag: () => bagSheet(), navQuests: () => questSheet(), navCodex: () => codexSheet(), navSystem: () => systemSheet() };
  Object.entries(nav).forEach(([id, f]) => $('#' + id).addEventListener('click', () => { if (S) f(); }));
  window.addEventListener('resize', () => { lastArtKey = ''; if (S && $('#scr-game').classList.contains('on')) render(); });
  titleScreen();
}
if (typeof document !== 'undefined') document.addEventListener('DOMContentLoaded', boot);
