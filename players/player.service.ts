import { Player, Position, NationalAssociation } from './player.interface'; 
import connection from '../lib/dbConnection'; 
import { OkPacket } from 'mysql2'; // Type for MySQL result packet, specifically for insert operations

class PlayerService {
    async addPlayer(
        firstName: string, 
        lastName: string, 
        APT: number, 
        set_score: number, 
        position: Position, 
        nationalAssociation: NationalAssociation
    ): Promise<void> {
        const AVG = (APT + set_score) / 2;
        const query = 'INSERT INTO players (firstName, lastName, APT, set_score, position, nationalAssociation, AVG) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const values = [firstName, lastName, APT, set_score, position, nationalAssociation, AVG];
        return new Promise((resolve, reject) => {
            connection.query(query, values, (err, results) => {
                if (err) {
                    console.error('Error adding player to the database:', err); 
                    return reject(err); 
                }
                const insertResult = results as OkPacket; // Cast results to OkPacket to access insertId
                console.log('Player added to the database:', insertResult.insertId); // Log the ID of the new player
                resolve(); // Resolve the promise on success
            });
        });
    }

    async getAllPlayers(): Promise<Player[]> {
        const query = 'SELECT * FROM players'; 
        return new Promise((resolve, reject) => {
            connection.query(query, (err, results) => {
                if (err) {
                    console.error('Error retrieving players from the database:', err); 
                    return reject(err);
                }
                resolve(results as Player[]); 
            });
        });
    }
    async selectTeam(): Promise<Player[]> {
        const players = await this.getAllPlayers();
        const sortedPlayers = players.sort((a, b) => b.set_score - a.set_score); 
        const team = sortedPlayers.slice(0, 10); 
        while (team.length < 10 && players.length > team.length) {
            const randomIndex = Math.floor(Math.random() * players.length); 
            if (!team.includes(players[randomIndex])) {
                team.push(players[randomIndex]); 
            }
        }
        return team; 
    }

    async selectRandomPlayers(count: number): Promise<Player[]> {
        const players = await this.getAllPlayers(); 
        const shuffledPlayers = players.sort(() => 0.5 - Math.random()); 
        return shuffledPlayers.slice(0, count); 
    }
    async countPlayersByPosition(): Promise<Record<Position, number>> {
        const players = await this.getAllPlayers(); // Get all players
        const positionCount: Record<Position, number> = {
            defender: 0,
            midfielder: 0,
            attacker: 0
        };
        players.forEach(player => {
            positionCount[player.position]++;
        });
        return positionCount; 
    }
    async sortPlayersByAPT(): Promise<Player[]> {
        const players = await this.getAllPlayers(); 
        return players.sort((a, b) => b.APT - a.APT); 
    }
    async findPlayerWithHighestAPT(): Promise<Player | null> {
        const players = await this.getAllPlayers(); 
        if (players.length === 0) return null; 
        return players.reduce((prev, current) => (prev.APT > current.APT) ? prev : current); 
    }

    async findPlayerWithLowestAVG(): Promise<Player | null> {
        const players = await this.getAllPlayers(); 
        if (players.length === 0) return null;
        return players.reduce((prev, current) => (prev.AVG < current.AVG) ? prev : current); 
    }
}

export default PlayerService;
