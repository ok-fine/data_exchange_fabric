/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';

const cpcontract = require('./lib/datacontract.js');
// const Context = cpcontract.context;
module.exports.contracts = [cpcontract];

// async function main() {
// 	const context = new Context();
// 	const contract = new cpcontract();
// 	// contract.show();
// 	// contract.push(context, '1', 'User1', 'wjy', 'data1')
// 	const data = contract.push(context, '1:User1:wjy', 'data1', 'org1', '123', '/1/2/3', 'hahahahhahahahaha');
// 	console.log(data);
// 	// console.log(data.toBuffer());

// }


// main();
