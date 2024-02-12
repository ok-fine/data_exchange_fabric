/*
 * register user without ca
 **/

'use strict';

const { Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const config = require('../config/config.js');

// register('User1', '1', 'wjy');
async function register(org, user, name) {
	try {
		// 设置钱包路径
		let walletPath = path.join(config.WALLETPATH, `org${org}/${user}`);
		const wallet = await Wallets.newFileSystemWallet(walletPath);
		console.log(`wallet path: ${walletPath}`);

		// 查看此用户是否已经注册过了
		const userExists = await wallet.get(name);
		if (userExists) {
			console.log(`An identity for the client user "${user}":"${name}" already exists in the wallet`);
            return userExists;
		}
		console.log(`registering "${user}":"${name}" ...`);

		// 设置存储在钱包中的身份信息的路径
		const credPath = path.join(config.ORGPATH, `peerOrganizations/org${org}.gov.com/users/${user}@org${org}.gov.com`);
		const certificate = fs.readFileSync(path.join(credPath, `/msp/signcerts/${user}@org${org}.gov.com-cert.pem`)).toString();
		const privateKey = fs.readFileSync(path.join(credPath, `/msp/keystore/priv_sk`)).toString();

		//加载身份信息到钱包
		const identity = {
			credentials: {
				certificate,
				privateKey
			},
			mspId: `Org${org}MSP`,
			type: 'X.509'
		}

		await wallet.put(name, identity);

		console.log('done');

		return identity;

	}catch (error) {
		console.log(`Error adding to wallet. ${error}`);
        console.log(error.stack);
        process.exit(-1);
	}

}

module.exports = register;


// register().then(() => {
// 	console.log('done');
// }).catch((e) => {
// 	console.log(e);
//     console.log(e.stack);
//     process.exit(-1);
// });


