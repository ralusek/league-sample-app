'use strict';

const express = require('express');
const router = express.Router();
const auth = require('../../services/auth');
const authConfig = require('../../config/auth_token');

const AppErr = require('punch-error');

const RatingModel = require('../../models/ratings');

/**
 *
 */
router.put('/users/:userId',
(req, res, next) => {
  const rating = req.body || {};
  rating.rated_id = req.params.userId;
  rating.rater_id = req.user.id;
  RatingModel.upsertOne(rating)
  .then(rating => res.json(rating))
  .catch(err => next(AppErr.pass(err, RatingModel.ERROR.UPSERT)));
});



module.exports = router;
