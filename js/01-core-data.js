// ============================================================
// PhasmoOS - 01-core-data.js
// Core game data: EVIDENCE, FILTERS, and the full GHOSTS database
// Split from script.js - load order matters (see index.html)
// ============================================================

// --- 1. CORE DATA ---
const EVIDENCE = [
    { id: 'emf', label: 'EMF 5', icon: '\uD83D\uDCF6', desc: "Must hit Level 5 (Red). Each ghost interaction has a 33% chance to produce EMF 5 if the ghost has this evidence." },
    { id: 'box', label: 'Box', icon: '\uD83D\uDCFB', desc: "Lights OFF in the ghost's room. Must be in the same room (or nearby for ghosts that respond to everyone). Deogen responds in any lighting." },
    { id: 'uv', label: 'UV', icon: '\uD83D\uDD90\uFE0F', desc: "Green handprints." },
    { id: 'orb', label: 'Orbs', icon: '\u2728', desc: "Floating dots in NV." },
    { id: 'writing', label: 'Writing', icon: '\uD83D\uDCD6', desc: "Ghost writes in book." },
    { id: 'freezing', label: 'Freeze', icon: '\u2744\uFE0F', desc: "Below 0°C on thermometer. Note: visible breath appears below 5°C for all ghosts - breath alone does NOT confirm freezing evidence." },
    { id: 'dots', label: 'D.O.T.S', icon: '\uD83D\uDFE2', desc: "Green silhouette." }
];

const FILTERS = [
    { id: 'fast', label: '\u26A1 Speed Change' },
    { id: 'early', label: '\u26A0\uFE0F Early Hunter' },
    { id: 'quiet', label: '\uD83E\uDD2B Quiet Footsteps (Myling)' },
    { id: 'guarantee', label: '\u2728 Guaranteed Ev' }
];

// Enhanced ghost descriptions with beginner-friendly explanations
// Replace the GHOSTS array in your script.js with this

