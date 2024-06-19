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
    socket = new WebSocket('ws://localhost:8080');

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
            document.getElementBy
