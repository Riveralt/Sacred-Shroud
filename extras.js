/* ============================================================
   THE SACRED SHROUD — extras: difficulty, gear helpers, bestiary,
   menu badges, and THE VAULTS (endless endgame on Dryria M07)
   ============================================================ */

/* ---------- difficulty ---------- */
const DIFF = {
  story:  { n: 'Story',  hp: 0.65, dmg: 0.6, sh: 0, xp: 1.25, cr: 1,   d: 'For the plot. Enemies are much weaker.' },
  normal: { n: 'Normal', hp: 1,    dmg: 1,   sh: 0, xp: 1,    cr: 1,   d: 'The intended balance.' },
  hard:   { n: 'Hard',   hp: 1.25, dmg: 1.2, sh: 0, xp: 1.1,  cr: 1.2, d: 'Tougher enemies. You need to use weaknesses and boosts.' },
  brutal: { n: 'Brutal', hp: 1.5,  dmg: 1.4, sh: 1, xp: 1.2,  cr: 1.4, d: 'Tougher, harder-hitting, and one extra shield on everything.' }
};
const DIFF_ORDER = ['story', 'normal', 'hard', 'brutal'];
let PENDING_DIFF = 'normal';

function migrate(s) {
  s.foes = s.foes || {}; s.diff = s.diff || 'normal'; s.marks = s.marks || 0; s.vitems = s.vitems || {};
  s.vstock = s.vstock || null; s.ack = s.ack || {}; s.codexSeen = s.codexSeen || {};
  s.vrec = s.vrec || { best: 0, runs: 0, marks: 0 };
  Object.assign(ITEMS, s.vitems);
  return s;
}
function difficultySheet() {
  let h = '<p class="muted">Change it any time. It affects enemy HP, damage and shields, plus XP and credits.</p>';
  DIFF_ORDER.forEach(k => {
    const d = DIFF[k];
    h += B(d.n, () => { S.diff = k; save(); difficultySheet(); }, { cls: S.diff === k ? 'on' : '', sub: d.d, right: S.diff === k ? '✓' : '' });
  });
  h += B('Back', () => systemSheet(), { cls: 'ghost' });
  openSheet('Difficulty', ''); sheetMount(h);
}
function diffPicker() {
  return `<div class="diffrow"><span class="muted small">Difficulty</span>${DIFF_ORDER.map(k => B(DIFF[k].n, () => { PENDING_DIFF = k; selectScreen(); }, { cls: 'small ' + (PENDING_DIFF === k ? 'on' : '') })).join('')}</div><p class="muted small diffnote">${esc(DIFF[PENDING_DIFF].d)} You can change it later in System.</p>`;
}

/* ---------- gear helpers ---------- */
function bonText(bon) {
  if (!bon) return '';
  return Object.entries(bon).map(([k, v]) => k === 'resist' ? ` · resist ${v}` : k === 'regen' ? ` · regen ${Math.round(v * 100)}%` : k === 'mpRegen' ? ` · +${v} MP/turn` : ` · ${k.toUpperCase()} +${v}`).join('');
}
function gearDeltaDef(it) {
  if (!it || (it.k !== 'weapon' && it.k !== 'armor')) return '';
  ITEMS.__tmp = it;
  let best = null;
  S.party.forEach(id => {
    if (it.k === 'weapon' && !CLASSES[CREW[id].cls].wt.includes(it.cat)) return;
    const slot = it.k === 'weapon' ? 'weapon' : 'armor', stat = it.k === 'weapon' ? 'atk' : 'arm';
    const before = charStats(id)[stat], old = S.crew[id].eq[slot];
    S.crew[id].eq[slot] = '__tmp'; const after = charStats(id)[stat]; S.crew[id].eq[slot] = old;
    const d = after - before; if (!best || d > best.d) best = { id, d, stat };
  });
  delete ITEMS.__tmp;
  if (!best) return '<span class="delta none">No one in your party can use this</span>';
  if (best.d <= 0) return '<span class="delta none">No upgrade for your party</span>';
  return `<span class="delta up">${esc(CREW[best.id].short)} +${best.d} ${best.stat.toUpperCase()}</span>`;
}
function gearDelta(id) { return gearDeltaDef(ITEMS[id]); }
function equipBest(id) {
  const cl = CLASSES[CREW[id].cls], c = S.crew[id], changed = [];
  for (const slot of ['weapon', 'armor']) {
    const stat = slot === 'weapon' ? 'atk' : 'arm';
    let bestId = c.eq[slot], bestV = charStats(id)[stat];
    Object.keys(S.bag).forEach(k => {
      const it = ITEMS[k]; if (!it || !(S.bag[k] > 0)) return;
      if (slot === 'weapon' ? !(it.k === 'weapon' && cl.wt.includes(it.cat)) : it.k !== 'armor') return;
      const old = c.eq[slot]; c.eq[slot] = k; const v = charStats(id)[stat]; c.eq[slot] = old;
      if (v > bestV) { bestV = v; bestId = k; }
    });
    if (bestId !== c.eq[slot]) { const old = c.eq[slot]; c.eq[slot] = bestId; bagAdd(bestId, -1); if (old) bagAdd(old, 1); changed.push(ITEMS[bestId].n); }
  }
  const cs = charStats(id); c.hp = Math.min(c.hp, cs.mhp); c.mp = Math.min(c.mp, cs.mmp);
  return changed;
}
function equipBestAll() {
  const out = [];
  S.party.forEach(id => { const ch = equipBest(id); if (ch.length) out.push(`${CREW[id].short}: ${ch.join(', ')}`); });
  save();
  return out;
}