const GHOSTS = [
    { 
        name: "Spirit", ev: ['emf','box','writing'], danger: "Med", hunt: "50%", speed: "1.7 m/s", blink: "Normal", forced: null,
        traits: ["Extended Smudge Protection"],
        desc: "The most common ghost with no special abilities. Often identified by process of elimination.",
        ability: "No unique hunt mechanics. When smudge sticks are used near it, the Spirit cannot hunt for at least 180 seconds (3 minutes). While any ghost can occasionally wait this long after a smudge, the Spirit will always wait at least this long - making it the only ghost where 180s is a guaranteed minimum, not just a possibility.",
        test: "Smudge Test: Use smudge sticks near the Spirit and start a timer. The Spirit will always wait at least <span class='hl-green'>180 seconds (3 minutes)</span> before hunting again - this is its guaranteed minimum. Important caveat: any ghost can occasionally wait this long by chance, so use the double-smudge method for reliability: wait ~160s, then smudge again. If it hunts within 60s of the second smudge, it's more than likely Spirit. Keep it in the forefront and select spirit by process of elimination",
        zeroEv: "The Spirit's ONLY tell is the smudge timer. Smudge it and time until the next hunt attempt - if it doesn't hunt for 3 full minutes, it's almost certainly a Spirit. Note: other ghosts CAN occasionally wait 180s too, so the double-smudge method is more reliable than a single test. The Spirit must always wait this long; for other ghosts it's just chance.",
        tags: [],
        speedStates: [{"label": "Normal", "speed": 1.7}]
    },
    { 
        name: "Wraith", ev: ['emf','box','dots'], danger: "Med", hunt: "50%", speed: "1.7 m/s", blink: "Normal", forced: null,
        traits: ["Teleports to Players", "Never Leaves Salt Footprints"],
        desc: "A floating ghost that can teleport to players. Never steps in or disturbs salt, making salt the key physical test.",
        ability: "Can randomly teleport to within 3 meters of any player, triggering an EMF 2 reading at the teleport location (EMF 5 if the Wraith has EMF5 as one of its evidence types). Because it floats, it never steps in or disturbs salt.",
        test: "Salt Test: Place salt piles across likely walking paths. If the ghost repeatedly walks through salt without disturbing it, suspect Wraith. If it disturbs salt, rule Wraith out. Also watch for EMF 2 spikes appearing near players in different rooms (teleport).",
        zeroEv: "Watch for random EMF readings appearing right next to a player in a room far from the active area - that's a Wraith teleport. In 0EV, use salt as a physical test: Wraith should not disturb it at all.",
        tags: ['guarantee'],
        speedStates: [{"label": "Normal", "speed": 1.7}]
    },
    { 
        name: "Phantom", ev: ['box','uv','dots'], danger: "Med", hunt: "50%", speed: "1.7 m/s", blink: "Slow", forced: null,
        traits: ["Drains Sanity Fast", "Vanishes in Photos"],
        desc: "Looking at a Phantom during events drains sanity faster (0.5%/s). Taking a photo (labelled 'Ghost') makes it disappear. Known bugs: can use its sanity-drain ability on dead players and on players outside the investigation area.",
        ability: "Drains about 0.5% sanity per second when you look directly at it during manifestations. During hunts, it stays invisible longer than other ghosts (slower blink rate = harder to see).",
        test: "Photo Test: Take a photo during a ghost event while the ghost is visible. If the ghost <span class='hl-green'>instantly disappears</span> from sight AND the photo is labelled as a 'Ghost' photo in the journal (meaning the photo registered correctly), it's a Phantom. If the photo is NOT labelled as Ghost, the Phantom will NOT disappear. The ghost model also won't appear in the photo itself even when it registers.",
        zeroEv: "Unusually fast sanity drain (0.5%/s) when looking directly at the ghost during events. Ghost blinking LESS during hunts than normal ghosts (stays invisible longer between flickers). Disappears when photographed during an event - but only if the photo is labelled as 'Ghost' in the journal; an unlabelled photo won't make it vanish.",
        tags: ['vis'],
        speedStates: [{"label": "Normal", "speed": 1.7}]
    },
    { 
        name: "Poltergeist", ev: ['box','uv','writing'], danger: "Med", hunt: "50%", speed: "1.7 m/s", blink: "Normal", forced: null,
        traits: ["Throws Many Objects", "Very Active"],
        desc: "Extremely active ghost that loves throwing objects. Can throw many items at once, draining sanity with each throw. Useless in empty rooms!",
        ability: "Can throw multiple objects simultaneously in a 3-meter radius. Each thrown item drains 2% sanity from nearby players. Will also throw objects during hunts. Completely ineffective in empty rooms with nothing to throw.",
        test: "Pile Test: Create a large pile of throwable objects in the active area. A Poltergeist can 'explode' the entire pile, scattering items in all directions simultaneously. Also note that Poltergeists throw objects <span class='hl-green'>every 0.5 seconds</span> during hunts (100% chance each interval) vs other ghosts' 50% chance - much more frequent mid-hunt throwing.",
        zeroEv: "Constant, heavy object throwing - way more than any other ghost. Objects thrown during hunts very frequently. Each thrown object drains 2% sanity from nearby players, so rapid sanity loss in a cluttered room is suspicious. Exploding a pile of objects is a near-certain tell.",
        tags: ['vis'],
        speedStates: [{"label": "Normal", "speed": 1.7}]
    },
    { 
        name: "Banshee", ev: ['uv','orb','dots'], danger: "Low", hunt: "Target Sanity", speed: "1.7 m/s", blink: "Normal", forced: null,
        traits: ["Targets One Player", "Unique Scream"],
        desc: "Chooses ONE player as its target at the start and focuses exclusively on them. Hunt threshold uses the target's sanity, NOT the team's average!",
        ability: "Randomly picks one player as its 'target' at contract start. Focuses exclusively on this player during hunts. Uses the TARGET's sanity only (not team average) to decide when to hunt. Target changes when any player dies (not just the target dying).",
        test: "Parabolic Mic Test: Point the parabolic mic toward the active area from outside. If you hear a <span class='hl-green'>unique screech/wail sound</span> that other ghosts don't make, it's a Banshee. Important: <strong>any player</strong> can hear this scream - not just the target. In multiplayer, watch who the ghost chases during hunts - it will always ignore other players and beeline for its target, even walking past them.",
        zeroEv: "In multiplayer: one player always gets chased regardless of others being nearby, and the ghost ignores everyone else mid-hunt. The Banshee hunts using its TARGET's sanity only (not team average), so it can hunt early if one player has low sanity even while others are high. Unique screech on parabolic mic is audible to any player, not just the target - a reliable solo and team tell.",
        tags: ['guarantee'],
        speedStates: [{"label": "Normal", "speed": 1.7}]
    },
    { 
        name: "Jinn", ev: ['emf','uv','freezing'], danger: "High", hunt: "50%", speed: "1.7-2.5 m/s", blink: "Normal", forced: null,
        traits: ["Fast with Power ON", "Sanity Zap", "Never Cuts Power"],
        desc: "Very territorial ghost that moves MUCH faster when the breaker is ON and it can see you. Can also drain 25% sanity instantly with an ability.",
        ability: "Speeds up to 2.5 m/s when chasing in line-of-sight and breaker is ON. Sanity drain ability: instantly drains 25% from nearby players when breaker is ON (gives EMF 2 or 5 at the breaker). Will never turn the breaker OFF. Bug: the 25% drain ability can affect players on the floor directly below (3m range is not blocked by floors).",
        test: "Breaker Speed Test: Make sure the breaker is ON. During a hunt, if the ghost is fast (2.5 m/s) when it has line-of-sight from more than 3m away, turn the breaker OFF. <span class='hl-green'>If it immediately drops to normal speed (1.7 m/s)</span>, it's a Jinn. Also watch for sudden 25% sanity drops near the ghost (breaker must be ON for this ability).",
        zeroEv: "Very fast movement during hunts ONLY when the breaker is on and the ghost has line-of-sight. Cutting the power removes the speed boost instantly. The Jinn will NEVER turn the breaker off itself (only other ghosts can do that). Sudden 25% sanity zaps near the ghost with the power on.",
        tags: ['fast'],
        speedStates: [{"label": "Normal", "speed": 1.7}, {"label": "LoS + breaker ON", "speed": 2.5}]
    },
    { 
        name: "Mare", ev: ['box','orb','writing'], danger: "Med", hunt: "60% (dark) / 40% (light)", speed: "1.7 m/s", blink: "Normal", forced: null,
        traits: ["Fears Light", "Hunts Earlier in Dark"],
        desc: "Empowered by darkness, weakened by light. Hunts earlier in dark rooms (60%) and less often in lit rooms (40%). Will immediately switch lights OFF and frequently breaks bulbs. Does not actively seek dark rooms - it roams more when its current room is lit, which tends to move it around frequently.",
        ability: "Hunts at 60% sanity in DARK rooms but only 40% sanity in LIT rooms. Will immediately turn lights OFF (within seconds) and frequently shatters bulbs. Can NEVER turn lights ON - only off. Note: despite patch notes suggesting otherwise, the Mare currently cannot turn TVs or computers on either (a known in-game bug).",
        test: "Light Test: Switch ON a light in the active area. A Mare can <span class='hl-red'>immediately</span> turn a light back off after you switch it on (within 4m, ~10s cooldown per light) - repeated instant shut-offs are a strong tell. It cannot turn lights ON, only off. You can also test hunt threshold: if it hunts in a lit room, sanity must be below 40%. In a dark room, it can hunt at 60%. Keeping the active area lit forces it to a lower hunt threshold.",
        zeroEv: "Lights constantly being switched off, never turned on. Frequent light bulb breaking events. Hunts earlier in dark areas (60%) but safer if room is lit (40% threshold). If a light goes off almost immediately after you turn it on, that's a strong Mare indicator. Note: the Mare does not seek out dark rooms - it simply roams more when its current room is lit, which tends to move it around the map frequently.",
        tags: ['early'],
        speedStates: [{"label": "Normal", "speed": 1.7}]
    },
    { 
        name: "Revenant", ev: ['orb','writing','freezing'], danger: "High", hunt: "50%", speed: "1.0 / 3.0 m/s", blink: "Normal", forced: null,
        traits: ["Fastest When Chasing", "Slowest When Searching"],
        desc: "The ultimate hunter. Extremely slow when searching (1.0 m/s) but VERY fast when it sees you (3.0 m/s). Nearly impossible to outrun once spotted!",
        ability: "Moves at only 1.0 m/s (very slow - half normal speed) when roaming without seeing anyone. Speeds up to 3.0 m/s (nearly twice normal!) when it has line of sight on a player. Constantly alternates between these speeds.",
        test: "Speed Listen Test: During a hunt, listen carefully when hidden. Revenant footsteps should be <span class='hl-green'>very slow (1 m/s)</span> when it hasn't seen anyone - slower than a walking player. If it suddenly spots someone, it rockets to 3 m/s (nearly sprint speed). This dramatic slow-to-fast switch is unmistakable. Break line of sight by ducking through a doorway to make it slow again.",
        zeroEv: "The Revenant's slow-to-fast speed pattern is its biggest tell: methodically slow footsteps while searching (1 m/s), then extremely rapid footsteps when it detects a player (3 m/s). If you hear it speed up without being chased, it may have detected voice or equipment. Never run in a straight line - always corner or break LoS.",
        tags: ['fast'],
        speedStates: [{"label": "Searching", "speed": 1.0}, {"label": "Chasing (LoS)", "speed": 3.0}]
    },
    { 
        name: "Shade", ev: ['emf','writing','freezing'], danger: "Low", hunt: "35%", speed: "1.7 m/s", blink: "Normal", forced: null,
        traits: ["Very Shy", "Low Activity", "Won't Hunt in Groups"],
        desc: "The shyest ghost. Very low activity. Cannot initiate a hunt OR produce an EMF reading while any player is in the same room as it - this checks the Shade’s current room, not necessarily its favourite room. Groups are safer, but note it can still reach into an occupied room to interact with objects from an adjacent room.",
        ability: "Cannot initiate a hunt if any player is in the same room as it - even a single player prevents it from hunting. Hunts at only 35% sanity (lower than normal 50%). Generally very passive with low activity levels.",
        test: "Group Test: Stay in the active area as a team with a crucifix placed. Let sanity drop below 35%. If the ghost refuses to hunt while any player is in the room despite very low sanity, it's very likely a Shade. You can also try placing a Ghost Writing book alone - the Shade won't write in it if a player is in the room. Send one person in solo to trigger activity.",
        zeroEv: "Extremely passive - very low ghost activity, rare interactions, barely any events. Will not hunt OR produce EMF readings while any player is in the same room (not just the favourite room). It can still reach into the room from an adjacent one to interact with objects. If activity is near-zero while players are present but picks up when the room is empty, suspect Shade.",
        tags: [],
        speedStates: [{"label": "Normal", "speed": 1.7}]
    },
    { 
        name: "Demon", ev: ['uv','writing','freezing'], danger: "Extreme", hunt: "70%", speed: "1.7 m/s", blink: "Normal", forced: null,
        traits: ["Very Aggressive", "Hunts Early", "Short Cooldown"],
        desc: "The most aggressive ghost. Hunts very early (70% sanity) and very frequently. Can rarely hunt at ANY sanity level! Use crucifixes early.",
        ability: "Hunts at 70% sanity (vs normal 50%). Only 20-second cooldown between hunts (vs normal 25s). Has a rare ability to hunt at 100% sanity (very rare). Smudging only prevents hunts for 60s (vs 90s). Crucifix range is 50% larger against Demon: T1 4.5m, T2 6m, T3 7.5m",
        test: "Smudge Timing Test: Smudge the ghost when it's NOT hunting and start a timer. If it initiates a hunt <span class='hl-red'>between 60–90 seconds</span> after being smudged (vs Spirit's 180s or standard 90s), it's likely a Demon. Also watch for hunts at high sanity (70%+) and very short gaps between consecutive hunts (20s cooldown vs 25s normally).",
        zeroEv: "Frequent hunts starting at 60–70% sanity - you'll be hunted way earlier than expected. Very short cooldown between hunts. Smudge blocks hunting for only 60 seconds. Crucifix range is 50% larger against Demon: T1 4.5m, T2 6m, T3 7.5m. Rare chance to hunt at ANY sanity, even 100%.",
        tags: ['early'],
        speedStates: [{"label": "Normal", "speed": 1.7}]
    },
    { 
        name: "Yurei", ev: ['orb','freezing','dots'], danger: "Med", hunt: "50%", speed: "1.7 m/s", blink: "Normal", forced: null,
        traits: ["Slams Doors Shut", "Heavy Sanity Drain"],
        desc: "Drains sanity by fully slamming doors shut. Each full door slam drains 15% sanity from nearby players.",
        ability: "Can smoothly close a door fully (without creaking) and drain 15% sanity from nearby players - this is its unique ability. Only ghost that can close EXIT doors outside of hunts. When smudged, trapped in its room for ~90 seconds. Bug: can partially open locker doors.",
        test: "Door Slam Test: Leave doors in the active area propped open at 45°. A Yurei can <span class='hl-green'>fully close a door in one smooth motion</span> (no creaking) while draining 15% sanity from nearby players - this is its unique ability. Critically, if a door leading OUTSIDE the building fully closes without a hunt or event, it's <span class='hl-green'>100% a Yurei</span> (only ghost that can do this). Smudge it and place motion sensors at doorways - if it doesn't leave for 90s, supports Yurei.",
        zeroEv: "A door closing fully and smoothly (not slamming during a hunt/event) with a sudden 15% sanity drop is the clearest tell. Watch exit/building doors especially - only Yurei closes those outside of hunts. After smudging, the Yurei gets temporarily confined to its room (use motion sensors to verify it hasn't left).",
        tags: [],
        speedStates: [{"label": "Normal", "speed": 1.7}]
    },
    { 
        name: "Oni", ev: ['emf','freezing','dots'], danger: "Med", hunt: "50%", speed: "1.7 m/s", blink: "Solid", forced: null,
        traits: ["Very Active", "More Visible", "No Airball Event"],
        desc: "Very active and physical ghost. More visible during hunts. Cannot do the 'airball' ghost event - seeing an airball proves it's NOT an Oni!",
        ability: "Cannot perform the 'airball' mist event (floating ball of mist). Drains 20% sanity during WALKING manifestation event collisions (vs 10% normal). Note: singing events only drain 10% due to a known bug. More visible during hunts - stays visible longer between flickers.",
        test: "Airball Elimination Test: Watch ghost events carefully. If you visually see the 'airball' event - a small ball of mist/smoke floating towards you - it is <span class='hl-red'>100% NOT an Oni</span>. Important: a walking ghost manifestation can also produce the same hiss sound as an airball event. You must actually <strong>see</strong> the floating mist ball, not just hear the hiss, before ruling out Oni. During hunts, the Oni stays visible longer between flickers - more visible than other ghosts. Very high object interaction rate is also a strong indicator.",
        zeroEv: "Very high activity level - lots of physical interactions and events. Cannot be an Oni if you visually see the airball mist event (the hiss sound alone is not enough - walking manifestation events make the same hiss). During hunts, the ghost stays visible longer than normal. Sanity drain: Oni drains 20% on WALKING manifestation collisions, but only 10% on SINGING events (a known in-game bug).",
        tags: ['vis'],
        speedStates: [{"label": "Normal", "speed": 1.7}]
    },
    { 
        name: "Yokai", ev: ['box','orb','dots'], danger: "Med", hunt: "80% (talking) / 50%", speed: "1.7 m/s", blink: "Normal", forced: null,
        traits: ["Triggered by Talking", "Deaf During Hunts"],
        desc: "Attracted to player voices. Talking near it can trigger hunts at 80% sanity! But during hunts, it's nearly deaf - only hears within 2.5m.",
        ability: "If players talk within 2m of the Yokai, it can hunt at 80% sanity instead of 50%. Silence = 50% threshold. During hunts, can only detect voice and electronics within 2.5m (vs 12m normal) - very easy to hide from if quiet. Bug: Music Box triggers Yokai event at standard 5m range instead of its 2.5m reduced range.",
        test: "Voice Detection Test: During a hunt, hide in a nearby room and talk loudly or use your microphone. A normal ghost can detect voices from <span class='hl-green'>12m away</span>. If the ghost completely ignores your talking from more than 2.5m, it's a Yokai. Also: if hunts start very early (80% sanity) when players are talking near the active area, that confirms it.",
        zeroEv: "Hunts at 80% sanity if players are talking within 2m of the ghost - stop talking near the active area! During hunts, Yokai can only hear voices and detect electronics within 2.5m (vs 12m normally), making it very easy to hide from if you stay quiet and keep distance. Both early hunts AND 'deaf' hunting behavior together strongly suggest Yokai.",
        tags: ['early'],
        speedStates: [{"label": "Normal", "speed": 1.7}]
    },
    { 
        name: "Hantu", ev: ['freezing','orb','uv'], danger: "Med", hunt: "50%", speed: "1.4-2.7 m/s", blink: "Normal", forced: "freezing",
        traits: ["Faster in Cold", "Visible Breath", "Never Turns Power ON"],
        desc: "Moves faster in cold rooms and slower in warm rooms. Shows visible freezing breath during hunts. Cannot turn the breaker ON.",
        ability: "Speed scales with temperature: 1.4 m/s in warm → 2.7 m/s in freezing. No LOS speed-up - Hantu moves at a fixed speed based on room temperature only. Shows visible frosty breath during hunts even in warm areas. Will never turn breaker ON (but can turn it OFF). Has double the normal chance to turn breaker off.",
        test: "Temperature Speed Test: Keep the breaker ON to warm rooms. During a hunt in a warm area, a Hantu slows to 1.4 m/s. In a freezing room it hits 2.7 m/s. Look for <span class='hl-green'>visible frosty breath clouds</span> emanating from the ghost during hunts - this is unique to Hantu and appears even in warm rooms. Hantu also has a doubled chance to turn the breaker OFF, but will NEVER turn it ON.",
        zeroEv: "Visible freezing breath clouds from the ghost during a hunt, even in warm areas - this is Hantu's most reliable visual tell. Speed varies dramatically between rooms: very fast in cold rooms, noticeably sluggish in warm ones. The breaker frequently goes off, but never gets turned back on by the ghost.",
        tags: ['fast'],
        speedStates: [{"label": "Warm room", "speed": 1.4}, {"label": "Freezing room", "speed": 2.7}]
    },
    { 
        name: "Goryo", ev: ['emf','uv','dots'], danger: "Low", hunt: "50%", speed: "1.7 m/s", blink: "Normal", forced: "dots",
        traits: ["D.O.T.S Camera Only", "Never Roams Far"],
        desc: "D.O.T.S evidence ONLY shows on video camera, never with naked eye. Very territorial - doesn't roam far from active area.",
        ability: "D.O.T.S silhouette is only visible through a video camera (not with your eyes directly). The effect only shows when no players are in the room. Goryo will not roam far from its favorite room.",
        test: "Camera-Only D.O.T.S Test (Nightmare/Insanity only): Set up a video camera pointing at the D.O.T.S projector and leave the room. If you see the D.O.T.S silhouette <span class='hl-green'>ONLY through the camera feed</span> and NEVER with your naked eyes, it's a Goryo. The D.O.T.S also only appears when NO players are in the room. <span class='hl-red'>IMPORTANT: On 0-evidence custom difficulty, Goryo shows NO D.O.T.S at all</span> - the only tell is that it never changes favourite room and only performs short roams.",
        zeroEv: "<span class='hl-red'>On 0 evidence: Goryo is nearly impossible to confirm.</span> D.O.T.S does not appear at all. Your only tells are behavioural: it will never change its active area, only performs short roams (use salt/motion sensors to observe), and has the highest interaction rate of any ghost. On Nightmare/Insanity (1–2 ev), if D.O.T.S is one of the shown evidences, it will ONLY appear via video camera - never to the naked eye.",
        tags: ['guarantee'],
        speedStates: [{"label": "Normal", "speed": 1.7}]
    },
    { 
        name: "Myling", ev: ['emf','writing','uv'], danger: "Med", hunt: "50%", speed: "1.7 m/s", blink: "Normal", forced: null,
        traits: ["Silent Footsteps", "More Vocal"],
        desc: "Has very short-range footsteps and vocals during hunts - only audible within 12m instead of the normal 20m. Can still make vocal sounds during hunts, they're just quieter at the same distance. Very vocal on parabolic mic outside of hunts.",
        ability: "Footsteps during hunts are only audible within 12 meters instead of the normal 20 meters. This makes it much harder to hear approaching. More vocal on the parabolic microphone.",
        test: "Flashlight Floor Test: Drop your flashlight on the floor during a hunt (it won't attract the ghost while on the floor). Watch for the flashlight flickering - the ghost is within 10m. If the flashlight IS flickering but you <span class='hl-green'>cannot hear footsteps yet</span>, it's a Myling (footsteps only audible within 12m vs 20m normally). Other ghosts: you'd hear footsteps well before seeing flickering.",
        zeroEv: "Both footsteps AND vocals during hunts are only audible within 12m instead of 20m - the ghost seems near-silent until it is already very close. Note: Myling CAN make vocal sounds during hunts like any other ghost, they're just shorter-ranged. Outside hunts, Mylings make paranormal sounds more frequently than average on the Parabolic Mic. The surprise close approach is the danger.",
        tags: ['quiet'],
        speedStates: [{"label": "Normal", "speed": 1.7}]
    },
    { 
        name: "Onryo", ev: ['box','orb','freezing'], danger: "High", hunt: "60% / 40% near flame", speed: "1.7 m/s", blink: "Normal", forced: null,
        traits: ["Fears Fire", "Flame-Triggered Hunts"],
        desc: "Fears fire - lit flames block hunts like crucifixes. But blowing out 3 flames triggers a hunt at ANY sanity level! Keep flames lit!",
        ability: "Lit flames within 4m block the Onryo's hunt attempts (like a crucifix - and the flame takes priority if both are in range). While within 4m of a flame its hunt threshold actually drops to 40%, but every blocked attempt blows the flame out. After 3 total blow-outs (tracked all game), it hunts at ANY sanity level. It can never light fires itself.",
        test: "Firelight Test: Light a Firelight near the active area. The Onryo treats flames like crucifixes - it <span class='hl-green'>cannot hunt while a flame is within 4m</span> of it. Instead, it blows the flame out. Every time it blows out a flame to stop a hunt, that counts toward a tally. On the <span class='hl-red'>3rd blow-out</span>, it hunts regardless of sanity. To confirm: place a crucifix AND a Firelight. If the flame blows out first instead of the crucifix burning, it's an Onryo.",
        zeroEv: "Flames being blown out regularly - each blow-out is a blocked hunt attempt. Keep 2 Firelights active so blow-out of one is blocked by the other. After 3 total blow-outs it can hunt at any sanity. Tier II Firelights (3 candles) are much more likely to be blown out (~96% combined chance) - but still count as 1 flame for Onryo mechanics. Onryo cannot light any fire sources.",
        tags: ['early'],
        speedStates: [{"label": "Normal", "speed": 1.7}]
    },
    { 
        name: "The Twins", ev: ['emf','box','freezing'], danger: "Med", hunt: "50%", speed: "1.53 / 1.87 m/s", blink: "Normal", forced: null,
        traits: ["Two Entities", "Alternating Speeds"],
        desc: "Actually a single ghost with two interaction ranges. Can interact in two places at once. When hunting, one twin is slower (1.53 m/s) and the other faster (1.87 m/s) - they alternate who hunts.",
        ability: "Two ghosts: Main entity (1.53 m/s, −10%) and Decoy entity (1.87 m/s, +10%). They alternate which one initiates hunts. Can interact with the environment in two different locations simultaneously.",
        test: "Dual Interaction Test: Watch for interactions happening in <span class='hl-green'>two different rooms simultaneously</span> - this is only possible with the Twins. You may see EMF readings or object interactions in different locations at once. During hunts, listen for speed variation across different hunts: one hunt may feel slower (~1.53 m/s) and the next faster (~1.87 m/s) - this is the two twins alternating who initiates.",
        zeroEv: "Simultaneous interactions in separate rooms are the clearest tell - e.g. a door in one room and an object in another moving at the same time. Hunt speeds will feel inconsistent across hunts (one is 10% slower, one is 10% faster than normal 1.7 m/s). The ghost may also start a hunt from an unexpected location far from the active area.",
        tags: ['fast'],
        speedStates: [{"label": "Slow twin", "speed": 1.5}, {"label": "Fast twin", "speed": 1.9}]
    },
    { 
        name: "Raiju", ev: ['emf','orb','dots'], danger: "High", hunt: "65% (electronics)", speed: "1.7-2.5 m/s", blink: "Normal", forced: null,
        traits: ["Powered by Electronics", "Early Hunter"],
        desc: "Powered by electronics! Moves faster near active equipment and can hunt earlier (65% vs 50%) when near electronics. Turn equipment OFF!",
        ability: "Near active electronics, moves at 2.5 m/s and can hunt at 65% sanity instead of 50%. Disrupts electronics from 15m away (vs normal 10m). Note: only held/carried electronics trigger the early hunt threshold - placed DOTS T2/T3, motion sensors, and sound sensors do not count.",
        test: "Electronics Speed Test: Leave active equipment (flashlights, D.O.T.S, EMF readers) on the floor in/near the active area. During a hunt, if the ghost moves at <span class='hl-green'>2.5 m/s near your gear</span> and slows to 1.7 m/s away from it, it's a Raiju. Also: you'll hear your heartbeat from 15m away (vs 10m for other ghosts) and electronics flicker from further away (15m vs 10m). Note: Most active electronics count. Exceptions include motion sensors, sound sensors, and DOTS projectors when thrown/held; don’t rely on those for a Raiju test.",
        zeroEv: "Very fast movement during hunts specifically near active electronics - slows noticeably when away from gear. Electronics flickering from unusually long range (15m). Can hunt at 65% sanity if active equipment is nearby. To slow it down, turn off flashlights and pick up any active equipment during a hunt.",
        tags: ['fast', 'early'],
        speedStates: [{"label": "Normal", "speed": 1.7}, {"label": "Near electronics", "speed": 2.5}]
    },
    { 
        name: "Obake", ev: ['emf','orb','uv'], danger: "Med", hunt: "50%", speed: "1.7 m/s", blink: "Shifting", forced: "uv",
        traits: ["Shapeshifter", "6-Finger Prints", "75% UV Chance"],
        desc: "A shapeshifter that can leave 6-finger handprints! Only has 75% chance to leave UV evidence (vs 100% normal). Changes appearance during hunts.",
        ability: "Can leave 6-finger handprints instead of normal 5-finger (rare but confirms it). Only 75% chance to leave UV evidence at all (vs 100% for others). Changes ghost model/appearance during hunts. UV evidence disappears faster (half the normal time).",
        test: "Fingerprint Test: Check all doors and surfaces the ghost touches for UV fingerprints. Obake has a <span class='hl-red'>75% chance to leave fingerprints</span> (not 100% like other ghosts), and those prints fade in ~30s instead of 60s. If you find a <span class='hl-green'>6-finger handprint</span> on a door, it's 100% confirmed Obake. During hunts, watch for the ghost's model briefly changing to a different ghost - this happens at least once per hunt.",
        zeroEv: "In 0EV, fingerprints and UV footprints do not appear. Watch the ghost during hunts: Obake can briefly blink/model-shift into a different ghost model. That visual tell is the useful no-evidence check.",
        tags: ['guarantee'],
        speedStates: [{"label": "Normal", "speed": 1.7}]
    },
    { 
        name: "The Mimic", ev: ['box','freezing','uv'], danger: "Low", hunt: "Variable", speed: "Variable", blink: "Variable", forced: "orb",
        traits: ["Copies Other Ghosts", "ALWAYS Has Ghost Orbs"],
        desc: "Copies/mimics other ghost types every 30s-2min. ALWAYS shows Ghost Orbs as a 4th evidence - if you have 3 evidence + Orbs, it's a Mimic!",
        ability: "Mimics the traits, abilities, speeds, and hunt patterns of other ghost types, changing which ghost it copies every 30 seconds to 2 minutes. ALWAYS has Ghost Orbs as forced 4th evidence.",
        test: "Fourth Evidence Test: The Mimic <span class='hl-green'>ALWAYS produces Ghost Orbs</span> as a fake 4th piece of evidence - even on 0-evidence custom runs. If you see Ghost Orbs AND collect 2 other evidence on Nightmare, suspect Mimic strongly. Watch for wildly inconsistent behavior across different hunts: speed, hunt threshold, and abilities all changing every 30s–2min as it mimics a new ghost type.",
        zeroEv: "Behaviour that dramatically shifts - one hunt it's slow, then fast, then it can't be hidden from, then hunts at high sanity. Mimic Orbs can still appear even when normal evidence is disabled, because they behave like part of The Mimic's ability rather than standard evidence. The mimic changes which ghost it copies every 30 seconds to 2 minutes (never mid-hunt). Cannot copy Goryo's camera-only D.O.T.S behaviour.",
        tags: ['fast', 'guarantee'],
        speedStates: [{"label": "Copies host ghost", "speed": 0}]
    },
    { 
        name: "Moroi", ev: ['box','writing','freezing'], danger: "High", hunt: "50%", speed: "1.5-2.25 m/s", blink: "Normal", forced: "box",
        traits: ["Curses Players", "Gets Faster at Low Sanity"],
        desc: "Getting a Spirit Box response CURSES you, doubling your sanity drain! Moves faster as sanity drops (1.5 → 2.25 m/s). Sanity pills slow it down!",
        ability: "Spirit Box response or parabolic microphone sounds curse the player, causing 2x passive sanity drain (lights won't stop it). Speed increases from 1.5 m/s at high sanity to 2.25 m/s at low sanity (up to 3.71 m/s with LOS at 0% sanity). Smudge blind during hunts lasts ~7 seconds (vs ~5s for other ghosts - a known bug vs intended 7.5s).",
        test: "Curse & Pill Test: Get a Spirit Box response (this curses the respondent). If that player's sanity drops even while standing in lit areas - which normally stops drain - they're cursed by a Moroi. <span class='hl-green'>Taking Sanity Pills removes the curse</span>. During a hunt, smudge it and count: Moroi is blinded for ~7 seconds (vs 5s for other ghosts). Also watch ghost speed across multiple hunts - it gets progressively faster as average sanity drops.",
        zeroEv: "Gets noticeably faster in later hunts as team sanity drops - can become one of the fastest ghosts in the game near 0% sanity (up to ~3.71 m/s). Spirit Box is forced evidence on Nightmare. If a cursed player's sanity drains in the light and pills fix it, that strongly points to Moroi.",
        tags: ['fast'],
        speedStates: [{"label": "High sanity", "speed": 1.5}, {"label": "Low sanity (base)", "speed": 2.25}, {"label": "0% sanity + LoS max", "speed": 3.71}]
    },
    { 
        name: "Deogen", ev: ['box','writing','dots'], danger: "High", hunt: "40%", speed: "0.4-3.0 m/s", blink: "Normal", forced: "box",
        traits: ["Always Knows Location", "Slow When Close"],
        desc: "Always knows exactly where you are - you CANNOT hide from it! Very fast from distance (3.0 m/s) but super slow up close (0.4 m/s). Loop it!",
        ability: "Always knows player locations - hiding in lockers/closets doesn't work! Moves at 3.0 m/s when far away but slows to 0.4 m/s when within a few meters. Spirit Box can be used anywhere (vs requiring dark).",
        test: "Hiding Test: Try to hide in a closet or locker. <span class='hl-red'>Deogen always knows where you are</span> - it will walk directly to your hiding spot every single time. Your only survival option is to loop it around furniture, as it slows to 0.4 m/s when within ~2.5m of a player. Spirit Box is forced evidence on Nightmare, and Deogen gives a <span class='hl-green'>unique heavy breathing/bull-like response</span> that sounds different from normal spirit box answers.",
        zeroEv: "Ghost immediately walking to exactly where every player is hiding - no hesitation, never searches. Very fast from distance (3 m/s) then dramatically slows to a crawl up close (0.4 m/s). Spirit Box gives a unique heavy breathing sound. Loop it around furniture to survive - never hide in enclosed spots.",
        tags: ['fast', 'guarantee'],
        speedStates: [{"label": "From distance", "speed": 3.0}, {"label": "Up close", "speed": 0.4}]
    },
    { 
        name: "Thaye", ev: ['orb','writing','dots'], danger: "High → Low", hunt: "75% → 15%", speed: "2.75 → 1.0 m/s", blink: "Normal", forced: null,
        traits: ["Ages Over Time", "Fast Early, Slow Late"],
        desc: "Ages every 1-2 minutes, becoming slower and less active over time. Starts VERY aggressive (75%, 2.75 m/s) but becomes weakest ghost! Wait it out!",
        ability: "Starts extremely active and dangerous: 75% hunt threshold and 2.75 m/s speed. Ages down every 1-2 minutes spent near players, eventually reaching 15% threshold and 1.0 m/s (slowest ghost). Can ask age on Ouija Board.",
        test: "Age Progression Test: Thaye starts young (75% hunt threshold, 2.75 m/s) and ages every 1–2 minutes <span class='hl-green'>only while players are nearby</span>. If the ghost was terrifyingly aggressive at the start but noticeably slowed and became passive over time, it's a Thaye. You can also ask its age on the Ouija Board - it will answer with a number. Older = slower and less active.",
        zeroEv: "Very high activity and aggression early on - hunts at 75% sanity and moves faster than almost any ghost. Activity and speed wind down progressively as time passes with players nearby. Late-game it may barely hunt at all (15% threshold, 1 m/s). Note: if no players are near the active area, it won't age - it stays young and dangerous.",
        tags: ['fast', 'early'],
        speedStates: [{"label": "Young (start)", "speed": 2.75}, {"label": "Aged (end)", "speed": 1.0}]
    }
    ,
    { 
        name: "Dayan", ev: ['emf','orb','box'], danger: "Med", hunt: "45/50/65%", speed: "1.2-2.25 m/s", blink: "Normal", forced: null,
        traits: ["Reacts to Movement", "Female Only", "Proximity Sensitive"],
        desc: "A hyper-vigilant spirit that reacts to player movement. Speeds up dramatically when players move near her (10m), but slows way down when standing still!",
        ability: "When >10m from all players: behaves like a normal ghost (1.7 m/s with standard LOS speed-up). Within 10m: speeds up to 2.25 m/s if any player moves, or slows to 1.2 m/s if everyone stands still. Hunt threshold changes by proximity/movement: 65% if a nearby player is moving, 45% if nearby players are standing still, and 50% when no players are within range. Always female model.",
        test: "Stand Still Test: During a hunt, when the ghost is within 10m, <span class='hl-green'>stop moving completely</span>. Dayan slows dramatically to 1.2 m/s when players stand still, and speeds back up to 2.25 m/s the instant you move. This speed swing is very noticeable. Also: if hunts start early while players are moving nearby (65% threshold while moving) but stop when you freeze, that's a strong tell. Dayan is always a female ghost model - check the name/gender in the journal.",
        zeroEv: "The most reliable test: freeze completely during a hunt. If the ghost abruptly slows to barely moving and then rockets forward again the instant you step, it's Dayan. Early hunts are more likely when players are moving near her, safer when standing still (45% vs 65% threshold). Always female gender - easy to check in journal.",
        tags: ['fast'],
        speedStates: [{"label": "Player still", "speed": 1.2}, {"label": "Player moving", "speed": 2.25}]
    }
    ,
    { 
        name: "Gallu", ev: ['emf','uv','box'], danger: "High", hunt: "40-60%", speed: "1.36-1.96 m/s", blink: "Normal", forced: null,
        traits: ["Hates Protective Equipment", "Three States", "Demon-Like"],
        desc: "Another form of demon that gets ENRAGED when you use protective equipment! Crucifixes and smudge sticks provoke it, making them less effective over time.",
        ability: "Cycles through three states. Normal (1.7 m/s, 50% threshold): triggered into Enraged by salt (2s delay), incense, or crucifix. Enraged (1.96 m/s, 60% threshold, only 4s incense blind, -2m crucifix range): does NOT disturb salt. Stays enraged until the hunt ends, then goes to Weakened. Weakened (1.36 m/s, 40% threshold, 6s incense blind, +1m crucifix range): DOES disturb salt. Returns to Normal via salt (3s delay), incense, or crucifix.",
        test: "Provocation Test: Use a crucifix or smudge sticks deliberately. A Gallu enters an <span class='hl-red'>Enraged state</span> (60% threshold, 1.96 m/s, only 4s incense blind) when protective gear is used - or when it steps in salt. After the enraged hunt ends it drops to a <span class='hl-green'>Weakened state</span> (40% threshold, 1.36 m/s, 6s incense blind). Key tell: in Enraged state the Gallu does NOT disturb salt. If it walks through a pile and leaves no impression, it is Enraged.",
        zeroEv: "Ghost becoming more aggressive after you use defensive equipment. Three-phase cycle: Normal → Enraged (after salt/smudge/crucifix) → Weakened (after enraged hunt ends). Key tells: Enraged = won't disturb salt + 4s incense blind; Weakened = disturbs salt + 6s incense blind. Multiplayer note: only the HOST reliably sees Gallu disturb salt - non-host players may see it walk through without disturbing it.",
        tags: ['early', 'fast'],
        speedStates: [{"label": "Normal", "speed": 1.7}, {"label": "Enraged", "speed": 1.96}, {"label": "Weakened", "speed": 1.36}]
    }
    ,
    { 
        name: "Obambo", ev: ['uv','writing','dots'], danger: "Med", hunt: "10% / 65%", speed: "1.45 / 1.96 m/s", blink: "Normal", forced: null,
        traits: ["Dual States", "Mood Swings", "Unpredictable"],
        desc: "Switches between calm and aggressive states on a timer. Calm: very chatty and easy to track, but barely hunts (10%, 1.45 m/s). Aggressive: much quieter ambient activity, but hunts early and fast (65%, 1.96 m/s)!",
        ability: "Always starts CALM, first switches 1 minute after an exit door is first opened, then flips every 2 minutes (it can even switch mid-hunt). Calm state: 10% hunt threshold, 1.45 m/s, and counter-intuitively <span class='hl-green'>very HIGH activity</span> - lots of interactions, easy to track. Aggressive state: 65% threshold, 1.96 m/s, but <span class='hl-red'>LOW ambient activity</span> - it goes quiet right when it's most dangerous. Hunts that start while aggressive are 20% shorter than normal.",
        test: "Phase Watch Test: Track the clock from when the front door first opens - 1 minute to the first flip, then every 2 minutes. An Obambo alternates between a <span class='hl-green'>Calm phase</span> (interaction-heavy, easy evidence, 10% threshold, 1.45 m/s) and an <span class='hl-red'>Aggressive phase</span> (eerily quiet but hunting at 65%, 1.96 m/s). Do NOT use 'it's quiet so we're safe' logic - quiet is the dangerous phase. A mid-hunt speed snap (slow to fast or back, for no visible reason) is a strong confirm, as is timing a fast-start hunt that ends ~20% early.",
        zeroEv: "Behaviour that cycles in waves on a repeating ~2-minute timer: an activity-heavy phase where it barely hunts, then a quiet phase where hunts start at surprisingly high sanity. Its speeds can be mistaken for The Twins (similar 1.45/1.96 split) - but if the ghost consistently starts hunts at the FAST speed while sanity is above ~50%, it's far more likely Obambo (Twins alternate randomly). A fast-start hunt that ends noticeably early (20% shorter) or a mid-hunt speed change with no cause is near-conclusive.",
        tags: ['fast', 'early'],
        speedStates: [{"label": "Calm phase", "speed": 1.45}, {"label": "Aggressive phase", "speed": 1.96}]
    }
        ,
    { 
        name: "Aswang", ev: ['freezing','writing','dots'], danger: "Med", hunt: "50%", speed: "1.53 → 2.53 m/s", blink: "Normal", forced: null,
        traits: ["Faster LoS Acceleration", "Cannot Kill Hidden Players", "Chase-Focused"],
        desc: "A chase-focused predator with the fastest line-of-sight acceleration in the game - but it physically cannot kill a player who is correctly hidden in an official hiding spot. Reaching one ends the hunt instantly.",
        ability: "Base hunt speed of 1.53 m/s (slightly slower than normal), ramping to a max LoS speed of ~2.53 m/s. Its acceleration rate is 1.5x the standard (0.075x base/s vs 0.05x), so it hits max speed in about <span class='hl-red'>8.7 seconds</span> of continuous line-of-sight instead of the usual ~13. Signature weakness: if it detects and reaches a player correctly hidden inside an OFFICIAL hiding spot (closet, locker, blockable spot), the hunt <span class='hl-green'>ends instantly</span> - it cannot kill hidden players. Caution: if a hunt ends this way, it starts its NEXT hunt by walking straight to that player's last hiding location.",
        test: "Hiding Spot Test: During a hunt, get its attention (incense helps) and duck into an official hiding spot like a closet or locker while it can see you. If the hunt <span class='hl-green'>ends the moment it reaches you</span>, it's 100% an Aswang - no other ghost does this. Unofficial spots (behind doors, dark corners) do NOT trigger this. Secondary tell: it builds to max chase speed noticeably faster than any other ghost (~8.7s of line-of-sight vs ~13s standard), so don't loop it for long.",
        zeroEv: "The hiding spot test works with zero evidence and is conclusive: a hunt that cancels itself the instant the ghost reaches your closet/locker is an Aswang. Speed profile: starts slightly slow (1.53 m/s, same base as Twins/Obambo) but accelerates on sight much faster than normal. Note: it CAN still kill you in unofficial hiding spots, and its weakness is disabled if custom difficulty sets hiding places to 0. After a cancelled hunt, expect it to check your old hiding spot first next hunt - hide somewhere new.",
        tags: ['fast'],
        speedStates: [{"label": "Base speed", "speed": 1.53}, {"label": "Max LoS (~8.7s)", "speed": 2.53}]
    }
    ,
    { 
        name: "Kormos", ev: ['orb','box','uv'], danger: "High", hunt: "50% / 70% if sprinting", speed: "1.7 / 2.21 m/s", blink: "Normal", forced: null,
        traits: ["Strong Hearing", "Nearly Blind", "Kills Through Walls"],
        desc: "A blind ghost that hunts entirely by sound. It cannot see still, silent players - but it kills anyone within 1.5m on the same floor, even through furniture and walls, so standing in its path is fatal.",
        ability: "The Kormos is blind: it can only gain line-of-sight if a player is within 5m with nothing in the way. Instead it hears footsteps - crouch-walking is detectable from 10m, walking from 15m, sprinting from 30m (same floor only) - plus voices and active electronics at normal ranges. When it hears something it moves to that sound at <span class='hl-red'>2.21 m/s</span> (1.3x its 1.7 m/s base) and can re-target to newer sounds every 5–10 seconds. Danger: with no line-of-sight it kills any player within <span class='hl-red'>1.5m on the same floor, ignoring walls and furniture</span>. Sprinting in the same room as it raises its hunt threshold from 50% to 70%. It cannot perform the mist-orb or chasing ghost events.",
        test: "Stand-Still Test: During a hunt, in an open area with an escape route, go completely still and silent with electronics off. A Kormos will walk straight past a player any other ghost would chase on sight. Confirm it's not a Banshee ignoring non-targets - in multiplayer, have everyone freeze at once, or make a deliberate sound and watch it beeline to that spot at increased speed. Don't do this test in a narrow corridor: it kills within 1.5m even without detecting you.",
        zeroEv: "Zero-evidence tells: hunts that ignore still, silent players entirely; the ghost visibly walking to where sounds were made rather than where players are; sudden speed-up (2.21 m/s) after any footstep, voice, or electronic noise. Hiding spots are unnecessary against a Kormos - standing still away from its route is safer, since it can kill through a closet wall if it wanders within 1.5m. Evidence trap: Kormos (Orbs + Spirit Box + UV) is one of three ghosts - with Hantu and Onryo - whose full evidence set does NOT rule out The Mimic (fake Orbs + Box + UV). Check for Freezing: if the room freezes, it's The Mimic.",
        tags: ['fast'],
        speedStates: [{"label": "No sound detected", "speed": 1.7}, {"label": "Moving to a sound", "speed": 2.21}]
    }
    ,
    { 
        name: "Deildegast", ev: ['emf','writing','dots'], danger: "High", hunt: "50%", speed: "3.0 → 0.4 m/s", blink: "Normal", forced: null,
        traits: ["Fastest Base Speed", "Slowed By Moved Items", "No LoS Acceleration"],
        desc: "A Norwegian boundary-stone ghost that starts every hunt at the fastest base speed in the game - but every unique item players move before a hunt slows it, all the way down to a crawl.",
        ability: "Starts each hunt at <span class='hl-red'>3.0 m/s</span> - the fastest base speed of any ghost - with NO line-of-sight acceleration, so it never speeds up on seeing you. Every unique prop moved or interacted with by players (<span class='hl-green'>including dead players</span>) outside of hunts cuts its next hunt speed by 0.1 m/s: throwables, light switches, the fuse box, taps - but NOT doors, cursed possessions, or your own equipment, and each item only counts once. 13 items brings it to standard speed (1.7 m/s); 26 items hits its floor of <span class='hl-green'>0.4 m/s</span>. The counter <span class='hl-red'>resets to 3.0 m/s after every hunt</span> (and when a crucifix burns), so keep moving items between hunts. It is also shier than most: only a 10% chance to touch doors and light switches (vs the usual 25%), and it can stay quiet and hidden longer than other ghosts.",
        test: "Litter Test: Between hunts, have the team pick up or throw 10–15 unique house items (dead teammates can help - their interactions count). If the next hunt is noticeably slow, then snaps back to a flat-out sprint the hunt after you stop littering, it's a Deildegast. Reverse check: touch nothing after a hunt - a ghost hunting at a constant, blistering 3.0 m/s with zero line-of-sight speed-up, even while staring right at you, is near-conclusive.",
        zeroEv: "A flat 3.0 m/s with no LoS acceleration is the giveaway: a Revenant only hits 3.0 m/s AFTER detecting someone (very slow otherwise), while a fresh Deildegast is 3.0 m/s constantly. Confirm by moving unique items between hunts and listening for the next hunt to slow - the effect resets after every hunt and every burned crucifix, so re-litter each time. At full speed it is faster than you: rely on crucifixes, incense, and tight loops early, and keep ~15 items moved between hunts to make it manageable. If activity goes dead quiet, reposition objects around the area to provoke it.",
        tags: ['fast'],
        speedStates: [{"label": "No items moved", "speed": 3.0}, {"label": "13 items moved (standard)", "speed": 1.7}, {"label": "26+ items moved (floor)", "speed": 0.4}]
    }
];

