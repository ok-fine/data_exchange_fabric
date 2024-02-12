/*
 * 用户登陆
 */

'use strict';

const express = require('express');
const mysql = require('mysql');
const fs = require('fs');     //文件重命名
const pathLib = require('path');
const formidable = require('formidable');
const request = require('request');
const async = require('async');

const Network = require('../fabricCC/initNetwork.js');

const config = require('../config/config.js');
const utils = require('../utils/utils.js');
const db = require('../utils/db.js');

var responseData;

// function getFabric(){
//     console.log('follow are all fabric:');
//     console.log(fabric);
//     return fabric;
// }

async function login(req, res, next){
    // console.log(req._parsedUrl[Url]);
    // console.log(req._parsedUrl.path);
    // console.log(req._parsedUrl.Url.path);
    var type = req._parsedUrl.path.substr(1);


    var sql = "SELECT org, user, name, pwd, wallet FROM user_info WHERE name=? AND type=?";
    var values = [req.body.username, type];
    var response = await db.query(sql, values);

    if(response.length === 0){
        responseData.code = '300';
        responseData.message = '该用户尚未注册，请点击下方注册按钮注册成为新用户';
        res.json(responseData);

    } else if(response[0].pwd === req.body.password){
        responseData.code = '200';
        responseData.message = '用户登陆成功';
        req.body.response = response;
        next();

    } else {
        responseData.code = '300';
        responseData.message = '用户密码错误，请输入正确的账号密码进行登录验证，如果忘记密码可点击右上方进行找回';
        res.json(responseData);
    }
}

module.exports = function(){
    var router = express.Router();

    router.use('/', function(req, res, next){

        responseData = {
            code: '',
            message: ''
        }

        next();
    });


    //管理员登陆，需要注册钱包，注册过的需要将钱包放到钱包下面
    router.post('/admin', login, async function(req, res){
        console.log(req.body.response);

        var org = req.body.response[0].org;
        var user = req.body.response[0].user;
        var name = req.body.username;

        if(req.body.response[0].wallet === ''){
            responseData.code = '300';
            responseData.message = '该用户在注册时尚未生成用户钱包，不可使用，请切换别的用户或注册一个新的用户';
            res.json(responseData);
        }

        try{

            // 获取/加载用户钱包身份信息
            let res = await Network.putWallet(org, user, name, req.body.response[0].wallet);
            if( res ){
                global.fabric[`admin:${name}`] = await Network.init(org, user, name, config.CHANNEL);

            }else{
                responseData.code = '300';
                responseData.message = '用户登陆失败，用户钱包信息错误';
                // res.json(responseData);
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

    router.post('/client', login, async function(req, res) {
        console.log(req.body.response);

        var org = req.body.response[0].org;
        var user = req.body.response[0].user;
        var name = req.body.username;
        // var name = 'client';

        if(req.body.response[0].wallet === ''){
            responseData.code = '300';
            responseData.message = '该用户在注册时尚未生成用户钱包，不可使用，请切换别的用户或注册一个新的用户';
            res.json(responseData);
        }

        try{

            // 获取/加载用户钱包身份信息
            let res = await Network.putWallet(org, user, name, req.body.response[0].wallet);
            if(res){
                global.fabric[`client:${name}`] = await Network.init(org, user, name, config.CHANNEL);
            }else{
                responseData.code = '300';
                responseData.message = '用户登陆失败，用户钱包信息错误';
            }

        } catch (error) {
            responseData.code = '500';
            responseData.message = error;
            console.log(`Error processing transaction. ${error}`);
            console.log(error.stack);

        } finally {
            res.json(responseData);
        }
    });

    // //登陆验证
    // router.post('/', function(req, res){
    //     var form = new formidable.IncomingForm();
    //     form.uploadDir = fileDir;
    //     form.keepExtensions = true;
    //     form.parse(req, function(err, fields, files){
    //         // console.log(files);
    //         // var student_no = fields['student_no'];
    //         var student_name = fields['student_name'];
    //         var student_no = fields['student_no'];
    //         var check_name = '姓名:' + student_name;
    //         var check_no = '学号:' + student_no;

    //         //先存储为临时照片，命名为学号
    //         var card_href = pathLib.parse(files.card_href.path).dir + '\/' + student_no + '_1.JPG';
    //         //检查用户是否存在
    //         db2.query(`SELECT * FROM student_user WHERE student_no='${student_no}'`, function(err, data){
    //             if(data.length != 0){
    //                 fs.rename(files.card_href.path, card_href, function(err){
    //                     if(err){
    //                         responseData.code = '0005';
    //                         responseData.message = '用户学生证图片上传失败';
    //                         res.json(responseData);
    //                         throw err;
    //                     }
    //                     else{
    //                         responseData.code = '0006';
    //                         responseData.message = '用户学生证图片上传成功';
    //                         console.log(responseData);
    //                         // check.check_card(res, check_no, check_name, card_href);
    //                     }
    //                 })

    //                 var img_path = '/home/ubuntu/hutao/Back-end/images/student_card/'+ student_no + '_1.JPG';
    //                 console.log(img_path);
    //                // fs.unlinkSync(img_path);

    //                 responseData.code = '0004';
    //                 responseData.message = '用户已存在,请使用已绑定的微信号登陆';
    //                 res.json(responseData);
    //             }else{
    //                 //用户不存在就重命名名存储改学生证照片为“学号_1.JPG”
    //                 card_href = pathLib.parse(files.card_href.path).dir + '\/' +  fields['student_no'] + '_1.JPG';
    //                 //重命名,并上传学生证照片检测学号和姓名等信息
    //                 fs.rename(files.card_href.path, card_href, function(err){
    //                     if(err){
    //                         responseData.code = '0005';
    //                         responseData.message = '用户学生证图片上传失败';
    //                         res.json(responseData);
    //                         throw err;
    //                     }
    //                     else{
    //                         responseData.code = '0006';
    //                         responseData.message = '用户学生证图片上传成功';
    //                         console.log(responseData);
    //                         //异步处理图像识别
    //                         check.check_card(res, check_no, check_name, card_href);
    //                         // res.json(responseData);
    //                     }
    //                 })
    //             }
    //         });
    //     });
// 
    // });

    return router;
}


// var json = {};
// let a = '132';
// json[a] = 123;
// console.log(json);


