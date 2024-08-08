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
  } = require('./player.service'); 
  
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

const handleGetPlayers = async (req, res) => {
    try {
      const players = await getPlayersFromDB();
      res.json(players);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  const handleSelectTeam = async (req, res) => {
    try {
      const { defendersCount, midfieldersCount, attackersCount } = req.query;
      const team = await selectTeam(parseInt(defendersCount), parseInt(midfieldersCount), parseInt(attackersCount));
      res.json(team);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const handleRandomSelectPlayers = async (req, res) => {
    try {
      const { count } = req.query;
      const players = await randomSelectPlayers(parseInt(count));
      res.json(players);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const handleCountPlayersByPosition = async (req, res) => {
    try {
      const counts = await countPlayersByPosition();
      res.json(counts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const handleSortByAPT = async (req, res) => {
    try {
      const players = await sortByAPT();
      res.json(players);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const handleFindHighestAPT = async (req, res) => {
    try {
      const player = await findHighestAPT();
      res.json(player);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  const handleFindLowestAVG = async (req, res) => {
    try {
      const player = await findLowestAVG();
      res.json(player);
    } catch (error) {
      res.status(500).json({ error: error.message });
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
    handleFindLowestAVG
  };