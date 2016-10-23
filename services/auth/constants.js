'use strict';

const ERROR = Object.freeze({
  NO_TOKEN: {status: 401, message: 'No token provided.'},
  TOKEN_EXPIRED: {status: 401, message: 'Token expired.'},
  INVALID_TOKEN: {status: 401, message: 'Invalid token.'},
  UNAUTHORIZED: {status: 401, message: 'Unauthorized.'}
});

module.exports = {
  ERROR
};