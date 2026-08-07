// ============================================================
// PhasmoOS - 13-live-banner.js
// Live site-update banner driven by Firebase Realtime Database.
// Edit /siteBanner in the Firebase console and every open tab
// updates instantly - no refresh needed.
//
// Data shape at /siteBanner:
//   { active: true, title: "SITE UPDATE", message: "..." }
//
// Behaviour:
//   - active:false (or deleting the node's message) hides it everywhere, live
//   - Dismissal is remembered per-MESSAGE (hash of title+message),
//     so publishing new text automatically re-shows the banner to
//     people who dismissed the previous one
//   - If Firebase is unavailable, the hardcoded banner in
//     index.html remains as a static fallback
// Split from script.js structure - load order matters (loads
// after 05-group-journal.js, which initializes Firebase)
// ============================================================

(function () {
    const banner = document.getElementById('wipBanner');
    if (!banner || typeof firebase === 'undefined' || !firebase.apps.length) return;

    const textEl = banner.querySelector('.wip-text');
    const closeBtn = document.getElementById('wipClose');
    const DISMISS_KEY = 'phasmo_banner_dismissed';

    // Tiny stable hash - any change to the text produces a new id
    function bannerIdOf(title, message) {
        const str = (title || '') + '|' + (message || '');
        let h = 0;
        for (let i = 0; i < str.length; i++) {
            h = ((h << 5) - h + str.charCodeAt(i)) | 0;
        }
        return 'b' + Math.abs(h);
    }

    let currentId = null;

    firebase.database().ref('siteBanner').on('value', (snap) => {
        const data = snap.val();

        // No remote banner configured -> leave the hardcoded fallback alone
        if (!data || !data.message) return;

        // Kill switch: active:false hides it everywhere, live
        if (data.active === false) {
            banner.style.display = 'none';
            return;
        }

        currentId = bannerIdOf(data.title, data.message);

        // Build content with textContent only (no HTML injection risk)
        textEl.textContent = '';
        if (data.title) {
            const strong = document.createElement('strong');
            strong.textContent = data.title + ': ';
            textEl.appendChild(strong);
        }
        textEl.appendChild(document.createTextNode(data.message));

        // Show unless THIS exact message was already dismissed
        banner.style.display =
            localStorage.getItem(DISMISS_KEY) === currentId ? 'none' : '';
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (currentId) localStorage.setItem(DISMISS_KEY, currentId);
            // (02-app-core.js already hides the element on click)
        });
    }
})();
