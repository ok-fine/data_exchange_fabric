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
const Network = require('./fabricCC/initNetwork.js');
const DataAsset = require(path.join(config.CHAINCODEPATH, 'dataasset/lib/data.js'));
const roleController = require('./fabricCC/roleController.js');




// const {register} = require('./fabricCC/index.js');

// register('1', 'User1', 'cindy');
// enroll('2', 'User1', 'cindy');

// enroll('1', 'User1', 'wjy');
// enroll('2', 'User1', 'wjy2');
// enroll('3', 'User1', 'wjy3');

// upload.push('1', 'User1', 'wjy', 'data1');
// query.exist('1', 'User1', 'wjy', 'data1');
function wait(ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
};

async function try1(contract) {
	try{
		console.log('Submit DataAsset test');
		const testResponse = await contract.submitTransaction('getFunctions');
		console.log('Process upload transaction response.' + typeof(testResponse));
		console.log(JSON.parse(testResponse.toString()));
		utils.stringToJson(testResponse);

		// console.log('\n\nSubmit DataAsset test');
		// const testResponse1 = await contract.submitTransaction('show', 'hhhh');
		// console.log('Process upload transaction response.' + typeof(testResponse1));

	} catch(error) {
		console.log(`Error processing transaction. ${error}`);
		console.log(error.stack);
	}
}

function try2(org){
	let dir = path.join(config.ROLEPEM, org);

	fs.mkdir( path.join(config.ROLEPEM, org), function(error){
		if (error) {
		    console.log(error);
		    return false;
		  }
		  console.log('创建目录成功');
	});
}


async function query1(org, contract, dataname){
	try {
		// 使用 submitTransaction 调用合约
		console.log('Submit DataAsset exist');
		const ifExist = await contract.submitTransaction('exist', dataname, `org${org}`);
		console.log('Process exist transaction response. ' + ifExist.toString());

		if (ifExist.toString() === '') {
			console.log(`data asset ${dataname} in org${org} is not exist`);
		} else {
			console.log(`data asset ${dataname} in org${org} is exist`);
		}
		console.log('Transaction complete.');

	} catch(error) {
		console.log(`Error processing transaction. ${error}`);
		console.log(error.stack);
	}

}

async function query2(org, contract, dataname, contHash){
	try {
		// 使用 submitTransaction 调用合约
		console.log('Submit DataAsset exist');
		const ifExist = await contract.submitTransaction('confirm', dataname, `org${org}`, contHash);
		console.log('Process exist transaction response. ' + ifExist.toString());

		if (ifExist.toString() === 'null') {
			console.log(`data asset ${dataname} in org${org} is not exist`);
		} else if (ifExist.toString() === 'false') {
			console.log(`data asset ${dataname} in org${org} is not correct`);
		} else {
			console.log(`data asset ${dataname} in org${org} is correct`);
		}
		console.log('Transaction complete.');

	} catch(error) {
		console.log(`Error processing transaction. ${error}`);
		console.log(error.stack);
	}

}

async function push(org, user, username, contract, dataname ){
	try{
		console.log('Submit DataAsset upload');
		const pushResponse = await contract.submitTransaction('push', dataname, `org${org}`, username, new Date(), '/1/2/3', utils.sha256('hahahahhahahahaha'));
		console.log('Process upload transaction response.' + pushResponse);

		// 合约返回的结果
		let data = DataAsset.fromBuffer(pushResponse);
		console.log(`data asset '${data.name}' upload by ${data.publisher} successfully!`);
		console.log('Transaction complete.');

	} catch(error) {
		console.log(`Error processing transaction. ${error}`);
		console.log(error.stack);
	}

}


async function test(org, user, username, contract){
	try{
		console.log('Submit DataAsset test');
		const testResponse = await contract.submitTransaction('show2');
		console.log('Process upload transaction response.' + typeof(testResponse));

		// console.log('\n\nSubmit DataAsset test');
		// const testResponse1 = await contract.submitTransaction('show', 'hhhh');
		// console.log('Process upload transaction response.' + typeof(testResponse1));

	} catch(error) {
		console.log(`Error processing transaction. ${error}`);
		console.log(error.stack);
	}

}


async function init(org, user, name){
	// await enroll('1', 'User1', 'wjy');
	const channelName = 'datachannel';
	const contractName = 'dataasset';
	return await Network.init(org, user, name, channelName, contractName);
}

function getTime(){

	let date = sd.format(new Date(1618719753004), 'YYYY-MM-DDTHH:mm:ss.000Z');
	console.log('getTime: ' + date);
	console.log(new Date(161871975 + 3004));
	return date;
}

