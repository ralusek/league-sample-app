'use strict';

const bcrypt = require('bcryptjs');
const AppErr = require('punch-error');

const CONSTANTS = require('./constants');
const ERROR = CONSTANTS.ERROR;

const sequelize = require('../../config/database_connections').sequelize.primary;
const handleSQLErrors = require('../../utils/sequelize/error-formatting');

const userBehaviors = {
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
userBehaviors.classMethods.createOne = function(user, options) {
  delete user.id;
  return this.create(user, options)
  .catch(err => handleSQLErrors(err, CONSTANTS.MODEL))
  .then(user => user || AppErr.reject(null, ERROR.CREATE))
  .catch(err => AppErr.reject(err, ERROR.CREATE));
};


/**
 *
 */
userBehaviors.classMethods.fetchOne = function(where, options) {
  options = options || {};
  options.where = where || {};

  return this.findOne(options)
  .catch(err => handleSQLErrors(err, CONSTANTS.MODEL))
  .then(result => result || AppErr.reject(null, ERROR.NOT_FOUND))
  .catch(err => AppErr.reject(err, ERROR.FETCH));
};


/**
 *
 */
userBehaviors.classMethods.fetch = function(where, options) {
  options = options || {};
  options.where = where;

  return this.findAll(options)
  .catch(err => handleSQLErrors(err, CONSTANTS.MODEL))
  .then(results => {
    if (!results || !results.length) return AppErr.reject(null, ERROR.NONE_FOUND);
    return results;
  })
  .catch(err => AppErr.reject(err, ERROR.FETCH));
};


/**
 * Fetch users that have NOT been rejected, which match the preference criteria
 * associated with the active user.
 */
userBehaviors.classMethods.fetchMatches = function(activeUserId, options) {
  options = options || {};
  let where = options.where = {};
  
  return DIR().PreferenceModel.fetchOne({user_id: activeUserId})
  .catch(err => ({}))
  .then(preferences => {
    const gender = preferences.gender;
    if (gender && gender.length) where.gender = {$in: gender};

    const maxAge = preferences.maxAge;
    if (maxAge) where.DOB = {$gt: Date.now() - yearsToMS(maxAge)};

    const minAge = preferences.minAge;
    if (minAge) where.DOB = {$lt: Date.now() - yearsToMS(minAge)};

    const religion = preferences.religion;
    if (religion) where.religion = religion;

    // Add logic to query to omit rejected users.
    where = {
      $and: [
        where,
        sequelize.where(sequelize.col('isRated.rating'), {
          $or: [null, {$ne: DIR().RatingModel.RATING.REJECT}]
        })
      ]
    };

    return this.fetch(where, {
      include: [{
        model: DIR().RatingModel,
        as: 'isRated',
        required: false,
        where: {rater_id: activeUserId}
      }]
    });
  });
};


/**
 *
 */
userBehaviors.classMethods.login = function(user, options) {
  user = user || {};
  if (!user.email) return AppErr.reject(null, ERROR.MISSING_EMAIL);
  if (!user.password) return AppErr.reject(null, ERROR.MISSING_PASSWORD);

  return this.scope('includePW').fetchOne({email: user.email})
  .then((existingUser) => {
    if (!existingUser) return AppErr.assertiveReject(ERROR.NO_EMAIL_FOUND);

    return checkPassword(user.password, existingUser.password)
    .then(() => {
      existingUser = existingUser.toJSON();
      delete existingUser.password;
      return existingUser;
    });
  })
  .catch(err => AppErr.reject(err, ERROR.LOGIN_CHECK));
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
userBehaviors.hooks.beforeValidate = function(user, options) {
  if (!user) return;
  if (user.firstName) user.firstName = titleCase(user.firstName);
  if (user.lastName) user.lastName = titleCase(user.lastName);
  if (user.email) user.email = user.email.trim();
  return user;
};


/**
 * Before Create hook.
 */
userBehaviors.hooks.beforeCreate = function(user, options) {
  return generateHashFromPassword(user.password)
  .then(hash => {
    // override the cleartext password with the hashed one
    user.password = hash;
    return user;
  })
  .catch(err => reject(err));
};


/******************************************************************************/
/********************************** SCOPES  ***********************************/
/******************************************************************************/

/**
 *
 */
userBehaviors.scopes.includePW = () => ({
  attributes: {include: ['password']}
});

/******************************************************************************/
/***************************** HELPER FUNCTIONS  ******************************/
/******************************************************************************/

/**
 *
 */
function generateHashFromPassword(password){
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return reject(err);

      // hash the password along with our new salt
      bcrypt.hash(password, salt, (error, hash) => {
        if (error) return reject(error);

        resolve(hash);
      });
    });
  })
}

/**
 *
 */
function checkPassword(pass1, pass2) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(pass1, pass2, (err, isMatch) => {
      if (err) return reject(AppErr.reject(err, ERROR.PASSWORD_CHECK));
      if (!isMatch) return reject(AppErr.reject(null, ERROR.INVALID_PASSWORD));
      resolve();
    });
  });
}

/**
 *
 */
function titleCase(string) {
  const split = string.trim().split(/\s+/g);
  return split.map(term => {
    return term[0].toUpperCase() + term.slice(1).toLowerCase();
  }).join(' ');
};

/**
 *
 */
function yearsToMS(years) {
  return years * (365.2425  * 24 * 60 * 60 * 1000);
}


/******************************************************************************/
/******************************* EXPORT MODEL  ********************************/
/******************************************************************************/


/**
 * Exports the User Model.
 * @type {!Object}
 */
module.exports = userBehaviors;

const DIR = require('../directory');
