// --- 1. CORE DATA ---
const EVIDENCE = [
    { id: 'emf', label: 'EMF 5', icon: '📶', desc: "Must hit Level 5 (Red). Each ghost interaction has a 33% chance to produce EMF 5 if the ghost has this evidence." },
    { id: 'box', label: 'Box', icon: '📻', desc: "Lights OFF in the ghost's room. Must be in the same room (or nearby for ghosts that respond to everyone). Deogen responds in any lighting." },
    { id: 'uv', label: 'UV', icon: '🖐️', desc: "Green handprints." },
    { id: 'orb', label: 'Orbs', icon: '✨', desc: "Floating dots in NV." },
    { id: 'writing', label: 'Writing', icon: '📖', desc: "Ghost writes in book." },
    { id: 'freezing', label: 'Freeze', icon: '❄️', desc: "Below 0°C on thermometer. Note: visible breath appears below 5°C for all ghosts — breath alone does NOT confirm freezing evidence." },
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
        ability: "No unique hunt mechanics. When smudge sticks are used near it, the Spirit cannot hunt for at least 180 seconds (3 minutes). While any ghost can occasionally wait this long after a smudge, the Spirit will always wait at least this long — making it the only ghost where 180s is a guaranteed minimum, not just a possibility.",
        test: "Smudge Test: Use smudge sticks near the Spirit and start a timer. The Spirit will always wait at least <span class='hl-green'>180 seconds (3 minutes)</span> before hunting again — this is its guaranteed minimum. Important caveat: any ghost can occasionally wait this long by chance, so use the double-smudge method for reliability: wait ~160s, then smudge again. If it hunts within 60s of the second smudge, it's more than likely Spirit. Keep it in the forefront and select spirit by process of elimination",
        zeroEv: "The Spirit's ONLY tell is the smudge timer. Smudge it and time until the next hunt attempt — if it doesn't hunt for 3 full minutes, it's almost certainly a Spirit. Note: other ghosts CAN occasionally wait 180s too, so the double-smudge method is more reliable than a single test. The Spirit must always wait this long; for other ghosts it's just chance.",
        tags: [],
        speedStates: [{"label": "Normal", "speed": 1.7}]
    },
    { 
        name: "Wraith", ev: ['emf','box','dots'], danger: "Med", hunt: "50%", speed: "1.7 m/s", blink: "Normal", forced: null,
        traits: ["Teleports to Players", "Never Leaves Salt Footprints"],
        desc: "A floating ghost that can teleport to players. NEVER leaves UV footprints when stepping in salt - easiest ghost to identify!",
        ability: "Can randomly teleport to within 3 meters of any player, triggering an EMF 2 reading at the teleport location (EMF 5 if the Wraith has EMF5 as one of its evidence types). Because it floats, it never leaves UV footprints in salt (all other ghosts do).",
        test: "Salt Test: Place salt piles in doorways in/near the ghost room. If salt gets disturbed (you'll see the pile scatter) but shining UV on it reveals <span class='hl-red'>NO footprints at all</span>, it's a confirmed Wraith — it's the ONLY ghost that won't leave UV prints in salt. All other ghosts do. Also watch for EMF 2 spikes appearing near players in different rooms (teleport).",
        zeroEv: "Watch for random EMF readings appearing right next to a player in a room far from the ghost room — that's a Wraith teleport. Disturbed salt piles with zero UV footprints when scanned is the cleanest tell.",
        tags: ['guarantee'],
        speedStates: [{"label": "Normal", "speed": 1.7}]
    },
    { 
        name: "Phantom", ev: ['box','uv','dots'], danger: "Med", hunt: "50%", speed: "1.7 m/s", blink: "Slow", forced: null,
        traits: ["Drains Sanity Fast", "Vanishes in Photos"],
        desc: "Looking at a Phantom during events drains sanity faster (0.5%/s). Taking a photo (labelled 'Ghost') makes it disappear. Known bugs: can use its sanity-drain ability on dead players and on players outside the investigation area.",
        ability: "Drains about 0.5% sanity per second when you look directly at it during manifestations. During hunts, it stays invisible longer than other ghosts (slower blink rate = harder to see).",
        test: "Photo Test: Take a photo during a ghost event while the ghost is visible. If the ghost <span class='hl-green'>instantly disappears</span> from sight AND the photo is labelled as a 'Ghost' photo in the journal (meaning the photo registered correctly), it's a Phantom. If the photo is NOT labelled as Ghost, the Phantom will NOT disappear. The ghost model also won't appear in the photo itself even when it registers.",
        zeroEv: "Unusually fast sanity drain (0.5%/s) when looking directly at the ghost during events. Ghost blinking LESS during hunts than normal ghosts (stays invisible longer between flickers). Disappears when photographed during an event — but only if the photo is labelled as 'Ghost' in the journal; an unlabelled photo won't make it vanish.",
        tags: ['vis'],
        speedStates: [{"label": "Normal", "speed": 1.7}]
    },
    { 
        name: "Poltergeist", ev: ['box','uv','writing'], danger: "Med", hunt: "50%", speed: "1.7 m/s", blink: "Normal", forced: null,
        traits: ["Throws Many Objects", "Very Active"],
        desc: "Extremely active ghost that loves throwing objects. Can throw many items at once, draining sanity with each throw. Useless in empty rooms!",
        ability: "Can throw multiple objects simultaneously in a 3-meter radius. Each thrown item drains 2% sanity from nearby players. Will also throw objects during hunts. Completely ineffective in empty rooms with nothing to throw.",
        test: "Pile Test: Create a large pile of throwable objects in the ghost room. A Poltergeist can 'explode' the entire pile, scattering items in all directions simultaneously. Also note that Poltergeists throw objects <span class='hl-green'>every 0.5 seconds</span> during hunts (100% chance each interval) vs other ghosts' 50% chance — much more frequent mid-hunt throwing.",
        zeroEv: "Constant, heavy object throwing — way more than any other ghost. Objects thrown during hunts very frequently. Each thrown object drains 2% sanity from nearby players, so rapid sanity loss in a cluttered room is suspicious. Exploding a pile of objects is a near-certain tell.",
        tags: ['vis'],
        speedStates: [{"label": "Normal", "speed": 1.7}]
    },
    { 
        name: "Banshee", ev: ['uv','orb','dots'], danger: "Low", hunt: "Target Sanity", speed: "1.7 m/s", blink: "Normal", forced: null,
        traits: ["Targets One Player", "Unique Scream"],
        desc: "Chooses ONE player as its target at the start and focuses exclusively on them. Hunt threshold uses the target's sanity, NOT the team's average!",
        ability: "Randomly picks one player as its 'target' at contract start. Focuses exclusively on this player during hunts. Uses the TARGET's sanity only (not team average) to decide when to hunt. Target changes when any player dies (not just the target dying).",
        test: "Parabolic Mic Test: Point the parabolic mic toward the ghost room from outside. If you hear a <span class='hl-green'>unique screech/wail sound</span> that other ghosts don't make, it's a Banshee. Important: <strong>any player</strong> can hear this scream — not just the target. In multiplayer, watch who the ghost chases during hunts — it will always ignore other players and beeline for its target, even walking past them.",
        zeroEv: "In multiplayer: one player always gets chased regardless of others being nearby, and the ghost ignores everyone else mid-hunt. The Banshee hunts using its TARGET's sanity only (not team average), so it can hunt early if one player has low sanity even while others are high. Unique screech on parabolic mic is audible to any player, not just the target — a reliable solo and team tell.",
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
        desc: "Empowered by darkness, weakened by light. Hunts earlier in dark rooms (60%) and less often in lit rooms (40%). Will immediately switch lights OFF and frequently breaks bulbs. Does not actively seek dark rooms — it roams more when its current room is lit, which tends to move it around frequently.",
        ability: "Hunts at 60% sanity in DARK rooms but only 40% sanity in LIT rooms. Will immediately turn lights OFF (within seconds) and frequently shatters bulbs. Can NEVER turn lights ON — only off. Note: despite patch notes suggesting otherwise, the Mare currently cannot turn TVs or computers on either (a known in-game bug).",
        test: "Light Test: Switch ON a light in the ghost room. A Mare can <span class='hl-red'>immediately</span> turn a light back off after you switch it on; repeated instant shut-offs are a strong tell. — it cannot turn lights ON, only off. You can also test hunt threshold: if it hunts in a lit room, sanity must be below 40%. In a dark room, it can hunt at 60%. Keeping the ghost room lit forces it to a lower hunt threshold.",
        zeroEv: "Lights constantly being switched off, never turned on. Frequent light bulb breaking events. Hunts earlier in dark areas (60%) but safer if room is lit (40% threshold). If a light goes off almost immediately after you turn it on, that's a strong Mare indicator. Note: the Mare does not seek out dark rooms — it simply roams more when its current room is lit, which tends to move it around the map frequently.",
        tags: ['early'],
        speedStates: [{"label": "Normal", "speed": 1.7}]
    },
    { 
        name: "Revenant", ev: ['orb','writing','freezing'], danger: "High", hunt: "50%", speed: "1.0 / 3.0 m/s", blink: "Normal", forced: null,
        traits: ["Fastest When Chasing", "Slowest When Searching"],
        desc: "The ultimate hunter. Extremely slow when searching (1.0 m/s) but VERY fast when it sees you (3.0 m/s). Nearly impossible to outrun once spotted!",
        ability: "Moves at only 1.0 m/s (very slow - half normal speed) when roaming without seeing anyone. Speeds up to 3.0 m/s (nearly twice normal!) when it has line of sight on a player. Constantly alternates between these speeds.",
        test: "Speed Listen Test: During a hunt, listen carefully when hidden. Revenant footsteps should be <span class='hl-green'>very slow (1 m/s)</span> when it hasn't seen anyone — slower than a walking player. If it suddenly spots someone, it rockets to 3 m/s (nearly sprint speed). This dramatic slow-to-fast switch is unmistakable. Break line of sight by ducking through a doorway to make it slow again.",
        zeroEv: "The Revenant's slow-to-fast speed pattern is its biggest tell: methodically slow footsteps while searching (1 m/s), then extremely rapid footsteps when it detects a player (3 m/s). If you hear it speed up without being chased, it may have detected voice or equipment. Never run in a straight line — always corner or break LoS.",
        tags: ['fast'],
        speedStates: [{"label": "Searching", "speed": 1.0}, {"label": "Chasing (LoS)", "speed": 3.0}]
    },
    { 
        name: "Shade", ev: ['emf','writing','freezing'], danger: "Low", hunt: "35%", speed: "1.7 m/s", blink: "Normal", forced: null,
        traits: ["Very Shy", "Low Activity", "Won't Hunt in Groups"],
        desc: "The shyest ghost. Very low activity. Cannot initiate a hunt OR produce an EMF reading while any player is in the same room. This checks the Shade’s current room, not necessarily the favourite room. It may still interact through walls from an adjacent room Safer in groups — but it can still reach back into the room to interact with objects from an adjacent room.",
        ability: "Cannot initiate a hunt if any player is in the same room as it — even a single player prevents it from hunting. Hunts at only 35% sanity (lower than normal 50%). Generally very passive with low activity levels.",
        test: "Group Test: Stay in the ghost room as a team with a crucifix placed. Let sanity drop below 35%. If the ghost refuses to hunt while any player is in the room despite very low sanity, it's very likely a Shade. You can also try placing a Ghost Writing book alone — the Shade won't write in it if a player is in the room. Send one person in solo to trigger activity.",
        zeroEv: "Extremely passive — very low ghost activity, rare interactions, barely any events. Will not hunt OR produce EMF readings while any player is in the same room (not just the favourite room). It can still reach into the room from an adjacent one to interact with objects. If activity is near-zero while players are present but picks up when the room is empty, suspect Shade.",
        tags: [],
        speedStates: [{"label": "Normal", "speed": 1.7}]
    },
    { 
        name: "Demon", ev: ['uv','writing','freezing'], danger: "Extreme", hunt: "70%", speed: "1.7 m/s", blink: "Normal", forced: null,
        traits: ["Very Aggressive", "Hunts Early", "Short Cooldown"],
        desc: "The most aggressive ghost. Hunts very early (70% sanity) and very frequently. Can rarely hunt at ANY sanity level! Use crucifixes early.",
        ability: "Hunts at 70% sanity (vs normal 50%). Only 20-second cooldown between hunts (vs normal 25s). Has a rare ability to hunt at 100% sanity (very rare). Smudging only prevents hunts for 60s (vs 90s). Crucifix range is 50% larger against Demon: T1 4.5m, T2 6m, T3 7.5m",
        test: "Smudge Timing Test: Smudge the ghost when it's NOT hunting and start a timer. If it initiates a hunt <span class='hl-red'>between 60–90 seconds</span> after being smudged (vs Spirit's 180s or standard 90s), it's likely a Demon. Also watch for hunts at high sanity (70%+) and very short gaps between consecutive hunts (20s cooldown vs 25s normally).",
        zeroEv: "Frequent hunts starting at 60–70% sanity — you'll be hunted way earlier than expected. Very short cooldown between hunts. Smudge blocks hunting for only 60 seconds. Crucifix range is 50% larger against Demon: T1 4.5m, T2 6m, T3 7.5m. Rare chance to hunt at ANY sanity, even 100%.",
        tags: ['early'],
        speedStates: [{"label": "Normal", "speed": 1.7}]
    },
    { 
        name: "Yurei", ev: ['orb','freezing','dots'], danger: "Med", hunt: "50%", speed: "1.7 m/s", blink: "Normal", forced: null,
        traits: ["Slams Doors Shut", "Heavy Sanity Drain"],
        desc: "Drains sanity by fully slamming doors shut. Each full door slam drains 15% sanity from nearby players.",
        ability: "Can smoothly close a door fully (without creaking) and drain 15% sanity from nearby players — this is its unique ability. Only ghost that can close EXIT doors outside of hunts. When smudged, trapped in its room for ~90 seconds. Bug: can partially open locker doors.",
        test: "Door Slam Test: Leave doors in the ghost room propped open at 45°. A Yurei can <span class='hl-green'>fully close a door in one smooth motion</span> (no creaking) while draining 15% sanity from nearby players — this is its unique ability. Critically, if a door leading OUTSIDE the building fully closes without a hunt or event, it's <span class='hl-green'>100% a Yurei</span> (only ghost that can do this). Smudge it and place motion sensors at doorways — if it doesn't leave for 90s, supports Yurei.",
        zeroEv: "A door closing fully and smoothly (not slamming during a hunt/event) with a sudden 15% sanity drop is the clearest tell. Watch exit/building doors especially — only Yurei closes those outside of hunts. After smudging, the Yurei gets temporarily confined to its room (use motion sensors to verify it hasn't left).",
        tags: [],
        speedStates: [{"label": "Normal", "speed": 1.7}]
    },
    { 
        name: "Oni", ev: ['emf','freezing','dots'], danger: "Med", hunt: "50%", speed: "1.7 m/s", blink: "Solid", forced: null,
        traits: ["Very Active", "More Visible", "No Airball Event"],
        desc: "Very active and physical ghost. More visible during hunts. Cannot do the 'airball' ghost event - seeing an airball proves it's NOT an Oni!",
        ability: "Cannot perform the 'airball' mist event (floating ball of mist). Drains 20% sanity during WALKING manifestation event collisions (vs 10% normal). Note: singing events only drain 10% due to a known bug. More visible during hunts — stays visible longer between flickers.",
        test: "Airball Elimination Test: Watch ghost events carefully. If you visually see the 'airball' event — a small ball of mist/smoke floating towards you — it is <span class='hl-red'>100% NOT an Oni</span>. Important: a walking ghost manifestation can also produce the same hiss sound as an airball event. You must actually <strong>see</strong> the floating mist ball, not just hear the hiss, before ruling out Oni. During hunts, the Oni stays visible longer between flickers — more visible than other ghosts. Very high object interaction rate is also a strong indicator.",
        zeroEv: "Very high activity level — lots of physical interactions and events. Cannot be an Oni if you visually see the airball mist event (the hiss sound alone is not enough — walking manifestation events make the same hiss). During hunts, the ghost stays visible longer than normal. Sanity drain: Oni drains 20% on WALKING manifestation collisions, but only 10% on SINGING events (a known in-game bug).",
        tags: ['vis'],
        speedStates: [{"label": "Normal", "speed": 1.7}]
    },
    { 
        name: "Yokai", ev: ['box','orb','dots'], danger: "Med", hunt: "80% (talking) / 50%", speed: "1.7 m/s", blink: "Normal", forced: null,
        traits: ["Triggered by Talking", "Deaf During Hunts"],
        desc: "Attracted to player voices. Talking near it can trigger hunts at 80% sanity! But during hunts, it's nearly deaf - only hears within 2.5m.",
        ability: "If players talk within 2m of the Yokai, it can hunt at 80% sanity instead of 50%. Silence = 50% threshold. During hunts, can only detect voice and electronics within 2.5m (vs 12m normal) — very easy to hide from if quiet. Bug: Music Box triggers Yokai event at standard 5m range instead of its 2.5m reduced range.",
        test: "Voice Detection Test: During a hunt, hide in a nearby room and talk loudly or use your microphone. A normal ghost can detect voices from <span class='hl-green'>12m away</span>. If the ghost completely ignores your talking from more than 2.5m, it's a Yokai. Also: if hunts start very early (80% sanity) when players are talking near the ghost room, that confirms it.",
        zeroEv: "Hunts at 80% sanity if players are talking within 2m of the ghost — stop talking near the ghost room! During hunts, Yokai can only hear voices and detect electronics within 2.5m (vs 12m normally), making it very easy to hide from if you stay quiet and keep distance. Both early hunts AND 'deaf' hunting behavior together strongly suggest Yokai.",
        tags: ['early'],
        speedStates: [{"label": "Normal", "speed": 1.7}]
    },
    { 
        name: "Hantu", ev: ['freezing','orb','uv'], danger: "Med", hunt: "50%", speed: "1.4-2.7 m/s", blink: "Normal", forced: "freezing",
        traits: ["Faster in Cold", "Visible Breath", "Never Turns Power ON"],
        desc: "Moves faster in cold rooms and slower in warm rooms. Shows visible freezing breath during hunts. Cannot turn the breaker ON.",
        ability: "Speed scales with temperature: 1.4 m/s in warm → 2.7 m/s in freezing. No LOS speed-up — Hantu moves at a fixed speed based on room temperature only. Shows visible frosty breath during hunts even in warm areas. Will never turn breaker ON (but can turn it OFF). Has double the normal chance to turn breaker off.",
        test: "Temperature Speed Test: Keep the breaker ON to warm rooms. During a hunt in a warm area, a Hantu slows to 1.4 m/s. In a freezing room it hits 2.7 m/s. Look for <span class='hl-green'>visible frosty breath clouds</span> emanating from the ghost during hunts — this is unique to Hantu and appears even in warm rooms. Hantu also has a doubled chance to turn the breaker OFF, but will NEVER turn it ON.",
        zeroEv: "Visible freezing breath clouds from the ghost during a hunt, even in warm areas — this is Hantu's most reliable visual tell. Speed varies dramatically between rooms: very fast in cold rooms, noticeably sluggish in warm ones. The breaker frequently goes off, but never gets turned back on by the ghost.",
        tags: ['fast'],
        speedStates: [{"label": "Warm room", "speed": 1.4}, {"label": "Freezing room", "speed": 2.7}]
    },
    { 
        name: "Goryo", ev: ['emf','uv','dots'], danger: "Low", hunt: "50%", speed: "1.7 m/s", blink: "Normal", forced: "dots",
        traits: ["D.O.T.S Camera Only", "Never Roams Far"],
        desc: "D.O.T.S evidence ONLY shows on video camera, never with naked eye. Very territorial - doesn't roam far from ghost room.",
        ability: "D.O.T.S silhouette is only visible through a video camera (not with your eyes directly). The effect only shows when no players are in the room. Goryo will not roam far from its favorite room.",
        test: "Camera-Only D.O.T.S Test (Nightmare/Insanity only): Set up a video camera pointing at the D.O.T.S projector and leave the room. If you see the D.O.T.S silhouette <span class='hl-green'>ONLY through the camera feed</span> and NEVER with your naked eyes, it's a Goryo. The D.O.T.S also only appears when NO players are in the room. <span class='hl-red'>IMPORTANT: On 0-evidence custom difficulty, Goryo shows NO D.O.T.S at all</span> — the only tell is that it never changes favourite room and only performs short roams.",
        zeroEv: "<span class='hl-red'>On 0 evidence: Goryo is nearly impossible to confirm.</span> D.O.T.S does not appear at all. Your only tells are behavioural: it will never change its ghost room, only performs short roams (use salt/motion sensors to observe), and has the highest interaction rate of any ghost. On Nightmare/Insanity (1–2 ev), if D.O.T.S is one of the shown evidences, it will ONLY appear via video camera — never to the naked eye.",
        tags: ['guarantee'],
        speedStates: [{"label": "Normal", "speed": 1.7}]
    },
    { 
        name: "Myling", ev: ['emf','writing','uv'], danger: "Med", hunt: "50%", speed: "1.7 m/s", blink: "Normal", forced: null,
        traits: ["Silent Footsteps", "More Vocal"],
        desc: "Has very short-range footsteps and vocals during hunts — only audible within 12m instead of the normal 20m. Can still make vocal sounds during hunts, they're just quieter at the same distance. Very vocal on parabolic mic outside of hunts.",
        ability: "Footsteps during hunts are only audible within 12 meters instead of the normal 20 meters. This makes it much harder to hear approaching. More vocal on the parabolic microphone.",
        test: "Flashlight Floor Test: Drop your flashlight on the floor during a hunt (it won't attract the ghost while on the floor). Watch for the flashlight flickering — the ghost is within 10m. If the flashlight IS flickering but you <span class='hl-green'>cannot hear footsteps yet</span>, it's a Myling (footsteps only audible within 12m vs 20m normally). Other ghosts: you'd hear footsteps well before seeing flickering.",
        zeroEv: "Both footsteps AND vocals during hunts are only audible within 12m instead of 20m — the ghost seems near-silent until it is already very close. Note: Myling CAN make vocal sounds during hunts like any other ghost, they're just shorter-ranged. Outside hunts, Mylings make paranormal sounds more frequently than average on the Parabolic Mic. The surprise close approach is the danger.",
        tags: ['quiet'],
        speedStates: [{"label": "Normal", "speed": 1.7}]
    },
    { 
        name: "Onryo", ev: ['box','orb','freezing'], danger: "High", hunt: "60% (Any w/ flames)", speed: "1.7 m/s", blink: "Normal", forced: null,
        traits: ["Fears Fire", "Flame-Triggered Hunts"],
        desc: "Fears fire - lit flames block hunts like crucifixes. But blowing out 3 flames triggers a hunt at ANY sanity level! Keep flames lit!",
        ability: "Lit candles/lighters within 4m prevent the Onryo from hunting (work like crucifixes). However, if it blows out 3 flames total (tracked across the whole game), it will hunt at ANY sanity level! Each flame blocks one hunt attempt.",
        test: "Firelight Test: Light a Firelight near the ghost room. The Onryo treats flames like crucifixes — it <span class='hl-green'>cannot hunt while a flame is within 4m</span> of it. Instead, it blows the flame out. Every time it blows out a flame to stop a hunt, that counts toward a tally. On the <span class='hl-red'>3rd blow-out</span>, it hunts regardless of sanity. To confirm: place a crucifix AND a Firelight. If the flame blows out first instead of the crucifix burning, it's an Onryo.",
        zeroEv: "Flames being blown out regularly — each blow-out is a blocked hunt attempt. Keep 2 Firelights active so blow-out of one is blocked by the other. After 3 total blow-outs it can hunt at any sanity. Tier II Firelights (3 candles) are much more likely to be blown out (~96% combined chance) — but still count as 1 flame for Onryo mechanics. Onryo cannot light any fire sources.",
        tags: ['early'],
        speedStates: [{"label": "Normal", "speed": 1.7}]
    },
    { 
        name: "The Twins", ev: ['emf','box','freezing'], danger: "Med", hunt: "50%", speed: "1.53 / 1.87 m/s", blink: "Normal", forced: null,
        traits: ["Two Entities", "Alternating Speeds"],
        desc: "Actually a single ghost with two interaction ranges. Can interact in two places at once. When hunting, one twin is slower (1.5 m/s) and the other faster (1.9 m/s) — they alternate who hunts.",
        ability: "Two ghosts: Main entity (1.5 m/s) and Decoy entity (1.9 m/s). They alternate which one hunts. Can interact with environment in two different locations simultaneously.",
        test: "Dual Interaction Test: Watch for interactions happening in <span class='hl-green'>two different rooms simultaneously</span> — this is only possible with the Twins. You may see EMF readings or object interactions in different locations at once. During hunts, listen for speed variation across different hunts: one hunt may feel slower (~1.53 m/s) and the next faster (~1.87 m/s) — this is the two twins alternating who initiates.",
        zeroEv: "Simultaneous interactions in separate rooms are the clearest tell — e.g. a door in one room and an object in another moving at the same time. Hunt speeds will feel inconsistent across hunts (one is 10% slower, one is 10% faster than normal 1.7 m/s). The ghost may also start a hunt from an unexpected location far from the ghost room.",
        tags: ['fast'],
        speedStates: [{"label": "Slow twin", "speed": 1.5}, {"label": "Fast twin", "speed": 1.9}]
    },
    { 
        name: "Raiju", ev: ['emf','orb','dots'], danger: "High", hunt: "65% (electronics)", speed: "1.7-2.5 m/s", blink: "Normal", forced: null,
        traits: ["Powered by Electronics", "Early Hunter"],
        desc: "Powered by electronics! Moves faster near active equipment and can hunt earlier (65% vs 50%) when near electronics. Turn equipment OFF!",
        ability: "Near active electronics, moves at 2.5 m/s and can hunt at 65% sanity instead of 50%. Disrupts electronics from 15m away (vs normal 10m). Note: only held/carried electronics trigger the early hunt threshold — placed DOTS T2/T3, motion sensors, and sound sensors do not count.",
        test: "Electronics Speed Test: Leave active equipment (flashlights, D.O.T.S, EMF readers) on the floor in/near the ghost room. During a hunt, if the ghost moves at <span class='hl-green'>2.5 m/s near your gear</span> and slows to 1.7 m/s away from it, it's a Raiju. Also: you'll hear your heartbeat from 15m away (vs 10m for other ghosts) and electronics flicker from further away (15m vs 10m). Note: Most active electronics count. Exceptions include motion sensors, sound sensors, and DOTS projectors when thrown/held; don’t rely on those for a Raiju test.",
        zeroEv: "Very fast movement during hunts specifically near active electronics — slows noticeably when away from gear. Electronics flickering from unusually long range (15m). Can hunt at 65% sanity if active equipment is nearby. To slow it down, turn off flashlights and pick up any active equipment during a hunt.",
        tags: ['fast', 'early'],
        speedStates: [{"label": "Normal", "speed": 1.7}, {"label": "Near electronics", "speed": 2.5}]
    },
    { 
        name: "Obake", ev: ['emf','orb','uv'], danger: "Med", hunt: "50%", speed: "1.7 m/s", blink: "Shifting", forced: "uv",
        traits: ["Shapeshifter", "6-Finger Prints", "75% UV Chance"],
        desc: "A shapeshifter that can leave 6-finger handprints! Only has 75% chance to leave UV evidence (vs 100% normal). Changes appearance during hunts.",
        ability: "Can leave 6-finger handprints instead of normal 5-finger (rare but confirms it). Only 75% chance to leave UV evidence at all (vs 100% for others). Changes ghost model/appearance during hunts. UV evidence disappears faster (half the normal time).",
        test: "Fingerprint Test: Check all doors and surfaces the ghost touches for UV fingerprints. Obake has a <span class='hl-red'>75% chance to leave fingerprints</span> (not 100% like other ghosts), and those prints fade in ~30s instead of 60s. If you find a <span class='hl-green'>6-finger handprint</span> on a door, it's 100% confirmed Obake. During hunts, watch for the ghost's model briefly changing to a different ghost — this happens at least once per hunt.",
        zeroEv: "Fingerprints appearing less often than expected or fading very quickly (half the normal time). Watching the ghost during a hunt and seeing its model flicker into a different ghost type. A 6-fingered handprint is a guaranteed Obake. UV is forced evidence on Nightmare so it will always appear even if reduced evidence is selected.",
        tags: ['guarantee'],
        speedStates: [{"label": "Normal", "speed": 1.7}]
    },
    { 
        name: "The Mimic", ev: ['box','freezing','uv'], danger: "Low", hunt: "Variable", speed: "Variable", blink: "Variable", forced: "orb",
        traits: ["Copies Other Ghosts", "ALWAYS Has Ghost Orbs"],
        desc: "Copies/mimics other ghost types every 30s-2min. ALWAYS shows Ghost Orbs as a 4th evidence - if you have 3 evidence + Orbs, it's a Mimic!",
        ability: "Mimics the traits, abilities, speeds, and hunt patterns of other ghost types, changing which ghost it copies every 30 seconds to 2 minutes. ALWAYS has Ghost Orbs as forced 4th evidence.",
        test: "Fourth Evidence Test: The Mimic <span class='hl-green'>ALWAYS produces Ghost Orbs</span> as a fake 4th piece of evidence — even on 0-evidence custom runs. If you see Ghost Orbs AND collect 2 other evidence on Nightmare, suspect Mimic strongly. Watch for wildly inconsistent behavior across different hunts: speed, hunt threshold, and abilities all changing every 30s–2min as it mimics a new ghost type.",
        zeroEv: "Behaviour that dramatically shifts — one hunt it's slow, then fast, then it can't be hidden from, then hunts at high sanity. Ghost Orbs will always be present even on Nightmare. The mimic changes which ghost it copies every 30 seconds to 2 minutes (never mid-hunt). Cannot copy Goryo's camera-only D.O.T.S behaviour.",
        tags: ['guarantee'],
        speedStates: [{"label": "Copies host ghost", "speed": 0}]
    },
    { 
        name: "Moroi", ev: ['box','writing','freezing'], danger: "High", hunt: "50%", speed: "1.5-2.25 m/s", blink: "Normal", forced: "box",
        traits: ["Curses Players", "Gets Faster at Low Sanity"],
        desc: "Getting a Spirit Box response CURSES you, doubling your sanity drain! Moves faster as sanity drops (1.5 → 2.25 m/s). Sanity pills slow it down!",
        ability: "Spirit Box response or parabolic microphone sounds curse the player, causing 2x passive sanity drain (lights won't stop it). Speed increases from 1.5 m/s at high sanity to 2.25 m/s at low sanity (up to 3.71 m/s with LOS at 0% sanity). Smudge blind during hunts lasts ~7 seconds (vs ~5s for other ghosts — a known bug vs intended 7.5s).",
        test: "Curse & Pill Test: Get a Spirit Box response (this curses the respondent). If that player's sanity drops even while standing in lit areas — which normally stops drain — they're cursed by a Moroi. <span class='hl-green'>Taking Sanity Pills removes the curse</span>. During a hunt, smudge it and count: Moroi is blinded for ~7 seconds (vs 5s for other ghosts). Also watch ghost speed across multiple hunts — it gets progressively faster as average sanity drops.",
        zeroEv: "Gets noticeably faster in later hunts as team sanity drops — can become one of the fastest ghosts in the game near 0% sanity (up to ~3.71 m/s). Spirit Box is forced evidence on Nightmare. If a cursed player's sanity drains in the light and pills fix it, that strongly points to Moroi.",
        tags: ['fast'],
        speedStates: [{"label": "High sanity", "speed": 1.5}, {"label": "Low sanity (base)", "speed": 2.25}, {"label": "0% sanity + LoS max", "speed": 3.71}]
    },
    { 
        name: "Deogen", ev: ['box','writing','dots'], danger: "High", hunt: "40%", speed: "0.4-3.0 m/s", blink: "Normal", forced: "box",
        traits: ["Always Knows Location", "Slow When Close"],
        desc: "Always knows exactly where you are - you CANNOT hide from it! Very fast from distance (3.0 m/s) but super slow up close (0.4 m/s). Loop it!",
        ability: "Always knows player locations - hiding in lockers/closets doesn't work! Moves at 3.0 m/s when far away but slows to 0.4 m/s when within a few meters. Spirit Box can be used anywhere (vs requiring dark).",
        test: "Hiding Test: Try to hide in a closet or locker. <span class='hl-red'>Deogen always knows where you are</span> — it will walk directly to your hiding spot every single time. Your only survival option is to loop it around furniture, as it slows to 0.4 m/s when within ~2.5m of a player. Spirit Box is forced evidence on Nightmare, and Deogen gives a <span class='hl-green'>unique heavy breathing/bull-like response</span> that sounds different from normal spirit box answers.",
        zeroEv: "Ghost immediately walking to exactly where every player is hiding — no hesitation, never searches. Very fast from distance (3 m/s) then dramatically slows to a crawl up close (0.4 m/s). Spirit Box gives a unique heavy breathing sound. Loop it around furniture to survive — never hide in enclosed spots.",
        tags: ['fast', 'guarantee'],
        speedStates: [{"label": "From distance", "speed": 3.0}, {"label": "Up close", "speed": 0.4}]
    },
    { 
        name: "Thaye", ev: ['orb','writing','dots'], danger: "High → Low", hunt: "75% → 15%", speed: "2.75 → 1.0 m/s", blink: "Normal", forced: null,
        traits: ["Ages Over Time", "Fast Early, Slow Late"],
        desc: "Ages every 1-2 minutes, becoming slower and less active over time. Starts VERY aggressive (75%, 2.75 m/s) but becomes weakest ghost! Wait it out!",
        ability: "Starts extremely active and dangerous: 75% hunt threshold and 2.75 m/s speed. Ages down every 1-2 minutes spent near players, eventually reaching 15% threshold and 1.0 m/s (slowest ghost). Can ask age on Ouija Board.",
        test: "Age Progression Test: Thaye starts young (75% hunt threshold, 2.75 m/s) and ages every 1–2 minutes <span class='hl-green'>only while players are nearby</span>. If the ghost was terrifyingly aggressive at the start but noticeably slowed and became passive over time, it's a Thaye. You can also ask its age on the Ouija Board — it will answer with a number. Older = slower and less active.",
        zeroEv: "Very high activity and aggression early on — hunts at 75% sanity and moves faster than almost any ghost. Activity and speed wind down progressively as time passes with players nearby. Late-game it may barely hunt at all (15% threshold, 1 m/s). Note: if no players are near the ghost room, it won't age — it stays young and dangerous.",
        tags: ['fast', 'early'],
        speedStates: [{"label": "Young (start)", "speed": 2.75}, {"label": "Aged (end)", "speed": 1.0}]
    }
    ,
    { 
        name: "Dayan", ev: ['emf','orb','box'], danger: "Med", hunt: "45-60%", speed: "1.2-2.25 m/s", blink: "Normal", forced: null,
        traits: ["Reacts to Movement", "Female Only", "Proximity Sensitive"],
        desc: "A hyper-vigilant spirit that reacts to player movement. Speeds up dramatically when players move near her (10m), but slows way down when standing still!",
        ability: "When >10m from all players: behaves like a normal ghost (1.7 m/s with standard LOS speed-up). Within 10m: speeds up to 2.25 m/s if any player moves, or slows to 1.2 m/s if everyone stands still. Hunt threshold increases to 60% while players move near her, decreases to 45% when standing still. Always female model.",
        test: "Stand Still Test: During a hunt, when the ghost is within 10m, <span class='hl-green'>stop moving completely</span>. Dayan slows dramatically to 1.2 m/s when players stand still, and speeds back up to 2.25 m/s the instant you move. This speed swing is very noticeable. Also: if hunts start early while players are walking around (60% threshold while moving) but stop when you freeze, that's a strong tell. Dayan is always a female ghost model — check the name/gender in the journal.",
        zeroEv: "The most reliable test: freeze completely during a hunt. If the ghost abruptly slows to barely moving and then rockets forward again the instant you step, it's Dayan. Early hunts are more likely when players are moving near her, safer when standing still (45% vs 60% threshold). Always female gender — easy to check in journal.",
        tags: ['fast'],
        speedStates: [{"label": "Player still", "speed": 1.2}, {"label": "Player moving", "speed": 2.25}]
    }
    ,
    { 
        name: "Gallu", ev: ['emf','uv','box'], danger: "High", hunt: "40-60%", speed: "1.36-1.96 m/s", blink: "Normal", forced: null,
        traits: ["Hates Protective Equipment", "Three States", "Demon-Like"],
        desc: "Another form of demon that gets ENRAGED when you use protective equipment! Crucifixes and smudge sticks provoke it, making them less effective over time.",
        ability: "Cycles through three states. Normal (1.7 m/s, 50% threshold): triggered into Enraged by salt (2s delay), incense, or crucifix. Enraged (1.96 m/s, 60% threshold, only 4s incense blind, -2m crucifix range): does NOT disturb salt. Stays enraged until the hunt ends, then goes to Weakened. Weakened (1.36 m/s, 40% threshold, 6s incense blind, +1m crucifix range): DOES disturb salt. Returns to Normal via salt (3s delay), incense, or crucifix.",
        test: "Provocation Test: Use a crucifix or smudge sticks deliberately. A Gallu enters an <span class='hl-red'>Enraged state</span> (60% threshold, 1.96 m/s, only 4s incense blind) when protective gear is used — or when it steps in salt. After the enraged hunt ends it drops to a <span class='hl-green'>Weakened state</span> (40% threshold, 1.36 m/s, 6s incense blind). Key tell: in Enraged state the Gallu does NOT disturb salt. If it walks through a pile and leaves no impression, it is Enraged.",
        zeroEv: "Ghost becoming more aggressive after you use defensive equipment. Three-phase cycle: Normal → Enraged (after salt/smudge/crucifix) → Weakened (after enraged hunt ends). Key tells: Enraged = won't disturb salt + 4s incense blind; Weakened = disturbs salt + 6s incense blind. Multiplayer note: only the HOST reliably sees Gallu disturb salt — non-host players may see it walk through without disturbing it.",
        tags: ['early', 'fast'],
        speedStates: [{"label": "Normal", "speed": 1.7}, {"label": "Enraged", "speed": 1.96}, {"label": "Weakened", "speed": 1.36}]
    }
    ,
    { 
        name: "Obambo", ev: ['uv','writing','dots'], danger: "Med", hunt: "10% / 65%", speed: "1.45 / 1.96 m/s", blink: "Normal", forced: null,
        traits: ["Dual States", "Mood Swings", "Unpredictable"],
        desc: "Switches between calm and aggressive states every ~2 minutes! When calm: barely hunts (10%, 1.45 m/s). When aggressive: hunts often (65%, 1.96 m/s)!",
        ability: "Alternates between two states approximately every 2 minutes. Calm state: 10% hunt threshold, 1.45 m/s speed, very low activity. Aggressive state: 65% hunt threshold, 1.96 m/s speed, high activity. Can switch states mid-hunt!",
        test: "Phase Watch Test: Observe the ghost over at least 5–6 minutes. An Obambo switches between a <span class='hl-green'>Calm phase</span> (barely interacts, hunt threshold 10%, 1.45 m/s) and an <span class='hl-red'>Aggressive phase</span> (high activity, 65% threshold, 1.96 m/s) roughly every 2 minutes. If the ghost flip-flops dramatically between near-inactivity and intense hunting with no apparent cause, it's Obambo. It can also switch states mid-hunt.",
        zeroEv: "Wildly inconsistent behaviour that cycles in waves — very passive for a couple minutes, then suddenly very aggressive and hunting frequently, then passive again. Easy to mistake for Shade during calm phases or for an early hunter during aggressive phases. The key is the pattern repeating. If you've been watching long enough to see two full activity swings, it's almost certainly Obambo.",
        tags: ['early'],
        speedStates: [{"label": "Calm phase", "speed": 1.45}, {"label": "Aggressive phase", "speed": 1.96}]
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


// ─── FOOTSTEP TEMPO ENGINE ────────────────────────────────────────────────
const TempoEngine = (() => {
    let ctx = null;
    let tickTimer = null;
    let autoStopTimer = null;
    let activeButton = null;
    let beatIndicator = null;
    let running = false;

    // BPM formula from reference cheat sheet (default surface, 1.0 multiplier):
    // BPM = 60 / ((1/speed) - 0.075)
    function speedToBpm(speed) {
        if (!speed || speed <= 0) return null;
        const inv = (1 / speed) - 0.075;
        if (inv <= 0) return null;
        return 60 / inv;
    }

    function getIntervalMs(speed) {
        const bpm = speedToBpm(speed);
        if (!bpm) return null;
        return (60 / bpm) * 1000;
    }

    function ensureCtx() {
        if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
        if (ctx.state === 'suspended') ctx.resume();
    }

    function playClick() {
        ensureCtx();
        const t = ctx.currentTime;

        // Two-layer synthetic footstep click
        const osc1 = ctx.createOscillator();
        const g1   = ctx.createGain();
        osc1.type = 'square';
        osc1.frequency.setValueAtTime(900, t);
        osc1.frequency.exponentialRampToValueAtTime(180, t + 0.045);
        g1.gain.setValueAtTime(0.16, t);
        g1.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
        osc1.connect(g1).connect(ctx.destination);
        osc1.start(t); osc1.stop(t + 0.07);

        const osc2 = ctx.createOscillator();
        const g2   = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(100, t);
        g2.gain.setValueAtTime(0.22, t);
        g2.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
        osc2.connect(g2).connect(ctx.destination);
        osc2.start(t); osc2.stop(t + 0.09);

        // Flash beat indicator
        if (beatIndicator) {
            beatIndicator.classList.add('beat-flash');
            setTimeout(() => beatIndicator && beatIndicator.classList.remove('beat-flash'), 80);
        }
    }

    // Recursive setTimeout for drift-corrected timing
    // Measures actual elapsed time and compensates on the next beat
    function scheduleTick(intervalMs, expectedAt) {
        if (!running) return;
        playClick();
        const now = performance.now();
        const nextExpected = expectedAt + intervalMs;
        const delay = Math.max(10, nextExpected - now);
        tickTimer = setTimeout(() => scheduleTick(intervalMs, nextExpected), delay);
    }

    function start(speed, btn) {
        stop();
        const ms = getIntervalMs(speed);
        if (!ms) return; // Variable speed ghost — nothing to play

        running = true;
        activeButton = btn;
        if (btn) {
            btn.classList.add('tempo-btn-active');
            btn.querySelector('.tempo-btn-icon').textContent = '■';
        }

        scheduleTick(ms, performance.now());

        // Auto-stop after 12 seconds
        autoStopTimer = setTimeout(() => stop(), 12000);
    }

    function stop() {
        running = false;
        if (tickTimer) { clearTimeout(tickTimer); tickTimer = null; }
        if (autoStopTimer) { clearTimeout(autoStopTimer); autoStopTimer = null; }
        if (activeButton) {
            activeButton.classList.remove('tempo-btn-active');
            const icon = activeButton.querySelector('.tempo-btn-icon');
            if (icon) icon.textContent = '▶';
            activeButton = null;
        }
    }

    function toggle(speed, btn) {
        if (activeButton === btn && running) {
            stop();
        } else {
            start(speed, btn);
        }
    }

    function setBeatIndicator(el) { beatIndicator = el; }
    function isActive() { return running; }
    function speedToBpmRounded(speed) {
        const bpm = speedToBpm(speed);
        return bpm ? Math.round(bpm) : null;
    }

    return { toggle, stop, speedToBpm, speedToBpmRounded, setBeatIndicator, isActive };
})();

// Stop tempo when modal closes
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('ghostModal');
    if (modal) {
        modal.addEventListener('close', () => TempoEngine.stop());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) TempoEngine.stop();
        });
    }
});
// ─────────────────────────────────────────────────────────────────────────

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
    TempoEngine.stop();
    document.getElementById('mName').textContent = g.name;
    const forcedNote = g.forced ? `<div style="margin-top:8px; padding:6px 10px; background:rgba(6,182,212,0.1); border:1px solid rgba(6,182,212,0.3); border-radius:6px; font-size:0.82rem; color:var(--acc-cyan);">⚡ <strong>Guaranteed Evidence:</strong> This ghost <em>always</em> shows <strong>${g.forced.toUpperCase()}</strong> even on Nightmare/Insanity.</div>` : '';

    // Build speed buttons for each state
    const states = g.speedStates || [{ label: 'Normal', speed: 1.7 }];
    const tempoButtons = states.map((s, i) => {
        const bpm = TempoEngine.speedToBpmRounded(s.speed);
        const isVariable = !bpm;
        return `<button class="tempo-btn${isVariable ? ' tempo-btn-variable' : ''}"
            data-speed="${s.speed}" data-idx="${i}"
            onclick="${isVariable ? '' : `handleTempoBtn(this, ${s.speed})`}"
            ${isVariable ? 'disabled style="cursor:default;opacity:0.6;"' : ''}
            title="${isVariable ? 'Speed varies — copies the ghost being mimicked' : `Tap to hear ${s.label} footstep tempo`}">
            <span class="tempo-btn-label">${s.label}</span>
            <span class="tempo-btn-speed">${s.speed} m/s</span>
            <span class="tempo-btn-bpm">${isVariable ? '— BPM' : bpm + ' BPM'}</span>
            <span class="tempo-btn-icon">${isVariable ? '~' : '▶'}</span>
        </button>`;
    }).join('');

    document.getElementById('mContent').innerHTML = `
        <div class="stat-grid">
            <div class="stat-box"><span class="stat-label">Hunt Threshold</span><span class="stat-val" style="color:var(--acc-red)">${g.hunt}</span></div>
            <div class="stat-box"><span class="stat-label">Speed</span><span class="stat-val" style="color:var(--acc-orange)">${g.speed}</span></div>
            <div class="stat-box"><span class="stat-label">Blink Rate</span><span class="stat-val">${g.blink}</span></div>
            <div class="stat-box"><span class="stat-label">Difficulty</span><span class="stat-val">${g.danger}</span></div>
        </div>

        <div class="tempo-section">
            <div class="tempo-header">
                <span class="tempo-title">👟 FOOTSTEP TEMPO</span>
                <div class="beat-indicator" id="beatIndicator"></div>
                <span class="tempo-hint">Click a speed to hear it</span>
            </div>
            <div class="tempo-buttons">${tempoButtons}</div>
        </div>

        <div class="section-header">Behavior</div>
        <div class="detail-text">${g.ability}</div>
        ${forcedNote}
        <div class="section-header" style="color:#a78bfa; border-color:rgba(139,92,246,0.4);">🎲 Zero Evidence Tell</div>
        <div class="detail-text" style="color:#c4b5fd; background:rgba(139,92,246,0.08); border:1px solid rgba(139,92,246,0.25); border-radius:8px; padding:12px 14px; margin-bottom:8px;">${g.zeroEv}</div>
        <div class="section-header">🔬 Confirmation Test</div>
        <div class="confirm-box detail-text">${g.test}</div>
    `;

    // Register the beat indicator with the engine
    TempoEngine.setBeatIndicator(document.getElementById('beatIndicator'));
    ui.ghostModal.showModal();
}

