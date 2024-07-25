const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const questions = [
    'first name? ',
    'last name? ',
    'player APT? ',
    'player SET? ',
    'position (defender, attacker, midfielder)? ',
    'national association (England, Northern Ireland, Scotland, Wales)? '
];

const validPositions = ['defender', 'attacker', 'midfielder'];
const validNationalAssociations = ['England', 'Northern Ireland', 'Scotland', 'Wales'];

const positionLimits = { defender: 3, attacker: 4, midfielder: 3 }; // Default values
const multiplePlayers = [];

const askPositionLimits = (callback) => {
    readline.question('How many defenders do you want? ', (defenderCount) => {
        positionLimits.defender = parseInt(defenderCount, 10);
        readline.question('How many attackers do you want? ', (attackerCount) => {
            positionLimits.attacker = parseInt(attackerCount, 10);
            readline.question('How many midfielders do you want? ', (midfielderCount) => {
                positionLimits.midfielder = parseInt(midfielderCount, 10);
                callback();
            });
        });
    });
};

const askQuestion = (index, answers, callback) => {
    if (index < questions.length) {
        readline.question(questions[index], (answer) => {
            if (index === 4 && !validPositions.includes(answer.toLowerCase())) {
                console.log(`Please enter a valid position: ${validPositions.join(', ')}`);
                askQuestion(index, answers, callback);
            } else if (index === 5 && !validNationalAssociations.includes(answer)) {
                console.log(`Please enter a valid national association: ${validNationalAssociations.join(', ')}`);
                askQuestion(index, answers, callback);
            } else {
                answers.push(answer);
                askQuestion(index + 1, answers, callback);
            }
        });
    } else {
        callback(answers);
    }
};

module.exports = {
    askPositionLimits,
    askQuestion,
    readline,
    multiplePlayers,
    positionLimits
};
