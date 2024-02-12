'use strict';

// const sha256 = require('sha256');
const sha256 = require("sha256");
const crypto = require("crypto");

crypto.sha256 = x => crypto.createHash('sha256').update(x, 'utf8').digest('hex');
crypto.md5 = x => crypto.createHash('md5').update(x, 'utf8').digest('hex');

module.exports = {
	sha256,
	crypto,
	try: function() {
		console.log("try successful!");
	}


}