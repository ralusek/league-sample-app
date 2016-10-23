'use strict';

const Promise = require('bluebird');
const mongoose = require('mongoose');

module.exports.connect = function(config) {
  config = config || {};

  return new Promise((resolve, reject) => {
    const server = config.server || 'localhost:27017';
    const database = config.db;
    const options = config.options ? `?${config.options}` : '';

    const url = `mongodb://${server}/${database}${options}`;

    // Initialize database.
    mongoose.connect(url);

    // CONNECTION EVENTS
    // When successfully connected
    mongoose.connection.on('connected', () => {
      console.log(`Mongoose connected to database ${database}.`);
      resolve();
    });

    // If the connection throws an error
    mongoose.connection.on('error', (err) => {
      console.log(`Mongoose default connection error:`, err, err && err.stack);
      reject(err);
    });

    // When the connection is disconnected
    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose default connection disconnected.');
    });
  });  
};
