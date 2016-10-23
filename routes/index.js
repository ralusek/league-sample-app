const express = require('express');
const router = express.Router();
const auth = require('../services/auth');

router.use('/users', require('./users'));

router.use(auth.MW.enforceAuth);

router.use('/preferences', require('./preferences'));

router.use('/ratings', require('./ratings'));

module.exports = router;
