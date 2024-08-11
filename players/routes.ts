import express, { Router } from 'express';
import {
    validatePlayer,
    validateSelectPlayers,
} from './player.schema';
import {
    handleAddPlayer,
    handleGetPlayers,
    handleSelectTeam,
    handleSelectRandomPlayers,
    handleCountPlayersByPosition,
    handleSortByAPT,
    handleFindHighestAPT,
    handleFindLowestAVG,
} from './player.controller';

const router: Router = express.Router();
router.post('/addPlayer', validatePlayer, handleAddPlayer);
router.get('/players', handleGetPlayers);
router.get('/selectplayers', validateSelectPlayers, handleSelectTeam);
router.get('/selectRandomPlayers', handleSelectRandomPlayers);
router.get('/count-players-by-position', handleCountPlayersByPosition);
router.get('/sort-by-apt', handleSortByAPT);
router.get('/find-highest-apt', handleFindHighestAPT);
router.get('/find-lowest-avg', handleFindLowestAVG);

export default router;