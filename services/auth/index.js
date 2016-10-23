'use strict';

const Promise = require('bluebird');
const rp = require('request-promise');
const jwt = require('jsonwebtoken');

const CONSTANTS = require('./constants');
const ERROR = CONSTANTS.ERROR;

const tokenManager = require('./token-manager');
const AppErr = require('punch-error');

const deepFreeze = require('deep-freeze-strict');

function validateToken() {};


module.exports.MW = {};


/**
 *
 */
module.exports.MW.login = (login, secret, options) => {
  return (req, res, next) => {
    Promise.resolve(login(req && req.body))
    .then(user => {
      tokenManager.signToken(user, secret, options)
      .then(token => {
        req.user = user;
        req.token = token;
        next();
      });
    })
    .catch(err => next(err));
  };
};


/**
 *
 */
module.exports.MW.decodeVerifiedToken = (secret, options, opt_verify) => {
  return (req, res, next) => {
    let token = req.headers.authorization || req.query.token;
    if (!token || !token.length) return next();

    token = token.replace(/Bearer */, '');

    Promise.resolve(opt_verify && opt_verify(token))
    .then(() => tokenManager.verifyToken(token, secret, options))
    .then(decoded => {
      req.user = decoded;
      next();
    });
  };
};


/**
 *
 */
module.exports.MW.enforceAuth = (req, res, next) => {
  if (req.authErr) next(AppErr.pass(null, req.authErr));
  if (!req.user) next(AppErr.pass(null, ERROR.UNAUTHORIZED));
  next();
};
