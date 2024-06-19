let players = [];
let currentRound = 1;
const maxRounds = 5;
const startingAmount = 10000;
const investAmount = 5000;

function setupPlayers() {
    const numPlayers = document.getElementById('numPlayers').value;
    const nameInputsDiv = document.getElementById('nameInputs');
    nameInputsDiv.innerHTML = '';
    for (let i = 0; i < numPlayers; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = `Enter name for player ${i + 1}`;
        input.required = true;
        nameInputsDiv.appendChild(input);
    }
    document.getElementById('game-setup').style.display = 'none';
    document.getElementById('player-names').style.display = 'block';
}

function startGame() {
    const nameInputs = document.querySelectorAll('#nameInputs input');
    nameInputs.forEach(input => {
        players.push({
            name: input.value,
            balance: startingAmount
        });
    });
    document.getElementById('player-names').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    displayInvestments();
}

function displayInvestments() {
    const playerInvestmentsDiv = document.getElementById('playerInvestments');
    playerInvestmentsDiv.innerHTML = '';
    players.forEach(player => {
        const div = document.createElement('div');
        div.innerHTML = `
            <label>${player.name}, how much do you want to invest (0, 2000, 5000)?</label>
            <input type="number" min="0" max="5000" step="2000" data-player="${player.name}">
        `;
        playerInvestmentsDiv.appendChild(div);
    });
}

function playRound() {
    const investmentInputs = document.querySelectorAll('#playerInvestments input');
    let investments = {};
    let pot = 0;

    investmentInputs.forEach(input => {
        const playerName = input.getAttribute('data-player');
        const investment = parseFloat(input.value);
        if ([0, 2000, 5000].includes(investment)) {
            investments[playerName] = investment;
            pot += investment;
        } else {
            alert("Invalid input. Please enter 0, 2000, or 5000.");
            return;
        }
    });

    pot *= 2; // Double the pot
    const distribution = pot / players.length;

    players.forEach(player => {
        player.balance += distribution - investments[player.name];
    });

    if (currentRound < maxRounds) {
        currentRound++;
        document.getElementById('roundNumber').innerText = currentRound;
        displayInvestments();
    } else {
        document.getElementById('game').style.display = 'none';
        displayResults();
    }
}

function displayResults() {
    const finalBalancesDiv = document.getElementById('finalBalances');
    finalBalancesDiv.innerHTML = '';
    players.forEach(player => {
        const div = document.createElement('div');
        div.innerText = `${player.name}: $${player.balance.toFixed(2)}`;
        finalBalancesDiv.appendChild(div);
    });
    document.getElementById('results').style.display = 'block';
}
