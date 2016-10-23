'use strict';

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const AppErr = require('punch-error');

const app = express();
const dbConnections = require('./config/database_connections');
const auth = require('./services/auth');
const authConfig = require('./config/auth_token').OPTIONS;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Add Bearer token decoding.
app.use(auth.MW.decodeVerifiedToken(authConfig.secret, authConfig.options));

// Add request logging.
app.use((req, res, next) => {
  if (req.user) console.log(req.user.email);
  console.log((new Date().toLocaleString()));
  console.log(`${req.method.toUpperCase()} ${req.url}`);
  next();
});

// Connect to DB.
dbConnections.connectAll()
.then(() => {
  require('strict-mode')(() => {
    // Utils required in closure because requires strict-mode.
    const utils = require('punch-utils');

    // Load models.
    const models = require('./models/directory')();

    // Establish model relationships.
    utils.object.forEach(models, (model) => {
      model.establishRelationships();
    });

    // Load routes.
    const routes = require('./routes');

    // Register REST routes.
    app.use(routes);

    // Register error handling.
    app.use((err, req, res, next) => {
      const handled = AppErr.pass(err, {status: 500, message: 'Server error.'});
      res.status(handled.status).send(handled.message);
    });
  });
});


module.exports = app;
