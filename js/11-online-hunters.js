// ============================================================
// PhasmoOS - 11-online-hunters.js
// Online Hunters counter (active session heartbeats)
// Split from script.js - load order matters (see index.html)
// ============================================================

// ═══════════════════════════════════════════════════════════════
// ONLINE HUNTERS COUNTER
// Counts active browser sessions that currently have the site open.
// ═══════════════════════════════════════════════════════════════
let onlineHunterId = null;
let onlineHunterHeartbeat = null;
let onlineHuntersCleanupInterval = null;

function initOnlineHuntersCounter() {
    const countEl = document.getElementById("onlineHuntersCount");
    if (!countEl) return;

    if (typeof firebase === "undefined" || !firebase.database) {
        console.warn("Firebase not available. Online Hunters counter disabled.");
        return;
    }

    try {
        onlineHunterId = getOrCreateOnlineHunterId();
        const hunterRef = firebase.database().ref(`onlineHunters/${onlineHunterId}`);

        hunterRef.set({
            lastSeen: Date.now(),
            page: window.location.pathname || "/",
            // Nickname only if logged in; anonymous stays null. NEVER store email here.
            nickname: (typeof currentUserNickname !== 'undefined' && currentUserNickname) ? currentUserNickname : null
        }).catch((error) => {
            console.warn("Online Hunters write failed. Check Firebase rules.", error);
        });

        hunterRef.onDisconnect().remove();

        if (onlineHunterHeartbeat) clearInterval(onlineHunterHeartbeat);
        onlineHunterHeartbeat = setInterval(() => {
            hunterRef.update({
                lastSeen: Date.now(),
                page: window.location.pathname || "/",
                nickname: (typeof currentUserNickname !== 'undefined' && currentUserNickname) ? currentUserNickname : null
            }).catch((error) => {
                console.warn("Online Hunters heartbeat failed.", error);
            });
        }, 10000);

        listenForOnlineHunters();
        cleanupOldOnlineHunters();

        if (onlineHuntersCleanupInterval) clearInterval(onlineHuntersCleanupInterval);
        onlineHuntersCleanupInterval = setInterval(cleanupOldOnlineHunters, 30000);
    } catch (error) {
        console.error("Failed to initialize Online Hunters counter:", error);
    }
}

function getOrCreateOnlineHunterId() {
    const storageKey = "phasmo_online_hunter_id";
    let id = sessionStorage.getItem(storageKey);

    if (!id) {
        id = "hunter_" + Math.random().toString(36).slice(2, 11) + "_" + Date.now();
        sessionStorage.setItem(storageKey, id);
    }

    return id;
}

function listenForOnlineHunters() {
    const onlineRef = firebase.database().ref("onlineHunters");

    onlineRef.on("value", (snapshot) => {
        const data = snapshot.val() || {};
        const now = Date.now();

        const activeHunters = Object.values(data).filter((hunter) => {
            return hunter && hunter.lastSeen && now - hunter.lastSeen < 30000;
        });

        const countEl = document.getElementById("onlineHuntersCount");
        if (countEl) countEl.textContent = activeHunters.length;
    }, (error) => {
        console.warn("Online Hunters listener failed. Check Firebase rules.", error);
    });
}

function cleanupOldOnlineHunters() {
    if (typeof firebase === "undefined" || !firebase.database) return;

    const onlineRef = firebase.database().ref("onlineHunters");
    const cutoff = Date.now() - 60000;

    onlineRef.once("value", (snapshot) => {
        const updates = {};

        snapshot.forEach((child) => {
            const data = child.val();
            if (!data || !data.lastSeen || data.lastSeen < cutoff) {
                updates[child.key] = null;
            }
        });

        if (Object.keys(updates).length > 0) {
            onlineRef.update(updates).catch((error) => {
                console.warn("Could not clean old online hunters:", error);
            });
        }
    }).catch((error) => {
        console.warn("Could not read online hunters for cleanup:", error);
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initOnlineHuntersCounter);
} else {
    initOnlineHuntersCounter();
}


/* Event Popup Config */
const EVENT_POPUP = {
    enabled: false,
    title: "Double XP",
    message: "The Double XP event will be live between 22nd - 25th May 2026.",
    showOncePerSession: false
};

function initEventPopup() {
    if (!EVENT_POPUP.enabled) return;

    const overlay = document.getElementById("event-popup-overlay");
    const title = document.getElementById("event-popup-title");
    const message = document.getElementById("event-popup-message");
    const closeBtn = document.getElementById("close-event-popup");

    if (!overlay || !title || !message || !closeBtn) return;

    if (
        EVENT_POPUP.showOncePerSession &&
        sessionStorage.getItem("eventPopupDismissed") === "true"
    ) {
        return;
    }

    title.textContent = EVENT_POPUP.title;
    message.textContent = EVENT_POPUP.message;

    setTimeout(() => {
        overlay.classList.remove("hidden");
    }, 3000);

    function closePopup() {
        overlay.classList.add("hidden");

        if (EVENT_POPUP.showOncePerSession) {
            sessionStorage.setItem("eventPopupDismissed", "true");
        }
    }

    closeBtn.addEventListener("click", closePopup);

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
            closePopup();
        }
    });
}


window.addEventListener("load", () => {
    const loadingScreen =
        document.querySelector(".loading-screen") ||
        document.querySelector("#loading-screen") ||
        document.querySelector(".loader") ||
        document.querySelector("#loader");

    if (!loadingScreen) {
        setTimeout(initEventPopup, 1200);
        return;
    }

    const waitForLoader = setInterval(() => {
        const hidden =
            loadingScreen.classList.contains("hidden") ||
            loadingScreen.style.display === "none" ||
            loadingScreen.style.opacity === "0";

        if (hidden) {
            clearInterval(waitForLoader);

            setTimeout(() => {
                initEventPopup();
            }, 700);
        }
    }, 300);
});



