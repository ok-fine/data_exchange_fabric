'use strict';

const StateList = require('./../ledger-api/statelist.js');
const Identity = require('./identity.js');
const Index = require('./index.js');

class IdentityList extends StateList {

	// context(stub)
	// StateList(ctx, listName)
	constructor(ctx){
		super(ctx, 'org.datanet.identity');
		this.use(Identity);
	}

	//操作
	async addIdentity(identity) {
        return this.addState(identity);
    }

    async getIdentity(identityKey) {
        return this.getState(identityKey);
    }

    async updateIdentity(identity) {
        return this.updateState(identity);
    }

    async deleteIdentity(identityKey) {
        return this.deleteState(identityKey);
    }

}
module.exports = IdentityList;

