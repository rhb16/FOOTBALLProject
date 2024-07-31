const mysql = require('mysql2');
const connection = require('./dbConnection');
const Table = require('cli-table3');
const ExcelJS = require('exceljs');
const { getPlayerInput, askForMorePlayerDetails,readline} = require('./inputHandler');
const { addPlayer } = require('./playerData');
const express = require('express');
const app = express(); 
const port = 3000; 
app.use(express.json());

//FIRST API CALL
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
      console.error('Error fetching players:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


//Second API Call
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
    console.error('Error fetching players:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//third api call:
const randomSelectPlayers = async (count) => {
    const players = await getPlayersFromDB();
    const shuffledPlayers = players.sort(() => 0.5 - Math.random());
    return shuffledPlayers.slice(0, count);
};
app.get('/api/random-players', async (req, res) => {
    const count = parseInt(req.query.count, 10) || 5; // Default to 5 players if count is not provided
    try {
        const selectedPlayers = await randomSelectPlayers(count);
        res.status(200).json(selectedPlayers);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching players.' });
    }
});
//forth api call 
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
        res.status(200).json(counts);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while counting players by position.' });
    }
});
//fifth call 
const sortByAPT = async () => {
    const players = await getPlayersFromDB();
    return players.sort((a, b) => b.APT - a.APT);
};
app.get('/api/sort-by-apt', async (req, res) => {
    try {
        const sortedPlayers = await sortByAPT();
        res.status(200).json(sortedPlayers);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while sorting players by APT.' });
    }
});
//sixth call
const findHighestAPT = async () => {
    const players = await getPlayersFromDB();
    return players.reduce((max, player) => (player.APT > max.APT ? player : max), players[0]);
};
app.get('/api/find-highest-apt', async (req, res) => {
    try {
        const player = await findHighestAPT();
        res.status(200).json(player);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while finding the player with the highest APT.' });
    }
});

//seventh api
const findLowestAVG = async () => {
    const players = await getPlayersFromDB();
    return players.reduce((min, player) => (player.AVG < min.AVG ? player : min), players[0]);
};
app.get('/api/find-lowest-avg', async (req, res) => {
    try {
        const player = await findLowestAVG();
        res.status(200).json(player);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while finding the player with the lowest AVG.' });
    }
});

//8th api
const searchPlayers = async (query) => {
    const players = await getPlayersFromDB();
    const lowerCaseQuery = query.toLowerCase();
    return players.filter(player =>
        player.firstName.toLowerCase().includes(lowerCaseQuery) ||
        player.lastName.toLowerCase().includes(lowerCaseQuery));
};
app.get('/api/search-players', async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({ error: 'Query parameter "q" is required.' });
    }
    try {
        const players = await searchPlayers(query);
        res.status(200).json(players);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while searching for players.' });
    }
});

const printPlayerTable = (players, headers, title) => {
    const table = new Table({
        head: headers,
        style: { head: ['green'], border: ['grey'] },
        colWidths: [5, 15, 15, 5, 5, 20, 7, 10],
    });

    players.forEach((player) => {
        table.push([
            player.id,
            player.firstName,
            player.lastName,
            player.APT,
            player.set_score,
            player.nationalAssociation,
            player.AVG.toFixed(1),
            player.position,
        ]);
    });
    console.log(title);
    console.log(table.toString());
    return table.toString();
};

const saveToExcel = async (sheetName, data, headers) => {
    const workbook = new ExcelJS.Workbook();
    const filePath = 'football_club_data.xlsx';
    let worksheet;
    try {
        await workbook.xlsx.readFile(filePath);
        worksheet = workbook.getWorksheet(sheetName);
        if (worksheet) {
            workbook.removeWorksheet(sheetName);
        }
        worksheet = workbook.addWorksheet(sheetName);
    } catch (error) {
        worksheet = workbook.addWorksheet(sheetName);
    }
    worksheet.columns = headers.map((header) => ({ header, key: header }));
    data.forEach((player) => {
        worksheet.addRow(player);
    });
    await workbook.xlsx.writeFile(filePath);
};

