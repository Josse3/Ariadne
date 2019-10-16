// Requiring + setting up server
const express = require('express');
const app = express();
const dbRoutes = require('./routes/database');
const authenticationRoutes = require('./routes/authentication');

// API
app.use('/db', dbRoutes);
app.use('/authentication', authenticationRoutes);

// Setting up a port and running app
const port = process.env.PORT || 3001;
app.listen(port);