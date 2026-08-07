// ============================================================
// PhasmoOS - 12-investigation-override.js
// Investigation mode override + safe investigation result handler
// Split from script.js - load order matters (see index.html)
// ============================================================

// ======================================================
// INVESTIGATION MODE OVERRIDE
// ======================================================

function openGuessModal() {

    if (!currentInvestigation) return;

    const modal = document.getElementById('guessModal');
    const container = document.getElementById('ghostOptions');

    container.innerHTML = '';

    const userSelect = document.createElement('select');

    userSelect.id = 'playerGhostGuess';

    userSelect.style.width = '100%';
    userSelect.style.marginBottom = '16px';

    const actualSelect = document.createElement('select');

    actualSelect.id = 'actualGhostSelect';

    actualSelect.style.width = '100%';
    actualSelect.style.marginBottom = '16px';

    GHOSTS.forEach(ghost => {

        const option1 = document.createElement('option');
        option1.value = ghost.name;
        option1.textContent = ghost.name;

        const option2 = document.createElement('option');
        option2.value = ghost.name;
        option2.textContent = ghost.name;

        userSelect.appendChild(option1);
        actualSelect.appendChild(option2);

    });

    const completeBtn = document.createElement('button');

    completeBtn.className = 'btn-primary';
    completeBtn.style.width = '100%';
    completeBtn.textContent = 'Complete Investigation';

    completeBtn.addEventListener('click', () => {

        const guess = userSelect.value;
        const actual = actualSelect.value;

        let xp = 50;

        switch(currentInvestigation.mode){

            case '2':
                xp = 100;
                break;

            case '1':
                xp = 150;
                break;

            case '0':
                xp = 250;
                break;

        }

        const correct = guess === actual;

        saveInvestigationResult(
            correct,
            actual,
            xp
        );

        modal.close();

    });

    container.innerHTML = `
        <p style="margin-bottom:12px;">
            Select the ghost you thought it was, then the actual ghost afterwards.
        </p>
    `;

    container.appendChild(userSelect);
    container.appendChild(actualSelect);
    container.appendChild(completeBtn);

    modal.showModal();

}



// ======================================================
// SAFE INVESTIGATION RESULT HANDLER
// ======================================================



async function saveInvestigationResult(correct, actualGhost, xp){

    try{

        if(!currentUser){

            alert("You must be logged in.");

            return;

        }

        // LOAD EXISTING FIREBASE STATS

        const statsRef =
            firebase.database().ref(
                `users/${currentUser.uid}/stats`
            );

        const snapshot =
            await statsRef.once('value');

        const stats =
            snapshot.val() || {
                total: 0,
                wins: 0,
                losses: 0,
                xp: 0,
                level: 1,
                recentInvestigations: []
            };

        // UPDATE STATS

        stats.total =
            Number(stats.total || 0) + 1;

        if(correct){

            stats.wins =
                Number(stats.wins || 0) + 1;

            stats.xp =
                Number(stats.xp || 0) + xp;

        }else{

            stats.losses =
                Number(stats.losses || 0) + 1;

        }

        // RECALCULATE LEVEL USING EXISTING SYSTEM

        const levelInfo =
            getLevelFromXP(
                Number(stats.xp || 0)
            );

        stats.level =
            levelInfo.level;

        // RECENT INVESTIGATION

        if(!Array.isArray(stats.recentInvestigations)){

            stats.recentInvestigations = [];

        }

        stats.recentInvestigations.unshift({

    actualGhost: actualGhost,

    correct: correct,

    xpGained: correct ? xp : 0,

    possibleGhosts:
        currentInvestigation?.possibleGhosts || [],

    mode:
        currentInvestigation?.mode || "all",

    timestamp: Date.now()

});

        if(stats.recentInvestigations.length > 10){

            stats.recentInvestigations.length = 10;

        }

        // SAVE BACK TO FIREBASE

        await statsRef.set(stats);

        // SAVE TO HISTORY PANEL

        await firebase.database()
            .ref(`users/${currentUser.uid}/history`)
            .push({

                actualGhost: actualGhost,

                possibleGhosts:
                    currentInvestigation?.possibleGhosts || [],

                correct: correct,

                xpGained:
                    correct ? xp : 0,

                timestamp: Date.now()

            });

        // UPDATE UI

        loadUserStatsDisplay();

        alert(
            correct
            ? `Correct! +${xp} XP`
            : `Incorrect! The ghost was ${actualGhost}`
        );

        endInvestigation();

    }catch(error){

        console.error(
            "Failed to save investigation:",
            error
        );

        alert(
            "Failed to save investigation."
        );

    }

}


