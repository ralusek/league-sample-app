'use strict';

const deepFreeze = require('deep-freeze-strict');
const AppErr = require('punch-error');

const MODEL = 'preference';
const MODEL_PLURAL = 'preferences';

const ERROR = deepFreeze(
  Object.assign({},
    AppErr.COMMON_ERROR,
    AppErr.generateResourceErrors(MODEL),
    {})
);

module.exports = {
  MODEL,
  MODEL_PLURAL,
  ERROR
};