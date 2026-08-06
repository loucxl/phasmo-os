// ============================================================
// PhasmoOS — 05-group-journal.js
// Firebase config + Group Journal multiplayer sync (sessions, heartbeat, share links)
// Split from script.js — load order matters (see index.html)
// ============================================================

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

// ── SYNC CORE (rewritten Aug 2026) ─────────────────────────────
// The original design wrote the WHOLE state on every change and
// listened to the WHOLE session node (so heartbeats re-applied
// stale state, and simultaneous clicks overwrote each other).
// New design:
//   - listeners attach to the individual data nodes (evidence,
//     filters, users, timer) — heartbeats can no longer touch the board
//   - writes are granular multi-path updates of only what changed,
//     sent immediately (no debounce) — two people clicking different
//     evidence at once both survive
//   - loops are prevented by diffing (an echo of your own write is
//     a no-op), not by time windows that could skip real updates

function applyRemote(fn) {
    groupJournal.applyingRemote = true;
    try { fn(); } finally { groupJournal.applyingRemote = false; }
}

// Listen for session updates
function listenToSession() {
    if (!groupJournal.sessionId) return;

    const base = firebase.database().ref(`sessions/${groupJournal.sessionId}`);
    groupJournal.listenerRefs = [];

    // Evidence — the board itself
    const evRef = base.child('evidence');
    evRef.on('value', (snap) => {
        const ev = snap.val();
        if (!ev) return;
        groupJournal.remoteEvidence = { ...ev };
        if (JSON.stringify(ev) === JSON.stringify(app.evidence)) return; // echo / no change
        app.evidence = { ...ev };
        applyRemote(() => updateBoard());
    }, (error) => console.error("Error listening to evidence:", error));
    groupJournal.listenerRefs.push(evRef);

    // Filters
    const fRef = base.child('filters');
    fRef.on('value', (snap) => {
        const arr = snap.val() || [];
        groupJournal.remoteFilters = [...arr];
        const next = new Set(arr);
        const same = next.size === app.activeFilters.size &&
            [...next].every(x => app.activeFilters.has(x));
        if (same) return;
        app.activeFilters = next;
        applyRemote(() => { renderFilters(); updateBoard(); });
    }, (error) => console.error("Error listening to filters:", error));
    groupJournal.listenerRefs.push(fRef);

    // Users — presence only, never touches the board
    const uRef = base.child('users');
    uRef.on('value', () => updateUserCount());
    groupJournal.listenerRefs.push(uRef);

    // Timer duration (legacy sync field)
    const tRef = base.child('timer/dur');
    tRef.on('value', (snap) => {
        const d = snap.val();
        if (d) app.timer.dur = d;
    });
    groupJournal.listenerRefs.push(tRef);
}

// Sync local state to Firebase — granular, immediate, diff-based
function syncToFirebase() {
    if (!groupJournal.syncEnabled || !groupJournal.sessionId) return;
    if (groupJournal.applyingRemote) return; // this render came FROM the network

    const updates = {};

    const remoteEv = groupJournal.remoteEvidence || {};
    for (const k in app.evidence) {
        if (app.evidence[k] !== remoteEv[k]) {
            updates[`evidence/${k}`] = app.evidence[k];
        }
    }

    const filtersNow = Array.from(app.activeFilters);
    if (JSON.stringify(filtersNow) !== JSON.stringify(groupJournal.remoteFilters || [])) {
        updates['filters'] = filtersNow;
    }

    if (Object.keys(updates).length === 0) return; // nothing changed → no write

    updates['lastUpdate'] = Date.now();

    // Optimistically track what the server will now hold
    groupJournal.remoteEvidence = { ...app.evidence };
    groupJournal.remoteFilters = filtersNow;

    firebase.database().ref(`sessions/${groupJournal.sessionId}`).update(updates)
        .catch(error => console.error("Sync error:", error));
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
    sessionRef.off();
    if (groupJournal.listenerRefs) {
        groupJournal.listenerRefs.forEach(r => r.off());
        groupJournal.listenerRefs = null;
    }
    
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



// Initialize Group Journal (moved here from the equipment section:
// in the single-file era hoisting made a forward call work, but across
// split files it must run after the definitions above)
initGroupJournal();