/* ---------- bestiary ---------- */
function foeLocs(id) {
  const out = [];
  Object.values(LOCS).forEach(L => (L.zones || []).forEach(z => { if (z.enemies.includes(id)) out.push(`${L.n}: ${z.n}`); }));
  return out;
}
function bestiarySheet(sel) {
  if (sel) {
    const d = ENEMIES[sel], f = S.foes[sel], k = knownWeak(sel), where = foeLocs(sel);
    openSheet('Bestiary', `<div class="card foe"><canvas id="foeArt" class="foeart"></canvas><h3>${esc(d.n)} ${d.boss ? '<span class="tag">BOSS</span>' : d.elite ? '<span class="tag">BOUNTY</span>' : ''}</h3>
      <p class="muted small">Defeated ${f.k}× · highest level met ${f.lv} · ${d.sh} shields</p>
      <p><b>Weaknesses</b><br>${d.weak.map(w => k.includes(w) ? `${chip(w)} ${DMG[w].n}` : '<span class="chip unk">?</span> undiscovered').join('<br>')}</p>
      ${where.length ? `<p class="muted small">Found in: ${esc(where.join(' · '))}</p>` : ''}
      <p class="muted small">Moves: ${esc(d.moves.map(m => m.n).join(', '))}</p></div><div id="foeB"></div>`);
    requestAnimationFrame(() => ART.paintEnemy($('#foeArt'), sel, d));
    mount($('#foeB'), B('Back', () => bestiarySheet(), { cls: 'ghost' }));
    return;
  }
  const ids = Object.keys(ENEMIES).filter(id => S.foes[id]).sort((a, b) => ENEMIES[a].lv - ENEMIES[b].lv);
  let h = `<p class="muted small">${ids.length} of ${Object.keys(ENEMIES).length} enemies catalogued. Weaknesses fill in as you hit them.</p>`;
  h += ids.map(id => { const d = ENEMIES[id], k = knownWeak(id); return B(d.n, () => bestiarySheet(id), { sub: `Lv ${S.foes[id].lv} · defeated ${S.foes[id].k}× · ${k.length}/${d.weak.length} weaknesses`, right: d.weak.map(w => k.includes(w) ? chip(w) : '<span class="chip unk">?</span>').join('') }); }).join('');
  if (!ids.length) h += '<p class="muted">Win a fight and enemies start appearing here.</p>';
  h += B('Back to Codex', () => codexSheet(), { cls: 'ghost' });
  openSheet('Bestiary', ''); sheetMount(h);
}

/* ---------- menu badges ---------- */
function questKeys() {
  const keys = [];
  if (S.ms >= 0 && MAIN[S.ms]) keys.push('m:' + MAIN[S.ms].id);
  Object.keys(CREWQ).forEach(id => {
    if (!recruited(id)) return;
    const n = S.cq[id] || 0, p = CREWQ[id].parts[n];
    if (p && isDone(p.req) && (p.loc === 'lasthope' || locUnlocked(p.loc))) keys.push(`cq:${id}:${n}`);
  });
  Object.entries(BOUNTIES).forEach(([id, b]) => { if (!S.bounties[id] && locUnlocked(b.loc)) keys.push('b:' + id); });
  JULIUS_Q.forEach(q => { if (!S.jq[q.id] && isDone(q.req) && (S.bag[q.need] || 0) >= q.qty) keys.push('jq:' + q.id); });
  return keys;
}
function setBadge(id, n) { const el = document.getElementById(id); if (!el) return; if (typeof n === 'number' && n > 9) n = '9+'; if (n) el.setAttribute('data-badge', n); else el.removeAttribute('data-badge'); }
function updateBadges() {
  if (!S || !S.ack) return;
  setBadge('navQuests', questKeys().filter(k => !S.ack[k]).length);
  setBadge('navCodex', Object.keys(S.codex).filter(k => !S.codexSeen[k]).length);
  setBadge('navParty', S.crewNew ? '!' : 0);
}
function ackQuests() { questKeys().forEach(k => S.ack[k] = 1); save(); updateBadges(); }
function ackCodex() { Object.keys(S.codex).forEach(k => S.codexSeen[k] = 1); save(); updateBadges(); }
function ackCrew() { S.crewNew = 0; save(); updateBadges(); }

/* ============================================================
   THE VAULTS — Dryria M07
   ============================================================ */
