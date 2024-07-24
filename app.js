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

const multipleAnswers = [];
let playerCount = 0;

const askQuestion = (index, answers) => {
    if (index < questions.length) {
        readline.question(questions[index], (answer) => {
            answers.push(answer);
            askQuestion(index + 1, answers);
        });
    } else {
        playerCount++;
        const APT = parseFloat(answers[2]);
        const SET = parseFloat(answers[3]);
        const avg = calculateAvg(APT, SET);
        answers.push(`AVG: ${avg}`);
        multipleAnswers.push(answers);

        console.log(`Player ${playerCount}`, answers);

        readline.question('Do you want to enter another set of answers? (yes/no) ', (response) => {
            if (response.toLowerCase() === 'yes') {
                askQuestion(0, []); // Start a new set of answers
            } else {
                readline.close();
                console.log('All sets of Players', multipleAnswers);
            }
        });
    }
};

const calculateAvg = (APT, SET) => {
    return (APT + SET) / 2;
};

askQuestion(0, []);
