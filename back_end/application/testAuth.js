'use strict';
'use strict';

const sd = require('silly-datetime');
const moment = require('moment');
const path = require('path');
const RSA = require('node-rsa');
const fs = require('fs');

const config = require('./config/config.js');
const utils = require('./utils/utils.js');

const register = require('./fabricCC/registerUser.js');
const enroll = require('./fabricCC/enrollUser.js');
const upload = require('./fabricCC/upload.js');
const query = require('./fabricCC/query.js');
const roleController = require('./fabricCC/roleController.js');

const Network = require('./fabricCC/initNetwork.js');
const DataAsset = require(path.join(config.CHAINCODEPATH, 'dataasset/lib/data.js'));
const Role = require(path.join(config.CHAINCODEPATH, 'authority/lib/role.js'));



function wait(ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
};

function try2(){
	// var key = new RSA({ b: 512 });
	// key.setOptions({ encryptionScheme: 'pkcs1' });
	// var privatePem = key.exportKey('pkcs1-private-pem');
	// var publicPem = key.exportKey('pkcs1-public-pem');
	// console.log(privatePem);

	// return {privatePem, publicPem};


	// var pubKey = new RSA(publicPem,'pkcs1-public-pem');
	// var encrypted = pubKey.encrypt(true, 'base64');
	// console.log('aa: ' + encrypted);

	// // /* 私钥解密 */
	// var priKey = new RSA(privatePem,'pkcs1-private-pem');

	// var decrypted = priKey.decrypt(encrypted, 'utf8');
	// console.log(decrypted);

	let a = '-----BEGIN RSA PUBLIC KEY-----\nMEgCQQCDaNnuOXORkMsgNmQL6HomS662fNXU9NI/wdmAWcWqdbwj4ygO+0q8QapU\ne62PI+N4ljkQfst6+b/DV6isKsr7AgMBAAE=\n-----END RSA PUBLIC KEY-----';
	var pubKey = new RSA(a,'pkcs1-public-pem');
	console.log(pubKey.decryptPublic('PfVDJVhms5eNmbWnyQiNXxSGopWT6IferwQjUqTxx8gj1nx1ANPlUdXzk+QkzljrH0X4LIwNGFbR0KLpH+rX2g==', 'utf8'));


	// console.log('-----');
	// let cipherText = priKey.encryptPrivate('hello world', 'base64');
	// let rawText = pubKey.decryptPublic(cipherText, 'utf8');
	// console.log(cipherText);
	// console.log(rawText);

	// var buffer = 'true';
	// var signature = priKey.sign(buffer);
	// console.log(signature);
	// var flag = pubKey.verify(buffer, signature);
	// console.log(flag);



	// console.log(priKey.getKeySize());
	// console.log(priKey.isPrivate());
	// console.log(priKey.isPublic(true));
	// console.log(priKey.getMaxMessageSize());

	// console.log('-----');

	// console.log(pubKey.getKeySize());
	// console.log(pubKey.isPrivate());
	// console.log(pubKey.isPublic());
	// console.log(pubKey.isPublic(false));
	// console.log(pubKey.isPublic(true));
	// console.log(pubKey.getMaxMessageSize());


	// fs.writeFile('./pem/public.pem', publicPem, (err) => {
	// 	if (err) throw err;
	// 	console.log('公钥已保存！')
	// });

	// fs.writeFile('./pem/private.pem', privatePem, (err) => {
	// 	if (err) throw err;
	// 	console.log('私钥已保存！')
	// });

}

async function init(org, user, name){
	// await enroll('1', 'User1', 'wjy');
	const channelName = 'datachannel';
	const contractName = 'authority';
	return await Network.init(org, user, name, channelName, contractName);
}

async function init1(org, user, name){
	// await enroll('1', 'User1', 'wjy');
	const channelName = 'datachannel';
	const contractName = 'dataasset';
	return await Network.init(org, user, name, channelName, contractName);
}

