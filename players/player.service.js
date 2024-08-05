
const mysql = require('mysql2');
const connection = require('../lib/dbConnection');

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

const getPlayersFromDB = async () => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM players', (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

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

const randomSelectPlayers = async (count) => {
  const players = await getPlayersFromDB();
  const shuffledPlayers = players.sort(() => 0.5 - Math.random());
  return shuffledPlayers.slice(0, count);
};

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

const sortByAPT = async () => {
  const players = await getPlayersFromDB();
  return players.sort((a, b) => b.APT - a.APT);
};

const findHighestAPT = async () => {
  const players = await getPlayersFromDB();
  return players.reduce((max, player) => (player.APT > max.APT ? player : max), players[0]);
};

const findLowestAVG = async () => {
  const players = await getPlayersFromDB();
  return players.reduce((min, player) => (player.AVG < min.AVG ? player : min), players[0]);
};

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
