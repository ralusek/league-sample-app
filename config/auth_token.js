'use strict';

const DEFAULT = Object.freeze({
  EXPIRE_IN: '1d'
});

module.exports.OPTIONS = Object.freeze({
  secret: 'secret', // Would normally be an environment var.
  options: {
    issuer: 'league', // Would normally be an environment var.
    expiresIn: DEFAULT.EXPIRE_IN
  }
});