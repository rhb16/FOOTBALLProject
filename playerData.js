const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'players.json');

let players = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

players.forEach(player => {
    player.AVG = (player.APT + player.SET) / 2;
});

const savePlayers = () => {
    fs.writeFileSync(filePath, JSON.stringify(players, null, 4));
};

module.exports = { players, savePlayers };