const VAULT_MODS = {
  fortified:    { n: 'Fortified', d: 'Enemies have 2 extra shields.' },
  bloodthirsty: { n: 'Bloodthirsty', d: 'Enemies deal 20% more damage.' },
  thick:        { n: 'Thick-Skinned', d: 'Enemies have 30% more HP.' },
  swift:        { n: 'Swift', d: 'Enemies are 25% faster.' },
  shrouded:     { n: 'Shrouded', d: 'Weaknesses you knew are hidden. Find them again, or Scan.' },
  regen:        { n: 'Regenerating', d: 'Enemies heal 5% each turn unless broken.' },
  antimagic:    { n: 'Null Field', d: 'Skills cost 50% more MP.' },
  scarcity:     { n: 'Scarcity', d: 'No items in battle.' },
  hardened:     { n: 'Hardened', d: 'Damage that misses a weakness is cut by 40%.' },
  reinforce:    { n: 'Reinforcements', d: 'One more enemy joins every fight.' },
  wounds:       { n: 'Lingering Wounds', d: 'All healing is 30% weaker.' },
  twin:         { n: 'Double Billing', d: 'Bosses bring an elite bodyguard.' }
};
const VAULT_BOONS = {
  might: { n: 'Lawless Might', d: '+15% attack for the rest of this delve.', buff: { atk: 1.15 } },
  plate: { n: 'Vault Plating', d: '+20% armor for the rest of this delve.', buff: { arm: 1.2 } },
  quick: { n: 'Quicksilver', d: '+15% speed for the rest of this delve.', buff: { spd: 1.15 } },
  focus: { n: 'Gambler’s Focus', d: 'Start every battle with 2 extra BP.', bp: 2 },
  mend:  { n: 'Field Surgeon', d: 'Heal 15% HP after every battle.', mend: 0.15 },
  dice:  { n: 'Loaded Dice', d: '+15% critical chance.', crit: 15 },
  baffle:{ n: 'Psi Baffles', d: 'Take 20% less tech damage.', buff: { res: 0.8 } }
};
const VAULT_DOORS = {
  battle: { n: 'Skirmish', w: 40, icon: '⚔', d: 'A normal fight. Some marks.' },
  elite:  { n: 'Elite Pit', w: 16, icon: '☗', d: 'A fight with one elite. More marks.' },
  cache:  { n: 'Locked Cache', w: 14, icon: '◆', d: 'Marks and loot. Probably not trapped.' },
  rest:   { n: 'Spectator Lounge', w: 11, icon: '☾', d: 'Recover 40% HP and MP.' },
  boon:   { n: 'Order Shrine', w: 10, icon: '✦', d: 'Choose a blessing for this delve.' },
  gamble: { n: 'Dealer’s Table', w: 9, icon: '♣', d: 'Bet your marks. Double or half.' }
};
const VAULT_BOSSES = Object.keys(ENEMIES).filter(id => ENEMIES[id].boss && !ENEMIES[id].final && !['echo', 'colossus', 'thornlead', 'lsfrecruiter', 'deacon', 'relay', 'bronco', 'deckchief', 'ayers'].includes(id));
const VAULT_BIOMES = ['eplaotune', 'pliea', 'eldania', 'aegialeus', 'skuna', 'wucury', 'ruenov', 'unknown'];

LOCS.vault = {
  n: 'Dryria M07', sys: 'The Vault World', region: 'Lawless Order territory', lv: 'Scales to you',
  art: { k: 'vault', pal: ['#0a0614', '#3a1450', '#2a1640', '#180c2a', '#06030c', '#ff4fa0'], seed: 101 },
  blurb: 'A dead world drilled full of stolen vaults, every one lit up like a casino. The Lawless Order runs it, and half the Outer Colonies bet on whoever goes down.',
  hub: {
    n: 'The Lawless Exchange', art: { k: 'vault', pal: ['#0c0618', '#4a1a5a', '#2e1846', '#1a0e2e', '#06030c', '#3fd0c9'], seed: 102 },
    desc: 'A betting hall carved into the cliff above the vaults. Screens everywhere show crews dying in creative ways. The odds on yours just changed.',
    shop: ['medgel2', 'trauma', 'psicell2', 'lazarus', 'antitox', 'jerky', 'fraggren', 'cryogren', 'shockmine', 'psibomb'],
    npcs: [
      { n: 'The Croupier', lines: ['Cash out between strata and you keep it all. Die down there and our medics drag you out with half. We’re not monsters. We keep monsters.', 'Every boss is a replica, grown from samples. Ethically sourced. Mostly.'] },
      { n: 'A Bettor in the Stands', lines: ['I’ve got two hundred credits on you making stratum five. Don’t you dare cash out early.', 'Last crew cashed out on stratum two. We threw food at them.'] },
      { n: 'Order Medic', lines: ['I’ve pulled four hundred crews out of those vaults. Three hundred and ninety were alive. Good odds!'] }
    ],
    board: []
  },
  zones: [], events: []
};
TRAVEL_ORDER.push('vault');
LOC_UNLOCK.vault = 'm12';
CODEX.lawless = { cat: 'Factions', n: 'The Lawless Order', t: 'A gambling syndicate that bought a dead planet from nobody, because nobody owned it, then filled it with stolen vaults and grown replicas of the galaxy’s most famous monsters and outlaws. Crews delve for prizes. The rest of the galaxy bets on how far they get.' };
SCENES.vault_intro = [
  '~codex:lawless',
  'DRYRIA M07. A dead world drilled through with ten thousand stolen vaults, every hatch lit up like a casino.',
  'A man in a gold-sequined waistcoat meets the Last Hope at the landing pad, arms spread wide. Behind him, a betting hall full of screens.',
  'N:The Croupier|The crew of the Last Hope! You stopped a god. Lovely. Now stop a few more for my viewers.',
  'N:The Croupier|The rules are simple. Go down. Every door you open pays marks. Every stratum you clear, the Order adds a new rule. Deeper means meaner rules and prettier prizes.',
  'N:The Croupier|Cash out between strata and you keep every mark. Die down there and our medics drag you out with half.',
  '[r:katey]katey|Those things down there. They’re copies. I can see the seams.',
  'N:The Croupier|Replicas, Doctor! Grown from samples. Every famous beast and bandit in the galaxy, on tap. Even a few you’ve met.',
  'miles|And what’s in it for you?',
  'N:The Croupier|Ratings, Captain. Half the Outer Colonies are betting on you tonight. Don’t disappoint them.',
  'The Vaults are open. Delves scale to your crew, and they never run out.'
];
if (SCENES.ending && !SCENES.ending.some(l => l.includes('Dryria'))) SCENES.ending.push('A gold-edged message pings the Last Hope: an invitation from a place called Dryria M07. It is now on the galaxy map.');

