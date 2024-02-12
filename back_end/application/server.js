

var responseData;
const express = require('express');
const bodyParser = require('body-parser');
// const static = require('express-static');
// const consolidate=require('consolidate');
// const multer = require('multer');
const fs = require('fs');     //文件重命名
const path = require('path'); //解析文件路径

const config = require('./config/config.js')

global.fabric = {};


var server = express();
server.listen(config.PORT);
// server.listen(8088);


server.use(bodyParser.urlencoded({}));
server.use(express.static(path.join(__dirname, '../../front_end')));
// server.use(express.json());

// var objMuter = multer({dest:'./upload/'});
// server.use(objMuter.any());
// server.use(express.static('files'));

// server.use('/', function(req, res, next){
// 	req.aaa = 123;
// 	console.log('first');
// 	next();
// });

server.post('/tt', function (req, res) {
    console.log('second' + req.body);

    res.json(req.body);

    // res.send(`1111 ${req.params.id}, ${req.params.a}, ${req.params.b}, ${req.params.c}`);
});


//登陆验证
server.use('/login', require('./router/login.js')());
server.use('/logout', require('./router/logout.js')());
server.use('/register', require('./router/register.js')());

server.use('/admin', require('./router/admin/admin.js'));
server.use('/client', require('./router/client/client.js'));



