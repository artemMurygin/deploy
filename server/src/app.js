const express = require('express');
const app = express();
const apiRouter = require('./routes/index.routes');
const config = require('./configs/server.config');

config(app);

app.use('/api', apiRouter);

module.exports = app;