function handleTempoBtn(btn, speed) {
    // Reset all other buttons before toggling
    document.querySelectorAll('.tempo-btn').forEach(b => {
        if (b !== btn) {
            b.classList.remove('tempo-btn-active');
            const icon = b.querySelector('.tempo-btn-icon');
            if (icon) icon.textContent = '▶';
        }
    });
    TempoEngine.toggle(speed, btn);
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
                Lights OFF in the ghost's room. Must be <strong>in the same room</strong> as the ghost (most ghosts). Some ghosts respond to 'everyone' regardless of room; some only respond when you are alone.
                Look for the <span class="hl-green">ghost icon</span> on the box UI — that's evidence. <span class="hl-red">Deogen</span> is unique: responds in any lighting, no dark needed.
                <br><span class="hl-blue">Tip:</span> Ask location or aggression questions. Check the box UI carefully — a red LED with no ghost icon means it heard you but no response.
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
                Must read <span class="hl-red">below 0°C/32°F</span> on a thermometer. <span class="hl-red">Visible breath is NOT evidence</span> — since v0.9.0, player breath appears below 5°C regardless of ghost type. Do not rely on breath alone.
                <br><span class="hl-blue">Tip:</span> Check multiple rooms. The ghost room is usually the coldest. Breaker ON warms rooms over time, making freezing temps harder to find if left on too long.
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
                <br>&bull; Exception: <span class="hl-red">Banshee</span> hunts based on its chosen <em>target's</em> individual sanity — not the team average. Keep the target's sanity high to suppress hunts.
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
                <br><span class="hl-red">Hide and Seek</span> will trigger an instant hunt. <span class="hl-red">Walking away from the board while active also breaks it and starts a cursed hunt.</span> Always say "Goodbye" to close it safely.
                <br><span class="hl-blue">Tip:</span> Use deliberately when near a hiding spot — great for forcing ghost events and gathering evidence quickly.
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
                <br>&bull; Brings the ghost within 5m causing it to manifest and walk toward the box. If it reaches the box or player, or the event lasts >5 seconds, a cursed hunt starts.
                <br>&bull; <span class="hl-red">Do NOT throw it</span> — throwing (slamming shut) immediately starts a cursed hunt. Always place it gently.
                <br>&bull; Being at 0% sanity while the box plays also triggers a cursed hunt.
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
                <br>&bull; Light all 5 candles to summon the ghost — it teleports to the circle and manifests. After the event there is a ~5 second grace period before the cursed hunt begins.
                <br>&bull; <span class="hl-red">Low sanity edge case:</span> If you light the final candle with less than 16% sanity, the event is skipped entirely and a hunt starts immediately (not cursed, but nearly impossible to stop without a tier 3 crucifix).
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
                <br>&bull; Outside hunts, prevents hunts for 90s (<span class="hl-green">180s for Spirit</span>, 60s for Demon). During a hunt, blinds ghost for ~5s (~7s for Moroi).
                <br><span class="hl-blue">Tip:</span> Use on the ghost room to buy investigation time, or as an escape tool while looping during hunts.
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
                Firelights slow passive sanity drain while nearby (exact amount depends on Firelight tier — they reduce it, but may not stop it entirely at all tiers).
                <br>&bull; The ghost can blow them out.
                <br>&bull; <span class="hl-red">Onryo:</span> Flames act as crucifixes — blocks hunt attempts within 4m. After the 3rd flame blow-out, Onryo can hunt at any sanity.
                <br><span class="hl-blue">Tip:</span> Use Firelights in investigation areas to slow sanity drain. Keep a lighter ready to relight immediately.
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
        { name: "Sound Recorder", tier: "Media", cost: "$30", usage: "Records paranormal audio for the Media tab and extra rewards.", mechanics: "Hold USE while aiming at/near valid sounds. Higher tiers make it easier to confirm successful recordings.", tips: "Use it for paranormal voices, Spirit Box responses, EMF 5 sounds, airball events, ghost writing, crucifix burns, and cursed item audio.", range: "Sound-based capture range" },
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
        { name: "Crucifix", tier: "Essential", cost: "$30", usage: "Prevents hunts from starting within range. Two uses (2 arms).", mechanics: "3m range (5m Demon, Banshee). Must be on floor where ghost tries to hunt. Burns one arm per use.", tips: "Must be placed ON THE FLOOR in the ghost room to work — not in your pocket or on a surface. Place in center where ghost stands most often.", range: "3m radius (5m for Demon/Banshee)", uses: "2 per crucifix" },
        { name: "Smudge Sticks", tier: "Essential", cost: "$15", usage: "Burn to repel/blind ghost. Prevents hunts or creates escape.", mechanics: "Outside hunt: Prevents hunts for 90s (180s Spirit, 60s Demon). During hunt: Blinds ghost ~5s (~7s Moroi)", tips: "Light with lighter. Use in ghost room to prevent hunts or while running from hunts.", range: "~6m effect radius", uses: "1 per stick" },
        { name: "Sanity Pills", tier: "Essential", cost: "$20", usage: "Restores sanity. Amount depends on difficulty.", mechanics: "Amateur/Intermediate/Pro/Nightmare: 25%. Insanity: 0%. Taken in 4 bottles.", tips: "Save for after evidence collection. Slows Moroi. Use strategically.", range: "N/A (consumable)", uses: "4 per contract" },
        { name: "Candle", tier: "Starter", cost: "$15", usage: "Prevents sanity drain when near lit candle. Onryo interaction.", mechanics: "Firelights slow passive sanity drain (amount depends on tier) while you are nearby. Ghost can blow them out. Onryo treats flames as crucifixes — blocks its hunt attempts within 4m.", tips: "Light in safe rooms. Keep lighter ready to relight. Multiple candles = large safe zone.", range: "~3m sanity protection", uses: "Unlimited (can be blown out)" },
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

// Equipment unlock levels based on the current Chronicle-era progression table.
// Use aliases so the older labels in this site still show the correct modern item unlocks.
const EQUIPMENT_UNLOCKS = {
    "D.O.T.S Projector": { t1: "Starter", t2: 27, t3: 49, upgrade2: "$3,000", upgrade3: "$3,000" },
    "EMF Reader": { t1: "Starter", t2: 18, t3: 46, upgrade2: "$3,000", upgrade3: "$4,500" },
    "Ghost Writing Book": { t1: "Starter", t2: 23, t3: 55, upgrade2: "$3,000", upgrade3: "$3,000" },
    "Spirit Box": { t1: "Starter", t2: 23, t3: 46, upgrade2: "$3,000", upgrade3: "$3,000" },
    "Thermometer": { t1: "Starter", t2: 27, t3: 65, upgrade2: "$3,000", upgrade3: "$3,000" },
    "UV Flashlight": { t1: "Starter", t2: 18, t3: 46, upgrade2: "$3,000", upgrade3: "$2,000", alias: "UV Light" },
    "Glowstick": { t1: "Starter", t2: 18, t3: 46, upgrade2: "$3,000", upgrade3: "$2,000", alias: "UV Light" },
    "Video Camera": { t1: "Starter", t2: 27, t3: 49, upgrade2: "$3,000", upgrade3: "$3,000" },
    "Flashlight": { t1: "Starter", t2: 18, t3: 34, upgrade2: "$3,000", upgrade3: "$3,000" },
    "Strong Flashlight": { t1: "Starter", t2: 18, t3: 34, upgrade2: "$3,000", upgrade3: "$3,000", alias: "Flashlight" },
    "Crucifix": { t1: 7, t2: 34, t3: 80, upgrade2: "$4,000", upgrade3: "$20,000" },
    "Candle": { t1: 12, t2: 37, t3: 75, upgrade2: "$3,000", upgrade3: "$10,000", alias: "Firelight" },
    "Lighter": { t1: 12, t2: 37, t3: 52, upgrade2: "$500", upgrade3: "$750", alias: "Igniter" },
    "Smudge Sticks": { t1: 14, t2: 37, t3: 80, upgrade2: "$3,500", upgrade3: "$15,000", alias: "Incense" },
    "Incense": { t1: 14, t2: 37, t3: 80, upgrade2: "$3,500", upgrade3: "$15,000" },
    "Motion Sensor": { t1: 3, t2: 42, t3: 70, upgrade2: "$2,500", upgrade3: "$8,000" },
    "Parabolic Microphone": { t1: 5, t2: 32, t3: 70, upgrade2: "$3,000", upgrade3: "$5,000" },
    "Photo Camera": { t1: 2, t2: 23, t3: 55, upgrade2: "$3,000", upgrade3: "$5,000" },
    "Salt": { t1: 8, t2: 39, t3: 65, upgrade2: "$2,500", upgrade3: "$5,000" },
    "Sanity Pills": { t1: 14, t2: 39, t3: 75, upgrade2: "$2,000", upgrade3: "$5,000", alias: "Sanity Medication" },
    "Sound Recorder": { t1: 4, t2: 39, t3: 60, upgrade2: "$3,000", upgrade3: "$5,000" },
    "Sound Sensor": { t1: 10, t2: 32, t3: 52, upgrade2: "$3,000", upgrade3: "$1,500" },
    "Tripod": { t1: 9, t2: 34, t3: 60, upgrade2: "$5,000", upgrade3: "$3,000" },
    "Head Mounted Camera": { t1: 13, t2: 42, t3: 80, upgrade2: "$10,000", upgrade3: "$10,000", alias: "Head Gear" }
};

function formatUnlockLevel(value) {
    return value === "Starter" ? "Default" : `Lvl ${value}`;
}

function renderUnlocks(item) {
    const unlock = EQUIPMENT_UNLOCKS[item.name];
    if (!unlock) return '';

    const aliasNote = unlock.alias ? `<div class="unlock-alias">Modern name: ${unlock.alias}</div>` : '';

    return `
        <div class="unlock-panel">
            <div class="unlock-title">Unlock Levels</div>
            <div class="unlock-row">
                <div class="unlock-tier"><span>T1</span><strong>${formatUnlockLevel(unlock.t1)}</strong></div>
                <div class="unlock-tier"><span>T2</span><strong>${formatUnlockLevel(unlock.t2)}</strong><small>${unlock.upgrade2 || ''}</small></div>
                <div class="unlock-tier"><span>T3</span><strong>${formatUnlockLevel(unlock.t3)}</strong><small>${unlock.upgrade3 || ''}</small></div>
            </div>
            ${aliasNote}
        </div>
    `;
}

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
                        ${EQUIPMENT_UNLOCKS[item.name] ? `<span class="unlock-badge">${formatUnlockLevel(EQUIPMENT_UNLOCKS[item.name].t1)}</span>` : ''}
                    </div>
                </div>
                <p class="equip-usage"><strong>Usage:</strong> ${item.usage}</p>
                ${renderUnlocks(item)}
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
// STAGGERED XP LEVELING SYSTEM
// ═══════════════════════════════════════════════════════════════
// Level 1-10:  100 XP per level (10 correct = 1 level)
// Level 11-25: 200 XP per level (20 correct = 1 level)
// Level 26-50: 400 XP per level (40 correct = 1 level)
// Level 51+:   800 XP per level (80 correct = 1 level)

function getXPForLevel(level) {
    if (level <= 10) return 100;
    if (level <= 25) return 200;
    if (level <= 50) return 400;
    return 800;
}

function getLevelFromXP(xp) {
    let level = 1;
    let xpRemaining = xp;
    
    while (xpRemaining >= getXPForLevel(level)) {
        xpRemaining -= getXPForLevel(level);
        level++;
    }
    
    return {
        level: level,
        xpInCurrentLevel: xpRemaining,
        xpForNextLevel: getXPForLevel(level)
    };
}

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

// Initialize Firebase App immediately
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    console.log("Firebase App initialized");
}

