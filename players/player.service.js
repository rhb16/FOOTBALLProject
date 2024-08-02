// player.service.js
const mysql = require('mysql2');
const connection = require('../lib/dbConnection');

// Function to add a player to the database
const addPlayer = async (player) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO players (firstName, lastName, APT, set_score, nationalAssociation, position, AVG)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      player.firstName,
      player.lastName,
      player.APT,
      player.set_score,
      player.nationalAssociation.toLowerCase(),
      player.position.toLowerCase(),
      (player.APT + player.set_score) / 2
    ];
    connection.query(query, values, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Function to get all players from the database
const getPlayersFromDB = async () => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM players', (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Function to select a team based on the number of defenders, midfielders, and attackers
const selectTeam = async (defendersCount, midfieldersCount, attackersCount) => {
  const players = await getPlayersFromDB();
  const selectedTeam = [];
  const sortedPlayers = players.sort((a, b) => b.set_score - a.set_score);
  const positions = { Defender: 0, Midfielder: 0, Attacker: 0 };
  sortedPlayers.forEach((player) => {
    if (positions[player.position] < {
      Defender: defendersCount,
      Midfielder: midfieldersCount,
      Attacker: attackersCount,
    }[player.position]) {
      selectedTeam.push(player);
      positions[player.position]++;
    }
  });
  return selectedTeam.slice(0, 10);
};

// Function to randomly select a number of players
const randomSelectPlayers = async (count) => {
  const players = await getPlayersFromDB();
  const shuffledPlayers = players.sort(() => 0.5 - Math.random());
  return shuffledPlayers.slice(0, count);
};

// Function to count players by position
const countPlayersByPosition = async () => {
  const players = await getPlayersFromDB();
  const counts = { Defender: 0, Midfielder: 0, Attacker: 0 };
  players.forEach((player) => {
    const position = player.position.charAt(0).toUpperCase() + player.position.slice(1).toLowerCase();
    if (counts[position] !== undefined) {
      counts[position]++;
    }
  });
  return counts;
};

// Function to sort players by APT in descending order
const sortByAPT = async () => {
  const players = await getPlayersFromDB();
  return players.sort((a, b) => b.APT - a.APT);
};

// Function to find the player with the highest APT
const findHighestAPT = async () => {
  const players = await getPlayersFromDB();
  return players.reduce((max, player) => (player.APT > max.APT ? player : max), players[0]);
};

// Function to find the player with the lowest AVG
const findLowestAVG = async () => {
  const players = await getPlayersFromDB();
  return players.reduce((min, player) => (player.AVG < min.AVG ? player : min), players[0]);
};

// Function to search players by a query string
const searchPlayers = async (query) => {
  const players = await getPlayersFromDB();
  const lowerCaseQuery = query.toLowerCase();
  return players.filter(player =>
    player.firstName.toLowerCase().includes(lowerCaseQuery) ||
    player.lastName.toLowerCase().includes(lowerCaseQuery)
  );
};

module.exports = {
  addPlayer,
  getPlayersFromDB,
  selectTeam,
  randomSelectPlayers,
  countPlayersByPosition,
  sortByAPT,
  findHighestAPT,
  findLowestAVG,
  searchPlayers,
};
