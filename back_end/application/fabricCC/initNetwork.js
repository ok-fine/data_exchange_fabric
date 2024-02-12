'use strict';

const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const { Wallets, Gateway } = require('fabric-network');

const utils = require('../utils/utils.js');
const config = require('../config/config.js');
const DataAsset = require(path.join(config.CHAINCODEPATH, 'dataasset/lib/data.js'));

module.exports = {

	putWallet: async function(org, user, name, wallet){
		let walletPath = path.join(config.WALLETPATH, `org${org}/${user}`);
		const wallets = await Wallets.newFileSystemWallet(walletPath);
		console.log(`wallet path: ${walletPath}`);

		let userExists = await wallets.get(name);
		console.log('exist: ' + userExists);
		// 存在且相等
		if(userExists && userExists.credentials.privateKey === JSON.parse(wallet).credentials.privateKey){
			console.log(`用户 "${user}":"${name}" 的钱包已存在，不需要再次创建钱包`);
            return true;
		}else if(userExists){
			// 存在，但不相等
			console.log('用户信息与钱包信息不相同，请核验！');
			return false;
		}

		await wallets.put(name, JSON.parse(wallet));
		return true;
	},

	initCT: async function(network, contractName){
		return await network.getContract(contractName);
	},

	// fabric = {channelName,contractName}
	init: async function(org, user, name, channelName, contractName) {

		let walletPath = path.join(config.WALLETPATH, `org${org}/${user}`);
		const wallet = await Wallets.newFileSystemWallet(walletPath);

		const userExists = await wallet.get(name);
		if (!userExists) {
			console.log(`An identity for the client user "${user}":"${name}" doesn't exists in the wallet`);
			console.log('Please register first');
			return;
		}
		console.log(`Using ${name} from org${org} with user ${user}`);

		const gateway = new Gateway();
		try {

			let conpath = path.resolve(config.ORGPATH, `peerOrganizations/org${org}.gov.com/connection-org${org}.yaml`);
			let connectionProfile = yaml.load(fs.readFileSync(conpath, 'utf8'));

			let connectionOptions = {
				identity: name,
				wallet: wallet,
				discovery: { enabled:true, asLocalhost: true }
			};

			console.log('Connect to Fabric gateway.');
			await gateway.connect(connectionProfile, connectionOptions);

			console.log(`Use network channel: ${channelName}.\n`);
			const network = await gateway.getNetwork(channelName);

			if(contractName !== undefined){
				console.log(`Use org.datanet.dataasset smart contract ${contractName}.\n`);
				const contract = await network.getContract(contractName);
				return {
					gateway,
					network,
					contract
				}
			}

			return {
				gateway,
				network
			}

		} catch (error) {
			console.log(`Error processing transaction. ${error}`);
			console.log(error.stack);
		}
		// finally {
		// 	console.log('Disconnect from Fabric gateway.');
		// 	gateway.disconnect();
		// }
	},

	// fabric = { gateway, network }
	stop: function(fabric){
		try {
			console.log('Disconnect from Fabric gateway. \n');
			fabric.gateway.disconnect();
		} catch (error) {
			console.log(`Error close gateway. ${error}`);
			console.log(error.stack);
		}
	}

}