// Group Journal State
let groupJournal = {
    sessionId: null,
    isHost: false,
    userId: null,
    syncEnabled: false,
    lastSync: 0,
    syncTimeout: null
};

// Initialize Firebase (check if already initialized)
function initFirebase() {
    if (firebaseConfig.apiKey === "YOUR-API-KEY-HERE") {
        console.log("Firebase not configured. Group Journal disabled.");
        return false;
    }
    
    try {
        // App is already initialized globally, just generate user ID
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


// ═══════════════════════════════════════════════════════════════
// GOOGLE AUTHENTICATION + NICKNAMES + STATS TRACKING
// ═══════════════════════════════════════════════════════════════

let currentUser = null;
let currentUserNickname = null;
let currentInvestigation = null;

// Initialize Firebase Auth - wait for it to be available
let auth;

function initializeFirebaseAuth() {
    if (typeof firebase === 'undefined' || !firebase.auth) {
        console.error("Firebase not loaded yet, retrying...");
        setTimeout(initializeFirebaseAuth, 100);
        return;
    }
    
    try {
        auth = firebase.auth();
        console.log("Firebase Auth initialized successfully");
        
        // Now initialize the auth system
        initGoogleAuth();
    } catch (error) {
        console.error("Firebase Auth initialization error:", error);
    }
}

// Start initialization when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFirebaseAuth);
} else {
    initializeFirebaseAuth();
}

// ═══════════════════════════════════════════════════════════════
// AUTH INITIALIZATION
// ═══════════════════════════════════════════════════════════════

function initGoogleAuth() {
    console.log("Initializing Google authentication...");
    
    // Google login button
    document.getElementById('btnGoogleLogin').addEventListener('click', handleGoogleLogin);
    
    // User menu button (toggle dropdown)
    document.getElementById('btnUserMenu').addEventListener('click', (e) => {
        e.stopPropagation();
        const dropdown = document.getElementById('userDropdown');
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        const dropdown = document.getElementById('userDropdown');
        const oldUserMenu = document.getElementById('btnUserMenu');
        const newUserMenu = document.getElementById('btnUserMenuNew');
        
        // Check if click is outside dropdown and not on either user button
        if (dropdown && !dropdown.contains(e.target) && 
            e.target !== oldUserMenu && 
            e.target !== newUserMenu &&
            !e.target.closest('#btnUserMenuNew')) {
            dropdown.style.display = 'none';
        }
    });
    
    // Dropdown menu items
    document.getElementById('btnViewStatsDropdown').addEventListener('click', () => {
        document.getElementById('userDropdown').style.display = 'none';
        loadStats();
        document.getElementById('statsModal').showModal();
    });
    
    document.getElementById('btnLogoutDropdown').addEventListener('click', () => {
        document.getElementById('userDropdown').style.display = 'none';
        handleLogout();
    });
    
    // Nickname form
    document.getElementById('nicknameForm').addEventListener('submit', handleNicknameSubmit);
    
    // Change nickname button
    document.getElementById('btnChangeNickname').addEventListener('click', () => {
        document.getElementById('statsModal').close();
        document.getElementById('nicknameModal').showModal();
    });
    
    // Reset stats button
    document.getElementById('btnResetStats').addEventListener('click', async () => {
        if (!currentUser) return;
        
        const confirmed = confirm('⚠️ Are you sure you want to reset ALL your stats?\n\nThis will delete:\n- All investigation history\n- Win/loss records\n- XP and level\n- Everything!\n\nThis CANNOT be undone!');
        
        if (!confirmed) return;
        
        // Double confirmation
        const doubleConfirm = confirm('Really reset? This is your last chance!\n\nType YES in the next prompt to confirm.');
        
        if (!doubleConfirm) return;
        
        const finalConfirm = prompt('Type YES to reset all stats:');
        
        if (finalConfirm === 'YES') {
            try {
                // Reset stats
                await firebase.database().ref(`users/${currentUser.uid}/stats`).set({
                    total: 0,
                    wins: 0,
                    losses: 0,
                    xp: 0,
                    level: 1
                });
                
                // Delete history
                await firebase.database().ref(`users/${currentUser.uid}/history`).remove();
                
                alert('✅ Stats reset successfully!');
                
                // Reload stats display
                loadStats();
                loadUserStatsDisplay();
                
            } catch (error) {
                console.error('Error resetting stats:', error);
                alert('❌ Failed to reset stats. Please try again.');
            }
        } else {
            alert('Reset cancelled.');
        }
    });
    
    // View stats
    
    // Close stats
    document.getElementById('closeStats').addEventListener('click', () => {
        document.getElementById('statsModal').close();
    });
    
    // Close guess
    document.getElementById('closeGuess').addEventListener('click', () => {
        document.getElementById('guessModal').close();
    });
    
    // Start investigation
    document.getElementById('btnNewInvestigation').addEventListener('click', () => {
        startNewInvestigation();
        document.getElementById('statsModal').close();
    });
    
    // Listen for auth state changes
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            await onUserLoggedIn(user);
        } else {
            onUserLoggedOut();
        }
    });
    
    console.log("Google authentication initialized!");
}

