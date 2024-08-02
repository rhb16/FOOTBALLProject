const express = require('express');
const playerRoutes = require('./players/routes'); // Import the routes module

const app = express();
const port = 3000;

// Use express.json() middleware to parse JSON bodies in requests
app.use(express.json());

// Use the player routes
app.use('/player', playerRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
