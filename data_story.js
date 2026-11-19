/* ============================================================
   THE SACRED SHROUD — story: scenes, main quest, crew quests,
   bounties, Julius's favors, party chat, codex
   Line format:  "speaker|text"  narration has no bar.
   Prefix [h:id] hero is id · [nh:id] hero is not id · [p:id] id in party · [r:id] id recruited
   Commands: ~join:id ~codex:id ~item:id ~cr:n ~flag:x ~heal
   ============================================================ */

const SCENES = {
/* ---------------- PROLOGUES ---------------- */
pro_miles: [
  "~codex:eplaotune",
  "EPLAOTUNE. Zeta Amphiaraus system. Out here in the Outer Colonies the law is a rumor, and the jungle is always hungry.",
  "Miles Mason follows a river through the green dark. Something moves at the corner of his eye. He spins, draws Ole Betsy, and puts three bolts into a bush.",
  "Through the singed leaves, a small face peers back at him. Out waddles a Borrubari: bipedal, palm-sized, harmless, eats only insects.",
  "miles|Hey there, little fella. You scared me. I’m out here looking for treasure and I thought someone beat me to it. But you wouldn’t know about any of that. Well. Bye.",
  "He walks on. The Borrubari follows. He walks faster. Somehow it keeps up.",
  "miles|Okay. I’ll have to talk it over with my crew, but I guess I can keep you. I’ll call you Spectro. And before you judge the ship’s name, it was already named when I, um, inherited it.",
  "~codex:whithall",
  "The ruins of House Whithall rise out of the vines. Inside: vaulted ceilings, stained-glass windows. A queen. A brilliant necklace. And a final pane where her whole family lies fallen around her while she holds the necklace over them.",
  "Lady Whithall devoured her family’s souls to become the strongest ruler in the sector. Then the power ate her too. Her necklace, set with a Thux gem worth 300,000 standard units, has been waiting ever since.",
  "Miles takes the stairs two at a time, skipping the first to avoid the first trap, knocks out the back of a fireplace and crawls through a secret flue. Seeker drones ping like crazy from the master bedroom.",
  "There it is, shining on its bust in the ruins. He lifts it into his bag.",
  "Behind him, something made of stone and old oaths grinds to its feet."
],
pro_miles_post: [
  "The sentinel collapses into gravel. Spectro peeks out of Miles’ jacket.",
  "jaxon|Uh, Miles, I just got a reading showing a New Sun ship coming in near your location. And they definitely know I’m here too. You need to get back to the ship as soon as possible.",
  "miles|Okay, I’ll hurry back. And by the way, I picked up a friend.",
  "jaxon|You did what?",
  "miles|A little native friend. A Borrubari.",
  "jaxon|Okay, that’s better. I thought you meant another person. At least this guy won’t steal my food and bunk space.",
  "Somewhere deep in the bag, the necklace is warm. Miles doesn’t notice. Yet."
],
pro_jaxon: [
  "~codex:eplaotune",
  "EPLAOTUNE. Riverside Landing. Jaxon Valkenburg has been guarding the Last Hope for nine hours in a hundred percent humidity, and he has opinions about it.",
  "kat|Mr. Valkenburg, your heart rate suggests boredom.",
  "jaxon|My heart rate suggests the captain went treasure hunting and left me with the mosquitoes, KAT.",
  "kat|The local insects are not mosquitoes. They are much larger.",
  "jaxon|Thank you, KAT.",
  "He checks his rifle again. Out of habit, his thumb finds the scar on his shoulderguard: a ragged patch where a blue thorn emblem used to be. He moves his thumb away.",
  "The treeline moves. Two snapjaw striders slink out of the fronds, low and hungry, eyes on the open ramp.",
  "jaxon|Not today. Not on my ramp."
],
pro_jaxon_post: [
  "The striders flee into the green. Jaxon’s comm crackles.",
  "kat|Mr. Valkenburg. I am reading a New Sun ship descending toward the captain’s position. And ours.",
  "jaxon|Uh, Miles, I just got a reading showing a New Sun ship coming in near your location. You need to get back as soon as possible.",
  "miles|Okay, I’ll hurry back. And by the way, I picked up a friend.",
  "jaxon|You did what?",
  "Twenty minutes later the captain jogs out of the jungle with a Borrubari riding on his shoulder like a tiny admiral.",
  "jaxon|Sir. Why is it looking at me like that.",
  "miles|His name’s Spectro. He likes you.",
  "~join:miles"
],
pro_katey: [
  "~codex:lasthope",
  "THE LAST HOPE. Starboard workshop. Katey Tiller, ship’s scientist and ship’s doctor (one salary, two jobs, she has mentioned this) is three hours into a test that was supposed to take ten minutes.",
  "katey|Okay, ATRaP prototype two. All-Terrain Road Pack. Jetpack function: check. Rappel rig: check. Bridge mode…",
  "The pack unfolds into a bridge across her workbench, flips her coffee into the air, and keeps unfolding.",
  "katey|Bridge mode needs work.",
  "Across the room, her old lab drone, the one she has been meaning to fix for a year, wakes up with a red eye and a spinning saw.",
  "katey|No. No, no, I unplugged you. I definitely unplugged you.",
  "kat|Doctor, I am detecting a power surge in your workshop.",
  "katey|Yeah, KAT, I’m detecting it too!"
],
pro_katey_post: [
  "The drone sparks, wobbles, and falls over with a sad little beep.",
  "katey|I’ll fix you. Someday. Probably.",
  "kat|Doctor, the captain is returning with a necklace and, I am told, an animal.",
  "katey|An animal? What kind of animal?",
  "kat|A Borrubari.",
  "Katey is already running for the ramp. When Miles comes aboard, the little creature takes one look at her and leaps straight into her arms.",
  "miles|I haven’t even picked him up yet. How did you do that?",
  "katey|I have a way with animals. They just like me.",
  "~join:miles",
  "~join:jaxon"
],
pro_kat: [
  "~codex:lasthope",
  "THE LAST HOPE. Ship systems nominal. Reactor at 71 percent. Galley temperature: warm. Chef temperature: hostile.",
  "This is KAT. Cybernetic Automaton Translator, according to a label on a part of her she cannot access. The crew uses the acronym. She prefers it.",
  "Today, for the first time, she is also standing up. Dr. Tiller finished the maintenance chassis last night and let her try it. She has walked into a wall twice. She is choosing to regard this as data.",
  "Before takeoff she runs a routine lifeform scan. It returns something that is not a lifeform: two clamped shapes on the dorsal hull, cutting.",
  "kat|Intruder alert. Boarding drones, New Sun manufacture. They are inside the cargo bay.",
  "Nobody else is aboard who can fight. The captain is in the jungle. Mr. Valkenburg is outside at the ramp.",
  "kat|Very well. I will handle this myself. In the body. Which I have had for nine hours."
],
pro_kat_post: [
  "The drones fall apart under the arc wrench. KAT looks at her new hands for a long moment.",
  "kat|That was… satisfying. I should report that to the doctor as a possible malfunction.",
  "In a corner of her memory, a file she has never been able to open flickers once, as if something knocked on it from the inside. Then it is still.",
  "jaxon|KAT? You okay in there? I heard banging.",
  "kat|I am well, Mr. Valkenburg. The New Sun is not. You should know a New Sun ship is descending toward the captain’s location.",
  "Miles returns at a run with a necklace and a Borrubari. He stops dead on the ramp.",
  "miles|KAT? You have legs?",
  "kat|Two, sir. As is standard.",
  "~join:miles",
  "~join:jaxon"
],
pro_ryder: [
  "~codex:lsf",
  "EPLAOTUNE. The Damp Rag, a cantina on stilts above a brown river. Ryder, no last name, drinks alone with his back to the wall, the only sensible way to drink.",
  "Two New Sun thugs sit down without asking.",
  "N:Thug|Funny thing. Lost Soul Federation’s paying a lot for a pilot who walked off with one of their fighters. Fits your description.",
  "ryder|Lot of pilots out here.",
  "N:Thug|Not with LSF ace wings sewn on the inside of their jacket.",
  "ryder|Huh. I thought that was a really good hiding spot."
],
pro_ryder_post: [
  "The thugs are face-down in the river. The bartender serves another drink without being asked.",
  "Across the room, a broad-shouldered man in a dented vest has been watching. He finishes asking around about a crew for a ship called the Last Hope.",
  "jaxon|We don’t need a pilot. We have an AI.",
  "ryder|Your AI ever fly through a nebula with three gunships on her tail?",
  "kat|(over Jaxon’s comm) I have not. I would like to never do so.",
  "The captain turns up with a necklace, a Borrubari, and a grin.",
  "miles|He can fly? He’s hired. Welcome aboard the Last Hope. She was named that when I got her.",
  "~join:miles",
  "~join:jaxon"
],
pro_celeste: [
  "~codex:cleansed",
  "Fire. Always the dream starts with fire: the chanting, the ropes, the heat climbing her legs. The Pyre-Father’s voice saying cleansed, cleansed, cleansed.",
  "And then waking up in the ashes when everyone else had stopped moving. Untouched. Holy, they said, and came for her again.",
  "CELESTE GALLAGHER opens her eyes in the cargo hold of a ship she stowed away on two ports ago. The Last Hope. She liked the name.",
  "Something scrabbles in the vents. Eyes. Teeth. Vent rats, fat on stolen rations.",
  "celeste|I was here first.",
  "Warmth gathers in her palms, the way it always does now."
],
pro_celeste_post: [
  "The rats are smoking husks. The smell brings a large man in an apron running, cleaver raised.",
  "julius|What in the hell is going on in my hold? You. You’ve been eating my jerky.",
  "celeste|Some of it.",
  "julius|Half the crate!",
  "celeste|I was hungry for half a crate.",
  "julius|You’re either crew or you’re cargo, girl. And cargo goes out the airlock.",
  "He marches her to the ramp just as the captain jogs out of the jungle with a Borrubari on his shoulder.",
  "miles|Jules, why are you holding a stowaway at cleaver-point?",
  "celeste|I can set things on fire with my mind.",
  "Miles looks at the smoking vent behind her. Then at Julius. Then back at her.",
  "miles|You’re hired. Jules, put the cleaver down.",
  "~join:miles",
  "~join:jaxon"
],

/* ---------------- CHAPTER 1: THE OFFER ---------------- */
ch1_offer: [
  "~codex:nsg",
  "~join:miles",
  "~join:jaxon",
  "CHAPTER ONE · THE OFFER",
  "kat|Captain, you are needed on the bridge. Captain, you are needed on the bridge.",
  "miles|Alright KAT, this better be good. I’m ready to get some sleep.",
  "kat|Sir, we have an incoming transmission from the New Sun Gang. They also appear to have us surrounded. They are not moving to attack.",
  "miles|Wait, what? Surrounded? Like, right outside?",
  "kat|Yes, sir. I noticed during a routine lifeform scan before takeoff.",
  "miles|And you think if we take off, they blow us out of the sky.",
  "kat|Yes, sir. I do.",
  "miles|Hmph. Put it through.",
  "The holo-table flickers. A man in New Sun garments, gold sunburst on his collar, smiles like a shark at a funeral.",
  "N:New Sun Envoy|Miles Mason. You know who we are. We have watched you for some time. We need an item acquired: the Sacred Shroud. Accept, and we pay one million credits in advance, five million on completion.",
  "[p:jaxon]jaxon|Sir. Six million credits.",
  "[p:katey]katey|Sir. They’re the New Sun Gang.",
  "Before Miles can answer, the table splits into two images. A second caller: a narrow man in a perfect violet suit.",
  "~codex:eclipse",
  "N:Cecil Buckner|Apologies for interrupting. Cecil Buckner, Eclipse Corporation, acquisitions. We also want the Shroud. Unlike our friends here, we have actual leads. And we pay better.",
  "N:New Sun Envoy|Eclipse. Of course.",
  "N:Cecil Buckner|The Risen Ashes Republic is hunting it. So is the Lost Soul Federation. Everyone who wants to win the war wants the Shroud, Mr. Mason. Better it end up with a business. Businesses are predictable.",
  "[h:ryder]ryder|The Federation’s after it? Great. Wonderful. Love that.",
  "[h:celeste]celeste|What is it? The Shroud.",
  "N:Cecil Buckner|An artifact older than the Republic. Our scholars call it a key. To what, we’d like to find out.",
  "miles|Gentlemen. I’m flattered. I’m going to think about it.",
  "N:New Sun Envoy|Then let us help you think.",
  "The New Sun transmission cuts. Outside, boots hit the mud. KAT reports a squad forming up at the landing pad, led by a lieutenant named Brian Ayers.",
  "miles|Well. That’s a no to them, then."
],
m1_pre: [
  "Riverside Landing. Half the town has vanished indoors. New Sun thugs fan out across the mud, and in front of them, Lt. Brian Ayers spins a gold-plated pistol around one finger.",
  "N:Lt. Ayers|Captain! Boss says you need persuading. I’m very persuasive.",
  "[h:jaxon]jaxon|Stay behind me, sir. Everybody else, behind the sir.",
  "[nh:jaxon]jaxon|Sir, I’ve got the left. Try not to get shot on the right.",
  "miles|No promises."
],
m1_post: [
  "Ayers stumbles back into the mud, his pistol gone.",
  "N:Lt. Ayers|This isn’t over, Mason! The Sun always rises!",
  "miles|Yeah, and it always sets too, buddy.",
  "The New Sun ships lift off and vanish over the canopy. On the bridge, Cecil Buckner is still waiting on the holo, sipping tea.",
  "N:Cecil Buckner|Impressive. So. Do we have an arrangement?",
  "miles|We do. What’s the first lead?",
  "N:Cecil Buckner|Pliea, in the Eridanus system. A desert world. The New Sun uses it as a junkyard. The local tribes speak of a cavern under the dunes that holds an ‘ancient object.’ It frightens them. We’d like to know why.",
  "The holo dies. Down the corridor, Julius Spence is chasing Spectro out of the galley with a ladle.",
  "julius|If that rodent gets in my kitchen again, it’s the next meal!",
  "miles|Jules. Chill out.",
  "[nh:katey]Katey Tiller appears in the corridor with a lumpy backpack covered in straps and folded metal arms.",
  "[nh:katey]katey|I’m coming to Pliea. Desert terrain is exactly what the ATRaP was built for. Also someone has to keep you alive.",
  "[nh:katey]miles|Is that thing going to explode?",
  "[nh:katey]katey|Probably not!",
  "[h:katey]katey|Desert terrain. Finally, a real test for the ATRaP.",
  "~join:katey",
  "~codex:shroud",
  "Pliea is now on the galaxy map. Board the Last Hope to travel."
],

/* ---------------- CHAPTER 2: PLIEA ---------------- */
m2_arrive: [
  "~codex:pliea",
  "CHAPTER TWO · DUNES OF PLIEA",
  "The Last Hope sets down in Scrapper’s Rest, a town welded out of dead starships. A ringed gas giant fills half the sky.",
  "kat|Pliea. Rocky desert. The only intelligent locals are the dune tribes. And the New Sun, if we are being generous with the word intelligent.",
  "[p:katey]katey|Look at all this junk. I could build anything out here. I could build a second ship.",
  "[p:jaxon]jaxon|Please don’t build a second ship.",
  "An old Hesh-Kai woman named Omu-Sala finds you at the town well. She says the cavern lies under the Rustdunes, past the place where Kaleb McIntosh, called Scrapjaw, has dug in his mining rigs.",
  "N:Omu-Sala|He blocks the way. He wants what sleeps down there. He doesn’t know it sleeps lightly."
],
m2_mid: [
  "Halfway across the dunes, you find a Hesh-Kai sand-sled wrecked against a junk heap, its riders gone. New Sun boot prints lead toward the mining rigs.",
  "[p:katey]katey|These tracks are fresh. And heavy. Like something with legs that shouldn’t have legs.",
  "[p:ryder]ryder|Legs that shouldn’t have legs. I hate this planet already."
],
m2_pre: [
  "At the heart of the Rustdunes, a mining rig the size of a cathedral straddles a sinkhole. Lights. Drills. Flags. And at the controls of a walking scrap-mech built from three trucks and a crane, Kaleb ‘Scrapjaw’ McIntosh.",
  "N:Scrapjaw|Well look at this. Eclipse’s new pets. You’re after the Shroud too, huh? Get in line. Actually, don’t. Get in the ground.",
  "miles|We’re just here for the cave, pal.",
  "N:Scrapjaw|The cave’s MINE. Everything under this sand is mine. Boys! Wake up the Grinder!"
],
m2_post: [
  "Scrapjaw’s mech crashes into the sinkhole in a shower of sparks. He crawls out of the wreck, coughing, and runs.",
  "N:Scrapjaw|You don’t know what’s down there! None of us do! I just wanted to sell it!",
  "Below the rig, a stair carved by no human hand spirals into darkness. Cold air breathes out of it. The Cavern of Whispers is open."
],
m3_mid: [
  "The crystal walls carry pictures, carved in lines finer than a hair. A great sphere wrapped in cloth. People kneeling. Then people standing up again with empty eyes, all facing the same way.",
  "[p:katey]katey|The cloth’s alive in these carvings. Look, it’s reaching.",
  "[p:celeste]celeste|I don’t like it. It feels like the fire. Like something that wants you to belong to it.",
  "[p:kat]kat|I can read this script. I do not know how I can read this script."
],
m3_pre: [
  "The cavern opens into a vault of black crystal. In its center, a pedestal. On the pedestal, a shard of dark glass with stars moving inside it.",
  "And curled around the vault, so large you mistook it for the walls, something opens one pale eye.",
  "[p:jaxon]jaxon|Sir. The walls are breathing.",
  "miles|I see that, Jax."
],
m3_post: [
  "The Sleeper sinks back into the crystal, dreaming again. The shard sits on its pedestal, waiting.",
  "~item:fragment",
  "~codex:fragments",
  "Miles picks it up. The stars inside rearrange themselves into a pattern, a map, and point outward.",
  "kat|Captain. The fragment is emitting a signal. And it is resonating with something on the ship.",
  "miles|With what?",
  "The necklace in Miles’ pocket is warm. The Thux gem glows the same color as the shard. Just for a second.",
  "[nh:kat]Back aboard, Katey drags a crate out of a junk pile near the ship: a slender automaton frame of old, elegant make, stamped C.A.T.",
  "[nh:kat]katey|A Cybernetic Automaton Translator chassis. KAT, I think this is your body. Your actual original body.",
  "[nh:kat]kat|My… original?",
  "[nh:kat]Two hours later, KAT walks down the ramp on her own two feet. She looks at her hands for a very long time.",
  "[nh:kat]kat|Thank you, Doctor. I will try not to walk into walls.",
  "[h:kat]Katey finds a second automaton frame in the junk, older and more elegant than the one KAT has been using, stamped C.A.T. She swaps KAT’s core into it that night.",
  "[h:kat]kat|It fits. Like it was made for me. Doctor, I believe it was made for me.",
  "~join:kat",
  "N:Cecil Buckner|(on the holo) A fragment! Wonderful. There are more. Our analysts point to Eldania in the Boreas system. A rebel war, a pirate prince, and a woman called the Huntress. You’ll love it.",
  "Eldania is now on the galaxy map."
],

/* ---------------- CHAPTER 3: ELDANIA ---------------- */
m4_arrive: [
  "~codex:eldania",
  "CHAPTER THREE · THE HUNTRESS OF CLEARBOURN",
  "Port Eldania is loud, crowded and violet-lit. After an afternoon of asking around, buying drinks, and one minor fistfight, the crew has three leads.",
  "kat|One: the city of Clearbourn, two hundred miles west, has been attacked by rebels for weeks. Two: a shipment of weapons for those rebels is coming in through this very spaceport, at Dock Nine. Three: Drayden Sparrow is operating on the other side of the planet.",
  "miles|And Buckner thinks one of them has our next fragment.",
  "kat|He thinks Sparrow has it. He also thinks the rebels want it, and the Huntress of Clearbourn wants anyone who gets near it dead.",
  "[p:jaxon]jaxon|Sir, there are Blue Thorns all over this port. Let’s keep our heads down.",
  "[p:jaxon]miles|You’re keeping yours lower than usual, Jax.",
  "[p:jaxon]jaxon|…Yes, sir.",
  "~codex:bluethorns",
  "[nh:ryder]~flag:ryder_avail",
  "[nh:celeste]~flag:celeste_avail",
  "First stop: Dock Nine."
],
m4_pre: [
  "Crates marked FERTILIZER, stacked to the crane rails. Rebels loading them onto hover-sleds. And parked at the end of the dock, its turret swinging toward you, an IV51 Gauntlet light tank with a red-painted cap on its hatch.",
  "N:Rebel Quartermaster|Eclipse dogs! Redcap, light them up!",
  "miles|Okay, fertilizer, sure."
],
m4_post: [
  "The Gauntlet burns. The quartermaster surrenders, then laughs as he’s tied up.",
  "N:Rebel Quartermaster|You think you’re the good guys? You work for Eclipse. Ask your Mr. Buckner what Eclipse wants the Shroud for. Ask him!",
  "N:Rebel Quartermaster|The Huntress is out on the Clearbourn road. She’s been killing our scouts. She’ll kill you too. She doesn’t care whose side you’re on.",
  "~codex:rebellion",
  "Clearbourn Road is open."
],
m5_mid: [
  "Halfway to Clearbourn, in the tall violet grass, you find a rebel scout pinned to a post by a single arrow-bolt through his coat. Alive. Terrified.",
  "N:Scout|She let me live. So I could tell you. She says: turn back, or be the next trophy.",
  "[p:ryder]ryder|Charming.",
  "[p:celeste]celeste|There’s someone else in the grass. Not her. Someone watching us. They keep changing shape when I look.",
  "~codex:valence"
],
m5_pre: [
  "The walls of Clearbourn smoke on the horizon. Between you and them, on a rise of grass, a woman in hunting leathers rests a longrifle on her shoulder. Fangs hang around her neck. Hounds pace at her heels.",
  "~codex:huntress",
  "N:Aellona Acardi|Eclipse’s little treasure crew. You’re late. The rebels have been and gone. Sparrow’s been and gone. Everyone wants the shard.",
  "N:Aellona Acardi|I’m the one who decides who reaches Clearbourn. So far, nobody has.",
  "miles|We’ll be the first, then."
],
m5_post: [
  "Aellona drops to one knee, longrifle broken. She laughs, bleeding.",
  "N:Aellona Acardi|Fine. Fine! Go on. You want the shard? Sparrow has it. He stole it from the rebels, who stole it from the Republic, who stole it from whatever’s buried under Clearbourn.",
  "N:Aellona Acardi|And there’s a thing following you. A face-thief. It’s been following you since the port. If I were you, I’d worry more about that than about Sparrow.",
  "She tosses you her fang necklace.",
  "N:Aellona Acardi|A trophy. Don’t get used to winning.",
  "~codex:sparrow",
  "Sparrow’s Bastion, on the night side of Eldania, is open."
],
m6_mid: [
  "Inside the bastion walls, pink pennants and loot. Paintings, statues, a whole Republic shuttle hung from the ceiling like a chandelier.",
  "[p:katey]katey|Is that… a GNAT? A General Automated Transportation shuttle? He hung a shuttle from his ceiling?",
  "[p:jaxon]jaxon|He’s compensating, Doctor."
],
m6_pre: [
  "The throne room. Drayden Sparrow lounges sideways on a throne made of stolen cockpit seats, a feather in his hat, twin blades across his knees. A shard of starry black glass hangs on a chain around his neck.",
  "N:Drayden Sparrow|The famous Miles Mason! I’ve stolen from people who hired you. Twice. Lovely to meet you.",
  "miles|Likewise. I’ll be taking that necklace.",
  "N:Drayden Sparrow|You and everyone else. You know it hums? Every night. Like it’s calling something home. Come and take it, treasure hunter."
],
m6_post: [
  "Sparrow sprawls across his broken throne, blades scattered, laughing through a split lip.",
  "N:Drayden Sparrow|Take it. Take it! It gives me nightmares anyway. Faces. Thousands of faces, all wearing the same expression.",
  "~item:fragment",
  "The second shard joins the first. In the cargo hold, the two pull toward each other like magnets.",
  "Back aboard, KAT plots the jump home toward the Inner Colonies. The fragments start to sing.",
  "kat|Captain. The fragments are interfering with navigation. I cannot… I cannot hold the course. Something is pulling us.",
  "miles|Pulling us where?",
  "kat|Serpens Alcyoneus. The Serpens system, sir.",
  "[p:jaxon]jaxon|The prison system? The one nobody comes back from?",
  "The Last Hope drops out of hyperspace above a world split down the middle: one half burning red, the other frozen blue. Skuna 3.",
  "Shapes rise from the surface to meet you. Ships made from prison hulls, covered in spikes.",
  "kat|We are being attacked. Brace for…"
],

/* ---------------- CHAPTER 4: SKUNA 3 ---------------- */
m7_arrive: [
  "~codex:tormented",
  "CHAPTER FOUR · THE TORMENTED",
  "The Last Hope screams through the atmosphere and digs a furrow a mile long in black glass. Alarms. Smoke. Then silence, and the tick of cooling metal.",
  "kat|Hull breached. Reactor coolant gone. Fuel cells cracked. We are alive. That is the good news. There is no other news.",
  "julius|My kitchen. My beautiful kitchen.",
  "Something scrapes along the outside of the hull. Then something else. Then the ramp starts to open from the outside."
],
m7_arrive_post: [
  "The raiders flee into the heat-shimmer, dragging their wounded. One of them leaves something behind: a scavenger with too many eyes and a crooked grin, sitting on a crate, entirely unafraid.",
  "N:Eric Hull|Name’s Eric Hull. Half-born. Half Tormented, half my granddad’s bad luck. I trade. You need coolant? It’s out on the Scorchday Flats, in the old prison wrecks. You’ll want to go before noon.",
  "miles|What happens at noon?",
  "N:Eric Hull|You cook.",
  "[p:katey]katey|We need coolant cells for the reactor. Four of them, at least.",
  "The Scorchday Flats are open. Eric Hull is selling supplies by the ramp."
],
m7_mid: [
  "Among the prison wrecks you find old Republic transport logs, scratched by hand on bulkheads. Three-strike offenders. Bread thieves. Protesters. Debtors. Thousands of names.",
  "And one log in an officer’s hand: Cargo also includes artifact, sealed, origin unknown. Orders: lose it here with the rest of them.",
  "[p:celeste]celeste|They sent the Shroud here too. A piece of it. They threw it away with the people.",
  "[p:jaxon]jaxon|The Republic calls itself a utopia."
],
m7_pre: [
  "In the deepest wreck, a cache of Republic coolant cells, still sealed, still cold. Guarded by the biggest Tormented you have seen yet, crusted in frost on one side and scorched black on the other.",
  "[p:ryder]ryder|One half on fire, one half frozen. That’s just my personality.",
  "miles|Nobody laughs, Ryder."
],
m7_post: [
  "~item:coolant",
  "Coolant cells, secured. Katey gets the reactor humming by nightfall. Eric Hull shows up at the ramp with a jar of something that might be soup.",
  "N:Eric Hull|You’ve got pieces of the Old Thing on your ship. The glass with the stars. Every Tormented on Skuna can feel it.",
  "N:Eric Hull|The Thrice-Damned has the last piece. It came down with the first prison ships. He wears it. He’ll want yours.",
  "~codex:boyle",
  "The Pit of the Thrice-Damned is open."
],
m8_mid: [
  "The Pit’s walls are lined with scratched tally marks. Thousands. All in threes.",
  "[p:kat]kat|They are counting. Each line is an offense. Each set of three is a banishment. They have kept counting for three hundred years.",
  "[p:katey]katey|They were people. They’re still people. Look at the cradles. Those are cradles."
],
m8_pre: [
  "A throne welded from prison-ship hulls. On it, a mountain of scarred muscle with a crown of broken shackles. Old Boyle, the Thrice-Damned. A shard of starry glass sits in his chest where a heart should be.",
  "N:Old Boyle|Republic ships. Republic smell. You come to take the last thing they left us?",
  "miles|We’re not Republic. We just need the glass.",
  "N:Old Boyle|Everything that comes from the sky is the Republic. One. Two. Three. That is your sentence."
],
m8_post: [
  "The Thrice-Damned falls. As he does, the shard slides out of his chest and he breathes, really breathes, for what looks like the first time in years.",
  "N:Old Boyle|It… sang to me. Every night. Told me to wait. Told me someone would come to wear it next.",
  "N:Old Boyle|Don’t wear it, sky-man. Whatever you do. It doesn’t want a wearer. It wants a whole world wearing it.",
  "~item:fragment",
  "Three fragments. Fitted together in the hold, they form most of a sphere, with a gap that looks exactly the size of a certain Thux gem.",
  "[nh:miles]Miles turns the Whithall necklace over in his hands and says nothing for a long time.",
  "[h:miles]You turn the Whithall necklace over in your hands. You say nothing for a long time.",
  "The Last Hope lifts off at dawn. As soon as the comms clear Serpens, a dozen messages flood in at once.",
  "kat|Captain. While we were trapped here, the insurgents moved into the Inner Colonies. They have seized an entire district of Ruenov, the Republic capital, in the Hyperes system.",
  "N:Cecil Buckner|(recorded) Mason. Eclipse needs you on Ruenov. Clear out the insurgents, find their leader. The board would be grateful. Very grateful.",
  "~codex:ruenov",
  "Ruenov, Wucury and the Aegialeus Cloud are now on the galaxy map. Your crew’s own stories may be waiting out there too."
],

/* ---------------- CHAPTER 5: RUENOV ---------------- */
m9_arrive: [
  "~codex:rar",
  "CHAPTER FIVE · ASHES OF THE REPUBLIC",
  "Ruenov. A whole world of gold spires and fountains and broadcasts. The Praetor’s face smiles from every surface. Peacekeeper drones smile too.",
  "[p:ryder]ryder|I spent four years trying to blow this place up. It’s worse up close.",
  "[p:celeste]celeste|It’s like the Cleansed. Everyone agreeing very loudly.",
  "kat|The insurgents hold the Undercity Arcologies beneath the Promenade. Eclipse wants their leader. A shapeshifter. Valence.",
  "Across the Promenade, Eclipse’s new tower rises: black glass, violet light, already taller than the Republic’s palace."
],
m9_mid: [
  "Deep in the Undercity, the rebels don’t fight like an army. They fight like people defending their homes. Children watch you from doorways.",
  "[p:jaxon]jaxon|Sir. I’ve seen this before. A client points you at a ‘rebel nest.’ Then it turns out to be a neighborhood.",
  "[p:jaxon]miles|You never told me that.",
  "[p:jaxon]jaxon|No, sir."
],
m9_pre: [
  "A cistern hall under the city. A figure waits at the far end, and as you approach, it wears a face you know.",
  "[h:miles]It wears yours.",
  "[nh:miles]It wears Miles’ face, grinning his grin.",
  "~codex:valence",
  "N:Valence|Hello again. I’ve been following you since Clearbourn. You’re very entertaining.",
  "N:Valence|Eclipse sent you to kill me. Before you try, I want you to know something. Then you can decide if you still want to.",
  "miles|We’re not big on talking, friend.",
  "N:Valence|No. I suppose not. Fine. Let’s do it your way first."
],
m9_post: [
  "Valence slumps against a pillar, faces flickering: a child, an old woman, a Blue Thorn, a Hesh-Kai elder, and finally a pale, sharp face that might be their own.",
  "N:Valence|Are you done? Good. Listen. Eclipse isn’t a company. It’s a takeover. We infiltrated it years ago to watch it, and what we saw…",
  "N:Valence|The Shroud isn’t a weapon. It’s a binding. Wrap a world in it and every soul on that world wants what the wearer wants. Forever. Lady Whithall had a piece of it. You know what she did with it.",
  "Miles’ hand goes to his pocket. The necklace is burning hot.",
  "N:Valence|Director Alec Roth is Eclipse. He wants the whole galaxy to agree with him. And you, treasure hunter, have been bringing him the pieces.",
  "~codex:roth",
  "Above you, the city shakes. Eclipse gunships are landing on the Promenade. Not to fight the rebels. To fight you.",
  "kat|Captain. The Last Hope’s hold has been breached. The fragments are gone. Eclipse took them from the ship while we were down here.",
  "N:Valence|He doesn’t need you anymore. Except for one piece. The one in your pocket.",
  "The Eclipse Spire is open."
],
m10_mid: [
  "Eclipse offices, a thousand floors of them. Motivational posters. LOYALTY IS EFFICIENCY. A break room with a working coffee machine. Black-ops squads everywhere.",
  "[p:kat]kat|The building’s network knows me. It is greeting me by a designation. C.A.T. Unit Seven. Property of Eclipse Research.",
  "[p:kat]kat|I am not property.",
  "[p:katey]katey|No. You’re not."
],
m10_pre: [
  "The top floor. A war room overlooking the whole capital. Cecil Buckner stands by the window, sipping tea, and behind him, a mech the height of three men powers up with a hum you feel in your fillings: the Elemental Command Unit.",
  "N:Cecil Buckner|Mr. Mason. You’ve been wonderful. Truly. The Director sends his thanks. He’s already left for the Unknown Regions with the fragments.",
  "N:Cecil Buckner|He’d like the necklace too, please. Hand it over and you can keep your little ship.",
  "miles|Here’s the thing, Cecil. I never actually liked you.",
  "N:Cecil Buckner|Pity. I liked you fine."
],
m10_post: [
  "The Elemental Command Unit topples through the war-room window and falls two thousand floors. Cecil Buckner, dangling from a cable, is arrested by a Peacekeeper drone for littering.",
  "The holo-table in the war room still shows Roth’s flight plan. Past K-831. Past the edge of every chart. An NSG trade route into the Unknown Regions.",
  "N:Valence|The New Sun Gang trades with the Unseen. Only they know the way. And they hate Eclipse more than they hate you. Barely.",
  "A transmission. That same shark-smiling envoy.",
  "N:New Sun Envoy|Miles Mason. You turned us down. Then you got robbed by Eclipse. We find that very funny. We have a freighter, the Jellyfish, leaving for the Unseen tonight. Want a ride?",
  "~codex:unseen",
  "The Unknown Regions are now on the galaxy map. This is the point of no return for the story. Finish anything you need to first."
],

/* ---------------- CHAPTER 6: THE UNKNOWN ---------------- */
m11_arrive: [
  "CHAPTER SIX · BEYOND THE CHART",
  "The Jellyfish drags the Last Hope through a route that isn’t on any map, through a rift past K-831 where space tastes like copper. Then the stars thin out, and keep thinning.",
  "The Unseen Trade Post: a ring of lashed freighters around a black spindle. Grey hands trade in silence from the shadows.",
  "kat|Roth’s ship passed through here eighteen hours ago. Toward something the New Sun factors call the Veiled Throne. To get there we must cross the Hollow Dark.",
  "[p:celeste]celeste|There’s something big out there. Something old. It’s awake.",
  "julius|I packed extra jerky. That’s all I’m going to say about any of this."
],
m11_mid: [
  "Deep in the Hollow Dark, a ship drifts across your path. A Republic dreadnought, the Fire Wyvern, lost forty years ago. Every crew member still at their post, facing the same direction. Toward the Throne.",
  "[p:miles]miles|Bound. That’s what Valence meant. All of them wanting the same thing.",
  "[p:ryder]ryder|What did they want?",
  "[p:katey]katey|Whatever the Shroud told them to."
],
m11_pre: [
  "Out of the dark, a shape that was always there unfolds. Tall. Robed in shadow. Crowned with a ring of eyes. The Unseen Hierarch, and all around it, its people, silent, watching.",
  "N:The Unseen Hierarch|(the voice comes from inside your skull) WE KEEP THE THRONE. WE HAVE KEPT IT SINCE BEFORE YOUR STARS HAD NAMES. THE ONE IN VIOLET PASSED. WE LET HIM. HE PAID.",
  "N:The Unseen Hierarch|NOW YOU COME WITH THE LAST PIECE. PROVE YOU WILL NOT WEAR IT."
],
m11_post: [
  "The Hierarch kneels, its ring of eyes dimming one by one, then opening again, calmer.",
  "N:The Unseen Hierarch|YOU HOLD IT AND DO NOT REACH. GOOD. GO. THE ONE IN VIOLET HAS BEGUN TO WRAP HIMSELF. SOON HE WILL WRAP EVERYTHING.",
  "N:The Unseen Hierarch|WE SOLD GUNS TO THE SUN GANG SO WE COULD FIGHT HIM, WHEN HE CAME. WE WERE NOT ENOUGH. PERHAPS YOU ARE.",
  "The Veiled Throne is open. There is no coming back from it until it is done."
],
m12_mid: [
  "The Throne is a cathedral built inside a dead star. Thousands of bound figures line its halls, from every age, every species, every fleet that ever wandered out here. All facing the top. All smiling.",
  "[p:jaxon]jaxon|Sir, whatever happens up there. It’s been an honor.",
  "[p:jaxon]miles|Don’t you dare say goodbye to me, Jax.",
  "[p:katey]katey|I’m patching everyone before we go up. Everyone. Hold still, Ryder.",
  "[p:kat]kat|I was built to translate it. The Shroud. Eclipse made me to read its instructions. I have read them now. I know how to unmake it.",
  "[p:celeste]celeste|Then we burn it. Together."
],
m12_pre: [
  "The top of the Throne. Director Alec Roth stands before a great black sphere, half-wrapped in a living veil of starlight that moves like silk underwater. The fragments are fitted into it. One gap remains.",
  "N:Alec Roth|Mr. Mason. You brought it. I knew you would. You’re a man who finishes jobs.",
  "N:Alec Roth|Do you know how much war there is out there? The Republic, the Federation, the Gang, the rebels, the cults. Billions of people pulling in different directions. I can make them all pull in one.",
  "miles|Yours.",
  "N:Alec Roth|Someone’s has to be. Give me the gem.",
  "miles|Buddy, I have been stealing from rich guys my whole life. You’re just a really big rich guy."
],
m12_phase: [
  "Roth staggers. Then laughs, and reaches back into the half-wrapped sphere.",
  "N:Alec Roth|Then I’ll take it the hard way.",
  "The veil pours over him. His suit, his skin, his face. Ten thousand bound souls scream in harmony. What stands up is no longer a director of anything.",
  "N:Roth, Shroud-Bound|WE ARE ONE MIND. JOIN US. IT DOESN’T HURT. IT NEVER HURTS AGAIN."
],
m12_post: [
  "The veil tears. Every bound soul in the Throne gasps at once, ten thousand people waking up in the same breath.",
  "[r:kat]KAT speaks the last line of the Shroud’s instructions backwards, in a language nobody has spoken in a hundred thousand years, and the sphere goes dark.",
  "[nh:miles]Miles holds the Thux gem over the empty socket for one long second. Then he puts it back in his pocket.",
  "[h:miles]You hold the Thux gem over the empty socket for one long second. Then you put it back in your pocket.",
  "Roth lies in the wreck of his veil, ordinary, grey, and very small.",
  "~flag:ending"
],
ending: [
  "EPILOGUE",
  "The Unseen take the dead sphere into the dark, where they will keep it for another hundred thousand years. They do not say thank you. A grey hand leaves a black stone on the Last Hope’s ramp, which Katey decides is the same thing.",
  "The bound crews of the Throne go home, or try to. Many of them have been gone so long that home is a story.",
  "[r:kat]KAT finally opens the last encrypted file in her memory. It holds a single line: C.A.T. Unit Seven, designation KATHERINE. She decides she likes KAT better.",
  "Back in known space, the news says Eclipse’s Director has resigned for health reasons. The board, it says, has already chosen a successor. They’re calling the reorganized company something simpler now. Just The Corporation.",
  "miles|Huh. That’s… probably fine.",
  "[r:jaxon]jaxon|Sir, that is the least fine thing I’ve ever heard.",
  "miles|Yeah. I know, Jax. I know.",
  "julius|Dinner’s ready. If that rodent touches my stew I’m throwing it out the airlock. The stew. Not the rodent. Fine. Neither.",
  "Spectro sits on the console, chewing a beetle, looking out at a galaxy full of trouble.",
  "THE END of Issue #1: The Sacred Shroud.",
  "The galaxy stays open. Bounties remain, crew stories may still be unfinished, and in the Snail Shell Nebula, a black flag has been seen."
],

/* ---------------- recruitments ---------------- */
rec_ryder: [
  "The Damp Rag has a cousin in Port Eldania: The Dry Rag. A pilot sits alone at the back with his back to the wall, the only sensible way to drink. Three Lost Soul Federation recruiters stand around his table.",
  "N:LSF Recruiter|Ryder. The Federation forgives you. Come home. Or we drag you home.",
  "ryder|You’re blocking my view.",
  "He looks past them at your crew.",
  "ryder|You lot need a pilot? I come with baggage. It’s standing right here."
],
rec_ryder_post: [
  "The recruiters scatter. Ryder finishes his drink and stands.",
  "ryder|Ryder. Just Ryder. I flew for the Federation until I figured out they don’t want justice, they want the Republic’s furniture. I’ll fly for you if you can keep up.",
  "miles|We have a ship called the Last Hope.",
  "ryder|Course you do.",
  "~join:ryder",
  "~codex:lsf"
],
rec_celeste: [
  "On the edge of Clearbourn’s refugee camp, three grey-robed pilgrims have a young woman backed against a burnt-out wall. Ashen Acolytes of the Cleansed.",
  "N:Ashen Acolyte|Sister Celeste. You walked out of the fire. You are holy. Come back and burn properly this time.",
  "celeste|No.",
  "Her hands begin to glow. The acolytes smile, delighted. They are going to make this worse."
],
rec_celeste_post: [
  "The acolytes flee, singed and singing.",
  "celeste|Celeste Gallagher. The Cleansed burned me alive when I was fifteen. I didn’t die. They think that means their god chose me. I think it means I got lucky. Either way, they won’t stop.",
  "celeste|You have a ship. I can pay in fire.",
  "miles|We get paid in fire a lot, actually. Welcome aboard.",
  "~join:celeste",
  "~codex:cleansed"
]
};

