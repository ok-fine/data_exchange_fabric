'use strict';

// const sha256 = require('sha256');
const sha256 = require("sha256");
const crypto = require("crypto");
const RSA = require('node-rsa');

crypto.sha256 = x => crypto.createHash('sha256').update(x, 'utf8').digest('hex');
crypto.md5 = x => crypto.createHash('md5').update(x, 'utf8').digest('hex');
crypto.sha1 = x => crypto.createHash('sha1').update(x, 'utf8').digest('hex');

module.exports = {
	sha256,
	crypto,

	getUserByID: function (id) {
        let user = id.match(/CN=.+::/)[0];
        return user.substr(3, user.length - 5);
    },

	try: function() {
		console.log("try successful!");
	},

	encryptRSA: function(publicKey, buffer){
		let key = new RSA(publicKey,'pkcs1-public-pem');
		return key.encrypt(buffer, 'base64');
	},

	decryptRSA: function(privateKey, encrypted){
		let key = new RSA(privateKey,'pkcs1-private-pem');
		return key.decrypt(encrypted, 'utf8');
	},

	encryptPriRSA: function(privateKey, buffer){
		let key = new RSA(privateKey,'pkcs1-private-pem');
		return key.encryptPrivate(buffer, 'base64');
	},

	decryptPubRSA: function(publicKey, encrypted){
		let key = new RSA(publicKey,'pkcs1-public-pem');
		return key.decryptPublic(encrypted, 'utf8');
	}

}