// ============================================================
// PhasmoOS - 06-auth-stats.js
// Google auth, nicknames, stats tracking, share-stats card, investigation mode
// Split from script.js - load order matters (see index.html)
// ============================================================

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
    
    // Share stats button
    const shareStatsBtn = document.getElementById('btnShareStats');
    if (shareStatsBtn) {
        shareStatsBtn.addEventListener('click', openShareStatsCard);
    }

    // Change nickname button
    document.getElementById('btnChangeNickname').addEventListener('click', () => {
        document.getElementById('statsModal').close();
        document.getElementById('nicknameModal').showModal();
    });
    
    // Reset stats button
    document.getElementById('btnResetStats').addEventListener('click', async () => {
        if (!currentUser) return;
        
        const confirmed = confirm('\u26A0\uFE0F Are you sure you want to reset ALL your stats?\n\nThis will delete:\n- All investigation history\n- Win/loss records\n- XP and level\n- Everything!\n\nThis CANNOT be undone!');
        
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
                
                alert('\u2705 Stats reset successfully!');
                
                // Reload stats display
                loadStats();
                loadUserStatsDisplay();
                
            } catch (error) {
                console.error('Error resetting stats:', error);
                alert('\u274C Failed to reset stats. Please try again.');
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

        const mode =
            document.getElementById('investigationDifficulty').value;

        startNewInvestigation(mode);

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
        alert("\u26A0\uFE0F Firebase Auth not ready yet.\n\nPlease wait a moment and try again.");
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
            alert("\u26A0\uFE0F Domain Not Authorized\n\nThis domain needs to be added to Firebase:\n\n1. Go to Firebase Console\n2. Authentication → Settings → Authorized domains\n3. Add: " + window.location.hostname + "\n\nOr test on your production domain instead!");
            return;
        }
        
        if (error.code === 'auth/popup-blocked') {
            alert("\u26A0\uFE0F Popup Blocked\n\nYour browser blocked the sign-in popup.\n\nPlease allow popups for this site and try again.");
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
    const submitBtn = e.submitter || document.querySelector('#nicknameForm button[type="submit"]');
    
    // Clear error
    errorEl.classList.remove('show');
    errorEl.textContent = '';
    
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

    if (!currentUser || !currentUser.uid) {
        errorEl.textContent = "Login is still loading. Please wait a second and try again.";
        errorEl.classList.add('show');
        return;
    }
    
    try {
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Saving...';
        }

        const userRef = firebase.database().ref(`users/${currentUser.uid}`);

        // Save the required field first, on its own. This avoids a full-profile update failing
        // because of stricter Firebase rules around optional fields like email/photoURL/stats.
        await userRef.child('nickname').set(nickname);

        // Optional profile metadata. These are nice to have, but nickname save should not fail
        // just because rules reject one of these fields.
        const optionalProfile = {
            updatedAt: Date.now()
        };
        if (currentUser.photoURL) optionalProfile.photoURL = currentUser.photoURL;
        if (currentUser.email) optionalProfile.email = currentUser.email;

        try {
            await userRef.update(optionalProfile);
        } catch (profileError) {
            console.warn('Nickname saved, but optional profile metadata was not saved:', profileError);
        }

        // Create starter stats only if the user does not already have any. Failure here should
        // not block login/nickname creation.
        try {
            const statsRef = userRef.child('stats');
            const statsSnapshot = await statsRef.once('value');
            if (!statsSnapshot.exists()) {
                await statsRef.set({ total: 0, wins: 0, losses: 0, xp: 0, level: 1 });
            }
        } catch (statsError) {
            console.warn('Nickname saved, but starter stats were not saved:', statsError);
        }
        
        currentUserNickname = nickname;
        
        // Close modal
        document.getElementById('nicknameModal').close();
        
        // Show user view
        showUserView();
        
        console.log("Nickname saved:", nickname);
        
    } catch (error) {
        console.error("Error saving nickname:", error);
        const message = error && (error.message || error.code) ? `Failed to save nickname: ${error.message || error.code}` : "Failed to save nickname";
        errorEl.textContent = message;
        errorEl.classList.add('show');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'SET NICKNAME';
        }
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
                            ${item.correct ? '\u2705' : '\u274C'} ${item.actualGhost || item.actual}
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


function buildShareStatsURL(shareData) {
    const url = new URL('share-stats.html', window.location.href);
    Object.entries(shareData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            url.searchParams.set(key, String(value));
        }
    });
    return url.toString();
}

