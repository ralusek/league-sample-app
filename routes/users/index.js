'use strict';

const express = require('express');
const router = express.Router();
const auth = require('../../services/auth');
const authConfig = require('../../config/auth_token');

const AppErr = require('punch-error');

const PreferenceModel = require('../../models/preferences');
const UserModel = require('../../models/users');

const MW = {};
// Login middleware.
MW.login = [
  auth.MW.login(
    (body) => UserModel.login(body),
    authConfig.OPTIONS.secret,
    authConfig.OPTIONS.options
  ),
  (req, res, next) => {
    res.json({user: req.user, token: req.token});
  }
];


/**
 * Search users that match logged in user's preferences.
 */
router.get('/my-matches',
auth.MW.enforceAuth,
(req, res, next) => {
  UserModel.fetchMatches(req.user.id)
  .then(users => res.json(users))
  .catch(err => next(AppErr.pass(err, UserModel.ERROR.FETCH)));
});


/**
 * Get user with their associated preferences.
 */
router.get('/:id',
auth.MW.enforceAuth,
(req, res, next) => {
  UserModel.fetchOne({id: req.params.id}, {
    include: [{model: PreferenceModel}]
  })
  .then(user => res.json(user))
  .catch(err => next(AppErr.pass(err, UserModel.ERROR.FETCH)));
});


/**
 * Login.
 */
router.post('/login', MW.login);


/**
 * Create a user.
 */
router.post('/',
(req, res, next) => {
  UserModel.createOne(req.body)
  .then(user => next())
  .catch(err => next(AppErr.pass(err, UserModel.ERROR.CREATE)));
},
MW.login);



module.exports = router;