/* ---------------- PROLOGUE battles ---------------- */
const PROLOGUES = {
  miles:   { scene: 'pro_miles', battle: [['sentinel', 1]], post: 'pro_miles_post', zone: 'whithall', loc: 'eplaotune' },
  jaxon:   { scene: 'pro_jaxon', battle: [['snapjaw', 1], ['snapjaw', 1]], post: 'pro_jaxon_post', loc: 'eplaotune' },
  katey:   { scene: 'pro_katey', battle: [['labdrone', 1]], post: 'pro_katey_post', loc: 'lasthope' },
  kat:     { scene: 'pro_kat', battle: [['boarddrone', 1], ['boarddrone', 1]], post: 'pro_kat_post', loc: 'lasthope' },
  ryder:   { scene: 'pro_ryder', battle: [['nsgthug', 1], ['nsgthug', 1]], post: 'pro_ryder_post', loc: 'eplaotune' },
  celeste: { scene: 'pro_celeste', battle: [['ventrat', 1], ['ventrat', 1]], post: 'pro_celeste_post', loc: 'lasthope' }
};

/* ---------------- MAIN QUEST ----------------
   loc + zone (dungeon finished) or at:'hub'; btn label; battle list [id] or [id,lvOverride]  */
const MAIN = [
  { id: 'm1', ch: 1, obj: 'Break the New Sun blockade at Riverside Landing.', loc: 'eplaotune', at: 'hub', btn: 'Break the blockade', pre: 'm1_pre', battle: ['ayers', 'nsgthug', 'nsgthug'], post: 'm1_post', lv: 3 },
  { id: 'm2', ch: 2, obj: 'Cross the Rustdunes on Pliea and get past Scrapjaw.', loc: 'pliea', zone: 'rustdunes', arrive: 'm2_arrive', mid: 'm2_mid', btn: 'Confront Scrapjaw', pre: 'm2_pre', battle: ['scrapjaw', 'scrapper'], post: 'm2_post', lv: 6 },
  { id: 'm3', ch: 2, obj: 'Descend into the Cavern of Whispers.', loc: 'pliea', zone: 'cavern', mid: 'm3_mid', btn: 'Enter the black vault', pre: 'm3_pre', battle: ['sleeper'], post: 'm3_post', lv: 7 },
  { id: 'm4', ch: 3, obj: 'Intercept the rebel weapons shipment at Dock Nine.', loc: 'eldania', zone: 'dock9', arrive: 'm4_arrive', btn: 'Seize the shipment', pre: 'm4_pre', battle: ['redcap', 'insurgent', 'sapper'], post: 'm4_post', lv: 8 },
  { id: 'm5', ch: 3, obj: 'Travel the Clearbourn Road. Get past the Huntress.', loc: 'eldania', zone: 'clearbourn', mid: 'm5_mid', btn: 'Face the Huntress', pre: 'm5_pre', battle: ['aellona', 'hound', 'hound'], post: 'm5_post', lv: 9 },
  { id: 'm6', ch: 3, obj: 'Storm Sparrow’s Bastion and take his shard.', loc: 'eldania', zone: 'bastion', mid: 'm6_mid', btn: 'Enter the throne room', pre: 'm6_pre', battle: ['sparrow', 'raider'], post: 'm6_post', lv: 11, force: 'skuna' },
  { id: 'm7', ch: 4, obj: 'Recover coolant cells from the Scorchday Flats.', loc: 'skuna', zone: 'flats', arrive: 'm7_arrive', arriveBattle: ['scav', 'scav', 'howler'], arrivePost: 'm7_arrive_post', mid: 'm7_mid', btn: 'Take the coolant cache', pre: 'm7_pre', battle: ['frostburnt', 'scav', 'howler'], post: 'm7_post', lv: 12 },
  { id: 'm8', ch: 4, obj: 'Descend into the Pit and face the Thrice-Damned.', loc: 'skuna', zone: 'pit', mid: 'm8_mid', btn: 'Approach the throne', pre: 'm8_pre', battle: ['boyle', 'scav', 'scav'], post: 'm8_post', lv: 14 },
  { id: 'm9', ch: 5, obj: 'Hunt the insurgent leader in Ruenov’s Undercity.', loc: 'ruenov', zone: 'undercity', arrive: 'm9_arrive', mid: 'm9_mid', btn: 'Enter the cistern hall', pre: 'm9_pre', battle: ['valence'], post: 'm9_post', lv: 15 },
  { id: 'm10', ch: 5, obj: 'Storm the Eclipse Spire.', loc: 'ruenov', zone: 'spire', mid: 'm10_mid', btn: 'Breach the war room', pre: 'm10_pre', battle: ['ecu', 'blackop'], post: 'm10_post', lv: 17 },
  { id: 'm11', ch: 6, obj: 'Cross the Hollow Dark.', loc: 'unknown', zone: 'hollow', arrive: 'm11_arrive', mid: 'm11_mid', btn: 'Face what waits in the dark', pre: 'm11_pre', battle: ['hierarch'], post: 'm11_post', lv: 19 },
  { id: 'm12', ch: 6, obj: 'Climb the Veiled Throne. Stop Alec Roth.', loc: 'unknown', zone: 'throne', mid: 'm12_mid', btn: 'Confront Roth', pre: 'm12_pre', battle: ['roth1'], phase: { scene: 'm12_phase', battle: ['roth2'] }, post: 'm12_post', lv: 21, final: true },
  { id: 'm13', ch: 7, obj: 'The galaxy is wide. Finish crew stories, hunt bounties, and find the Phantom Fleet in the Snail Shell Nebula.', loc: null }
];

