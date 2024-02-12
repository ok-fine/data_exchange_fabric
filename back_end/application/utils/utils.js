'use strict';

// const sha256 = require('sha256');
const sha256 = require("sha256");
const crypto = require("crypto");
const RSA = require('node-rsa');

crypto.sha256 = x => crypto.createHash('sha256').update(x, 'utf8').digest('hex');
crypto.md5 = x => crypto.createHash('md5').update(x, 'utf8').digest('hex');

module.exports = {

	sha256,

	// JSON 序列化
	serialize: function (object) {
        return Buffer.from(JSON.stringify(object));
	},

	// 反序列化为 JSON 格式
	deserialize: function (data) {
        let json = JSON.parse(data.toString());
        return json;
    },

    deserializeClass: function (data, objClass) {
        let json = JSON.parse(data.toString());
        let object = new (objClass)(json);
        return object;
    },

    // parts 为一个 [] 属性数组，使他们用 '&'相连
    makePart: function (parts) {
    	return parts.map(part => part).join(':');
    },

    splitPart: function (part) {
    	return part.split(':');
    },

    stringToJson: function (string) {
        let json = eval(string);
        // console.log(json);
        return json;
    },

    createRSA: function() {
        var key = new RSA({ b: 512 });
        key.setOptions({ encryptionScheme: 'pkcs1' });
        var privatePem = key.exportKey('pkcs1-private-pem');
        var publicPem = key.exportKey('pkcs1-public-pem');
        return {privatePem, publicPem};
    }

}











