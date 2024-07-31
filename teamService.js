const mysql = require('mysql2');
const connection = require('./dbConnection');
const { getPlayerInput, askForMorePlayerDetails } = require('./inputHandler');
const { addPlayer } = require('./playerData');

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
    counts[player.position]++;
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

const startServer = (app, port) => {
  return new Promise((resolve) => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
      resolve();
    });
  });
};

const main = async (app) => {
  console.log('Starting application...'); 
  await startServer(app, 3000);
  console.log('Connected to the database.');
  const addPlayerCallback = async (player) => {
    if (player) {
      await addPlayer(player);
      askForMorePlayerDetails(addPlayerCallback);
    } else {
      console.log('Player data entry complete.');
      process.exit(0); 
    } };  
  await getPlayerInput(addPlayerCallback);
};
module.exports = {
  getPlayersFromDB,
  selectTeam,
  randomSelectPlayers,
  countPlayersByPosition,
  sortByAPT,
  findHighestAPT,
  findLowestAVG,
  searchPlayers,
  startServer,
  main
};