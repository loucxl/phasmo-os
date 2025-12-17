// --- 1. CORE DATA ---
const EVIDENCE = [
    { id: 'emf', label: 'EMF 5', icon: '📶', desc: "Must hit Level 5 (Red)." },
    { id: 'box', label: 'Box', icon: '📻', desc: "Talk in dark." },
    { id: 'uv', label: 'UV', icon: '🖐️', desc: "Green handprints." },
    { id: 'orb', label: 'Orbs', icon: '✨', desc: "Floating dots in NV." },
    { id: 'writing', label: 'Writing', icon: '📖', desc: "Ghost writes in book." },
    { id: 'freezing', label: 'Freeze', icon: '❄️', desc: "Below 0C." },
    { id: 'dots', label: 'D.O.T.S', icon: '🟢', desc: "Green silhouette." }
];

const FILTERS = [
    { id: 'fast', label: '🏃 Fast Speed' },
    { id: 'early', label: '⚠️ Early Hunter' },
    { id: 'quiet', label: '🤫 Quiet Footsteps (Myling)' },
    { id: 'guarantee', label: '✨ Guaranteed Ev' }
];

// Enhanced ghost descriptions with beginner-friendly explanations
// Replace the GHOSTS array in your script.js with this

const GHOSTS = [
    { 
        name: "Spirit", ev: ['emf','box','writing'], danger: "Med", hunt: "50%", speed: "1.7 m/s", blink: "Normal", forced: null,
        traits: ["Extended Smudge Protection"],
        desc: "The most common ghost with no special abilities. Often identified by process of elimination.",
        ability: "No special ability. When you burn smudge sticks near it, the Spirit cannot hunt for 180 seconds (3 minutes) instead of the normal 90 seconds.",
        test: "Smudge Sticks Test: Use smudge sticks near the Spirit. If it doesn't hunt for <span class='hl-green'>180 seconds (3 minutes)</span> instead of the normal 90 seconds, it's a Spirit. Time it with the timer!",
        zeroEv: "On Nightmare/Insanity (0-2 evidence), only identifiable by timing how long smudge sticks prevent hunts. Bring a stopwatch!",
        tags: []
    },
    { 
        name: "Wraith", ev: ['emf','box','dots'], danger: "Med", hunt: "50%", speed: "1.7 m/s", blink: "Normal", forced: null,
        traits: ["Teleports to Players", "Never Leaves Salt Footprints"],
        desc: "A floating ghost that can teleport to players. NEVER leaves UV footprints when stepping in salt - easiest ghost to identify!",
        ability: "Can randomly teleport to within 3 meters of any player, triggering EMF 2 or 5 at the teleport location. Because it floats, it never leaves UV footprints in salt (all other ghosts do).",
        test: "Salt Test: Place salt piles in doorways. If the ghost walks through salt but leaves <span class='hl-red'>NO UV footprints</span> when you shine UV light, it's 100% a Wraith. All other ghosts leave prints!",
        zeroEv: "Random EMF spikes appearing right next to players (from teleports). Salt shows footstep marks but zero UV prints when scanned.",
        tags: ['guarantee']
    },
    { 
        name: "Phantom", ev: ['box','uv','dots'], danger: "Med", hunt: "50%", speed: "1.7 m/s", blink: "Slow", forced: null,
        traits: ["Drains Sanity Fast", "Vanishes in Photos"],
        desc: "Looking at a Phantom during ghost events drains your sanity very quickly. Taking a photo makes it disappear temporarily.",
        ability: "Drains about 0.5% sanity per second when you look directly at it during manifestations. During hunts, it stays invisible longer than other ghosts (slower blink rate = harder to see).",
        test: "Photo Test: Take a photo during a ghost event. If the ghost instantly vanishes but the photo still registers as a 'Ghost Photo' (giving money), it's a Phantom.",
        zeroEv: "Unusually fast sanity drain during events. Slower blinking during hunts (harder to spot). Ghost disappearing when photographed.",
        tags: ['vis']
    },
    { 
        name: "Poltergeist", ev: ['box','uv','writing'], danger: "Med", hunt: "50%", speed: "1.7 m/s", blink: "Normal", forced: null,
        traits: ["Throws Many Objects", "Very Active"],
        desc: "Extremely active ghost that loves throwing objects. Can throw many items at once, draining sanity with each throw. Useless in empty rooms!",
        ability: "Can throw multiple objects simultaneously in a 3-meter radius. Each thrown item drains 2% sanity from nearby players. Will also throw objects during hunts. Completely ineffective in empty rooms with nothing to throw.",
        test: "Create a pile of many small items (10+). If they all explode outward at once in every direction instead of one-by-one, it's likely a Poltergeist.",
        zeroEv: "Massive multi-item throws. Constant object activity and interactions. Rapid consecutive EMF readings. Heavy sanity drain in cluttered rooms.",
        tags: ['vis']
    },
    { 
        name: "Banshee", ev: ['uv','orb','dots'], danger: "Low", hunt: "Target Sanity", speed: "1.7 m/s", blink: "Normal", forced: null,
        traits: ["Targets One Player", "Unique Scream"],
        desc: "Chooses ONE player as its target at the start and focuses exclusively on them. Hunt threshold uses the target's sanity, NOT the team's average!",
        ability: "Randomly picks one player as its 'target'. All hunting attempts focus on this player - it will walk past teammates to chase its target. IMPORTANT: Uses the TARGET's sanity (not team average) to decide when to hunt. Crucifixes work from 5m instead of 3m.",
        test: "Parabolic Microphone Test: Point the parabolic mic through walls. If you hear a unique high-pitched screech/wail sound, it's a Banshee. Also watch if one player keeps getting chased while others are ignored.",
        zeroEv: "Ghost consistently chasing the same player and walking past others nearby. Unique scream on parabolic. Early hunts if target has low sanity even when team average is high.",
        tags: ['guarantee']
    },
    { 
        name: "Jinn", ev: ['emf','uv','freezing'], danger: "High", hunt: "50%", speed: "1.7-2.5 m/s", blink: "Normal", forced: null,
        traits: ["Fast with Power ON", "Sanity Zap", "Never Cuts Power"],
        desc: "Very territorial ghost that moves MUCH faster when the breaker is ON and it can see you. Can also drain 25% sanity instantly with an ability.",
        ability: "Speeds up to 2.5 m/s (very fast!) when chasing you in line-of-sight IF the fuse box/breaker is ON. Has a special ability that instantly drains 25% sanity from nearby players (only works with breaker ON). Will never turn the breaker OFF itself.",
        test: "Turn the Breaker OFF during a hunt. If the ghost suddenly slows down dramatically from fast to normal speed, it's a Jinn. Also watch for sudden 25% sanity drops when near it.",
        zeroEv: "Extremely fast hunts that slow way down when you cut the power. Breaker frequently turning back ON. Sudden massive sanity drops (~25%) when near the ghost.",
        tags: ['fast']
    },
    { 
        name: "Mare", ev: ['box','orb','writing'], danger: "Med", hunt: "60% (dark) / 40% (light)", speed: "1.7 m/s", blink: "Normal", forced: null,
        traits: ["Fears Light", "Hunts Earlier in Dark"],
        desc: "Empowered by darkness, weakened by light. Hunts much earlier in dark rooms. Will immediately turn lights OFF and frequently breaks bulbs.",
        ability: "Hunts at 60% sanity in DARK rooms but only 40% sanity in LIT rooms. Will immediately turn lights OFF (within seconds) and frequently shatters bulbs. Can NEVER turn lights ON - only off.",
        test: "Turn a light ON in the ghost room. If it turns OFF immediately within a few seconds, it's likely a Mare. Watch the pattern: lights constantly turning off but NEVER turning on.",
        zeroEv: "Lights constantly being turned off, never on. Light bulbs breaking frequently. Early hunts in dark areas. Ghost staying in dark rooms.",
        tags: ['early']
    },
    { 
        name: "Revenant", ev: ['orb','writing','freezing'], danger: "High", hunt: "50%", speed: "1.0 / 3.0 m/s", blink: "Normal", forced: null,
        traits: ["Fastest When Chasing", "Slowest When Searching"],
        desc: "The ultimate hunter. Extremely slow when searching (1.0 m/s) but VERY fast when it sees you (3.0 m/s). Nearly impossible to outrun once spotted!",
        ability: "Moves at only 1.0 m/s (very slow - half normal speed) when roaming without seeing anyone. Speeds up to 3.0 m/s (nearly twice normal!) when it has line of sight on a player. Constantly alternates between these speeds.",
        test: "Hide during a hunt and listen carefully. Footsteps should be EXTREMELY slow and methodical. If you hear very slow steps that suddenly speed up dramatically when it spots someone, it's a Revenant.",
        zeroEv: "Very distinctive slow/fast audio pattern. Extremely slow footsteps while searching → player spotted → suddenly rapid, loud footsteps. Almost impossible to outrun once it sees you - break line of sight!",
        tags: ['fast']
    },
    { 
        name: "Shade", ev: ['emf','writing','freezing'], danger: "Low", hunt: "35%", speed: "1.7 m/s", blink: "Normal", forced: null,
        traits: ["Very Shy", "Low Activity", "Won't Hunt in Groups"],
        desc: "The shyest ghost. Very low activity and cannot hunt if multiple people are in the same room. MUCH safer when playing as a team!",
        ability: "Cannot initiate a hunt if more than one player is in the same room as it. Hunts at only 35% sanity (lower than normal 50%). Generally very passive with low activity levels.",
        test: "Stay together as a team in the ghost room at low sanity. If it refuses to hunt despite 0% sanity when people are grouped together, it's a Shade. Or test by being completely alone at 0% to force a hunt.",
        zeroEv: "Extremely passive behavior and low activity. Ghost events are often just dark 'shadow' manifestations. Refuses to hunt when team sticks together in same room.",
        tags: []
    },
    { 
        name: "Demon", ev: ['uv','writing','freezing'], danger: "Extreme", hunt: "70%", speed: "1.7 m/s", blink: "Normal", forced: null,
        traits: ["Very Aggressive", "Hunts Early", "Short Cooldown"],
        desc: "The most aggressive ghost. Hunts very early (70% sanity) and very frequently. Can rarely hunt at ANY sanity level! Use crucifixes early.",
        ability: "Hunts at 70% sanity (vs normal 50%). Only 20-second cooldown between hunts (vs normal 25s). Has a rare ability to hunt at 100% sanity (very rare). Smudging only prevents hunts for 60s (vs 90s). Crucifixes work from 5m (vs 3m).",
        test: "Smudge Test: Use smudge sticks near it. If it hunts 60 seconds after being smudged (vs normal 90s), it's a Demon. Also watch for very frequent hunts starting at 60-70% sanity.",
        zeroEv: "Frequent hunts starting at 60-70% sanity. Very short time between hunts. Occasionally hunts at high sanity (rare but terrifying).",
        tags: ['early']
    },
    { 
        name: "Yurei", ev: ['orb','freezing','dots'], danger: "Med", hunt: "50%", speed: "1.7 m/s", blink: "Normal", forced: null,
        traits: ["Slams Doors Shut", "Heavy Sanity Drain"],
        desc: "Drains sanity by fully slamming doors shut. Each full door slam drains 15% sanity from nearby players.",
        ability: "Has a special ability that fully slams a door shut (not just closing it) and drains 15% sanity from all nearby players. When you smudge it, the ghost is trapped in its current room for 90 seconds.",
        test: "Smudge Test: Use smudge sticks in the ghost room. If activity completely stops for 90+ seconds (ghost can't leave room), it's likely a Yurei. Watch for FULL forceful door slams.",
        zeroEv: "Full, forceful door slams (not gentle closes). Heavy sanity drain. Activity stopping completely after smudging.",
        tags: []
    },
    { 
        name: "Oni", ev: ['emf','freezing','dots'], danger: "Med", hunt: "50%", speed: "1.7 m/s", blink: "Solid", forced: null,
        traits: ["Very Active", "More Visible", "No Airball Event"],
        desc: "Very active and physical ghost. More visible during hunts. Cannot do the 'airball' ghost event - seeing an airball proves it's NOT an Oni!",
        ability: "Cannot perform the 'airball' mist event (floating ball of mist). Drains double sanity (20% vs normal 10%) during ghost event interactions. More visible during hunts with less blinking time.",
        test: "If you witness the 'Airball' event (floating mist ball), it is 100% NOT an Oni. Oni also appears more visible (solid) during hunts - easier to photograph.",
        zeroEv: "Highly visible during hunts with less blinking. Very frequent physical object interactions. Cannot be Oni if you see airball mist event.",
        tags: ['vis']
    },
    { 
        name: "Yokai", ev: ['box','orb','dots'], danger: "Med", hunt: "80% (talking) / 50%", speed: "1.7 m/s", blink: "Normal", forced: null,
        traits: ["Triggered by Talking", "Deaf During Hunts"],
        desc: "Attracted to player voices. Talking near it can trigger hunts at 80% sanity! But during hunts, it's nearly deaf - only hears within 2.5m.",
        ability: "If players talk near the Yokai, it can hunt at 80% sanity instead of 50%. During hunts, it can only hear/detect electronics within 2.5 meters (vs normal 12m) - this makes it very easy to hide from!",
        test: "Hide during a hunt and talk/yell loudly. If it completely ignores you and walks past, it's a Yokai (other ghosts would hear you from 12m away).",
        zeroEv: "Early hunts at high sanity triggered by team talking. Ghost being unresponsive to voice and electronics during hunts unless you're right next to it.",
        tags: ['early']
    },
    { 
        name: "Hantu", ev: ['freezing','orb','uv'], danger: "Med", hunt: "50%", speed: "1.4-2.7 m/s", blink: "Normal", forced: "freezing",
        traits: ["Faster in Cold", "Visible Breath", "Never Turns Power ON"],
        desc: "Moves faster in cold rooms and slower in warm rooms. Shows visible freezing breath during hunts. Cannot turn the breaker ON.",
        ability: "Speed scales with temperature: 1.4 m/s in warm areas → 2.7 m/s in freezing areas (VERY fast!). Shows visible frosty breath during hunts in any temperature. Will never turn the breaker ON (but can turn it OFF).",
        test: "Turn the breaker ON to warm the building. If the ghost slows down significantly during hunts, it's a Hantu. Also look for visible freezing breath clouds from the ghost during hunts.",
        zeroEv: "Extremely fast in cold rooms, noticeably slower in warm rooms. Visible frosty breath during hunts. Breaker frequently being OFF but never turning ON.",
        tags: ['fast']
    },
    { 
        name: "Goryo", ev: ['emf','uv','dots'], danger: "Low", hunt: "50%", speed: "1.7 m/s", blink: "Normal", forced: "dots",
        traits: ["D.O.T.S Camera Only", "Never Roams Far"],
        desc: "D.O.T.S evidence ONLY shows on video camera, never with naked eye. Very territorial - doesn't roam far from ghost room.",
        ability: "D.O.T.S silhouette is only visible through a video camera (not with your eyes directly). The effect only shows when no players are in the room. Goryo will not roam far from its favorite room.",
        test: "If you see D.O.T.S silhouette with your naked eyes (without camera), it is 100% NOT a Goryo. If D.O.T.S only appears on video camera feed, it's a Goryo!",
        zeroEv: "Very hard to identify without D.O.T.S evidence. Ghost staying in one general area. D.O.T.S appearing only on camera view.",
        tags: ['guarantee']
    },
    { 
        name: "Myling", ev: ['emf','writing','uv'], danger: "Med", hunt: "50%", speed: "1.7 m/s", blink: "Normal", forced: null,
        traits: ["Silent Footsteps", "More Vocal"],
        desc: "The ONLY ghost with quiet footsteps! Footsteps can only be heard within 12m (vs normal 20m). Very vocal on parabolic mic.",
        ability: "Footsteps during hunts are only audible within 12 meters instead of the normal 20 meters. This makes it much harder to hear approaching. More vocal on the parabolic microphone.",
        test: "Listen during a hunt. If you suddenly hear vocals/breathing before you hear footsteps, it's a Myling. Normal ghosts = footsteps heard from much farther away.",
        zeroEv: "Silent footsteps until the ghost is very close. Vocals/breathing heard before footsteps. Very dangerous surprise attacks because you can't hear it coming!",
        tags: ['quiet']
    },
    { 
        name: "Onryo", ev: ['box','orb','freezing'], danger: "High", hunt: "60% (Any w/ flames)", speed: "1.7 m/s", blink: "Normal", forced: null,
        traits: ["Fears Fire", "Flame-Triggered Hunts"],
        desc: "Fears fire - lit flames block hunts like crucifixes. But blowing out 3 flames triggers a hunt at ANY sanity level! Keep flames lit!",
        ability: "Lit candles/lighters within 4m prevent the Onryo from hunting (work like crucifixes). However, if it blows out 3 flames total (tracked across the whole game), it will hunt at ANY sanity level! Each flame blocks one hunt attempt.",
        test: "Light a candle near the ghost room. If it immediately blows out the candle and then starts hunting right after, it's likely an Onryo.",
        zeroEv: "Candles/flames blowing out frequently. Hunting immediately after blowing out flames. Can hunt at any sanity if 3 flames have been extinguished.",
        tags: ['early']
    },
    { 
        name: "The Twins", ev: ['emf','box','freezing'], danger: "Med", hunt: "50%", speed: "1.5 / 1.9 m/s", blink: "Normal", forced: null,
        traits: ["Two Entities", "Alternating Speeds"],
        desc: "Actually TWO separate ghost entities! Can interact in two places at once. One is slower (1.5 m/s), one is faster (1.9 m/s).",
        ability: "Two ghosts: Main entity (1.5 m/s) and Decoy entity (1.9 m/s). They alternate which one hunts. Can interact with environment in two different locations simultaneously.",
        test: "Watch for interactions happening in two places at the same time. Listen to hunt speeds - if one hunt seems slower and the next seems faster, it's Twins.",
        zeroEv: "Two EMF/interaction readings in different locations at the same time. Hunt speeds alternating between slow and fast hunts.",
        tags: ['fast']
    },
    { 
        name: "Raiju", ev: ['emf','orb','dots'], danger: "High", hunt: "65% (electronics)", speed: "1.7-2.5 m/s", blink: "Normal", forced: null,
        traits: ["Powered by Electronics", "Early Hunter"],
        desc: "Powered by electronics! Moves faster near active equipment and can hunt earlier (65% vs 50%) when near electronics. Turn equipment OFF!",
        ability: "Near active electronics (6-10m depending on map size), moves at 2.5 m/s and can hunt at 65% sanity instead of 50%. Disrupts electronics from 15m away (vs normal 10m).",
        test: "Place lots of active equipment on the floor. If the ghost zooms past it very fast during hunts, it's a Raiju. Turn OFF equipment to slow it down!",
        zeroEv: "Very fast speeds near your equipment piles. Electronics disrupting from farther away (15m). Early hunts when electronics are active.",
        tags: ['fast', 'early']
    },
    { 
        name: "Obake", ev: ['emf','orb','uv'], danger: "Med", hunt: "50%", speed: "1.7 m/s", blink: "Shifting", forced: "uv",
        traits: ["Shapeshifter", "6-Finger Prints", "75% UV Chance"],
        desc: "A shapeshifter that can leave 6-finger handprints! Only has 75% chance to leave UV evidence (vs 100% normal). Changes appearance during hunts.",
        ability: "Can leave 6-finger handprints instead of normal 5-finger (rare but confirms it). Only 75% chance to leave UV evidence at all (vs 100% for others). Changes ghost model/appearance during hunts. UV evidence disappears faster (half the normal time).",
        test: "Find a 6-finger handprint and it's 100% confirmed Obake. Also watch if UV evidence seems to appear less often or disappear faster than normal.",
        zeroEv: "Model/appearance changing during hunts (very noticeable). UV evidence appearing less frequently. Fingerprints fading quickly (~30s vs 60s).",
        tags: ['guarantee']
    },
    { 
        name: "The Mimic", ev: ['box','freezing','uv'], danger: "Low", hunt: "Variable", speed: "Variable", blink: "Variable", forced: "orb",
        traits: ["Copies Other Ghosts", "ALWAYS Has Ghost Orbs"],
        desc: "Copies/mimics other ghost types every 30s-2min. ALWAYS shows Ghost Orbs as a 4th evidence - if you have 3 evidence + Orbs, it's a Mimic!",
        ability: "Mimics the traits, abilities, speeds, and hunt patterns of other ghost types, changing which ghost it copies every 30 seconds to 2 minutes. ALWAYS has Ghost Orbs as forced 4th evidence.",
        test: "If you have collected 3 pieces of evidence and also see Ghost Orbs (making 4 evidence total), it's 100% The Mimic. No other ghost has 4 evidence!",
        zeroEv: "Behavior constantly changing and being inconsistent. Can display traits from multiple different ghost types. Hard to pin down.",
        tags: ['guarantee']
    },
    { 
        name: "Moroi", ev: ['box','writing','freezing'], danger: "High", hunt: "50%", speed: "1.5-2.25 m/s", blink: "Normal", forced: "box",
        traits: ["Curses Players", "Gets Faster at Low Sanity"],
        desc: "Getting a Spirit Box response CURSES you, doubling your sanity drain! Moves faster as sanity drops (1.5 → 2.25 m/s). Sanity pills slow it down!",
        ability: "Spirit Box response or parabolic microphone sounds curse the player, causing 2x passive sanity drain (lights won't stop it). Speed increases from 1.5 m/s at high sanity to 2.25 m/s at low sanity. Smudge blind lasts 12 seconds (vs normal 6s).",
        test: "Take sanity pills during a hunt. If the ghost noticeably slows down right after taking pills, it's a Moroi. Also avoid Spirit Box until necessary to prevent curse!",
        zeroEv: "Gets progressively faster as the game goes on and sanity drops. Longer smudge blind duration (12s). Unusually fast sanity drain if cursed.",
        tags: ['fast']
    },
    { 
        name: "Deogen", ev: ['box','writing','dots'], danger: "High", hunt: "40%", speed: "0.4-3.0 m/s", blink: "Normal", forced: "box",
        traits: ["Always Knows Location", "Slow When Close"],
        desc: "Always knows exactly where you are - you CANNOT hide from it! Very fast from distance (3.0 m/s) but super slow up close (0.4 m/s). Loop it!",
        ability: "Always knows player locations - hiding in lockers/closets doesn't work! Moves at 3.0 m/s when far away but slows to 0.4 m/s when within a few meters. Spirit Box can be used anywhere (vs requiring dark).",
        test: "Do NOT try to hide in lockers/closets - it will find you! Instead, loop it around furniture. If the ghost slows to a crawl when it gets close, it's a Deogen.",
        zeroEv: "Finding you in hiding spots instantly. Very fast when far, extremely slow when near. Spirit Box working in lit rooms.",
        tags: ['fast', 'guarantee']
    },
    { 
        name: "Thaye", ev: ['orb','writing','dots'], danger: "High → Low", hunt: "75% → 15%", speed: "2.75 → 1.0 m/s", blink: "Normal", forced: null,
        traits: ["Ages Over Time", "Fast Early, Slow Late"],
        desc: "Ages every 1-2 minutes, becoming slower and less active over time. Starts VERY aggressive (75%, 2.75 m/s) but becomes weakest ghost! Wait it out!",
        ability: "Starts extremely active and dangerous: 75% hunt threshold and 2.75 m/s speed. Ages down every 1-2 minutes spent near players, eventually reaching 15% threshold and 1.0 m/s (slowest ghost). Can ask age on Ouija Board.",
        test: "Was the ghost extremely aggressive, fast, and active in the first 5 minutes, but became quiet and slow later? That's a Thaye. Wait it out!",
        zeroEv: "Extreme activity and speed in early game, becoming progressively slower and quieter. Dead quiet and passive late game.",
        tags: ['fast', 'early']
    }
    ,
    { 
        name: "Dayan", ev: ['emf','orb','box'], danger: "Med", hunt: "45-60%", speed: "1.12-2.25 m/s", blink: "Normal", forced: null,
        traits: ["Reacts to Movement", "Female Only", "Proximity Sensitive"],
        desc: "A hyper-vigilant spirit that reacts to player movement. Speeds up dramatically when players move near her (10m), but slows way down when standing still!",
        ability: "When players are within 10 meters: speeds up to 2.25 m/s if you move, or slows to 1.12 m/s if you stand still. Hunt threshold increases to 60% if moving near her, or decreases to 45% if standing still. Only uses female ghost models.",
        test: "Stand Still Test: During a hunt, if you are within 10m and stand completely still, the ghost should slow to a crawl (1.12 m/s). If you move, it speeds up to 2.25 m/s instantly. Also check gender - Dayan is always female!",
        zeroEv: "Ghost dramatically speeds up when players move, slows down when players freeze. Always female ghost model. Hunt thresholds varying based on movement.",
        tags: ['fast']
    }
    ,
    { 
        name: "Gallu", ev: ['emf','uv','box'], danger: "High", hunt: "40-60%", speed: "1.36-1.96 m/s", blink: "Normal", forced: null,
        traits: ["Hates Protective Equipment", "Three States", "Demon-Like"],
        desc: "Another form of demon that gets ENRAGED when you use protective equipment! Crucifixes and smudge sticks provoke it, making them less effective over time.",
        ability: "Has three states: Normal (50% hunt, 1.7 m/s), Enraged (60% hunt, 1.96 m/s - triggered by using crucifixes/smudge sticks), and Weakened (40% hunt, 1.36 m/s - after being enraged). Using protective equipment angers it but also exhausts it afterward.",
        test: "Use a crucifix or smudge sticks multiple times. If hunts start happening MORE frequently and equipment feels less effective, then the ghost suddenly becomes weaker, it is a Gallu. Protective gear provokes it!",
        zeroEv: "Crucifixes and smudge sticks seeming less effective. Hunts becoming more aggressive after using protection, then weakening afterward. Very aggressive demon-like behavior.",
        tags: ['early', 'fast']
    }
    ,
    { 
        name: "Obambo", ev: ['uv','writing','dots'], danger: "Med", hunt: "10% / 65%", speed: "1.45 / 1.96 m/s", blink: "Normal", forced: null,
        traits: ["Dual States", "Mood Swings", "Unpredictable"],
        desc: "Switches between calm and aggressive states every ~2 minutes! When calm: barely hunts (10%, 1.45 m/s). When aggressive: hunts often (65%, 1.96 m/s)!",
        ability: "Alternates between two states approximately every 2 minutes. Calm state: 10% hunt threshold, 1.45 m/s speed, very low activity. Aggressive state: 65% hunt threshold, 1.96 m/s speed, high activity. Can switch states mid-hunt!",
        test: "Patience is key! Observe the ghost over time. If it is extremely passive for a while then suddenly becomes very aggressive (or vice versa), it is an Obambo. Watch for activity waves.",
        zeroEv: "Ghost switching between extremely calm periods (no activity, will not hunt) and aggressive periods (frequent hunts, lots of interactions). Inconsistent behavior patterns.",
        tags: ['early']
    }
];

