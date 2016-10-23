'use strict';

const deepFreeze = require('deep-freeze-strict');
const AppErr = require('punch-error');

const MODEL = 'rating';
const MODEL_PLURAL = 'ratings';

const ERROR = deepFreeze(
  Object.assign({},
    AppErr.COMMON_ERROR,
    AppErr.generateResourceErrors(MODEL),
    {
      SELF_RATE: {status: 400, message: 'Cannot rate yourself.'}
    })
);

const RATING = deepFreeze({
  LIKE: 'like',
  REJECT: 'reject'
});

module.exports = {
  MODEL,
  MODEL_PLURAL,
  ERROR,
  RATING
};