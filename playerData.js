const connection = require('./dbConnection');
const updatePlayer = async (id, updates) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE players
      SET firstName = ?, lastName = ?, APT = ?, set_score = ?, nationalAssociation = ?, position = ?, AVG = ?
      WHERE id = ?
    `;
    const values = [
      updates.firstName,
      updates.lastName,
      updates.APT,
      updates.set_score,
      updates.nationalAssociation,
      updates.position,
      updates.AVG,
      id
    ];
    connection.query(query, values, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

const addPlayer = async (player) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO players (id, firstName, lastName, APT, set_score, nationalAssociation, position, AVG)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      player.id,
      player.firstName,
      player.lastName,
      player.APT,
      player.set_score,
      player.nationalAssociation,
      player.position,
      player.AVG
    ];
    connection.query(query, values, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

module.exports = { addPlayer, updatePlayer };
