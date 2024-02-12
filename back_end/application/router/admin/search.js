/*
 * 查找数据并显示
 */

'use strict';

const express = require('express');
const mysql = require('mysql');
const fs = require('fs');     //文件重命名
const path = require('path');
const HashMap = require('hashmap');

// const async = require('async');

const Network = require('../../fabricCC/initNetwork.js');
const roleController = require('../../fabricCC/roleController.js');
const query = require('../../fabricCC/query.js');
const upload = require('../../fabricCC/upload.js');

const config = require('../../config/config.js');
// const utils = require('../../utils/utils.js');
const db = require('../../utils/db.js');

var responseData;

module.exports = function(){
    var router = express.Router();

    router.use('/', function(req, res, next){

        responseData = {
            code: '',
            message: ''
        }

        next();
    });


    // 查询所有的data和role
    router.post('/roles', async function(req, res){
        let username = req.body.username; // admin:user1

        console.log('search role Num ' + username);
        if(global.fabric[username] === undefined || global.fabric[username].network === undefined){
            responseData.code = '300';
            responseData.message = '在使用前请先进行用户登录';
            res.json(responseData);

        }

        try {
            let roleCT = await roleController.initCT(global.fabric[username].network);
            let roles = await roleController.search(roleCT); // json数组列表
            
            // 解析auth列表为json数据格式
            for(var r of roles){
                let auth = new HashMap(r.Record.authlist.authmap);
                r.Record.authlist = {};
                auth.forEach(function(value, key) {
                    r.Record.authlist[key] = value;
                });
            }

            responseData.code = '200';
            responseData.message = {'roles': roles, 'num': roles.length}

            // res.json(responseData);

        } catch (error) {
            responseData.code = '500';
            responseData.message = error;
            console.log(`Error processing transaction. ${error}`);
            console.log(error.stack);

        } finally {
            console.log('final role search');
            console.log(responseData);
            res.json(responseData);
        }
    });


    router.post('/datas', async function(req, res) {
        let username = req.body.username; // admin:user1
        let user = username.split(':');

        console.log('search data Num ' + username);
        if(global.fabric[username] === undefined || global.fabric[username].network === undefined){
            responseData.code = '300';
            responseData.message = '在使用前请先进行用户登录';
            res.json(responseData);

        }

        try {

            // 查看角色
            var sql = 'SELECT roles FROM user_info WHERE name=? AND type=?';
            var values = [user[1], user[0]];
            var roles = await db.query(sql, values);
            // roles = JSON.parse(roles[0]); // rolekey -> pubpem;
            roles = JSON.parse(roles[0].roles);
            console.log('roles: ' + roles);

            let dataCT = await upload.initCT(global.fabric[username].network);
            let datas = [];

            for(var role in roles){
                // cando
                console.log('role: ' + role);
                datas = await query.search(dataCT, role, roles[role])
            }

            // 需要权限验证
            // let roleKey = 'orgS:Admin';
            // let publicPem = fs.readFileSync(path.join(config.PEM, '/publicAdmin.pem'), 'utf-8');
            // let dataCT = await upload.initCT(global.fabric[username].network)
            // let datas = await query.search(dataCT, roleKey, publicPem);

            console.log(datas);

            responseData.code = '200';
            responseData.message = {'datas': datas, 'num': datas.length}
            // res.json(responseData);

        } catch (error) {
            responseData.code = '500';
            responseData.message = error;
            console.log(`Error processing transaction. ${error}`);
            console.log(error.stack);

        } finally {
            console.log('final data search');
            console.log(responseData);
            res.json(responseData);
        }
    });



    return router;
}

// let a = {'a': 1};
// console.log(a[0]);

