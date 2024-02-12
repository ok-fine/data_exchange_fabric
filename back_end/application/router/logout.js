'use strict';

const express = require('express');
const mysql = require('mysql');
const fs = require('fs');     //文件重命名
const pathLib = require('path');
const formidable = require('formidable');
const request = require('request');
const async = require('async');

const Network = require('../fabricCC/initNetwork.js');
const db = require('../utils/db.js');


var responseData;

module.exports = function() {
	var router = express.Router();

	router.get('/', function(req, res, next){

		responseData = {
			code: '',
			message:''
		};

		next();
	});

	router.get('/', async function(req, res){
		var name = req.query.username;
		console.log('logout');
		console.log(req.query);
		// console.log(`logout fabric ${name} is : `);
        // console.log(global.fabric[name]);

        try{
        	await Network.stop(global.fabric[name]);
			responseData.code = '200';
			responseData.message = `用户 ${name} 退出成功`;

        } catch (error) {
        	responseData.code = '500';
            responseData.message = error;
            console.log(`Error processing transaction. ${error}`);
            console.log(error.stack);

        } finally {
        	console.log(responseData);
        	res.json(responseData);
        }
		
		// res.json(responseData);
	});

	router.get('/all', async function(req, res){
		console.log('logout all the users');
		console.log(req.query);

		for(var key in global.fabric){
			console.log(key + ' stop');
			await Network.stop(global.fabric[key]);
		}

		res.json('success');
	});

	return router;
}

// let fabric = {};
// fabric['a'] = 1;
// fabric['b'] = 2;
// fabric['c'] = 3;

// for(var k in fabric){
// 	console.log(k + ' : ' + fabric[k]);
// 	// console.log(fabric[k]);
// }


