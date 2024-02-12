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


    // 创建data asset对象
    router.post('/create', async function(req, res){
        let username = req.body.username; // admin:user1
        let user = username.split(':');
        let name = req.body.dataname; // 数据名字
        let pos = req.body.position;
        let cont = req.body.content;  // 数据内容描述
        // let org = req.body.roleorg;
        // let dataname = req.body.dataname; // []
        // let dataorg = req.body.dataorg;  // []
        // let authlist = req.body.authlist; // []

        console.log('create data ' + name);
        if(global.fabric[username] === undefined || global.fabric[username].network === undefined){
            responseData.code = '300';
            responseData.message = '在使用前请先进行用户登录';
            res.json(responseData);
        }

        try {
            let dataCT = await upload.initCT(global.fabric[username].network);
            let data = await upload.push(dataCT, user[0], user[1], name, pos, cont); // json数组列表
            if(data){
                responseData.code = '200';
                responseData.message = data;
            }else{
                responseData.code = '300';
                responseData.message = `数据${name}已存在`;
            }

            // res.json(responseData);

        } catch (error) {
            responseData.code = '500';
            responseData.message = error;
            console.log(`Error processing transaction. ${error}`);
            console.log(error.stack);

        } finally {
            console.log('final data create');
            console.log(responseData);
            res.json(responseData);
        }
    });

    router.post('/delete', async function(req, res){
        let username = req.body.username; // admin:user1
        let user = username.split(':');
        let datakey = req.body.datakey; // 需要访问的资源名
        // let data = datakey.split(':');
        // let func = req.body.func;


        console.log('delete data ' + datakey);
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

            responseData.code = '300';
            responseData.message = `数据 ${datakey} 删除失败，请查看您是否具有此权限`;

            // console.log('roles: ' + roles.roles);

            for(var role in roles){
                // cando
                console.log('role: ' + role);
                let delres = await upload.delete(dataCT, role, datakey, roles[role]);
                if(delres.toString() === 'true'){
                    responseData.code = '200';
                    responseData.message = `数据 ${datakey} 删除成功`;
                    break;
                }
            }

        } catch (error) {
            responseData.code = '500';
            responseData.message = error;
            console.log(`Error processing transaction. ${error}`);
            console.log(error.stack);

        } finally {
            console.log('final data delete');
            console.log(responseData);
            res.json(responseData);
        }
    });

    // 更新
    router.post('/update', async function(req, res){
        let username = req.body.username; // admin:username
        let user = username.split(':');
        let datakey = req.body.datakey; // name:org:user
        let data = datakey.split(':');
        let position = req.body.position;

        console.log(`update data ${datakey} to ${position}`);

        try {

            if(global.fabric[username] === undefined || global.fabric[username].network === undefined){
                responseData.code = '300';
                responseData.message = '在使用前请先进行用户登录';
                res.json(responseData);
            }

            // 查找文件
            let file = fs.statSync(path.join(config.DATAPATH, position, data[0]));
            if(file.isDirectory()){
                responseData.code = '300';
                responseData.message = '请输入正确的文件路径，该路径下不存在此文件';
                res.json(responseData);
            }
            let cont = fs.readFileSync(path.join(config.DATAPATH, position, data[0]), 'utf-8');

            // 查看角色
            var sql = 'SELECT roles FROM user_info WHERE name=? AND type=?';
            var values = [user[1], user[0]];
            var roles = await db.query(sql, values);
            // roles = JSON.parse(roles[0]); // rolekey -> pubpem;
            roles = JSON.parse(roles[0].roles);
            console.log('roles: ');
            console.log(roles);

            let dataCT = await upload.initCT(global.fabric[username].network);

            responseData.code = '300';
            responseData.message = `抱歉您并不具有更新数据 ${datakey} 的权限 `;

            for(var role in roles){
                // cando
                console.log('role: ' + role);
                let newData = await upload.update(dataCT, role, roles[role], datakey, 'file', position, cont);
                console.log(newData);
                if(newData.toString() === 'null'){
                    // responseData.code = '300';
                    responseData.message = `数据 ${datakey} 不存在`;
                    break;
                }else if(newData.toString() !== 'false'){
                    responseData.code = '200';
                    responseData.message = `数据 ${datakey} 更新成功`;
                    break;
                }
            }

        } catch (error) {
            responseData.code = '500';
            responseData.message = error;
            console.log(`Error processing transaction. ${error}`);
            console.log(error.stack);

        } finally {
            console.log('final data update');
            console.log(responseData);
            res.json(responseData);
        }
    });

    // 一键上传所有的资源
    router.post('/upload', async function(req, res){
        let username = req.body.username; // admin:username
        let user = username.split(':');
        let dir = req.body.datadir;
        var org = `org${config.ORG}`;

        console.log('upload datas from ' + dir);

        try {

            if(global.fabric[username] === undefined || global.fabric[username].network === undefined){
                responseData.code = '300';
                responseData.message = '在使用前请先进行用户登录';
                res.json(responseData);
            }


            let dataCT = await upload.initCT(global.fabric[username].network);

            responseData.code = '200';
            responseData.message = await upload.upload(dataCT, org, user[0], dir);

        } catch (error) {
            responseData.code = '500';
            responseData.message = error;
            console.log(`Error processing transaction. ${error}`);
            console.log(error.stack);

        } finally {
            console.log('final data upload');
            console.log(responseData);
            res.json(responseData);
        }
    });

    // 





    return router;
}


