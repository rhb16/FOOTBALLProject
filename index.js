const express = require('express');
const app = express();
const port = 3000;
const teamController = require('./teamController');
const { main } = require('./teamService');

app.use(express.json());
app.use('/', teamController);

main(app).catch(console.error);
