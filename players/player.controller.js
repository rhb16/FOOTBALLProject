// player.controller.js
const {
    addPlayer,
    getPlayersFromDB,
    selectTeam,
    randomSelectPlayers,
    countPlayersByPosition,
    sortByAPT,
    findHighestAPT,
    findLowestAVG,
    searchPlayers,
  } = require('./player.service'); // Adjust path if necessary
  
  // Handler to add a new player
  const handleAddPlayer = async (req, res) => {
    const { firstName, lastName, APT, set_score, position, nationalAssociation } = req.body;
    try {
      const player = {
        firstName,
        lastName,
        APT: parseFloat(APT),
        set_score: parseFloat(set_score),
        position,
        nationalAssociation,
      };
      const result = await addPlayer(player);
      res.status(200).json({ message: 'Player added successfully', result });
    } catch (error) {
      console.error('Error handling request:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  
  // Handler to get all players
  const handleGetPlayers = async (req, res) => {
    try {
      const players = await getPlayersFromDB();
      res.json(players);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  // Handler to select a team based on player positions
  const handleSelectTeam = async (req, res) => {
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
  };
  
  // Handler to randomly select players
  const handleRandomSelectPlayers = async (req, res) => {
    const count = parseInt(req.query.count, 10);
    try {
      const selectedPlayers = await randomSelectPlayers(count);
      res.json(selectedPlayers);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  // Handler to count players by position
  const handleCountPlayersByPosition = async (req, res) => {
    try {
      const counts = await countPlayersByPosition();
      res.json(counts);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  // Handler to sort players by APT
  const handleSortByAPT = async (req, res) => {
    try {
      const sortedPlayers = await sortByAPT();
      res.json(sortedPlayers);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  // Handler to find the player with the highest APT
  const handleFindHighestAPT = async (req, res) => {
    try {
      const player = await findHighestAPT();
      res.json(player);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  // Handler to find the player with the lowest AVG
  const handleFindLowestAVG = async (req, res) => {
    try {
      const player = await findLowestAVG();
      res.json(player);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  // Handler to search players by a query string
  const handleSearchPlayers = async (req, res) => {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required.' });
    }
    try {
      const players = await searchPlayers(query);
      if (players.length === 0) {
        return res.status(404).json({ error: 'No players found matching the query.' });
      }
      res.json(players);
    } catch (error) {
      console.error('Error handling request:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  module.exports = {
    handleAddPlayer,
    handleGetPlayers,
    handleSelectTeam,
    handleRandomSelectPlayers,
    handleCountPlayersByPosition,
    handleSortByAPT,
    handleFindHighestAPT,
    handleFindLowestAVG,
    handleSearchPlayers,
  };
  