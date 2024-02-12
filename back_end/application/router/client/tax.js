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
const sys_org = 'org3';
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


    // 办理税务登记证。
    router.post('/apply', async function(req, res){
        let username = req.body.username; // admin:user1
        let user = username.split(':');
        let name = req.body.name; // 数据名字
        let cont = req.body.content;

        console.log('apply tax for ' + name);
        if(global.fabric[username] === undefined || global.fabric[username].network === undefined){
            responseData.code = '300';
            responseData.message = '在使用前请先进行用户登录';
            res.json(responseData);
        }

        try {

            // 
            let dataCT = await upload.initCT(global.fabric[username].network);
            let exist = await query.exist(dataCT, name, ['org2', 'admin']); // json数组列表
            console.log(exist);

            if(exist){
                let tax_path = path.join(__dirname, '../..', config.ORG3DATA, 'tax', `${name}.txt`);
                responseData.message = fs.writeFileSync(tax_path, cont);

            
            }

            responseData.code = '200';


        } catch (error) {
            responseData.code = '500';
            responseData.message = error;
            console.log(`Error processing transaction. ${error}`);
            console.log(error.stack);

        } finally {
            console.log('final tax apply');
            console.log(responseData);
            res.json(responseData);
        }
    });


    return router;
}


