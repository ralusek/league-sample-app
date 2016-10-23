'use strict';

const express = require('express');
const router = express.Router();
const auth = require('../../services/auth');
const authConfig = require('../../config/auth_token');

const AppErr = require('punch-error');

const PreferenceModel = require('../../models/preferences');

/**
 *
 */
router.put('/',
(req, res, next) => {
  const preference = req.body || {};
  preference.user_id = req.user.id;
  PreferenceModel.upsertOne(preference)
  .then(preference => res.json(preference))
  .catch(err => next(AppErr.pass(err, PreferenceModel.ERROR.UPSERT)));
});



module.exports = router;