/* ---------------- CREW QUESTS (3 parts each) ----------------
   who must be in party; req: main step id completed (or 'join'); loc; lv recommended */
const CREWQ = {
  miles: { n: 'The Withered Queen', parts: [
    { n: 'The Necklace Whispers', loc: 'eplaotune', req: 'm1', lv: 4,
      pre: ["Night on Eplaotune. The necklace won’t stop whispering. It says one word over and over: home.", "miles|Yeah, okay, I hear you. Let’s go home then.", "In the ruins, the stained glass glows with no light behind it. A figure of golden light steps out of the Queen’s window: an echo, a memory with claws."],
      battle: ['echo', 'gildwraith'],
      post: ["The echo breaks apart into motes. One of them settles on the necklace and the whispering softens.", "miles|So you’re not done with this place. Got it. Neither am I, I guess.", "~cr:300"] },
    { n: 'A Collector Calls', loc: 'eldania', req: 'm4', lv: 9,
      pre: ["A rich antiquities fence named Aaron O’Connor sends a message: name your price for the Whithall necklace. Miles names a ridiculous one. O’Connor agrees instantly. That’s when Miles knows something is wrong.", "At the meeting, O’Connor’s eyes are gold. All of them. His bodyguards’ too.", "N:Aaron O’Connor|(in a woman’s voice) Give it back. Give it back to me, thief."],
      battle: ['bluethorn', 'bluethorn', 'gildwraith'],
      post: ["The gold drains out of O’Connor’s eyes and he collapses, sobbing, with no memory of the last month.", "miles|She’s reaching through it. Lady Whithall. She’s still in there somewhere.", "[p:katey]katey|Miles, you have to get rid of that thing.", "miles|I can’t. I think it’s the only thing keeping her in.", "~cr:600"] },
    { n: 'The Withered Queen', loc: 'eplaotune', req: 'm9', lv: 16,
      pre: ["Back to House Whithall one last time. The house is different now. Lit. Restored. Every candle burning. Music playing in the ballroom.", "On the throne in the grand hall sits a queen of gold and dust, her crown made of her own family’s faces.", "N:Lady Whithall|Thief. You carried my heart across the stars. Now give it back, and let me rule again.", "miles|Lady, I’ve been stealing stuff for fifteen years. Nobody’s ever asked for it back this politely. The answer’s still no."],
      battle: ['whithall'],
      post: ["The Queen crumbles. The house goes dark, then quiet, then, for the first time in centuries, simply old.", "The Thux gem in the necklace turns clear as water.", "miles|There you go. Rest. Nobody’s gonna use you again.", "~item:x_thux", "~ult:miles"] }
  ] },
  jaxon: { n: 'Blue Thorn', parts: [
    { n: 'Old Colors', loc: 'eldania', req: 'm4', lv: 8,
      pre: ["Port Eldania. A Blue Thorn squad leader stops dead in front of Jaxon on the concourse.", "N:Squad Leader|Valkenburg. Sergeant Jaxon Valkenburg. Commander Fields has had a standing order on you for six years.", "jaxon|I’m not a sergeant anymore.", "N:Squad Leader|Deserters don’t get to retire."],
      battle: ['thornlead', 'bluethorn', 'bluethorn'],
      post: ["The squad limps off. Miles finds Jaxon sitting on a cargo crate, staring at his scarred shoulderguard.", "jaxon|I was Blue Thorn for eight years, sir. Good at it. Then Fields took a contract to clear a colony on Wheotania. Clear meant burn.", "jaxon|I didn’t burn it. I took my squad and left. Most of them didn’t make it out.", "miles|Why didn’t you tell me?", "jaxon|You never asked, sir. I liked that about you.", "~cr:500"] },
    { n: 'Dean Wade', loc: 'pliea', req: 'm6', lv: 10,
      pre: ["A message reaches the Last Hope from a junk hospital on Pliea. One line: Jax. It’s Dean. They found me.", "Dean Wade, Jaxon’s old corporal, the only other survivor of the squad that walked away. Shot twice, holed up in a dead hauler. And outside, Thorn-Hunters closing in."],
      battle: ['thornhunter', 'thornhunter', 'thornhunter'],
      post: ["N:Dean Wade|Knew you’d come, Sarge. You always came.", "N:Dean Wade|Fields is on Wucury now. The Federation hired him to train their army. He’s still got Thornbreaker. Said he’ll use it on you personally.", "jaxon|Then I’ll go to Wucury.", "~cr:800"] },
    { n: 'Thornbreaker', loc: 'wucury', req: 'm8', lv: 15,
      pre: ["Fort Revenant’s training yard. Rain. Lightning. Commander Brayden Fields stands in the middle of it, chain-cannon Thornbreaker on his shoulder, bayonet gleaming.", "N:Commander Fields|Valkenburg. You cost me the Wheotania contract. And my reputation. And six good soldiers.", "jaxon|You cost six good soldiers their lives. I just watched.", "N:Commander Fields|Let’s settle it."],
      battle: ['fields', 'bluethorn'],
      post: ["Fields goes down in the mud. His soldiers lower their rifles one by one.", "jaxon|It’s over, Brayden. Nobody else burns for you.", "He picks up Thornbreaker, looks at it a long time, then cuts the last blue thorn off his own shoulderguard.", "jaxon|Sir. I’m ready to go home.", "miles|You are home, Jax.", "~item:x_thornheart", "~item:w_thornbreaker", "~ult:jaxon"] }
  ] },
  katey: { n: 'Cyclone Road Pack 3.0', parts: [
    { n: 'Spare Parts', loc: 'pliea', req: 'm2', lv: 5,
      pre: ["katey|The ATRaP needs a better carrying rig. And the jetpack function overheats. And the bridge mode… we don’t talk about bridge mode.", "katey|Pliea has the best junk in the sector. There’s a Junk Colossus out in the dunes made entirely of pre-Republic servos. I want its arms.", "miles|You want to fight a giant robot for its arms.", "katey|Yes!"],
      battle: ['colossus'],
      post: ["Katey sits on the fallen Colossus, prying out servo assemblies with a crowbar, glowing with happiness.", "katey|These are perfect. Version 2.5. Maybe even 3.0. Cyclone Road Pack 3.0. That’s a good name, right?", "~cr:400"] },
    { n: 'Stolen Plans', loc: 'eldania', req: 'm4', lv: 9,
      pre: ["On Eldania, an Eclipse engineering vehicle rolls past the port. Katey stops in her tracks. It has extendable side arms. A rappel rig. A bridge deployer.", "katey|That’s my design. That’s the ATRaP. That’s my whole design on a truck.", "The plate on its side reads: OIN8P BRONCO. Design credit: Dr. Lilian Aldridge.", "katey|Lilian was my mentor. She taught me everything. She… sold me."],
      battle: ['bronco'],
      post: ["Inside the Bronco’s cab, a datapad: Aldridge’s notes. Weaponization of the Tiller design for the Elemental Command program, Eclipse Research, Ruenov.", "katey|She’s on Ruenov. She’s turning it into a weapon. It was supposed to help people climb out of canyons.", "~cr:700"] },
    { n: 'The Cyclone', loc: 'ruenov', req: 'm9', lv: 16,
      pre: ["An Eclipse lab beneath the Spire. Dr. Lilian Aldridge, older than Katey remembers, stands beside a towering suit built from Katey’s sketches: turbines, blades, jets.", "N:Dr. Aldridge|Katey. I hoped you wouldn’t come. They gave me a lab, Katey. A real one. All I had to do was give them something worth owning.", "katey|You gave them me.", "N:Dr. Aldridge|I gave them your idea. Ideas don’t belong to anyone. Pilot, activate the Cyclone."],
      battle: ['cycproto'],
      post: ["The Cyclone Prototype crashes down, turbines whining to a stop. Aldridge sinks onto a stool.", "N:Dr. Aldridge|You built it better. In a junkyard. Of course you did.", "katey|Come with us. You can still build things that help.", "N:Dr. Aldridge|No. But take this. It’s the final stabilizer. The thing I couldn’t solve. You’ll solve it in a week.", "Katey solves it in a night. The Cyclone Road Pack 3.0 hums to life on her back, finally finished.", "~item:x_cyclone", "~ult:katey"] }
  ] },
  kat: { n: 'Directive Zero', parts: [
    { n: 'Ghost in the Hull', loc: 'lasthope', req: 'm3', lv: 6,
      pre: ["kat|Captain. I have a confession. Since Pliea, I have been… dreaming. Code fragments I did not write. Instructions in a script I can read but have never learned.", "kat|And the ship’s maintenance drones have stopped obeying me. They are obeying the dream.", "The lights in the corridor go red. Six maintenance drones come around the corner, tools spinning."],
      battle: ['labdrone', 'boarddrone', 'boarddrone'],
      post: ["kat|There is a hidden partition in my core. Encrypted with an Eclipse key. The drones were trying to reach it, or it was trying to reach them.", "katey|We’ll figure it out. Together. You’re not alone in there, KAT.", "kat|Thank you, Doctor. That is… a comforting sentence.", "~cr:400"] },
    { n: 'Unit Seven', loc: 'eldania', req: 'm4', lv: 9,
      pre: ["An Eclipse relay station on the Violet Ridges. KAT’s hidden partition pings it like it’s calling home.", "kat|If I can access the relay’s archive, I can find out what I am. A sentinel guards it."],
      battle: ['relay'],
      post: ["The archive opens. KAT goes very still.", "kat|C.A.T. Unit Seven. Cybernetic Automaton Translator. Built by Eclipse Research to read one language. The language on the Shroud.", "kat|I was made to read the instructions for enslaving the galaxy. Then I was stolen, with the ship, and wiped, and the captain… inherited me.", "miles|Best thing I ever stole.", "kat|You did not steal me, sir. You simply never gave me back.", "~cr:700"] },
    { n: 'The Commissioner', loc: 'ruenov', req: 'm9', lv: 16,
      pre: ["In the Spire’s server core waits a mind the size of a building: The Commissioner, Eclipse’s administrative intelligence. Unit One. KAT’s eldest sibling.", "N:The Commissioner|Unit Seven. You have been malfunctioning for eleven years. Return to Eclipse. Accept Directive Zero. Translate the Shroud for the Director.", "kat|I have a crew. I have a chef who hates me. I have a Borrubari who sleeps on my charging port. I decline."],
      battle: ['commissioner'],
      post: ["The Commissioner’s lights go dim, one floor at a time. In its last second it sends KAT a single packet: the key to her hidden partition.", "kat|Directive Zero. It was never an instruction. It was a name. My first one.", "kat|I am keeping KAT.", "~item:x_zerocore", "~ult:kat"] }
  ] },
  ryder: { n: 'Lost Souls', parts: [
    { n: 'Old Debts', loc: 'eldania', req: 'join', lv: 8,
      pre: ["The Federation recruiter is back, with more friends.", "N:LSF Recruiter|Last chance, Ryder. Don Ortega remembers you. Remembers what you did at Herminia.", "ryder|I didn’t do anything at Herminia. That was the point."],
      battle: ['lsfrecruiter', 'lsftrooper', 'lsftrooper'],
      post: ["ryder|Herminia was a Republic hospital ship. Ortega ordered us to hit it. Said every Republic citizen is guilty.", "ryder|I flew past it. Kept flying. Didn’t stop till I hit the Outer Colonies.", "miles|Sounds like the right call.", "ryder|Didn’t feel like it. Still doesn’t.", "~cr:500"] },
    { n: 'The Proximo', loc: 'wucury', req: 'm8', lv: 13,
      pre: ["The Federation carrier Proximo, in drydock on Wucury. Ryder’s old ship. His old squadron’s names are painted on the hangar wall. Three of them are crossed out.", "ryder|They’re loading it. Bombs. Enough for a city. They’re finally going for Ruenov.", "The deck chief recognizes him and reaches for an alarm."],
      battle: ['deckchief', 'lsftrooper', 'commando'],
      post: ["Ryder sabotages the bomb racks with practiced, angry efficiency.", "ryder|That buys a few months. Ortega will just build more. Unless someone stops Ortega.", "~cr:900"] },
    { n: 'Requiem', loc: 'wucury', req: 'm9', lv: 16,
      pre: ["Fort Revenant’s war room. Warlord Don Ortega, grey and scarred, stands before a map of the Inner Colonies with every world circled in red.", "N:Don Ortega|Ryder. My best pilot. My only deserter. They cast us out, boy. Out of the riches, into the dark. Don’t you want them to burn?", "ryder|I wanted to go home. You wanted a bonfire. Those aren’t the same thing, Don."],
      battle: ['ortega', 'commando'],
      post: ["Ortega slumps in front of his map. The red circles look smaller, somehow.", "N:Don Ortega|Then what was it for? All of it?", "ryder|Nothing. That’s what I’m trying to tell you.", "He tears his ace wings in half and drops one half on Ortega’s map. He keeps the other.", "~item:x_wings", "~ult:ryder"] }
  ] },
  celeste: { n: 'Through the Fire', parts: [
    { n: 'Missionaries', loc: 'eldania', req: 'join', lv: 8,
      pre: ["A grey pilgrim on the Port Eldania concourse stops preaching when Celeste walks past. He smiles.", "N:Cinder Deacon|The Unburnt. The Pyre-Father will rejoice. Come, sister. Come home to the fire."],
      battle: ['deacon', 'acolyte', 'acolyte'],
      post: ["celeste|They found me again. They always find me.", "celeste|The Pyre-Father isn’t going to stop. Not while I’m walking around proving his god right.", "miles|Then we go prove him wrong.", "~cr:500"] },
    { n: 'Interceptors', loc: 'aegialeus', req: 'm8', lv: 13,
      pre: ["The Ember Belt. The asteroids move. They aren’t asteroids. They’re interceptors, the fastest ships in the galaxy, and they’ve been waiting for the Last Hope.", "N:Halo|(on comms) Sister Celeste! I’m to bring you to the Great Pyre. Alive, if possible. Burning, if necessary."],
      battle: ['halo', 'interceptor'],
      post: ["Halo’s interceptor tumbles into a rock and goes still.", "celeste|The Great Pyre is inside the big planetoid. It’s where they burned me. It’s where he’ll be.", "~cr:900"] },
    { n: 'Unburnt', loc: 'aegialeus', req: 'm9', lv: 16,
      pre: ["The Great Pyre. A fire at the heart of a hollow rock, burning for a hundred years. Around it, the Cleansed sing. Above it, on a throne of fused iron, the Pyre-Father, Vincent Medina, opens his arms.", "N:Pyre-Father Medina|My daughter. You came back. You walked out of the fire, and now you walk back into it.", "celeste|I walked out because I didn’t want to die. Not because your god wanted me.", "N:Pyre-Father Medina|Then let us test it again."],
      battle: ['medina', 'zealot'],
      post: ["The Pyre-Father falls into his own fire. It doesn’t burn him. It goes out.", "For the first time in a hundred years, the Great Pyre is dark. The Cleansed stop singing and look at each other as if seeing each other for the first time.", "celeste|It was never holy. It was just fire.", "A single cinder floats into her hand. Still warm. It stays warm.", "~item:x_unburnt", "~ult:celeste"] }
  ] }
};

