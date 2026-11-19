/* ============================================================
   THE SACRED SHROUD — core data: types, classes, crew, skills,
   gear, items, enemies
   ============================================================ */

const DMG = {
  blade:    { ab: 'BLD', n: 'Blade',     c: '#d9d2c3' },
  ballistic:{ ab: 'BAL', n: 'Ballistic', c: '#f2a33a' },
  energy:   { ab: 'NRG', n: 'Energy',    c: '#ff5fa2' },
  shock:    { ab: 'SHK', n: 'Shock',     c: '#f5e04a' },
  fire:     { ab: 'FIR', n: 'Fire',      c: '#ff5a2e' },
  cryo:     { ab: 'CRY', n: 'Cryo',      c: '#6fd8ff' },
  psi:      { ab: 'PSI', n: 'Psi',       c: '#b48cff' }
};

/* ---------- classes: base stats at level 1 and growth per level ---------- */
const CLASSES = {
  hunter: { n: 'Treasure Hunter', wt: ['pistol', 'blade'],
    base: { hp: 120, mp: 30, str: 12, dex: 15, spd: 14, int: 9, end: 10, arm: 8 },
    grow: { hp: 12, mp: 3, str: 1.7, dex: 2.0, spd: 1.6, int: 1.0, end: 1.2, arm: 1.0 } },
  vanguard: { n: 'Vanguard', wt: ['rifle', 'heavy'],
    base: { hp: 150, mp: 22, str: 14, dex: 10, spd: 9, int: 7, end: 14, arm: 12 },
    grow: { hp: 16, mp: 2, str: 1.9, dex: 1.2, spd: 1.0, int: 0.7, end: 1.8, arm: 1.6 } },
  medtech: { n: 'Medtech', wt: ['pistol', 'tool'],
    base: { hp: 105, mp: 42, str: 9, dex: 11, spd: 12, int: 15, end: 10, arm: 7 },
    grow: { hp: 10, mp: 4.5, str: 1.0, dex: 1.3, spd: 1.4, int: 2.1, end: 1.1, arm: 0.9 } },
  automaton: { n: 'Automaton', wt: ['tool', 'heavy'],
    base: { hp: 125, mp: 36, str: 11, dex: 12, spd: 10, int: 14, end: 12, arm: 11 },
    grow: { hp: 13, mp: 3.6, str: 1.3, dex: 1.3, spd: 1.1, int: 1.9, end: 1.4, arm: 1.4 } },
  ace: { n: 'Ace Gunslinger', wt: ['pistol', 'rifle'],
    base: { hp: 112, mp: 28, str: 12, dex: 16, spd: 16, int: 8, end: 9, arm: 8 },
    grow: { hp: 11, mp: 2.8, str: 1.6, dex: 2.1, spd: 2.0, int: 0.8, end: 1.0, arm: 0.9 } },
  pyrepsion: { n: 'Pyrepsion', wt: ['focus', 'blade'],
    base: { hp: 98, mp: 48, str: 8, dex: 11, spd: 13, int: 17, end: 9, arm: 6 },
    grow: { hp: 9.5, mp: 5, str: 0.9, dex: 1.2, spd: 1.5, int: 2.3, end: 1.0, arm: 0.8 } }
};

/* ---------- the crew (playable) ---------- */
const CREW = {
  miles: { n: 'Miles Mason', short: 'Miles', cls: 'hunter', col: '#f2a33a', glyph: 'MM',
    title: 'Bounty & Treasure Hunter',
    blurb: 'Captain of the Last Hope, a ship he "inherited." Fast hands, faster mouth, and a ten-year-old phaser named Ole Betsy that has never once let him down.',
    talent: { n: 'Appraiser', d: 'Sells loot for 25% more and finds extra credits while exploring.' },
    start: { weapon: 'w_betsy', armor: 'a_jacket', acc: null } },
  jaxon: { n: 'Jaxon Valkenburg', short: 'Jaxon', cls: 'vanguard', col: '#5fa0ff', glyph: 'JV',
    title: 'Second Hand Man',
    blurb: 'Miles\' right arm and the reason the crew is still breathing. Calls the captain "sir" whether he deserves it or not. Doesn\'t talk about the years before the Last Hope.',
    talent: { n: 'Sentry', d: 'Enemies rarely get the drop on a party he\'s in. Fewer ambushes.' },
    start: { weapon: 'w_carbine', armor: 'a_vest0', acc: null } },
  katey: { n: 'Katey Tiller', short: 'Katey', cls: 'medtech', col: '#3fd0c9', glyph: 'KT',
    title: 'Ship\'s Scientist & Doctor',
    blurb: 'Two jobs, one paycheck, and a workshop full of half-finished miracles. Animals love her. Miles tolerates her gadgets. She is usually right about both.',
    talent: { n: 'Field Medic', d: 'Patches the party up after every victory, restoring a little HP.' },
    start: { weapon: 'w_wrench', armor: 'a_jacket', acc: null } },
  kat: { n: 'KAT', short: 'KAT', cls: 'automaton', col: '#b48cff', glyph: 'KA',
    title: 'Cybernetic Automaton Translator',
    blurb: 'The Last Hope\'s ship mind, given a body. Polite, precise, and quietly unsure why her oldest memories are encrypted with a key she has never been given.',
    talent: { n: 'Deep Scan', d: 'Reveals one weakness of every enemy at the start of each battle.' },
    start: { weapon: 'w_wrench', armor: 'a_vest0', acc: null } },
  ryder: { n: 'Ryder', short: 'Ryder', cls: 'ace', col: '#ff5a2e', glyph: 'RY',
    title: 'Ace Pilot & Deserter',
    blurb: 'No last name, no flag, no patience. Flew forty sorties for the Lost Soul Federation before deciding revenge was a bad business to be in. They disagree.',
    talent: { n: 'Hotshot Pilot', d: 'Dodges most hostile ships while traveling between systems.' },
    start: { weapon: 'w_revolver', armor: 'a_duster', acc: null } },
  celeste: { n: 'Celeste Gallagher', short: 'Celeste', cls: 'pyrepsion', col: '#ff7ab8', glyph: 'CG',
    title: 'Survivor of the Pyre',
    blurb: 'The Cleansed burned her alive and she did not die, which makes her holy to them and hunted by them. The fire never left. She has learned to aim it.',
    talent: { n: 'Premonition', d: 'Sees trouble coming. The party strikes first more often.' },
    start: { weapon: 'w_lens', armor: 'a_duster', acc: null } }
};
const CREW_ORDER = ['miles', 'jaxon', 'katey', 'kat', 'ryder', 'celeste'];

/* ---------- skills ----------
   t: enemy | allEnemies | ally | allAllies | self | deadAlly
   k: phys | tech | heal | buff | revive | scan | steal | bp | cleanse            */
