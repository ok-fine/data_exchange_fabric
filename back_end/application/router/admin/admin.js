'use strict';

const express = require('express');

var router = express.Router();

router.use('/search', require('./search.js')());
router.use('/role', require('./role.js')());
router.use('/data', require('./data.js')());

module.exports = router;