async function vaultArrive(locId) {
  if (locId !== 'vault' || S.seen.vault_intro) return;
  S.seen.vault_intro = 1;
  await playScene('vault_intro');
  save(); render();
}

/* --- hub --- */
function vaultHubActions() {
  const L = LOCS.vault, d = S.delve, rec = S.vrec;
  let run;
  if (d) {
    run = B('Return to the delve', () => { S.place = 'delve'; save(); render(); }, { cls: 'story', icon: '▼', sub: `Stratum ${d.s} · ${d.marks} marks at stake` });
    run += B('Abandon the delve', () => abandonDelve(), { icon: '◂', sub: `Keep half: ${Math.floor(d.marks / 2)} marks` });
    return sec('The Vaults', run);
  }
  run = B('Begin a delve', () => startDelve(), { cls: 'story', icon: '▼', sub: `Enemies start around Lv ${Math.max(1, maxLv() - 2)} and grow · deepest: stratum ${rec.best}` });
  let ex = B('Vault Exchange', () => exchangeSheet(), { icon: '◆', sub: `Spend marks on gear that scales with you · ${fmt(S.marks)} marks` });
  ex += B('Records', () => recordsSheet(), { icon: '≡', sub: `${rec.runs} delve${rec.runs === 1 ? '' : 's'} · deepest stratum ${rec.best}` });
  let town = B('Board the Last Hope', () => goShip(), { icon: '▲', sub: 'Rest, travel, cook, upgrade, swap crew' });
  town += B('Trade', () => shopSheet(L.hub), { icon: '¤', sub: 'Supplies for credits' });
  town += B('Talk to the locals', () => talkSheet(L.hub), { icon: '…', sub: 'The Croupier and the crowd' });
  return sec('The Vaults', run) + sec('The Order', ex) + sec('Town', town);
}
function recordsSheet() {
  const r = S.vrec;
  let h = `<div class="card"><h3>Your Records</h3><p>Deepest stratum: <b>${r.best}</b></p><p>Delves: ${r.runs}</p><p>Marks earned, all time: ${fmt(r.marks)}</p><p>Marks banked: ${fmt(S.marks)}</p></div>`;
  h += `<p class="muted small">Every fifth stratum you reach for the first time pays a free Jackpot-grade item.</p>`;
  h += '<h4 class="sh4">Rules the Order can add</h4>' + Object.values(VAULT_MODS).map(m => `<p class="small"><b>${esc(m.n)}</b> · ${esc(m.d)}</p>`).join('');
  openSheet('Records', h);
}

