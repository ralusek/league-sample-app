'use strict';

const bcrypt = require('bcryptjs');
const AppErr = require('punch-error');
const utils = require('punch-utils');

const CONSTANTS = require('./constants');
const ERROR = CONSTANTS.ERROR;

const sequelize = require('../../config/database_connections').sequelize.primary;
const handleSQLErrors = require('../../utils/sequelize/error-formatting');

const preferenceBehaviors = {
  scopes: {},
  hooks: {},
  classMethods: {},
  instanceMethods: {}
};


/******************************************************************************/
/******************************* CLASS METHODS  *******************************/
/******************************************************************************/


/**
 * Will upsert on unique key user_id. If null upsert will error.
 */
preferenceBehaviors.classMethods.upsertOne = function(preference, options) {
  options = options || {};
  options.individualHooks = true;

  preference = preference || {};
  delete preference.id;

  return this.upsert(preference, options)
  .catch(err => handleSQLErrors(err, CONSTANTS.MODEL))
  .then(() => this.fetchOne({user_id: preference.user_id}))
  .catch(err => AppErr.reject(err, ERROR.UPSERT));
};


/**
 *
 */
preferenceBehaviors.classMethods.fetchOne = function(where, options) {
  options = options || {};
  options.where = where || {};

  return this.findOne(options)
  .catch(err => handleSQLErrors(err, CONSTANTS.MODEL))
  .then(result => result || AppErr.reject(null, ERROR.NOT_FOUND))
  .catch(err => AppErr.reject(err, ERROR.FETCH));
};





/******************************************************************************/
/***************************** INSTANCE METHODS  ******************************/
/******************************************************************************/


/******************************************************************************/
/*********************************** HOOKS  ***********************************/
/******************************************************************************/

/**
 * Before Validate hook.
 */
preferenceBehaviors.hooks.beforeValidate = function(preference, options) {
  if (!preference) return preference;
  preference.gender = (preference.gender || []).map(titleCase);
  if (preference.religion) preference.religion = titleCase(preference.religion);
  return preference;
};


/******************************************************************************/
/********************************** SCOPES  ***********************************/
/******************************************************************************/


/******************************************************************************/
/***************************** HELPER FUNCTIONS  ******************************/
/******************************************************************************/

/**
 *
 */
function titleCase(string) {
  const split = string.trim().split(/\s+/g);
  return split.map(term => {
    return term[0].toUpperCase() + term.slice(1).toLowerCase();
  }).join(' ');
};

/******************************************************************************/
/******************************* EXPORT MODEL  ********************************/
/******************************************************************************/


/**
 * Exports the Preference Model.
 * @type {!Object}
 */
module.exports = preferenceBehaviors;

const DIR = require('../directory');