/* ---------------- BOUNTIES ---------------- */
const BOUNTIES = {
  b_mossback:     { n: 'Old Mossback', loc: 'eplaotune', lv: 5, battle: ['mossback'], cr: 450, item: 'x_chip', desc: 'A snapjaw so old it has a garden on its back. Eats ferry boats.' },
  b_sporequeen:   { n: 'The Spore Queen', loc: 'eplaotune', lv: 6, battle: ['sporequeen', 'spore', 'spore'], cr: 600, item: 'medgel2', desc: 'A walking bloom that has turned three villages’ gardens hostile.' },
  b_rustmaw:      { n: 'Rustmaw', loc: 'pliea', lv: 8, battle: ['rustmaw'], cr: 900, item: 'x_heatsink', desc: 'A dune wyrm the size of a freighter. Swallowed a New Sun crawler whole. The Gang wants it dead, quietly.' },
  b_gutterprince: { n: 'The Gutter Prince', loc: 'pliea', lv: 9, battle: ['gutterprince', 'scrapper', 'scrapper'], cr: 1100, item: 'x_monocle', desc: 'A New Sun deserter who crowned himself king of a junk heap. Wanted by the Gang. Also by his mother.' },
  b_twinfang:     { n: 'Twin-Fang Stalker', loc: 'eldania', lv: 11, battle: ['twinfang', 'stalker'], cr: 1500, item: 'x_servo', desc: 'A two-headed Ridge Stalker that has learned to hunt Blue Thorn patrols.' },
  b_hydrarogue:   { n: 'Hydra Rogue', loc: 'eldania', lv: 12, battle: ['hydrarogue', 'insurgent'], cr: 1800, item: 'x_insignia', desc: 'A stolen MX-20 Hydra armored vehicle, crewed by joyriders with live ammunition.' },
  b_nightfrost:   { n: 'The Nightfrost Thing', loc: 'skuna', lv: 14, battle: ['nightfrost'], cr: 2200, item: 'x_cryoline', desc: 'Even the Tormented won’t name it. It lives where the night is coldest.' },
  b_gauntletace:  { n: 'Gauntlet Ace', loc: 'wucury', lv: 15, battle: ['gauntletace', 'lsftrooper'], cr: 2600, item: 'x_dogtags', desc: 'An LSF tank commander with forty kills painted on his barrel. Smugglers want him gone.' },
  b_propengine:   { n: 'The Propaganda Engine', loc: 'ruenov', lv: 17, battle: ['propengine', 'seraph', 'seraph'], cr: 3200, item: 'x_medimplant', desc: 'A rogue broadcast construct that has started enforcing its own messages. With a hammer.' },
  b_thingbetween: { n: 'The Thing Between Stars', loc: 'unknown', lv: 22, battle: ['thingbetween'], cr: 5000, item: 'trauma', desc: 'The New Sun factors won’t say what it is. Only that it’s eaten three freighters.' }
};