// --- 2. STATE ---
let app = {
    evidence: { emf:0, box:0, uv:0, orb:0, writing:0, freezing:0, dots:0 },
    activeFilters: new Set(),
    timer: { int: null, dur: 90 }
};

const ui = {
    evBar: document.getElementById('evBar'),
    filterRow: document.getElementById('filterRow'),
    ghostGrid: document.getElementById('ghostGrid'),
    count: document.getElementById('matchCount'),
    ghostModal: document.getElementById('ghostModal'),
    manualModal: document.getElementById('manualModal'),
    timerDisplay: document.getElementById('timerDisplay'),
    timerFill: document.getElementById('timerFill'),
    timerBtn: document.getElementById('timerBtn')
};

// --- 3. INIT ---
function init() {
    renderEvidence();
    renderFilters();
    updateBoard();

    document.getElementById('btnReset').addEventListener('click', () => {
        Object.keys(app.evidence).forEach(k => app.evidence[k] = 0);
        app.activeFilters.clear();
        renderFilters();
        updateBoard();
    });

    document.getElementById('btnManual').addEventListener('click', () => {
        showManualTab('ev', document.querySelector('.manual-nav .nav-btn'));
        ui.manualModal.showModal();
    });

    document.getElementById('closeGhost').addEventListener('click', () => ui.ghostModal.close());
    document.getElementById('closeManual').addEventListener('click', () => ui.manualModal.close());

    document.querySelectorAll('.t-opt').forEach(b => {
        b.addEventListener('click', () => {
            document.querySelectorAll('.t-opt').forEach(x => x.classList.remove('active'));
            b.classList.add('active');
            app.timer.dur = parseInt(b.dataset.time);
            resetTimer();
        });
    });

    // Timer button
    ui.timerBtn.addEventListener('click', () => {
        if(app.timer.int) {
            clearInterval(app.timer.int);
            app.timer.int = null;
            ui.timerBtn.innerHTML = "▶";
            ui.timerBtn.classList.remove('active');
            return;
        }
        ui.timerBtn.innerHTML = "⏹";
        ui.timerBtn.classList.add('active');
        ui.timerFill.style.width = "0%";
        ui.timerFill.style.background = "var(--acc-cyan)";
        const start = Date.now();
        const end = start + (app.timer.dur * 1000);
        app.timer.int = setInterval(() => {
            const left = Math.ceil((end - Date.now())/1000);
            if(left <= 0) {
                ui.timerDisplay.textContent = "0";
                ui.timerFill.style.width = "100%";
                ui.timerFill.style.background = "var(--acc-red)";
                clearInterval(app.timer.int);
                app.timer.int = null;
                ui.timerBtn.innerHTML = "▶";
                ui.timerBtn.classList.remove('active');
            } else {
                ui.timerDisplay.textContent = left;
                ui.timerFill.style.width = (((app.timer.dur - left) / app.timer.dur)*100) + "%";
            }
        }, 100);
    });

    // WIP banner close + remember dismissal
    const banner = document.getElementById('wipBanner');
    const bannerClose = document.getElementById('wipClose');

    if (banner && bannerClose) {
        if (localStorage.getItem('phasmo_wip_dismissed') === '1') {
            banner.style.display = 'none';
        }

        bannerClose.addEventListener('click', () => {
            banner.style.display = 'none';
            localStorage.setItem('phasmo_wip_dismissed', '1');
        });
    }

    // Initial manual content
    document.getElementById('manualContent').innerHTML = MANUAL_DB.ev;
}

