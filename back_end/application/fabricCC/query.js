'use strict';

const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const { Wallets, Gateway } = require('fabric-network');

const utils = require('../utils/utils.js');
const config = require('../config/config.js');
const DataAsset = require(path.join(config.CHAINCODEPATH, 'dataasset/lib/data.js'));

module.exports = {

	initCT: async function(network){
		return await network.getContract('dataasset');
	},

	callRole: async function(contract){
		try {
			// 使用 submitTransaction 调用合约
			console.log('Submit DataAsset callRole');
			// const ifExist = await contract.submitTransaction('exist', dataname, utils.makePart(['org1', 'user1']));
			const res = await contract.submitTransaction('callRole');
			console.log('Process callRolet transaction response. ' + JSON.stringify(res));

			console.log('Transaction complete.\n');

			return res;

		} catch(error) {
			console.log(`Error processing transaction. ${error}`);
			console.log(error.stack);
		}
	},
	
	// params: org:user
	exist: async function (contract, dataname, params){
		try {
			// 使用 submitTransaction 调用合约
			console.log('Submit DataAsset exist');
			// const ifExist = await contract.submitTransaction('exist', dataname, utils.makePart(['org1', 'user1']));
			const ifExist = await contract.submitTransaction('exist', dataname, params.map(part => part).join(':'));
			console.log('Process exist transaction response.');

			// let datas = eval(ifExist.toString());
			let datas = utils.stringToJson(ifExist.toString());

			if (datas.length === 0) {
				console.log(`data asset ${dataname} in ${params} is not exist`);
			} else {
				console.log(`data asset ${dataname} in ${params} is exist`);
			}

			// console.log('Response: ' + datas);

			console.log('Transaction complete.\n');

			return datas;

		} catch(error) {
			console.log(`Error processing transaction. ${error}`);
			console.log(error.stack);
		}

	},

	confirm: async function (contract, org, user, dataname, positon, contHash){
		try {
			// 使用 submitTransaction 调用合约
			console.log('Submit DataAsset comfirm');
			let ifExist = await contract.submitTransaction('confirm', dataname, `${org}:${user}`, positon, contHash);
			console.log('Process exist transaction response. ' + ifExist.toString());

			if (ifExist.toString() === 'null') {
				console.log(`data asset ${dataname} in org is not exist`);
				ifExist = false;

			} else if (ifExist.toString() === 'false') {
				console.log(`data asset ${dataname} in org is not correct`);
				ifExist = false;

			} else {
				console.log(`data asset ${dataname} in org is correct`);
				ifExist = true;

			}


			console.log('Transaction complete.\n');

			return ifExist;

		} catch(error) {
			console.log(`Error processing transaction. ${error}`);
			console.log(error.stack);
		}

	},

	search: async function (contract, roleKey, publicPem, org, user){
		console.log('arguments.length: ' + arguments.length);

		try {
			// 使用 submitTransaction 调用合约
			console.log('Submit DataAsset search');
			let datas = '';
			if (arguments.length === 3) {
				// 查找链上的所有数据
				datas = await contract.submitTransaction('searchAll', roleKey, publicPem);

			} else if (arguments.length === 4) {
				// 通过 mapid 来查找 org 创建的所有数据
				datas = await contract.submitTransaction('searchByOrg', roleKey, publicPem, org);

			} else if (arguments.length === 5) {
				// 通过 owner 来查找 org:user 创建的所有数据
				datas = await contract.submitTransaction('searchByOwner', roleKey, publicPem, org, user);
			}

			console.log('Process search transaction response.');
			datas = utils.stringToJson(datas.toString());
			console.log(datas);

			console.log('Transaction complete.\n');

			return datas;

		} catch(error) {
			console.log(`Error processing transaction. ${error}`);
			console.log(error.stack);
		}

	},

	getFunction: async function(contract){
		try {
			// 使用 submitTransaction 调用合约
			console.log('Submit DataAsset getFunction');
			let func = await contract.submitTransaction('getFunction');
	
			console.log('Process getFunction transaction response. ');
			
			func = JSON.parse(func.toString());
			console.log(func);

			console.log('Transaction complete.\n');

			return DataAsset.splitKey(func.payload);

		} catch(error) {
			console.log(`Error processing transaction. ${error}`);
			console.log(error.stack);
		}

	}

}