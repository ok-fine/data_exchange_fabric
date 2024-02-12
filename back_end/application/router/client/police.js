/*
 * 资源管理部分
 */

'use strict';

const express = require('express');
const mysql = require('mysql');
const fs = require('fs');     //文件重命名
const path = require('path');
const HashMap = require('hashmap');

// const async = require('async');

const Network = require('../../fabricCC/initNetwork.js');
// const roleController = require('../../fabricCC/roleController.js');
const query = require('../../fabricCC/query.js');
const upload = require('../../fabricCC/upload.js');

const config = require('../../config/config.js');
const utils = require('../../utils/utils.js');
const db = require('../../utils/db.js');

// 
const sys_org = 'org1';
const sys_user = 'Admin';


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


    // 用户身份认证
    router.post('/idcard', async function(req, res){
        let username = req.body.username; // client:name
        let user = username.split(':');
        let name = req.body.name; // 数据名字
        let idcard = req.body.idcard;

        console.log('confirm idcard ' + name);
        if(global.fabric[username] === undefined || global.fabric[username].network === undefined){
            responseData.code = '300';
            responseData.message = '在使用前请先进行用户登录';
            res.json(responseData);
        }

        try {
            let dataCT = await upload.initCT(global.fabric[username].network);
            let response = await query.confirm(dataCT, sys_org, sys_user, name, config.ORG1DATA + '/idcard', utils.sha256(idcard)); // json数组列表
            if(response){
                // 身份信息绑定成功
                var sql = 'UPDATE user_info SET idname=?, idcard=? WHERE name=? AND type=?';
                var values = [name, idcard ,user[1], user[0]];
                await db.query(sql, values);
                
                responseData.code = '200';
                responseData.message = `${name} 身份信息绑定成功`;

            }else{
                responseData.code = '300';
                responseData.message = `${name} 的身份信息不正确`;
            }

            // res.json(responseData);

        } catch (error) {
            responseData.code = '500';
            responseData.message = error;
            console.log(`Error processing transaction. ${error}`);
            console.log(error.stack);

        } finally {
            console.log('final idcard confirm');
            console.log(responseData);
            res.json(responseData);
        }
    });


    return router;
}