// 调用方法；
async function main(){

	// try2('org1');
	// console.log(new Date());

	// await register('1', 'User1', 'cindy');

	// await enroll('1', 'Admin', 'wjy');
	// await enroll('1', 'User1', 'wjy');  // -- use for test
	// // await enroll('2', 'User1', 'wjy2');
	// await enroll('2', 'User1', 'wjy');
	// await enroll('2', 'Admin', 'wjy2');
	
	// const fabric = await init('1', 'Admin', '111');

	


	// // // await try1(fabric.contract);
	// await query.exist('1', fabric.contract, 'data1', ['org1', 'User1']);

	// await upload.push('1', 'User1', '111', fabric.contract, 'data1');
	// await upload.push('1', 'User1', '111', fabric.contract, 'data2');
	// await upload.push('1', 'User1', '111', fabric.contract, 'data3');
	// await upload.push('1', 'User1', '111', fabric.contract, 'data4');



	// Network.stop(fabric);

	// const fabric1 = await init('2', 'User1', 'wjy');
	// await upload.push('2', 'User1', 'wjy', fabric1.contract, 'data1');
	// await upload.push('2', 'User1', 'wjy', fabric1.contract, 'data2');
	// await upload.push('2', 'User1', 'wjy', fabric1.contract, 'data3');
	// Network.stop(fabric1);

	// // const fabric2 = await init('2', 'User1', 'wjy2');
	// // await upload.push('2', 'User1', 'wjy2', fabric2.contract, 'data1');
	// // await upload.push('2', 'User1', 'wjy2', fabric2.contract, 'data2');
	// // Network.stop(fabric2);

	// const fabric3 = await init('2', 'Admin', 'wjy2');
	// await upload.push('2', 'Admin', 'wjy2', fabric3.contract, 'data1');
	// await upload.push('2', 'Admin', 'wjy2', fabric3.contract, 'data2');
	// Network.stop(fabric3);


	// console.log(utils.sha256('lalalalalalalala'));
	// // 924703c73f12ed048e6b1493be8d1e4a9ffb1dbc68a0f1dc5731d1607c47dcfb
	// console.log(utils.sha256('hahahahhahahahaha'));
	// // 34cdcd7c688bc4134d19d2a86662b380dfeb1fca273d82078753856f3a011817



	// const fabric2 = await init('1', 'User1', 'wjy');

	// await upload.push('1', 'User1', 'wjy', fabric2.contract, 'data4');

	// let data = await query.exist('1', fabric2.contract, 'data1', []);

	// let data1 = await query.exist('1', fabric2.contract, 'data1', ['org1']);
	// // // // console.log(data1);
	// await query.exist('2', fabric2.contract, 'data2', ['org2', 'user1']);
	// // await query.exist('2', fabric2.contract, 'data3', ['org2']);

	// await query.search(fabric2.contract);
	// await query.search(fabric2.contract, '2');
	// await query.search(fabric2.contract, 'org1', 'User1');

	// // console.log(DataAsset.makeKey(['asd', ""]));

	// // await query.exist('1', fabric2.contract, 'data1', ['org1', 'User1']);
	// await query.confirm('1', 'User1', fabric2.contract, 'data1', '/1/2/3', utils.sha256('lalalalalalalala'));
	// await query.confirm('1', 'User1', fabric2.contract, 'data1', '/1/2/3', utils.sha256('hahahahhahahahaha'));
	// await query.confirm('1', 'User1', fabric2.contract, 'data1', '/1/2/3/4', utils.sha256('hahahahhahahahaha'));

	// await upload.update('1', 'User1', 'wjy', fabric2.contract, 'data1', 'type', 'file', utils.sha256('lalalalalalalala'));
	// await query.exist('1', fabric2.contract, 'data1', ['org1', 'User1']);

	// await query.exist('1', fabric2.contract, 'data4', ['org1', 'User1']);
	// await upload.delete(fabric2.contract, 'data4');
	// await query.exist('1', fabric2.contract, 'data4', ['org1', 'User1']);
	// // await query.confirm('1', 'User1', fabric2.contract, 'data4', '/1/2/3', utils.sha256('lalalalalalalala'));

	// await upload.delete(fabric2.contract, 'data5');


	// Network.stop(fabric2);



	// const a = '[{"Key":"\u0000org.datanet.dataasset\u0000data1\u0000org1\u0000user1\u0000","Record":{"class":"org.datanet.dataasset","contHash":"34cdcd7c688bc4134d19d2a86662b380dfeb1fca273d82078753856f3a011817","currentState":1,"mspid":"Org1MSP","name":"data1","owner":"org1:user1","posHash":"41eda123a16bcef1b9e3ec0ee070bbff5372d4362071d220365bdd5f30461c39","position":"/1/2/3","publishTime":"2021-04-24T10:30:46.836Z","publisher":"6372ed54f5a0d9db21235708c1dd693c2a55df3d","type":"file"}},{"Key":"\u0000org.datanet.dataasset\u0000data1\u0000org2\u0000admin\u0000","Record":{"class":"org.datanet.dataasset","contHash":"34cdcd7c688bc4134d19d2a86662b380dfeb1fca273d82078753856f3a011817","currentState":1,"mspid":"Org2MSP","name":"data1","owner":"org2:admin","posHash":"0d70430dd1763fb287be97cd84496b529637c058967a04bf8fe0119778bfd25f","position":"/1/2/3","publishTime":"2021-04-24T10:31:08.362Z","publisher":"869577d096da9e56ff67e7c45280212076662def","type":"file"}},{"Key":"\u0000org.datanet.dataasset\u0000data1\u0000org2\u0000user1\u0000","Record":{"class":"org.datanet.dataasset","contHash":"34cdcd7c688bc4134d19d2a86662b380dfeb1fca273d82078753856f3a011817","currentState":1,"mspid":"Org2MSP","name":"data1","owner":"org2:user1","posHash":"d1f39b3ac94056e99628d48425d8e0a6881ab1ca28cb9cde24eeb8d330048ee7","position":"/1/2/3","publishTime":"2021-04-24T10:31:03.672Z","publisher":"c407bdc673c4acdfcf5ead6486e1f2c44a936804","type":"file"}}]';
	// let b = eval(a.toString());
	// console.log(b);

	
	// console.log(eval(a));
	// for(var d in data){
	// 	data[0] = JSON.parse(JSON.stringify(d));
	// }

	// console.log(data[0].Key);




	// const fabric = await init('1', 'User1', 'wjy');
	// await test('1', 'User1', 'wjy', fabric.contract);
	// Network.stop(fabric);

	// console.log('----------');

	// const fabric1 = await init('2', 'User1', 'wjy');
	// await test('1', 'User1', 'wjy', fabric1.contract);
	// Network.stop(fabric1);

	// console.log('----------');

	// const fabric2 = await init('2', 'User1', 'wjy2');
	// await test('2', 'User1', 'wjy2', fabric2.contract);
	// Network.stop(fabric2);

	// console.log('----------');

	// const fabric3 = await init('2', 'Admin', 'wjy2');
	// await test('2', 'Admin', 'wjy2', fabric3.contract);
	// Network.stop(fabric3);

	// console.log('downing');




	// time type: object

// 	let time1 = new Object({"seconds":"1618938063","nanos":255000000});
// 	// time1 = JSON.stringify(time1);
// 	let time  = JSON.parse(time1);
// 	console.log(time + ' ' + time.seconds + ' ' + time.nanos);
// 	let ms = time.seconds * 1000 + time.nanos / 1000000;


// // time: {"seconds":"1618938063","nanos":255000000}


// 2021-04-20T17:01:03.326Z
	// console.log(sd.format('2021-04-21T03:38:24.259Z', 'YY-MM-DD HH:mm:ss:'));





	// await query1('1', 'User1', 'wjy', 'data1');
	
	// await query1('1', fabric.contract, 'data1');
	// await query2('1', fabric.contract, 'data8', utils.sha256('hahahahhahahahaha'));
	// await query2('1', fabric.contract, 'data8', utils.sha256('hahahahhahahaha'));
	// await query2('1', fabric.contract, 'data81', utils.sha256('hahahahhahahahaha'));
	// Network.stop(fabric);


	// const a = await new Promise((resolve, reject) => {
	// 	// if(1){
	// 		// let b = try1();
	// 		// console.log('b:' + b);
	// 		resolve(try1());
	// 	// };
	// });
	// console.log('a: ' + a);
	// console.log('a tostring: ' + a.toString());

	// if(a){
	// 	console.log('a == true');
	// }else{
	// 	console.log('a == false');
	// }

	// let json = JSON.parse(a.toString())
	// console.log(json);
	// let b = new (Boolean)(json);

	// if(b){
	// 	console.log('b == true');
	// }else{
	// 	console.log('b == false');
	// }

}

main();