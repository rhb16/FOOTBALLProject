const mysql = require('mysql2');
const connection = require('./dbConnection');
const Table = require('cli-table3');
const ExcelJS = require('exceljs');
const { getPlayerInput } = require('./inputHandler'); // Removed redundant import
const { addPlayer } = require('./playerData'); // Import addPlayer

// Fetch players from the database
const getPlayersFromDB = async () => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM players', (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// Select team based on counts of each position
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

// Randomly select players
const randomSelectPlayers = async (count) => {
  const players = await getPlayersFromDB();
  const shuffledPlayers = players.sort(() => 0.5 - Math.random());
  return shuffledPlayers.slice(0, count);
};

// Count players by position
const countPlayersByPosition = async () => {
  const players = await getPlayersFromDB();
  const counts = { Defender: 0, Midfielder: 0, Attacker: 0 };
  players.forEach((player) => {
    counts[player.position]++;
  });
  return counts;
};

// Sort players by APT
const sortByAPT = async () => {
  const players = await getPlayersFromDB();
  return players.sort((a, b) => b.APT - a.APT);
};

// Find player with highest APT
const findHighestAPT = async () => {
  const players = await getPlayersFromDB();
  return players.reduce((max, player) => (player.APT > max.APT ? player : max), players[0]);
};

// Find player with lowest AVG
const findLowestAVG = async () => {
  const players = await getPlayersFromDB();
  return players.reduce((min, player) => (player.AVG < min.AVG ? player : min), players[0]);
};

// Search players by query
const searchPlayers = async (query) => {
  const players = await getPlayersFromDB();
  const lowerCaseQuery = query.toLowerCase();
  return players.filter(player =>
    player.firstName.toLowerCase().includes(lowerCaseQuery) ||
    player.lastName.toLowerCase().includes(lowerCaseQuery));
};

// Print table with player data
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

// Save data to Excel
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

// Main function
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

  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log('Connected to the database.\nTask A.1: Input Player Details');

  const addPlayerCallback = async (player) => {
    if (player) {
      await addPlayer(player); // Ensure addPlayer function is updated to use database
      readline.question('Enter more player details? (yes/no): ', async (answer) => {
        if (answer.toLowerCase() === 'yes') {
          await getPlayerInput(addPlayerCallback); 
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
                    const searchResultsData = searchResults.map((player) => ({
                      ID: player.id,
                      'First Name': player.firstName,
                      'Last Name': player.lastName,
                      APT: player.APT,
                      SET: player.set_score,
                      'National Association': player.nationalAssociation,
                      AVG: player.AVG.toFixed(1),
                      Position: player.position,
                    }));
                    printPlayerTable(searchResults, headers, 'Task A.9: Search Results');
                    await saveToExcel('Search Results', searchResultsData, headers);

                    readline.close();
                  });
                });
              });
            });
          });
        }
      });
    }
  };

  await getPlayerInput(addPlayerCallback); 
};

main().catch(console.error);