// ═══════════════════════════════════════════════════════════════
// GOOGLE AUTH HANDLERS
// ═══════════════════════════════════════════════════════════════

async function handleGoogleLogin() {
    if (!auth) {
        alert("⚠️ Firebase Auth not ready yet.\n\nPlease wait a moment and try again.");
        console.error("Auth not initialized");
        return;
    }
    
    try {
        const provider = new firebase.auth.GoogleAuthProvider();
        await auth.signInWithPopup(provider);
        console.log("Google sign-in successful");
    } catch (error) {
        console.error("Google sign-in error:", error);
        
        if (error.code === 'auth/popup-closed-by-user') {
            return;
        }
        
        if (error.code === 'auth/unauthorized-domain') {
            alert("⚠️ Domain Not Authorized\n\nThis domain needs to be added to Firebase:\n\n1. Go to Firebase Console\n2. Authentication → Settings → Authorized domains\n3. Add: " + window.location.hostname + "\n\nOr test on your production domain instead!");
            return;
        }
        
        if (error.code === 'auth/popup-blocked') {
            alert("⚠️ Popup Blocked\n\nYour browser blocked the sign-in popup.\n\nPlease allow popups for this site and try again.");
            return;
        }
        
        alert("Failed to sign in with Google.\n\nError: " + (error.message || "Unknown error") + "\n\nPlease try again.");
    }
}

