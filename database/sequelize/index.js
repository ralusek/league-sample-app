'use strict';

const pg = require('pg');
const Sequelize = require('sequelize');
const Promise = require('bluebird');


const DIALECT = Object.freeze({
  MYSQL: 'mysql',
  POSTGRES: 'postgres'
});

const DIALECT_DEFAULT = {
  [DIALECT.MYSQL]: {
    PORT: 3306,
    USER: 'root'
  },
  [DIALECT.POSTGRES]: {
    PORT: 5432,
    USER: 'postgres'
  }
};

const DEFAULT_CONFIG = (dialect) => ({
  dialect,
  host: 'localhost',
  port: DIALECT_DEFAULT[dialect].PORT,
  pool: {
    max: 5,
    min: 0,
    idle: 1000
  },
  define: {
    timestamps: true
  },
  logging: false
});


module.exports.newClient = (config) => {
  config = config || {};
  config.client = config.client || {};

  const dialect = config.dialect;
  const db = config.db;
  const user = config.user;

  const clientConfig = Object.assign(DEFAULT_CONFIG(dialect), config.client);
  const client = new Sequelize(db, user, config.pass, clientConfig);

  return client;
};


module.exports.connect = (client) => {
  const dialect = client.connectionManager.dialectName;
  const db = client.connectionManager.config.database;

  return Promise.resolve(client.authenticate())
  .then(() => {
    console.log(`${dialect}:${db} connection successfully established.`);
    return client;
  })
  .catch((err) => {
    console.log(`Error connecting to ${dialect}:${db}.`);
    return Promise.reject(err);
  });
};

module.exports.DIALECT = DIALECT;
