// ============================================================
// PhasmoOS — 03-manual-data.js
// MANUAL_DB — in-app manual content
// Split from script.js — load order matters (see index.html)
// ============================================================

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
                Orbs spawn in or near the <span class="hl-green">current active area.</span>
                <br><span class="hl-blue">Tip:</span> Place camera at head height pointing into the room, then check from the truck or a monitor.
            </p>
        </div>
        <div class="manual-entry">
            <h4>Ghost Writing</h4>
            <p class="detail-text">
                Ghost writes in the book. A book being thrown or moved is <span class="hl-red">not</span> evidence — only actual writing counts.
                <br><span class="hl-blue">Tip:</span> Use two books in the active area to speed this up, especially for shy ghosts.
            </p>
        </div>
        <div class="manual-entry">
            <h4>Freezing Temperatures</h4>
            <p class="detail-text">
                Must read <span class="hl-red">below 0°C/32°F</span> on a thermometer. <span class="hl-red">Visible breath is NOT evidence</span> — since v0.9.0, player breath appears below 5°C regardless of ghost type. Do not rely on breath alone.
                <br><span class="hl-blue">Tip:</span> Check multiple rooms. The active area is usually the coldest. Breaker ON warms rooms over time, making freezing temps harder to find if left on too long.
            </p>
        </div>
        <div class="manual-entry">
            <h4>D.O.T.S Projector</h4>
            <p class="detail-text">
                Green silhouette running through the projector area.
                Some ghosts are more visible on camera than to the naked eye.
                <br><span class="hl-blue">Tip:</span> Place DOTS in the center of the active area and watch from camera for a while.
            </p>
        </div>
    `,
    sanity: `
        <div class="manual-entry">
            <h4>Sanity Basics</h4>
            <p class="detail-text">
                Sanity drains passively while you are inside the investigation area in the dark.
                <br>&bull; Rooms with their <span class="hl-green">main lights on</span> stop passive drain (flashlights, lamps and TVs don't count).
                <br>&bull; In darkness, drain is roughly <span class="hl-red">0.09–0.12%/sec on small maps</span> (lower on bigger maps), then multiplied by difficulty. Playing solo halves it.
                <br>&bull; Ghost events, some abilities, deaths, and cursed possessions drain extra sanity on top.
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
                <br><span class="hl-red">70%</span> Demon &middot; Kormos (if you sprint near it)
                <br><span class="hl-red">65%</span> Raiju (near electronics) &middot; Dayan (moving player nearby) &middot; Obambo (aggressive)
                <br><span class="hl-red">60%</span> Mare (in the dark) &middot; Onryo &middot; Gallu (enraged)
                <br><span class="hl-red">50%</span> Standard ghosts, incl. Aswang &amp; Kormos
                <br><span class="hl-blue">40%</span> Mare (in light) &middot; Deogen &middot; Gallu (weakened) &middot; Onryo (near flame)
                <br><span class="hl-green">35%</span> Shade &middot; <span class="hl-green">10%</span> Obambo (calm)
                <br><span class="hl-blue">Special:</span> Some abilities allow hunts above usual values (e.g. Demon, Onryo's 3rd flame blow-out, cursed hunts).
            </p>
        </div>
        <div class="manual-entry">
            <h4>Sanity Pills</h4>
            <p class="detail-text">
                Pills restore a chunk of sanity depending on difficulty, not tier.
                <br>&bull; Amateur 40% &middot; Intermediate 35% &middot; Professional 30% &middot; Nightmare 25% &middot; <span class="hl-red">Insanity 20%</span>.
                <br>&bull; Higher tiers restore the same amount but faster (T1 20s, T2/T3 10s); T3 adds a 10s infinite-sprint boost.
                <br>&bull; Max 4 in the team loadout per contract; can't be used above 95% sanity.
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
                <br><span class="hl-blue">Tip:</span> Use to pinpoint the active area, but make sure your hiding route is planned first.
            </p>
        </div>
        <div class="manual-entry">
            <h4>Haunted Mirror</h4>
            <p class="detail-text">
                Shows the active area through the mirror.
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
                <br>&bull; Range by tier: <span class="hl-green">T1 3m &middot; T2 4m &middot; T3 5m</span> &mdash; <span class="hl-red">+50% against a Demon</span> (4.5m / 6m / 7.5m).
                <br>&bull; Charges: T1 blocks 1 hunt; T2 and T3 block 2. A blocked ghost waits 25s (20s for Demon) before trying again.
                <br>&bull; T3 with both charges remaining can block one <span class="hl-red">cursed hunt</span>, consuming both charges.
                <br><span class="hl-blue">Tip:</span> Works held or placed, and its range ignores walls &mdash; but placing it on the floor where the ghost stands most keeps your hands free.
            </p>
        </div>
        <div class="manual-entry">
            <h4>Smudge Sticks</h4>
            <p class="detail-text">
                Burn to repel or blind the ghost.
                <br>&bull; During a hunt, blinds and slows the ghost for a few seconds.
                <br>&bull; Outside hunts, prevents hunts for 90s (<span class="hl-green">180s for Spirit</span>, 60s for Demon). During a hunt, blinds ghost for ~5s (~7s for Moroi).
                <br><span class="hl-blue">Tip:</span> Use on the active area to buy investigation time, or as an escape tool while looping during hunts.
            </p>
        </div>
        <div class="manual-entry">
            <h4>Sanity Pills</h4>
            <p class="detail-text">
                Restores sanity depending on difficulty (40% Amateur down to 20% Insanity).
                <br>&bull; All tiers restore the same amount; higher tiers act faster, and T3 adds a 10s sprint boost.
                <br>&bull; Max 4 in the loadout per contract.
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
                <br><span class="hl-blue">Tip:</span> Drop EMF in the active area and check it after noises, door moves, or thrown items.
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