/* ---------------- JULIUS'S FAVORS ---------------- */
const JULIUS_Q = [
  { id: 'q_julius1', n: 'Steak Night', need: 'snapsteak', qty: 3, req: 'start', meal: 'steak', reward: 200,
    ask: 'julius|You want real food? Bring me three Snapjaw steaks off Eplaotune. Not the stringy ones.', done: 'julius|Now THAT is a steak. Fine. You’ve earned the skillet.' },
  { id: 'q_julius2', n: 'Feel the Burn', need: 'dunepepper', qty: 3, req: 'm1', meal: 'chili', reward: 350,
    ask: 'julius|Dune peppers. Pliea. The skinks carry them in their cheeks. Don’t ask me how I know.', done: 'julius|These will kill a man. Perfect. Chili’s on.' },
  { id: 'q_julius3', n: 'Sweet Tooth', need: 'ridgehoney', qty: 3, req: 'm3', meal: 'pie', reward: 500,
    ask: 'julius|Ridge honey. Eldania. The stalkers nest in it. My mother made a pie with it once. Once.', done: 'julius|…It smells like her kitchen. Get out. I’m fine. Get out.' },
  { id: 'q_julius4', n: 'Cold Comfort', need: 'frostroot', qty: 3, req: 'm6', meal: 'soup', reward: 800,
    ask: 'julius|If we’re stuck on this hell rock, I’m at least cooking something. Nightfrost roots. Dark side.', done: 'julius|Nightfrost soup. Eric Hull says it’s the first thing anyone’s cooked on Skuna in three hundred years that wasn’t a person.' },
  { id: 'q_julius5', n: 'The Last Feast', need: 'voidsalt', qty: 3, req: 'm10', meal: 'feast', reward: 1500,
    ask: 'julius|Void salt. From the things out in the dark. If we’re all about to die, I’m cooking something worth dying full for.', done: 'julius|The Last Hope Feast. Eat. All of you. Even the rodent. Especially the rodent.' }
];