async function handleLogout() {
    try {
        // Leave group session if in one
        if (groupJournal && groupJournal.sessionId) {
            leaveGroupSession();
        }
        
        await auth.signOut();
        console.log("User logged out");
    } catch (error) {
        console.error("Logout error:", error);
    }
}

async function onUserLoggedIn(user) {
    console.log("User logged in:", user.email);
    currentUser = user;
    
    // Check if user has a nickname
    const userRef = firebase.database().ref(`users/${user.uid}`);
    const snapshot = await userRef.once('value');
    const userData = snapshot.val();
    
    if (!userData || !userData.nickname) {
        // First time login - prompt for nickname
        document.getElementById('nicknameModal').showModal();
        return;
    }
    
    // User has nickname, load it
    currentUserNickname = userData.nickname;
    showUserView();
}

function onUserLoggedOut() {
    console.log("User logged out");
    currentUser = null;
    currentUserNickname = null;
    currentInvestigation = null;
    
    // Update UI
    document.getElementById('authView').style.display = 'flex';
    document.getElementById('userView').style.display = 'none';
    
    // Hide investigation banner
    const banner = document.getElementById('investigationBanner');
    if (banner) banner.remove();
}

function showUserView() {
    // Update UI
    document.getElementById('authView').style.display = 'none';
    document.getElementById('userView').style.display = 'inline-flex';
    
    // Set user info in button
    document.getElementById('userNickname').textContent = currentUserNickname;
    document.getElementById('userAvatar').src = currentUser.photoURL || 'https://via.placeholder.com/40';
    
    // Set user info in dropdown
    document.getElementById('dropdownNickname').textContent = currentUserNickname;
    document.getElementById('dropdownAvatar').src = currentUser.photoURL || 'https://via.placeholder.com/40';
    
    // Load stats
    loadUserStatsDisplay();
    
    // Initialize friends system for this user
    initializeFriendCode();
    loadFriends();
    listenToFriendRequests();
}

// ═══════════════════════════════════════════════════════════════
// NICKNAME MANAGEMENT
// ═══════════════════════════════════════════════════════════════

async function handleNicknameSubmit(e) {
    e.preventDefault();
    
    const nickname = document.getElementById('nicknameInput').value.trim();
    const errorEl = document.getElementById('nicknameError');
    
    // Clear error
    errorEl.classList.remove('show');
    
    // Validate
    if (nickname.length < 3 || nickname.length > 20) {
        errorEl.textContent = "Nickname must be 3-20 characters";
        errorEl.classList.add('show');
        return;
    }
    
    if (!/^[A-Za-z0-9 _-]+$/.test(nickname)) {
        errorEl.textContent = "Only letters, numbers, spaces, - and _ allowed";
        errorEl.classList.add('show');
        return;
    }
    
    try {
        // Save nickname to Firebase
        const userRef = firebase.database().ref(`users/${currentUser.uid}`);
        const snapshot = await userRef.once('value');
        const userData = snapshot.val() || {};
        
        await userRef.update({
            nickname: nickname,
            email: currentUser.email,
            photoURL: currentUser.photoURL,
            updatedAt: Date.now(),
            stats: userData.stats || { total: 0, wins: 0, losses: 0 }
        });
        
        currentUserNickname = nickname;
        
        // Close modal
        document.getElementById('nicknameModal').close();
        
        // Show user view
        showUserView();
        
        console.log("Nickname saved:", nickname);
        
    } catch (error) {
        console.error("Error saving nickname:", error);
        errorEl.textContent = "Failed to save nickname";
        errorEl.classList.add('show');
    }
}

// ═══════════════════════════════════════════════════════════════
// STATS MANAGEMENT
// ═══════════════════════════════════════════════════════════════

async function loadStats() {
    if (!currentUser) return;
    
    try {
        // Load stats
        const statsSnapshot = await firebase.database().ref(`users/${currentUser.uid}/stats`).once('value');
        const stats = statsSnapshot.val() || { total: 0, wins: 0, losses: 0, xp: 0, level: 1 };
        
        const winRate = stats.total > 0 ? Math.round((stats.wins / stats.total) * 100) : 0;
        
        // Update title with nickname
        document.getElementById('statsNickname').textContent = currentUserNickname + "'s";
        
        // Update stats display
        document.getElementById('statTotal').textContent = stats.total;
        document.getElementById('statWins').textContent = stats.wins;
        document.getElementById('statLosses').textContent = stats.losses;
        document.getElementById('statWinRate').textContent = winRate + '%';
        
        // Update level/XP display
        const level = stats.level || 1;
        const xp = stats.xp || 0;
        const levelInfo = getLevelFromXP(xp);
        const xpInLevel = levelInfo.xpInCurrentLevel;
        const xpForNextLevel = levelInfo.xpForNextLevel;
        const xpPercent = (xpInLevel / xpForNextLevel) * 100;
        
        document.getElementById('statLevel').textContent = level;
        document.getElementById('statXP').textContent = xpInLevel;
        document.getElementById('statXPNext').textContent = xpForNextLevel;
        document.getElementById('xpBarFill').style.width = xpPercent + '%';
        
        // Load history
        const historySnapshot = await firebase.database().ref(`users/${currentUser.uid}/history`)
            .orderByChild('timestamp')
            .limitToLast(10)
            .once('value');
        
        const historyList = document.getElementById('historyList');
        
        if (historySnapshot.exists()) {
            historyList.innerHTML = '';
            const historyItems = [];
            
            historySnapshot.forEach((child) => {
                historyItems.unshift(child.val());
            });
            
            historyItems.forEach((item) => {
                const historyItem = document.createElement('div');
                historyItem.className = `history-item ${item.correct ? 'correct' : 'incorrect'}`;
                
                const timeAgo = formatTimeAgo(item.timestamp);
                const xpGained = item.xpGained || 0;
                
                historyItem.innerHTML = `
                    <div class="history-info">
                        <div class="history-guess">
                            ${item.correct ? '✅' : '❌'} ${item.actualGhost || item.actual}
                            ${xpGained > 0 ? `<span style="color: var(--acc-green)">+${xpGained} XP</span>` : ''}
                        </div>
                        <div class="history-result">
                            ${item.possibleGhosts ? `Evidence showed: ${item.possibleGhosts.join(', ')}` : item.correct ? 'Correct match!' : 'Evidence mismatch'}
                        </div>
                    </div>
                    <div class="history-time">${timeAgo}</div>
                `;
                
                historyList.appendChild(historyItem);
            });
        } else {
            historyList.innerHTML = '<div class="empty-state">No investigations yet. Start hunting ghosts!</div>';
        }
        
    } catch (error) {
        console.error("Error loading stats:", error);
    }
}

async function loadUserStatsDisplay() {
    if (!currentUser) return;
    
    try {
        const snapshot = await firebase.database().ref(`users/${currentUser.uid}/stats`).once('value');
        const stats = snapshot.val() || { total: 0, wins: 0, losses: 0, xp: 0, level: 1 };
        
        const winRate = stats.total > 0 ? Math.round((stats.wins / stats.total) * 100) : 0;
        
        // Update button display
        document.getElementById('userLevel').textContent = stats.level || 1;
        
        // Update dropdown
        document.getElementById('dropdownWins').textContent = stats.wins;
        document.getElementById('dropdownWinRate').textContent = winRate;
        
    } catch (error) {
        console.error("Error loading stats:", error);
    }
}

function formatTimeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago';
    return Math.floor(seconds / 86400) + 'd ago';
}

// ═══════════════════════════════════════════════════════════════
// INVESTIGATION MANAGEMENT
// ═══════════════════════════════════════════════════════════════

function startNewInvestigation() {
    if (!currentUser) {
        alert('Please log in to track your investigations!');
        return;
    }
    
    // Randomly select a ghost
    const randomGhost = GHOSTS[Math.floor(Math.random() * GHOSTS.length)];
    
    currentInvestigation = {
        actualGhost: randomGhost.name,
        startTime: Date.now()
    };
    
    console.log('Investigation started - Ghost:', currentInvestigation.actualGhost);
    
    // Show investigation banner
    showInvestigationBanner();
    
    // Reset evidence
    Object.keys(app.evidence).forEach(k => app.evidence[k] = 0);
    app.activeFilters.clear();
    renderFilters();
    updateBoard();
}

function showInvestigationBanner() {
    // Remove existing banner if any
    const existingBanner = document.getElementById('investigationBanner');
    if (existingBanner) existingBanner.remove();
    
    // Create new banner
    const banner = document.createElement('div');
    banner.id = 'investigationBanner';
    banner.className = 'investigation-banner';
    banner.innerHTML = `
        <div class="investigation-info">
            🔍 Investigation in progress
            <span class="timer" id="investigationTimer">0:00</span>
        </div>
        <button class="btn-submit-guess" id="btnOpenGuess">Submit Result</button>
    `;
    
    // Insert after header
    const header = document.querySelector('header');
    if (header) {
        header.after(banner);
    } else {
        document.body.insertBefore(banner, document.body.firstChild);
    }
    
    // Start timer
    updateInvestigationTimer();
    
    // Add button handler
    document.getElementById('btnOpenGuess').addEventListener('click', openGuessModal);
}

