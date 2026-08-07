// ============================================================
// PhasmoOS - 15-session-tracker.js
// Rebuilt win/loss tracking (Aug 2026).
//
// Replaces the old "investigation" flow, which invented a RANDOM
// ghost and tested the user against it. The new model is simple:
// the user plays a real Phasmophobia match, then logs the result.
//   - "Start New Session" appears in the top bar ONLY when logged in
//   - during a session they use the site exactly as normal
//   - at the end they tap ✓ (won) or ✗ (lost), pick the real ghost,
//     and it's logged to their profile + XP
//   - the site takes their word for win/loss - no evidence cross-check
//   - XP: 5 per win, 0 per loss (losses still logged to history)
//
// This module OWNS the session flow. It neutralises the old
// startNewInvestigation / openGuessModal / submitActualGhost path
// from 06-auth-stats.js by overriding the globals after they load.
// Load order: after 06-auth-stats.js.
// ============================================================

(function () {
    const XP_PER_WIN = 5;

    // Session state lives here, not in the old currentInvestigation
    let session = null; // { startTime, result: 'win'|'loss'|null }

    // ── Top-bar visibility follows login state ──────────────────
    // showUserView()/onUserLoggedOut() in 06 toggle the user chrome;
    // we hook them so the session tracker appears/disappears with login.
    function refreshTrackerVisibility() {
        const tracker = document.getElementById('sessionTracker');
        if (!tracker) return;
        tracker.style.display = (typeof currentUser !== 'undefined' && currentUser) ? 'inline-flex' : 'none';
        if (!currentUser) endSession(true); // logging out drops any session
    }

    if (typeof showUserView === 'function') {
        const _showUserView = showUserView;
        showUserView = function () { _showUserView.apply(this, arguments); refreshTrackerVisibility(); };
    }
    if (typeof onUserLoggedOut === 'function') {
        const _onUserLoggedOut = onUserLoggedOut;
        onUserLoggedOut = function () { _onUserLoggedOut.apply(this, arguments); refreshTrackerVisibility(); };
    }

    // ── Session lifecycle ───────────────────────────────────────
    function startSession() {
        if (!currentUser) return;
        session = { startTime: Date.now(), result: null };
        // Clear the board so they start their real match fresh
        Object.keys(app.evidence).forEach(k => app.evidence[k] = 0);
        app.activeFilters.clear();
        if (typeof renderFilters === 'function') renderFilters();
        updateBoard();
        renderSessionUI();
        tickTimer();
    }

    // Live elapsed-time display while a session is active
    function tickTimer() {
        const el = document.getElementById('sessionTimer');
        if (!el || !session) return;
        const elapsed = Math.floor((Date.now() - session.startTime) / 1000);
        const m = Math.floor(elapsed / 60);
        const s = elapsed % 60;
        el.textContent = `${m}:${s.toString().padStart(2, '0')}`;
        setTimeout(tickTimer, 1000);
    }

    function endSession(silent) {
        session = null;
        renderSessionUI();
    }

    function renderSessionUI() {
        const startBtn = document.getElementById('btnStartSession');
        const active = document.getElementById('sessionActive');
        if (!startBtn || !active) return;
        const inSession = !!session;
        startBtn.style.display = inSession ? 'none' : '';
        active.style.display = inSession ? 'inline-flex' : 'none';
    }

    // ── Result flow: tap ✓/✗ → pick ghost → log ─────────────────
    function chooseResult(result) {
        if (!session) return;
        session.result = result; // 'win' or 'loss'
        openGhostPicker(result);
    }

    function openGhostPicker(result) {
        const ghostOptions = document.getElementById('ghostOptions');
        const modal = document.getElementById('guessModal');
        if (!ghostOptions || !modal) return;

        // Retitle the modal for the new flow
        const title = modal.querySelector('.dialog-title');
        const intro = modal.querySelector('.dialog-body > p');
        if (title) title.textContent = result === 'win' ? 'Nice! Which ghost was it?' : 'Which ghost was it?';
        if (intro) intro.textContent = result === 'win'
            ? 'Select the ghost you correctly identified.'
            : 'Select the ghost it turned out to be.';

        ghostOptions.innerHTML = '';
        // Alphabetical, all ghosts (GHOSTS is already sorted in 04)
        GHOSTS.forEach(ghost => {
            const option = document.createElement('div');
            option.className = 'ghost-option';
            option.textContent = ghost.name;
            option.addEventListener('click', () => logResult(ghost.name));
            ghostOptions.appendChild(option);
        });

        modal.showModal();
    }

    async function logResult(ghostName) {
        const modal = document.getElementById('guessModal');
        if (!session || !currentUser) { if (modal) modal.close(); return; }

        const won = session.result === 'win';
        const timeTaken = Math.floor((Date.now() - session.startTime) / 1000);

        try {
            const statsRef = firebase.database().ref(`users/${currentUser.uid}/stats`);
            const snap = await statsRef.once('value');
            const s = snap.val() || { total: 0, wins: 0, losses: 0, xp: 0, level: 1 };

            const xpGain = won ? XP_PER_WIN : 0;
            const newXP = (s.xp || 0) + xpGain;
            const levelInfo = getLevelFromXP(newXP);
            const leveledUp = levelInfo.level > (s.level || 1);

            const newStats = {
                total: (s.total || 0) + 1,
                wins: (s.wins || 0) + (won ? 1 : 0),
                losses: (s.losses || 0) + (won ? 0 : 1),
                xp: newXP,
                level: levelInfo.level
            };
            await statsRef.set(newStats);

            await firebase.database().ref(`users/${currentUser.uid}/history`).push({
                actualGhost: ghostName,
                result: won ? 'win' : 'loss',
                correct: won,           // kept for backward-compatible history rendering
                timeTaken: timeTaken,
                xpGained: xpGain,
                timestamp: Date.now()
            });

            if (modal) modal.close();
            endSession();
            if (typeof loadUserStatsDisplay === 'function') loadUserStatsDisplay();

            showResultToast(won, ghostName, xpGain, levelInfo, leveledUp);
        } catch (err) {
            console.error('Error logging session result:', err);
            alert('Could not save your result. Please try again.');
        }
    }

    // ── Lightweight themed confirmation toast (no blocking alert) ─
    function showResultToast(won, ghostName, xpGain, levelInfo, leveledUp) {
        const toast = document.createElement('div');
        toast.className = 'session-toast ' + (won ? 'session-toast-win' : 'session-toast-loss');
        const head = won ? `✓ Win logged - ${ghostName}` : `✗ Loss logged - ${ghostName}`;
        let sub = won ? `+${xpGain} XP` : 'No XP this time';
        if (leveledUp) sub += `  ·  LEVEL UP → ${levelInfo.level}`;
        const h = document.createElement('strong');
        h.textContent = head;
        const p = document.createElement('div');
        p.style.cssText = 'margin-top:4px;font-size:0.8rem;opacity:0.85;';
        p.textContent = sub;
        toast.appendChild(h);
        toast.appendChild(p);
        document.body.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '0'; }, 3200);
        setTimeout(() => toast.remove(), 3700);
    }

    // ── Wire up buttons once the DOM is ready ───────────────────
    function bind() {
        const s = document.getElementById('btnStartSession');
        const w = document.getElementById('btnSessionWin');
        const l = document.getElementById('btnSessionLoss');
        const c = document.getElementById('btnSessionCancel');
        if (s) s.addEventListener('click', startSession);
        if (w) w.addEventListener('click', () => chooseResult('win'));
        if (l) l.addEventListener('click', () => chooseResult('loss'));
        if (c) c.addEventListener('click', () => endSession());
        refreshTrackerVisibility();
        renderSessionUI();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bind);
    } else {
        bind();
    }

    // ── Neutralise the old random-ghost investigation path ──────
    // If any lingering UI calls these, they now start/continue the
    // new session flow instead of inventing a random ghost.
    if (typeof window !== 'undefined') {
        window.startNewInvestigation = function () { startSession(); };
        window.openGuessModal = function () {
            if (session) chooseResult('loss'); // default to loss picker if invoked directly
        };
    }
})();
