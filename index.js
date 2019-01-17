// Required packages
const express = require('express');
const app = express();
const winston = require('winston');

// Creating middleware 
app.use(express.json());

// Creating routes handelers
require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/database')();
require('./startup/config')();
require('./startup/validation')();

// Making port and listening 
const port = process.env.PORT || 3000;

app.listen(port, () => {
    winston.info(`Listening on port ${port}`);
});
