// ============================================================
// PhasmoOS — 08-top-bar.js
// Top bar integration (DOMContentLoaded wiring for share/journal, stats, manual, updates buttons)
// Split from script.js — load order matters (see index.html)
// ============================================================

// ═══════════════════════════════════════════════════════════════
// COMPLETE NEW TOP BAR INTEGRATION
// ═══════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', function() {
    console.log('\uD83D\uDE80 Initializing new top bar...');
    
    // ============================================================
    // 1. SHARE/GROUP JOURNAL BUTTON
    // ============================================================
    const newShareBtn = document.getElementById('btnShare');
    const oldGroupBtn = document.getElementById('btnGroupJournal');
    
    if (newShareBtn && oldGroupBtn) {
        // Click handler
        newShareBtn.addEventListener('click', function() {
            console.log('Share button clicked');
            oldGroupBtn.click();
        });
        
        // Sync active pulsing state every 500ms
        setInterval(function() {
            if (oldGroupBtn.classList.contains('active')) {
                newShareBtn.classList.add('active');
                newShareBtn.style.animation = 'pulse-cyan 2s infinite';
                newShareBtn.style.background = 'var(--acc-cyan)';
                newShareBtn.style.color = '#000';
                newShareBtn.style.borderColor = 'var(--acc-cyan)';
            } else {
                newShareBtn.classList.remove('active');
                newShareBtn.style.animation = '';
                newShareBtn.style.background = 'var(--bg-card)';
                newShareBtn.style.color = 'var(--text-muted)';
                newShareBtn.style.borderColor = 'var(--border)';
            }
        }, 500);
    }
    
    // ============================================================
    // 2. FRIENDS BUTTON
    // ============================================================
    setTimeout(function() {
        const newFriendsBtn = document.getElementById('btnFriends');
        
        if (newFriendsBtn && typeof openFriendsModal === 'function') {
            // Remove existing listeners
            const cleanBtn = newFriendsBtn.cloneNode(true);
            newFriendsBtn.parentNode.replaceChild(cleanBtn, newFriendsBtn);
            
            // Add click handler
            cleanBtn.addEventListener('click', function() {
                console.log('Friends button clicked');
                openFriendsModal();
            });
            
            // Sync badge
            setInterval(function() {
                const oldBadge = document.querySelector('.header-tools #friendsBadge');
                const newBadge = document.getElementById('friendsBadge');
                if (oldBadge && newBadge) {
                    newBadge.style.display = oldBadge.style.display;
                    newBadge.textContent = oldBadge.textContent;
                }
            }, 1000);
        }
    }, 1000);
    
    // ============================================================
    // 3. AUTHENTICATION SYNC
    // ============================================================
    const newLoginBtn = document.getElementById('btnGoogleLoginNew');
    const oldLoginBtn = document.getElementById('btnGoogleLogin');
    
    if (newLoginBtn && oldLoginBtn) {
        newLoginBtn.addEventListener('click', function() {
            console.log('Login button clicked');
            oldLoginBtn.click();
        });
    }
    
    // Sync auth display
    let lastUserState = null;
    setInterval(function() {
        const oldAuthView = document.getElementById('authView');
        const oldUserView = document.getElementById('userView');
        const newAuthView = document.getElementById('authViewNew');
        const newUserView = document.getElementById('userViewNew');
        
        if (!oldAuthView || !oldUserView || !newAuthView || !newUserView) return;
        
        // Check if user is logged in
        const isLoggedIn = oldUserView.style.display !== 'none';
        
        if (isLoggedIn) {
            // Hide login, show user
            newAuthView.style.display = 'none';
            newUserView.style.display = 'flex';
            
            // Get user data
            const avatar = oldUserView.querySelector('#userAvatar');
            const nickname = oldUserView.querySelector('#userNickname');
            const level = oldUserView.querySelector('#userLevel');
            
            if (avatar && nickname && level) {
                const avatarSrc = avatar.src || avatar.getAttribute('src') || '';
                console.log('\uD83D\uDCF8 Avatar URL:', avatarSrc);
                
                const userState = `${avatarSrc}|${nickname.textContent}|${level.textContent}`;
                
                // Only update if user data changed
                if (userState !== lastUserState) {
                    lastUserState = userState;
                    
                    // Use avatar URL or fallback to generic icon
                    const avatarHTML = avatarSrc && avatarSrc !== '' 
                        ? `<img src="${avatarSrc}" alt="" style="width: 22px; height: 22px; border-radius: 50%; border: 2px solid var(--acc-cyan);">`
                        : `<div style="width: 22px; height: 22px; border-radius: 50%; border: 2px solid var(--acc-cyan); background: var(--acc-cyan); display: flex; align-items: center; justify-content: center; font-size: 0.8rem;">\uD83D\uDC64</div>`;
                    
                    newUserView.innerHTML = `
                        <button class="btn-user-new" id="btnUserMenuNew" onclick="openNewUserMenu()" style="background: rgba(6, 182, 212, 0.1); border: 1px solid var(--acc-cyan); padding: 4px 8px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 6px; font-family: var(--font-hud); transition: all 0.2s;">
                            ${avatarHTML}
                            <span style="color: var(--text-main); font-weight: 700; font-size: 0.75rem; max-width: 80px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${nickname.textContent}</span>
                            <span style="background: var(--acc-cyan); color: #000; padding: 2px 5px; border-radius: 8px; font-size: 0.65rem; font-weight: 900;">Lvl ${level.textContent}</span>
                        </button>
                    `;
                }
            }
        } else {
            // User is logged out
            newAuthView.style.display = 'flex';
            newUserView.style.display = 'none';
            lastUserState = null;
        }
    }, 1000);
    
    // ============================================================
    // 4. NAVIGATION HIGHLIGHTING
    // ============================================================
    function highlightActiveSection() {
        const sections = ['ghosts', 'maps', 'equipment', 'mechanics', 'strategy', 'zeroev', 'updates'];
        
        sections.forEach(sectionId => {
            const section = document.getElementById(`section-${sectionId}`);
            const navBtn = document.querySelector(`button[onclick="showSection('${sectionId}')"]`);
            
            if (section && navBtn) {
                if (section.style.display !== 'none') {
                    navBtn.style.borderColor = 'var(--acc-cyan)';
                    navBtn.style.background = 'rgba(6, 182, 212, 0.1)';
                    navBtn.style.color = '#fff';
                } else {
                    navBtn.style.borderColor = 'transparent';
                    navBtn.style.background = 'transparent';
                    navBtn.style.color = 'var(--text-muted)';
                }
            }
        });
    }
    
    const _origShowSection = showSection;
    window.showSection = function(sectionId) {
        _origShowSection(sectionId);
        highlightActiveSection();
    };
    
    setTimeout(highlightActiveSection, 200);
    
    // ============================================================
    // 5. SIDEBAR POPULATION
    // ============================================================
    const evidenceContainer = document.getElementById('sidebarEvidence');
    if (evidenceContainer) {
        evidenceContainer.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 6px;">
                <button onclick="cycleEvidence('emf')" oncontextmenu="ruleOutEvidence('emf', event)" data-ev="emf" class="sidebar-btn">
                    <span style="font-size: 1rem;">\uD83D\uDCF6</span>
                    <span style="font-family: var(--font-hud); font-size: 0.75rem; font-weight: 600; color: var(--text-main); flex: 1;">EMF 5</span>
                </button>
                <button onclick="cycleEvidence('box')" oncontextmenu="ruleOutEvidence('box', event)" data-ev="box" class="sidebar-btn">
                    <span style="font-size: 1rem;">\uD83D\uDCE6</span>
                    <span style="font-family: var(--font-hud); font-size: 0.75rem; font-weight: 600; color: var(--text-main); flex: 1;">BOX</span>
                </button>
                <button onclick="cycleEvidence('uv')" oncontextmenu="ruleOutEvidence('uv', event)" data-ev="uv" class="sidebar-btn">
                    <span style="font-size: 1rem;">\uD83D\uDCA1</span>
                    <span style="font-family: var(--font-hud); font-size: 0.75rem; font-weight: 600; color: var(--text-main); flex: 1;">UV</span>
                </button>
                <button onclick="cycleEvidence('orb')" oncontextmenu="ruleOutEvidence('orb', event)" data-ev="orb" class="sidebar-btn">
                    <span style="font-size: 1rem;">\uD83D\uDD2E</span>
                    <span style="font-family: var(--font-hud); font-size: 0.75rem; font-weight: 600; color: var(--text-main); flex: 1;">ORBS</span>
                </button>
                <button onclick="cycleEvidence('writing')" oncontextmenu="ruleOutEvidence('writing', event)" data-ev="writing" class="sidebar-btn">
                    <span style="font-size: 1rem;">\u270D\uFE0F</span>
                    <span style="font-family: var(--font-hud); font-size: 0.75rem; font-weight: 600; color: var(--text-main); flex: 1;">WRITING</span>
                </button>
                <button onclick="cycleEvidence('freezing')" oncontextmenu="ruleOutEvidence('freezing', event)" data-ev="freezing" class="sidebar-btn">
                    <span style="font-size: 1rem;">\u2744\uFE0F</span>
                    <span style="font-family: var(--font-hud); font-size: 0.75rem; font-weight: 600; color: var(--text-main); flex: 1;">FREEZE</span>
                </button>
                <button onclick="cycleEvidence('dots')" oncontextmenu="ruleOutEvidence('dots', event)" data-ev="dots" class="sidebar-btn">
                    <span style="font-size: 1rem;">\uD83C\uDFAF</span>
                    <span style="font-family: var(--font-hud); font-size: 0.75rem; font-weight: 600; color: var(--text-main); flex: 1;">D.O.T.S</span>
                </button>
            </div>
        `;
    }
    
    const filtersContainer = document.getElementById('sidebarFilters');
    if (filtersContainer) {
        filtersContainer.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 6px;">
                <button onclick="toggleFilter('fast')" data-filter="fast" class="sidebar-btn">
                    <span style="font-size: 1rem;">\u26A1</span>
                    <span style="font-family: var(--font-hud); font-size: 0.75rem; font-weight: 600; color: var(--text-main);">Speed Change</span>
                </button>
                <button onclick="toggleFilter('early')" data-filter="early" class="sidebar-btn">
                    <span style="font-size: 1rem;">\u26A0\uFE0F</span>
                    <span style="font-family: var(--font-hud); font-size: 0.75rem; font-weight: 600; color: var(--text-main);">Early Hunter</span>
                </button>
                <button onclick="toggleFilter('quiet')" data-filter="quiet" class="sidebar-btn">
                    <span style="font-size: 1rem;">\uD83D\uDFE1</span>
                    <span style="font-family: var(--font-hud); font-size: 0.75rem; font-weight: 600; color: var(--text-main);">Quiet Steps</span>
                </button>
                <button onclick="toggleFilter('guarantee')" data-filter="guarantee" class="sidebar-btn">
                    <span style="font-size: 1rem;">\u2728</span>
                    <span style="font-family: var(--font-hud); font-size: 0.75rem; font-weight: 600; color: var(--text-main);">Guaranteed Ev</span>
                </button>
            </div>
        `;
    }
    
    // Hook submit button
    const btnSubmit = document.getElementById('btnSubmitSidebar');
    if (btnSubmit) {
        btnSubmit.addEventListener('click', openGuessModal);
    }
    
    // Timer sync
    setInterval(function() {
        const sidebarInv = document.getElementById('sidebarInvestigation');
        const timerEl = document.getElementById('sidebarTimer');
        
        if (!currentInvestigation) {
            if (sidebarInv) sidebarInv.style.display = 'none';
            return;
        }
        
        if (sidebarInv) sidebarInv.style.display = 'block';
        
        const elapsed = Math.floor((Date.now() - currentInvestigation.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        if (timerEl) {
            timerEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }, 1000);
    
    setTimeout(syncSidebar, 100);
});


