/*
 * 角色管理部分
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


    // 创建角色，同时为角色分配资源权限
    router.post('/create', async function(req, res){
        let username = req.body.username; // admin:user1
        let name = req.body.rolename; // 角色名字
        let des = req.body.description;  // 角色描述
        // let org = req.body.roleorg;
        // let dataname = req.body.dataname; // []
        // let dataorg = req.body.dataorg;  // []
        // let authlist = req.body.authlist; // []

        console.log('create role ' + name);
        if(global.fabric[username] === undefined || global.fabric[username].network === undefined){
            responseData.code = '300';
            responseData.message = '在使用前请先进行用户登录';
            res.json(responseData);
        }

        try {
            let roleCT = await roleController.initCT(global.fabric[username].network);
            let role = await roleController.create(roleCT, name, false, des); // json数组列表

            if(role === false){
                responseData.code = '300';
                responseData.message = '角色已存在，请返回主页进行查看或修改';
            }else{
                responseData.code = '200';
                responseData.message = role;
            }

        } catch (error) {
            responseData.code = '500';
            responseData.message = error;
            console.log(`Error processing transaction. ${error}`);
            console.log(error.stack);

        } finally {
            console.log('final role create');
            console.log(responseData);
            res.json(responseData);
        }
    });

    // 删除角色
    router.post('/delete', async function(req, res){
        let username = req.body.username; // admin:user1
        let rolekey = req.body.rolekey.split(':'); // 角色名字

        console.log('delete role ' + rolekey);
        if(global.fabric[username] === undefined || global.fabric[username].network === undefined){
            responseData.code = '300';
            responseData.message = '在使用前请先进行用户登录';
            res.json(responseData);
        }

        try {
            let roleCT = await roleController.initCT(global.fabric[username].network);
            responseData.message = await roleController.delete(roleCT, rolekey[0], rolekey[1]); // json数组列表

            responseData.code = '200';

            // res.json(responseData);

        } catch (error) {
            responseData.code = '500';
            responseData.message = error;
            console.log(`Error processing transaction. ${error}`);
            console.log(error.stack);

        } finally {
            console.log('final role delete');
            console.log(responseData);
            res.json(responseData);
        }
    });

    // 将角色分发给用户
    router.post('/allocate', async function(req, res) {
        try {

            let username = req.body.username; // admin:username
            let role = req.body.role.split(':'); // 角色名字 org:name
            // let roleorg = req.body.roleorg; // 角色名字
            let user = req.body.touser.split(':'); //[admin, username]
            // let totype = 

            console.log(`allocate role ${role} to ${user}`);

            let pubPem = fs.readFileSync(path.join(config.ROLEPEM, `${role[0]}/${role[1]}_public_pem.pem`), 'utf-8', (err, data) => {
                if (err) {
                    responseData.code = '500';
                    responseData.message = err;
                    console.log(`Error processing transaction. ${err}`);
                    console.log(error.stack);

                    res.json(responseData);

                } else {
                    console.log('publicPem: ' + data);
                }
            });

            // var rolename = req.body.role;
            let roleinfo = {};
            roleinfo[req.body.role] = pubPem;
            console.log(roleinfo);
            var sql = 'UPDATE user_info SET ROLES=? WHERE name=? AND type=?';
            var values = [JSON.stringify(roleinfo), user[1], user[0]];
            responseData.message = await db.query(sql, values);
            responseData.code = '200';

        } catch (error) {
            responseData.code = '500';
            responseData.message = error;
            console.log(`Error processing transaction. ${error}`);
            console.log(error.stack);

        } finally {
            console.log('final role allocation');
            console.log(responseData);
            res.json(responseData);
        }    

    });

    router.post('/editauth', async function(req, res) {
        let username = req.body.username; // admin:user1
        let roleKey = req.body.role.split(':'); // org:name
        let dataKey = req.body.datakey.split(':'); // name:org:user
        let op = req.body.op; //[ addAuth, isAuth, deleteAuth, getAllAuth]
        let authlist = req.body.authlist; // []
        // authlist = 

        responseData.code = '300';

        try {
            let roleCT = await roleController.initCT(global.fabric[username].network);
            if(roleController[op] === undefined){
                responseData.message = op + ' 指令不存在';
            }else{
                console.log(`执行: ${roleKey} -> ${dataKey} -> ${op} -> ${authlist}`);
                // responseData.code = '200';
                let res = await roleController[op](roleCT, roleKey[0], roleKey[1], dataKey[0], dataKey[1], dataKey[2], authlist);
                if(res.toString() !== 'false' && res.toString() !=='null'){
                    responseData.code = '200';
                }
                responseData.message = `指令 ${op} 执行结果：${res}`;
            }

        } catch (error) {
            responseData.code = '500';
            responseData.message = error;
            console.log(`Error processing transaction. ${error}`);
            console.log(error.stack);

        } finally {
            console.log('final role date addAuth');
            console.log(responseData);
            res.json(responseData);
        }

    });



    return router;
}


