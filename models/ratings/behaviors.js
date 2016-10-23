'use strict';

const bcrypt = require('bcryptjs');
const AppErr = require('punch-error');
const utils = require('punch-utils');

const CONSTANTS = require('./constants');
const ERROR = CONSTANTS.ERROR;

const sequelize = require('../../config/database_connections').sequelize.primary;
const handleSQLErrors = require('../../utils/sequelize/error-formatting');

const ratingBehaviors = {
  scopes: {},
  hooks: {},
  classMethods: {},
  instanceMethods: {}
};


/******************************************************************************/
/******************************* CLASS METHODS  *******************************/
/******************************************************************************/


/**
 *
 */
ratingBehaviors.classMethods.upsertOne = function(rating, options) {
  options = options || {};
  options.individualHooks = true;

  rating = rating || {};
  delete rating.id;

  return this.upsert(rating, options)
  .catch(err => handleSQLErrors(err, CONSTANTS.MODEL))
  .then(() => this.fetchOne({rated_id: rating.rated_id}))
  .catch(err => AppErr.reject(err, ERROR.UPSERT));
};


/**
 *
 */
ratingBehaviors.classMethods.fetchOne = function(where, options) {
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

ratingBehaviors.hooks.beforeValidate = function(rating, options) {
  if (!rating) return;
  if (rating.rated_id && rating.rater_id &&
      (String(rating.rated_id) === String(rating.rater_id)))
    return AppErr.reject(null, ERROR.SELF_RATE);
};

/******************************************************************************/
/********************************** SCOPES  ***********************************/
/******************************************************************************/


/******************************************************************************/
/***************************** HELPER FUNCTIONS  ******************************/
/******************************************************************************/


/******************************************************************************/
/******************************* EXPORT MODEL  ********************************/
/******************************************************************************/


/**
 * Exports the Rating Model.
 * @type {!Object}
 */
module.exports = ratingBehaviors;

const DIR = require('../directory');
