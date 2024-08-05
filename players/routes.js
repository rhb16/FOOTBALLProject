const express = require('express');
const router = express.Router();
const {
  validatePlayer,
  validateSelectPlayers,
  validateSearchPlayers,
} = require('./player.schema');

const {
  handleAddPlayer,
  handleGetPlayers,
  handleSelectTeam,
  handleRandomSelectPlayers,
  handleCountPlayersByPosition,
  handleSortByAPT,
  handleFindHighestAPT,
  handleFindLowestAVG,
  handleSearchPlayers,
} = require('./player.controller');

router.post('/addPlayer', validatePlayer, handleAddPlayer);
router.get('/players', handleGetPlayers);
router.get('/selectplayers', validateSelectPlayers, handleSelectTeam);
router.get('/random-players', handleRandomSelectPlayers);
router.get('/count-players-by-position', handleCountPlayersByPosition);
router.get('/sort-by-apt', handleSortByAPT);
router.get('/find-highest-apt', handleFindHighestAPT);
router.get('/find-lowest-avg', handleFindLowestAVG);
router.get('/search-players', validateSearchPlayers, handleSearchPlayers);

module.exports = router;
