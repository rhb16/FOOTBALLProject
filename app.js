const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const questions = [
    'What is your first name? ',
    'What is your last name? ',
    'What is your APT? ',
    'What is your SET? ',
    'What is your position (defender, attacker, midfielder)? ',
    'What is your national association (England, Northern Ireland, Scotland, Wales)? '
];

const validPositions = ['defender', 'attacker', 'midfielder'];
const validNationalAssociations = ['England', 'Northern Ireland', 'Scotland', 'Wales'];

const multiplePlayers = [];
let playerCount = 0;

const askQuestion = (index, answers) => {
    if (index < questions.length) {
        readline.question(questions[index], (answer) => {
            if (index === 4 && !validPositions.includes(answer.toLowerCase())) {
                console.log(`Please enter a valid position: ${validPositions.join(', ')}`);
                askQuestion(index, answers);
            } else if (index === 5 && !validNationalAssociations.includes(answer)) {
                console.log(`Please enter a valid national association: ${validNationalAssociations.join(', ')}`);
                askQuestion(index, answers);
            } else {
                answers.push(answer);
                askQuestion(index + 1, answers);
            }
        });
    } else {
        playerCount++;
        const APT = parseFloat(answers[2]);
        const SET = parseFloat(answers[3]);
        const avg = calculateAvg(APT, SET);

        const player = {
            firstName: answers[0],
            lastName: answers[1],
            APT: APT,
            SET: SET,
            position: answers[4],
            nationalAssociation: answers[5],
            AVG: avg
        };
        
        multiplePlayers.push(player);

        readline.question('Do you want to enter another set of answers? ', (response) => {
            if (response.toLowerCase() === 'yes') {
                askQuestion(0, []); 
            } else {
                readline.close();
                console.log('All sets of Players', multiplePlayers);
            }
        });
    }
};

const calculateAvg = (APT, SET) => {
    return (APT + SET) / 2;
};
askQuestion(0, []);