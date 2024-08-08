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

router.post('/addPlayer', validatePlayer, handleAddPlayer);//working 
router.get('/players', handleGetPlayers);//working
router.get('/selectplayers', validateSelectPlayers, handleSelectTeam);//working
router.get('/random-players', handleRandomSelectPlayers);//working
router.get('/count-players-by-position', handleCountPlayersByPosition);//working
router.get('/sort-by-apt', handleSortByAPT);//working
router.get('/find-highest-apt', handleFindHighestAPT);//working
router.get('/find-lowest-avg', handleFindLowestAVG);//working

module.exports = router;
