const { players, savePlayers } = require("./playerData");
const {
  getPlayerInput,
  askContinueInput,
  readline,
} = require("./inputHandler");
const fs = require("fs");
const Table = require("cli-table3");
const ExcelJS = require("exceljs");

const selectTeam = (defendersCount, midfieldersCount, attackersCount) => {
  const selectedTeam = [];
  const sortedPlayers = players.sort((a, b) => b.SET - a.SET);
  const positions = { Defender: 0, Midfielder: 0, Attacker: 0 };
  sortedPlayers.forEach((player) => {
    if (
      positions[player.position] <
      {
        Defender: defendersCount,
        Midfielder: midfieldersCount,
        Attacker: attackersCount,
      }[player.position]
    ) {
      selectedTeam.push(player);
      positions[player.position]++;
    }
  });
  return selectedTeam.slice(0, 10);
};

const randomSelectPlayers = (count) => {
  const shuffledPlayers = players.sort(() => 0.5 - Math.random());
  return shuffledPlayers.slice(0, count);
};

const countPlayersByPosition = () => {
  const counts = { Defender: 0, Midfielder: 0, Attacker: 0 };
  players.forEach((player) => {
    counts[player.position]++;
  });
  return counts;
};

const sortByAPT = () => {
  return players.sort((a, b) => b.APT - a.APT);
};

const findHighestAPT = () => {
  return players.reduce(
    (max, player) => (player.APT > max.APT ? player : max),
    players[0]
  );
};

const findLowestAVG = () => {
  return players.reduce(
    (min, player) => (player.AVG < min.AVG ? player : min),
    players[0]
  );
};

const searchPlayers = (query) => {
  const lowerCaseQuery = query.toLowerCase();
  return players.filter(player =>
    player.firstName.toLowerCase().includes(lowerCaseQuery) ||
    player.lastName.toLowerCase().includes(lowerCaseQuery)
  );
};

// Helper function to print player table
const printPlayerTable = (players, headers, title) => {
  const table = new Table({
    head: headers,
    style: { head: ["green"], border: ["grey"] },
    colWidths: [5, 15, 15, 5, 5, 20, 7, 10],
  });

  players.forEach((player) => {
    table.push([
      player.id,
      player.firstName,
      player.lastName,
      player.APT,
      player.SET,
      player.nationalAssociation,
      player.AVG.toFixed(1),
      player.position,
    ]);
  });

  console.log(title);
  console.log(table.toString());
  return table.toString();
};