function updateInvestigationTimer() {
    if (!currentInvestigation) return;
    
    const timerEl = document.getElementById('investigationTimer');
    if (!timerEl) return;
    
    const elapsed = Math.floor((Date.now() - currentInvestigation.startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    
    timerEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    setTimeout(updateInvestigationTimer, 1000);
}

function openGuessModal() {
    if (!currentInvestigation) {
        alert('Start a new investigation first!');
        return;
    }
    
    // Show ALL ghosts for selection (not filtered)
    const ghostOptions = document.getElementById('ghostOptions');
    ghostOptions.innerHTML = '';
    
    // Add instruction text
    const instruction = document.createElement('p');
    instruction.style.cssText = 'grid-column: 1/-1; text-align: center; color: var(--text-muted); margin-bottom: 8px;';
    instruction.textContent = 'What ghost was it in the game?';
    ghostOptions.appendChild(instruction);
    
    // Show all ghosts
    GHOSTS.forEach(ghost => {
        const option = document.createElement('div');
        option.className = 'ghost-option';
        option.textContent = ghost.name;
        option.addEventListener('click', () => submitActualGhost(ghost.name));
        ghostOptions.appendChild(option);
    });
    
    document.getElementById('guessModal').showModal();
}

async function submitActualGhost(actualGhost) {
    if (!currentInvestigation || !currentUser) return;
    
    // Get what the user's evidence narrowed it down to
    const matches = [];
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
        if(possible) matches.push(g.name);
    });
    
    // Check if their evidence correctly narrowed it down
    const correct = matches.includes(actualGhost) && matches.length > 0;
    const timeTaken = Math.floor((Date.now() - currentInvestigation.startTime) / 1000);
    
    console.log('Investigation complete:', {
        actualGhost,
        possibleFromEvidence: matches,
        correct: correct
    });
    
    try {
        // Get current stats
        const statsRef = firebase.database().ref(`users/${currentUser.uid}/stats`);
        const snapshot = await statsRef.once('value');
        const currentStats = snapshot.val() || { total: 0, wins: 0, losses: 0, xp: 0, level: 1 };
        
        // Calculate XP gain
        const xpGain = correct ? 10 : 0;
        const newXP = (currentStats.xp || 0) + xpGain;
        
        // Calculate new level using staggered system
        const levelInfo = getLevelFromXP(newXP);
        const newLevel = levelInfo.level;
        const leveledUp = newLevel > (currentStats.level || 1);
        
        // Update stats
        const newStats = {
            total: currentStats.total + 1,
            wins: currentStats.wins + (correct ? 1 : 0),
            losses: currentStats.losses + (correct ? 0 : 1),
            xp: newXP,
            level: newLevel
        };
        
        await statsRef.set(newStats);
        
        // Save to history
        await firebase.database().ref(`users/${currentUser.uid}/history`).push({
            actualGhost: actualGhost,
            possibleGhosts: matches,
            correct: correct,
            timeTaken: timeTaken,
            xpGained: xpGain,
            timestamp: Date.now()
        });
        
        // Show result
        const winRate = Math.round((newStats.wins / newStats.total) * 100);
        
        let resultMessage = '';
        if (correct) {
            resultMessage = `✅ CORRECT!\n\nIt was ${actualGhost} and your evidence matched!\n\n`;
            if (leveledUp) {
                resultMessage += `🎉 LEVEL UP! You're now Level ${newLevel}!\n\n`;
            }
            resultMessage += `+${xpGain} XP (${levelInfo.xpInCurrentLevel}/${levelInfo.xpForNextLevel} to Level ${newLevel + 1})\n\n`;
        } else {
            if (matches.length === 0) {
                resultMessage = `❌ INCORRECT\n\nIt was ${actualGhost} but your evidence ruled it out.\n\n`;
            } else {
                resultMessage = `❌ INCORRECT\n\nIt was ${actualGhost} but your evidence showed: ${matches.join(', ')}\n\n`;
            }
            resultMessage += `No XP gained\n\n`;
        }
        
        resultMessage += `Your stats:\n🏆 ${newStats.wins} wins out of ${newStats.total} total\n📊 ${winRate}% accuracy\n⭐ Level ${newStats.level} (${newStats.xp} XP)`;
        
        alert(resultMessage);
        
        // Update display
        loadUserStatsDisplay();
        
        // End investigation
        endInvestigation();
        
    } catch (error) {
        console.error('Error submitting investigation:', error);
        alert('Failed to save investigation. Please try again.');
    }
    
    // Close modal
    document.getElementById('guessModal').close();
}

function endInvestigation() {
    currentInvestigation = null;
    
    // Remove banner
    const banner = document.getElementById('investigationBanner');
    if (banner) banner.remove();
}

// ═══════════════════════════════════════════════════════════════
// GROUP JOURNAL INTEGRATION - UPDATE EXISTING FUNCTIONS
// ═══════════════════════════════════════════════════════════════

// Override startHeartbeat to include nickname
const originalStartHeartbeat = startHeartbeat;
startHeartbeat = function() {
    if (!groupJournal.sessionId || !groupJournal.userId) return;
    
    const userRef = firebase.database().ref(`sessions/${groupJournal.sessionId}/users/${groupJournal.userId}`);
    
    // Set initial presence with nickname
    userRef.set({
        lastSeen: Date.now(),
        nickname: currentUserNickname || 'Anonymous',
        photoURL: currentUser?.photoURL || null
    });
    
    // Update every 5 seconds
    const interval = setInterval(() => {
        if (groupJournal.syncEnabled) {
            userRef.update({ 
                lastSeen: Date.now(),
                nickname: currentUserNickname || 'Anonymous'
            });
        } else {
            clearInterval(interval);
        }
    }, 5000);
    
    // Clean up on disconnect
    userRef.onDisconnect().remove();
};

// Override updateUserCount to show nicknames
const originalUpdateUserCount = updateUserCount;
updateUserCount = function() {
    if (!groupJournal.sessionId) return;
    
    const usersRef = firebase.database().ref(`sessions/${groupJournal.sessionId}/users`);
    usersRef.once('value', (snapshot) => {
        const users = snapshot.val();
        if (!users) {
            document.getElementById('userCount').textContent = '1';
            const usersList = document.getElementById('usersList');
            if (usersList) {
                usersList.innerHTML = '<div class="user-chip you">👤 You</div>';
            }
            return;
        }
        
        // Count active users (seen in last 15 seconds)
        const now = Date.now();
        const activeUsers = [];
        
        Object.entries(users).forEach(([uid, data]) => {
            if (now - data.lastSeen < 15000) {
                activeUsers.push({
                    uid,
                    nickname: data.nickname || 'Anonymous',
                    photoURL: data.photoURL,
                    isYou: uid === groupJournal.userId
                });
            }
        });
        
        // Update count
        document.getElementById('userCount').textContent = activeUsers.length;
        
        // Update users list
        const usersList = document.getElementById('usersList');
        if (usersList) {
            usersList.innerHTML = '';
            
            activeUsers.forEach(user => {
                const chip = document.createElement('div');
                chip.className = `user-chip ${user.isYou ? 'you' : ''}`;
                
                if (user.photoURL) {
                    chip.innerHTML = `
                        <img src="${user.photoURL}" alt="">
                        <span>${user.nickname}${user.isYou ? ' (You)' : ''}</span>
                    `;
                } else {
                    chip.innerHTML = `
                        <span>👤 ${user.nickname}${user.isYou ? ' (You)' : ''}</span>
                    `;
                }
                
                usersList.appendChild(chip);
            });
        }
    });
};

// ═══════════════════════════════════════════════════════════════
// INITIALIZE AUTH
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// FRIENDS SYSTEM WITH FRIEND CODES
// ═══════════════════════════════════════════════════════════════

let currentFriends = [];
let pendingRequests = { incoming: [], outgoing: [] };

// Generate random friend code (8 characters: 4 letters + 4 numbers)
function generateFriendCode() {
    const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // Removed I, O to avoid confusion
    const numbers = '23456789'; // Removed 0, 1 to avoid confusion
    
    let code = '';
    // 4 letters
    for (let i = 0; i < 4; i++) {
        code += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    // Dash
    code += '-';
    // 4 numbers
    for (let i = 0; i < 4; i++) {
        code += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    
    return code;
}

// Initialize friend code for user
async function initializeFriendCode() {
    if (!currentUser) {
        console.log('No currentUser, skipping friend code init');
        return;
    }
    
    console.log('Initializing friend code for user:', currentUser.uid);
    
    try {
        const userRef = firebase.database().ref(`users/${currentUser.uid}`);
        const snapshot = await userRef.once('value');
        const userData = snapshot.val() || {}; // Handle null userData
        
        console.log('User data:', userData);
        
        if (!userData.friendCode) {
            console.log('No friend code found, generating...');
            
            // Generate unique friend code
            let code = generateFriendCode();
            console.log('Generated code:', code);
            
            // Check if code exists (very unlikely but just in case)
            let codeExists = true;
            let attempts = 0;
            while (codeExists && attempts < 5) {
                const codeCheck = await firebase.database().ref('friendCodes').child(code).once('value');
                if (!codeCheck.exists()) {
                    codeExists = false;
                } else {
                    console.log('Code collision, regenerating...');
                    code = generateFriendCode();
                }
                attempts++;
            }
            
            if (attempts >= 5) {
                console.error('Failed to generate unique code after 5 attempts');
                return;
            }
            
            console.log('Saving friend code:', code);
            
            // Save friend code
            await userRef.update({ friendCode: code });
            await firebase.database().ref('friendCodes').child(code).set(currentUser.uid);
            
            console.log('✅ Friend code saved:', code);
            
            // Immediately update the display
            const codeEl = document.getElementById('yourFriendCode');
            if (codeEl) {
                codeEl.textContent = code;
            }
        } else {
            console.log('Friend code already exists:', userData.friendCode);
        }
    } catch (error) {
        console.error('❌ Error initializing friend code:', error);
    }
}

// Initialize friends system
function initFriendsSystem() {
    console.log('Initializing friends system...');
    
    // Friends button in header
    const friendsBtn = document.createElement('button');
    friendsBtn.className = 'btn-icon';
    friendsBtn.id = 'btnFriends';
    friendsBtn.title = 'Friends';
    friendsBtn.innerHTML = '👥';
    
    const groupBtn = document.getElementById('btnGroupJournal');
    groupBtn.after(friendsBtn);
    
    // Friends button handler
    friendsBtn.addEventListener('click', openFriendsModal);
    
    // Modal handlers
    document.getElementById('closeFriends').addEventListener('click', () => {
        document.getElementById('friendsModal').close();
    });
    
    document.getElementById('btnAddFriend').addEventListener('click', () => {
        document.getElementById('friendsModal').close();
        document.getElementById('addFriendModal').showModal();
    });
    
    document.getElementById('closeAddFriend').addEventListener('click', () => {
        document.getElementById('addFriendModal').close();
    });
    
    document.getElementById('btnCopyFriendCode').addEventListener('click', copyFriendCode);
    document.getElementById('addFriendForm').addEventListener('submit', sendFriendRequest);
    
    // Load friends if logged in (will be called from showUserView)
    
    console.log('Friends system initialized!');
}

// Open friends modal
async function openFriendsModal() {
    if (!currentUser) {
        alert('Please log in to use friends system!');
        return;
    }
    
    await loadFriends();
    document.getElementById('friendsModal').showModal();
}

// Copy friend code
async function copyFriendCode() {
    try {
        const snapshot = await firebase.database().ref(`users/${currentUser.uid}/friendCode`).once('value');
        const code = snapshot.val();
        
        if (code) {
            await navigator.clipboard.writeText(code);
            
            const btn = document.getElementById('btnCopyFriendCode');
            const originalText = btn.textContent;
            btn.textContent = 'Copied!';
            btn.style.background = 'var(--acc-green)';
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
            }, 2000);
        }
    } catch (error) {
        console.error('Error copying friend code:', error);
        alert('Failed to copy friend code');
    }
}

// Send friend request
async function sendFriendRequest(e) {
    e.preventDefault();
    
    const codeInput = document.getElementById('friendCodeInput');
    const code = codeInput.value.trim().toUpperCase();
    const errorEl = document.getElementById('addFriendError');
    
    errorEl.classList.remove('show');
    
    if (!code || code.length !== 9) {
        errorEl.textContent = 'Invalid friend code format';
        errorEl.classList.add('show');
        return;
    }
    
    try {
        // Look up user by friend code
        const codeSnapshot = await firebase.database().ref(`friendCodes/${code}`).once('value');
        
        if (!codeSnapshot.exists()) {
            errorEl.textContent = 'Friend code not found';
            errorEl.classList.add('show');
            return;
        }
        
        const friendUid = codeSnapshot.val();
        
        // Can't add yourself
        if (friendUid === currentUser.uid) {
            errorEl.textContent = "You can't add yourself!";
            errorEl.classList.add('show');
            return;
        }
        
        // Check if already friends
        const friendsSnapshot = await firebase.database().ref(`users/${currentUser.uid}/friends/${friendUid}`).once('value');
        if (friendsSnapshot.exists()) {
            errorEl.textContent = 'Already friends!';
            errorEl.classList.add('show');
            return;
        }
        
        // Check if request already sent
        const outgoingSnapshot = await firebase.database().ref(`users/${currentUser.uid}/friendRequests/outgoing/${friendUid}`).once('value');
        if (outgoingSnapshot.exists()) {
            errorEl.textContent = 'Friend request already sent';
            errorEl.classList.add('show');
            return;
        }
        
        // Check if they already sent you a request (auto-accept)
        const incomingSnapshot = await firebase.database().ref(`users/${currentUser.uid}/friendRequests/incoming/${friendUid}`).once('value');
        if (incomingSnapshot.exists()) {
            // Auto-accept since both want to be friends
            await acceptFriendRequest(friendUid);
            alert('Friend request accepted! You are now friends! 🎉');
            document.getElementById('addFriendModal').close();
            loadFriends();
            return;
        }
        
        // Get friend's public info (nickname, photoURL are public)
        const nicknameSnapshot = await firebase.database().ref(`users/${friendUid}/nickname`).once('value');
        const friendNickname = nicknameSnapshot.val();
        
        if (!friendNickname) {
            errorEl.textContent = 'User not found';
            errorEl.classList.add('show');
            return;
        }
        
        // Prepare request data
        const requestData = {
            from: currentUser.uid,
            fromNickname: currentUserNickname,
            fromPhotoURL: currentUser.photoURL,
            timestamp: Date.now()
        };
        
        // Add to YOUR outgoing requests
        await firebase.database().ref(`users/${currentUser.uid}/friendRequests/outgoing/${friendUid}`).set(requestData);
        
        // Send notification to THEIR friendRequestReceived path (they can write this)
        await firebase.database().ref(`users/${friendUid}/friendRequestReceived/${currentUser.uid}`).set(requestData);
        
        console.log('✅ Friend request sent to', friendNickname);
        alert(`Friend request sent to ${friendNickname}! ✅`);
        
        codeInput.value = '';
        document.getElementById('addFriendModal').close();
        await loadFriends();
        
    } catch (error) {
        console.error('❌ Error sending friend request:', error);
        errorEl.textContent = 'Failed to send friend request: ' + error.message;
        errorEl.classList.add('show');
    }
}

