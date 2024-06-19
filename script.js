let players = [];
let currentRound = 1;
const maxRounds = 5;
const startingAmount = 10000;
const investAmount = 5000;
let socket;
let room;
let name;

function createRoom() {
    room = document.getElementById('room').value;
    name = document.getElementById('name').value;
    socket = new WebSocket('wss://investment-game-server.herokuapp.com');

    socket.onopen = () => {
        socket.send(JSON.stringify({ type: 'create_room', room: room }));
    };

    socket.onmessage = (message) => {
        const data = JSON.parse(message.data);

        if (data.type === 'room_created') {
            document.getElementById('game-setup').classList.add('hidden');
            document.getElementById('game').classList.remove('hidden');
            updatePlayers(data.players);
        } else if (data.type === 'error') {
            alert(data.message);
        } else if (data.type === 'update_players') {
            updatePlayers(data.players);
        } else if (data.type === 'new_round') {
            document.getElementById('roundNumber').innerText = data.round;
            updatePlayers(data.players);
            displayInvestments();
        } else if (data.type === 'game_over') {
            document.getElementById('game').classList.add('hidden');
            displayResults(data.players);
        }
    };
}

function joinRoom() {
    room = document.getElementById('room').value;
    name = document.getElementById('name').value;
    socket = new WebSocket('wss://investment-game-server.herokuapp.com');

    socket.onopen = () => {
        socket.send(JSON.stringify({ type: 'join_room', room: room, name: name }));
    };

    socket.onmessage = (message) => {
        const data = JSON.parse(message.data);

        if (data.type === 'room_joined') {
            document.getElementById('game-setup').classList.add('hidden');
            document.getElementById('game').classList.remove('hidden');
            updatePlayers(data.players);
        } else if (data.type === 'error') {
            alert(data.message);
        } else if (data.type === 'update_players') {
            updatePlayers(data.players);
        } else if (data.type === 'new_round') {
            document.getElementById('roundNumber').innerText = data.round;
            updatePlayers(data.players);
            displayInvestments();
        } else if (data.type === 'game_over') {
            document.getElementById('game').classList.add('hidden');
            displayResults(data.players);
        }
    };
}

function updatePlayers(playersData) {
    players = playersData;
    const playerInvestmentsDiv = document.getElementById('playerInvestments');
    playerInvestmentsDiv.innerHTML = '';
    players.forEach(player => {
        const playerDiv = document.createElement('div');
        playerDiv.innerText = `${player.name}: $${player.balance.toFixed(2)}`;
        playerInvestmentsDiv.appendChild(playerDiv);
    });
}

function displayInvestments() {
    const playerInvestmentsDiv = document.getElementById('playerInvestments');
    playerInvestmentsDiv.innerHTML = '';

    const player = players.find(p => p.name === name);
    if (player) {
        const inputDiv = document.createElement('div');
        inputDiv.innerHTML = `
            <label for="investment">Invest (0 to ${investAmount}): </label>
            <input type="number" id="investment" min="0" max="${investAmount}" step="500">
        `;
        playerInvestmentsDiv.appendChild(inputDiv);
    }
}

function playRound() {
    const investment = parseFloat(document.getElementById('investment').value);
    if (isNaN(investment) || investment < 0 || investment > investAmount) {
        alert(`Please enter a value between 0 and ${investAmount}`);
        return;
    }

    socket.send(JSON.stringify({ type: 'invest', room: room, name: name, investment: investment }));
}

function displayResults(playersData) {
    const finalBalancesDiv = document.getElementById('finalBalances');
    finalBalancesDiv.innerHTML = '';
    playersData.forEach(player => {
        const playerDiv = document.createElement('div');
        playerDiv.innerText = `${player.name}: $${player.balance.toFixed(2)}`;
        finalBalancesDiv.appendChild(playerDiv);
    });
    document.getElementById('results').classList.remove('hidden');
}
