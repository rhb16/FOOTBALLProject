const express = require('express');
const router = express.Router();
const {
  addPlayerService,
  getPlayersFromDB,
  selectTeam,
  randomSelectPlayers,
  countPlayersByPosition,
  sortByAPT,
  findHighestAPT,
  findLowestAVG,
  searchPlayers
} = require('./teamService');

router.post('/addPlayer', async (req, res) => {
  try {
    const validPositions = ['defender', 'midfielder', 'attacker'];
    const validNationalAssociations = ['england', 'northern ireland', 'scotland', 'wales'];
    const { firstName, lastName, APT, setScore, position, nationalAssociation } = req.body;
    if (!firstName || !lastName || isNaN(APT) || isNaN(setScore) || !position || !nationalAssociation) {
      return res.status(400).json({ message: 'All fields are required and APT/SET must be numbers.' });
    }
    if (!validPositions.includes(position.toLowerCase())) {
      return res.status(400).json({ message: 'Position must be one of the following: defender, midfielder, attacker.' });
    }
    const normalizedNationalAssociation = nationalAssociation.trim().toLowerCase();
    if (!validNationalAssociations.includes(normalizedNationalAssociation)) {
      return res.status(400).json({ message: 'National Association must be one of the following: England, Northern Ireland, Scotland, Wales.' });
    }
    const player = {
      firstName,
      lastName,
      APT: parseFloat(APT),
      setScore: parseFloat(setScore), 
      position,
      nationalAssociation
    };
    const result = await addPlayerService(player);
    res.status(200).json({ message: result.message });
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// FIRST API CALL
router.get('/api/players', async (req, res) => {
  try {
    const players = await getPlayersFromDB();
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// SECOND API CALL
router.get('/api/selectplayers', async (req, res) => {
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
router.get('/api/random-players', async (req, res) => {
  const count = parseInt(req.query.count, 10) || 5; 
  try {
    const selectedPlayers = await randomSelectPlayers(count);
    res.json(selectedPlayers);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// FOURTH API CALL
router.get('/api/count-players-by-position', async (req, res) => {
  try {
    const counts = await countPlayersByPosition();
    res.json(counts);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// FIFTH API CALL
router.get('/api/sort-by-apt', async (req, res) => {
  try {
    const sortedPlayers = await sortByAPT();
    res.json(sortedPlayers);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// SIXTH API CALL
router.get('/api/find-highest-apt', async (req, res) => {
  try {
    const player = await findHighestAPT();
    res.json(player);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// SEVENTH API CALL
router.get('/api/find-lowest-avg', async (req, res) => {
  try {
    const player = await findLowestAVG();
    res.json(player);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// EIGHTH API CALL
router.get('/api/search-players', async (req, res) => {
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

module.exports = router;