// Accept friend request
async function acceptFriendRequest(friendUid) {
    try {
        // Get friend's public info
        const nicknameSnapshot = await firebase.database().ref(`users/${friendUid}/nickname`).once('value');
        const photoSnapshot = await firebase.database().ref(`users/${friendUid}/photoURL`).once('value');
        
        const friendNickname = nicknameSnapshot.val();
        const friendPhotoURL = photoSnapshot.val();
        
        if (!friendNickname) {
            alert('Friend not found');
            return;
        }
        
        // Get your info
        const yourNicknameSnapshot = await firebase.database().ref(`users/${currentUser.uid}/nickname`).once('value');
        const yourPhotoSnapshot = await firebase.database().ref(`users/${currentUser.uid}/photoURL`).once('value');
        
        const yourNickname = yourNicknameSnapshot.val();
        const yourPhotoURL = yourPhotoSnapshot.val();
        
        // Add friend to YOUR friends list
        await firebase.database().ref(`users/${currentUser.uid}/friends/${friendUid}`).set({
            nickname: friendNickname,
            photoURL: friendPhotoURL,
            since: Date.now()
        });
        
        // Remove from YOUR incoming requests
        await firebase.database().ref(`users/${currentUser.uid}/friendRequests/incoming/${friendUid}`).remove();
        
        // Create a "friendAccepted" notification for the other user
        // They'll use this to add you to their friends list
        await firebase.database().ref(`users/${friendUid}/friendAccepted/${currentUser.uid}`).set({
            nickname: yourNickname,
            photoURL: yourPhotoURL,
            since: Date.now()
        });
        
        console.log('✅ Friend request accepted!');
        alert(`You and ${friendNickname} are now friends! 🎉`);
        
        await loadFriends();
        
    } catch (error) {
        console.error('❌ Error accepting friend request:', error);
        alert('Failed to accept friend request: ' + error.message);
    }
}

// Decline friend request
async function declineFriendRequest(friendUid) {
    try {
        // Check if it's incoming or outgoing
        const incomingRef = firebase.database().ref(`users/${currentUser.uid}/friendRequests/incoming/${friendUid}`);
        const outgoingRef = firebase.database().ref(`users/${currentUser.uid}/friendRequests/outgoing/${friendUid}`);
        
        const incomingSnapshot = await incomingRef.once('value');
        const outgoingSnapshot = await outgoingRef.once('value');
        
        if (incomingSnapshot.exists()) {
            // It's an incoming request (someone sent to us) - decline it
            await incomingRef.remove();
            
            // Notify them it was declined so they can remove from their outgoing
            await firebase.database().ref(`users/${friendUid}/friendRequestDeclined/${currentUser.uid}`).set({
                timestamp: Date.now()
            });
            
            console.log('Declined incoming friend request');
        } else if (outgoingSnapshot.exists()) {
            // It's an outgoing request (we sent to them) - cancel it
            await outgoingRef.remove();
            
            // Notify them to remove from their incoming
            await firebase.database().ref(`users/${friendUid}/friendRequestCancelled/${currentUser.uid}`).set({
                timestamp: Date.now()
            });
            
            console.log('Cancelled outgoing friend request');
        }
        
        // Reload friends list
        await loadFriends();
        
    } catch (error) {
        console.error('Error declining/cancelling friend request:', error);
        alert('Failed to decline/cancel friend request: ' + error.message);
    }
}

// Remove friend
async function removeFriend(friendUid, friendNickname) {
    const confirmed = confirm(`Remove ${friendNickname} from your friends list?`);
    
    if (!confirmed) return;
    
    try {
        // Remove from both friends lists
        await firebase.database().ref(`users/${currentUser.uid}/friends/${friendUid}`).remove();
        await firebase.database().ref(`users/${friendUid}/friends/${currentUser.uid}`).remove();
        
        console.log('Friend removed');
        loadFriends();
        
    } catch (error) {
        console.error('Error removing friend:', error);
        alert('Failed to remove friend');
    }
}

// Load friends and requests
async function loadFriends() {
    if (!currentUser) return;
    
    try {
        // Load your friend code
        const codeSnapshot = await firebase.database().ref(`users/${currentUser.uid}/friendCode`).once('value');
        const yourCode = codeSnapshot.val();
        
        const codeEl = document.getElementById('yourFriendCode');
        if (codeEl) {
            codeEl.textContent = yourCode || 'Generating...';
        }
        
        // If no code yet, wait for initializeFriendCode to finish
        if (!yourCode) {
            console.log('Waiting for friend code generation...');
            // Wait a bit and try again
            setTimeout(loadFriends, 1000);
            return;
        }
        
        // Load friends
        const friendsSnapshot = await firebase.database().ref(`users/${currentUser.uid}/friends`).once('value');
        const friends = friendsSnapshot.val() || {};
        currentFriends = Object.entries(friends);
        
        // Load incoming requests
        const incomingSnapshot = await firebase.database().ref(`users/${currentUser.uid}/friendRequests/incoming`).once('value');
        const incoming = incomingSnapshot.val() || {};
        pendingRequests.incoming = Object.entries(incoming);
        
        // Load outgoing requests
        const outgoingSnapshot = await firebase.database().ref(`users/${currentUser.uid}/friendRequests/outgoing`).once('value');
        const outgoing = outgoingSnapshot.val() || {};
        pendingRequests.outgoing = Object.entries(outgoing);
        
        // Update UI
        renderFriendsList();
        renderFriendRequests();
        
        // Update badge
        updateFriendsBadge();
        
    } catch (error) {
        console.error('Error loading friends:', error);
    }
}

// Render friends list
function renderFriendsList() {
    const container = document.getElementById('friendsList');
    
    if (currentFriends.length === 0) {
        container.innerHTML = '<div class="empty-state">No friends yet. Share your friend code!</div>';
        return;
    }
    
    container.innerHTML = '';
    
    currentFriends.forEach(([uid, friend]) => {
        const item = document.createElement('div');
        item.className = 'friend-item';
        item.innerHTML = `
            <img src="${friend.photoURL || 'https://via.placeholder.com/40'}" class="friend-avatar" alt="">
            <div class="friend-info">
                <div class="friend-name">${friend.nickname}</div>
                <div class="friend-since">Friends since ${formatDate(friend.since)}</div>
            </div>
            <button class="btn-friend-view" onclick="viewFriendStats('${uid}', '${friend.nickname}')">View Stats</button>
            <button class="btn-friend-remove" onclick="removeFriend('${uid}', '${friend.nickname}')">Remove</button>
        `;
        container.appendChild(item);
    });
}

// Render friend requests
function renderFriendRequests() {
    const container = document.getElementById('friendRequestsList');
    
    if (pendingRequests.incoming.length === 0 && pendingRequests.outgoing.length === 0) {
        container.innerHTML = '<div class="empty-state">No pending requests</div>';
        return;
    }
    
    container.innerHTML = '';
    
    // Incoming requests
    pendingRequests.incoming.forEach(([uid, request]) => {
        const item = document.createElement('div');
        item.className = 'request-item';
        item.innerHTML = `
            <img src="${request.fromPhotoURL || 'https://via.placeholder.com/40'}" class="request-avatar" alt="">
            <div class="request-info">
                <div class="request-name">${request.fromNickname}</div>
                <div class="request-time">${formatTimeAgo(request.timestamp)}</div>
            </div>
            <button class="btn-request-accept" onclick="acceptFriendRequest('${uid}')">✓</button>
            <button class="btn-request-decline" onclick="declineFriendRequest('${uid}')">✗</button>
        `;
        container.appendChild(item);
    });
    
    // Outgoing requests
    pendingRequests.outgoing.forEach(([uid, request]) => {
        const item = document.createElement('div');
        item.className = 'request-item outgoing';
        item.innerHTML = `
            <div class="request-info">
                <div class="request-name">Request sent</div>
                <div class="request-time">Waiting for response...</div>
            </div>
            <button class="btn-request-cancel" onclick="declineFriendRequest('${uid}')">Cancel</button>
        `;
        container.appendChild(item);
    });
}

// Update friends badge
function updateFriendsBadge() {
    const btn = document.getElementById('btnFriends');
    if (!btn) return;
    
    const count = pendingRequests.incoming.length;
    
    if (count > 0) {
        if (!document.getElementById('friendsBadge')) {
            const badge = document.createElement('span');
            badge.id = 'friendsBadge';
            badge.className = 'notification-badge';
            badge.textContent = count;
            btn.appendChild(badge);
        } else {
            document.getElementById('friendsBadge').textContent = count;
        }
    } else {
        const badge = document.getElementById('friendsBadge');
        if (badge) badge.remove();
    }
}

// Listen to friend requests in real-time
function listenToFriendRequests() {
    if (!currentUser) return;
    
    // Listen for incoming friend requests (from your own data)
    firebase.database().ref(`users/${currentUser.uid}/friendRequests/incoming`).on('value', () => {
        loadFriends();
    });
    
    // Listen for NEW friend request notifications (when someone sends you a request)
    firebase.database().ref(`users/${currentUser.uid}/friendRequestReceived`).on('child_added', async (snapshot) => {
        const senderUid = snapshot.key;
        const requestData = snapshot.val();
        
        console.log('New friend request from:', requestData.fromNickname);
        
        try {
            // Add to YOUR incoming requests
            await firebase.database().ref(`users/${currentUser.uid}/friendRequests/incoming/${senderUid}`).set(requestData);
            
            // Remove the notification
            await firebase.database().ref(`users/${currentUser.uid}/friendRequestReceived/${senderUid}`).remove();
            
            console.log('✅ Added request to incoming');
            
            // Reload friends list to show new request
            await loadFriends();
            
        } catch (error) {
            console.error('Error processing friend request notification:', error);
        }
    });
    
    // Listen for friend accepts (when someone accepts YOUR request)
    firebase.database().ref(`users/${currentUser.uid}/friendAccepted`).on('child_added', async (snapshot) => {
        const friendUid = snapshot.key;
        const friendData = snapshot.val();
        
        console.log('Friend accepted your request:', friendData.nickname);
        
        try {
            // Add them to YOUR friends list
            await firebase.database().ref(`users/${currentUser.uid}/friends/${friendUid}`).set({
                nickname: friendData.nickname,
                photoURL: friendData.photoURL,
                since: friendData.since
            });
            
            // Remove from YOUR outgoing requests
            await firebase.database().ref(`users/${currentUser.uid}/friendRequests/outgoing/${friendUid}`).remove();
            
            // Remove the accept notification
            await firebase.database().ref(`users/${currentUser.uid}/friendAccepted/${friendUid}`).remove();
            
            console.log('✅ Added friend to your list');
            
            // Show notification
            alert(`${friendData.nickname} accepted your friend request! 🎉`);
            
            // Reload friends list
            await loadFriends();
            
        } catch (error) {
            console.error('Error processing friend accept:', error);
        }
    });
    
    // Listen for friend request declines (when someone declines YOUR request)
    firebase.database().ref(`users/${currentUser.uid}/friendRequestDeclined`).on('child_added', async (snapshot) => {
        const friendUid = snapshot.key;
        
        console.log('Friend request was declined');
        
        try {
            // Remove from YOUR outgoing requests
            await firebase.database().ref(`users/${currentUser.uid}/friendRequests/outgoing/${friendUid}`).remove();
            
            // Remove the decline notification
            await firebase.database().ref(`users/${currentUser.uid}/friendRequestDeclined/${friendUid}`).remove();
            
            console.log('✅ Removed declined request from outgoing');
            
            // Reload friends list
            await loadFriends();
            
        } catch (error) {
            console.error('Error processing friend decline:', error);
        }
    });
    
    // Listen for friend request cancellations (when someone cancels their request to you)
    firebase.database().ref(`users/${currentUser.uid}/friendRequestCancelled`).on('child_added', async (snapshot) => {
        const friendUid = snapshot.key;
        
        console.log('Friend request was cancelled by sender');
        
        try {
            // Remove from YOUR incoming requests
            await firebase.database().ref(`users/${currentUser.uid}/friendRequests/incoming/${friendUid}`).remove();
            
            // Remove the cancel notification
            await firebase.database().ref(`users/${currentUser.uid}/friendRequestCancelled/${friendUid}`).remove();
            
            console.log('✅ Removed cancelled request from incoming');
            
            // Reload friends list
            await loadFriends();
            
        } catch (error) {
            console.error('Error processing friend cancel:', error);
        }
    });
}

// Format date
function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Initialize when page loads
setTimeout(() => {
    initFriendsSystem();
}, 300);


// Update friends count displays
function updateFriendsCount() {
    const friendsCountEl = document.getElementById('friendsCount');
    const requestsCountEl = document.getElementById('requestsCount');
    
    if (friendsCountEl) friendsCountEl.textContent = currentFriends.length;
    if (requestsCountEl) requestsCountEl.textContent = pendingRequests.incoming.length + pendingRequests.outgoing.length;
}

// Call this in loadFriends
const originalLoadFriends = loadFriends;
loadFriends = async function() {
    await originalLoadFriends();
    updateFriendsCount();
};


// View friend stats
async function viewFriendStats(friendUid, friendNickname) {
    try {
        // Load friend's data
        const friendSnapshot = await firebase.database().ref(`users/${friendUid}`).once('value');
        const friendData = friendSnapshot.val();
        
        if (!friendData) {
            alert('Could not load friend data');
            return;
        }
        
        const stats = friendData.stats || { total: 0, wins: 0, losses: 0, xp: 0, level: 1 };
        const winRate = stats.total > 0 ? Math.round((stats.wins / stats.total) * 100) : 0;
        const level = stats.level || 1;
        const xp = stats.xp || 0;
        const levelInfo = getLevelFromXP(xp);
        const xpInLevel = levelInfo.xpInCurrentLevel;
        const xpForNextLevel = levelInfo.xpForNextLevel;
        
        // Update modal content
        document.getElementById('friendStatsNickname').textContent = friendNickname;
        document.getElementById('friendStatsAvatar').src = friendData.photoURL || 'https://via.placeholder.com/80';
        document.getElementById('friendStatLevel').textContent = level;
        document.getElementById('friendStatTotal').textContent = stats.total;
        document.getElementById('friendStatWins').textContent = stats.wins;
        document.getElementById('friendStatLosses').textContent = stats.losses;
        document.getElementById('friendStatWinRate').textContent = winRate + '%';
        document.getElementById('friendStatXP').textContent = xpInLevel + ' / ' + xpForNextLevel + ' XP';
        
        // Open modal
        document.getElementById('friendStatsModal').showModal();
        
    } catch (error) {
        console.error('Error loading friend stats:', error);
        alert('Failed to load friend stats');
    }
}


// ═══════════════════════════════════════════════════════════════
// COMPLETE NEW TOP BAR INTEGRATION
// ═══════════════════════════════════════════════════════════════

