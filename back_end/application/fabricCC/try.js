
/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

/*
 * This application has 6 basic steps:
 * 1. Select an identity from a wallet
 * 2. Connect to network gateway
 * 3. Access PaperNet network
 * 4. Construct request to issue commercial paper
 * 5. Submit transaction
 * 6. Process response
 */

'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const { Wallets, Gateway } = require('fabric-network');

const utils = require('../utils/utils.js');
const config = require('../config/config.js');
const DataAsset = require(path.join(config.CHAINCODEPATH, 'datanet/lib/data.js'));


// Main program function
async function main() {

    // A wallet stores a collection of identities for use
    let walletPath = path.join(config.WALLETPATH, `org1/User1`);
	const wallet = await Wallets.newFileSystemWallet(walletPath);

    // A gateway defines the peers used to access Fabric networks
    const gateway = new Gateway();

    // Main try/catch block
    try {

        // Specify userName for network access
        // const userName = 'isabella.issuer@magnetocorp.com';
        const userName = 'wjy';

        // Load connection profile; will be used to locate a gateway
        
		let conpath = path.resolve(config.ORGPATH, `peerOrganizations/org1.gov.com/connection-org1.yaml`);
		let connectionProfile = yaml.load(fs.readFileSync(conpath, 'utf8'));

        // Set connection options; identity and wallet
        let connectionOptions = {
            identity: userName,
            wallet: wallet,
            discovery: { enabled:true, asLocalhost: true }
        };

        // Connect to gateway using application specified parameters
        console.log('Connect to Fabric gateway.');

        await gateway.connect(connectionProfile, connectionOptions);

        // Access PaperNet network
        console.log('Use network channel: mychannel.');

        const network = await gateway.getNetwork('datachannel');

        // Get addressability to commercial paper contract
        console.log('Use org.papernet.commercialpaper smart contract.');

        const contract = await network.getContract('cp');

        // issue commercial paper
        console.log('Submit commercial paper issue transaction.');

        // const issueResponse = await contract.submitTransaction('issue', 'MagnetoCorp', '00003', '2020-05-3', '2020-11-30', '5000000');
        // let parm = test('hhhhh', 'utf8');
        // console.log(parm);
        // let args = {['show2']};

        // console.log(args.map((arg) => Buffer.from(arg, 'utf8')));
        // console.log(test('hhhh'));
        // [['show', stringToBytes('hhhh')]]
        // await contract.submitTransaction('callCt3');
        // await contract.submitTransaction('callCt4');
        await contract.submitTransaction('callCt', 'datanet', 'show', 'hhhhh', 'datachannel');

        // process response
        // console.log('Process issue transaction response.'+issueResponse);

        // // let paper = CommercialPaper.fromBuffer(issueResponse);
        // let paper = JSON.parse(issueResponse.toString());

        // console.log(`${paper.issuer} commercial paper : ${paper.paperNumber} successfully issued for value ${paper.faceValue}`);
        console.log('Transaction complete.');

    } catch (error) {

        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);

    } finally {

        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();

    }
}
main().then(() => {

    console.log('Issue program complete.');

}).catch((e) => {

    console.log('Issue program exception.');
    console.log(e);
    console.log(e.stack);
    process.exit(-1);

});