// --- 4. RENDERING ---
function renderEvidence() {
    ui.evBar.innerHTML = '';
    EVIDENCE.forEach(ev => {
        const btn = document.createElement('div');
        btn.className = 'ev-btn';
        btn.dataset.id = ev.id;
        btn.innerHTML = `<div class="ev-icon">${ev.icon}</div><div class="ev-label">${ev.label}</div>`;
        btn.addEventListener('click', (e) => toggleEv(ev.id, 1, e));
        btn.addEventListener('contextmenu', (e) => toggleEv(ev.id, 2, e));
        ui.evBar.appendChild(btn);
    });
}

function renderFilters() {
    ui.filterRow.innerHTML = '';
    FILTERS.forEach(f => {
        const chip = document.createElement('div');
        chip.className = `filter-chip ${app.activeFilters.has(f.id) ? 'active' : ''}`;
        chip.textContent = f.label;
        chip.addEventListener('click', () => {
            if(app.activeFilters.has(f.id)) app.activeFilters.delete(f.id);
            else app.activeFilters.add(f.id);
            renderFilters();
            updateBoard();
        });
        ui.filterRow.appendChild(chip);
    });
}

// --- 5. LOGIC ---
function toggleEv(id, val, e) {
    e.preventDefault();
    app.evidence[id] = (app.evidence[id] === val) ? 0 : val;
    updateBoard();
}

