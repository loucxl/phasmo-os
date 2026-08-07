// ============================================================
// PhasmoOS - 07-friends.js
// Friends system: friend codes, requests, friends list, friend stats
// Split from script.js - load order matters (see index.html)
// ============================================================

// ═══════════════════════════════════════════════════════════════
// FRIENDS SYSTEM WITH FRIEND CODES
// ═══════════════════════════════════════════════════════════════

// FRIENDS SYSTEM WITH FRIEND CODES
// Uses a small /friendCodes lookup index plus per-user notification inboxes.

let currentFriends = [];
let pendingRequests = { incoming: [], outgoing: [] };
let friendsSystemBound = false;
let friendListenersBoundFor = null;

function escapeHTML(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function normaliseFriendCode(code) {
    const cleaned = String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (cleaned.length === 8) return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
    return String(code || '').toUpperCase().trim();
}

function generateFriendCode() {
    const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const numbers = '23456789';
    let code = '';
    for (let i = 0; i < 4; i++) code += letters.charAt(Math.floor(Math.random() * letters.length));
    code += '-';
    for (let i = 0; i < 4; i++) code += numbers.charAt(Math.floor(Math.random() * numbers.length));
    return code;
}

async function getPublicUserProfile(uid) {
    const snapshot = await firebase.database().ref(`users/${uid}`).once('value');
    const data = snapshot.val() || {};
    return {
        uid,
        nickname: data.nickname || 'Unknown Hunter',
        photoURL: data.photoURL || '',
        friendCode: data.friendCode || ''
    };
}

async function claimFriendCodeIndex(code, uid) {
    const codeRef = firebase.database().ref(`friendCodes/${code}`);
    const snapshot = await codeRef.once('value');
    if (snapshot.exists() && snapshot.val() !== uid) return false;
    await codeRef.set(uid);
    return true;
}

async function lookupFriendCode(code) {
    const normalised = normaliseFriendCode(code);
    const snapshot = await firebase.database().ref(`friendCodes/${normalised}`).once('value');
    const uid = snapshot.val();
    if (!uid) return null;
    const profile = await getPublicUserProfile(uid);
    return { uid, ...profile };
}

async function initializeFriendCode() {
    if (!currentUser) return null;

    const codeEl = document.getElementById('yourFriendCode');
    if (codeEl) codeEl.textContent = 'Loading...';

    try {
        const userRef = firebase.database().ref(`users/${currentUser.uid}`);
        const snapshot = await userRef.once('value');
        const userData = snapshot.val() || {};

        if (userData.friendCode) {
            const existingCode = normaliseFriendCode(userData.friendCode);
            const claimedExisting = await claimFriendCodeIndex(existingCode, currentUser.uid);
            if (claimedExisting) {
                if (existingCode !== userData.friendCode) {
                    await userRef.child('friendCode').set(existingCode);
                }
                if (codeEl) codeEl.textContent = existingCode;
                return existingCode;
            }
        }

        let code = generateFriendCode();
        let claimed = false;
        for (let attempts = 0; attempts < 20; attempts++) {
            claimed = await claimFriendCodeIndex(code, currentUser.uid);
            if (claimed) break;
            code = generateFriendCode();
        }

        if (!claimed) throw new Error('Could not create a unique friend code.');

        await userRef.child('friendCode').set(code);
        if (codeEl) codeEl.textContent = code;
        return code;
    } catch (error) {
        console.error('Error initialising friend code:', error);
        if (codeEl) codeEl.textContent = 'Unavailable';
        return null;
    }
}

function initFriendsSystem() {
    if (friendsSystemBound) return;
    friendsSystemBound = true;

    const friendsBtn = document.getElementById('btnFriends');
    if (friendsBtn) friendsBtn.addEventListener('click', openFriendsModal);

    const closeFriends = document.getElementById('closeFriends');
    if (closeFriends) closeFriends.addEventListener('click', () => document.getElementById('friendsModal')?.close());

    const addFriendBtn = document.getElementById('btnAddFriend');
    if (addFriendBtn) {
        addFriendBtn.addEventListener('click', () => {
            document.getElementById('friendsModal')?.close();
            const err = document.getElementById('addFriendError');
            if (err) err.textContent = '';
            const input = document.getElementById('friendCodeInput');
            if (input) input.value = '';
            document.getElementById('addFriendModal')?.showModal();
        });
    }

    const closeAddFriend = document.getElementById('closeAddFriend');
    if (closeAddFriend) closeAddFriend.addEventListener('click', () => document.getElementById('addFriendModal')?.close());

    const copyBtn = document.getElementById('btnCopyFriendCode');
    if (copyBtn) copyBtn.addEventListener('click', copyFriendCode);

    const addFriendForm = document.getElementById('addFriendForm');
    if (addFriendForm) addFriendForm.addEventListener('submit', sendFriendRequest);
}

async function openFriendsModal() {
    if (!currentUser) {
        alert('Please log in to use friends.');
        return;
    }

    document.getElementById('friendsModal')?.showModal();
    await initializeFriendCode();
    await loadFriends();
}

async function copyFriendCode() {
    if (!currentUser) return;

    try {
        let code = document.getElementById('yourFriendCode')?.textContent;
        if (!code || ['Loading...', 'Generating...', 'Unavailable'].includes(code)) {
            code = await initializeFriendCode();
        }
        if (!code) throw new Error('No friend code available');

        await navigator.clipboard.writeText(code);
        const btn = document.getElementById('btnCopyFriendCode');
        if (btn) {
            const original = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(() => { btn.textContent = original; }, 1500);
        }
    } catch (error) {
        console.error('Error copying friend code:', error);
        alert('Could not copy the friend code. You can copy it manually instead.');
    }
}

async function sendFriendRequest(e) {
    e.preventDefault();
    if (!currentUser) return;

    const codeInput = document.getElementById('friendCodeInput');
    const errorEl = document.getElementById('addFriendError');
    const submitBtn = e.submitter || document.querySelector('#addFriendForm button[type="submit"]');
    const code = normaliseFriendCode(codeInput?.value || '');

    if (errorEl) errorEl.textContent = '';

    if (!/^[A-Z]{4}-[0-9]{4}$/.test(code)) {
        if (errorEl) errorEl.textContent = 'Friend code must look like ABCD-1234.';
        return;
    }

    if (submitBtn) submitBtn.disabled = true;

    try {
        const friend = await lookupFriendCode(code);
        if (!friend) {
            if (errorEl) errorEl.textContent = 'No hunter found with that friend code.';
            return;
        }

        if (friend.uid === currentUser.uid) {
            if (errorEl) errorEl.textContent = 'That is your own friend code.';
            return;
        }

        const alreadyFriends = await firebase.database().ref(`users/${currentUser.uid}/friends/${friend.uid}`).once('value');
        if (alreadyFriends.exists()) {
            if (errorEl) errorEl.textContent = 'You are already friends with this hunter.';
            return;
        }

        const incoming = await firebase.database().ref(`users/${currentUser.uid}/friendRequests/incoming/${friend.uid}`).once('value');
        if (incoming.exists()) {
            await acceptFriendRequest(friend.uid);
            document.getElementById('addFriendModal')?.close();
            await loadFriends();
            return;
        }

        const outgoing = await firebase.database().ref(`users/${currentUser.uid}/friendRequests/outgoing/${friend.uid}`).once('value');
        if (outgoing.exists()) {
            if (errorEl) errorEl.textContent = 'You have already sent this hunter a request.';
            return;
        }

        const myProfile = await getPublicUserProfile(currentUser.uid);
        const now = Date.now();
        const updates = {};
        updates[`users/${currentUser.uid}/friendRequests/outgoing/${friend.uid}`] = {
            toUid: friend.uid,
            toNickname: friend.nickname || 'Unknown Hunter',
            toPhotoURL: friend.photoURL || '',
            timestamp: now
        };
        updates[`users/${friend.uid}/friendRequestReceived/${currentUser.uid}`] = {
            fromUid: currentUser.uid,
            fromNickname: myProfile.nickname || currentUserNickname || 'Unknown Hunter',
            fromPhotoURL: myProfile.photoURL || currentUser.photoURL || '',
            timestamp: now
        };
        await firebase.database().ref().update(updates);

        alert(`Friend request sent to ${friend.nickname || 'that hunter'}!`);
        if (codeInput) codeInput.value = '';
        document.getElementById('addFriendModal')?.close();
        await loadFriends();
    } catch (error) {
        console.error('Error sending friend request:', error);
        if (errorEl) errorEl.textContent = 'Could not send the request. Please check the friend-system database rules.';
    } finally {
        if (submitBtn) submitBtn.disabled = false;
    }
}

async function acceptFriendRequest(friendUid) {
    if (!currentUser || !friendUid) return;

    try {
        const [friendProfile, myProfile] = await Promise.all([
            getPublicUserProfile(friendUid),
            getPublicUserProfile(currentUser.uid)
        ]);
        const since = Date.now();
        const updates = {};
        updates[`users/${currentUser.uid}/friends/${friendUid}`] = {
            nickname: friendProfile.nickname,
            photoURL: friendProfile.photoURL || '',
            since
        };
        updates[`users/${currentUser.uid}/friendRequests/incoming/${friendUid}`] = null;
        updates[`users/${currentUser.uid}/friendRequestReceived/${friendUid}`] = null;
        updates[`users/${friendUid}/friendAccepted/${currentUser.uid}`] = {
            uid: currentUser.uid,
            nickname: myProfile.nickname || currentUserNickname || 'Unknown Hunter',
            photoURL: myProfile.photoURL || currentUser.photoURL || '',
            since
        };
        await firebase.database().ref().update(updates);
        await loadFriends();
        alert(`You and ${friendProfile.nickname} are now friends!`);
    } catch (error) {
        console.error('Error accepting friend request:', error);
        alert('Could not accept the friend request. Please check the friend-system database rules.');
    }
}

async function declineFriendRequest(friendUid) {
    if (!currentUser || !friendUid) return;

    try {
        const incomingSnapshot = await firebase.database().ref(`users/${currentUser.uid}/friendRequests/incoming/${friendUid}`).once('value');
        const outgoingSnapshot = await firebase.database().ref(`users/${currentUser.uid}/friendRequests/outgoing/${friendUid}`).once('value');
        const updates = {};

        if (incomingSnapshot.exists()) {
            updates[`users/${currentUser.uid}/friendRequests/incoming/${friendUid}`] = null;
            updates[`users/${currentUser.uid}/friendRequestReceived/${friendUid}`] = null;
            updates[`users/${friendUid}/friendRequestDeclined/${currentUser.uid}`] = { timestamp: Date.now() };
        }

        if (outgoingSnapshot.exists()) {
            updates[`users/${currentUser.uid}/friendRequests/outgoing/${friendUid}`] = null;
            updates[`users/${friendUid}/friendRequestCancelled/${currentUser.uid}`] = { timestamp: Date.now() };
        }

        await firebase.database().ref().update(updates);
        await loadFriends();
    } catch (error) {
        console.error('Error declining/cancelling friend request:', error);
        alert('Could not update the friend request.');
    }
}

async function removeFriend(friendUid, friendNickname) {
    if (!currentUser || !friendUid) return;
    const confirmed = confirm(`Remove ${friendNickname || 'this hunter'} from your friends list?`);
    if (!confirmed) return;

    try {
        const updates = {};
        updates[`users/${currentUser.uid}/friends/${friendUid}`] = null;
        updates[`users/${friendUid}/friendRemoved/${currentUser.uid}`] = { timestamp: Date.now() };
        await firebase.database().ref().update(updates);
        await loadFriends();
    } catch (error) {
        console.error('Error removing friend:', error);
        alert('Could not remove this friend.');
    }
}

async function loadFriends() {
    if (!currentUser) return;

    try {
        let codeSnapshot = await firebase.database().ref(`users/${currentUser.uid}/friendCode`).once('value');
        let yourCode = codeSnapshot.val();
        if (!yourCode) yourCode = await initializeFriendCode();

        const codeEl = document.getElementById('yourFriendCode');
        if (codeEl) codeEl.textContent = yourCode || 'Unavailable';

        const [friendsSnapshot, incomingSnapshot, outgoingSnapshot] = await Promise.all([
            firebase.database().ref(`users/${currentUser.uid}/friends`).once('value'),
            firebase.database().ref(`users/${currentUser.uid}/friendRequests/incoming`).once('value'),
            firebase.database().ref(`users/${currentUser.uid}/friendRequests/outgoing`).once('value')
        ]);

        currentFriends = Object.entries(friendsSnapshot.val() || {});
        pendingRequests.incoming = Object.entries(incomingSnapshot.val() || {});
        pendingRequests.outgoing = Object.entries(outgoingSnapshot.val() || {});

        renderFriendsList();
        renderFriendRequests();
        updateFriendsBadge();
        updateFriendsCount();
    } catch (error) {
        console.error('Error loading friends:', error);
    }
}

function renderFriendsList() {
    const container = document.getElementById('friendsList');
    if (!container) return;

    if (currentFriends.length === 0) {
        container.innerHTML = '<div class="empty-state">No friends yet. Share your friend code!</div>';
        return;
    }

    container.innerHTML = '';
    currentFriends.forEach(([uid, friend]) => {
        const item = document.createElement('div');
        item.className = 'friend-item';
        item.innerHTML = `
            <img src="${escapeHTML(friend.photoURL || 'https://via.placeholder.com/40')}" class="friend-avatar" alt="">
            <div class="friend-info">
                <div class="friend-name">${escapeHTML(friend.nickname || 'Unknown Hunter')}</div>
                <div class="friend-since">Friends since ${formatDate(friend.since)}</div>
            </div>
            <button class="btn-friend-view" type="button">View Stats</button>
            <button class="btn-friend-remove" type="button">Remove</button>
        `;
        item.querySelector('.btn-friend-view').addEventListener('click', () => viewFriendStats(uid, friend.nickname || 'Unknown Hunter'));
        item.querySelector('.btn-friend-remove').addEventListener('click', () => removeFriend(uid, friend.nickname || 'Unknown Hunter'));
        container.appendChild(item);
    });
}

function renderFriendRequests() {
    const container = document.getElementById('friendRequestsList');
    if (!container) return;

    if (pendingRequests.incoming.length === 0 && pendingRequests.outgoing.length === 0) {
        container.innerHTML = '<div class="empty-state">No pending requests</div>';
        return;
    }

    container.innerHTML = '';

    pendingRequests.incoming.forEach(([uid, request]) => {
        const item = document.createElement('div');
        item.className = 'request-item';
        item.innerHTML = `
            <img src="${escapeHTML(request.fromPhotoURL || 'https://via.placeholder.com/40')}" class="request-avatar" alt="">
            <div class="request-info">
                <div class="request-name">${escapeHTML(request.fromNickname || 'Unknown Hunter')}</div>
                <div class="request-time">${formatTimeAgo(request.timestamp)}</div>
            </div>
            <button class="btn-request-accept" type="button">\u2713</button>
            <button class="btn-request-decline" type="button">\u2717</button>
        `;
        item.querySelector('.btn-request-accept').addEventListener('click', () => acceptFriendRequest(uid));
        item.querySelector('.btn-request-decline').addEventListener('click', () => declineFriendRequest(uid));
        container.appendChild(item);
    });

    pendingRequests.outgoing.forEach(([uid, request]) => {
        const item = document.createElement('div');
        item.className = 'request-item outgoing';
        item.innerHTML = `
            <div class="request-info">
                <div class="request-name">Request sent to ${escapeHTML(request.toNickname || 'hunter')}</div>
                <div class="request-time">${formatTimeAgo(request.timestamp)}</div>
            </div>
            <button class="btn-request-cancel" type="button">Cancel</button>
        `;
        item.querySelector('.btn-request-cancel').addEventListener('click', () => declineFriendRequest(uid));
        container.appendChild(item);
    });
}

function updateFriendsBadge() {
    const badge = document.getElementById('friendsBadge');
    if (!badge) return;

    const count = pendingRequests.incoming.length;
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline-block' : 'none';
    badge.classList.add('notification-badge');
}

function updateFriendsCount() {
    const friendsCountEl = document.getElementById('friendsCount');
    const requestsCountEl = document.getElementById('requestsCount');
    if (friendsCountEl) friendsCountEl.textContent = currentFriends.length;
    if (requestsCountEl) requestsCountEl.textContent = pendingRequests.incoming.length + pendingRequests.outgoing.length;
}

function listenToFriendRequests() {
    if (!currentUser || friendListenersBoundFor === currentUser.uid) return;

    if (friendListenersBoundFor) {
        firebase.database().ref(`users/${friendListenersBoundFor}/friendRequests/incoming`).off();
        firebase.database().ref(`users/${friendListenersBoundFor}/friendRequests/outgoing`).off();
        firebase.database().ref(`users/${friendListenersBoundFor}/friends`).off();
        firebase.database().ref(`users/${friendListenersBoundFor}/friendRequestReceived`).off();
        firebase.database().ref(`users/${friendListenersBoundFor}/friendAccepted`).off();
        firebase.database().ref(`users/${friendListenersBoundFor}/friendRequestDeclined`).off();
        firebase.database().ref(`users/${friendListenersBoundFor}/friendRequestCancelled`).off();
        firebase.database().ref(`users/${friendListenersBoundFor}/friendRemoved`).off();
    }

    friendListenersBoundFor = currentUser.uid;
    const uid = currentUser.uid;

    firebase.database().ref(`users/${uid}/friendRequests/incoming`).on('value', loadFriends);
    firebase.database().ref(`users/${uid}/friendRequests/outgoing`).on('value', loadFriends);
    firebase.database().ref(`users/${uid}/friends`).on('value', loadFriends);

    firebase.database().ref(`users/${uid}/friendRequestReceived`).on('child_added', async (snapshot) => {
        const senderUid = snapshot.key;
        const requestData = snapshot.val();
        if (!senderUid || !requestData) return;
        try {
            const updates = {};
            updates[`users/${uid}/friendRequests/incoming/${senderUid}`] = requestData;
            updates[`users/${uid}/friendRequestReceived/${senderUid}`] = null;
            await firebase.database().ref().update(updates);
        } catch (error) {
            console.error('Error processing received friend request:', error);
        }
    });

    firebase.database().ref(`users/${uid}/friendAccepted`).on('child_added', async (snapshot) => {
        const friendUid = snapshot.key;
        const friendData = snapshot.val();
        if (!friendUid || !friendData) return;
        try {
            const updates = {};
            updates[`users/${uid}/friends/${friendUid}`] = {
                nickname: friendData.nickname || 'Unknown Hunter',
                photoURL: friendData.photoURL || '',
                since: friendData.since || Date.now()
            };
            updates[`users/${uid}/friendRequests/outgoing/${friendUid}`] = null;
            updates[`users/${uid}/friendAccepted/${friendUid}`] = null;
            await firebase.database().ref().update(updates);
        } catch (error) {
            console.error('Error processing accepted friend request:', error);
        }
    });

    firebase.database().ref(`users/${uid}/friendRequestDeclined`).on('child_added', async (snapshot) => {
        const friendUid = snapshot.key;
        if (!friendUid) return;
        const updates = {};
        updates[`users/${uid}/friendRequests/outgoing/${friendUid}`] = null;
        updates[`users/${uid}/friendRequestDeclined/${friendUid}`] = null;
        await firebase.database().ref().update(updates);
    });

    firebase.database().ref(`users/${uid}/friendRequestCancelled`).on('child_added', async (snapshot) => {
        const friendUid = snapshot.key;
        if (!friendUid) return;
        const updates = {};
        updates[`users/${uid}/friendRequests/incoming/${friendUid}`] = null;
        updates[`users/${uid}/friendRequestCancelled/${friendUid}`] = null;
        await firebase.database().ref().update(updates);
    });

    firebase.database().ref(`users/${uid}/friendRemoved`).on('child_added', async (snapshot) => {
        const friendUid = snapshot.key;
        if (!friendUid) return;
        const updates = {};
        updates[`users/${uid}/friends/${friendUid}`] = null;
        updates[`users/${uid}/friendRemoved/${friendUid}`] = null;
        await firebase.database().ref().update(updates);
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


