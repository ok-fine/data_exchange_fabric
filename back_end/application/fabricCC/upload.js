'use strict';

const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const { Wallets, Gateway } = require('fabric-network');

const utils = require('../utils/utils.js');
const config = require('../config/config.js');
const DataAsset = require(path.join(config.CHAINCODEPATH, 'dataasset/lib/data.js'));

function Error(error){
	console.log(`Error processing transaction. ${error}`);
	console.log(error.stack);
}

function getDir(config, pathName){
	var dirs = [];

	var pathnow = config + pathName + '/';
	// console.info('pathnow: ' + pathnow);
	var files = fs.readdirSync(pathnow);
	for(var itm of  files){
    // files.forEach(function (itm, index) {
    	if(itm[0] === '.'){
    		continue;
    	}
        var stat = fs.statSync(pathnow + itm);
        if (stat.isDirectory()) {
        //递归读取文件
            let dir = getDir(config, pathName + '/' + itm);
            dirs.push.apply(dirs, dir);
        } else {
            var obj = {};//定义一个对象存放文件的路径和名字
            obj.path = pathName;//路径
            obj.name = itm.split('.')[0]; //名字,去掉了后缀
            obj.filename = itm; //名字,去掉了后缀
            dirs.push(obj);
            // dirs.push(pathName + '/' + itm);
        }
    }
    return dirs;
}


module.exports = {

	initCT: async function(network){
		return await network.getContract('dataasset');
	},

	// oppoDir - 相对于Config.DATAPATH的路径
	upload: async function (contract, org, user, datadir) {

		try {
			// dataKey: 相对于config.DATAPATH 的路径
			var dirs =  getDir(config.DATAPATH, datadir);
			console.log('dirs:');
			console.log(dirs);

			for(var dir of dirs){
				var cont = fs.readFileSync(path.join(config.DATAPATH, dir.path, dir.filename), 'utf-8');
				await this.push(contract, org, user, dir.name, dir.path, cont);
				// console.log('push');
			}

			return true;

		} catch(error) {
			Error(error);
		}

	},

	push: async function (contract, org, user, dataname, pos, cont){
		try{
			console.log('Submit DataAsset push');
			const pushResponse = await contract.submitTransaction('push', dataname, 'file', pos, utils.sha256(cont));
			console.log('Process push transaction response.');
			if(pushResponse.toString() === 'false'){
				console.log(`data asset '${dataname}' has already exist!`);
				console.log('Transaction complete.\n');
				return false;
			}

			// 合约返回的结果
			let data = DataAsset.fromBuffer(pushResponse);
			console.log(data);
			console.log(`data asset '${data.name}' push by ${data.owner} successfully!`);
			console.log('Transaction complete.\n');

			return data;

		} catch(error) {
			Error(error);
		}
	},

	update: async function(contract, rolekey, pubPem, datakey, type, position, cont) {
		try{
			console.log('Submit DataAsset update');
			const updateResponse = await contract.submitTransaction('update', rolekey, pubPem, datakey, type, position, utils.sha256(cont));
			console.log('Process update transaction response. ');

			if(updateResponse.toString() === 'null') {
				console.log(`data ${dataname} is not exist`);
				return 'null';
			}else if(updateResponse.toString() === 'false') {
				console.log('You don\'t have authority to delete');
				return false;
			}else {
				console.log('update successfully');
			}

			console.log(updateResponse);

			// 合约返回的结果
			let data = DataAsset.fromBuffer(updateResponse);
			

			// console.log(`data asset '${data.name}' update by ${data.publisher} successfully!`);
			console.log('Transaction complete.\n');

			return data;

		} catch(error) {
			Error(error);
		}

	},

	delete: async function(contract, rolekey, datakey, pubPem) {
		try{
			console.log('Submit DataAsset delete');
			const deletResponse = await contract.submitTransaction('delete', rolekey, datakey, pubPem);
			console.log('Process delete transaction response. ' + deletResponse);

			if(deletResponse.toString() === 'null') {
				console.log(`data ${dataname} is not exist`);
			}else if(deletResponse.toString() === 'false') {
				console.log('You don\'t have authority to delete');
			}else {
				console.log('delete successfully');
			}

			console.log('Transaction complete.\n');

			return deletResponse;

		} catch(error) {
			Error(error);
		}

	},

	cando: async function(contract, roleKey, dataKey, func, publicPem){
		try{
			console.log('Submit DataAsset cando');
			const deletResponse = await contract.submitTransaction('canDo', roleKey, dataKey, func, publicPem);
			console.log('Process cando transaction response. ' + deletResponse);

			if(deletResponse === 'false') {
				console.log('You don\'t have authority to ' + fun);
			}else {
				console.log('cando successfully');
			}

			console.log('Transaction complete.\n');

			return deletResponse;

		} catch(error) {
			Error(error);
		}
	}
}

// let a = getDir(config.DATAPATH, 'router');
// console.log(a);




