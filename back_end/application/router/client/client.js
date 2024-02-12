'use strict';

const express = require('express');

var router = express.Router();

router.use('/police', require('./police.js')());
router.use('/commercial', require('./commercial.js')());
router.use('/tax', require('./tax.js')());

module.exports = router;