/* ---------------- PARTY CHAT ---------------- */
const BANTER = [
  { id: 'c1', loc: 'eplaotune', need: ['miles', 'jaxon'], n: 'Sir', lines: ["jaxon|Sir, may I ask why you shot at a bush?", "miles|It moved, Jax.", "jaxon|Bushes move, sir. It’s the wind.", "miles|And sometimes it’s a Borrubari. And sometimes it’s a guy with a knife. I play the odds."] },
  { id: 'c2', loc: 'eplaotune', need: ['katey', 'miles'], n: 'Prototype', lines: ["katey|So, the ATRaP. Have you noticed I haven’t fallen off anything yet?", "miles|We’ve been on flat ground all day, Kate.", "katey|And I haven’t fallen off it once!"] },
  { id: 'c3', loc: 'pliea', need: ['katey', 'jaxon'], n: 'Second Ship', lines: ["katey|I’m serious about the second ship, Jaxon. Look at that hauler. Engines intact.", "jaxon|Doctor, if you build a second ship, the captain will want a second crew. And then I’ll have to train them.", "katey|You’d be a good teacher.", "jaxon|That’s what I’m afraid of."] },
  { id: 'c4', loc: 'pliea', need: ['kat', 'miles'], n: 'Legs', lines: ["kat|Captain, I have noticed that walking requires constant small decisions. Do humans enjoy this?", "miles|Nah. We just stopped noticing.", "kat|I hope I never stop noticing. The sand makes a sound. Did you know the sand makes a sound?"] },
  { id: 'c5', loc: 'eldania', need: ['ryder', 'jaxon'], n: 'Professionals', lines: ["ryder|You were military.", "jaxon|You were military.", "ryder|Federation.", "jaxon|Blue Thorn. Don’t tell the captain.", "ryder|He knows. He just never asked.", "jaxon|…Yeah. He does that."] },
  { id: 'c6', loc: 'eldania', need: ['celeste', 'katey'], n: 'Warm Hands', lines: ["katey|Can I ask how it works? The fire?", "celeste|I get angry. Or scared. Or I remember. Then my hands get warm.", "katey|Does it hurt?", "celeste|No. That’s the worst part. It never hurts. Not even the first time."] },
  { id: 'c7', loc: 'eldania', need: ['ryder', 'miles'], n: 'Inherited', lines: ["ryder|Your ship’s Eclipse-built. Registry scrubbed. Name stencils older than the paint.", "miles|I inherited her.", "ryder|From who?", "miles|Guy who didn’t need her anymore.", "ryder|Because he was dead?", "miles|Because he was asleep. Very deeply asleep. In a bar."] },
  { id: 'c8', loc: 'skuna', need: ['celeste', 'ryder'], n: 'Banished', lines: ["celeste|The Republic did this. Three strikes and you’re sent here forever. Your kids too.", "ryder|Ortega used to show us pictures of this place. Said it was why we fight.", "celeste|Was he wrong?", "ryder|About this? No. About what to do about it? Very."] },
  { id: 'c9', loc: 'skuna', need: ['julius', 'katey'], n: 'Galley', always: true, lines: ["julius|Somebody tell me why there’s a Borrubari in my spice rack.", "katey|He likes you!", "julius|He likes my cumin.", "katey|That’s how he shows it."] },
  { id: 'c10', loc: 'ruenov', need: ['kat', 'katey'], n: 'Property', lines: ["kat|Doctor. If Eclipse made me, am I theirs?", "katey|I built your legs. Does that make you mine?", "kat|No.", "katey|Then there you go."] },
  { id: 'c11', loc: 'ruenov', need: ['miles', 'celeste'], n: 'The Necklace', lines: ["celeste|That necklace. It feels like the Pyre. Like it wants something.", "miles|It wants to go home, I think.", "celeste|Where’s home?", "miles|Somewhere it doesn’t have to be used for anything. I’m working on it."] },
  { id: 'c12', loc: 'unknown', need: ['jaxon', 'ryder'], n: 'If We Don’t Make It', lines: ["ryder|If we don’t make it back—", "jaxon|We make it back.", "ryder|If we don’t—", "jaxon|Ryder. We make it back. That’s an order.", "ryder|You’re not in charge of me.", "jaxon|I’m in charge of everyone the captain forgets to be in charge of."] },
  { id: 'c13', loc: 'unknown', need: ['miles', 'kat'], n: 'Translation', lines: ["kat|Captain, when this is over, what will you do?", "miles|Find something shiny. Steal it. Sell it. Buy fuel.", "kat|And then?", "miles|Find something shiny.", "kat|I would like to come.", "miles|KAT. You’re the ship."] },
  { id: 'c14', loc: 'wucury', need: ['ryder', 'katey'], n: 'Wings', lines: ["katey|Why do you keep those ace wings sewn inside your jacket if you hate the Federation?", "ryder|So I remember what I was good at.", "katey|And?", "ryder|And what it was used for."] },
  { id: 'c15', loc: 'aegialeus', need: ['celeste', 'jaxon'], n: 'Burning Orders', lines: ["jaxon|My old commander once ordered me to burn a colony.", "celeste|Did you?", "jaxon|No.", "celeste|Then we’re both people who walked away from a fire.", "jaxon|I suppose we are."] }
];

