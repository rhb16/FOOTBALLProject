const { askPositionLimits, askQuestion, readline, multiplePlayers, positionLimits } = require('./inputHandler');

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

    console.log('Selected Team:', team);
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
                        console.log('All sets of Players:', multiplePlayers);
                        selectTeam(multiplePlayers);
                    }
                });
            });
        };

        askForPlayerDetails();
    });
};

main();