function updateBoard() {
    const matches = [];
    const possibleEv = new Set();

    GHOSTS.forEach(g => {
        let possible = true;
        for(const [id, val] of Object.entries(app.evidence)) {
            if(val === 0) continue;
            const has = g.ev.includes(id) || (g.name === 'The Mimic' && id === 'orb');
            if(val === 1 && !has) possible = false;
            if(val === 2 && has) possible = false;
        }
        if(possible && app.activeFilters.size > 0) {
            app.activeFilters.forEach(fid => {
                if(!g.tags.includes(fid)) possible = false;
            });
        }

        if(possible) {
            matches.push(g);
            g.ev.forEach(e => possibleEv.add(e));
            if(g.name === 'The Mimic') possibleEv.add('orb');
        }
    });

    ui.count.textContent = matches.length;

    // Update evidence counter
    const selectedEvidence = Object.values(app.evidence).filter(v => v === 1).length;
    const evCountEl = document.getElementById('evCount');
    if (evCountEl) evCountEl.textContent = selectedEvidence;

    // Update filter counter
    const filterCountEl = document.getElementById('filterCount');
    if (filterCountEl) filterCountEl.textContent = app.activeFilters.size;

    document.querySelectorAll('.ev-btn').forEach(btn => {
        const id = btn.dataset.id;
        btn.dataset.state = app.evidence[id];
        if(app.evidence[id] === 0 && matches.length < GHOSTS.length && !possibleEv.has(id)) {
            btn.classList.add('dimmed');
        } else {
            btn.classList.remove('dimmed');
        }
    });

    ui.ghostGrid.innerHTML = '';
    matches.forEach(g => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.danger = g.danger;

        let dots = '';
        EVIDENCE.forEach(e => {
            let cls = 'ev-tag';
            if(app.evidence[e.id] === 1) cls += ' match';
            if(g.forced === e.id) cls += ' forced';
            
            if(g.ev.includes(e.id)) {
                let label = e.id === 'writing' ? 'BOOK' : 
                            e.id === 'freezing' ? 'FRZ' : 
                            e.id === 'box' ? 'BOX' : 
                            e.label.replace('EMF 5','EMF').replace('Orbs','ORB');
                dots += `<div class="${cls}">${label}</div>`;
            }
        });
        if(g.name === 'The Mimic') {
            let cls = 'ev-tag mimic';
            if(app.evidence.orb === 1) cls += ' match';
            dots += `<div class="${cls}">+ORBS</div>`;
        }

        let traitsHtml = '';
        if(g.traits) g.traits.forEach(t => traitsHtml += `<div class="trait-badge">${t}</div>`);

        card.innerHTML = `
            <div class="card-header">
                <h3 class="card-name">${g.name}</h3>
                <div class="pill-container"><div class="stat-pill danger"><span>Hunt: ${g.hunt}</span></div></div>
            </div>
            <div class="trait-row">${traitsHtml}</div>
            <div class="card-desc">${g.desc}</div>
            <div class="card-bot">${dots}</div>
        `;
        
        card.addEventListener('click', () => openGhostModal(g));
        ui.ghostGrid.appendChild(card);
    });
}

function openGhostModal(g) {
    document.getElementById('mName').textContent = g.name;
    document.getElementById('mContent').innerHTML = `
        <div class="stat-grid">
            <div class="stat-box"><span class="stat-label">Speed</span><span class="stat-val" style="color:var(--acc-orange)">${g.speed}</span></div>
            <div class="stat-box"><span class="stat-label">Hunt Threshold</span><span class="stat-val" style="color:var(--acc-red)">${g.hunt}</span></div>
            <div class="stat-box"><span class="stat-label">Blink Rate</span><span class="stat-val">${g.blink}</span></div>
            <div class="stat-box"><span class="stat-label">Difficulty</span><span class="stat-val">${g.danger}</span></div>
        </div>
        <div class="section-header">Behavior</div>
        <div class="detail-text">${g.ability}</div>
        <div class="section-header">Zero Evidence Tell</div>
        <div class="detail-text" style="color:var(--acc-cyan)">${g.zeroEv}</div>
        <div class="section-header">Confirmation Test</div>
        <div class="confirm-box detail-text">${g.test}</div>
    `;
    ui.ghostModal.showModal();
}

