/* ============================================================
   THE SACRED SHROUD — hidden test menu
   Unlock: System → tap the build number 5 times.
   ============================================================ */
const BUILD = 6;
const DEV_BACKUP_KEY = 'sacredshroud_dev_backup';

/* --- unlock from the System sheet --- */
const _systemSheetDev = systemSheet;
systemSheet = function () {
  _systemSheetDev();
  const body = $('#sheetBody');
  if (OPT.dev) {
    const top = document.createElement('div'); body.prepend(top);
    mount(top, B('Test Menu', () => devMenu(), { cls: 'story', icon: '⚙', sub: 'Jump around, spawn fights, give yourself things' }));
  }
  const p = document.createElement('p');
  p.className = 'muted small build'; p.textContent = `Build ${BUILD}`;
  let taps = 0, timer = null;
  p.addEventListener('click', () => {
    taps++; clearTimeout(timer); timer = setTimeout(() => taps = 0, 1500);
    if (OPT.dev) { p.textContent = `Build ${BUILD} · developer tools are on`; return; }
    if (taps >= 5) { OPT.dev = true; saveOpts(); systemSheet(); sysLine('Developer tools unlocked. Find the Test Menu at the top of System.'); }
    else if (taps >= 2) p.textContent = `Build ${BUILD} · ${5 - taps} more`;
  });
  body.appendChild(p);
};
const _renderDev = render;
render = function () {
  _renderDev();
  if (S && (OPT.devGod || OPT.devKO)) { const ch = $('#hudCh'); if (ch && !ch.textContent.includes('TEST')) ch.textContent += ' · TEST'; }
};

/* --- helpers --- */
function devSetLevel(lv, lowerToo) {
  lv = Math.max(1, Math.min(40, lv | 0));
  Object.keys(S.crew).filter(recruited).forEach(id => {
    const c = S.crew[id];
    if (c.lv < lv) { while (c.lv < lv) { c.xp = xpNeed(c.lv); gainXp(id, 0); } }
    else if (lowerToo && c.lv > lv) { c.lv = lv; c.xp = 0; }
  });
  healAll();
}
function devGear(tier) {
  Object.keys(S.crew).filter(recruited).forEach(id => {
    const c = S.crew[id], w = ITEMS[c.eq.weapon];
    if (w.unique) S.upgrades[c.eq.weapon] = Math.max(S.upgrades[c.eq.weapon] || 0, Math.min(5, tier - 1));
    else c.eq.weapon = bestGear(w.cat, tier, 'weapon') || c.eq.weapon;
    c.eq.armor = bestGear(null, tier, 'armor') || c.eq.armor;
  });
  healAll();
}
function devVal(id) { const el = document.getElementById(id); return el ? el.value : ''; }
function devNum(id, d) { const n = parseInt(devVal(id), 10); return isNaN(n) ? d : n; }
function devDone(msg) { save(); closeSheet(); show('scr-game'); render(); if (msg) sysLine('[Test] ' + msg); }

