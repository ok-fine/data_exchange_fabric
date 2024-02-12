'use strict';

const StateList = require('./../ledger-api/statelist.js');
const Role = require('./role.js');

class RoleList extends StateList {

	// context(stub)
	// StateList(ctx, listName)
	constructor(ctx){
		super(ctx, 'org.datanet.role');
		this.use(Role);
	}

	//操作
	async addRole(role) {
        return this.addState(role);
    }

    async getRole(roleKey) {
        return this.getState(roleKey);
    }

    async updateRole(role) {
        return this.updateState(role);
    }

    async deleteRole(roleKey) {
        return this.deleteState(roleKey);
    }

}

module.exports = RoleList;