// --- 6. MANUAL CONTENT ---
const MANUAL_DB = {
    ev: `
        <div class="manual-entry">
            <h4>EMF Level 5</h4>
            <p class="detail-text">
                Reader must hit the red LED (5). Level 2–4 is normal interaction or events.
                <br><span class="hl-blue">Tip:</span> Place EMF on doors, windows, or objects the ghost touches to catch EMF 5.
            </p>
        </div>
        <div class="manual-entry">
            <h4>Spirit Box</h4>
            <p class="detail-text">
                Lights OFF in the room. Ask questions while close to the ghost room.
                Look for the <span class="hl-green">ghost icon</span> on the box UI, that is evidence.
                <br><span class="hl-blue">Tip:</span> You can talk while other gear is on, just avoid high noise sources like active hunts.
            </p>
        </div>
        <div class="manual-entry">
            <h4>Ultraviolet (UV)</h4>
            <p class="detail-text">
                Green handprints on doors, windows, light switches, and keyboards.
                Footprints from salt are <span class="hl-red">NOT</span> evidence, even though they show up with UV.
                <br><span class="hl-blue">Tip:</span> Check doors right after they move &mdash; prints fade in ~60 seconds, some ghosts shorten this.
            </p>
        </div>
        <div class="manual-entry">
            <h4>Ghost Orbs</h4>
            <p class="detail-text">
                Small floating spheres seen only on video cameras with Night Vision.
                Orbs spawn in or near the <span class="hl-green">current ghost room.</span>
                <br><span class="hl-blue">Tip:</span> Place camera at head height pointing into the room, then check from the truck or a monitor.
            </p>
        </div>
        <div class="manual-entry">
            <h4>Ghost Writing</h4>
            <p class="detail-text">
                Ghost writes in the book. Thrown books or kicked books are <span class="hl-red">not</span> evidence.
                <br><span class="hl-blue">Tip:</span> Use two books in the ghost room to speed this up, especially for shy ghosts.
            </p>
        </div>
        <div class="manual-entry">
            <h4>Freezing Temperatures</h4>
            <p class="detail-text">
                Below 0°C/32°F with visible breath. Thermometer or breath both count.
                <br><span class="hl-blue">Tip:</span> Check multiple rooms and hallways, especially if the breaker has just come on.
            </p>
        </div>
        <div class="manual-entry">
            <h4>D.O.T.S Projector</h4>
            <p class="detail-text">
                Green silhouette running through the projector area.
                Some ghosts are more visible on camera than to the naked eye.
                <br><span class="hl-blue">Tip:</span> Place DOTS in the center of the ghost room and watch from camera for a while.
            </p>
        </div>
    `,
    sanity: `
        <div class="manual-entry">
            <h4>Sanity Basics</h4>
            <p class="detail-text">
                Your sanity drains over time, faster in the dark.
                <br>&bull; Base drain: ~<span class="hl-green">0.12%/sec</span> in light, ~<span class="hl-red">0.24%/sec</span> in darkness (values approximate).
                <br>&bull; Ghost events (breathing, apparitions) drain extra sanity on top.
                <br>&bull; Some ghosts have unique sanity abilities (extra drain or protection).
            </p>
        </div>
        <div class="manual-entry">
            <h4>Average vs Individual Sanity</h4>
            <p class="detail-text">
                Hunt checks use the <span class="hl-blue">average team sanity</span>, not just yours.
                <br>&bull; One low-sanity player can drag the whole team’s average down.
                <br>&bull; Some ghosts target a single player (Banshee), but still respect average sanity for hunts.
            </p>
        </div>
        <div class="manual-entry">
            <h4>Hunt Thresholds</h4>
            <p class="detail-text">
                Approximate thresholds (average sanity):
                <br><span class="hl-red">80%</span> Yokai (if talking a lot)
                <br><span class="hl-red">75%</span> Thaye (young)
                <br><span class="hl-red">70%</span> Demon
                <br><span class="hl-red">60%</span> Mare (in the dark)
                <br><span class="hl-red">50%</span> Standard ghosts
                <br><span class="hl-green">35%</span> Shade
                <br><span class="hl-blue">Special:</span> Some abilities allow hunts above usual values (e.g. Demon, cursed hunts).
            </p>
        </div>
        <div class="manual-entry">
            <h4>Sanity Pills</h4>
            <p class="detail-text">
                Pills restore a chunk of sanity depending on difficulty.
                <br>&bull; Higher difficulties restore less sanity.
                <br>&bull; Each player has a limited number of pills per contract.
                <br><span class="hl-blue">Tip:</span> Use pills after early evidence but before hitting dangerous hunt ranges to stabilize the game.
            </p>
        </div>
        <div class="manual-entry">
            <h4>Sanity & Specific Ghosts</h4>
            <p class="detail-text">
                Some ghosts interact heavily with sanity:
                <br>&bull; <span class="hl-red">Yurei:</span> Door slam that drains ~15%.
                <br>&bull; <span class="hl-red">Phantom:</span> Looking at it drains sanity faster during events.
                <br>&bull; <span class="hl-red">Moroi:</span> Curses you via Spirit Box/Paramic and speeds up the lower your sanity gets.
                <br>&bull; <span class="hl-red">Demon:</span> Can hunt very early and has a shorter hunt cooldown.
            </p>
        </div>
    `,
    cursed: `
        <div class="manual-entry">
            <h4>Ouija Board</h4>
            <p class="detail-text">
                Asks questions directly to the ghost.
                <br>&bull; Each question drains sanity, more for certain questions.
                <br>&bull; Saying "Goodbye" correctly ends the session safely.
                <br><span class="hl-red">Hide and Seek</span> will trigger an instant hunt.
                <br><span class="hl-blue">Tip:</span> Use it deliberately when you are ready to hide &mdash; great for speedrunning and forced hunts.
            </p>
        </div>
        <div class="manual-entry">
            <h4>Tarot Cards</h4>
            <p class="detail-text">
                Draw cards for random effects:
                <br>&bull; <span class="hl-red">Death:</span> Triggers a hunt.
                <br>&bull; <span class="hl-green">Sun:</span> Restores sanity to 100%.
                <br>&bull; <span class="hl-red">Moon:</span> Drops sanity to 0%.
                <br>&bull; <span class="hl-red">Hanged Man:</span> Instant death.
                <br><span class="hl-blue">Tip:</span> Always be near a hiding spot when drawing cards, in case you pull Death.
            </p>
        </div>
        <div class="manual-entry">
            <h4>Music Box</h4>
            <p class="detail-text">
                Plays a lullaby, revealing the ghost’s location.
                <br>&bull; Walking too close while it plays will make the ghost manifest and then hunt.
                <br>&bull; Turning it off early can still anger the ghost.
                <br><span class="hl-blue">Tip:</span> Use to pinpoint the ghost room, but make sure your hiding route is planned first.
            </p>
        </div>
        <div class="manual-entry">
            <h4>Haunted Mirror</h4>
            <p class="detail-text">
                Shows the ghost room through the mirror.
                <br>&bull; Using it drains sanity rapidly while held up.
                <br>&bull; If sanity gets too low or used too long, it will shatter and trigger a hunt.
                <br><span class="hl-blue">Tip:</span> Peek briefly to learn the room, then stop before it cracks.
            </p>
        </div>
        <div class="manual-entry">
            <h4>Voodoo Doll</h4>
            <p class="detail-text">
                Interacting pushes random pins.
                <br>&bull; Each pin causes a ghost interaction and sanity drain.
                <br>&bull; The heart pin forces a hunt.
                <br><span class="hl-blue">Tip:</span> Use for extra interactions when you need evidence, but be ready for an immediate hunt.
            </p>
        </div>
        <div class="manual-entry">
            <h4>Summoning Circle</h4>
            <p class="detail-text">
                Lights candles to summon a full ghost apparition.
                <br>&bull; Lighting all candles forces the ghost to appear in the circle.
                <br>&bull; After the manifestation it will immediately hunt.
                <br><span class="hl-blue">Tip:</span> Great for ghost photos, but only use if your hiding spot is close and safe.
            </p>
        </div>
        <div class="manual-entry">
            <h4>Monkey Paw</h4>
            <p class="detail-text">
                Grants limited wishes with trade-offs.
                <br>&bull; Wishes can change weather, sanity, revive, lock doors, and more, but each has a curse.
                <br>&bull; Many wishes force cursed hunts, disable hiding spots, or distort vision.
                <br><span class="hl-blue">Tip:</span> Treat it as a late-game tool when you understand the downside of each wish.
            </p>
        </div>
    `,
    equip: `
        <div class="manual-entry">
            <h4>Crucifix</h4>
            <p class="detail-text">
                Prevents hunts from starting within range.
                <br>&bull; Default radius ~3m, <span class="hl-red">5m for Demon.</span>
                <br>&bull; Each use burns one arm &mdash; two uses and it is destroyed.
                <br><span class="hl-blue">Tip:</span> Place on the floor where the ghost stands most often (center of ghost room or favorite hallway).
            </p>
        </div>
        <div class="manual-entry">
            <h4>Smudge Sticks</h4>
            <p class="detail-text">
                Burn to repel or blind the ghost.
                <br>&bull; During a hunt, blinds and slows the ghost for a few seconds.
                <br>&bull; Outside hunts, prevents hunts for 90s, <span class="hl-green">180s for Spirit</span>, less for Demon.
                <br><span class="hl-blue">Tip:</span> Use them on the ghost room or as an escape tool while looping.
            </p>
        </div>
        <div class="manual-entry">
            <h4>Sanity Pills</h4>
            <p class="detail-text">
                Restores sanity depending on difficulty.
                <br>&bull; Stronger on lower difficulties, weaker on higher.
                <br>&bull; Limited number per contract.
                <br><span class="hl-blue">Tip:</span> Save pills until after you’ve gathered some evidence, then stabilize before pushing late game.
            </p>
        </div>
        <div class="manual-entry">
            <h4>Candles & Lighters</h4>
            <p class="detail-text">
                Candles prevent passive sanity drain when near them.
                <br>&bull; The ghost can blow them out.
                <br>&bull; Onryo has special interactions with flames and candles.
                <br><span class="hl-blue">Tip:</span> Use candles in objectives rooms to stay longer without losing tons of sanity.
            </p>
        </div>
        <div class="manual-entry">
            <h4>EMF Reader</h4>
            <p class="detail-text">
                Detects ghost interactions and certain abilities.
                <br>&bull; EMF 5 is evidence, lower levels are still useful for tracking interactions.
                <br><span class="hl-blue">Tip:</span> Drop EMF in the ghost room and check it after noises, door moves, or thrown items.
            </p>
        </div>
        <div class="manual-entry">
            <h4>Thermometer</h4>
            <p class="detail-text">
                Helps find the coldest room.
                <br>&bull; Rooms cool over time, especially with the breaker off.
                <br>&bull; Freezing temps still show even if the room warms slightly.
                <br><span class="hl-blue">Tip:</span> Sweep early to locate the ghost, then confirm with breath or more precise readings.
            </p>
        </div>
        <div class="manual-entry">
            <h4>Video Camera</h4>
            <p class="detail-text">
                Used for Ghost Orbs and DOTS (via monitor).
                <br>&bull; Place on tripods or surfaces looking across the room.
                <br>&bull; Night Vision mode is required to see Orbs clearly.
                <br><span class="hl-blue">Tip:</span> Try multiple angles if you suspect Orbs but haven’t seen any yet.
            </p>
        </div>
        <div class="manual-entry">
            <h4>Photo Camera</h4>
            <p class="detail-text">
                Earns money and evidence photos.
                <br>&bull; Dead bodies, interactions, fingerprints, footprints, and the ghost all give photo rewards.
                <br><span class="hl-blue">Tip:</span> Keep it ready during ghost events &mdash; some ghosts (Phantom) behave differently in photos.
            </p>
        </div>
        <div class="manual-entry">
            <h4>Parabolic Microphone</h4>
            <p class="detail-text">
                Listens for distant sounds through walls.
                <br>&bull; Some ghosts have special parabolic sounds (e.g. Banshee scream, Moroi breath).
                <br><span class="hl-blue">Tip:</span> Use on large maps to locate the ghost wing before moving gear in.
            </p>
        </div>
        <div class="manual-entry">
            <h4>DOTS Projector</h4>
            <p class="detail-text">
                Projects a green grid to reveal DOTS evidence.
                <br>&bull; Some ghosts (Goryo) only show DOTS on camera, not to the naked eye.
                <br><span class="hl-blue">Tip:</span> Combine DOTS + video camera to cover both normal and Goryo-style DOTS.
            </p>
        </div>
        <div class="manual-entry">
            <h4>Motion & Sound Sensors</h4>
            <p class="detail-text">
                Area control tools for larger maps.
                <br>&bull; Motion triggers when anything passes through the beam.
                <br>&bull; Sound sensors report activity in a wide cone on the truck monitor.
                <br><span class="hl-blue">Tip:</span> Great for tracking roaming ghosts when you are unsure of the exact room.
            </p>
        </div>
        <div class="manual-entry">
            <h4>UV Light & Glowstick</h4>
            <p class="detail-text">
                Both reveal fingerprints and footprints.
                <br>&bull; Glowsticks can be dropped and left in the room for constant coverage.
                <br><span class="hl-blue">Tip:</span> Use glowsticks around salt piles to catch footprints quickly.
            </p>
        </div>
    `
};