/* --- main menu --- */
function devMenu() {
  let h = `<p class="muted small">Test tools change your save. Make a backup first if you care about this playthrough.</p>`;
  h += `<div class="row2" id="devBk"></div>`;
  h += '<h4 class="sh4">Story</h4>';
  h += B('Jump to a story step', () => devJumpSheet(), { icon: '★', sub: 'Any chapter, at the start or right before the boss' });
  h += B('Play a cutscene', () => devSceneSheet(), { icon: '▶', sub: 'Preview any scene without its rewards' });
  h += B('Crew stories', () => devCrewSheet(), { icon: '◉', sub: 'Set which part each crew story is on' });
  h += '<h4 class="sh4">Battle</h4>';
  h += B('Fight anything', () => devFightSheet(), { icon: '⚔', sub: 'Any enemy, any level, any group' });
  h += B(`God mode: ${OPT.devGod ? 'On' : 'Off'}`, () => { OPT.devGod = !OPT.devGod; saveOpts(); devMenu(); render(); }, { cls: OPT.devGod ? 'on' : '', sub: 'Your crew takes no damage' });
  h += B(`One-hit kills: ${OPT.devKO ? 'On' : 'Off'}`, () => { OPT.devKO = !OPT.devKO; saveOpts(); devMenu(); render(); }, { cls: OPT.devKO ? 'on' : '', sub: 'Every hit you land is lethal' });
  h += '<h4 class="sh4">Party & world</h4>';
  h += `<div class="devrow"><label for="devLv">Party level</label><input id="devLv" type="number" min="1" max="40" value="${maxLv()}"><label class="devchk"><input id="devLower" type="checkbox"> allow lowering</label></div>`;
  h += `<div id="devLvB"></div>`;
  h += B('Give a gear set for this level', () => { const t = Math.min(6, Math.floor((maxLv() - 1) / 4) + 1); devGear(t); devDone(`Equipped tier ${t} weapons and armor.`); }, { icon: '⚙', sub: 'Best shop weapon and armor for each crew member' });
  h += B('Give items', () => devItemSheet(), { icon: '+', sub: 'Any item, credits, scrap or marks' });
  h += B('Add every crew member', () => { CREW_ORDER.forEach(addMember); S.flags.ryder_avail = 1; S.flags.celeste_avail = 1; devDone('All six crew have joined.'); }, { icon: '◕' });
  h += B('Full heal', () => { healAll(); devDone('Party healed.'); }, { icon: '♥' });
  h += B(`Unlock every planet: ${S.flags.allLocs ? 'On' : 'Off'}`, () => { S.flags.allLocs = !S.flags.allLocs; save(); devMenu(); }, { cls: S.flags.allLocs ? 'on' : '', sub: 'Shows every destination on the galaxy map' });
  h += B('Teleport', () => devTeleSheet(), { icon: '✦', sub: 'Go anywhere instantly, no space encounters' });
  h += B('Show all tutorial tips again', () => { S.tips = {}; devDone('Tips reset.'); }, { icon: '?' });
  h += B('Turn developer tools off', () => { OPT.dev = false; OPT.devGod = false; OPT.devKO = false; saveOpts(); systemSheet(); }, { cls: 'ghost' });
  openSheet('Test Menu', ''); sheetMount(h);
  mount($('#devLvB'), B('Set level', () => { devSetLevel(devNum('devLv', maxLv()), document.getElementById('devLower').checked); devDone(`Party set to level ${devNum('devLv', maxLv())}.`); }, { cls: 'small' }));
  let bk = null; try { bk = localStorage.getItem(DEV_BACKUP_KEY); } catch (e) {}
  mount($('#devBk'), B('Back up this save', () => { try { localStorage.setItem(DEV_BACKUP_KEY, JSON.stringify(S)); } catch (e) {} devMenu(); sysLine('[Test] Backup saved.'); }, { cls: 'small' })
    + B('Restore backup', async () => { if (!await confirmBox('Replace your current game with the backup?', 'Restore')) return; try { S = migrate(JSON.parse(localStorage.getItem(DEV_BACKUP_KEY))); } catch (e) { return; } save(); show('scr-game'); clearLog(); sysLine('[Test] Backup restored.'); render(); }, { cls: 'small', dis: !bk }));
}

/* --- story jump --- */
function devJumpSheet() {
  let h = '<p class="muted small">Sets up everything before that step: crew, unlocked places, levels and gear for the recommended level. “Before the boss” puts you at the boss button with the dungeon already cleared.</p>';
  MAIN.forEach((st, i) => {
    if (!st.loc) { h += `<div class="card"><h3>Epilogue</h3><div id="dj${i}"></div></div>`; return; }
    h += `<div class="card"><h3>${st.ch === 0 ? '' : 'Ch ' + st.ch + ' · '}${esc(st.id)} <span class="tag">Lv ${st.lv}</span></h3><p class="small muted">${esc(st.obj)} · ${esc(LOCS[st.loc].n)}</p><div class="row2" id="dj${i}"></div></div>`;
  });
  openSheet('Jump to a story step', h);
  MAIN.forEach((st, i) => {
    const el = $('#dj' + i);
    if (!st.loc) { mount(el, B('Jump to after the ending', () => devJump(i, 'start'), { cls: 'small' })); return; }
    mount(el, B('Start of step', () => devJump(i, 'start'), { cls: 'small' }) + B('Before the boss', () => devJump(i, 'boss'), { cls: 'small' }));
  });
}
function devJump(idx, mode) {
  const st = MAIN[idx];
  S.ms = idx; S.done = {}; S.resume = null;
  MAIN.slice(0, idx).forEach(m => { S.done[m.id] = true; if (m.zone) S.cleared[m.zone] = true; S.seen[m.id] = 1; S.seen[m.id + '_mid'] = 1; });
  MAIN.slice(idx).forEach(m => { delete S.seen[m.id]; delete S.seen[m.id + '_mid']; if (m.zone) { delete S.cleared[m.zone]; S.depth[m.zone] = 0; } });
  ['miles', 'jaxon'].forEach(addMember);
  if (idx >= 1) addMember('katey');
  if (idx >= 3) addMember('kat');
  if (idx >= 3) { S.flags.ryder_avail = 1; S.flags.celeste_avail = 1; }
  if (idx >= 6) { addMember('ryder'); addMember('celeste'); }
  const lv = st.lv || maxLv();
  devSetLevel(lv, false);
  devGear(Math.min(6, Math.floor((lv - 1) / 4) + 1));
  closeSheet(); show('scr-game'); clearLog();
  if (!st.loc) { S.loc = 'eplaotune'; S.place = 'hub'; save(); render(); sysLine('[Test] Jumped past the ending. The galaxy is open.'); return; }
  if (mode === 'boss') {
    S.seen[st.id] = 1; S.seen[st.id + '_mid'] = 1;
    S.loc = st.loc;
    if (st.zone) { const z = LOCS[st.loc].zones.find(z => z.id === st.zone); S.depth[st.zone] = z.depth; S.place = 'zone:' + st.zone; } else S.place = 'hub';
    save(); render(); sysLine(`[Test] Ready for “${st.btn}”. Objective: ${st.obj}`);
  } else {
    S.loc = null; save();
    arriveAt(st.loc).then(() => { sysLine(`[Test] Jumped to ${st.id}. Objective: ${st.obj}`); });
  }
}

