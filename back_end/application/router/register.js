'use strict';

const express = require('express');
const fs = require('fs');     //文件重命名
const path = require('path');
// const formidable = require('formidable');
// const request = require('request');
// const async = require('async');

const config = require('../config/config.js');
const db = require('../utils/db.js');

const Network = require('../fabricCC/initNetwork.js');
const register = require('../fabricCC/registerUser.js');
const enroll = require('../fabricCC/enrollUser.js');


var responseData;

module.exports = function() {
	var router = express.Router();

	router.use('/', function(req, res, next){

		responseData = {
			code: '',
			message:''
		};

		next();
	});

	// 管理员注册，使用 enroll 进行ca注册，并生成用户钱包
	router.post('/admin', async function(req, res){
		console.log(req.body);

		// 先使用enroll注册钱包
		var org = config.ORG;
		var user = 'Admin';
		var name = req.body.username;

		try{
			var sql1 = 'SELECT id FROM user_info WHERE name=? AND type=?';
			var values1 = [name, 'admin'];
			var response = await db.query(sql1, values1);
			if(response.length !== 0){
				responseData.code = '300';
				responseData.message = '该用户已存在，请使用页面下方的登陆按钮进行用户登陆'

			}else{

				var sql = 'INSERT INTO user_info(name, pwd, emil, org, user, type) VALUES(?, ?, ?, ?, ?, ?)';
				var values = [name, req.body.password, req.body.email, org, user, 'admin'];
			 	responseData.message = await db.query(sql, values);

			 	if(responseData.message.affectedRows > 0){
			 		responseData.code = '200';
			 		
			 		// 用户注册成功
			 		var wallet = await enroll(org, user, name);
					// console.log(wallet);
					// var role = {
					// 	'client'
					// }

					var sql2 = 'UPDATE user_info SET wallet=?, roles=? WHERE name=? AND type=?';
					var values2 = [JSON.stringify(wallet), JSON.stringify({}), name, 'admin'];
					responseData.message = await db.query(sql2, values2);

			 		global.fabric[`admin:${name}`] = await Network.init(org, user, name, config.CHANNEL); 
			 	
			 	} else {
			 		// 数据库错误
			 		responseData.code = '500';
			 	}
			}

		} catch (error) {
            responseData.code = '500';
            responseData.message = error;
            console.log(`Error processing transaction. ${error}`);
            console.log(error.stack);

        } finally {
        	console.log(responseData);
        	res.json(responseData);
        }

	});

	// 游客注册，统一使用 Client 用户钱包，当前在那个组织登陆就使用那个组织下的client
	// 'username': '123',
    // 'email': 'asd@qq',
    // 'password': '123',}
	router.post('/client', async function(req, res){
		console.log('register client');
		console.log(req.body);

		// 先使用enroll注册钱包
		var org = config.ORG;
		var user = config.USER;
		var name = req.body.username;

		try{
			// 查看用户是否存在
			var sql1 = 'SELECT id FROM user_info WHERE name=? AND type=?';
			var values1 = [name, 'client'];
			var response = await db.query(sql1, values1);
			if(response.length !== 0){
				responseData.code = '300';
				responseData.message = '该用户已存在，请使用页面下方的登陆按钮进行用户登陆'

			}else{

				var sql = 'INSERT INTO user_info(name, pwd, emil, org, user, type) VALUES(?, ?, ?, ?, ?, ?)';
				var values = [name, req.body.password, req.body.email, org, user, 'client'];

			 	responseData.message = await db.query(sql, values);

			 	if(responseData.message.affectedRows > 0){
			 		responseData.code = '200';

			 		// 用户注册成功
			 		var wallet = await enroll(org, user, name);
					// console.log(wallet);
					// var role = {
					// 	'client'
					// }

					var sql2 = 'UPDATE user_info SET wallet=?, roles=? WHERE name=? AND type=?';
					var values2 = [JSON.stringify(wallet), JSON.stringify({}), name, 'client'];
					responseData.message = await db.query(sql2, values2);

			 		global.fabric[`client:${name}`] = await Network.init(org, user, name, config.CHANNEL);
			 	
			 	} else {
			 		responseData.code = '500';
			 	}
			}

		} catch (error) {
            responseData.code = '500';
            responseData.message = error;
            console.log(`Error processing transaction. ${error}`);
            console.log(error.stack);
            
        } finally {
        	console.log('register completely!');
        	console.log(responseData);
        	res.json(responseData);
        	// res.json(req.body);
        }
	});

	return router;

}