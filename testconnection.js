const connection = require('./dbConnection');

// Query to fetch data from the 'players' table
const query = 'SELECT * FROM players';

connection.query(query, (error, results, fields) => {
  if (error) {
    console.error('Error executing query: ' + error.stack);
    return;
  }
  console.log('Query result:', results);
});