/* --- cutscenes --- */
function devSceneGroups() {
  const g = { 'Prologues': [], 'Main story': [], 'Recruiting': [], 'Other': [] };
  Object.keys(SCENES).forEach(id => {
    if (id.startsWith('pro_')) g['Prologues'].push(id);
    else if (/^(ch1|m\d+|ending)/.test(id)) g['Main story'].push(id);
    else if (id.startsWith('rec_')) g['Recruiting'].push(id);
    else g['Other'].push(id);
  });
  return g;
}
function devSceneSheet() {
  let h = `<label class="devchk"><input id="devApply" type="checkbox"> also apply what the scene gives (crew, items, credits)</label>`;
  const g = devSceneGroups(), list = [];
  for (const [name, ids] of Object.entries(g)) { if (!ids.length) continue; h += `<h4 class="sh4">${name}</h4><div id="dsg${list.length}"></div>`; list.push(ids); }
  h += '<h4 class="sh4">Crew stories</h4><div id="dsc"></div><h4 class="sh4">Party chats</h4><div id="dsb"></div>';
  openSheet('Play a cutscene', h);
  const play = (lines, label) => {
    const apply = document.getElementById('devApply').checked;
    closeSheet(); show('scr-game');
    addLog(esc('[Test] ' + label), 'chapter small');
    playScene(apply ? lines : lines.filter(l => !l.replace(/^\[[^\]]*\]/, '').startsWith('~'))).then(() => { save(); render(); });
  };
  list.forEach((ids, i) => mount($('#dsg' + i), ids.map(id => B(id, () => play(SCENES[id], id), { cls: 'small' })).join('')));
  let ch = '';
  Object.entries(CREWQ).forEach(([cid, q]) => q.parts.forEach((p, n) => {
    ch += B(`${CREW[cid].short} ${n + 1}: ${p.n} (before)`, () => play(p.pre, `${q.n} · ${p.n}`), { cls: 'small' });
    ch += B(`${CREW[cid].short} ${n + 1}: ${p.n} (after)`, () => play(p.post, `${q.n} · ${p.n}`), { cls: 'small' });
  }));
  mount($('#dsc'), ch);
  mount($('#dsb'), BANTER.map(b => B(`${b.n} (${b.need.join(' + ')})`, () => play(b.lines, 'Party Chat · ' + b.n), { cls: 'small' })).join(''));
}

/* --- crew stories --- */
function devCrewSheet() {
  let h = '<p class="muted small">Pick which part each crew story is waiting on. 3 = complete (gives the ultimate skill).</p>';
  CREW_ORDER.forEach(id => {
    h += `<div class="card"><h3>${esc(CREW[id].short)} · ${esc(CREWQ[id].n)} <span class="tag">${recruited(id) ? 'joined' : 'not joined'}</span></h3><div class="row2" id="dcq_${id}"></div></div>`;
  });
  openSheet('Crew stories', h);
  CREW_ORDER.forEach(id => mount($('#dcq_' + id), [0, 1, 2, 3].map(n => B(n === 3 ? 'Done' : `Part ${n + 1}`, () => {
    addMember(id); S.cq[id] = n; if (n >= 3) S.ult[id] = 1; else delete S.ult[id]; save(); devCrewSheet();
  }, { cls: 'small ' + ((S.cq[id] || 0) === n ? 'on' : '') })).join('')));
}

