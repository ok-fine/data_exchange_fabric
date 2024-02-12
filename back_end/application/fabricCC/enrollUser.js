/*
 * enroll user with ca
 * enroll的user需要在‘data-network/organizations/fabric-ca/registerEnroll.sh ’
 * 脚本中使用 ‘fabric-ca-client enroll ...’ 注册过
 **/


'use strict'

const FabricCaServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');
const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

const config = require('../config/config.js');

// enroll('User1', '1', 'wjy');
async function enroll(org, user, name) {
	try {
		let conpath = path.resolve(config.ORGPATH, `peerOrganizations/org${org}.gov.com/connection-org${org}.yaml`);
		let connectionProfile = yaml.load(fs.readFileSync(conpath, 'utf8'));

		// 获得用户ca身份认证
		const caInfo = connectionProfile.certificateAuthorities[`ca.org${org}.gov.com`];
		const caTLSCACerts = caInfo.tlsCACerts.pem;
		const ca = new FabricCaServices(caInfo.url, {trustedRoots: caTLSCACerts, verify: false}, caInfo.caName);

		// 创建钱包
		let walletPath = path.join(config.WALLETPATH, `org${org}/${user}`);
		const wallet = await Wallets.newFileSystemWallet(walletPath);
		console.log(`wallet path: ${walletPath}`);

		// 查看此用户是否已经注册过了
		const userExists = await wallet.get(name);
		if (userExists) {
			console.log(`An identity for the client user "${user}":"${name}" already exists in the wallet`);
            return userExists;
		}
		console.log(`enrolling "${user}":"${name}" ...`);

		// enroll the admin user
		// 这里的user需要小写
		const enrollment = await ca.enroll({
			enrollmentID: user.toLowerCase(),
			enrollmentSecret: `${user.toLowerCase()}pw`
		});

		const x509Identity = {
			credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: `Org${org}MSP`,
            type: 'X.509',
		}

		// 将用户身份信息加入到钱包中
		await wallet.put(name, x509Identity);
		console.log(`Successfully enrolled client user "${name}" and imported it into the wallet`);
		return x509Identity;

	} catch (error) {
		console.error(`Failed to enroll client user "${user}": ${error}`);
		process.exit(1);
	}

}

module.exports = enroll;

// enroll("wjy");