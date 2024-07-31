const mysql = require('mysql2');
const connection = require('./dbConnection');
const { getPlayerInput, askForMorePlayerDetails, readline } = require('./inputHandler');
const { addPlayer } = require('./playerData');
const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());

// FIRST API CALL
const getPlayersFromDB = async () => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM players', (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

app.get('/api/players', async (req, res) => {
  try {
    const players = await getPlayersFromDB();
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// SECOND API CALL
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

app.get('/api/selectplayers', async (req, res) => {
  const { defendersCount, midfieldersCount, attackersCount } = req.query;
  if (!defendersCount || !midfieldersCount || !attackersCount) {
    return res.status(400).json({ error: 'Missing required query parameters' });
  }
  try {
    const players = await selectTeam(
      parseInt(defendersCount, 10),
      parseInt(midfieldersCount, 10),
      parseInt(attackersCount, 10)
    );
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// THIRD API CALL
const randomSelectPlayers = async (count) => {
  const players = await getPlayersFromDB();
  const shuffledPlayers = players.sort(() => 0.5 - Math.random());
  return shuffledPlayers.slice(0, count);
};

app.get('/api/random-players', async (req, res) => {
  const count = parseInt(req.query.count, 10) || 5; // Default to 5 players if count is not provided
  try {
    const selectedPlayers = await randomSelectPlayers(count);
    res.json(selectedPlayers);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// FOURTH API CALL
const countPlayersByPosition = async () => {
  const players = await getPlayersFromDB();
  const counts = { Defender: 0, Midfielder: 0, Attacker: 0 };
  players.forEach((player) => {
    counts[player.position]++;
  });
  return counts;
};

app.get('/api/count-players-by-position', async (req, res) => {
  try {
    const counts = await countPlayersByPosition();
    res.json(counts);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// FIFTH API CALL
const sortByAPT = async () => {
  const players = await getPlayersFromDB();
  return players.sort((a, b) => b.APT - a.APT);
};

app.get('/api/sort-by-apt', async (req, res) => {
  try {
    const sortedPlayers = await sortByAPT();
    res.json(sortedPlayers);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// SIXTH API CALL
const findHighestAPT = async () => {
  const players = await getPlayersFromDB();
  return players.reduce((max, player) => (player.APT > max.APT ? player : max), players[0]);
};

app.get('/api/find-highest-apt', async (req, res) => {
  try {
    const player = await findHighestAPT();
    res.json(player);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// SEVENTH API CALL
const findLowestAVG = async () => {
  const players = await getPlayersFromDB();
  return players.reduce((min, player) => (player.AVG < min.AVG ? player : min), players[0]);
};

app.get('/api/find-lowest-avg', async (req, res) => {
  try {
    const player = await findLowestAVG();
    res.json(player);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// EIGHTH API CALL
const searchPlayers = async (query) => {
  const players = await getPlayersFromDB();
  const lowerCaseQuery = query.toLowerCase();
  return players.filter(player =>
    player.firstName.toLowerCase().includes(lowerCaseQuery) ||
    player.lastName.toLowerCase().includes(lowerCaseQuery)
  );
};

app.get('/api/search-players', async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: 'Query parameter "q" is required.' });
  }
  try {
    const players = await searchPlayers(query);
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const main = async () => {
    const addPlayerCallback = async (player) => {
      if (player) {
        await addPlayer(player);
        askForMorePlayerDetails(addPlayerCallback); // Ask for more player details
      } else {
        // User has decided not to add more players
        console.log('Player data entry complete.');
        process.exit(0); // Exit the program
      }
    };
  
    await getPlayerInput(addPlayerCallback);
  };
  
  main().catch(console.error);
  
  app.listen(port, () => {
    // Server log omitted
  });
  