const SKILLS = {
  // Treasure Hunter
  quickdraw:  { n: 'Quickdraw', mp: 4, t: 'enemy', k: 'phys', ty: 'ballistic', p: 0.7, hits: 2, d: 'Two fast ballistic shots.' },
  pilfer:     { n: 'Pilfer', mp: 3, t: 'enemy', k: 'steal', ty: 'blade', p: 0.5, d: 'Light blade hit that may lift an item or credits.' },
  smokebomb:  { n: 'Smoke Bomb', mp: 8, t: 'allAllies', k: 'buff', buff: { eva: 25 }, turns: 3, d: 'Party evasion up for 3 turns.' },
  trickshot:  { n: 'Trick Shot', mp: 10, t: 'enemy', k: 'phys', ty: 'energy', p: 1.5, pierce: true, d: 'Energy shot that ignores armor.' },
  rapidslash: { n: 'Rapid Slash', mp: 12, t: 'enemy', k: 'phys', ty: 'blade', p: 0.6, hits: 3, d: 'Three blade strikes.' },
  fortune:    { n: "Fortune's Favor", mp: 14, t: 'allAllies', k: 'buff', buff: { crit: 25 }, turns: 3, d: 'Party critical chance up.' },
  overcharge: { n: 'Ole Betsy, Overcharged', mp: 22, t: 'allEnemies', k: 'phys', ty: 'energy', p: 1.5, d: 'Betsy screams. Everything in front of her regrets it.' },
  thux:       { n: 'Thux Radiance', mp: 30, t: 'allEnemies', k: 'tech', ty: 'psi', p: 2.3, d: 'ULTIMATE. The cleansed gem burns with the Queen\'s stolen light.' },
  // Vanguard
  coverfire:  { n: 'Cover Fire', mp: 4, t: 'allEnemies', k: 'phys', ty: 'ballistic', p: 0.6, d: 'Sweep every enemy with ballistic fire.' },
  drawfire:   { n: 'Draw Fire', mp: 3, t: 'self', k: 'buff', buff: { taunt: 1, arm: 1.25 }, turns: 3, d: 'Enemies target Jaxon. Armor up.' },
  frag:       { n: 'Frag Grenade', mp: 8, t: 'allEnemies', k: 'phys', ty: 'fire', p: 0.8, st: 'burn', ch: 0.25, d: 'Fire damage to all. May burn.' },
  shieldwall: { n: 'Shield Wall', mp: 12, t: 'allAllies', k: 'buff', buff: { arm: 1.35 }, turns: 3, d: 'Party armor up.' },
  breach:     { n: 'Breach Charge', mp: 12, t: 'enemy', k: 'phys', ty: 'fire', p: 2.0, d: 'Shaped charge. Big fire damage to one.' },
  suppress:   { n: 'Suppression', mp: 14, t: 'allEnemies', k: 'phys', ty: 'ballistic', p: 0.75, debuff: { spd: 0.7 }, d: 'Ballistic to all and slows them.' },
  laststand:  { n: 'Last Stand', mp: 20, t: 'enemy', k: 'phys', ty: 'ballistic', p: 1.5, desperate: true, d: 'Stronger the more wounded Jaxon is.' },
  thornbreak: { n: 'Thornbreaker Barrage', mp: 30, t: 'allEnemies', k: 'phys', ty: 'ballistic', p: 1.0, hits: 3, d: 'ULTIMATE. Everything he carries, all at once.' },
  // Medtech
  medspray:   { n: 'Medgel Spray', mp: 4, t: 'ally', k: 'heal', p: 1.0, d: 'Heal one ally.' },
  spark:      { n: 'Neural Spark', mp: 4, t: 'enemy', k: 'tech', ty: 'shock', p: 1.0, d: 'Shock damage to one.' },
  cryoflask:  { n: 'Cryo Flask', mp: 6, t: 'enemy', k: 'tech', ty: 'cryo', p: 1.2, d: 'Cryo damage to one.' },
  triage:     { n: 'Triage', mp: 12, t: 'allAllies', k: 'heal', p: 0.65, d: 'Heal the whole party.' },
  stim:       { n: 'Stim Shot', mp: 10, t: 'ally', k: 'buff', buff: { atk: 1.3, spd: 1.2 }, turns: 3, d: 'Ally attack and speed up.' },
  lazarus:    { n: 'Lazarus Protocol', mp: 20, t: 'deadAlly', k: 'revive', p: 0.5, d: 'Revive a fallen ally at half HP.' },
  atrap:      { n: 'ATRaP Overdrive', mp: 18, t: 'allAllies', k: 'heal', p: 0.45, cleanse: true, regen: 3, d: 'Heal, cleanse and regenerate the party.' },
  cyclone:    { n: 'Cyclone Protocol', mp: 30, t: 'allEnemies', k: 'tech', ty: 'shock', p: 2.1, partyBuff: { spd: 1.25 }, d: 'ULTIMATE. Road Pack 3.0 at full spin. Shock to all, party speed up.' },
  // Automaton
  scan:       { n: 'Scan', mp: 3, t: 'allEnemies', k: 'scan', d: 'Reveal every enemy weakness.' },
  arc:        { n: 'Arc Discharge', mp: 5, t: 'allEnemies', k: 'tech', ty: 'shock', p: 0.65, d: 'Shock damage to all.' },
  cryolance:  { n: 'Cryo Lance', mp: 6, t: 'enemy', k: 'tech', ty: 'cryo', p: 1.3, d: 'Cryo damage to one.' },
  overclock:  { n: 'Overclock', mp: 10, t: 'ally', k: 'bp', d: 'Give an ally +2 BP.' },
  purge:      { n: 'Thermal Purge', mp: 12, t: 'allEnemies', k: 'tech', ty: 'fire', p: 0.9, d: 'Fire damage to all.' },
  firewall:   { n: 'Firewall', mp: 14, t: 'allAllies', k: 'buff', buff: { res: 0.7 }, turns: 3, d: 'Party takes less tech damage.' },
  railgun:    { n: 'Railgun Protocol', mp: 20, t: 'enemy', k: 'phys', ty: 'energy', p: 3.0, d: 'Huge energy damage to one.' },
  directive:  { n: 'Directive Zero', mp: 30, t: 'allEnemies', k: 'tech', ty: 'energy', p: 2.0, shred: 2, d: 'ULTIMATE. Energy to all and strips 2 shields from each.' },
  // Ace
  fan:        { n: 'Fan the Hammer', mp: 5, t: 'enemy', k: 'phys', ty: 'ballistic', p: 0.45, hits: 4, rnd: true, d: 'Four shots at random enemies.' },
  reflex:     { n: "Dogfighter's Reflex", mp: 4, t: 'self', k: 'buff', buff: { eva: 40 }, turns: 2, d: 'Evasion way up.' },
  ricochet:   { n: 'Ricochet', mp: 7, t: 'allEnemies', k: 'phys', ty: 'ballistic', p: 0.6, d: 'Ballistic to all.' },
  calledshot: { n: 'Called Shot', mp: 10, t: 'enemy', k: 'phys', ty: 'energy', p: 1.7, critBonus: 50, d: 'Energy shot with high crit chance.' },
  afterburn:  { n: 'Afterburner', mp: 12, t: 'allAllies', k: 'buff', buff: { spd: 1.3 }, turns: 3, d: 'Party speed up.' },
  deadeye:    { n: 'Dead-Eye', mp: 14, t: 'enemy', k: 'phys', ty: 'ballistic', p: 2.0, critBonus: 100, d: 'A guaranteed critical hit.' },
  strafe:     { n: 'Strafing Run', mp: 20, t: 'allEnemies', k: 'phys', ty: 'energy', p: 0.9, hits: 2, d: 'Two energy passes over everything.' },
  requiem:    { n: "Lost Soul's Requiem", mp: 30, t: 'enemy', k: 'phys', ty: 'ballistic', p: 0.6, hits: 8, rnd: true, d: 'ULTIMATE. Eight shots, one for each name he carries.' },
  // Pyrepsion
  ember:      { n: 'Ember', mp: 4, t: 'enemy', k: 'tech', ty: 'fire', p: 1.0, st: 'burn', ch: 0.2, d: 'Fire to one. May burn.' },
  mindspike:  { n: 'Mind Spike', mp: 4, t: 'enemy', k: 'tech', ty: 'psi', p: 1.0, d: 'Psi damage to one.' },
  kindle:     { n: 'Kindle', mp: 7, t: 'ally', k: 'heal', p: 0.8, regen: 3, d: 'Warm heal over time.' },
  immolate:   { n: 'Immolate', mp: 12, t: 'allEnemies', k: 'tech', ty: 'fire', p: 0.8, st: 'burn', ch: 0.3, d: 'Fire to all. May burn.' },
  ward:       { n: 'Psychic Ward', mp: 12, t: 'allAllies', k: 'buff', buff: { res: 0.7, arm: 1.15 }, turns: 3, d: 'Party resists tech and physical harm.' },
  voidlance:  { n: 'Void Lance', mp: 16, t: 'enemy', k: 'tech', ty: 'psi', p: 2.2, d: 'Heavy psi damage to one.' },
  rapture:    { n: 'Inferno Rapture', mp: 26, t: 'allEnemies', k: 'tech', ty: 'fire', p: 1.5, st: 'burn', ch: 0.5, d: 'The pyre, aimed outward.' },
  unburnt:    { n: 'Unburnt', mp: 40, t: 'allAllies', k: 'revive', p: 0.6, all: true, d: 'ULTIMATE. Revives and heals the entire party.' }
};
const CLASS_SKILLS = {
  hunter:    [['quickdraw', 1], ['pilfer', 1], ['smokebomb', 4], ['trickshot', 8], ['rapidslash', 12], ['fortune', 16], ['overcharge', 20]],
  vanguard:  [['coverfire', 1], ['drawfire', 1], ['frag', 4], ['shieldwall', 8], ['breach', 12], ['suppress', 16], ['laststand', 20]],
  medtech:   [['medspray', 1], ['spark', 1], ['cryoflask', 4], ['triage', 8], ['stim', 12], ['lazarus', 16], ['atrap', 20]],
  automaton: [['scan', 1], ['arc', 1], ['cryolance', 4], ['overclock', 8], ['purge', 12], ['firewall', 16], ['railgun', 20]],
  ace:       [['fan', 1], ['reflex', 1], ['ricochet', 4], ['calledshot', 8], ['afterburn', 12], ['deadeye', 16], ['strafe', 20]],
  pyrepsion: [['ember', 1], ['mindspike', 1], ['kindle', 4], ['immolate', 8], ['ward', 12], ['voidlance', 16], ['rapture', 20]]
};
const ULTIMATES = { miles: 'thux', jaxon: 'thornbreak', katey: 'cyclone', kat: 'directive', ryder: 'requiem', celeste: 'unburnt' };

