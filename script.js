document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('calculate').addEventListener('click', function() {
        const formation = document.getElementById('formation-select').value;
        const playerCounts = {
            st: parseInt(document.getElementById('st-count-select').value, 10) || 0,
            lw: parseInt(document.getElementById('lw-count-select').value, 10) || 0,
            rw: parseInt(document.getElementById('rw-count-select').value, 10) || 0,
            cm: parseInt(document.getElementById('cm-count-select').value, 10) || 0,
            cdm: parseInt(document.getElementById('cdm-count-select').value, 10) || 0,
            cb: parseInt(document.getElementById('cb-count-select').value, 10) || 0,
            lb: parseInt(document.getElementById('lb-count-select').value, 10) || 0,
            rb: parseInt(document.getElementById('rb-count-select').value, 10) || 0,
            gk: parseInt(document.getElementById('gk-count-select').value, 10) || 0,
            // Add additional positions as needed.
        };

        const { score, recommendedPositions } = calculateFormationScore(formation, playerCounts);
        displayFormationResult(formation, score, recommendedPositions);
    });
});

function calculateFormationScore(formation, playerCounts) {
    let score = 0;
    let recommendedPositions = {}; // Recommended positions to fill
    
    if (formation === '433H') {
        score += calculatePositionScore(playerCounts.st, 1); // ST
        score += calculatePositionScore(playerCounts.lw, 1); // LW
        score += calculatePositionScore(playerCounts.rw, 1); // RW
        score += calculatePositionScore(playerCounts.cm, 3); // CM
        score += calculatePositionScore(playerCounts.cdm, 1); // CDM
        score += calculatePositionScore(playerCounts.cb, 2); // CB
        score += calculatePositionScore(playerCounts.lb, 1); // LB
        score += calculatePositionScore(playerCounts.rb, 1); // RB
        score += calculatePositionScore(playerCounts.gk, 1); // GK
    } else if (formation === '424') {
        score += calculatePositionScore(playerCounts.st, 2); // ST
        score += calculatePositionScore(playerCounts.lw, 1); // LW
        score += calculatePositionScore(playerCounts.rw, 1); // RW
        score += calculatePositionScore(playerCounts.cm, 2); // CM
        score += calculatePositionScore(playerCounts.cb, 2); // CB
        score += calculatePositionScore(playerCounts.lb, 1); // LB
        score += calculatePositionScore(playerCounts.rb, 1); // RB
        score += calculatePositionScore(playerCounts.gk, 1); // GK
        
        recommendedPositions['LW'] = ["ST", "RW", "CM", "CDM", "CB", "LB", "RB", "GK"];
        recommendedPositions['ST'] = ["LW", "RW", "CM", "CB", "LB", "RB", "GK"];
        recommendedPositions['RW'] = ["LW", "ST", "CM", "CDM", "CB", "LB", "RB", "GK"];
        recommendedPositions['CM'] = ["LW", "ST", "RW", "CDM", "CB", "LB", "RB", "GK"];
        recommendedPositions['CDM'] = ["CM", "CB", "LB", "RB", "GK"];
        recommendedPositions['CB'] = ["CM", "CDM", "LB", "RB", "GK"];
        recommendedPositions['LB'] = ["LW", "ST", "RW", "CM", "CDM", "CB", "RB", "GK"];
        recommendedPositions['RB'] = ["LW", "ST", "RW", "CM", "CDM", "CB", "LB", "GK"];
        recommendedPositions['GK'] = ["LW", "ST", "RW", "CM", "CDM", "CB", "LB", "RB"];
    } else if (formation === '352') {
        score += calculatePositionScore(playerCounts.st, 2); // ST
        score += calculatePositionScore(playerCounts.lw, 1); // LW
        score += calculatePositionScore(playerCounts.rw, 1); // RW
        score += calculatePositionScore(playerCounts.cm, 3); // CM
        score += calculatePositionScore(playerCounts.cdm, 2); // CDM
        score += calculatePositionScore(playerCounts.cb, 3); // CB
        score += calculatePositionScore(playerCounts.lb, 2); // LB
        score += calculatePositionScore(playerCounts.rb, 2); // RB
        score += calculatePositionScore(playerCounts.gk, 1); // GK

        recommendedPositions['LW'] = ["ST", "RW", "CM", "CDM", "CB", "LB", "RB", "GK"];
        recommendedPositions['ST'] = ["LW", "RW", "CM", "CB", "LB", "RB", "GK"];
        recommendedPositions['RW'] = ["LW", "ST", "CM", "CDM", "CB", "LB", "RB", "GK"];
        recommendedPositions['CM'] = ["LW", "ST", "RW", "CDM", "CB", "LB", "RB", "GK"];
        recommendedPositions['CDM'] = ["CM", "CB", "LB", "RB", "GK"];
        recommendedPositions['CB'] = ["CM", "CDM", "LB", "RB", "GK"];
        recommendedPositions['LB'] = ["LW", "ST", "RW", "CM", "CDM", "CB", "RB", "GK"];
        recommendedPositions['RB'] = ["LW", "ST", "RW", "CM", "CDM", "CB", "LB", "GK"];
        recommendedPositions['GK'] = ["LW", "ST", "RW", "CM", "CDM", "CB", "LB", "RB"];
    }
    // Extend with other formations as needed.

    return { score, recommendedPositions };
}


function suggestNextPositions(formation, playerCounts) {
    const nextPositions = {
        "LW": ["ST", "RW", "CM", "CDM", "CB", "LB", "RB", "GK"],
        "ST": ["LW", "RW", "CM", "CB", "LB", "RB", "GK"],
        "RW": ["LW", "ST", "CM", "CDM", "CB", "LB", "RB", "GK"],
        "CM": ["LW", "ST", "RW", "CDM", "CB", "LB", "RB", "GK"],
        "CDM": ["CM", "CB", "LB", "RB", "GK"],
        "CB": ["CM", "CDM", "LB", "RB", "GK"],
        "LB": ["LW", "ST", "RW", "CM", "CDM", "CB", "RB", "GK"],
        "RB": ["LW", "ST", "RW", "CM", "CDM", "CB", "LB", "GK"],
        "GK": ["LW", "ST", "RW", "CM", "CDM", "CB", "LB", "RB"]
    };

    const recommendations = {};
    for (const position in nextPositions) {
        if (nextPositions.hasOwnProperty(position)) {
            recommendations[position] = [];
            for (const nextPosition of nextPositions[position]) {
                if (!playerCounts[nextPosition] || playerCounts[nextPosition] === 0) {
                    recommendations[position].push(nextPosition);
                }
            }
        }
    }
    return recommendations;
}

function calculatePositionScore(count, required) {
    let score = 0;
    if (count >= required) {
        score = 19 * required;
    } else {
        score += 19 * count; // Score for actual players
        let remaining = required - count; // Calculate remaining needed players
        if (remaining > 0) {
            score += 16 * Math.min(remaining, count);
            remaining -= Math.min(remaining, count);
        }
        if (remaining > 0) {
            score += 14 * remaining;
        }
    }
    return score;
}

function displayFormationResult(formation, score, recommendedPositions) {
    const resultElement = document.getElementById('result');
    let resultHTML = `For the selected formation ${formation}, the optimal score is: ${score}.<br><br>`;
    resultHTML += 'Recommended positions to fill:<br>';
    for (const position in recommendedPositions) {
        resultHTML += `${position}: ${recommendedPositions[position].join(', ')}<br>`;
    }
    resultElement.innerHTML = resultHTML;
}

