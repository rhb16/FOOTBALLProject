const connection = require('./dbConnection');

const addPlayer = async (player) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO players (firstName, lastName, APT, set_score, nationalAssociation, position, AVG)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      player.firstName,
      player.lastName,
      player.APT,
      player.setScore, 
      player.nationalAssociation.toLowerCase(),
      player.position.toLowerCase(),
      (player.APT + player.setScore) / 2  
    ];
    connection.query(query, values, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

module.exports = { addPlayer };