/* --- delve state --- */
function pickBiome() {
  const opts = VAULT_BIOMES.filter(locUnlocked), loc = pick(opts.length ? opts : ['eplaotune']);
  return { loc, z: Math.floor(rnd() * LOCS[loc].zones.length) };
}
function biomeEnemies() {
  const set = new Set(); LOCS[S.delve.biome.loc].zones.forEach(z => z.enemies.forEach(e => set.add(e)));
  return [...set].filter(id => !ENEMIES[id].boss && !ENEMIES[id].elite);
}
function delveArt() { const b = S.delve && S.delve.biome; return b ? LOCS[b.loc].zones[b.z].art : LOCS.vault.art; }
function delveLv(extra) { return Math.max(1, maxLv() - 2 + (S.delve.s - 1) + (extra || 0)); }
function delveHeader() {
  const d = S.delve, b = d.biome;
  return { name: `The Vaults · Stratum ${d.s}`, sub: `${LOCS[b.loc].n} replica · ${d.cleared ? 'cleared' : d.f >= 4 ? 'boss floor' : 'floor ' + d.f + ' of 3'}` };
}
function startDelve() {
  S.delve = { s: 1, f: 1, marks: 0, mods: [], boons: [], doors: null, biome: pickBiome(), cleared: false };
  S.vrec.runs++; S.place = 'delve';
  addLog('The Vaults · Stratum 1', 'chapter small');
  addLog(esc(`The lift drops you into a replica of ${LOCS[S.delve.biome.loc].n}, grown inside a stolen vault. Somewhere above, a crowd cheers.`), 'nar');
  save(); render();
}
function weightedDoor() {
  const ks = Object.keys(VAULT_DOORS), tot = ks.reduce((a, k) => a + VAULT_DOORS[k].w, 0);
  let r = rnd() * tot; for (const k of ks) { r -= VAULT_DOORS[k].w; if (r <= 0) return k; } return 'battle';
}
function rollDoors() {
  const out = [];
  let guard = 0;
  while (out.length < 3 && guard++ < 50) { const t = weightedDoor(); if (!out.includes(t)) out.push(t); }
  if (!out.some(t => t === 'battle' || t === 'elite')) out[0] = 'battle';
  return out;
}
function modList(mods) { return mods.map(m => `<p class="small rule"><b>${esc(VAULT_MODS[m].n)}</b> · ${esc(VAULT_MODS[m].d)}</p>`).join(''); }
function boonList() { const d = S.delve; return d.boons.length ? sec('Blessings', d.boons.map(b => `<p class="small boon"><b>${esc(VAULT_BOONS[b].n)}</b> · ${esc(VAULT_BOONS[b].d)}</p>`).join('')) : ''; }
function delveActions() {
  const d = S.delve;
  if (!d) { S.place = 'hub'; return vaultHubActions(); }
  let h = '';
  if (d.cleared) {
    const next = Object.keys(VAULT_MODS).filter(m => !d.mods.includes(m));
    h += B(`Descend to stratum ${d.s + 1}`, () => descend(), { cls: 'story', icon: '▼', sub: `${next.length ? 'The Order adds a new rule.' : 'Enemies grow stronger.'} Medics restore 30% HP on the way. ${d.marks} marks at stake.` });
    h += B(`Cash out with ${d.marks} marks`, () => endDelve('cash'), { cls: 'primary', icon: '◆', sub: 'End the run and keep everything' });
    return sec(`Stratum ${d.s} cleared`, h) + sec('Rules in effect', d.mods.length ? modList(d.mods) : '<p class="muted small">None yet.</p>') + boonList();
  }
  if (d.f >= 4) h += B('Enter the boss vault', () => runDoor('boss'), { cls: 'story', icon: '☠', sub: `A replica of a famous foe · Lv ${delveLv(1)}` });
  else {
    if (!d.doors) { d.doors = rollDoors(); save(); }
    d.doors.forEach(t => { const D = VAULT_DOORS[t]; h += B(D.n, () => runDoor(t), { icon: D.icon, sub: D.d }); });
  }
  h += `<div class="depth">${[1, 2, 3, 4].map(i => `<i class="${i < d.f ? 'on' : ''}"></i>`).join('')}</div>`;
  const opt = B('Use an item', () => bagSheet(), { icon: '+', sub: 'Heal between floors' }) + B('Abandon the delve', () => abandonDelve(), { icon: '◂', sub: `Leave now and keep half: ${Math.floor(d.marks / 2)} marks` });
  return sec(d.f >= 4 ? 'Boss floor' : `Floor ${d.f} · choose a door`, h) + (d.mods.length ? sec('Rules in effect', modList(d.mods)) : '') + boonList() + sec('Options', opt);
}
function boonEffects() {
  const out = { buff: {}, bp: 0, crit: 0, mend: 0 };
  (S.delve ? S.delve.boons : []).forEach(b => {
    const v = VAULT_BOONS[b];
    if (v.buff) for (const [k, m] of Object.entries(v.buff)) out.buff[k] = (out.buff[k] || 1) * m;
    out.bp += v.bp || 0; out.crit += v.crit || 0; out.mend += v.mend || 0;
  });
  return out;
}
function delveBattle(t) {
  const d = S.delve, pool = biomeEnemies(), lv = delveLv(t === 'elite' ? 1 : 0);
  let list = [], eliteIdx = -1;
  if (t === 'boss') {
    list.push([pick(VAULT_BOSSES), delveLv(1)]);
    if (d.mods.includes('twin')) { list.push([pick(pool), delveLv(1)]); eliteIdx = 1; }
    list.push([pick(pool), lv]);
  } else {
    const n = t === 'elite' ? 2 : 1 + (rnd() < 0.6 ? 1 : 0) + (rnd() < 0.3 ? 1 : 0);
    for (let i = 0; i < n; i++) list.push([pick(pool), lv]);
    if (t === 'elite') eliteIdx = 0;
  }
  if (d.mods.includes('reinforce')) list.push([pick(pool), lv]);
  list = list.slice(0, 4);
  const be = boonEffects();
  return battle(list, { delve: true, noFlee: true, mods: d.mods.slice(), eliteIdx, bossHp: t === 'boss' ? 0.75 + 0.12 * (d.s - 1) : 0, replica: t === 'boss', boonBuff: be.buff, bpBonus: be.bp, critBonus: be.crit, mend: be.mend, boss: t === 'boss' });
}
async function runDoor(t) {
  if (busy) return; busy = true;
  try {
    const d = S.delve;
    if (t === 'battle' || t === 'elite' || t === 'boss') {
      const r = await delveBattle(t);
      if (r === 'lose') { endDelve('dead'); return; }
      const gain = t === 'boss' ? 60 + d.s * 20 : t === 'elite' ? 25 + d.s * 8 : 10 + d.s * 4;
      d.marks += gain; addLog(`+${gain} marks · ${d.marks} at stake.`, 'sys loot');
      if (t === 'boss') {
        d.cleared = true; S.vrec.best = Math.max(S.vrec.best, d.s);
        addLog(esc(`Stratum ${d.s} cleared. The crowd goes wild.`), 'sys join');
        if (d.s % 5 === 0 && !S.vrec['m' + d.s]) {
          S.vrec['m' + d.s] = 1;
          const id = registerVaultItem(genVaultItem(maxLv() + d.s, 'legendary')); bagAdd(id);
          addLog(`Milestone prize: <b>${esc(ITEMS[id].n)}</b>.`, 'sys join');
        }
      }
    } else if (t === 'cache') {
      if (rnd() < 0.18) {
        addLog(esc('The cache lid snaps open on its own. It has teeth. It was never a cache.'), 'nar event');
        const r = await delveBattle('battle'); if (r === 'lose') { endDelve('dead'); return; }
      }
      const gain = 15 + d.s * 6, cr = maxLv() * ri(10, 18); d.marks += gain; S.cr += cr;
      const it = pick(lootPool(maxLv())); bagAdd(it);
      addLog(esc(`Inside: ${gain} marks, ${cr} credits and a ${ITEMS[it].n}.`), 'sys loot');
    } else if (t === 'rest') {
      S.party.forEach(id => { const cs = charStats(id), c = S.crew[id]; if (c.hp <= 0) c.hp = 1; c.hp = Math.min(cs.mhp, c.hp + Math.round(cs.mhp * 0.4)); c.mp = Math.min(cs.mmp, c.mp + Math.round(cs.mmp * 0.4)); });
      addLog(esc('A lounge behind one-way glass. Overpriced drinks, free bandages. The crew catches its breath.'), 'nar');
    } else if (t === 'boon') {
      const opts = Object.keys(VAULT_BOONS).filter(b => !d.boons.includes(b)).sort(() => rnd() - 0.5).slice(0, 2);
      if (opts.length) {
        addLog(esc('A shrine of gold dice and burning credit chips. Two offerings glow. You may take one.'), 'nar');
        const i = await choose(opts.map(b => ({ l: VAULT_BOONS[b].n, sub: VAULT_BOONS[b].d })));
        d.boons.push(opts[i]); addLog(`Blessing: <b>${esc(VAULT_BOONS[opts[i]].n)}</b>.`, 'sys join');
      } else addLog(esc('The shrine is empty. You already carry every blessing it had.'), 'nar');
    } else if (t === 'gamble') {
      addLog(`<span class="sp" style="--sc:#c8442e">The Dealer</span>${esc(d.marks >= 10 ? 'Feeling lucky? Everything you’re carrying. One flip.' : 'Empty pockets? House gives you a free flip. Twenty marks or nothing.')}`, 'say');
      const i = await choose(d.marks >= 10
        ? [{ l: 'Bet it all', sub: `Win: ${d.marks * 2} marks · lose: ${Math.floor(d.marks / 2)} marks` }, { l: 'Walk away', sub: 'The dealer shrugs' }]
        : [{ l: 'Take the free flip', sub: '20 marks or nothing' }, { l: 'Walk away', sub: 'The dealer shrugs' }]);
      if (i === 0) {
        const win = rnd() < 0.5;
        if (d.marks >= 10) d.marks = win ? d.marks * 2 : Math.floor(d.marks / 2); else if (win) d.marks += 20;
        addLog(esc(win ? `The coin lands your way. ${d.marks} marks at stake.` : `The coin lands wrong. ${d.marks} marks at stake.`), 'sys ' + (win ? 'join' : 'loot'));
      }
    }
    if (t !== 'boss' && S.delve) { d.f++; d.doors = null; }
    save(); render();
  } finally { busy = false; }
}
function descend() {
  const d = S.delve;
  d.s++; d.f = 1; d.cleared = false; d.doors = null; d.biome = pickBiome();
  S.party.forEach(id => { const cs = charStats(id), c = S.crew[id]; if (c.hp <= 0) c.hp = 1; c.hp = Math.min(cs.mhp, c.hp + Math.round(cs.mhp * 0.3)); c.mp = Math.min(cs.mmp, c.mp + Math.round(cs.mmp * 0.3)); });
  const pool = Object.keys(VAULT_MODS).filter(m => !d.mods.includes(m));
  addLog(esc(`The Vaults · Stratum ${d.s}`), 'chapter small');
  if (pool.length) { const m = pick(pool); d.mods.push(m); addLog(`New rule: <b>${esc(VAULT_MODS[m].n)}</b>. ${esc(VAULT_MODS[m].d)}`, 'sys obj'); }
  addLog(esc(`Order medics patch the crew up on the lift down (+30% HP and MP). This vault holds a replica of ${LOCS[d.biome.loc].n}.`), 'nar');
  save(); render();
}
async function abandonDelve() {
  if (await confirmBox(`Leave the Vaults now? You keep half your marks (${Math.floor(S.delve.marks / 2)}).`, 'Leave')) endDelve('quit');
}
function endDelve(reason) {
  const d = S.delve; if (!d) return;
  const kept = reason === 'cash' ? d.marks : Math.floor(d.marks / 2);
  S.marks += kept; S.vrec.marks += kept;
  S.delve = null; S.place = 'hub'; S.vstock = null; healAll();
  addLog(esc(reason === 'dead' ? `Order medics drag the crew out of stratum ${d.s}. You keep half your marks: ${kept}.` : reason === 'quit' ? `You ride the lift up with half your marks: ${kept}.` : `The Croupier counts out ${kept} marks. The crowd boos you for leaving. They’ll get over it.`), 'sys join');
  show('scr-game'); save(); render();
}