// --- EQUIPMENT DATABASE ---
const EQUIPMENT = {
    detection: [
        { name: "EMF Reader", tier: "Starter", cost: "$45", usage: "Detects ghost interactions and EMF Level 5 evidence", mechanics: "EMF 2: Interaction, EMF 3: Thrown object, EMF 5: EVIDENCE (ghost ability)", tips: "Drop in ghost room. Check after every interaction. Level 5 is rare but unmistakable.", range: "~5m detection radius" },
        { name: "Spirit Box", tier: "Starter", cost: "$50", usage: "Ask questions. Ghost may respond verbally. Evidence = any response.", mechanics: "Works in dark + alone (most ghosts) or anywhere (Deogen, Moroi). Must say trigger words.", tips: "Common questions: 'Where are you?', 'How old?', 'Give us a sign'. Be in dark, alone.", range: "Must be in same room as ghost" },
        { name: "UV Flashlight", tier: "Starter", cost: "$40", usage: "Reveals fingerprints on doors/windows. Evidence = ANY UV print.", mechanics: "Prints appear after ghost touches surface. Last 60s (30s Nightmare). Check doors/light switches.", tips: "Combine with glowsticks for constant coverage. Obake = 6 fingers.", range: "Shine directly on surface" },
        { name: "Photo Camera", tier: "Starter", cost: "$40", usage: "Take photos for money. Ghost photo, interactions, fingerprints, dead bodies.", mechanics: "10 photos max. Ghost photo = 3★ ($$$). Phantom vanishes in photo.", tips: "Save photos for ghost events/hunts. Bone photos = easy money.", range: "Must have subject in frame" },
        { name: "Video Camera", tier: "Starter", cost: "$50", usage: "Monitor remotely for Ghost Orbs. Required for Goryo D.O.T.S", mechanics: "Place on tripod. Enable Night Vision. Check monitor in truck. Orbs = small white dots.", tips: "Cover multiple angles. Goryo DOTS only shows on camera, not naked eye.", range: "Based on camera view angle" },
        { name: "Thermometer", tier: "Starter", cost: "$30", usage: "Find cold rooms. Freezing Temps = below 0°C/32°F evidence.", mechanics: "Rooms cool over time. Breaker OFF = faster cooling. Yellow/Orange = room temp, Blue/Purple = ghost room", tips: "Sweep building early. Ghost room always coldest. Helps locate ghost quickly.", range: "Point and shoot - instant reading" },
        { name: "D.O.T.S Projector", tier: "Upgraded", cost: "$65", usage: "Projects green laser grid. Ghost silhouette = evidence.", mechanics: "Must be placed on wall/floor. Ghost walks through occasionally. Goryo = camera-only visibility.", tips: "Place facing open areas. Combine with video camera. May take time to show.", range: "~5m projection cone" },
        { name: "Ghost Writing Book", tier: "Starter", cost: "$40", usage: "Ghost writes/draws in book = evidence. Place in ghost room.", mechanics: "Ghost must be nearby. Can write full sentences, draw symbols, or scribble. Check periodically.", tips: "Place in center of suspected room. Ghost won't always write immediately. Be patient.", range: "Must be in ghost's presence" },
        { name: "Sound Sensor", tier: "Optional", cost: "$80", usage: "Detects sounds in area. Shows on truck monitor. Great for large maps.", mechanics: "Place in hallways/key rooms. Monitor shows activity level (bars). Tracks roaming.", tips: "Use multiple to triangulate ghost location. Essential on large maps.", range: "Wide cone detection (~10m)" },
        { name: "Motion Sensor", tier: "Optional", cost: "$100", usage: "Detects movement through laser beam. Lights up green on truck.", mechanics: "Place in doorways/hallways. Triggers when anything crosses beam. Tracks roaming patterns.", tips: "Place at exits of suspected rooms. See if ghost roams or stays put.", range: "Laser beam line-of-sight" },
        { name: "Parabolic Microphone", tier: "Upgraded", cost: "$50", usage: "Listen to distant sounds through walls. Special ghost sounds detectable.", mechanics: "Point at walls/doors. Picks up ghost vocals, footsteps, special sounds (Banshee scream, Moroi breathing)", tips: "Excellent for location finding on big maps. Can identify Banshee/Moroi instantly.", range: "30m+ through walls" },
        { name: "Head Mounted Camera", tier: "Optional", cost: "$60", usage: "Player-worn camera visible on truck monitor. Team coordination.", mechanics: "Worn by player. Team watches on monitor. Can spot Ghost Orbs from player POV.", tips: "Useful for solo players or teams wanting extra eyes. Can catch evidence remotely.", range: "Player's field of view" }
    ],
    protection: [
        { name: "Crucifix", tier: "Essential", cost: "$30", usage: "Prevents hunts from starting within range. Two uses (2 arms).", mechanics: "3m range (5m Demon, Banshee). Must be on floor where ghost tries to hunt. Burns one arm per use.", tips: "Place in ghost room center or favorite hallway. Works even in truck/pockets (3m radius).", range: "3m radius (5m for Demon/Banshee)", uses: "2 per crucifix" },
        { name: "Smudge Sticks", tier: "Essential", cost: "$15", usage: "Burn to repel/blind ghost. Prevents hunts or creates escape.", mechanics: "Outside hunt: Prevents hunts for 90s (180s Spirit, 60s Demon). During hunt: Blinds ghost 6s (12s Moroi)", tips: "Light with lighter. Use in ghost room to prevent hunts or while running from hunts.", range: "~6m effect radius", uses: "1 per stick" },
        { name: "Sanity Pills", tier: "Essential", cost: "$20", usage: "Restores sanity. Amount depends on difficulty.", mechanics: "Amateur/Intermediate/Pro/Nightmare: 25%. Insanity: 0%. Taken in 4 bottles.", tips: "Save for after evidence collection. Slows Moroi. Use strategically.", range: "N/A (consumable)", uses: "4 per contract" },
        { name: "Candle", tier: "Starter", cost: "$15", usage: "Prevents sanity drain when near lit candle. Onryo interaction.", mechanics: "Sanity drain = 0 when within range of lit candle. Ghost can blow out. Onryo: Blocks 1 hunt per candle.", tips: "Light in safe rooms. Keep lighter ready to relight. Multiple candles = large safe zone.", range: "~3m sanity protection", uses: "Unlimited (can be blown out)" },
        { name: "Lighter", tier: "Starter", cost: "$15", usage: "Lights candles and smudge sticks. No battery.", mechanics: "Infinite uses. Required for smudging. Lights candles for sanity protection.", tips: "Always have one. Essential for smudge sticks and candles.", range: "Touch-based", uses: "Infinite" }
    ],
    utility: [
        { name: "Flashlight", tier: "Starter", cost: "$30", usage: "Basic handheld light. Essential for dark areas.", mechanics: "Will flicker near ghost when hunting. Provides basic illumination.", tips: "Default light source. Infinite use.", range: "Medium cone" },
        { name: "Strong Flashlight", tier: "Upgraded", cost: "$50", usage: "Brighter, wider beam flashlight. Better coverage.", mechanics: "Brighter and wider than normal flashlight but still flickers when ghost hunts. Premium light source.", tips: "Worth the upgrade for large dark maps (Prison, Asylum). Much better visibility.", range: "Wide cone (brighter)" },
        { name: "Glowstick", tier: "Utility", cost: "$20", usage: "Drop for persistent UV light. Reveals fingerprints constantly.", mechanics: "Drop and leave. Doesn't require holding. Reveals UV evidence while you work elsewhere.", tips: "Place near doors/light switches. Frees hands. Great for salt piles too.", battery: "Infinite (no battery)", range: "~2m UV radius" },
        { name: "Salt", tier: "Detection", cost: "$15", usage: "Place in doorways. Ghost footprints = UV evidence. Tracks movement.", mechanics: "Ghost steps in salt = UV footprints appear. Wraith = NO footprints (identification). Slows ghost temporarily.", tips: "Place in doorways and hallways. Tracks roaming. Wraith test = no prints.", range: "Pile covers ~0.5m", uses: "1 per pile" },
        { name: "Incense", tier: "Alternative", cost: "$15", usage: "Same as smudge sticks. Ceremonial version.", mechanics: "Identical mechanics to smudge sticks. Same timers, same effect.", tips: "No functional difference from smudge sticks. Use interchangeably.", range: "~6m effect radius", uses: "1 per stick" },
        { name: "Tripod", tier: "Optional", cost: "$20", usage: "Holds video cameras at fixed angles. Expands monitoring coverage.", mechanics: "Place anywhere. Mount video camera. Stable coverage of room/hallway.", tips: "Essential for multi-camera setups. Cover ghost room + nearby areas.", range: "N/A (mounting tool)" }
    ]
};

