const express = require('express');
const playerRoutes = require('./players/routes'); 

const app = express();
const port = 3000;

app.use(express.json());

app.use('/player', playerRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
