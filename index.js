const express = require('express');
const bodyParser = require('body-parser');
const teamController = require('./teamController'); 

const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use('/api', teamController);
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
