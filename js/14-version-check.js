// ============================================================
// PhasmoOS - 14-version-check.js
// Live "new version available" prompt, driven by Firebase.
//
// LOCAL_VERSION below is baked into each deploy. The module
// watches /siteVersion in the Realtime Database; if they differ,
// an unobtrusive toast appears asking the visitor to refresh.
//
// Deploy workflow from now on:
//   1. Bump LOCAL_VERSION here (and the v-badges in index.html)
//   2. Push to GitHub, wait for the deploy to finish
//   3. Set /siteVersion in the Firebase console to the same value
//      -> every open tab still running the old code gets the
//         refresh prompt within a second
//
// Load order: after 05-group-journal.js (Firebase init).
// ============================================================

(function () {
    const LOCAL_VERSION = 'v3.0';

    if (typeof firebase === 'undefined' || !firebase.apps.length) return;

    let toastShown = false;

    firebase.database().ref('siteVersion').on('value', (snap) => {
        const remote = snap.val();
        if (!remote || remote === LOCAL_VERSION || toastShown) return;

        toastShown = true;

        const toast = document.createElement('div');
        toast.id = 'versionToast';
        toast.setAttribute('role', 'status');
        toast.style.cssText = [
            'position:fixed', 'right:18px', 'bottom:18px', 'z-index:99999',
            'background:var(--bg-elevated, #1f2a40)',
            'border:1px solid var(--acc-cyan, #06b6d4)',
            'color:var(--text-main, #f8fafc)',
            'font-family:var(--font-hud, monospace)', 'font-size:0.85rem',
            'padding:14px 16px', 'max-width:320px',
            'box-shadow:0 6px 0 rgba(0,0,0,0.45), 0 0 24px rgba(6,182,212,0.25)'
        ].join(';');

        const msg = document.createElement('div');
        const strong = document.createElement('strong');
        strong.textContent = 'PHASMO/OS updated';
        msg.appendChild(strong);
        msg.appendChild(document.createTextNode(
            ' - ' + remote + ' is live. Refresh to load the new version.'));
        toast.appendChild(msg);

        const row = document.createElement('div');
        row.style.cssText = 'display:flex;gap:8px;margin-top:10px;';

        const refreshBtn = document.createElement('button');
        refreshBtn.textContent = 'REFRESH NOW';
        refreshBtn.style.cssText =
            'flex:1;padding:8px;border:none;cursor:pointer;font-family:inherit;' +
            'font-weight:700;background:var(--acc-cyan, #06b6d4);color:#041018;';
        refreshBtn.addEventListener('click', () => location.reload());

        const laterBtn = document.createElement('button');
        laterBtn.textContent = 'LATER';
        laterBtn.style.cssText =
            'padding:8px 12px;cursor:pointer;font-family:inherit;' +
            'background:transparent;color:var(--text-muted, #94a3b8);' +
            'border:1px solid var(--border, #334155);';
        laterBtn.addEventListener('click', () => toast.remove());

        row.appendChild(refreshBtn);
        row.appendChild(laterBtn);
        toast.appendChild(row);

        document.body.appendChild(toast);
    });
})();