async function openShareStatsCard() {
    if (!currentUser) {
        alert('Please log in first.');
        return;
    }

    try {
        const statsSnapshot = await firebase.database().ref(`users/${currentUser.uid}/stats`).once('value');
        const stats = statsSnapshot.val() || { total: 0, wins: 0, losses: 0, xp: 0, level: 1 };
        const total = Number(stats.total || 0);
        const wins = Number(stats.wins || 0);
        const losses = Number(stats.losses || 0);
        const xp = Number(stats.xp || 0);
        const levelInfo = getLevelFromXP(xp);
        const level = Number(stats.level || levelInfo.level || 1);
        const xpCurrent = Number(levelInfo.xpInCurrentLevel || 0);
        const xpNext = Number(levelInfo.xpForNextLevel || 100);
        const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;

        const shareData = {
            name: currentUserNickname || currentUser.displayName || 'Hunter',
            avatar: currentUser.photoURL || '',
            level,
            total,
            wins,
            losses,
            rate: winRate,
            xpCurrent,
            xpNext,
            version: '2.5'
        };

        const shareURL = buildShareStatsURL(shareData);
        const shareWindow = window.open(shareURL, '_blank', 'noopener,noreferrer');
        if (!shareWindow) {
            alert('The share card was blocked by your browser. Please allow pop-ups for this site and try again.');
        }
    } catch (error) {
        console.error('Error generating share stats card:', error);
        alert('Could not generate your share card right now.');
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

function startNewInvestigation(mode = 'all') {
    if (!currentUser) {
        alert('Please log in to track your investigations!');
        return;
    }
    
    // Randomly select a ghost
    const randomGhost = GHOSTS[Math.floor(Math.random() * GHOSTS.length)];
    
    currentInvestigation = {
        actualGhost: randomGhost.name,
        startTime: Date.now(),
        mode: mode
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
            \uD83D\uDD0D Investigation in progress (${currentInvestigation.mode.toUpperCase()} EVI)
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
            resultMessage = `\u2705 CORRECT!\n\nIt was ${actualGhost} and your evidence matched!\n\n`;
            if (leveledUp) {
                resultMessage += `\uD83C\uDF89 LEVEL UP! You're now Level ${newLevel}!\n\n`;
            }
            resultMessage += `+${xpGain} XP (${levelInfo.xpInCurrentLevel}/${levelInfo.xpForNextLevel} to Level ${newLevel + 1})\n\n`;
        } else {
            if (matches.length === 0) {
                resultMessage = `\u274C INCORRECT\n\nIt was ${actualGhost} but your evidence ruled it out.\n\n`;
            } else {
                resultMessage = `\u274C INCORRECT\n\nIt was ${actualGhost} but your evidence showed: ${matches.join(', ')}\n\n`;
            }
            resultMessage += `No XP gained\n\n`;
        }
        
        resultMessage += `Your stats:\n\uD83C\uDFC6 ${newStats.wins} wins out of ${newStats.total} total\n\uD83D\uDCCA ${winRate}% accuracy\n\u2B50 Level ${newStats.level} (${newStats.xp} XP)`;
        
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
                usersList.innerHTML = '<div class="user-chip you">\uD83D\uDC64 You</div>';
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
                        <span>\uD83D\uDC64 ${user.nickname}${user.isYou ? ' (You)' : ''}</span>
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

