'use strict';


const fs = require('fs');
// const yaml = require('js-yaml');
const path = require('path');
const { Wallets, Gateway } = require('fabric-network');

const utils = require('../utils/utils.js');
const config = require('../config/config.js');
const Role = require(path.join(config.CHAINCODEPATH, 'authority/lib/role.js'));


module.exports = {

	// 得到智能合约 contract
	initCT: async function(network){
		return await network.getContract('authority');
	},

	// 初始化链码
	init: async function(contract) {
		console.log('Submit Aurhority initLedger');

		try {
			let authlist = await contract.submitTransaction('initLedger');
			// let authlist = await contract.submitTransaction('initAuth3');

			console.log('Process getAllAuth transaction response. ' + authlist);

			console.log('Transaction complete.\n');

		} catch(error) {
			console.log(`Error processing transaction. ${error}`);
			console.log(error.stack);
		}
	},

	create: async function(contract, name, isClient, description) {
		console.log('Submit Role create');

		let pem = utils.createRSA();
		try {
			let role = await contract.submitTransaction('create', name, isClient, description, pem.privatePem, pem.publicPem);
			console.log(role + '  ' + typeof(role));
			if(role.toString() === 'false'){
				console.log(`Role ${name} has alread exist!`);
				return false;
			}

			role = Role.fromBuffer(role);

			fs.mkdir(path.join(config.ROLEPEM, `${role.org}`), function(error){
				if (error) {
					// 目录存在
				    console.log(error);
				    // return false;
				  }
				  console.log('创建目录成功');
			});

			fs.writeFileSync(path.join(config.ROLEPEM, `${role.org}/${name}_public_pem.pem`), pem.publicPem, (err) => {
				if (err) throw err;
				console.log('公钥已保存！')
			});

			console.log('Process create transaction response.');
			console.log(role);
			console.log('Transaction complete.\n');

			return role;

		} catch(error) {
			console.log(`Error processing transaction. ${error}`);
			console.log(error.stack);
		}
	},

	delete: async function(contract, org, name) {
		console.log('Submit Role delete');
		try {
			let res = await contract.submitTransaction('delete', org, name);
			console.log('Process create transaction response. ' + res);
			if(res.toString() === 'false') {
				console.log(`Role ${name} is not exist.`);
			} else {
				console.log('Delete successfully');
				fs.unlinkSync(path.join(config.ROLEPEM, `${org}/${name}_public_pem.pem`));
			}
			console.log('Transaction complete.\n');
			return res;

		} catch(error) {
			console.log(`Error processing transaction. ${error}`);
			console.log(error.stack);
		}

	},

	search: async function(contract, org, name) {
		console.log('Submit Role search');
		let res = false;

		try {

			if (arguments.length === 1) {
				// 查找所有存在的role
				res = await contract.submitTransaction('searchAll');
				res = utils.stringToJson(res.toString()); // json数组
			
			} else if (arguments.length === 2) {
				// 查找组织 org 创建的role
				res = await contract.submitTransaction('searchByOrg', org);
				res = utils.stringToJson(res.toString()); // json数组
			
			} else if (arguments.length === 3) {
				// 查找准确的某一个角色 
				res = await contract.submitTransaction('search', org, name);

				if(res.toString() === ''){
					res = [];
				}else {
					res = [Role.fromBuffer(res)];
				}

			} else {
				console.log('This function need 1 to 3 parameters');
			}

			console.log('Process search transaction response.');
			console.log(res);

			console.log('Transaction complete.\n');
			return res;

		} catch(error) {
			console.log(`Error processing transaction. ${error}`);
			console.log(error.stack);
		}

	},

	addAuth: async function(contract, org, name, dataName, dataOrg, dataUser, authlist) {
		console.log('Submit Aurhority addAuth');
		if(typeof(authlist) !== 'string'){
			authlist = Role.makeKey(authlist);
		}

		try {
			let res = await contract.submitTransaction('addAuth', Role.makeKey([org, name]), Role.makeKey([dataName, dataOrg, dataUser.toLowerCase()]), authlist);

			console.log('Process addAuth transaction response. ' + res);

			console.log('Transaction complete.\n');

			return res;

		} catch(error) {
			console.log(`Error processing transaction. ${error}`);
			console.log(error.stack);
		}

	},

	isAuth: async function(contract, org, name, dataName, dataOrg, dataUser, authority) {
		console.log('Submit Aurhority isAuth');

		try {
			let res = await contract.submitTransaction('isAuth', Role.makeKey([org, name]), Role.makeKey([dataName, dataOrg, dataUser.toLowerCase()]), authority);

			console.log('Process isAuth transaction response. ' + res);

			console.log('Transaction complete.\n');

			return res;

		} catch(error) {
			console.log(`Error processing transaction. ${error}`);
			console.log(error.stack);
		}
	},

	deleteAuth: async function(contract, org, name, dataName, dataOrg, dataUser, authlist) {
		console.log('Submit Aurhority deleteAuth');
		if(typeof(authlist) !== 'string'){
			authlist = Role.makeKey(authlist);
		}

		try {
			let res = await contract.submitTransaction('deleteAuth', Role.makeKey([org, name]), Role.makeKey([dataName, dataOrg, dataUser.toLowerCase()]), authlist);

			console.log('Process deleteAuth transaction response. ' + res);

			console.log('Transaction complete.\n');

			return res;

		} catch(error) {
			console.log(`Error processing transaction. ${error}`);
			console.log(error.stack);
		}
	},

	getAllAuth: async function(contract, org, name, dataName, dataOrg, dataUser) {
		console.log('Submit Aurhority getAllAuth');

		try {
			let authlist = await contract.submitTransaction('getAllAuth', Role.makeKey([org, name]), Role.makeKey([dataName, dataOrg, dataUser.toLowerCase()]));

			console.log('Process getAllAuth transaction response. ' + authlist);
			console.log(eval("eval(authlist)" + eval(authlist)));

			console.log('Transaction complete.\n');

			return authlist;

		} catch(error) {
			console.log(`Error processing transaction. ${error}`);
			console.log(error.stack);
		}
	}

}