/* --- generated gear --- */
const V_BASES = { pistol: ['Hand-Cannon', 'Blaster', 'Repeater'], rifle: ['Longrifle', 'Carbine', 'Lancer'], blade: ['Saber', 'Cleaver', 'Edge'], heavy: ['Siege Gun', 'Thunder-Pod', 'Mauler'], tool: ['Arc Gauntlet', 'Shock Spanner', 'Injector'], focus: ['Prism', 'Orb', 'Lens'] };
const V_ARMOR = ['Strongbox Plate', 'Croupier’s Coat', 'Order Mantle', 'Pit Harness'];
const V_ACC = ['Lucky Chip', 'Skeleton Key', 'Black Die', 'Croupier’s Ring'];
const V_AFF = [['crit', 0.35, 'of Loaded Dice'], ['spd', 0.35, 'of the Swift'], ['dex', 0.4, 'of the Marksman'], ['str', 0.4, 'of the Brute'], ['int', 0.4, 'of the Mind'], ['end', 0.35, 'of the Unbroken'], ['regen', 0, 'of Mending'], ['mpRegen', 0, 'of Focus'], ['resist', 0, 'of Warding']];
const V_RAR = { common: { pre: 'Vault', mult: 1, aff: 0, price: 40 }, rare: { pre: 'Lawless', mult: 1.06, aff: 1, price: 85 }, legendary: { pre: 'Jackpot', mult: 1.14, aff: 2, price: 170 } };
function genVaultItem(lv, rarity) {
  const R = V_RAR[rarity], kind = pick(['weapon', 'weapon', 'armor', 'acc']);
  const affs = [...V_AFF].sort(() => rnd() - 0.5).slice(0, R.aff + (kind === 'acc' ? 1 : 0));
  const bon = {};
  affs.forEach(([k, sc]) => {
    if (k === 'regen') bon.regen = 0.03;
    else if (k === 'mpRegen') bon.mpRegen = 2 + Math.floor(lv / 10);
    else if (k === 'resist') bon.resist = pick(['fire', 'cryo', 'shock', 'psi']);
    else bon[k] = Math.max(2, Math.round(lv * sc * (rarity === 'legendary' ? 1.3 : 1)));
  });
  const suffix = affs.length ? ' ' + affs[0][2] : '';
  let it;
  if (kind === 'weapon') {
    const cat = pick(Object.keys(V_BASES)), atk = Math.round((6 + lv * 2.15) * R.mult), ty = pick(Object.keys(DMG));
    it = { n: `${R.pre} ${pick(V_BASES[cat])}${suffix}`, k: 'weapon', cat, atk, ty, tier: 6 };
    if (cat === 'tool' || cat === 'focus') it.int = Math.round(atk * 0.7);
  } else if (kind === 'armor') {
    it = { n: `${R.pre} ${pick(V_ARMOR)}${suffix}`, k: 'armor', arm: Math.round((4 + lv * 1.65) * R.mult), tier: 6 };
  } else {
    it = { n: `${R.pre} ${pick(V_ACC)}${suffix}`, k: 'acc' };
  }
  Object.assign(it, { bon, price: lv * 40, vault: true, rarity, mcost: R.price + Math.round(lv * 1.5), desc: `Vault gear, Lv ${lv}.` });
  return it;
}
function registerVaultItem(def) {
  const id = 'v_' + Date.now().toString(36) + Math.floor(rnd() * 1e6).toString(36);
  const it = Object.assign({}, def); delete it.mcost;
  S.vitems[id] = it; ITEMS[id] = it; return id;
}
function stockRarity() {
  const b = S.vrec.best, r = rnd();
  if (r < Math.min(0.35, 0.04 + b * 0.025)) return 'legendary';
  if (r < Math.min(0.75, 0.3 + b * 0.04)) return 'rare';
  return 'common';
}
function refreshStock() {
  const lv = maxLv() + Math.floor(S.vrec.best / 2);
  S.vstock = Array.from({ length: 4 }, () => genVaultItem(lv, stockRarity()));
}
const V_SUPPLIES = [['trauma', 20], ['psicell2', 12], ['lazarus', 18], ['medgel2', 6]];
function exchangeSheet() {
  if (!S.vstock) refreshStock();
  let h = `<p class="muted">The Order’s prize counter. Gear is made to your level, and deeper records bring rarer stock. You have <b>${fmt(S.marks)} marks</b>.</p>`;
  h += '<h4 class="sh4">Prize Gear</h4>';
  S.vstock.forEach((it, i) => {
    if (!it) { h += '<div class="locked">Sold</div>'; return; }
    h += `<div class="row-item"><div><b class="rar-${it.rarity}">${esc(it.n)}</b><div class="muted small">${itemSummary(it)}${it.k === 'acc' ? '' : bonText(it.bon)} ${whoCanUse(it)}</div>${gearDeltaDef(it)}</div>${B(`${it.mcost} mk`, () => {
      S.marks -= it.mcost; const id = registerVaultItem(it); bagAdd(id); S.vstock[i] = null; save(); exchangeSheet();
    }, { dis: S.marks < it.mcost, cls: 'small' })}</div>`;
  });
  h += B('Restock the counter', () => { S.marks -= 15; refreshStock(); save(); exchangeSheet(); }, { dis: S.marks < 15, sub: '15 marks · four new items' });
  h += '<h4 class="sh4">Supplies</h4>';
  V_SUPPLIES.forEach(([id, c]) => {
    h += `<div class="row-item"><div><b>${esc(ITEMS[id].n)}</b><span class="own">${S.bag[id] ? '×' + S.bag[id] : ''}</span><div class="muted small">${esc(ITEMS[id].d)}</div></div>${B(`${c} mk`, () => { S.marks -= c; bagAdd(id); save(); exchangeSheet(); }, { dis: S.marks < c, cls: 'small' })}</div>`;
  });
  openSheet('Vault Exchange', ''); sheetMount(h);
}

