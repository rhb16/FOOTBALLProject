// dbConnection.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  database: 'footballplayers',
  user: 'root',
  password: 'RASHA123@rasha'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database: ' + err.stack);
    return;
  }
  console.log('Connected to database ');
});

module.exports = connection;