// Sort ghosts alphabetically
GHOSTS.sort((a, b) => a.name.localeCompare(b.name));

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing new top bar...');
    
    // ============================================================
    // 1. SHARE/GROUP JOURNAL BUTTON
    // ============================================================
    const newShareBtn = document.getElementById('btnShare');
    const oldGroupBtn = document.getElementById('btnGroupJournal');
    
    if (newShareBtn && oldGroupBtn) {
        // Click handler
        newShareBtn.addEventListener('click', function() {
            console.log('Share button clicked');
            oldGroupBtn.click();
        });
        
        // Sync active pulsing state every 500ms
        setInterval(function() {
            if (oldGroupBtn.classList.contains('active')) {
                newShareBtn.classList.add('active');
                newShareBtn.style.animation = 'pulse-cyan 2s infinite';
                newShareBtn.style.background = 'var(--acc-cyan)';
                newShareBtn.style.color = '#000';
                newShareBtn.style.borderColor = 'var(--acc-cyan)';
            } else {
                newShareBtn.classList.remove('active');
                newShareBtn.style.animation = '';
                newShareBtn.style.background = 'var(--bg-card)';
                newShareBtn.style.color = 'var(--text-muted)';
                newShareBtn.style.borderColor = 'var(--border)';
            }
        }, 500);
    }
    
    // ============================================================
    // 2. FRIENDS BUTTON
    // ============================================================
    setTimeout(function() {
        const newFriendsBtn = document.getElementById('btnFriends');
        
        if (newFriendsBtn && typeof openFriendsModal === 'function') {
            // Remove existing listeners
            const cleanBtn = newFriendsBtn.cloneNode(true);
            newFriendsBtn.parentNode.replaceChild(cleanBtn, newFriendsBtn);
            
            // Add click handler
            cleanBtn.addEventListener('click', function() {
                console.log('Friends button clicked');
                openFriendsModal();
            });
            
            // Sync badge
            setInterval(function() {
                const oldBadge = document.querySelector('.header-tools #friendsBadge');
                const newBadge = document.getElementById('friendsBadge');
                if (oldBadge && newBadge) {
                    newBadge.style.display = oldBadge.style.display;
                    newBadge.textContent = oldBadge.textContent;
                }
            }, 1000);
        }
    }, 1000);
    
    // ============================================================
    // 3. AUTHENTICATION SYNC
    // ============================================================
    const newLoginBtn = document.getElementById('btnGoogleLoginNew');
    const oldLoginBtn = document.getElementById('btnGoogleLogin');
    
    if (newLoginBtn && oldLoginBtn) {
        newLoginBtn.addEventListener('click', function() {
            console.log('Login button clicked');
            oldLoginBtn.click();
        });
    }
    
    // Sync auth display
    let lastUserState = null;
    setInterval(function() {
        const oldAuthView = document.getElementById('authView');
        const oldUserView = document.getElementById('userView');
        const newAuthView = document.getElementById('authViewNew');
        const newUserView = document.getElementById('userViewNew');
        
        if (!oldAuthView || !oldUserView || !newAuthView || !newUserView) return;
        
        // Check if user is logged in
        const isLoggedIn = oldUserView.style.display !== 'none';
        
        if (isLoggedIn) {
            // Hide login, show user
            newAuthView.style.display = 'none';
            newUserView.style.display = 'flex';
            
            // Get user data
            const avatar = oldUserView.querySelector('#userAvatar');
            const nickname = oldUserView.querySelector('#userNickname');
            const level = oldUserView.querySelector('#userLevel');
            
            if (avatar && nickname && level) {
                const avatarSrc = avatar.src || avatar.getAttribute('src') || '';
                console.log('📸 Avatar URL:', avatarSrc);
                
                const userState = `${avatarSrc}|${nickname.textContent}|${level.textContent}`;
                
                // Only update if user data changed
                if (userState !== lastUserState) {
                    lastUserState = userState;
                    
                    // Use avatar URL or fallback to generic icon
                    const avatarHTML = avatarSrc && avatarSrc !== '' 
                        ? `<img src="${avatarSrc}" alt="" style="width: 22px; height: 22px; border-radius: 50%; border: 2px solid var(--acc-cyan);">`
                        : `<div style="width: 22px; height: 22px; border-radius: 50%; border: 2px solid var(--acc-cyan); background: var(--acc-cyan); display: flex; align-items: center; justify-content: center; font-size: 0.8rem;">👤</div>`;
                    
                    newUserView.innerHTML = `
                        <button class="btn-user-new" id="btnUserMenuNew" onclick="openNewUserMenu()" style="background: rgba(6, 182, 212, 0.1); border: 1px solid var(--acc-cyan); padding: 4px 8px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 6px; font-family: var(--font-hud); transition: all 0.2s;">
                            ${avatarHTML}
                            <span style="color: var(--text-main); font-weight: 700; font-size: 0.75rem; max-width: 80px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${nickname.textContent}</span>
                            <span style="background: var(--acc-cyan); color: #000; padding: 2px 5px; border-radius: 8px; font-size: 0.65rem; font-weight: 900;">Lvl ${level.textContent}</span>
                        </button>
                    `;
                }
            }
        } else {
            // User is logged out
            newAuthView.style.display = 'flex';
            newUserView.style.display = 'none';
            lastUserState = null;
        }
    }, 1000);
    
    // ============================================================
    // 4. NAVIGATION HIGHLIGHTING
    // ============================================================
    function highlightActiveSection() {
        const sections = ['ghosts', 'maps', 'equipment', 'mechanics', 'strategy'];
        
        sections.forEach(sectionId => {
            const section = document.getElementById(`section-${sectionId}`);
            const navBtn = document.querySelector(`button[onclick="showSection('${sectionId}')"]`);
            
            if (section && navBtn) {
                if (section.style.display !== 'none') {
                    navBtn.style.borderColor = 'var(--acc-cyan)';
                    navBtn.style.background = 'rgba(6, 182, 212, 0.1)';
                    navBtn.style.color = '#fff';
                } else {
                    navBtn.style.borderColor = 'transparent';
                    navBtn.style.background = 'transparent';
                    navBtn.style.color = 'var(--text-muted)';
                }
            }
        });
    }
    
    const _origShowSection = showSection;
    window.showSection = function(sectionId) {
        _origShowSection(sectionId);
        highlightActiveSection();
    };
    
    setTimeout(highlightActiveSection, 200);
    
    // ============================================================
    // 5. SIDEBAR POPULATION
    // ============================================================
    const evidenceContainer = document.getElementById('sidebarEvidence');
    if (evidenceContainer) {
        evidenceContainer.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 6px;">
                <button onclick="cycleEvidence('emf')" oncontextmenu="ruleOutEvidence('emf', event)" data-ev="emf" class="sidebar-btn">
                    <span style="font-size: 1rem;">📶</span>
                    <span style="font-family: var(--font-hud); font-size: 0.75rem; font-weight: 600; color: var(--text-main); flex: 1;">EMF 5</span>
                </button>
                <button onclick="cycleEvidence('box')" oncontextmenu="ruleOutEvidence('box', event)" data-ev="box" class="sidebar-btn">
                    <span style="font-size: 1rem;">📦</span>
                    <span style="font-family: var(--font-hud); font-size: 0.75rem; font-weight: 600; color: var(--text-main); flex: 1;">BOX</span>
                </button>
                <button onclick="cycleEvidence('uv')" oncontextmenu="ruleOutEvidence('uv', event)" data-ev="uv" class="sidebar-btn">
                    <span style="font-size: 1rem;">💡</span>
                    <span style="font-family: var(--font-hud); font-size: 0.75rem; font-weight: 600; color: var(--text-main); flex: 1;">UV</span>
                </button>
                <button onclick="cycleEvidence('orb')" oncontextmenu="ruleOutEvidence('orb', event)" data-ev="orb" class="sidebar-btn">
                    <span style="font-size: 1rem;">🔮</span>
                    <span style="font-family: var(--font-hud); font-size: 0.75rem; font-weight: 600; color: var(--text-main); flex: 1;">ORBS</span>
                </button>
                <button onclick="cycleEvidence('writing')" oncontextmenu="ruleOutEvidence('writing', event)" data-ev="writing" class="sidebar-btn">
                    <span style="font-size: 1rem;">✍️</span>
                    <span style="font-family: var(--font-hud); font-size: 0.75rem; font-weight: 600; color: var(--text-main); flex: 1;">WRITING</span>
                </button>
                <button onclick="cycleEvidence('freezing')" oncontextmenu="ruleOutEvidence('freezing', event)" data-ev="freezing" class="sidebar-btn">
                    <span style="font-size: 1rem;">❄️</span>
                    <span style="font-family: var(--font-hud); font-size: 0.75rem; font-weight: 600; color: var(--text-main); flex: 1;">FREEZE</span>
                </button>
                <button onclick="cycleEvidence('dots')" oncontextmenu="ruleOutEvidence('dots', event)" data-ev="dots" class="sidebar-btn">
                    <span style="font-size: 1rem;">🎯</span>
                    <span style="font-family: var(--font-hud); font-size: 0.75rem; font-weight: 600; color: var(--text-main); flex: 1;">D.O.T.S</span>
                </button>
            </div>
        `;
    }
    
    const filtersContainer = document.getElementById('sidebarFilters');
    if (filtersContainer) {
        filtersContainer.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 6px;">
                <button onclick="toggleFilter('fast')" data-filter="fast" class="sidebar-btn">
                    <span style="font-size: 1rem;">⚡</span>
                    <span style="font-family: var(--font-hud); font-size: 0.75rem; font-weight: 600; color: var(--text-main);">Fast Speed</span>
                </button>
                <button onclick="toggleFilter('early')" data-filter="early" class="sidebar-btn">
                    <span style="font-size: 1rem;">⚠️</span>
                    <span style="font-family: var(--font-hud); font-size: 0.75rem; font-weight: 600; color: var(--text-main);">Early Hunter</span>
                </button>
                <button onclick="toggleFilter('quiet')" data-filter="quiet" class="sidebar-btn">
                    <span style="font-size: 1rem;">🟡</span>
                    <span style="font-family: var(--font-hud); font-size: 0.75rem; font-weight: 600; color: var(--text-main);">Quiet Steps</span>
                </button>
                <button onclick="toggleFilter('guarantee')" data-filter="guarantee" class="sidebar-btn">
                    <span style="font-size: 1rem;">✨</span>
                    <span style="font-family: var(--font-hud); font-size: 0.75rem; font-weight: 600; color: var(--text-main);">Guaranteed Ev</span>
                </button>
            </div>
        `;
    }
    
    // Hook submit button
    const btnSubmit = document.getElementById('btnSubmitSidebar');
    if (btnSubmit) {
        btnSubmit.addEventListener('click', openGuessModal);
    }
    
    // Timer sync
    setInterval(function() {
        const sidebarInv = document.getElementById('sidebarInvestigation');
        const timerEl = document.getElementById('sidebarTimer');
        
        if (!currentInvestigation) {
            if (sidebarInv) sidebarInv.style.display = 'none';
            return;
        }
        
        if (sidebarInv) sidebarInv.style.display = 'block';
        
        const elapsed = Math.floor((Date.now() - currentInvestigation.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        if (timerEl) {
            timerEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }, 1000);
    
    setTimeout(syncSidebar, 100);
});

// ============================================================
// SIDEBAR SYNC FUNCTION
// ============================================================
function syncSidebar() {
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
    
    Object.keys(app.evidence).forEach(evId => {
        const btn = document.querySelector(`#sidebarEvidence button[data-ev="${evId}"]`);
        if (btn) {
            btn.style.borderColor = 'var(--border)';
            btn.style.background = 'var(--bg-card)';
            btn.style.opacity = '1';
            btn.style.pointerEvents = 'auto';
            
            if (app.evidence[evId] === 1) {
                btn.style.borderColor = 'var(--acc-green)';
                btn.style.background = 'rgba(16, 185, 129, 0.1)';
            } else if (app.evidence[evId] === 2) {
                btn.style.borderColor = 'var(--acc-red)';
                btn.style.background = 'rgba(239, 68, 68, 0.1)';
                btn.style.opacity = '0.6';
            } else if (app.evidence[evId] === 0 && matches.length < GHOSTS.length && !possibleEv.has(evId)) {
                btn.style.opacity = '0.3';
                btn.style.pointerEvents = 'none';
            }
        }
    });
    
    document.querySelectorAll('#sidebarFilters button').forEach(btn => {
        const filterId = btn.dataset.filter;
        btn.style.borderColor = 'var(--border)';
        btn.style.background = 'var(--bg-card)';
        
        if (app.activeFilters.has(filterId)) {
            btn.style.borderColor = 'var(--acc-purple)';
            btn.style.background = 'rgba(139, 92, 246, 0.1)';
        }
    });
    
    const sidebarCount = document.getElementById('sidebarCount');
    const mainCount = document.getElementById('matchCount');
    if (sidebarCount && mainCount) {
        sidebarCount.textContent = mainCount.textContent;
    }
}

// ============================================================
// EVIDENCE FUNCTIONS
// ============================================================
function cycleEvidence(evId) {
    if (app.evidence[evId] === 0) {
        app.evidence[evId] = 1;
    } else {
        app.evidence[evId] = 0;
    }
    renderEvidence();
    updateBoard();
}

function ruleOutEvidence(evId, event) {
    event.preventDefault();
    if (app.evidence[evId] === 0) {
        app.evidence[evId] = 2;
    } else {
        app.evidence[evId] = 0;
    }
    renderEvidence();
    updateBoard();
}

// ============================================================
// FILTER FUNCTION
// ============================================================
function toggleFilter(filterId) {
    if (app.activeFilters.has(filterId)) {
        app.activeFilters.delete(filterId);
    } else {
        app.activeFilters.add(filterId);
    }
    renderFilters();
    updateBoard();
}

// ============================================================
// HOOK INTO UPDATEBOARD
// ============================================================
const _origUpdateBoard = updateBoard;
updateBoard = function() {
    _origUpdateBoard();
    
    // Highlight final ghost
    const matches = document.querySelectorAll('.card');
    if (matches.length === 1) {
        matches[0].style.border = '2px solid var(--acc-green)';
        matches[0].style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.3)';
        matches[0].style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, var(--bg-card) 100%)';
    }
    
    syncSidebar();
};

// Add sidebar button styling
const sidebarCSS = document.createElement('style');
sidebarCSS.textContent = `
    .sidebar-btn {
        background: var(--bg-card);
        border: 1px solid var(--border);
        padding: 8px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        transition: 0.2s;
    }
    .sidebar-btn:hover {
        border-color: var(--acc-cyan);
        background: rgba(6, 182, 212, 0.05);
    }
`;
document.head.appendChild(sidebarCSS);


// ============================================================
// GLOBAL USER MENU FUNCTION
// ============================================================
window.openNewUserMenu = function() {
    console.log('🔵 New user menu button clicked!');
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        console.log('🔵 Toggling dropdown, current display:', dropdown.style.display);
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        console.log('🔵 New display:', dropdown.style.display);
    } else {
        console.error('❌ User dropdown not found!');
    }
};

