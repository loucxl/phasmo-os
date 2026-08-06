// ============================================================
// PhasmoOS — 02-app-core.js
// App state, TempoEngine (footstep tempo tool), init, evidence/filter rendering, board logic, ghost modal
// Split from script.js — load order matters (see index.html)
// ============================================================

// --- 2. STATE ---
let app = {
    evidence: { emf:0, box:0, uv:0, orb:0, writing:0, freezing:0, dots:0 },
    activeFilters: new Set(),
    // Footer timer UI removed (Aug 2026); dur kept so group-journal sync stays
    // compatible with clients still running the old cached script.
    timer: { int: null, dur: 90 },
    search: { ghosts: '', equipment: '', equipmentTab: 'detection' }
};

const ui = {
    evBar: document.getElementById('evBar'),
    filterRow: document.getElementById('filterRow'),
    ghostGrid: document.getElementById('ghostGrid'),
    count: document.getElementById('matchCount'),
    ghostModal: document.getElementById('ghostModal'),
    manualModal: document.getElementById('manualModal')
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
            btn.querySelector('.tempo-btn-icon').textContent = '\u25A0';
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
            if (icon) icon.textContent = '\u25B6';
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

    // Footer hunt-cooldown timer removed (Aug 2026)

    // WIP banner close + remember dismissal
    const banner = document.getElementById('wipBanner');
    const bannerClose = document.getElementById('wipClose');

    if (banner && bannerClose) {
        if (localStorage.getItem('phasmo_wip_dismissed_v26') === '1') {
            banner.style.display = 'none';
        }

        bannerClose.addEventListener('click', () => {
            banner.style.display = 'none';
            localStorage.setItem('phasmo_wip_dismissed_v26', '1');
        });
    }

    // Search boxes
    const ghostSearchInput = document.getElementById('ghostSearchInput');
    const ghostSearchClear = document.getElementById('ghostSearchClear');
    if (ghostSearchInput) {
        ghostSearchInput.addEventListener('input', () => {
            app.search.ghosts = ghostSearchInput.value.trim().toLowerCase();
            updateBoard();
        });
    }
    if (ghostSearchClear) {
        ghostSearchClear.addEventListener('click', () => {
            app.search.ghosts = '';
            if (ghostSearchInput) ghostSearchInput.value = '';
            updateBoard();
            ghostSearchInput?.focus();
        });
    }

    const equipmentSearchInput = document.getElementById('equipmentSearchInput');
    const equipmentSearchClear = document.getElementById('equipmentSearchClear');
    if (equipmentSearchInput) {
        equipmentSearchInput.addEventListener('input', () => {
            app.search.equipment = equipmentSearchInput.value.trim().toLowerCase();
            if (window.showEquipTab) window.showEquipTab(app.search.equipmentTab || 'detection');
        });
    }
    if (equipmentSearchClear) {
        equipmentSearchClear.addEventListener('click', () => {
            app.search.equipment = '';
            if (equipmentSearchInput) equipmentSearchInput.value = '';
            if (window.showEquipTab) window.showEquipTab(app.search.equipmentTab || 'detection');
            equipmentSearchInput?.focus();
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
function stripHtml(text) {
    return String(text || '').replace(/<[^>]*>/g, ' ');
}

function normaliseSearchText(text) {
    return stripHtml(text).toLowerCase().replace(/\s+/g, ' ').trim();
}

function ghostMatchesSearch(g, query) {
    if (!query) return true;

    // Search only the ghost card name.
    // This prevents searches like "Spirit" from matching every ghost with Spirit Box evidence.
    const searchable = normaliseSearchText(g.name);
    return query.split(/\s+/).every(term => searchable.includes(term));
}

function equipmentMatchesSearch(item, category, query) {
    if (!query) return true;

    // Search only the equipment card name.
    // This prevents searches like "Read" from matching card body text/mechanics.
    const searchable = normaliseSearchText(item.name);
    return query.split(/\s+/).every(term => searchable.includes(term));
}

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

        if(possible && !ghostMatchesSearch(g, app.search.ghosts)) {
            possible = false;
        }

        if(possible) {
            matches.push(g);
            g.ev.forEach(e => possibleEv.add(e));
            if(g.name === 'The Mimic') possibleEv.add('orb');
        }
    });

    ui.count.textContent = matches.length;

    const ghostSearchMeta = document.getElementById('ghostSearchMeta');
    if (ghostSearchMeta) {
        if (app.search.ghosts) {
            ghostSearchMeta.style.display = 'block';
            ghostSearchMeta.textContent = `Showing ${matches.length} ghost${matches.length === 1 ? '' : 's'} with name matching “${app.search.ghosts}”`;
        } else {
            ghostSearchMeta.style.display = 'none';
            ghostSearchMeta.textContent = '';
        }
    }

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
    if (matches.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'search-empty-state';
        empty.innerHTML = `<strong>No ghosts found</strong><span>Search now only checks ghost names. Try a ghost name, clear ruled-out evidence, or remove an active filter.</span>`;
        ui.ghostGrid.appendChild(empty);
        return;
    }

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
    const forcedNote = g.forced ? `<div style="margin-top:8px; padding:6px 10px; background:rgba(6,182,212,0.1); border:1px solid rgba(6,182,212,0.3); border-radius:6px; font-size:0.82rem; color:var(--acc-cyan);">\u26A1 <strong>Guaranteed Evidence:</strong> This ghost <em>always</em> shows <strong>${g.forced.toUpperCase()}</strong> even on Nightmare/Insanity.</div>` : '';

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
            <span class="tempo-btn-icon">${isVariable ? '~' : '\u25B6'}</span>
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
                <span class="tempo-title">\uD83D\uDC5F FOOTSTEP TEMPO</span>
                <div class="beat-indicator" id="beatIndicator"></div>
                <span class="tempo-hint">Click a speed to hear it</span>
            </div>
            <div class="tempo-buttons">${tempoButtons}</div>
        </div>

        <div class="section-header">Behavior</div>
        <div class="detail-text">${g.ability}</div>
        ${forcedNote}
        <div class="section-header" style="color:#a78bfa; border-color:rgba(139,92,246,0.4);">\uD83C\uDFB2 Zero Evidence Tell</div>
        <div class="detail-text" style="color:#c4b5fd; background:rgba(139,92,246,0.08); border:1px solid rgba(139,92,246,0.25); border-radius:8px; padding:12px 14px; margin-bottom:8px;">${g.zeroEv}</div>
        <div class="section-header">\uD83D\uDD2C Confirmation Test</div>
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
            if (icon) icon.textContent = '\u25B6';
        }
    });
    TempoEngine.toggle(speed, btn);
}

