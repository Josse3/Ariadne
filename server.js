// Requiring + setting up server
const express = require('express');
const app = express();
const routes = require('./routes/database');

// API
app.use('/db', routes);

// Setting up a port and running app
const port = process.env.PORT || 3001;
app.listen(port);