/* --- fights --- */
function devFightSheet() {
  const groups = { 'Bosses': [], 'Bounties': [], 'Regular': [] };
  Object.entries(ENEMIES).sort((a, b) => a[1].lv - b[1].lv).forEach(([id, e]) => (e.boss ? groups.Bosses : e.elite ? groups.Bounties : groups.Regular).push([id, e]));
  const opts = Object.entries(groups).map(([g, list]) => `<optgroup label="${g}">${list.map(([id, e]) => `<option value="${id}">${esc(e.n)} (Lv ${e.lv})</option>`).join('')}</optgroup>`).join('');
  let h = `<div class="devrow col"><label for="devE1">Enemy</label><select id="devE1">${opts}</select></div>
    <div class="devrow col"><label for="devE2">Second enemy (optional)</label><select id="devE2"><option value="">None</option>${opts}</select></div>
    <div class="devrow"><label for="devEl">Level</label><input id="devEl" type="number" min="1" max="40" value="${maxLv()}"><label for="devEn">Copies of the first</label><input id="devEn" type="number" min="1" max="4" value="1"></div>
    <label class="devchk"><input id="devEboss" type="checkbox"> treat as a story fight (no fleeing, starts in manual)</label>
    <div id="devEgo"></div>`;
  openSheet('Fight anything', h);
  mount($('#devEgo'), B('Start the fight', () => {
    const a = devVal('devE1'), b2 = devVal('devE2'), lv = devNum('devEl', maxLv()), n = Math.max(1, Math.min(4, devNum('devEn', 1)));
    const list = []; for (let i = 0; i < n; i++) list.push([a, lv]); if (b2 && list.length < 4) list.push([b2, lv]);
    closeSheet(); show('scr-game');
    const story = document.getElementById('devEboss').checked;
    battle(list, story ? { story: true, boss: !!ENEMIES[a].boss } : { elite: false }).then(() => { save(); render(); });
  }, { cls: 'primary' }) + B('Random fight from this area', () => {
    const z = curZone() || (LOCS[S.loc].zones || [])[0]; if (!z) return;
    closeSheet(); show('scr-game'); battle(zoneEnemies(z), {}).then(() => { save(); render(); });
  }));
}

/* --- items --- */
function devItemSheet() {
  const kinds = { use: 'Consumables', weapon: 'Weapons', armor: 'Armor', acc: 'Accessories', mat: 'Materials', key: 'Key items' };
  const opts = Object.entries(kinds).map(([k, n]) => `<optgroup label="${n}">${Object.entries(ITEMS).filter(([id, it]) => it.k === k && !id.startsWith('__')).map(([id, it]) => `<option value="${id}">${esc(it.n)}</option>`).join('')}</optgroup>`).join('');
  let h = `<div class="devrow col"><label for="devIt">Item</label><select id="devIt">${opts}</select></div><div class="devrow"><label for="devItN">How many</label><input id="devItN" type="number" min="1" max="99" value="1"></div><div id="devItB"></div>
    <h4 class="sh4">Money</h4><div class="devrow"><label for="devCr">Amount</label><input id="devCr" type="number" min="1" value="5000"></div><div class="row2" id="devMoney"></div>`;
  openSheet('Give items', h);
  mount($('#devItB'), B('Give item', () => { const id = devVal('devIt'), n = Math.max(1, devNum('devItN', 1)); bagAdd(id, n); save(); sysLine(`[Test] Received ${ITEMS[id].n} ×${n}.`); }, { cls: 'primary' }));
  mount($('#devMoney'), B('Credits', () => { S.cr += devNum('devCr', 0); save(); render(); }, { cls: 'small' }) + B('Scrap', () => { S.scrap += devNum('devCr', 0); save(); }, { cls: 'small' }) + B('Vault marks', () => { S.marks += devNum('devCr', 0); save(); }, { cls: 'small' }));
}

/* --- teleport --- */
function devTeleSheet() {
  let h = '<p class="muted small">Instant travel. Arrival cutscenes still play if the story is waiting for one.</p>';
  openSheet('Teleport', h + '<div id="devTp"></div>');
  mount($('#devTp'), TRAVEL_ORDER.map(id => B(LOCS[id].n, () => { closeSheet(); show('scr-game'); arriveAt(id); }, { sub: `${LOCS[id].region}${locUnlocked(id) ? '' : ' · normally locked'}` })).join(''));
}
