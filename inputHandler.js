const players = require('./playerData');
const connection = require('./dbConnection');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const questions = [
    'First name: ',
    'Last name: ',
    'APT (0-100): ',
    'SET (0-100): ',
    'Position (1-Defender, 2-Midfielder, 3-Attacker): ',
    'National association (1-England, 2-Northern Ireland, 3-Scotland, 4-Wales): '
];

const validPositions = [1, 2, 3];
const validNationalAssociations = [1, 2, 3, 4];
const positions = ['Defender', 'Midfielder', 'Attacker'];
const nationalAssociations = ['England', 'Northern Ireland', 'Scotland', 'Wales'];

const askQuestion = (index, answers, callback) => {
    if (index < questions.length) {
        readline.question(questions[index], (answer) => {
            if (index === 2 || index === 3) {
                const score = parseInt(answer, 10);
                if (isNaN(score) || score < 0 || score > 100) {
                    console.log('Please enter a valid score between 0 and 100.');
                    return askQuestion(index, answers, callback);
                }
                answers.push(score);
            } else if (index === 4 && !validPositions.includes(parseInt(answer, 10))) {
                console.log('Please enter a valid position: 1-Defender, 2-Midfielder, 3-Attacker');
                return askQuestion(index, answers, callback);
            } else if (index === 5 && !validNationalAssociations.includes(parseInt(answer, 10))) {
                console.log('Please enter a valid national association: 1-England, 2-Northern Ireland, 3-Scotland, 4-Wales');
                return askQuestion(index, answers, callback);
            } else {
                answers.push(index === 4 ? positions[parseInt(answer, 10) - 1] : (index === 5 ? nationalAssociations[parseInt(answer, 10) - 1] : answer));
            }
            askQuestion(index + 1, answers, callback);
        });
    } else {
        callback(answers);
    }
};

const getPlayerInput = (callback) => { 
    askQuestion(0, [], (answers) => {
        const player = {
            id: Date.now(),
            firstName: answers[0],
            lastName: answers[1],
            APT: answers[2],
            set_score: answers[3],
            position: answers[4],
            nationalAssociation: answers[5],
            AVG: (answers[2] + answers[3]) / 2
        };
        callback(player);
    });
};

const askContinueInput = (callback) => {
    readline.question('Do you want to input more players? (y/n): ', (answer) => {
        if (answer.toLowerCase() === 'y') {
            getPlayerInput(callback);
        } else {
            callback(null);
        }
    });
};

module.exports = { getPlayerInput, askContinueInput, readline };
