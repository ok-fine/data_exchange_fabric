'use strict';

const path = require('path');

// 配置属性
module.exports = {
	// fabric 框架的配置
	'CHANNEL': 'datachannel',
	'CONTRACT': ['dataasset', 'authority'],
	'ORG': '2',
	'USER': 'User1',
	'PORT': 8082,

	// 路径配置
	'WALLETPATH': path.join(__dirname, '..//wallet'),  // 身份钱包存放路径
	'NETPATH': path.join(__dirname, '../../data-network'),  // fabric网络配置文件位置
	'ORGPATH': path.join(__dirname, '../../data-network/organizations'),  // 组织成员ca等证件位置
	'CHAINCODEPATH': path.join(__dirname, '../../chaincode'),  // 原始链码存放路径
	'PEM': path.join(__dirname, '../../chaincode/authority/pem'),  // 默认角色 Client 和 Admin 存放路径
	'ROLEPEM': path.join(__dirname, '../rolepem'),
	'DATAPATH': path.join(__dirname, '../'), // 基础位置application

	// 应用程序配置
	// 'ORG1DATA': path.join(__dirname, '../dataasset/公安局'),
	// 'ORG2DATA': path.join(__dirname, '../dataasset/工商局'),
	// 'ORG3DATA': path.join(__dirname, '../dataasset/税务局')

	'ORG1DATA': 'dataasset/公安局',
	'ORG2DATA': 'dataasset/工商局',
	'ORG3DATA': 'dataasset/税务局',



}

// console.log(path.resolve(__dirname, '../data-network/organizations'));
