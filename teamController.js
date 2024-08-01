const express = require('express');
const router = express.Router();
const{
  validatePlayer,
  validateSelectPlayers,
  validateSearchPlayers
}=require('./validations');
const {
  addPlayerService,
  getPlayersFromDB,
  selectTeam,
  randomSelectPlayers,
  countPlayersByPosition,
  sortByAPT,
  findHighestAPT,
  findLowestAVG,
  searchPlayers } = require('./teamService');

router.post('/addPlayer', validatePlayer, async (req, res) => {
    const { firstName, lastName, APT, setScore, position, nationalAssociation } = req.body;
    try {
      const player = {
        firstName,
        lastName,
        APT: parseFloat(APT),
        set_score: parseFloat(setScore), 
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

router.get('/players', async (req, res) => {
  try {
    const players = await getPlayersFromDB();
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/api/selectplayers', validateSelectPlayers, async (req, res) => {
  const { defendersCount, midfieldersCount, attackersCount } = req.query;
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

router.get('/random-players', async (req, res) => {
  const count = parseInt(req.query.count, 10) ; 
  try {
    const selectedPlayers = await randomSelectPlayers(count);
    res.json(selectedPlayers);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/count-players-by-position', async (req, res) => {
  try {
    const counts = await countPlayersByPosition();
    res.json(counts);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/sort-by-apt', async (req, res) => {
  try {
    const sortedPlayers = await sortByAPT();
    res.json(sortedPlayers);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/find-highest-apt', async (req, res) => {
  try {
    const player = await findHighestAPT();
    res.json(player);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/find-lowest-avg', async (req, res) => {
  try {
    const player = await findLowestAVG();
    res.json(player);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/api/search-players', validateSearchPlayers, async (req, res) => {
  const query = req.query.q;
  try {
    const players = await searchPlayers(query);
    if (players.length === 0) {
      return res.status(404).json({ error: 'No players found matching the query.' });
    }
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;