/* ============================================================
   SCARE OFF weak enemies · AUTO-BATTLE
   ============================================================ */
const SCARE_MODES = { ask: 'Ask each time', auto: 'Always scare them off', off: 'Never (always fight)' };
async function maybeScare(list) {
  const mode = OPT.scare || 'ask';
  if (mode === 'off') return null;
  const ids = list.map(e => Array.isArray(e) ? e[0] : e);
  const lvs = list.map((e, i) => Array.isArray(e) && e[1] ? e[1] : ENEMIES[ids[i]].lv);
  const top = Math.max(...lvs), pl = partyLv();
  if (pl < top + 5) return null;
  const xp = Math.max(1, Math.round(ids.reduce((a, id, i) => a + enemyStats(ENEMIES[id], lvs[i]).xp, 0) * 0.4 * DIFF[S.diff || 'normal'].xp));
  const names = [...new Set(ids.map(id => ENEMIES[id].n))].join(' and ');
  if (mode === 'ask') {
    addLog(esc(`${names} (Lv ${top}) ${ids.length > 1 ? 'spot' : 'spots'} your crew and hesitate. They know they’re outmatched.`), 'nar event');
    const i = await choose([{ l: 'Scare them off', sub: `+${xp} XP · no credits or drops`, cls: 'primary' }, { l: 'Fight anyway', sub: 'Full XP, credits and drops' }]);
    if (i === 1) return null;
  }
  addLog(esc(`${pick(['Your crew squares up.', 'Jaxon cracks his knuckles.', 'Ole Betsy whines as she charges.', 'Celeste’s hands start to glow.', 'KAT announces a threat assessment, loudly.'])} The ${names} turn tail and run. +${xp} XP.`), 'sys loot');
  Object.keys(S.crew).filter(recruited).forEach(id => gainXp(id, xp * (inParty(id) ? 1 : 0.5)).forEach(l => addLog(esc(l), 'sys lvl')));
  save(); renderPartyStrip();
  return 'win';
}
function scareSheet() {
  let h = '<p class="muted">When your party averages 5 or more levels above every enemy in a random encounter, they can be scared off for 40% of the XP. Never applies to bosses, bounties, story fights or the Vaults.</p>';
  Object.entries(SCARE_MODES).forEach(([k, n]) => { h += B(n, () => { OPT.scare = k; saveOpts(); scareSheet(); }, { cls: (OPT.scare || 'ask') === k ? 'on' : '', right: (OPT.scare || 'ask') === k ? '✓' : '' }); });
  h += B('Back', () => systemSheet(), { cls: 'ghost' });
  openSheet('Weak Enemies', ''); sheetMount(h);
}

