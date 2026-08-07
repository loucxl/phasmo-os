// ============================================================
// PhasmoOS - 04-equipment.js
// EQUIPMENT database, unlock levels, equipment/manual tabs, timer reset, XP + level helpers
// Split from script.js - load order matters (see index.html)
// ============================================================

// --- EQUIPMENT DATABASE ---
const EQUIPMENT = {
    detection: [
        { name: "EMF Reader", tier: "Starter", cost: "$45", usage: "Detects ghost interactions and EMF Level 5 evidence", mechanics: "EMF 2: Interaction, EMF 3: Thrown object, EMF 5: EVIDENCE (ghost ability)", tips: "Drop in active area. Check after every interaction. Level 5 is rare but unmistakable.", range: "~5m detection radius" },
        { name: "Spirit Box", tier: "Starter", cost: "$50", usage: "Ask questions. Ghost may respond verbally. Evidence = any response.", mechanics: "Works in dark + alone (most ghosts) or anywhere (Deogen, Moroi). Must say trigger words.", tips: "Common questions: 'Where are you?', 'How old?', 'Give us a sign'. Be in dark, alone.", range: "Must be in same room as ghost" },
        { name: "UV Flashlight", tier: "Starter", cost: "$40", usage: "Reveals fingerprints on doors/windows. Evidence = ANY UV print.", mechanics: "Prints appear after ghost touches surface. Last 60s (30s Nightmare). Check doors/light switches.", tips: "Combine with glowsticks for constant coverage. Obake = 6 fingers.", range: "Shine directly on surface" },
        { name: "Photo Camera", tier: "Starter", cost: "$40", usage: "Take photos for money. Ghost photo, interactions, fingerprints, dead bodies.", mechanics: "Shots per camera depend on tier; the journal stores up to 10 photos. Ghost photo = high reward. Phantom vanishes from sight when photographed.", tips: "Save photos for ghost events/hunts. Bone photos = easy money.", range: "Must have subject in frame" },
        { name: "Sound Recorder", tier: "Media", cost: "$30", usage: "Records paranormal audio for the Media tab and extra rewards.", mechanics: "Hold USE while aiming at/near valid sounds. Higher tiers make it easier to confirm successful recordings.", tips: "Use it for paranormal voices, Spirit Box responses, EMF 5 sounds, airball events, ghost writing, crucifix burns, and cursed item audio.", range: "Sound-based capture range" },
        { name: "Video Camera", tier: "Starter", cost: "$50", usage: "Monitor remotely for Ghost Orbs. Required for Goryo D.O.T.S", mechanics: "Place on tripod. Enable Night Vision. Check monitor in truck. Orbs = small white dots.", tips: "Cover multiple angles. Goryo DOTS only shows on camera, not naked eye.", range: "Based on camera view angle" },
        { name: "Thermometer", tier: "Starter", cost: "$30", usage: "Find cold rooms. Freezing Temps = below 0°C/32°F evidence.", mechanics: "Rooms cool over time. Breaker OFF = faster cooling. Yellow/Orange = room temp, Blue/Purple = active area", tips: "Sweep building early. Ghost room always coldest. Helps locate ghost quickly.", range: "Point and shoot - instant reading" },
        { name: "D.O.T.S Projector", tier: "Upgraded", cost: "$65", usage: "Projects green laser grid. Ghost silhouette = evidence.", mechanics: "Must be placed on wall/floor. Ghost walks through occasionally. Goryo = camera-only visibility.", tips: "Place facing open areas. Combine with video camera. May take time to show.", range: "~5m projection cone" },
        { name: "Ghost Writing Book", tier: "Starter", cost: "$40", usage: "Ghost writes/draws in book = evidence. Place in active area.", mechanics: "Ghost must be nearby. Can write full sentences, draw symbols, or scribble. Check periodically.", tips: "Place in center of suspected room. Ghost won't always write immediately. Be patient.", range: "Must be in ghost's presence" },
        { name: "Sound Sensor", tier: "Optional", cost: "$80", usage: "Detects sounds in area. Shows on truck monitor. Great for large maps.", mechanics: "Place in hallways/key rooms. Monitor shows activity level (bars). Tracks roaming.", tips: "Use multiple to triangulate ghost location. Essential on large maps.", range: "Wide cone detection (~10m)" },
        { name: "Motion Sensor", tier: "Optional", cost: "$100", usage: "Detects movement through laser beam. Lights up green on truck.", mechanics: "Place in doorways/hallways. Triggers when anything crosses beam. Tracks roaming patterns.", tips: "Place at exits of suspected rooms. See if ghost roams or stays put.", range: "Laser beam line-of-sight" },
        { name: "Parabolic Microphone", tier: "Upgraded", cost: "$50", usage: "Listen to distant sounds through walls. Special ghost sounds detectable.", mechanics: "Point at walls/doors. Picks up ghost vocals, footsteps, special sounds (Banshee scream, Moroi breathing)", tips: "Excellent for location finding on big maps. Can identify Banshee/Moroi instantly.", range: "30m+ through walls" },
        { name: "Head Mounted Camera", tier: "Optional", cost: "$60", usage: "Player-worn camera visible on truck monitor. Team coordination.", mechanics: "Worn by player. Team watches on monitor. Can spot Ghost Orbs from player POV.", tips: "Useful for solo players or teams wanting extra eyes. Can catch evidence remotely.", range: "Player's field of view" }
    ],
    protection: [
        { name: "Crucifix", tier: "Essential", cost: "$30", usage: "Prevents hunts from starting within range. T1 blocks 1 hunt; T2/T3 block 2.", mechanics: "Range by tier: T1 3m / T2 4m / T3 5m (+50% vs Demon: 4.5/6/7.5m). Works held, thrown, or placed. After a block the ghost waits 25s (20s Demon) before trying again. T3 with both charges left can block a cursed hunt (uses both charges).", tips: "Placing it on the floor in the centre of the active area frees your hands - but it does work while held. Both the ghost's feet AND head (1.5m up) must be in range, so T1 range is effectively tight. Range ignores walls.", range: "T1 3m / T2 4m / T3 5m (+50% vs Demon)", uses: "T1: 1 · T2/T3: 2" },
        { name: "Smudge Sticks", tier: "Essential", cost: "$15", usage: "Burn to repel/blind ghost. Prevents hunts or creates escape.", mechanics: "Outside hunt: Prevents hunts for 90s (180s Spirit, 60s Demon). During hunt: Blinds ghost ~5s (~7s Moroi)", tips: "Light with lighter. Use in active area to prevent hunts or while running from hunts.", range: "~6m effect radius", uses: "1 per stick" },
        { name: "Sanity Pills", tier: "Essential", cost: "$20", usage: "Restores sanity. Amount depends on difficulty, not tier.", mechanics: "Restores: Amateur 40% / Intermediate 35% / Professional 30% / Nightmare 25% / Insanity 20%. Tier changes speed: T1 over 20s, T2/T3 over 10s. T3 also grants a 10s infinite-sprint boost. Can't be taken above 95% sanity.", tips: "Max 4 in the team loadout. Save for after early evidence, before dangerous hunt ranges. Cures the Moroi curse. T3's sprint boost can even be used mid-hunt to escape.", range: "N/A (consumable)", uses: "Max 4 per contract" },
        { name: "Candle", tier: "Starter", cost: "$15", usage: "Prevents sanity drain when near lit candle. Onryo interaction.", mechanics: "Firelights slow passive sanity drain (amount depends on tier) while you are nearby. Ghost can blow them out. Onryo treats flames as crucifixes - blocks its hunt attempts within 4m.", tips: "Light in safe rooms. Keep lighter ready to relight. Multiple candles = large safe zone.", range: "~3m sanity protection", uses: "Unlimited (can be blown out)" },
        { name: "Lighter", tier: "Starter", cost: "$15", usage: "Lights candles and smudge sticks. No battery.", mechanics: "Infinite uses. Required for smudging. Lights candles for sanity protection.", tips: "Always have one. Essential for smudge sticks and candles.", range: "Touch-based", uses: "Infinite" }
    ],
    utility: [
        { name: "Flashlight", tier: "Starter", cost: "$30", usage: "Basic handheld light. Essential for dark areas.", mechanics: "Will flicker near ghost when hunting. Provides basic illumination.", tips: "Default light source. Infinite use.", range: "Medium cone" },
        { name: "Strong Flashlight", tier: "Upgraded", cost: "$50", usage: "Brighter, wider beam flashlight. Better coverage.", mechanics: "Brighter and wider than normal flashlight but still flickers when ghost hunts. Premium light source.", tips: "Worth the upgrade for large dark maps (Prison, Asylum). Much better visibility.", range: "Wide cone (brighter)" },
        { name: "Glowstick", tier: "Utility", cost: "$20", usage: "Drop for persistent UV light. Reveals fingerprints constantly.", mechanics: "Drop and leave. Doesn't require holding. Reveals UV evidence while you work elsewhere.", tips: "Place near doors/light switches. Frees hands. Great for salt piles too.", battery: "Infinite (no battery)", range: "~2m UV radius" },
        { name: "Salt", tier: "Detection", cost: "$15", usage: "Place in doorways. Tracks movement and enables Wraith checks.", mechanics: "Ghosts can disturb salt when they step in it. Wraith will not disturb salt. Tier III salt can slow some ghosts temporarily.", tips: "Place in doorways and hallways. Tracks roaming. Wraith test = salt not disturbed after repeated passes.", range: "Pile covers ~0.5m", uses: "1 per pile" },
        { name: "Incense", tier: "Alternative", cost: "$15", usage: "Same as smudge sticks. Ceremonial version.", mechanics: "Identical mechanics to smudge sticks. Same timers, same effect.", tips: "No functional difference from smudge sticks. Use interchangeably.", range: "~6m effect radius", uses: "1 per stick" },
        { name: "Tripod", tier: "Optional", cost: "$20", usage: "Holds video cameras at fixed angles. Expands monitoring coverage.", mechanics: "Place anywhere. Mount video camera. Stable coverage of room/hallway.", tips: "Essential for multi-camera setups. Cover active area + nearby areas.", range: "N/A (mounting tool)" }
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

    app.search.equipmentTab = category;
    const query = app.search.equipment || '';

    let itemsWithCategory = [];
    if (query) {
        Object.entries(EQUIPMENT).forEach(([cat, items]) => {
            items.forEach(item => {
                if (equipmentMatchesSearch(item, cat, query)) {
                    itemsWithCategory.push({ item, category: cat });
                }
            });
        });
    } else {
        itemsWithCategory = (EQUIPMENT[category] || []).map(item => ({ item, category }));
    }

    const meta = document.getElementById('equipmentSearchMeta');
    if (meta) {
        if (query) {
            meta.style.display = 'block';
            meta.textContent = `Showing ${itemsWithCategory.length} equipment item${itemsWithCategory.length === 1 ? '' : 's'} with name matching “${query}” across all tabs`;
        } else {
            meta.style.display = 'none';
            meta.textContent = '';
        }
    }

    if (itemsWithCategory.length === 0) {
        content.innerHTML = `<div class="search-empty-state"><strong>No equipment found</strong><span>Search now only checks equipment names. Try the card name, e.g. EMF, Reader, Crucifix, or Flashlight.</span></div>`;
        return;
    }

    let html = '<div class="equipment-list">';

    itemsWithCategory.forEach(({ item, category: itemCategory }) => {
        const categoryLabel = itemCategory.charAt(0).toUpperCase() + itemCategory.slice(1);
        html += `
            <div class="equipment-card">
                <div class="equip-header">
                    <h3 class="equip-name">${item.name}</h3>
                    <div class="equip-badges">
                        ${query ? `<span class="category-badge">${categoryLabel}</span>` : ''}
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
                    <span class="tip-icon">\uD83D\uDCA1</span>
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

// Footer hunt-cooldown timer removed (Aug 2026) - resetTimer deleted with it

// Sort ghosts alphabetically
GHOSTS.sort((a, b) => a.name.localeCompare(b.name));

// kick off
init();
// initGroupJournal() call moved to the end of 05-group-journal.js
// (cross-file hoisting fix, Aug 2026 - it must run AFTER its definitions load)

// Initialize equipment when page loads
window.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (window.showEquipTab && document.getElementById('equip-content')) {
            window.showEquipTab('detection');
        }
    }, 200);
});


// ═══════════════════════════════════════════════════════════════
// EXPONENTIAL XP LEVELING SYSTEM (rebuilt Aug 2026)
// ═══════════════════════════════════════════════════════════════
// 5 XP per win. Cost to reach each level grows ~1.35x, so early
// levels come fast and later ones are a real grind:
//   L1 ~2 wins · L5 ~20 wins · L10 ~109 wins · L20 ~2300 wins
// getXPForLevel(n) = XP needed to go from level n-1 to level n.
// Returns whole, rounded numbers so the UI never shows decimals.

function getXPForLevel(level) {
    const BASE = 10;      // cost of level 1
    const GROWTH = 1.35;  // each level costs 35% more than the last
    return Math.round(BASE * Math.pow(GROWTH, level - 1));
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

