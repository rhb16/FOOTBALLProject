const { askPositionLimits, askQuestion, readline, multiplePlayers, positionLimits } = require('./inputHandler');
const { table } = require('table');

const calculateAvg = (APT, SET) => {
    return (APT + SET) / 2;
};

const selectTeam = (players) => {
    const defenders = players.filter(player => player.position === 'defender').sort((a, b) => b.SET - a.SET);
    const attackers = players.filter(player => player.position === 'attacker').sort((a, b) => b.SET - a.SET);
    const midfielders = players.filter(player => player.position === 'midfielder').sort((a, b) => b.SET - a.SET);

    const team = [
        ...defenders.slice(0, positionLimits.defender),
        ...attackers.slice(0, positionLimits.attacker),
        ...midfielders.slice(0, positionLimits.midfielder)
    ];

    console.log('Selected Team:');
    console.log(table(team.map(player => [
        player.firstName,
        player.lastName,
        player.APT,
        player.SET,
        player.position,
        player.nationalAssociation,
        player.AVG
    ])));
};

const generateReport = (players) => {
    // Sort players by APT from high to low
    const sortedPlayers = players.sort((a, b) => b.APT - a.APT);

    console.log('Sorted Player Data by APT (from high to low):');
    const playerData = [
        ['First Name', 'Last Name', 'APT', 'SET', 'Position', 'National Association', 'AVG']
    ];
    sortedPlayers.forEach(player => {
        playerData.push([
            player.firstName,
            player.lastName,
            player.APT,
            player.SET,
            player.position,
            player.nationalAssociation,
            player.AVG
        ]);
    });
    console.log(table(playerData));

    // Count players by position
    const positionCounts = {
        defender: 0,
        attacker: 0,
        midfielder: 0
    };

    players.forEach(player => {
        if (positionCounts.hasOwnProperty(player.position)) {
            positionCounts[player.position]++;
        }
    });

    console.log('\nPlayer Count by Position:');
    const countData = [
        ['Position', 'Count']
    ];
    for (const [position, count] of Object.entries(positionCounts)) {
        countData.push([position.charAt(0).toUpperCase() + position.slice(1), count]);
    }
    console.log(table(countData));
};

const main = () => {
    askPositionLimits(() => {
        const askForPlayerDetails = () => {
            askQuestion(0, [], (answers) => {
                const APT = parseFloat(answers[2]);
                const SET = parseFloat(answers[3]);
                const avg = calculateAvg(APT, SET);

                const player = {
                    firstName: answers[0],
                    lastName: answers[1],
                    APT: APT,
                    SET: SET,
                    position: answers[4].toLowerCase(),
                    nationalAssociation: answers[5],
                    AVG: avg
                };

                multiplePlayers.push(player);

                readline.question('Do you want to enter another set of answers? (yes/no) ', (response) => {
                    if (response.toLowerCase() === 'yes') {
                        askForPlayerDetails(); 
                    } else {
                        readline.close();
                        console.log('All sets of Players:');
                        console.log(table(multiplePlayers.map(player => [
                            player.firstName,
                            player.lastName,
                            player.APT,
                            player.SET,
                            player.position,
                            player.nationalAssociation,
                            player.AVG
                        ])));
                        generateReport(multiplePlayers);  // Generate the report before selecting the team
                        selectTeam(multiplePlayers);
                    }
                });
            });
        };

        askForPlayerDetails();
    });
};

main();
