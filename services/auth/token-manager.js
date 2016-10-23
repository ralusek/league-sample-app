'use strict';

const Promise = require('bluebird');
const rp = require('request-promise');
const jwt = require('jsonwebtoken');
const deepFreeze = require('deep-freeze-strict');
const AppErr = require('punch-error');

const CONSTANTS = require('./constants');
const ERROR = CONSTANTS.ERROR;


/**
 *
 */
function verifyToken(token, secret, options) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, options, (err, decoded) => {
      if (err) reject(err);
      resolve(decoded);
    });
  });
}
module.exports.verifyToken = verifyToken;


/**
 *
 */
function signToken(payload, secret, options) {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, options, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
}
module.exports.signToken = signToken;