/* ---------- items ---------- */
const ITEMS = {};
const TIER_PRICE = [0, 120, 420, 1000, 2200, 4300, 7800];
function defWeapons(cat, list) {
  list.forEach(([id, n, atk, ty, tier, extra]) => {
    const it = { n, k: 'weapon', cat, atk, ty, tier, price: TIER_PRICE[tier] };
    if (cat === 'tool' || cat === 'focus') it.int = Math.round(atk * 0.7);
    Object.assign(it, extra || {});
    ITEMS[id] = it;
  });
}
defWeapons('pistol', [
  ['w_revolver', 'Rust-Bucket Revolver', 7, 'ballistic', 1],
  ['w_hornet', 'Hornet Autopistol', 12, 'ballistic', 2],
  ['w_epp200', 'EPP-200 Phaser', 18, 'energy', 3],
  ['w_sunspit', 'Sunspitter Flare Gun', 25, 'fire', 4],
  ['w_starfang', 'Starfang Magnum', 33, 'ballistic', 5],
  ['w_nova', 'Nova Hand-Cannon', 43, 'energy', 6]
]);
ITEMS.w_betsy = { n: 'Ole Betsy (EPP-350)', k: 'weapon', cat: 'pistol', atk: 10, ty: 'energy', tier: 1, price: 0, unique: true,
  desc: 'Electron Pulse Phaser. A reward for finding someone\'s lost jewels. Upgrades twice as well at the workbench.', upMult: 2 };
defWeapons('rifle', [
  ['w_carbine', 'Surplus Carbine', 8, 'ballistic', 1],
  ['w_thornrifle', 'Blue Thorn Battle Rifle', 14, 'ballistic', 2],
  ['w_coilgun', 'Frostbite Coilgun', 20, 'cryo', 3],
  ['w_railgun', 'Longshot Railgun', 28, 'energy', 4],
  ['w_lancer', 'Republic Lancer', 36, 'ballistic', 5],
  ['w_phantomrep', 'Phantom Repeater', 47, 'energy', 6]
]);
defWeapons('blade', [
  ['w_machete', 'Jungle Machete', 7, 'blade', 1],
  ['w_vibro', 'Vibro-Knife', 12, 'blade', 2],
  ['w_ashsaber', 'Ashen Saber', 19, 'fire', 3],
  ['w_katana', 'Monomolecular Katana', 27, 'blade', 4],
  ['w_glacier', 'Glacier Edge', 35, 'cryo', 5],
  ['w_dirk', 'Whithall Royal Dirk', 45, 'psi', 6]
]);
defWeapons('heavy', [
  ['w_rivet', 'Rivet Cannon', 10, 'ballistic', 1],
  ['w_mule', 'Scattergun "Mule"', 15, 'ballistic', 2],
  ['w_flamer', 'Flamecaster', 22, 'fire', 3],
  ['w_autocannon', 'Gauntlet Autocannon', 31, 'ballistic', 4],
  ['w_hydrapod', 'Hydra Rocket Pod', 40, 'fire', 5],
  ['w_sphinx', 'Sphinx Siege Lance', 50, 'energy', 6]
]);
defWeapons('tool', [
  ['w_wrench', 'Arc Wrench', 6, 'shock', 1],
  ['w_baton', 'Stun Baton', 10, 'shock', 2],
  ['w_injector', 'Cryo-Injector', 16, 'cryo', 3],
  ['w_tesla', 'Tesla Coil Gauntlet', 23, 'shock', 4],
  ['w_cutter', 'Plasma Cutter', 31, 'fire', 5],
  ['w_bronco', 'Bronco Breaker Arm', 40, 'shock', 6]
]);
defWeapons('focus', [
  ['w_lens', 'Cracked Psi-Lens', 6, 'psi', 1],
  ['w_censer', 'Ember Censer', 10, 'fire', 2],
  ['w_thuxfocus', 'Thux Shard Focus', 16, 'psi', 3],
  ['w_prism', 'Rose Nebula Prism', 23, 'psi', 4],
  ['w_relic', 'Pyre-Saint Relic', 31, 'fire', 5],
  ['w_voideye', 'Void-Eye Orb', 41, 'psi', 6]
]);
// quest weapon
ITEMS.w_thornbreaker = { n: 'Thornbreaker', k: 'weapon', cat: 'heavy', atk: 46, ty: 'blade', tier: 6, price: 0, unique: true, desc: 'Fields\' own chain-cannon, bayonet still on it.' };

function defArmor(list) {
  list.forEach(([id, n, arm, tier, bon, desc]) => {
    ITEMS[id] = { n, k: 'armor', arm, tier, bon: bon || {}, price: Math.round(TIER_PRICE[tier] * 0.8), desc };
  });
}
defArmor([
  ['a_jacket', 'Patched Flight Jacket', 4, 1],
  ['a_vest0', 'Padded Work Vest', 5, 1],
  ['a_duster', "Spacer's Duster", 3, 1, { spd: 2 }],
  ['a_kevlite', 'Kevlite Vest', 9, 2],
  ['a_wraps', 'Scavenger Wraps', 7, 2, { dex: 3 }],
  ['a_thornplate', 'Blue Thorn Plate', 14, 3],
  ['a_medweave', 'Medweave Coat', 11, 3, { int: 4 }],
  ['a_hydra', 'Hydra Composite', 20, 4],
  ['a_ghillie', 'Stalker Ghillie', 16, 4, { spd: 5 }],
  ['a_aegis', 'Republic Aegis Suit', 27, 5],
  ['a_shadow', 'Eclipse Shadowsuit', 22, 5, { dex: 5, spd: 4 }],
  ['a_veil', 'Veilwoven Mantle', 33, 6, { end: 6, int: 6 }],
  ['a_carapace', 'Unseen Carapace', 39, 6]
]);

