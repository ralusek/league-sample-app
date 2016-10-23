'use strict';

const deepFreeze = require('deep-freeze-strict');
const AppErr = require('punch-error');

const MODEL = 'user';
const MODEL_PLURAL = 'users';

const ERROR = deepFreeze(
  Object.assign({},
    AppErr.COMMON_ERROR,
    AppErr.generateResourceErrors(MODEL),
    {
      PASSWORD_CHECK: {status: 500, message: 'Could not verify password.'},
      LOGIN_CHECK: {status: 500, message: 'Could not verify login.'},
      INVALID_PASSWORD: {status: 401, message: 'Invalid password provided.'},
      MISSING_PASSWORD: {status: 400, message: 'Missing required attributes password.'}
    })
);

module.exports = {
  MODEL,
  MODEL_PLURAL,
  ERROR
};