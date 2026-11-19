/* ============================================================
   THE SACRED SHROUD — world: locations, zones, events, NPCs
   ============================================================ */

/* art presets: k = scene kind; pal = [skyTop, skyBottom, far, mid, near, accent]; seed */
const LOCS = {
  lasthope: {
    n: 'The Last Hope', sys: 'Wherever she’s parked', region: 'Home',
    art: { k: 'ship', pal: ['#0b0f24', '#1c2348', '#2d3566', '#3a4378', '#141833', '#f2a33a'], seed: 7 },
    blurb: 'A battered Eclipse-built frigate with a scorched hull, a grumpy chef, and the only bunk Miles has ever paid for.'
  },
  eplaotune: {
    n: 'Eplaotune', sys: 'Zeta Amphiaraus', region: 'Outer Colonies', lv: '1–5',
    art: { k: 'jungle', pal: ['#0f3b3a', '#9fd36a', '#2c6b4a', '#1d4f37', '#0b2a1d', '#f7e36b'], seed: 11, moons: 2 },
    blurb: 'A river-veined jungle world. Hot, wet, and full of things with teeth. Somewhere under the canopy lie the ruins of House Whithall.',
    hub: {
      n: 'Riverside Landing', art: { k: 'outpost', pal: ['#12403d', '#e7c46a', '#2f6b4f', '#244e3a', '#10261c', '#ff9b4a'], seed: 12 },
      desc: 'Stilt-huts, a mud landing pad, and a cantina called The Damp Rag. Everyone here is either selling something or hiding from someone.',
      shop: ['medgel', 'psicell', 'antitox', 'smoke', 'fraggren', 'w_revolver', 'w_carbine', 'w_machete', 'w_rivet', 'w_wrench', 'w_lens', 'a_kevlite', 'a_wraps', 'x_chip'],
      npcs: [
        { n: 'Old Ferrywoman Noor', lines: ['River gives, river takes. Mostly takes. You’re off-worlders, so it’ll take faster.', 'The Whithall house? Don’t say that name on the water. The fish listen.'] },
        { n: 'Bartender at The Damp Rag', lines: ['New Sun boys have been in and out all week asking about a ship called the Last Hope. Friend of yours?', 'We serve two drinks. Wet, and Wetter.'] },
        { n: 'A Nervous Prospector', lines: ['Three of my partners went into that ruin. I sold their shovels. That’s the whole story.'] }
      ],
      board: ['b_mossback', 'b_sporequeen']
    },
    zones: [
      { id: 'jungle', n: 'Whisperleaf Jungle', lv: [1, 3], enemies: ['snapjaw', 'vinelasher', 'spore', 'nsgthug'],
        art: { k: 'jungle', pal: ['#0d3a33', '#7fbf5a', '#245f40', '#174a31', '#08241a', '#e8f07a'], seed: 13, moons: 2 },
        desc: 'Fronds the size of sails. The river hisses somewhere to your left.' },
      { id: 'whithall', n: 'House of Whithall', lv: [2, 5], depth: 4, enemies: ['sentinel', 'gildwraith', 'vinelasher'],
        art: { k: 'ruins', pal: ['#1d1236', '#6d3f7a', '#3a2550', '#2a1a3d', '#120a20', '#f0d36b'], seed: 14 },
        desc: 'Vaulted ceilings, stained glass, and a staircase where every other step wants you dead.',
        reward: { item: 'w_vibro', cr: 400, text: 'Behind a false panel in the Queen’s dressing room: a jeweled vibro-knife and a purse of ancient coin.' } }
    ],
    events: [
      { t: 'A Borrubari family watches you from a branch. One of them throws a beetle at you. You think it’s a gift.', r: { item: 'jerky' } },
      { t: 'You find a prospector’s pack half-swallowed by roots. The prospector is not nearby. You decide not to look for him.', r: { cr: 60, item: 'medgel' } },
      { t: 'The river runs gold for a moment as the second moon rises. Everyone stops. Nobody says anything. Then a snapjaw ruins it.', battle: true },
      { t: 'A rusted New Sun crate, stamped with the gang’s rising-sun mark.', choices: [
        { l: 'Pry it open', res: 'Grenades. Somebody’s going to miss these.', r: { item: 'fraggren', n: 2 } },
        { l: 'Leave it', res: 'You leave it. The crate is booby-trapped, as you discover when a snapjaw steps on it an hour later.', r: { xp: 30 } }] }
    ]
  },
  pliea: {
    n: 'Pliea', sys: 'Eridanus Star System', region: 'Outer Colonies · New Sun territory', lv: '3–9',
    art: { k: 'desert', pal: ['#3a1730', '#f08a3a', '#c9643a', '#a24d2e', '#4a2318', '#ffd36a'], seed: 21, ring: true },
    blurb: 'A rocky desert world the New Sun Gang uses as a scrapyard. Dune tribes live between the junk mountains, and nobody asks them anything.',
    hub: {
      n: 'Scrapper’s Rest', art: { k: 'junktown', pal: ['#40182c', '#f6a24a', '#b85c34', '#7e3c26', '#2a130c', '#5fd0c0'], seed: 22, ring: true },
      desc: 'A shanty town welded out of dead starships. New Sun flags snap over everything. The water tastes like engine.',
      shop: ['medgel', 'medgel2', 'psicell', 'antitox', 'smoke', 'fraggren', 'cryogren', 'w_hornet', 'w_thornrifle', 'w_vibro', 'w_mule', 'w_baton', 'w_censer', 'a_kevlite', 'a_wraps', 'x_monocle', 'x_heatsink'],
      npcs: [
        { n: 'Omu-Sala, Hesh-Kai Elder', lines: ['The cave under the Rustdunes sings at night. We do not go when it sings. Lately it always sings.', 'Your little hairy one is welcome at our fire. You are welcome to stand near it.'] },
        { n: 'New Sun Weighmaster', lines: ['Everything on Pliea belongs to the Gang. That includes the sand. That includes the sand in your boots. I’m being generous.', 'Scrapjaw’s been squatting on the dunes like he owns them. He does. That’s the problem.'] },
        { n: 'Junk Kid', lines: ['I found a whole cockpit once! It had a skeleton in it. I named him Gerald.', 'Wanna buy a bolt? It’s a good bolt.'] }
      ],
      board: ['b_rustmaw', 'b_gutterprince']
    },
    zones: [
      { id: 'rustdunes', n: 'The Rustdunes', lv: [3, 6], depth: 4, enemies: ['scraphound', 'duneskink', 'scrapper', 'junkgolem'],
        art: { k: 'desert', pal: ['#5a1f2e', '#ffb04a', '#d9743a', '#a8502e', '#4d2414', '#ffe08a'], seed: 23, ring: true },
        desc: 'Dunes of rust-red sand and junk mountains taller than cathedrals.' },
      { id: 'cavern', n: 'Cavern of Whispers', lv: [5, 7], depth: 5, req: 'm2', enemies: ['tombwisp', 'lurker', 'scraphound'],
        art: { k: 'cavern', pal: ['#05070f', '#14243a', '#1d3550', '#122236', '#060a12', '#6ad0ff'], seed: 24 },
        desc: 'Glowing crystal veins and a sound like someone breathing in the next room.' }
    ],
    events: [
      { t: 'A crashed freighter half-buried in a dune. The cargo is still sealed.', choices: [
        { l: 'Crack the hold', res: 'Medical supplies, beautifully preserved.', r: { item: 'medgel2', n: 2 } },
        { l: 'Strip the engine', res: 'You haul out a fistful of good scrap.', r: { scrap: 6 } }] },
      { t: 'Hesh-Kai children race sand-sleds down a junk slope, screaming with joy. One crashes at your feet and hands you a shiny thing before running off.', r: { item: 'psicell' } },
      { t: 'The ringed giant fills half the sky at noon. Pliea’s shadow crawls across it like a slow eclipse.', r: { xp: 40 } },
      { t: 'A New Sun patrol rolls past. They haven’t seen you yet.', choices: [
        { l: 'Ambush them', res: 'You come out shooting.', battle: true },
        { l: 'Hide in the junk', res: 'You wait it out in the belly of a dead hauler. You find some spare parts while you’re in there.', r: { scrap: 3 } }] }
    ]
  },
  eldania: {
    n: 'Eldania', sys: 'Boreas Star System', region: 'Outer Colonies · contested', lv: '6–12',
    art: { k: 'plains', pal: ['#1b1748', '#c97ac9', '#5a4a8a', '#3e3a6a', '#1a1830', '#ffc96a'], seed: 31 },
    blurb: 'Violet grasslands, a busy spaceport, and a war nobody declared. Rebels raid the western city of Clearbourn. Drayden Sparrow runs the far side of the planet.',
    hub: {
      n: 'Port Eldania', art: { k: 'spaceport', pal: ['#14123a', '#b46ac0', '#4b3f7a', '#2f2a55', '#0f0d22', '#5fd0ff'], seed: 32 },
      desc: 'Landing towers, cargo cranes, and a crowd of every species the Outer Colonies can produce. Blue Thorn mercs walk the concourse in threes.',
      shop: ['medgel', 'medgel2', 'psicell', 'psicell2', 'lazarus', 'antitox', 'smoke', 'cryogren', 'shockmine', 'w_epp200', 'w_coilgun', 'w_ashsaber', 'w_flamer', 'w_injector', 'w_thuxfocus', 'a_thornplate', 'a_medweave', 'x_servo', 'x_reactor', 'x_cryoline', 'x_gloves'],
      npcs: [
        { n: 'Dockmaster Ilse', lines: ['Shipment for the rebels? Dock Nine. You didn’t hear it from me, and I want that on a plaque.', 'Clearbourn’s two hundred miles west. Rebels hit it every week now. The Huntress keeps the roads, if you can call that keeping.'] },
        { n: 'Blue Thorn Merc (off duty)', lines: ['We’re not allowed to talk to civilians. That was me talking to a civilian. Don’t tell anybody.', 'Rate’s three hundred a day per soldier. Five if you want us to stop asking questions.'] },
        { n: 'Pilgrim in Grey', lines: ['Have you been cleansed, friend? There is a fire that makes everything clean.', 'No? There’s time. There is always time for the fire.'] },
        { n: 'Info Broker Vash', lines: ['Drayden Sparrow? Pirate prince of the dark side. Steals from everybody. Gets away with it because everybody owes him.', 'For fifty credits I’ll tell you something. For a hundred I’ll tell you something true.'] }
      ],
      board: ['b_twinfang', 'b_hydrarogue']
    },
    zones: [
      { id: 'dock9', n: 'Dock Nine', lv: [6, 8], depth: 3, enemies: ['insurgent', 'sapper', 'bluethorn'],
        art: { k: 'docks', pal: ['#0f0f2a', '#4a3a7a', '#3a3a5a', '#262640', '#0c0c18', '#ff6a4a'], seed: 33 },
        desc: 'Stacked cargo pods, crane shadows, and somebody’s weapons hidden in crates marked FERTILIZER.' },
      { id: 'clearbourn', n: 'Clearbourn Road', lv: [7, 9], depth: 4, req: 'm4', enemies: ['stalker', 'hound', 'insurgent', 'bluethorn'],
        art: { k: 'city', pal: ['#2a1438', '#e0703a', '#6a3a5a', '#45283f', '#180c18', '#ffb84a'], seed: 34 },
        desc: 'Two hundred miles of violet grass, then the walls of Clearbourn, smoking.' },
      { id: 'bastion', n: 'Sparrow’s Bastion', lv: [9, 11], depth: 5, req: 'm5', enemies: ['raider', 'sphinx', 'insurgent'],
        art: { k: 'fortress', pal: ['#07071a', '#3a1a4a', '#2a1a3a', '#1a1028', '#08060f', '#ff6fae'], seed: 35 },
        desc: 'A crag fortress on the night side, searchlights sweeping, pink pennants snapping in the wind.' },
      { id: 'ridges', n: 'The Violet Ridges', lv: [8, 12], enemies: ['stalker', 'hound', 'gauntlet', 'raider'],
        art: { k: 'plains', pal: ['#241a52', '#e08ad0', '#6a4a9a', '#4a3a7a', '#1c1436', '#ffd36a'], seed: 36 },
        desc: 'Wind through tall violet grass. Ridge Stalker nests on every crest.' }
    ],
    events: [
      { t: 'A Gauntlet light tank sits abandoned in the grass, hatch open, engine ticking.', choices: [
        { l: 'Loot the cabin', res: 'Medkits and a few mines.', r: { item: 'shockmine', n: 1, item2: 'medgel2' } },
        { l: 'Strip it for parts', res: 'Good scrap. The kind that doesn’t crumble.', r: { scrap: 8 } }] },
      { t: 'A refugee caravan from Clearbourn passes you. An old man presses a jar of honey into your hands for no reason at all.', r: { item: 'ridgehoney' } },
      { t: 'Three Blue Thorns at a checkpoint wave you through without looking up. Someone paid them not to look up.', r: { xp: 60 } },
      { t: 'Somebody is following you. When you turn, there’s only a woman picking flowers. When you turn again, she’s a man. Then nobody at all.', r: { xp: 80 }, codex: 'valence' }
    ]
  },
  aegialeus: {
    n: 'Aegialeus Cloud', sys: 'Asteroid belt · Outer Colonies', region: 'Territory of the Cleansed', lv: '10–16',
    art: { k: 'asteroids', pal: ['#120818', '#5a1a2a', '#3a1a28', '#24101a', '#0a0408', '#ff7a3d'], seed: 41 },
    blurb: 'An asteroid belt nobody visits. The Cleansed live here, and they believe the only way to be clean is to burn.',
    hub: {
      n: 'Drift Station Kell', art: { k: 'station', pal: ['#140a1a', '#4a1a3a', '#3a2040', '#22122a', '#0a050c', '#ffb06a'], seed: 42 },
      desc: 'A fuel depot hollowed out of a rock at the very edge of the belt, run by a hermit who has outlived three Cleansed raids.',
      shop: ['medgel2', 'psicell2', 'lazarus', 'antitox', 'cryogren', 'psibomb', 'w_coilgun', 'w_glacier', 'w_injector', 'x_heatsink', 'x_cryoline', 'a_hydra', 'a_ghillie'],
      npcs: [
        { n: 'Hermit Kell', lines: ['They come in those little interceptors. Look like rocks till they’re on you. Fastest things in the sky.', 'I keep a cryo cannon by the door. Fire people don’t like the cold. Nobody likes the cold, but them especially.'] },
        { n: 'Burned Pilgrim', lines: ['I walked into the fire to be clean. It hurt so much I walked out again. They call me Unclean now. I call me alive.'] }
      ],
      board: []
    },
    zones: [
      { id: 'emberbelt', n: 'The Ember Belt', lv: [10, 14], enemies: ['zealot', 'interceptor', 'pyredrone'],
        art: { k: 'asteroids', pal: ['#1a0a10', '#7a2a2a', '#4a1a24', '#2a0f18', '#0a0406', '#ff9a4a'], seed: 43 },
        desc: 'Tumbling rocks lit from inside by shrine fires.' },
      { id: 'pyre', n: 'The Great Pyre', lv: [13, 16], depth: 5, enemies: ['zealot', 'pyredrone', 'acolyte', 'interceptor'],
        art: { k: 'pyre', pal: ['#200808', '#ff5a1a', '#8a2a1a', '#4a1410', '#140404', '#ffe06a'], seed: 44 },
        desc: 'A hollowed planetoid with a fire at its heart that has burned for a hundred years.',
        reward: { item: 'w_relic', cr: 1200, text: 'In an ash-choked reliquary: the Pyre-Saint’s own relic, still warm.' } }
    ],
    events: [
      { t: 'A shrine of melted helmets on a rock, candles still lit. Someone left offerings.', choices: [
        { l: 'Take the offerings', res: 'Credits and a psi cell. You feel watched.', r: { cr: 300, item: 'psicell2' } },
        { l: 'Snuff the candles', res: 'Somewhere in the belt, a horn sounds. Here they come.', battle: true }] },
      { t: 'A derelict with its whole crew sitting in their seats, burned to the bone, perfectly calm.', r: { xp: 120 } },
      { t: 'A Cleansed interceptor drifts by, dead and spinning. Its engine is the best you’ve ever seen.', r: { scrap: 12 } }
    ]
  },
  skuna: {
    n: 'Skuna 3', sys: 'Serpens Alcyoneus', region: 'The Serpens System · forbidden', lv: '10–14',
    art: { k: 'hellworld', pal: ['#2a0a08', '#ff4a1a', '#7a2a1a', '#3a1210', '#0a0404', '#8fd8ff'], seed: 51 },
    blurb: 'The most inhospitable world the Republic could find. Days above 200 degrees, nights 200 below. The banished were sent here. Their grandchildren are still here.',
    hub: {
      n: 'Crash Site', art: { k: 'crash', pal: ['#1a0608', '#c43a1a', '#5a2018', '#2a0e0c', '#080303', '#7fd0ff'], seed: 52 },
      desc: 'The Last Hope, belly-down in black glass, steaming. Eric Hull, a Tormented outcast who trades with anything that won’t eat him, has set up a stall by the ramp.',
      shop: ['medgel2', 'psicell2', 'lazarus', 'antitox', 'jerky', 'cryogren', 'shockmine', 'w_railgun', 'w_katana', 'w_autocannon', 'w_tesla', 'w_prism', 'w_sunspit', 'a_hydra', 'a_ghillie', 'x_dampener', 'x_insignia'],
      npcs: [
        { n: 'Eric Hull, the Half-Born', lines: ['My grandmother stole bread three times on a world called Ruenov. So here I am. Fair, yes?', 'Day kills you slow. Night kills you fast. The Thrice-Damned kills you whenever he likes. Buy something.'] },
        { n: 'Tormented Child', lines: ['(It has too many eyes. All of them are curious.) You are soft. Are all of you soft?'] }
      ],
      board: ['b_nightfrost']
    },
    zones: [
      { id: 'flats', n: 'Scorchday Flats', lv: [10, 12], depth: 4, enemies: ['scav', 'sandreaper', 'howler'],
        art: { k: 'hellworld', pal: ['#3a0c06', '#ff7a2a', '#a8381a', '#5a1a10', '#140504', '#ffe06a'], seed: 53 },
        desc: 'The day side. The air ripples. Your boots start to smell like cooking.' },
      { id: 'canyons', n: 'Nightfrost Canyons', lv: [11, 14], enemies: ['frostburnt', 'howler', 'scav'],
        art: { k: 'ice', pal: ['#02040e', '#1a3a6a', '#2a4a7a', '#14284a', '#030612', '#bff0ff'], seed: 54 },
        desc: 'The night side. Frost blooms on your visor. Something howls, and something else answers.' },
      { id: 'pit', n: 'Pit of the Thrice-Damned', lv: [12, 14], depth: 5, req: 'm7', enemies: ['frostburnt', 'howler', 'scav'],
        art: { k: 'pit', pal: ['#1a0404', '#8a1a1a', '#4a0e0e', '#2a0808', '#080202', '#ff8a3a'], seed: 55 },
        desc: 'A crater where the first prison ships came down. The Tormented built a throne out of their hulls.' }
    ],
    events: [
      { t: 'The terminator line sweeps past: one moment scorching, the next freezing. Your armor groans.', r: { xp: 100 } },
      { t: 'An old Republic prison pod, door torn off from the inside. Scratched on the wall: 1, 2, 3.', r: { item: 'lazarus' } },
      { t: 'A Tormented scavenger watches from a ridge, then sets something down and backs away. A trade? You leave a medgel. It takes it and leaves you a root that glows faintly blue.', r: { item: 'frostroot' } }
    ]
  },
  wucury: {
    n: 'Wucury', sys: 'Canis Hyperbius', region: 'Lost Soul Federation stronghold', lv: '12–16',
    art: { k: 'storm', pal: ['#0a100c', '#3a4a3a', '#2a3a2a', '#1a2418', '#060a06', '#d6ff6a'], seed: 61 },
    blurb: 'A storm-wracked moon where the Lost Soul Federation masses its army. One purpose: burn the Risen Ashes Republic to the ground.',
    hub: {
      n: 'Smuggler’s Cut', art: { k: 'bunker', pal: ['#0c120e', '#4a5a3a', '#2a3624', '#1a2216', '#060806', '#ffd86a'], seed: 62 },
      desc: 'A canyon outpost of smugglers who sell to the Federation and steal from it in roughly equal amounts.',
      shop: ['medgel2', 'trauma', 'psicell2', 'lazarus', 'antitox', 'shockmine', 'psibomb', 'w_railgun', 'w_katana', 'w_autocannon', 'w_tesla', 'w_prism', 'w_starfang', 'w_lancer', 'a_aegis', 'x_dogtags', 'x_insignia', 'x_medimplant'],
      npcs: [
        { n: 'Smuggler Queen Tamsin', lines: ['The Federation pays in guns. I sell the guns to the Federation. It’s a beautiful little circle.', 'Don Ortega hates the Republic more than he loves breathing. Don’t get between him and either.'] },
        { n: 'LSF Deserter', lines: ['They tell you the Republic stole our birthright. Maybe. But I never saw a birthright. I saw a lot of trenches.'] }
      ],
      board: ['b_gauntletace']
    },
    zones: [
      { id: 'trenches', n: 'Stormwall Trenches', lv: [12, 15], enemies: ['lsftrooper', 'commando', 'hydra'],
        art: { k: 'storm', pal: ['#0a120c', '#5a6a4a', '#34442e', '#1e2a1a', '#070a06', '#eaff8a'], seed: 63 },
        desc: 'Mud, wire, lightning, and a war that hasn’t started yet.' },
      { id: 'drydock', n: 'Proximo Drydock', lv: [12, 14], depth: 4, enemies: ['lsftrooper', 'commando'],
        art: { k: 'docks', pal: ['#0c100c', '#3a4a2a', '#2a3424', '#1a2016', '#060806', '#ffb04a'], seed: 64 },
        desc: 'The Federation carrier Proximo, ribs exposed in a canyon drydock.' },
      { id: 'fort', n: 'Fort Revenant', lv: [14, 16], depth: 5, enemies: ['lsftrooper', 'commando', 'hydra', 'bluethorn'],
        art: { k: 'fortress', pal: ['#060a06', '#2a3a1a', '#1e2a14', '#121a0c', '#040604', '#ff5a3a'], seed: 65 },
        desc: 'The Federation’s war fortress, carved into a mountain. Every gun on it points at the Inner Colonies.',
        reward: { item: 'w_hydrapod', cr: 1500, text: 'An armory locker nobody locked: a Hydra rocket pod, factory sealed.' } }
    ],
    events: [
      { t: 'Lightning strikes a Hydra twenty meters away. It doesn’t move again.', r: { scrap: 10 } },
      { t: 'A Federation propaganda tower blares: REMEMBER THE CASTING OUT. RETURN THE RICHES. Someone has spray-painted “and then what?” under it.', r: { xp: 140 } },
      { t: 'A supply drop lands off course, right at your feet.', r: { item: 'trauma', item2: 'psicell2' } }
    ]
  },
  ruenov: {
    n: 'Ruenov', sys: 'Hyperes System', region: 'Inner Colonies · seat of the Republic', lv: '13–18',
    art: { k: 'megacity', pal: ['#f6e7c0', '#e8b86a', '#c9a36a', '#8a7050', '#3a2c20', '#ffffff'], seed: 71 },
    blurb: 'The richest world in the galaxy and the capital of the Risen Ashes Republic. A whole planet of gold spires, broadcasting that it is a utopia, around the clock.',
    hub: {
      n: 'The Gilded Promenade', art: { k: 'promenade', pal: ['#fff0c8', '#f2c46a', '#d6a860', '#9a7a50', '#40301e', '#7d3cff'], seed: 72 },
      desc: 'Fountains, banners, smiling holograms of the Praetor, and Peacekeeper drones that smile too. Breaking the law three times gets you banished. You’re on your first.',
      shop: ['medgel2', 'trauma', 'psicell2', 'lazarus', 'antitox', 'shockmine', 'psibomb', 'w_starfang', 'w_lancer', 'w_glacier', 'w_hydrapod', 'w_cutter', 'w_relic', 'a_aegis', 'a_shadow', 'x_medimplant', 'x_dampener', 'x_dogtags'],
      npcs: [
        { n: 'Cheerful Citizen', lines: ['Isn’t it wonderful? Everything is decided for us, so nobody ever has to worry!', '(quietly) Please buy something. They count.'] },
        { n: 'Peacekeeper Drone', lines: ['GOOD AFTERNOON, CITIZEN. YOUR HAPPINESS HAS BEEN NOTED.', 'OFFENSE ONE OF THREE: LOITERING NEAR A DRONE.'] },
        { n: 'Eclipse Recruiter', lines: ['The Republic is the past. Eclipse is the future. Sign today, receive a complimentary future.'] }
      ],
      board: ['b_propengine']
    },
    zones: [
      { id: 'undercity', n: 'Undercity Arcologies', lv: [13, 15], depth: 4, enemies: ['shadowblade', 'enforcer', 'peacedrone'],
        art: { k: 'undercity', pal: ['#1a1410', '#5a4030', '#3a2a20', '#241a14', '#0a0806', '#9bf0d0'], seed: 73 },
        desc: 'Below the gold, the old city. Rebels, rats, and the people the broadcasts forgot.' },
      { id: 'spire', n: 'Eclipse Spire', lv: [15, 17], depth: 5, req: 'm9', enemies: ['blackop', 'monarch', 'peacedrone'],
        art: { k: 'spire', pal: ['#0a0614', '#3a1a6a', '#2a1450', '#180c30', '#06040c', '#d8c8ff'], seed: 74 },
        desc: 'Black glass, violet light, two thousand floors. Eclipse’s new tower, already taller than the Republic’s.' },
      { id: 'boulevard', n: 'Republic Boulevard', lv: [14, 18], enemies: ['enforcer', 'peacedrone', 'seraph', 'monarch'],
        art: { k: 'megacity', pal: ['#ffe9b8', '#e0a85a', '#b8905a', '#7a5e40', '#2e2216', '#ff5a3a'], seed: 75 },
        desc: 'Parade grounds and propaganda seraphs singing in the air.' }
    ],
    events: [
      { t: 'A broadcast interrupts itself for one second. A different face says: THE CORE IS ROTTEN. Then the Praetor is smiling again.', r: { xp: 200 }, codex: 'rebellion' },
      { t: 'A Peacekeeper drone issues you an offense for walking too quickly. Then another for walking too slowly.', choices: [
        { l: 'Pay the fine', res: 'You pay 150 credits. The drone thanks you for your enthusiasm.', r: { cr: -150, xp: 50 } },
        { l: 'Run', res: 'It does not like running.', battle: true }] },
      { t: 'A child in a gold uniform hands you a flyer: THE REPUBLIC LOVES YOU. On the back, in crayon: help.', r: { item: 'psicell2' } }
    ]
  },
  unknown: {
    n: 'The Unknown Regions', sys: 'Beyond K-831', region: 'Uncharted space', lv: '16–22',
    art: { k: 'void', pal: ['#030208', '#1a0d2e', '#24103a', '#140824', '#020104', '#9f7fff'], seed: 81 },
    blurb: 'Past the edge of every chart. The Unseen live here, and the New Sun Gang is the only one they trade with.',
    hub: {
      n: 'Unseen Trade Post', art: { k: 'bazaar', pal: ['#06030e', '#2a1448', '#3a1e5a', '#1c0e30', '#040208', '#e3b23c'], seed: 82 },
      desc: 'A ring of lashed-together New Sun freighters around a black spindle. The Unseen trade here in silence. You never quite see them, only their hands.',
      shop: ['trauma', 'psicell2', 'lazarus', 'antitox', 'jerky', 'psibomb', 'shockmine', 'w_nova', 'w_phantomrep', 'w_dirk', 'w_sphinx', 'w_bronco', 'w_voideye', 'a_veil', 'a_carapace', 'x_medimplant'],
      npcs: [
        { n: 'New Sun Factor', lines: ['Don’t look at them directly. They don’t like it. Don’t look away either. They don’t like that more.', 'We bring them guns, they bring us passage. Nobody asks what they need guns for out here.'] },
        { n: 'A Pair of Hands', lines: ['(Long grey fingers set down a black stone, tap it twice, and withdraw. You get the impression of a price.)'] }
      ],
      board: ['b_thingbetween']
    },
    zones: [
      { id: 'hollow', n: 'The Hollow Dark', lv: [16, 19], depth: 5, enemies: ['ustalker', 'hwraith', 'reaver'],
        art: { k: 'void', pal: ['#020106', '#140a26', '#1e0e34', '#10061c', '#010003', '#7fd0ff'], seed: 83 },
        desc: 'A region where the stars are too few and too close. Your instruments disagree about which way is forward.' },
      { id: 'throne', n: 'The Veiled Throne', lv: [19, 21], depth: 6, req: 'm11', enemies: ['veilhorror', 'hwraith', 'reaver', 'ustalker'],
        art: { k: 'throne', pal: ['#000000', '#0e0620', '#1a0d2e', '#0a0414', '#000000', '#ff5fa2'], seed: 84 },
        desc: 'A cathedral built from a dead star. At the top, something wrapped in a veil is waking up.' },
      { id: 'drift', n: 'Drift of Lost Ships', lv: [17, 22], enemies: ['ustalker', 'hwraith', 'reaver', 'veilhorror'],
        art: { k: 'graveyard', pal: ['#03020a', '#1a1030', '#221640', '#120a22', '#020106', '#c9b0ff'], seed: 85 },
        desc: 'Every ship that ever wandered past the charts and didn’t come back. Some of their lights are still on.' }
    ],
    events: [
      { t: 'A Republic survey ship drifts by, every porthole lit, nobody aboard. Its log ends mid-sentence.', r: { item: 'trauma' } },
      { t: 'For a moment, every star goes out. Then they come back, in slightly different places.', r: { xp: 300 } },
      { t: 'A grey hand reaches out of the dark and offers you a stone.', choices: [
        { l: 'Take it', res: 'It’s warm. It hums. Psi cells recharge just from being near it.', r: { item: 'psicell2', n: 3 } },
        { l: 'Decline politely', res: 'The hand withdraws. Something in the dark seems… pleased? You feel lighter.', r: { xp: 400 } }] }
    ]
  },
  snailshell: {
    n: 'Snail Shell Nebula', sys: 'Uncharted spiral', region: 'Phantom Fleet waters', lv: '22–27',
    art: { k: 'nebula', pal: ['#05030a', '#3a0f3a', '#5a1f5a', '#2a0a2a', '#020104', '#ff9ad6'], seed: 91, spiral: true },
    blurb: 'A spiral nebula where ships go dark. Black flags with two letters are found at every wreck: PF.',
    hub: {
      n: 'Derelict Teresa', art: { k: 'derelict', pal: ['#060408', '#2a1a2a', '#3a243a', '#1a101a', '#030204', '#ff9ad6'], seed: 92 },
      desc: 'A dead liner called Teresa, drifting at the nebula’s edge. Someone has been living in it. Someone left you a note: TURN BACK.',
      shop: ['trauma', 'psicell2', 'lazarus', 'antitox', 'psibomb', 'shockmine'],
      npcs: [{ n: 'The Note', lines: ['TURN BACK. THEY TAKE NO PRISONERS. THEY TOOK MINE.'] }],
      board: []
    },
    zones: [
      { id: 'graveyard', n: 'Ghost Fleet Graveyard', lv: [22, 25], enemies: ['preaver', 'ghostfrig', 'voidmite'],
        art: { k: 'graveyard', pal: ['#06030a', '#3a1036', '#4a1a4a', '#220a22', '#020103', '#ffd0f0'], seed: 93 },
        desc: 'Wrecks spiral inward toward something in the middle.' },
      { id: 'flagship', n: 'The Black Flagship', lv: [24, 27], depth: 6, enemies: ['preaver', 'ghostfrig'],
        art: { k: 'flagship', pal: ['#000000', '#1a0a1a', '#2a0f2a', '#100510', '#000000', '#ff3a3a'], seed: 94 },
        desc: 'The Phantom Fleet’s flagship. It is real. It is enormous. It has seen you.',
        boss: { btn: 'Storm the Commodore’s bridge', lv: 27, battle: ['commodore', 'preaver'],
          pre: ['The bridge of the black flagship. Hundreds of black flags hang from the ceiling, one for every ship they ever took.', 'At the helm stands a tall figure in a captain’s coat gone grey with age, face hidden under a tricorn of black steel.', 'N:The Pitiless Commodore|No prisoners. No witnesses. No exceptions. You came a long way to become a flag, treasure hunter.', 'miles|Funny. I came a long way to take one.'],
          post: ['The Commodore falls against the helm. The black flags stir, though there is no wind.', 'N:The Pitiless Commodore|Pitiless Frontiersmen. That’s what PF meant. Nobody ever asked.', 'From the Commodore’s coat you take the last black flag. Nobody has ever taken one off a living Phantom. Now nobody ever will.', 'The Phantom Fleet is finished. Somewhere, a dozen shipping companies are about to have a very good quarter.'] } }
    ],
    events: [
      { t: 'A black flag drifts past, two letters stitched in grey: PF.', r: { xp: 500 } },
      { t: 'A Phantom lifeboat, empty except for a chest of stolen credits.', r: { cr: 1500 } }
    ]
  }
};
const TRAVEL_ORDER = ['eplaotune', 'pliea', 'eldania', 'aegialeus', 'skuna', 'wucury', 'ruenov', 'unknown', 'snailshell'];
const LOC_UNLOCK = { eplaotune: 'start', pliea: 'm1', eldania: 'm3', skuna: 'm6', aegialeus: 'm8', wucury: 'm8', ruenov: 'm8', unknown: 'm10', snailshell: 'm12' };