function defAcc(list) {
  list.forEach(([id, n, price, bon, desc]) => { ITEMS[id] = { n, k: 'acc', price, bon, desc }; });
}
defAcc([
  ['x_chip', 'Lucky Credit Chip', 300, { dex: 3, crit: 3 }, 'Somebody\'s lucky chip. Now yours.'],
  ['x_monocle', 'Targeting Monocle', 650, { dex: 6 }],
  ['x_servo', 'Servo Brace', 900, { str: 6 }],
  ['x_reactor', 'Reactor Core Pendant', 900, { int: 7 }],
  ['x_heatsink', 'Heat Sink Harness', 700, { resist: 'fire' }, 'Halves fire damage.'],
  ['x_cryoline', 'Cryo-Lined Collar', 700, { resist: 'cryo' }, 'Halves cryo damage.'],
  ['x_gloves', 'Insulated Gloves', 700, { resist: 'shock' }, 'Halves shock damage.'],
  ['x_dampener', 'Neural Dampener', 900, { resist: 'psi' }, 'Halves psi damage.'],
  ['x_insignia', 'Blue Thorn Insignia', 1200, { arm: 7 }],
  ['x_dogtags', 'LSF Dogtags', 1500, { str: 5, spd: 3 }],
  ['x_medimplant', 'Med-Implant', 2600, { regen: 0.05 }, 'Restores 5% HP each turn.'],
  ['x_feather', "Sparrow's Feather", 0, { spd: 8, eva: 8 }, 'Drayden Sparrow wore it in his hat. He won\'t need it.'],
  ['x_fang', "Huntress's Fang", 0, { dex: 8, crit: 8 }, 'Aellona Acardi\'s trophy necklace.'],
  ['x_phantomflag', 'Black PF Flag', 0, { crit: 15, str: 8, dex: 8 }, 'Nobody has ever taken one off a living Phantom.'],
  ['x_hierarch', 'Hierarch\'s Eye', 0, { int: 12, mp: 30 }, 'It still blinks.'],
  // personal quest rewards
  ['x_thux', 'Thux Pendant', 0, { str: 5, dex: 5, spd: 5, int: 5, end: 5, mpRegen: 3 }, 'Lady Whithall\'s necklace, finally quiet.'],
  ['x_cyclone', 'Cyclone Road Pack 3.0', 0, { spd: 10, eva: 10, end: 4 }, 'Jetpack, rappel rig, bridge, cargo arms. Finished.'],
  ['x_thornheart', 'Deserter\'s Thorn', 0, { arm: 10, end: 8, str: 4 }, 'He cut it off his own shoulderguard years ago.'],
  ['x_zerocore', 'Directive Zero Core', 0, { int: 10, mp: 25, mpRegen: 2 }, 'Her real name, decrypted.'],
  ['x_wings', 'Proximo Wings', 0, { dex: 9, spd: 9, crit: 6 }, 'Ace insignia of the Lost Soul Federation. Torn in half.'],
  ['x_unburnt', 'Unburnt Heart', 0, { int: 10, regen: 0.04, resist: 'fire' }, 'A cinder that never cooled.']
]);

Object.assign(ITEMS, {
  medgel:   { n: 'Medgel', k: 'use', price: 30, heal: 70, t: 'ally', d: 'Restores 70 HP.' },
  medgel2:  { n: 'Medgel+', k: 'use', price: 120, heal: 220, t: 'ally', d: 'Restores 220 HP.' },
  trauma:   { n: 'Trauma Kit', k: 'use', price: 420, heal: 600, t: 'ally', d: 'Restores 600 HP.' },
  psicell:  { n: 'Psi Cell', k: 'use', price: 60, mp: 25, t: 'ally', d: 'Restores 25 MP.' },
  psicell2: { n: 'Psi Cell+', k: 'use', price: 220, mp: 75, t: 'ally', d: 'Restores 75 MP.' },
  lazarus:  { n: 'Lazarus Shot', k: 'use', price: 260, revive: 0.4, t: 'deadAlly', d: 'Revives at 40% HP.' },
  antitox:  { n: 'Antitox', k: 'use', price: 25, cleanse: true, t: 'ally', d: 'Cures burn, toxin and stun.' },
  jerky:    { n: "Julius's Jerky", k: 'use', price: 90, heal: 45, t: 'allAllies', d: 'Party restores 45 HP. Chewy.' },
  fraggren: { n: 'Frag Grenade', k: 'use', price: 80, dmg: 60, ty: 'fire', t: 'allEnemies', d: 'Fire damage to all enemies.' },
  cryogren: { n: 'Cryo Grenade', k: 'use', price: 80, dmg: 90, ty: 'cryo', t: 'enemy', d: 'Cryo damage to one enemy.' },
  shockmine:{ n: 'Shock Mine', k: 'use', price: 150, dmg: 75, ty: 'shock', t: 'allEnemies', d: 'Shock damage to all enemies.' },
  psibomb:  { n: 'Psi Flashbang', k: 'use', price: 150, dmg: 110, ty: 'psi', t: 'enemy', d: 'Psi damage to one enemy.' },
  smoke:    { n: 'Smoke Pellet', k: 'use', price: 40, flee: true, t: 'none', d: 'Guaranteed escape from normal battles.' },
  // quest materials
  snapsteak:{ n: 'Snapjaw Steak', k: 'mat', price: 8, d: 'Julius wants these.' },
  dunepepper:{ n: 'Dune Pepper', k: 'mat', price: 10, d: 'Hot enough to strip paint.' },
  ridgehoney:{ n: 'Ridge Honey', k: 'mat', price: 14, d: 'Harvested from Ridge Stalker nests. Somehow.' },
  frostroot:{ n: 'Nightfrost Root', k: 'mat', price: 18, d: 'Only grows in the dark half of Skuna 3.' },
  voidsalt: { n: 'Void Salt', k: 'mat', price: 25, d: 'Tastes like nothing you can name.' },
  coolant:  { n: 'Coolant Cell', k: 'key', price: 0, d: 'For the Last Hope\'s burnt-out reactor.' },
  fragment: { n: 'Shroud Fragment', k: 'key', price: 0, d: 'A shard of black glass full of moving stars.' }
});

/* ---------- Julius's meals: buff lasts 3 battles ---------- */
const MEALS = {
  hash:   { n: "Spacer's Hash", cost: 40, buff: { arm: 1.1 }, d: '+10% armor. "It\'s food. Eat it."' },
  steak:  { n: 'Snapjaw Steak Skillet', cost: 80, buff: { atk: 1.15 }, d: '+15% attack.', unlock: 'q_julius1' },
  chili:  { n: 'Dune-Pepper Chili', cost: 120, buff: { xp: 1.25 }, d: '+25% XP. Sweat counts as training.', unlock: 'q_julius2' },
  pie:    { n: 'Clearbourn Honey Pie', cost: 160, buff: { spd: 1.15 }, d: '+15% speed.', unlock: 'q_julius3' },
  soup:   { n: 'Nightfrost Soup', cost: 220, buff: { res: 0.8 }, d: 'Take 20% less tech damage.', unlock: 'q_julius4' },
  feast:  { n: 'Last Hope Feast', cost: 400, buff: { atk: 1.15, arm: 1.15, spd: 1.1, xp: 1.2 }, d: 'Everything. Julius cried a little.', unlock: 'q_julius5' }
};

/* ---------- enemies ----------
   stats come from level via enemyStats(); m = multipliers                 */
