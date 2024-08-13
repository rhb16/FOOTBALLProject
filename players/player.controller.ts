import { Request, Response } from 'express';
import PlayerService from './player.service'; 
import { Position, NationalAssociation } from './player.interface'; 

const playerService = new PlayerService();

const handleAddPlayer = async (req: Request, res: Response): Promise<void> => {
  const { firstName, lastName, APT, set_score, position, nationalAssociation } = req.body;
  try {
    await playerService.addPlayer(firstName, lastName, parseFloat(APT), parseFloat(set_score), position as Position, nationalAssociation as NationalAssociation);
    res.status(200).json({ message: 'Player added successfully' });
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
const handleGetPlayers = async (req: Request, res: Response): Promise<void> => {
  try {
    const players = await playerService.getAllPlayers();
    res.json(players);
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const handleSelectTeam = async (req: Request, res: Response): Promise<void> => {
  try {
    const team = await playerService.selectTeam();
    res.json(team);
  } catch (error) {
    console.error('Error selecting team:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
const handleSelectRandomPlayers = async (req: Request, res: Response): Promise<void> => {
  const { count } = req.query;
  try {
      const playerCount = parseInt(count as string, 10) || 0;
      if (playerCount <= 0) {
          res.status(400).json({ message: 'Invalid count value. Count must be greater than 0.' });
          return;
      }
      const selectedPlayers = await playerService.selectRandomPlayers(playerCount);
      res.json(selectedPlayers);
  } catch (error) {
      console.error('Error selecting players:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
};
const handleCountPlayersByPosition = async (req: Request, res: Response): Promise<void> => {
  try {
    const counts = await playerService.countPlayersByPosition();
    res.json(counts);
  } catch (error) {
    console.error('Error counting players by position:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
const handleSortByAPT = async (req: Request, res: Response): Promise<void> => {
  try {
    const players = await playerService.sortPlayersByAPT();
    res.json(players);
  } catch (error) {
    console.error('Error sorting players by APT:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
const handleFindHighestAPT = async (req: Request, res: Response): Promise<void> => {
  try {
    const player = await playerService.findPlayerWithHighestAPT();
    res.json(player);
  } catch (error) {
    console.error('Error finding player with highest APT:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
const handleFindLowestAVG = async (req: Request, res: Response): Promise<void> => {
  try {
    const player = await playerService.findPlayerWithLowestAVG();
    res.json(player);
  } catch (error) {
    console.error('Error finding player with lowest AVG:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export {
  handleAddPlayer,
  handleGetPlayers,
  handleSelectTeam,
  handleSelectRandomPlayers, 
  handleCountPlayersByPosition,
  handleSortByAPT,
  handleFindHighestAPT,
  handleFindLowestAVG
};