// Helper function to save player data to an Excel sheet
const saveToExcel = async (sheetName, data, headers) => {
  const workbook = new ExcelJS.Workbook();
  const filePath = "football_club_data.xlsx";

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

// Sample run for each task
const main = () => {
  console.log("Task A.1: Input Player Details");
  const inputPlayers = [];
  const addPlayerCallback = async (player) => {
    if (player) {
      inputPlayers.push(player);
      askContinueInput(addPlayerCallback);
    } else {
      players.push(...inputPlayers);
      savePlayers();
      const headers = [
        "ID",
        "First Name",
        "Last Name",
        "APT",
        "SET",
        "National Association",
        "AVG",
        "Position",
      ];
      const playerData = players.map((player) => ({
        ID: player.id,
        "First Name": player.firstName,
        "Last Name": player.lastName,
        APT: player.APT,
        SET: player.SET,
        "National Association": player.nationalAssociation,
        AVG: player.AVG.toFixed(1),
        Position: player.position,
      }));

      console.log("Task A.2: Player Data with AVG");
      printPlayerTable(players, headers, "All Players");
      await saveToExcel("All Players", playerData, headers);

      readline.question(
        "Enter the required number of defenders: ",
        async (defenders) => {
          readline.question(
            "Enter the required number of midfielders: ",
            async (midfielders) => {
              readline.question(
                "Enter the required number of attackers: ",
                async (attackers) => {
                  const team = selectTeam(
                    parseInt(defenders, 10),
                    parseInt(midfielders, 10),
                    parseInt(attackers, 10)
                  );
                  const teamData = team.map((player) => ({
                    ID: player.id,
                    "First Name": player.firstName,
                    "Last Name": player.lastName,
                    APT: player.APT,
                    SET: player.SET,
                    "National Association": player.nationalAssociation,
                    AVG: player.AVG.toFixed(1),
                    Position: player.position,
                  }));
                  printPlayerTable(
                    team,
                    headers,
                    "Task A.3: Selected Team of Ten Players"
                  );
                  await saveToExcel("Selected Team", teamData, headers);

                  readline.question(
                    "Enter the number of players required: ",
                    async (count) => {
                      const randomPlayers = randomSelectPlayers(
                        parseInt(count, 10)
                      );
                      const randomPlayerData = randomPlayers.map((player) => ({
                        ID: player.id,
                        "First Name": player.firstName,
                        "Last Name": player.lastName,
                        APT: player.APT,
                        SET: player.SET,
                        "National Association": player.nationalAssociation,
                        AVG: player.AVG.toFixed(1),
                        Position: player.position,
                      }));
                      printPlayerTable(
                        randomPlayers,
                        headers,
                        "Task A.4: Randomly Selected Players"
                      );
                      await saveToExcel(
                        "Randomly Selected Players",
                        randomPlayerData,
                        headers
                      );

                      const counts = countPlayersByPosition();
                      const countTable = new Table({
                        head: ["Position", "Count"],
                        style: { head: ["green"], border: ["grey"] },
                        colWidths: [20, 10],
                      });

                      Object.keys(counts).forEach((position) => {
                        countTable.push([position, counts[position]]);
                      });

                      const countTableString = countTable.toString();
                      console.log("Task A.5: Count Players by Position");
                      console.log(countTableString);

                      const workbook = new ExcelJS.Workbook();
                      const filePath = "football_club_data.xlsx";
                      let worksheet;
                      try {
                        await workbook.xlsx.readFile(filePath);
                        worksheet = workbook.getWorksheet(
                          "Count Players by Position"
                        );
                        if (worksheet) {
                          workbook.removeWorksheet("Count Players by Position");
                        }
                        worksheet = workbook.addWorksheet(
                          "Count Players by Position"
                        );
                      } catch (error) {
                        worksheet = workbook.addWorksheet(
                          "Count Players by Position"
                        );
                      }

                      worksheet.columns = [
                        { header: "Position", key: "Position" },
                        { header: "Count", key: "Count" },
                      ];

                      Object.keys(counts).forEach((position) => {
                        worksheet.addRow({
                          Position: position,
                          Count: counts[position],
                        });
                      });

                      await workbook.xlsx.writeFile(filePath);

                      const sortedPlayers = sortByAPT();
                      const sortedPlayerData = sortedPlayers.map((player) => ({
                        ID: player.id,
                        "First Name": player.firstName,
                        "Last Name": player.lastName,
                        APT: player.APT,
                        SET: player.SET,
                        "National Association": player.nationalAssociation,
                        AVG: player.AVG.toFixed(1),
                        Position: player.position,
                      }));
                      printPlayerTable(
                        sortedPlayers,
                        headers,
                        "Task A.6: Players Sorted by APT"
                      );
                      await saveToExcel(
                        "Players Sorted by APT",
                        sortedPlayerData,
                        headers
                      );

                      const highestAPTPlayer = findHighestAPT();
                      const highestAPTPlayerData = [
                        {
                          ID: highestAPTPlayer.id,
                          "First Name": highestAPTPlayer.firstName,
                          "Last Name": highestAPTPlayer.lastName,
                          APT: highestAPTPlayer.APT,
                          SET: highestAPTPlayer.SET,
                          "National Association":
                            highestAPTPlayer.nationalAssociation,
                          AVG: highestAPTPlayer.AVG.toFixed(1),
                          Position: highestAPTPlayer.position,
                        },
                      ];
                      printPlayerTable(
                        [highestAPTPlayer],
                        headers,
                        "Task A.7: Player with Highest APT"
                      );
                      await saveToExcel(
                        "Player with Highest APT",
                        highestAPTPlayerData,
                        headers
                      );

                      const lowestAVGPlayer = findLowestAVG();
                      const lowestAVGPlayerData = [
                        {
                          ID: lowestAVGPlayer.id,
                          "First Name": lowestAVGPlayer.firstName,
                          "Last Name": lowestAVGPlayer.lastName,
                          APT: lowestAVGPlayer.APT,
                          SET: lowestAVGPlayer.SET,
                          "National Association":
                            lowestAVGPlayer.nationalAssociation,
                          AVG: lowestAVGPlayer.AVG.toFixed(1),
                          Position: lowestAVGPlayer.position,
                        },
                      ];
                      printPlayerTable(
                        [lowestAVGPlayer],
                        headers,
                        "Task A.8: Player with Lowest AVG"
                      );
                      await saveToExcel(
                        "Player with Lowest AVG",
                        lowestAVGPlayerData,
                        headers
                      );

                      // Search Functionality
                      readline.question('Enter search query (first or last name): ', (query) => {
                          const searchResults = searchPlayers(query);
                          if (searchResults.length > 0) {
                              printPlayerTable(searchResults, headers, `Search Results for '${query}'`);
                          } else {
                              console.log(`No players found matching the query '${query}'.`);
                          }
                          readline.close();
                      });
                    }
                  );
                }
              );
            }
          );
        }
      );
    }
  };
  getPlayerInput(addPlayerCallback);
};

main();