function M(n, p, t, k, ty, st, ch) { return { n, p, t, k, ty, st, ch }; }
const ENEMIES = {};
function E(id, n, lv, art, col, sh, weak, moves, o) {
  ENEMIES[id] = Object.assign({ n, lv, art, col, sh, weak, moves, m: {}, drop: [] }, o || {});
}
// --- prologue / misc
E('labdrone', 'Malfunctioning Lab Drone', 1, 'drone', '#9ad', 2, ['shock', 'blade'], [M('Buzz Saw', 1, 's', 'p', 'blade'), M('Static Pop', 0.9, 's', 't', 'shock')], { m: { hp: 0.9 } });
E('boarddrone', 'Boarding Drone', 1, 'drone', '#d55', 2, ['shock', 'cryo'], [M('Cutter Beam', 1, 's', 't', 'energy'), M('Ram', 1.1, 's', 'p', 'blade')], { m: { hp: 0.8 } });
E('ventrat', 'Vent Rat', 1, 'beast', '#8a7', 2, ['fire', 'blade'], [M('Gnaw', 1, 's', 'p', 'blade'), M('Filthy Bite', 0.8, 's', 'p', 'blade', 'toxin', 0.3)], { m: { hp: 0.7 } });
// --- Eplaotune
E('snapjaw', 'Snapjaw Strider', 1, 'beast', '#6fae4f', 2, ['blade', 'fire'], [M('Bite', 1, 's', 'p', 'blade'), M('Pounce', 1.3, 's', 'p', 'blade')], { drop: [['snapsteak', 0.45], ['medgel', 0.1]] });
E('vinelasher', 'Vine Lasher', 2, 'plant', '#3f8f5a', 3, ['fire', 'blade'], [M('Lash', 1, 's', 'p', 'blade'), M('Choking Spores', 0.55, 'a', 't', 'psi', 'toxin', 0.3)], { drop: [['psicell', 0.1]] });
E('spore', 'Spore Drifter', 2, 'wisp', '#c9d86a', 2, ['fire', 'energy'], [M('Spore Burst', 0.6, 'a', 't', 'psi', 'toxin', 0.3), M('Static Drift', 1, 's', 't', 'shock')], { m: { hp: 0.8 }, drop: [['antitox', 0.2]] });
E('nsgthug', 'New Sun Thug', 2, 'humanoid', '#e3b23c', 3, ['ballistic', 'shock'], [M('Pipe Swing', 1.1, 's', 'p', 'blade'), M('Potshot', 1, 's', 'p', 'ballistic')], { m: { cr: 1.5 }, drop: [['medgel', 0.15]] });
E('sentinel', 'Whithall Sentinel', 3, 'construct', '#b9a37a', 4, ['shock', 'cryo'], [M('Halberd Sweep', 0.75, 'a', 'p', 'blade'), M('Stone Fist', 1.3, 's', 'p', 'blade')], { m: { hp: 1.2, arm: 1.3 } });
E('gildwraith', 'Gilded Wraith', 4, 'wisp', '#f0d36b', 3, ['energy', 'psi'], [M('Soul Graze', 1.1, 's', 't', 'psi'), M('Wail', 0.65, 'a', 't', 'psi', 'stun', 0.1)], { drop: [['psicell', 0.2]] });
E('ayers', 'Lt. Brian Ayers', 3, 'humanoid', '#ffcf4a', 6, ['shock', 'blade', 'energy'], [M('Sunburst Pistol', 1.2, 's', 'p', 'energy'), M('Sun Grenade', 0.8, 'a', 'p', 'fire', 'burn', 0.3), { n: 'Rally the Boys', buff: { atk: 1.3 }, self: true }], { boss: true, m: { hp: 5.5, xp: 5, cr: 6 }, drop: [['medgel2', 1]] });
E('mossback', 'Old Mossback', 5, 'beast', '#4e7d3a', 6, ['fire', 'cryo'], [M('Crushing Jaws', 1.4, 's', 'p', 'blade'), M('Tail Sweep', 0.8, 'a', 'p', 'blade')], { elite: true, m: { hp: 4, xp: 4, cr: 4, arm: 1.3 } });
E('sporequeen', 'The Spore Queen', 6, 'plant', '#d6e36a', 7, ['fire', 'energy'], [M('Royal Bloom', 0.7, 'a', 't', 'psi', 'toxin', 0.4), M('Thorn Lance', 1.3, 's', 'p', 'blade'), { n: 'Regrow', heal: 0.12 }], { elite: true, m: { hp: 4.5, xp: 4, cr: 4 } });
E('echo', 'Whithall Echo', 4, 'wisp', '#ffe08a', 5, ['energy', 'psi'], [M('Grasping Light', 1.2, 's', 't', 'psi'), M('Mourning', 0.7, 'a', 't', 'psi', 'stun', 0.15)], { boss: true, m: { hp: 4, xp: 4, cr: 3 } });
E('whithall', 'Lady Whithall, the Withered Queen', 16, 'horror', '#e9d27a', 9, ['fire', 'energy', 'psi'], [M('Devour Soul', 1.35, 's', 't', 'psi'), M('Royal Decree', 0.85, 'a', 't', 'psi', 'stun', 0.2), M('Withering Touch', 1.2, 's', 'p', 'blade', 'toxin', 0.4), { n: 'Feast of Ancestors', heal: 0.08 }], { boss: true, acts: 2, m: { hp: 9, xp: 6, cr: 6 } });
// --- Pliea
E('scraphound', 'Scrap Hound', 3, 'beast', '#a7a7a7', 3, ['shock', 'cryo'], [M('Rust Fang', 1, 's', 'p', 'blade'), M('Saw Lunge', 1.25, 's', 'p', 'blade')], { drop: [['medgel', 0.12]] });
E('duneskink', 'Dune Skink', 4, 'wyrm', '#d9a35a', 3, ['cryo', 'ballistic'], [M('Sand Spit', 0.95, 's', 'p', 'ballistic'), M('Burrow Strike', 1.3, 's', 'p', 'blade')], { drop: [['dunepepper', 0.4]] });
E('scrapper', 'New Sun Scrapper', 5, 'humanoid', '#e3b23c', 4, ['energy', 'blade'], [M('Scattergun', 0.7, 'a', 'p', 'ballistic'), M('Cutting Torch', 1.1, 's', 't', 'fire', 'burn', 0.25)], { m: { cr: 1.5 }, drop: [['fraggren', 0.12]] });
E('junkgolem', 'Junk Golem', 5, 'construct', '#8d7b68', 5, ['shock', 'fire'], [M('Slam', 1.4, 's', 'p', 'blade'), M('Scrap Storm', 0.7, 'a', 'p', 'ballistic')], { m: { hp: 1.4, arm: 1.3 } });
E('tombwisp', 'Tomb Wisp', 6, 'wisp', '#6ad0ff', 4, ['psi', 'energy'], [M('Cold Whisper', 1, 's', 't', 'cryo'), M('Dread', 0.6, 'a', 't', 'psi', 'stun', 0.12)], { drop: [['psicell', 0.2]] });
E('lurker', 'Cave Lurker', 6, 'horror', '#4b6b8f', 4, ['fire', 'ballistic'], [M('Grab', 1.2, 's', 'p', 'blade'), M('Ink Spray', 0.7, 'a', 't', 'psi')]);
E('scrapjaw', 'Kaleb "Scrapjaw" McIntosh', 6, 'mech', '#e3b23c', 7, ['shock', 'cryo', 'blade'], [M('Junk Cannon', 1.3, 's', 'p', 'ballistic'), M('Flamethrower', 0.8, 'a', 't', 'fire', 'burn', 0.3), M('Grinder Claw', 1.6, 's', 'p', 'blade')], { boss: true, m: { hp: 6, xp: 6, cr: 7, arm: 1.2 }, drop: [['medgel2', 1]] });
E('sleeper', 'The Sleeper Below', 7, 'horror', '#5fb8c9', 8, ['fire', 'energy', 'ballistic'], [M('Tendril', 1.2, 's', 'p', 'blade'), M('Dream-Crush', 0.75, 'a', 't', 'psi', 'stun', 0.15), { n: 'Siphon Dreams', heal: 0.08 }], { boss: true, acts: 2, m: { hp: 6.5, xp: 7, cr: 6 } });
E('rustmaw', 'Rustmaw', 8, 'wyrm', '#b5652d', 7, ['cryo', 'shock'], [M('Swallow Whole', 1.5, 's', 'p', 'blade'), M('Sandstorm', 0.8, 'a', 'p', 'ballistic')], { elite: true, m: { hp: 4.2, xp: 4, cr: 4 } });
E('gutterprince', 'The Gutter Prince', 9, 'humanoid', '#f7d26a', 7, ['blade', 'psi'], [M('Gilded Blunderbuss', 0.9, 'a', 'p', 'ballistic'), M('Cheap Shot', 1.4, 's', 'p', 'blade', 'stun', 0.2)], { elite: true, m: { hp: 4, xp: 4, cr: 6 } });
E('colossus', 'Junk Colossus', 6, 'construct', '#9b8a6a', 6, ['shock', 'fire'], [M('Hydraulic Slam', 1.4, 's', 'p', 'blade'), M('Shrapnel Spray', 0.8, 'a', 'p', 'ballistic')], { boss: true, m: { hp: 4.5, xp: 4, cr: 4 } });
E('thornhunter', 'Thorn-Hunter', 9, 'humanoid', '#4a7bd1', 5, ['energy', 'cryo'], [M('Battle Rifle', 1.1, 's', 'p', 'ballistic'), M('Net Gun', 0.8, 's', 'p', 'blade', 'stun', 0.2)], { m: { hp: 1.6 } });
// --- Eldania
E('insurgent', 'Rebel Insurgent', 6, 'humanoid', '#c94f3d', 4, ['blade', 'fire'], [M('Rifle Burst', 1, 's', 'p', 'ballistic'), M('Molotov', 0.7, 'a', 't', 'fire', 'burn', 0.3)]);
E('sapper', 'Rebel Sapper', 7, 'humanoid', '#a85a3d', 4, ['ballistic', 'cryo'], [M('Proximity Mine', 0.8, 'a', 'p', 'fire'), M('Trench Knife', 1.2, 's', 'p', 'blade')], { drop: [['shockmine', 0.1]] });
E('gauntlet', 'IV51 Gauntlet Light Tank', 8, 'vehicle', '#7c8a5a', 6, ['shock', 'cryo'], [M('Main Gun', 1.4, 's', 'p', 'ballistic'), M('Coaxial Sweep', 0.7, 'a', 'p', 'ballistic')], { m: { hp: 2.2, arm: 1.4, xp: 2 } });
E('redcap', 'Gauntlet "Redcap"', 8, 'vehicle', '#c94f3d', 7, ['shock', 'cryo', 'blade'], [M('Main Gun', 1.5, 's', 'p', 'ballistic'), M('Coaxial Sweep', 0.8, 'a', 'p', 'ballistic'), M('Incendiary Shell', 0.9, 'a', 'p', 'fire', 'burn', 0.25)], { boss: true, m: { hp: 5.5, arm: 1.3, xp: 6, cr: 6 } });
E('stalker', 'Ridge Stalker', 8, 'beast', '#8a6fb3', 4, ['ballistic', 'fire'], [M('Rake', 1.1, 's', 'p', 'blade'), M('Shriek', 0.6, 'a', 't', 'psi', 'stun', 0.1)], { drop: [['ridgehoney', 0.4]] });
E('bluethorn', 'Blue Thorn Merc', 8, 'humanoid', '#4a7bd1', 5, ['shock', 'psi'], [M('Battle Rifle', 1.1, 's', 'p', 'ballistic'), { n: 'Thorn Formation', buff: { arm: 1.3 }, self: true }], { m: { arm: 1.2, cr: 1.4 } });
E('hound', 'Huntress Hound', 8, 'beast', '#6b5a4a', 4, ['fire', 'energy'], [M('Maul', 1.2, 's', 'p', 'blade'), M('Hamstring', 0.9, 's', 'p', 'blade')]);
E('aellona', 'Aellona Acardi, Huntress of Clearbourn', 9, 'humanoid', '#d8b26a', 8, ['cryo', 'psi', 'blade'], [M('Longshot', 1.5, 's', 'p', 'energy'), M('Snare', 0.8, 's', 'p', 'blade', 'stun', 0.3), M("Hunter's Volley", 0.9, 'a', 'p', 'ballistic'), { n: 'Read the Wind', buff: { spd: 1.3 }, self: true }], { boss: true, acts: 2, m: { hp: 6, xp: 7, cr: 7 }, drop: [['x_fang', 1]] });
E('raider', 'Sparrow Raider', 9, 'humanoid', '#d64f8c', 5, ['energy', 'cryo'], [M('Hooked Blade', 1.15, 's', 'p', 'blade'), M('Flare Pistol', 0.95, 's', 't', 'fire', 'burn', 0.2)]);
E('sphinx', 'SSZ4 Sphinx', 10, 'vehicle', '#c9a55a', 6, ['shock', 'blade'], [M('Artillery Barrage', 0.9, 'a', 'p', 'fire'), M('Point Defense', 1.1, 's', 'p', 'ballistic')], { m: { hp: 2, arm: 1.4, xp: 2 } });
E('sparrow', 'Drayden Sparrow', 10, 'humanoid', '#ff6fae', 9, ['ballistic', 'shock', 'psi'], [M('Twin Blades', 1.3, 's', 'p', 'blade'), M('Sparrowstrike', 1.0, 'a', 'p', 'energy'), M('Feathered Knives', 0.8, 'a', 'p', 'blade', 'toxin', 0.3), { n: 'Smoke & Mirrors', buff: { eva: 30 }, self: true }], { boss: true, acts: 2, m: { hp: 7, xp: 8, cr: 9 }, drop: [['x_feather', 1]] });
E('twinfang', 'Twin-Fang Stalker', 11, 'beast', '#a37bd6', 8, ['ballistic', 'fire'], [M('Double Rake', 1.4, 's', 'p', 'blade'), M('Terror Shriek', 0.8, 'a', 't', 'psi', 'stun', 0.2)], { elite: true, m: { hp: 4.5, xp: 4, cr: 4 } });
E('hydrarogue', 'Hydra Rogue', 12, 'vehicle', '#5d6e5a', 8, ['shock', 'cryo'], [M('Twin Autocannon', 1.0, 'a', 'p', 'ballistic'), M('Ram', 1.5, 's', 'p', 'blade')], { elite: true, m: { hp: 5, arm: 1.4, xp: 4, cr: 5 } });
E('thornlead', 'Blue Thorn Squad Leader', 8, 'humanoid', '#3d6ad1', 6, ['shock', 'psi'], [M('Execute Order', 1.4, 's', 'p', 'ballistic'), M('Flashbang', 0.6, 'a', 'p', 'blade', 'stun', 0.2)], { boss: true, m: { hp: 3.2, xp: 3, cr: 3 } });
E('relay', 'Eclipse Relay Sentinel', 9, 'construct', '#7d3cff', 7, ['cryo', 'blade'], [M('Data Lance', 1.3, 's', 't', 'energy'), M('Purge Pulse', 0.8, 'a', 't', 'shock')], { boss: true, m: { hp: 4.5, xp: 4, cr: 4 } });
E('bronco', 'OIN8P Bronco', 9, 'vehicle', '#c98a3a', 7, ['shock', 'fire'], [M('Dozer Blade', 1.4, 's', 'p', 'blade'), M('Rivet Storm', 0.8, 'a', 'p', 'ballistic')], { boss: true, m: { hp: 4.5, arm: 1.3, xp: 4, cr: 4 } });
E('lsfrecruiter', 'LSF Recruiter', 8, 'humanoid', '#5b6b3f', 6, ['energy', 'blade'], [M('Sidearm', 1.2, 's', 'p', 'ballistic'), { n: 'Rousing Speech', buff: { atk: 1.25 }, self: true }], { boss: true, m: { hp: 3, xp: 3, cr: 3 } });
E('acolyte', 'Ashen Acolyte', 8, 'humanoid', '#ff9a5a', 4, ['cryo', 'blade'], [M('Censer Swing', 1.1, 's', 'p', 'blade'), M('Ashfall', 0.7, 'a', 't', 'fire', 'burn', 0.25)]);
E('deacon', 'Cinder Deacon', 8, 'humanoid', '#ff6a2a', 6, ['cryo', 'psi'], [M('Purifying Flame', 1.3, 's', 't', 'fire', 'burn', 0.4), M('Litany', 0.7, 'a', 't', 'psi')], { boss: true, m: { hp: 3.5, xp: 3, cr: 3 } });
// --- space
E('boarder', 'Phantom Fleet Boarder', 8, 'humanoid', '#3a3a48', 5, ['energy', 'blade'], [M('Cutlass', 1.2, 's', 'p', 'blade'), M('Boarding Gun', 0.9, 's', 'p', 'ballistic')]);
E('voidmite', 'Void Mite Swarm', 8, 'wisp', '#9f7fd9', 3, ['fire', 'shock'], [M('Hull Chew', 0.7, 'a', 'p', 'blade')], { m: { hp: 0.8 } });
// --- Aegialeus Cloud
E('zealot', 'Cleansed Zealot', 11, 'humanoid', '#ff7a3d', 5, ['cryo', 'psi'], [M('Torch', 1.1, 's', 't', 'fire', 'burn', 0.3), M('Hymn of Ash', 0.7, 'a', 't', 'fire')]);
E('interceptor', 'Cleansed Interceptor', 12, 'vehicle', '#8a7a6a', 5, ['cryo', 'ballistic'], [M('Strafing Pass', 0.9, 'a', 'p', 'energy'), M('Ram Run', 1.4, 's', 'p', 'blade')], { m: { spd: 1.5 } });
E('pyredrone', 'Pyre Drone', 11, 'drone', '#ff8a2a', 4, ['cryo', 'shock'], [M('Napalm Drip', 0.8, 'a', 't', 'fire', 'burn', 0.3)], { m: { hp: 0.9 } });
E('halo', 'Interceptor Ace "Halo"', 12, 'vehicle', '#ffd06a', 7, ['cryo', 'ballistic', 'psi'], [M('Strafing Pass', 1.0, 'a', 'p', 'energy'), M('Sunward Dive', 1.6, 's', 'p', 'fire', 'burn', 0.3)], { boss: true, acts: 2, m: { hp: 4.5, xp: 4, cr: 4, spd: 1.5 } });
E('medina', 'Pyre-Father Vincent Medina', 16, 'humanoid', '#ff5a1a', 9, ['cryo', 'psi', 'ballistic'], [M('Baptism of Flame', 1.0, 'a', 't', 'fire', 'burn', 0.5), M('Branding Iron', 1.5, 's', 'p', 'fire'), M('Sermon', 0.8, 'a', 't', 'psi', 'stun', 0.2), { n: 'Rise from Ash', heal: 0.08 }], { boss: true, acts: 2, m: { hp: 9, xp: 6, cr: 6 } });
// --- Skuna 3
E('scav', 'Tormented Scavenger', 10, 'mutant', '#b5653d', 5, ['psi', 'energy'], [M('Bone Hook', 1.1, 's', 'p', 'blade'), M('Scorched Spit', 0.9, 's', 't', 'fire', 'burn', 0.25)]);
E('frostburnt', 'Frostburnt Brute', 11, 'mutant', '#7aa6c9', 6, ['shock', 'psi'], [M('Glacial Fist', 1.4, 's', 'p', 'blade'), M('Hoarfrost Breath', 0.8, 'a', 't', 'cryo')], { m: { hp: 1.4 } });
E('sandreaper', 'Skuna Sandreaper', 11, 'beast', '#c9693d', 5, ['cryo', 'ballistic'], [M('Reaping Claw', 1.25, 's', 'p', 'blade'), { n: 'Heat Shimmer', buff: { eva: 25 }, self: true }], { drop: [['frostroot', 0.25]] });
E('howler', 'Tormented Howler', 12, 'mutant', '#a65a6a', 5, ['blade', 'fire'], [M('Howl', 0.6, 'a', 't', 'psi', 'stun', 0.15), M('Rend', 1.3, 's', 'p', 'blade')], { drop: [['frostroot', 0.3]] });
E('boyle', 'Old Boyle, the Thrice-Damned', 13, 'mutant', '#d9783d', 10, ['psi', 'energy', 'cryo'], [M('Third Offense', 1.6, 's', 'p', 'blade'), M('Sentence of Fire', 0.9, 'a', 't', 'fire', 'burn', 0.35), M('Sentence of Ice', 0.9, 'a', 't', 'cryo', 'stun', 0.15), { n: 'Endure', buff: { arm: 1.4 }, self: true }], { boss: true, acts: 2, m: { hp: 8.5, xp: 8, cr: 8 } });
E('nightfrost', 'The Nightfrost Thing', 14, 'horror', '#9fd4ff', 9, ['fire', 'energy'], [M('Hollowing Cold', 1.0, 'a', 't', 'cryo', 'stun', 0.15), M('Many Hands', 1.5, 's', 'p', 'blade')], { elite: true, m: { hp: 5, xp: 4, cr: 5 } });
// --- Wucury
E('lsftrooper', 'LSF Trooper', 12, 'humanoid', '#5b6b3f', 5, ['energy', 'blade'], [M('Pulse Rifle', 1.1, 's', 'p', 'energy'), M('Grenade', 0.7, 'a', 'p', 'fire')]);
E('hydra', 'MX-20 Hydra', 13, 'vehicle', '#4d5a3f', 7, ['shock', 'cryo'], [M('Twin Autocannon', 0.95, 'a', 'p', 'ballistic'), M('Ram', 1.4, 's', 'p', 'blade')], { m: { hp: 2.1, arm: 1.4, xp: 2 } });
E('commando', 'LSF Storm Commando', 13, 'humanoid', '#6b7a3f', 6, ['psi', 'cryo'], [M('Storm Carbine', 1.2, 's', 'p', 'ballistic'), M('Arc Grenade', 0.8, 'a', 't', 'shock')]);
E('gauntletace', 'Gauntlet Ace', 15, 'vehicle', '#a8b85a', 9, ['shock', 'blade'], [M('Main Gun', 1.6, 's', 'p', 'ballistic'), M('Treads', 0.9, 'a', 'p', 'blade')], { elite: true, m: { hp: 5, arm: 1.5, xp: 4, cr: 5 } });
E('fields', 'Commander Brayden Fields', 14, 'humanoid', '#3d6ad1', 9, ['psi', 'cryo', 'blade'], [M('Thornbreaker', 1.5, 's', 'p', 'ballistic'), M('Chain-Cannon Sweep', 0.9, 'a', 'p', 'ballistic'), { n: 'Command Presence', buff: { atk: 1.3, arm: 1.2 }, self: true }], { boss: true, acts: 2, m: { hp: 8, xp: 6, cr: 6 } });
E('deckchief', 'Proximo Deck Chief', 12, 'humanoid', '#7b8a4f', 6, ['energy', 'shock'], [M('Rivet Driver', 1.3, 's', 'p', 'ballistic'), M('Fuel Line Spray', 0.8, 'a', 't', 'fire', 'burn', 0.3)], { boss: true, m: { hp: 4, xp: 4, cr: 4 } });
E('ortega', 'Warlord Don Ortega', 15, 'humanoid', '#8a9a3f', 10, ['blade', 'psi', 'energy'], [M('Revenge Cannon', 1.6, 's', 'p', 'fire'), M('Massed Fire', 0.95, 'a', 'p', 'ballistic'), { n: 'No Retreat', buff: { arm: 1.3 }, self: true }, { n: 'War Cry', buff: { atk: 1.35 }, self: true }], { boss: true, acts: 2, m: { hp: 9, xp: 6, cr: 7 } });
// --- Ruenov
E('enforcer', 'Republic Enforcer', 13, 'humanoid', '#e6e1d1', 6, ['shock', 'fire'], [M('Shock Baton', 1.1, 's', 'p', 'shock', 'stun', 0.1), M('Riot Gun', 0.8, 'a', 'p', 'ballistic')]);
E('peacedrone', 'Peacekeeper Drone', 13, 'drone', '#f0f0f0', 5, ['shock', 'cryo'], [M('Compliance Beam', 1.1, 's', 't', 'energy')], { m: { hp: 0.9 } });
E('seraph', 'Propaganda Seraph', 14, 'wisp', '#ffe9a0', 5, ['ballistic', 'psi'], [M('Glorious Broadcast', 0.75, 'a', 't', 'psi', 'stun', 0.12), M('Halo Burn', 1.1, 's', 't', 'energy')]);
E('shadowblade', 'Rebel Shadowblade', 14, 'humanoid', '#3d3d55', 6, ['fire', 'energy'], [M('Knife in the Dark', 1.4, 's', 'p', 'blade'), M('Poison Smoke', 0.6, 'a', 't', 'psi', 'toxin', 0.35)]);
E('blackop', 'Eclipse Black-Op', 15, 'humanoid', '#7d3cff', 6, ['psi', 'blade'], [M('Suppressed Rifle', 1.2, 's', 'p', 'energy'), M('Gravity Charge', 0.8, 'a', 't', 'psi')], { m: { cr: 1.4 } });
E('monarch', 'I381 Monarch IFV', 15, 'vehicle', '#c9c3b0', 7, ['shock', 'cryo'], [M('Chain Gun', 0.95, 'a', 'p', 'ballistic'), M('Missile', 1.5, 's', 'p', 'fire')], { m: { hp: 2.1, arm: 1.4, xp: 2 } });
E('valence', 'Valence the Many-Faced', 15, 'shifter', '#9bf0d0', 10, ['psi', 'fire', 'energy'], [M('Stolen Face', 1.4, 's', 'p', 'blade'), M('Borrowed Fury', 0.9, 'a', 't', 'psi'), M('Mimic', 1.2, 's', 't', 'energy'), { n: 'Shed Skin', heal: 0.07 }], { boss: true, acts: 2, m: { hp: 8, xp: 7, cr: 6 } });
E('ecu', 'Elemental Command Unit', 16, 'mech', '#7d3cff', 11, ['psi', 'blade', 'cryo'], [M('Elemental Cannon: Fire', 1.0, 'a', 't', 'fire', 'burn', 0.3), M('Elemental Cannon: Frost', 1.0, 'a', 't', 'cryo'), M('Stomp', 1.6, 's', 'p', 'blade'), M('Overload', 1.2, 's', 't', 'shock', 'stun', 0.2)], { boss: true, acts: 2, m: { hp: 9.5, arm: 1.3, xp: 9, cr: 9 } });
E('propengine', 'The Propaganda Engine', 17, 'construct', '#ffe066', 9, ['ballistic', 'shock'], [M('Truth Broadcast', 1.0, 'a', 't', 'psi', 'stun', 0.2), M('Loyalty Hammer', 1.6, 's', 'p', 'blade')], { elite: true, m: { hp: 5.5, xp: 4, cr: 6 } });
E('commissioner', 'The Commissioner', 16, 'construct', '#c9a0ff', 10, ['psi', 'blade', 'fire'], [M('Override', 1.0, 'a', 't', 'shock', 'stun', 0.2), M('Termination Clause', 1.6, 's', 't', 'energy'), { n: 'Self-Repair', heal: 0.07 }], { boss: true, acts: 2, m: { hp: 9, xp: 6, cr: 6 } });
E('cycproto', 'Cyclone Prototype', 16, 'mech', '#3fd0c9', 10, ['cryo', 'ballistic', 'energy'], [M('Turbine Blades', 1.5, 's', 'p', 'blade'), M('Cyclone', 0.95, 'a', 't', 'shock'), M('Jet Slam', 1.2, 's', 'p', 'fire')], { boss: true, acts: 2, m: { hp: 9, xp: 6, cr: 6 } });
// --- Unknown Regions
E('ustalker', 'Unseen Stalker', 16, 'horror', '#3b2a5a', 6, ['energy', 'fire'], [M('From Nowhere', 1.35, 's', 'p', 'blade'), M('Unsight', 0.7, 'a', 't', 'psi', 'stun', 0.12)], { drop: [['voidsalt', 0.25]] });
E('hwraith', 'Hollow Wraith', 17, 'wisp', '#6d5aa8', 6, ['psi', 'energy'], [M('Hollow Touch', 1.2, 's', 't', 'cryo'), M('Choir of Nothing', 0.75, 'a', 't', 'psi')], { drop: [['voidsalt', 0.3]] });
E('reaver', 'Unseen Reaver', 18, 'humanoid', '#4a3a6a', 7, ['shock', 'blade'], [M('New Sun Autorifle', 1.0, 'a', 'p', 'ballistic'), M('Bone Glaive', 1.45, 's', 'p', 'blade')]);
E('veilhorror', 'Veil Horror', 19, 'horror', '#2a1a4a', 8, ['fire', 'psi'], [M('Veil Crush', 1.5, 's', 'p', 'blade'), M('Unmaking', 0.9, 'a', 't', 'psi', 'toxin', 0.3)], { m: { hp: 1.6, xp: 1.5 } });
E('hierarch', 'The Unseen Hierarch', 19, 'horror', '#8f6fff', 12, ['energy', 'fire', 'ballistic'], [M('Gaze of the Uncharted', 1.0, 'a', 't', 'psi', 'stun', 0.2), M('Unwrite', 1.7, 's', 't', 'psi'), M('Shadow Lash', 1.3, 's', 'p', 'blade'), { n: 'Dim the Stars', buff: { arm: 1.3 }, self: true }], { boss: true, acts: 2, m: { hp: 10.5, xp: 9, cr: 9 }, drop: [['x_hierarch', 1]] });
E('roth1', 'Director Alec Roth', 20, 'humanoid', '#d8c8ff', 10, ['ballistic', 'shock', 'psi'], [M('Executive Order', 1.5, 's', 'p', 'energy'), M('Hostile Takeover', 0.95, 'a', 't', 'psi'), { n: 'Shareholder Shield', buff: { arm: 1.35 }, self: true }], { boss: true, acts: 2, m: { hp: 8.5, xp: 6, cr: 10 } });
E('roth2', 'Roth, Shroud-Bound', 21, 'shroud', '#1a0d2e', 14, ['fire', 'energy', 'psi', 'blade'], [M('Binding Veil', 0.85, 'a', 't', 'psi', 'stun', 0.12), M('Soul Harvest', 1.6, 's', 't', 'psi'), M('Ten Thousand Hands', 0.95, 'a', 'p', 'blade'), M('Unravel', 1.3, 's', 'p', 'blade'), { n: 'Drink the Bound', heal: 0.03 }], { boss: true, acts: 2, final: true, m: { hp: 10, xp: 12, cr: 0 } });
E('thingbetween', 'The Thing Between Stars', 22, 'horror', '#0e0620', 10, ['energy', 'shock'], [M('Absence', 1.2, 'a', 't', 'psi'), M('Devour Light', 1.7, 's', 'p', 'blade')], { elite: true, m: { hp: 6.5, xp: 5, cr: 6 } });
// --- Snail Shell Nebula (post-game)
E('preaver', 'Phantom Reaver', 22, 'humanoid', '#2a2a36', 7, ['energy', 'psi'], [M('Black Cutlass', 1.4, 's', 'p', 'blade'), M('Broadside', 1.0, 'a', 'p', 'ballistic')]);
E('ghostfrig', 'Ghost Frigate Gunner', 23, 'vehicle', '#4a4a5a', 7, ['shock', 'cryo'], [M('Deck Gun', 1.05, 'a', 'p', 'ballistic'), M('Grapeshot', 1.4, 's', 'p', 'ballistic')], { m: { hp: 1.8, arm: 1.3 } });
E('commodore', 'The Pitiless Commodore', 27, 'humanoid', '#111118', 15, ['psi', 'cryo', 'energy'], [M('No Prisoners', 1.6, 's', 'p', 'blade'), M('Full Broadside', 1.05, 'a', 'p', 'ballistic'), M('Black Flag', 0.8, 'a', 't', 'psi', 'stun', 0.25), { n: 'Pitiless', buff: { atk: 1.3, spd: 1.2 }, self: true }], { boss: true, acts: 2, m: { hp: 14, xp: 12, cr: 15 }, drop: [['x_phantomflag', 1]] });

function enemyStats(def, lvOverride) {
  const lv = lvOverride || def.lv, m = def.m || {};
  const bh = def.boss ? 0.6 : 1, ba = def.boss && (def.acts || 1) === 1 ? 1.25 : def.boss ? 1.12 : 1;
  return {
    lv,
    hp: Math.round((34 + lv * 20 + lv * lv * 0.8) * (m.hp || 1) * bh),
    atk: Math.round((15 + lv * 3.6) * (m.atk || 1) * ba),
    arm: Math.round((3 + lv * 1.6) * (m.arm || 1)),
    int: Math.round((10 + lv * 3.2) * (m.int || 1) * ba),
    spd: Math.round((8 + lv * 2) * (m.spd || 1)),
    dex: Math.round(8 + lv * 2),
    xp: Math.round((8 + lv * 6 + lv * lv * 0.6) * (m.xp || 1)),
    cr: Math.round((6 + lv * 5) * (m.cr || 1))
  };
}
