// ============================================================
// PhasmoOS - 10-sidebar-ui.js
// Sidebar sync, evidence cycling/rule-out, filter toggle, updateBoard hook, injected sidebar CSS, user menu
// Split from script.js - load order matters (see index.html)
// ============================================================


// ============================================================
// SIDEBAR SYNC FUNCTION
// ============================================================
function syncSidebar() {
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
        
        if(possible) {
            matches.push(g);
            g.ev.forEach(e => possibleEv.add(e));
            if(g.name === 'The Mimic') possibleEv.add('orb');
        }
    });
    
    Object.keys(app.evidence).forEach(evId => {
        const btn = document.querySelector(`#sidebarEvidence button[data-ev="${evId}"]`);
        if (btn) {
            btn.style.borderColor = 'var(--border)';
            btn.style.background = 'var(--bg-card)';
            btn.style.opacity = '1';
            btn.style.pointerEvents = 'auto';
            
            if (app.evidence[evId] === 1) {
                btn.style.borderColor = 'var(--acc-green)';
                btn.style.background = 'rgba(16, 185, 129, 0.1)';
            } else if (app.evidence[evId] === 2) {
                btn.style.borderColor = 'var(--acc-red)';
                btn.style.background = 'rgba(239, 68, 68, 0.1)';
                btn.style.opacity = '0.6';
            } else if (app.evidence[evId] === 0 && matches.length < GHOSTS.length && !possibleEv.has(evId)) {
                btn.style.opacity = '0.3';
                btn.style.pointerEvents = 'none';
            }
        }
    });
    
    document.querySelectorAll('#sidebarFilters button').forEach(btn => {
        const filterId = btn.dataset.filter;
        btn.style.borderColor = 'var(--border)';
        btn.style.background = 'var(--bg-card)';
        
        if (app.activeFilters.has(filterId)) {
            btn.style.borderColor = 'var(--acc-purple)';
            btn.style.background = 'rgba(139, 92, 246, 0.1)';
        }
    });
    
    const sidebarCount = document.getElementById('sidebarCount');
    const mainCount = document.getElementById('matchCount');
    if (sidebarCount && mainCount) {
        sidebarCount.textContent = mainCount.textContent;
    }
}

// ============================================================
// EVIDENCE FUNCTIONS
// ============================================================
function cycleEvidence(evId) {
    if (app.evidence[evId] === 0) {
        app.evidence[evId] = 1;
    } else {
        app.evidence[evId] = 0;
    }
    renderEvidence();
    updateBoard();
}

function ruleOutEvidence(evId, event) {
    event.preventDefault();
    if (app.evidence[evId] === 0) {
        app.evidence[evId] = 2;
    } else {
        app.evidence[evId] = 0;
    }
    renderEvidence();
    updateBoard();
}

// ============================================================
// FILTER FUNCTION
// ============================================================
function toggleFilter(filterId) {
    if (app.activeFilters.has(filterId)) {
        app.activeFilters.delete(filterId);
    } else {
        app.activeFilters.add(filterId);
    }
    renderFilters();
    updateBoard();
}

// ============================================================
// HOOK INTO UPDATEBOARD
// ============================================================
const _origUpdateBoard = updateBoard;
updateBoard = function() {
    _origUpdateBoard();
    
    // Highlight final ghost
    const matches = document.querySelectorAll('.card');
    if (matches.length === 1) {
        matches[0].style.border = '2px solid var(--acc-green)';
        matches[0].style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.3)';
        matches[0].style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, var(--bg-card) 100%)';
    }
    
    syncSidebar();
};

// Add sidebar button styling
const sidebarCSS = document.createElement('style');
sidebarCSS.textContent = `
    .sidebar-btn {
        background: var(--bg-card);
        border: 1px solid var(--border);
        padding: 8px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        transition: 0.2s;
    }
    .sidebar-btn:hover {
        border-color: var(--acc-cyan);
        background: rgba(6, 182, 212, 0.05);
    }
`;
document.head.appendChild(sidebarCSS);


// ============================================================
// GLOBAL USER MENU FUNCTION
// ============================================================
window.openNewUserMenu = function() {
    console.log('\uD83D\uDD35 New user menu button clicked!');
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        console.log('\uD83D\uDD35 Toggling dropdown, current display:', dropdown.style.display);
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        console.log('\uD83D\uDD35 New display:', dropdown.style.display);
    } else {
        console.error('\u274C User dropdown not found!');
    }
};