const main = async () => {
  
    const headers = [
        'ID',
        'First Name',
        'Last Name',
        'APT',
        'SET',
        'National Association',
        'AVG',
        'Position',
    ];
    console.log('Connected to the database.\nTask A.1: Input Player Details');
    const addPlayerCallback = async (player) => {
        if (player) {
            await addPlayer(player); 
            askForMorePlayerDetails(addPlayerCallback); // Using the new function
        } else {
            const players = await getPlayersFromDB();
            console.log('Task A.2: Player Data with AVG');
            printPlayerTable(players, headers, 'All Players');
            await saveToExcel('All Players', players, headers);

            readline.question('Enter the required number of defenders: ', async (defenders) => {
                readline.question('Enter the required number of midfielders: ', async (midfielders) => {
                    readline.question('Enter the required number of attackers: ', async (attackers) => {
                        const team = await selectTeam(
                            parseInt(defenders, 10),
                            parseInt(midfielders, 10),
                            parseInt(attackers, 10)
                        );
                        const teamData = team.map((player) => ({
                            ID: player.id,
                            'First Name': player.firstName,
                            'Last Name': player.lastName,
                            APT: player.APT,
                            SET: player.set_score,
                            'National Association': player.nationalAssociation,
                            AVG: player.AVG.toFixed(1),
                            Position: player.position,
                        }));
                        printPlayerTable(team, headers, 'Task A.3: Selected Team');
                        await saveToExcel('Selected Team', teamData, headers);

                        readline.question('Enter the number of players required to select randomly: ', async (count) => {
                            const randomPlayers = await randomSelectPlayers(parseInt(count, 10));
                            const randomPlayerData = randomPlayers.map((player) => ({
                                ID: player.id,
                                'First Name': player.firstName,
                                'Last Name': player.lastName,
                                APT: player.APT,
                                SET: player.set_score,
                                'National Association': player.nationalAssociation,
                                AVG: player.AVG.toFixed(1),
                                Position: player.position,
                            }));
                            printPlayerTable(randomPlayers, headers, 'Task A.4: Randomly Selected Players');
                            await saveToExcel('Randomly Selected Players', randomPlayerData, headers);

                            const counts = await countPlayersByPosition();
                            const countTable = new Table({
                                head: ['Position', 'Count'],
                                style: { head: ['green'], border: ['grey'] },
                                colWidths: [20, 10],
                            });
                            Object.keys(counts).forEach((position) => {
                                countTable.push([position, counts[position]]);
                            });
                            console.log('Task A.5: Count Players by Position');
                            console.log(countTable.toString());
                            const workbook = new ExcelJS.Workbook();
                            const filePath = 'football_club_data.xlsx';
                            let worksheet;
                            try {
                                await workbook.xlsx.readFile(filePath);
                                worksheet = workbook.getWorksheet('Count Players by Position');
                                if (worksheet) {
                                    workbook.removeWorksheet('Count Players by Position');
                                }
                                worksheet = workbook.addWorksheet('Count Players by Position');
                            } catch (error) {
                                worksheet = workbook.addWorksheet('Count Players by Position');
                            }
                            worksheet.columns = [
                                { header: 'Position', key: 'Position' },
                                { header: 'Count', key: 'Count' },
                            ];
                            Object.keys(counts).forEach((position) => {
                                worksheet.addRow({
                                    Position: position,
                                    Count: counts[position],
                                });
                            });
                            await workbook.xlsx.writeFile(filePath);

                            const sortedPlayers = await sortByAPT();
                            const sortedPlayerData = sortedPlayers.map((player) => ({
                                ID: player.id,
                                'First Name': player.firstName,
                                'Last Name': player.lastName,
                                APT: player.APT,
                                SET: player.set_score,
                                'National Association': player.nationalAssociation,
                                AVG: player.AVG.toFixed(1),
                                Position: player.position,
                            }));
                            printPlayerTable(sortedPlayers, headers, 'Task A.6: Players Sorted by APT');
                            await saveToExcel('Players Sorted by APT', sortedPlayerData, headers);

                            const highestAPTPlayer = await findHighestAPT();
                            const highestAPTPlayerData = [
                                {
                                    ID: highestAPTPlayer.id,
                                    'First Name': highestAPTPlayer.firstName,
                                    'Last Name': highestAPTPlayer.lastName,
                                    APT: highestAPTPlayer.APT,
                                    SET: highestAPTPlayer.set_score,
                                    'National Association': highestAPTPlayer.nationalAssociation,
                                    AVG: highestAPTPlayer.AVG.toFixed(1),
                                    Position: highestAPTPlayer.position,
                                },
                            ];
                            printPlayerTable([highestAPTPlayer], headers, 'Task A.7: Player with Highest APT');
                            await saveToExcel('Player with Highest APT', highestAPTPlayerData, headers);

                            const lowestAVGPlayer = await findLowestAVG();
                            const lowestAVGPlayerData = [
                                {
                                    ID: lowestAVGPlayer.id,
                                    'First Name': lowestAVGPlayer.firstName,
                                    'Last Name': lowestAVGPlayer.lastName,
                                    APT: lowestAVGPlayer.APT,
                                    SET: lowestAVGPlayer.set_score,
                                    'National Association': lowestAVGPlayer.nationalAssociation,
                                    AVG: lowestAVGPlayer.AVG.toFixed(1),
                                    Position: lowestAVGPlayer.position,
                                },
                            ];
                            printPlayerTable([lowestAVGPlayer], headers, 'Task A.8: Player with Lowest AVG');
                            await saveToExcel('Player with Lowest AVG', lowestAVGPlayerData, headers);

                            readline.question('Enter player name to search: ', async (query) => {
                                const searchResults = await searchPlayers(query);
                                const searchResultData = searchResults.map((player) => ({
                                    ID: player.id,
                                    'First Name': player.firstName,
                                    'Last Name': player.lastName,
                                    APT: player.APT,
                                    SET: player.set_score,
                                    'National Association': player.nationalAssociation,
                                    AVG: player.AVG.toFixed(1),
                                    Position: player.position,
                                }));
                                printPlayerTable(searchResults, headers, 'Task A.9: Player Search Results');
                                await saveToExcel('Player Search Results', searchResultData, headers);

                                readline.close();
                            });
                        });
                    });
                });
            });
        }
    };

    await getPlayerInput(addPlayerCallback);
};

main().catch(console.error);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
