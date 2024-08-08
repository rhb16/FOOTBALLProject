const mysql = require('mysql2');
const getConnection = require('../lib/dbConnection');

const addPlayer = async (player) => { //working 
  const connection = await getConnection();
  const query = `
    INSERT INTO players (firstName, lastName, APT, set_score, nationalAssociation, position, AVG)
    VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const values = [
    player.firstName,
    player.lastName,
    player.APT,
    player.set_score,
    player.nationalAssociation.toLowerCase(),
    player.position.toLowerCase(),
    (player.APT + player.set_score) / 2
  ];
  const [results] = await connection.query(query, values);

  console.log(results); // Log query results
  return "Player added successfully";
};

const getPlayersFromDB = async () => {
  const connection = await getConnection();
  const query = 'SELECT * FROM players';
  const [results] = await connection.query(query);

  console.log('Players fetched:', results); // Log fetched players
  return results;
};

const selectTeam = async (defendersCount, midfieldersCount, attackersCount) => {
  const players = await getPlayersFromDB();
  const selectedTeam = [];
  const sortedPlayers = players.sort((a, b) => b.set_score - a.set_score);

  const positions = { Defender: defendersCount, Midfielder: midfieldersCount, Attacker: attackersCount };

  sortedPlayers.forEach((player) => {
    if (selectedTeam.filter(p => p.position === player.position).length < positions[player.position]) {
      selectedTeam.push(player);
    }
  });

  console.log('Selected team:', selectedTeam); // Log selected team
  return selectedTeam.slice(0, 10);
};

const randomSelectPlayers = async (count) => {
  const players = await getPlayersFromDB();
  const shuffledPlayers = players.sort(() => 0.5 - Math.random());
  console.log('Randomly selected players:', shuffledPlayers.slice(0, count)); // Log random players
  return shuffledPlayers.slice(0, count);
};

const countPlayersByPosition = async () => {
  const players = await getPlayersFromDB();
  const counts = { Defender: 0, Midfielder: 0, Attacker: 0 };

  players.forEach((player) => {
    if (player.position) {
      const position = player.position.charAt(0).toUpperCase() + player.position.slice(1).toLowerCase();
      if (counts[position] !== undefined) {
        counts[position]++;
      }
    }
  });

  console.log('Player counts by position:', counts); // Log counts
  return counts;
};

const sortByAPT = async () => {
  const players = await getPlayersFromDB();
  const sorted = players.sort((a, b) => b.APT - a.APT);
  console.log('Players sorted by APT:', sorted); // Log sorted players
  return sorted;
};

const findHighestAPT = async () => {
  const players = await getPlayersFromDB();
  const highest = players.reduce((max, player) => (player.APT > max.APT ? player : max), players[0]);
  console.log('Highest APT player:', highest); // Log highest APT player
  return highest;
};

const findLowestAVG = async () => {
  const players = await getPlayersFromDB();
  const lowest = players.reduce((min, player) => (player.AVG < min.AVG ? player : min), players[0]);
  console.log('Lowest AVG player:', lowest); // Log lowest AVG player
  return lowest;
};

module.exports = {
  addPlayer,
  getPlayersFromDB,
  selectTeam,
  randomSelectPlayers,
  countPlayersByPosition,
  sortByAPT,
  findHighestAPT,
  findLowestAVG
};
