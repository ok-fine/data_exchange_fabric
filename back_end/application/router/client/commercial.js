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
// const utils = require('../../utils/utils.js');
const db = require('../../utils/db.js');

// 
const sys_org = 'org2';
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


    // 申请营业执照 -> 保存在对应的数据库中
    router.post('/apply', async function(req, res){
        let username = req.body.username; // admin:user1
        let user = username.split(':');
        let name = req.body.name; // 数据名字
        let cont = req.body.content;

        console.log('apply license ' + name);
        if(global.fabric[username] === undefined || global.fabric[username].network === undefined){
            responseData.code = '300';
            responseData.message = '在使用前请先进行用户登录';
            res.json(responseData);
        }

        try {


            let license_path = path.join(__dirname, '../..', config.ORG2DATA, 'license', `${name}.txt`);
            responseData.message = fs.writeFileSync(license_path, cont);
            
            responseData.code = '200';


        } catch (error) {
            responseData.code = '500';
            responseData.message = error;
            console.log(`Error processing transaction. ${error}`);
            console.log(error.stack);

        } finally {
            console.log('final license apply');
            console.log(responseData);
            res.json(responseData);
        }
    });


    return router;
}