// Equipment Tab Rendering
window.showEquipTab = function(category) {
    const content = document.getElementById('equip-content');
    if (!content) return;
    
    const items = EQUIPMENT[category] || [];
    
    let html = '<div class="equipment-list">';
    
    items.forEach(item => {
        html += `
            <div class="equipment-card">
                <div class="equip-header">
                    <h3 class="equip-name">${item.name}</h3>
                    <div class="equip-badges">
                        <span class="tier-badge">${item.tier}</span>
                        <span class="cost-badge">${item.cost}</span>
                    </div>
                </div>
                <p class="equip-usage"><strong>Usage:</strong> ${item.usage}</p>
                <p class="equip-mechanics"><strong>Mechanics:</strong> ${item.mechanics}</p>
                ${item.range ? `<p class="equip-detail"><strong>Range:</strong> ${item.range}</p>` : ''}
                ${item.battery ? `<p class="equip-detail"><strong>Battery:</strong> ${item.battery}</p>` : ''}
                ${item.uses ? `<p class="equip-detail"><strong>Uses:</strong> ${item.uses}</p>` : ''}
                <div class="equip-tips">
                    <span class="tip-icon">💡</span>
                    <span class="tip-text">${item.tips}</span>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    content.innerHTML = html;
};

// exposed for HTML onclick
// exposed for HTML onclick
window.showManualTab = (key, btn) => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    document.getElementById('manualContent').innerHTML = MANUAL_DB[key];
};

function resetTimer() {
    if(app.timer.int) clearInterval(app.timer.int);
    app.timer.int = null;
    ui.timerBtn.innerHTML = "▶";
    ui.timerBtn.classList.remove('active');
    ui.timerDisplay.textContent = app.timer.dur;
    ui.timerFill.style.width = "0%";
    ui.timerFill.style.background = "var(--acc-cyan)";
}

// kick off
init();
// Initialize Group Journal
initGroupJournal();

// Initialize equipment when page loads
window.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (window.showEquipTab && document.getElementById('equip-content')) {
            window.showEquipTab('detection');
        }
    }, 200);
});

// ═══════════════════════════════════════════════════════════════
// GROUP JOURNAL - MULTIPLAYER SYNC
// ═══════════════════════════════════════════════════════════════

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCBe2DLH2DnFucxKEp_tMfdsTV3dr8K-Qw",
    authDomain: "phasmo-group-journal.firebaseapp.com",
    databaseURL: "https://phasmo-group-journal-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "phasmo-group-journal",
    storageBucket: "phasmo-group-journal.firebasestorage.app",
    messagingSenderId: "224238426204",
    appId: "1:224238426204:web:b20b8db2f80981d2f02e99"
};

// Group Journal State
let groupJournal = {
    sessionId: null,
    isHost: false,
    userId: null,
    syncEnabled: false,
    lastSync: 0,
    syncTimeout: null
};

// Initialize Firebase (only if config is set)
function initFirebase() {
    if (firebaseConfig.apiKey === "YOUR-API-KEY-HERE") {
        console.log("Firebase not configured. Group Journal disabled.");
        return false;
    }
    
    try {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        groupJournal.userId = generateUserId();
        return true;
    } catch (error) {
        console.error("Firebase initialization error:", error);
        return false;
    }
}

// Generate unique user ID
function generateUserId() {
    return 'user_' + Math.random().toString(36).substr(2, 9) + Date.now();
}

// Generate unique session ID
function generateSessionId() {
    return Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Create new group session
function createGroupSession() {
    if (!initFirebase()) {
        alert("Firebase not configured. Please add your Firebase credentials to script.js");
        return;
    }
    
    try {
        groupJournal.sessionId = generateSessionId();
        groupJournal.isHost = true;
        groupJournal.syncEnabled = true;
        
        // Initialize session in Firebase
        const sessionRef = firebase.database().ref(`sessions/${groupJournal.sessionId}`);
        sessionRef.set({
            createdAt: Date.now(),
            host: groupJournal.userId,
            evidence: app.evidence,
            filters: Array.from(app.activeFilters),
            timer: { dur: app.timer.dur }, // Only sync duration
            lastUpdate: Date.now()
        }).then(() => {
            console.log("Session created:", groupJournal.sessionId);
            
            // Show active session UI
            showActiveSession();
            
            // Start listening for updates from others
            listenToSession();
            
            // Start heartbeat
            startHeartbeat();
        }).catch(error => {
            console.error("Error creating session:", error);
            alert("Failed to create session. Please check your internet connection.");
            groupJournal.syncEnabled = false;
        });
    } catch (error) {
        console.error("Error in createGroupSession:", error);
        alert("Failed to create session. Please try again.");
    }
}

// Join existing session
function joinGroupSession(sessionId) {
    if (!sessionId || sessionId.trim() === '') {
        alert("Please enter a session ID");
        return;
    }
    
    if (!initFirebase()) {
        alert("Firebase not configured. Please add your Firebase credentials to script.js");
        return;
    }
    
    sessionId = sessionId.trim().toUpperCase();
    
    // Check if session exists
    const sessionRef = firebase.database().ref(`sessions/${sessionId}`);
    sessionRef.once('value', (snapshot) => {
        if (snapshot.exists()) {
            groupJournal.sessionId = sessionId;
            groupJournal.isHost = false;
            groupJournal.syncEnabled = true;
            
            console.log("Joined session:", sessionId);
            
            // Load current state from session - use spread to ensure deep copy
            const data = snapshot.val();
            app.evidence = {...data.evidence} || app.evidence;
            app.activeFilters = new Set(data.filters || []);
            if (data.timer && data.timer.dur) {
                app.timer.dur = data.timer.dur; // Only update duration
            }
            
            console.log("Loaded evidence state:", app.evidence);
            
            // Update UI
            renderFilters();
            updateBoard();
            // Update timer display
            if (ui.timerDisplay) {
                ui.timerDisplay.textContent = app.timer.dur;
            }
            
            // Show active session UI
            showActiveSession();
            
            // Start listening
            listenToSession();
            
            // Start heartbeat
            startHeartbeat();
            
            // Close modal
            ui.groupModal.close();
        } else {
            alert("Session not found. Please check the session ID.");
        }
    }).catch(error => {
        console.error("Error joining session:", error);
        alert("Failed to join session. Please check your internet connection.");
    });
}

// Join session from URL parameter
function checkUrlForSession() {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionParam = urlParams.get('session');
    
    if (sessionParam) {
        // Auto-join session from URL
        setTimeout(() => {
            joinGroupSession(sessionParam);
        }, 500);
    }
}

// Listen for session updates
function listenToSession() {
    if (!groupJournal.sessionId) return;
    
    const sessionRef = firebase.database().ref(`sessions/${groupJournal.sessionId}`);
    
    sessionRef.on('value', (snapshot) => {
        try {
            const data = snapshot.val();
            if (!data) return;
            
            // Prevent sync loops - but allow the first sync (when lastSync is 0)
            const timeSinceLastSync = Date.now() - groupJournal.lastSync;
            if (groupJournal.lastSync > 0 && timeSinceLastSync < 500) {
                console.log("Skipping sync to prevent loop");
                return;
            }
            
            console.log("Applying synced state:", data);
            
            // Update local state - use spread to ensure deep copy
            app.evidence = {...data.evidence};
            app.activeFilters = new Set(data.filters || []);
            if (data.timer && data.timer.dur) {
                app.timer.dur = data.timer.dur;
            }
            
            // Update UI - renderFilters will update the filter chips
            renderFilters();
            
            // updateBoard will update the evidence buttons and ghost list
            updateBoard();
            
            // Update timer display
            if (ui.timerDisplay) {
                ui.timerDisplay.textContent = app.timer.dur;
            }
            
            // Update user count
            updateUserCount();
        } catch (error) {
            console.error("Error processing session update:", error);
        }
    }, (error) => {
        console.error("Error listening to session:", error);
    });
}

// Sync local state to Firebase
function syncToFirebase() {
    if (!groupJournal.syncEnabled || !groupJournal.sessionId) return;
    
    // Debounce - wait 300ms before syncing to batch rapid changes
    if (groupJournal.syncTimeout) {
        clearTimeout(groupJournal.syncTimeout);
    }
    
    groupJournal.syncTimeout = setTimeout(() => {
        groupJournal.lastSync = Date.now();
        
        // Create a clean copy of evidence to send
        const evidenceToSync = {...app.evidence};
        
        console.log("Syncing to Firebase:", evidenceToSync);
        
        const sessionRef = firebase.database().ref(`sessions/${groupJournal.sessionId}`);
        sessionRef.update({
            evidence: evidenceToSync,
            filters: Array.from(app.activeFilters),
            timer: { dur: app.timer.dur },
            lastUpdate: Date.now()
        }).catch(error => {
            console.error("Sync error:", error);
        });
    }, 300);
}

// User heartbeat (track active users)
function startHeartbeat() {
    if (!groupJournal.sessionId || !groupJournal.userId) return;
    
    const userRef = firebase.database().ref(`sessions/${groupJournal.sessionId}/users/${groupJournal.userId}`);
    
    // Set initial presence
    userRef.set({
        lastSeen: Date.now()
    });
    
    // Update every 5 seconds
    setInterval(() => {
        if (groupJournal.syncEnabled) {
            userRef.update({ lastSeen: Date.now() });
        }
    }, 5000);
    
    // Clean up on disconnect
    userRef.onDisconnect().remove();
}

// Update user count display
function updateUserCount() {
    if (!groupJournal.sessionId) return;
    
    const usersRef = firebase.database().ref(`sessions/${groupJournal.sessionId}/users`);
    usersRef.once('value', (snapshot) => {
        const users = snapshot.val();
        if (!users) {
            document.getElementById('userCount').textContent = '1';
            return;
        }
        
        // Count active users (seen in last 15 seconds)
        const now = Date.now();
        const activeUsers = Object.values(users).filter(u => now - u.lastSeen < 15000);
        document.getElementById('userCount').textContent = activeUsers.length;
    });
}

// Show active session UI
function showActiveSession() {
    document.getElementById('groupContent').style.display = 'none';
    document.getElementById('activeSession').style.display = 'block';
    
    // Set session ID
    document.getElementById('currentSessionId').textContent = groupJournal.sessionId;
    
    // Set share link
    const shareUrl = `${window.location.origin}${window.location.pathname}?session=${groupJournal.sessionId}`;
    document.getElementById('shareLink').value = shareUrl;
    
    // Update user count
    updateUserCount();
    setInterval(updateUserCount, 5000);
    
    // Add active class to button
    document.getElementById('btnGroupJournal').classList.add('active');
}

// Leave session
function leaveGroupSession() {
    if (!groupJournal.sessionId) return;
    
    console.log("Leaving session:", groupJournal.sessionId);
    
    // Stop listening to Firebase updates
    const sessionRef = firebase.database().ref(`sessions/${groupJournal.sessionId}`);
    sessionRef.off(); // Remove all listeners
    
    // Remove user presence
    if (groupJournal.userId) {
        firebase.database().ref(`sessions/${groupJournal.sessionId}/users/${groupJournal.userId}`).remove();
    }
    
    // Clear any pending sync
    if (groupJournal.syncTimeout) {
        clearTimeout(groupJournal.syncTimeout);
        groupJournal.syncTimeout = null;
    }
    
    // Reset state
    groupJournal.sessionId = null;
    groupJournal.isHost = false;
    groupJournal.syncEnabled = false;
    
    // Reset UI
    document.getElementById('groupContent').style.display = 'block';
    document.getElementById('activeSession').style.display = 'none';
    document.getElementById('btnGroupJournal').classList.remove('active');
    
    // Remove session parameter from URL
    const url = new URL(window.location);
    url.searchParams.delete('session');
    window.history.replaceState({}, document.title, url);
    
    ui.groupModal.close();
}

// Copy share link to clipboard
function copyShareLink() {
    const shareLink = document.getElementById('shareLink');
    shareLink.select();
    shareLink.setSelectionRange(0, 99999); // For mobile
    
    navigator.clipboard.writeText(shareLink.value).then(() => {
        const btn = document.getElementById('btnCopyLink');
        btn.classList.add('copied');
        btn.textContent = 'Copied!';
        
        setTimeout(() => {
            btn.classList.remove('copied');
            btn.textContent = 'Copy';
        }, 2000);
    });
}

// Initialize Group Journal UI
function initGroupJournal() {
    console.log("Initializing Group Journal...");
    
    try {
        // Get UI elements
        ui.groupModal = document.getElementById('groupModal');
        
        if (!ui.groupModal) {
            console.error("Group modal not found!");
            return;
        }
        
        // Button to open modal
        const btnGroupJournal = document.getElementById('btnGroupJournal');
        if (btnGroupJournal) {
            btnGroupJournal.addEventListener('click', () => {
                console.log("Group Journal button clicked!");
                if (groupJournal.syncEnabled) {
                    // Already in session, show active session view
                    showActiveSession();
                }
                ui.groupModal.showModal();
            });
        } else {
            console.error("btnGroupJournal not found!");
        }
        
        // Close button
        const closeGroup = document.getElementById('closeGroup');
        if (closeGroup) {
            closeGroup.addEventListener('click', () => {
                ui.groupModal.close();
            });
        }
        
        // Create session button
        const btnCreateSession = document.getElementById('btnCreateSession');
        if (btnCreateSession) {
            btnCreateSession.addEventListener('click', createGroupSession);
        }
        
        // Join session button
        const btnJoinSession = document.getElementById('btnJoinSession');
        if (btnJoinSession) {
            btnJoinSession.addEventListener('click', () => {
                const sessionId = document.getElementById('joinSessionInput').value;
                joinGroupSession(sessionId);
            });
        }
        
        // Leave session button
        const btnLeaveSession = document.getElementById('btnLeaveSession');
        if (btnLeaveSession) {
            btnLeaveSession.addEventListener('click', () => {
                if (confirm('Are you sure you want to leave this group session?')) {
                    leaveGroupSession();
                }
            });
        }
        
        // Copy link button
        const btnCopyLink = document.getElementById('btnCopyLink');
        if (btnCopyLink) {
            btnCopyLink.addEventListener('click', copyShareLink);
        }
        
        // Join session on Enter key
        const joinSessionInput = document.getElementById('joinSessionInput');
        if (joinSessionInput) {
            joinSessionInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const sessionId = joinSessionInput.value;
                    joinGroupSession(sessionId);
                }
            });
        }
        
        // Check if URL has session parameter
        checkUrlForSession();
        
        console.log("Group Journal initialized successfully!");
    } catch (error) {
        console.error("Error initializing Group Journal:", error);
    }
}

// Modify the original updateBoard to sync
const originalUpdateBoard = updateBoard;
updateBoard = function() {
    originalUpdateBoard();
    if (groupJournal.syncEnabled) {
        syncToFirebase();
    }
};