/* auto-battle: one decision per turn */
function autoCmd(m) {
  const sk = skillsOf(m.id).map(s => [s, SKILLS[s]]).filter(([, k]) => m.mp >= skillCost(k));
  const foes = BT.enemies.filter(e => !e.dead), allies = BT.party.filter(p => !p.dead), dead = BT.party.filter(p => p.dead);
  const noItems = (BT.opts.mods || []).includes('scarcity');
  const shrouded = (BT.opts.mods || []).includes('shrouded');
  const kw = e => shrouded ? e.seenW : knownWeak(e.id);
  // 1. revive
  const rev = sk.find(([, k]) => k.k === 'revive');
  if (dead.length && rev) return { type: 'skill', skill: rev[0], target: dead[0], boost: 0 };
  if (dead.length && !noItems && S.bag.lazarus && !BT.party.some(p => !p.dead && skillsOf(p.id).includes('lazarus') && p !== m)) return { type: 'item', item: 'lazarus', target: dead[0], boost: 0 };
  // 2. heal
  const low = allies.filter(p => p.hp < p.mhp * 0.45).sort((a, b) => a.hp / a.mhp - b.hp / b.mhp);
  const healAll = sk.find(([, k]) => k.k === 'heal' && k.t === 'allAllies');
  const heal1 = sk.find(([, k]) => k.k === 'heal' && k.t !== 'allAllies');
  if (low.length >= 2 && healAll) return { type: 'skill', skill: healAll[0], boost: Math.min(m.bp, 1) };
  if (low.length && heal1) return { type: 'skill', skill: heal1[0], target: low[0], boost: Math.min(m.bp, 1) };
  if (low.length && low[0] === m && m.hp < m.mhp * 0.3 && !noItems) { const it = S.bag.medgel2 ? 'medgel2' : S.bag.medgel ? 'medgel' : null; if (it) return { type: 'item', item: it, target: m, boost: 0 }; }
  // 3. scan unknowns
  const target = foes.slice().sort((a, b) => (b.broken > 0) - (a.broken > 0) || a.sh - b.sh || a.hp - b.hp)[0];
  const known = kw(target);
  if (sk.find(([s]) => s === 'scan') && foes.some(e => kw(e).length < e.def.weak.length) && BT.round <= 2) return { type: 'skill', skill: 'scan', boost: 0 };
  // 4. hit: broken targets get boosted attacks
  const boost = target.broken > 0 ? Math.min(3, m.bp) : (m.bp >= 4 ? 1 : 0);
  if (target.broken > 0 || known.includes(m.ty)) return { type: 'attack', target, boost };
  // 5. a skill that hits a known weakness (all-enemy ones preferred with 3+ foes)
  const off = sk.filter(([, k]) => (k.k === 'phys' || k.k === 'tech') && skillCost(k) <= m.mp * 0.6 + 6);
  const multi = foes.length >= 3 && off.find(([, k]) => k.t === 'allEnemies' && foes.some(e => kw(e).includes(k.ty)));
  if (multi) return { type: 'skill', skill: multi[0], boost: 0 };
  const w = off.find(([, k]) => known.includes(k.ty));
  if (w) return { type: 'skill', skill: w[0], target, boost: Math.min(boost, 1) };
  // 6. probe with an untried type sometimes, otherwise attack
  const untried = off.find(([, k]) => !known.includes(k.ty) && k.ty !== m.ty && target.def.weak.length > known.length);
  if (untried && rnd() < 0.4) return { type: 'skill', skill: untried[0], target, boost: 0 };
  return { type: 'attack', target, boost };
}
function setAuto(on) {
  if (!BT) return;
  BT.auto = on;
  if (!(BT.opts.boss || BT.opts.story || BT.opts.elite)) { OPT.auto = on; saveOpts(); }
  const b = document.getElementById('bAuto'); if (b) b.classList.toggle('on', on);
  if (on && BT.active && !BT.targeting && BT.resolve) BT.resolve(autoCmd(BT.active));
  else if (!on && BT.active) drawCommands(BT.active);
}
function drawAutoTurn(m) {
  mount($('#bCmd'), `<p class="auto-note"><b>Auto-battle</b> · ${esc(m.n)} is acting.</p>` + B('Take control', () => setAuto(false), { cls: 'ghost small' }));
}