// 调用方法；
async function main(){

	// try2();

	// const fabrict = await init1('1', 'User1', 'wjy');
	// const func = await query.getFunction(fabrict.contract);
	// console.log(func);
	// Network.stop(fabrict);

	// const func = (['push', 'exist', 'confirm', 'update', 'delete',
 //          'searchByOwner', 'searchByOrg', 'searchByName', 'searchAll']);

 	const func = (['update', 'delete','searchByOwner', 'searchByName', 'searchAll']);

    // let func = [];

	// await enroll('1', 'Admin', 'cindy');
	// await enroll('1', 'User1', 'wjy');  // -- use for test
	// await enroll('2', 'User1', 'wjy2');
	// await enroll('2', 'User1', 'wjy');
	// await enroll('2', 'Admin', 'wjy2');


	const fabric = await init('1', 'User1', '111');
	// await roleController.init(fabric.contract);
	// // await query.callRole(fabric.contract);
	// Network.stop(fabric);
	
	// const fabric = await init('1', 'User1', '111');

	// let role11 = await roleController.create(fabric.contract, '1-WJY1', false, 'The first role');
	// let role12 = await roleController.create(fabric.contract, '1-WJY2', false, 'The second role');
	// let role13 = await roleController.create(fabric.contract, '1-WJY3', false, 'The third role');

	// 测试角色的权限管理
	await roleController.addAuth(fabric.contract, 'org1', 'wjy1', 'data1.txt', 'org1', 'Admin', func);
	await roleController.addAuth(fabric.contract, 'org1', 'wjy1', 'data2.txt', 'org1', 'Admin', func);
	await roleController.addAuth(fabric.contract, 'org1', 'wjy1', 'data3.txt', 'org1', 'Admin', func);
	await roleController.addAuth(fabric.contract, 'org1', 'wjy1', 'data4.txt', 'org1', 'Admin', func);
	// await roleController.addAuth(fabric.contract, 'org1', 'wjy1', 'data5.txt', 'org1', 'Admin', func);

	await roleController.addAuth(fabric.contract, 'org1', 'wjy2', 'data1.txt', 'org1', 'Admin', func);
	await roleController.addAuth(fabric.contract, 'org1', 'wjy2', 'data2.txt', 'org1', 'Admin', func);
	await roleController.addAuth(fabric.contract, 'org1', 'wjy2', 'data3.txt', 'org1', 'Admin', func);

	await roleController.addAuth(fabric.contract, 'org1', 'wjy3', 'data1.txt', 'org1', 'Admin', func);
	await roleController.addAuth(fabric.contract, 'org1', 'wjy3', 'data2.txt', 'org1', 'Admin', func);

	await roleController.addAuth(fabric.contract, 'orgS', 'Admin', 'data1.txt', 'org1', 'Admin', func);
	await roleController.addAuth(fabric.contract, 'orgS', 'Admin', 'data2.txt', 'org1', 'Admin', func);
	await roleController.addAuth(fabric.contract, 'orgS', 'Admin', 'data3.txt', 'org1', 'Admin', func);
	await roleController.addAuth(fabric.contract, 'orgS', 'Admin', 'data4.txt', 'org1', 'Admin', func);


	// // 删除权限
	// await roleController.deleteAuth(fabric.contract, 'org1', 'wjy1', 'data1', '1', 'Admin', func);
	// await roleController.deleteAuth(fabric.contract, 'org1', 'wjy1', 'data2', '1', 'Admin', func);
	// await roleController.deleteAuth(fabric.contract, 'org1', 'wjy1', 'data3', '1', 'Admin', func);

	// await roleController.deleteAuth(fabric.contract, 'org1', 'wjy2', 'data1', '1', 'Admin', func);
	// await roleController.deleteAuth(fabric.contract, 'org1', 'wjy2', 'data2', '1', 'Admin', func);
	// await roleController.deleteAuth(fabric.contract, 'org1', 'wjy2', 'data3', '1', 'Admin', func);
	// await roleController.deleteAuth(fabric.contract, 'org1', 'wjy2', 'data4', '1', 'Admin', func);

	// await roleController.deleteAuth(fabric.contract, 'org1', 'wjy3', 'data1', '1', 'Admin', func);
	// await roleController.deleteAuth(fabric.contract, 'org1', 'wjy3', 'data1', '2', 'Admin', func);

	// await roleController.deleteAuth(fabric.contract, 'orgS', 'Admin', 'data1', '1', 'Admin', func);
	// await roleController.deleteAuth(fabric.contract, 'orgS', 'Admin', 'data2', '1', 'Admin', func);
	// await roleController.deleteAuth(fabric.contract, 'orgS', 'Admin', 'data3', '1', 'Admin', func);
	// await roleController.deleteAuth(fabric.contract, 'orgS', 'Admin', 'data4', '1', 'Admin', func);



	// await roleController.search(fabric.contract);

	// await roleController.getAllAuth(fabric.contract, 'System', 'Admin', 'data3', '1', 'User1');

	// await roleController.isAuth(fabric.contract, '1', '1-WJY1', 'data3', '1', 'User1', 'searchByOwner');
	// // await roleController.isAuth(fabric.contract, '1', '1-WJY1', 'data3', '1', 'User1', 'searchByOwneasss');
	// // await roleController.isAuth(fabric.contract, '1', '2-WJY2', 'data2', '1', 'User1', 'delete');
	// await roleController.deleteAuth(fabric.contract, '1', '1-WJY1', 'data3', '1', 'User1', ['searchByOwner']);
	// await roleController.isAuth(fabric.contract, '1', '1-WJY1', 'data3', '1', 'User1', 'searchByOwner');


	// await roleController.getAllAuth(fabric.contract, '1', '1-WJY1', 'data3', '1', 'User1');


	Network.stop(fabric);


	// const fabric2 = await init('2', 'User1', 'wjy');
	// let role21 = await roleController.create(fabric2.contract, '2-WJY1', true, 'The first role');
	// let role22 = await roleController.create(fabric2.contract, '2-WJY2', true, 'The second role');
	// let role23 = await roleController.create(fabric2.contract, '2-WJY3', true, 'The third role');
	// Network.stop(fabric2);

	// const fabric2 = await init('2', 'Admin', 'wjy2');
	// let role21 = await roleController.create(fabric2.contract, '3-WJY1', false, 'The first role');
	// console.log(role21);
	// let role22 = await roleController.create(fabric2.contract, '3-WJY2', false, 'The second role');
	// console.log(role22);
	// let role23 = await roleController.create(fabric2.contract, '3-WJY3', false, 'The third role');
	// console.log(role23);
	// Network.stop(fabric2);

	// const fabric3 = await init('2', 'Admin', 'wjy2');
	// // await roleController.search(fabric3.contract);
	// let roles = await roleController.search(fabric3.contract, '1');
	// for(var role of roles){
	// 	console.log(role.Key + " : " + JSON.stringify(role.Record.authlist.authmap));
	// }

	// // // await roleController.delete(fabric3.contract, '1', '1-WJY2');

	// // let role = await roleController.search(fabric3.contract, '1', '1-WJY1');
	// // console.log(role.authlist);

	// // // await roleController.search(fabric3.contract, '1', '2-WJY1');
	// Network.stop(fabric3);

}

main();


// async function a(type){
// 	if(type === 1){
// 		await enroll('1', 'User1', 'wjy');  // -- use for test
// 		await enroll('2', 'User1', 'wjy2');
// 		return {'a': 3, 'b': 4};
// 	}

// 	await enroll('2', 'User1', 'wjy');
// 	await enroll('2', 'Admin', 'wjy2');
// 	return {'a': 1, 'b': 2};
// }
// async function c(){
// 	let d = await a(1);
// 	console.log('d' + d);
// 	console.log('d json' + JSON.stringify(d));


// 	let b = await new Promise((resolve, reject) => {
// 		let res = a(2);
// 		resolve(res);
// 	});

// 	console.log(b);
// }

// c();