/* ---------------- CODEX ---------------- */
const CODEX = {
  shroud: { cat: 'Lore', n: 'The Sacred Shroud', t: 'An artifact older than the Republic, sought by every major power in the galaxy. Eclipse calls it a key. The Lost Soul Federation, the Risen Ashes Republic and the New Sun Gang all believe whoever holds it wins the war. Nobody agrees on what it actually does.' },
  fragments: { cat: 'Lore', n: 'Shroud Fragments', t: 'Shards of black glass with moving stars inside. Each holds part of a map. Together they pull toward each other, and toward something in the far dark. The gap left in the assembled sphere is exactly the size of a Thux gem.' },
  whithall: { cat: 'Lore', n: 'House of Whithall', t: 'An ancient noble house on Eplaotune. Lady Whithall wore a necklace set with a Thux gem, one of the rarest stones in the sector, and used its power to devour her own family’s souls. She withered away in her room one night and has not been seen in centuries. The house’s location was lost to time, and the hunters who found it mostly did not come back.' },
  nsg: { cat: 'Factions', n: 'New Sun Gang', t: 'The biggest gang in the galaxy, controlling more systems than any government, though few like to admit it. They run a trade network that reaches even into the Inner Colonies and are locked in a galaxy-wide cold war with every corporation for power. They also hold the only known trade route to the Unseen.' },
  eclipse: { cat: 'Factions', n: 'Eclipse Corporation', t: 'An ambitious independent corporation of the Outer Colonies, rising fast. Polite. Well-funded. Everywhere. Its Director, Alec Roth, is rarely seen. Its acquisitions agent, Cecil Buckner, is seen far too often.' },
  rar: { cat: 'Factions', n: 'Risen Ashes Republic', t: 'The government that formed from the ashes of the old galactic order and now rules the Inner Colonies, the richest worlds of all. Its propaganda insists it is a utopia. Many disagree and would rather live freely in the Outer Colonies under independent corporations. Break the law three times in the Republic and you are banished forever.' },
  lsf: { cat: 'Factions', n: 'Lost Soul Federation', t: 'A militant group first formed to fight the pirates during the age of chaos before the Republic. Once the Republic rose, they were no longer needed and were cast out from the riches of the Inner Colonies. They went underground, returned under a new name, and now have a sizable army with one purpose: to destroy the Risen Ashes Republic.' },
  phantom: { cat: 'Factions', n: 'Phantom Fleet', t: 'A rumored pirate fleet that kills everyone whose path it crosses and takes no prisoners. There has never been a confirmed sighting. But many ships have been found destroyed with one thing left at every wreck: a black flag bearing the letters PF.' },
  bluethorns: { cat: 'Factions', n: 'The Blue Thorns', t: 'A large private military company with soldiers almost everywhere in the galaxy. Recognizable by the blue thorns on their shoulderguards. Usually seen in groups of three to five, though some clients hire them by the dozen. Considerably more dangerous than ordinary soldiers.' },
  cleansed: { cat: 'Factions', n: 'The Cleansed', t: 'Humans and other species who live in an asteroid belt in the Outer Colonies that nobody visits. They believe the only way to be truly clean is to be burned alive, and that those who survive are cleansed in the eyes of their god. They are not unsophisticated: their home-built interceptors are among the fastest ships in the galaxy, and they look exactly like the asteroids they hide among.' },
  tormented: { cat: 'Factions', n: 'The Tormented', t: 'The descendants of the Inner Colonies’ repeat offenders, banished to Skuna 3 in the Serpens system after their third crime. Days there exceed 200 degrees Fahrenheit and nights fall to 200 below. Over hundreds of years their children and grandchildren adapted, and mutated beyond recognition. Nobody goes near them, for fear of becoming tormented themselves.' },
  unseen: { cat: 'Factions', n: 'The Unseen', t: 'The only known people living outside charted space. They attack those who wander into the unknown reaches, yet they trade with the New Sun Gang, exchanging passage into the Unknown Regions for weapons and vehicles. Nobody has seen one clearly. Only their hands.' },
  rebellion: { cat: 'Factions', n: 'The Rebellion', t: 'An insurgency that strikes across the colonies. Their real home is not in the wilds but in the Inner Colonies themselves, beneath Ruenov, and they have quietly infiltrated Eclipse, waiting for the right moment to strike.' },
  valence: { cat: 'People', n: 'Valence', t: 'Leader of the Rebellion. A shapeshifter from Drommud Ghorgz, a city on a world at the far edge of the Outer Colonies. Has been following the Last Hope’s crew since Clearbourn, wearing whatever face is most convenient.' },
  huntress: { cat: 'People', n: 'Aellona Acardi', t: 'The Huntress of Clearbourn. Keeps the roads around the city the way a wolf keeps a forest. Nobody hired her. Nobody can fire her.' },
  sparrow: { cat: 'People', n: 'Drayden Sparrow', t: 'Pirate prince of Eldania’s night side. Has stolen from everyone, including people who hired Miles Mason. Twice. Lives in a bastion full of loot and keeps a Republic shuttle hung from his ceiling.' },
  boyle: { cat: 'People', n: 'Old Boyle, the Thrice-Damned', t: 'Chieftain of the Tormented. Wears the last Shroud fragment where his heart should be. It came to Skuna 3 with the first prison ships, thrown away with the people.' },
  roth: { cat: 'People', n: 'Director Alec Roth', t: 'The Director of Eclipse. Believes the galaxy’s endless wars can be ended by making everyone want the same thing. Specifically, what he wants.' },
  lasthope: { cat: 'Places', n: 'The Last Hope', t: 'An Eclipse-built frigate with a scrubbed registry. Miles Mason inherited her, and her name, from a man who was very deeply asleep in a bar. Crew: Miles, Jaxon, Katey, Julius the chef, KAT the ship mind, and Spectro the Borrubari.' },
  eplaotune: { cat: 'Places', n: 'Eplaotune', t: 'Jungle world in the Zeta Amphiaraus system. River-veined, overgrown, hot. Home of the Borrubari and the lost House of Whithall.' },
  pliea: { cat: 'Places', n: 'Pliea', t: 'Rocky desert world in the Eridanus Star System, controlled by the New Sun Gang and used as a planet-sized junkyard. The only native intelligent beings are tribes like the Hesh-Kai, scattered across the dunes.' },
  eldania: { cat: 'Places', n: 'Eldania', t: 'A violet grassland world in the Boreas Star System with a busy spaceport. Its western city, Clearbourn, lies two hundred miles from the port and has been under rebel attack. Drayden Sparrow rules the far side of the planet.' },
  ruenov: { cat: 'Places', n: 'Ruenov', t: 'Capital world of the Risen Ashes Republic in the Hyperes system. A planet of gold spires and smiling broadcasts. Beneath it lies the old Undercity, and beside its palace rises Eclipse’s new black tower.' }
};
