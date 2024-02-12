'use strict';

const StateList = require('./../ledger-api/statelist.js');
const DataAsset = require('./data.js');
// const Index = require('./index.js');

class DataList extends StateList {

	// context(stub)
	// StateList(ctx, listName)
	constructor(ctx){
		super(ctx, 'org.datanet.dataasset');
		this.use(DataAsset);
	}

	//操作
	async addData(data) {
        return this.addState(data);
    }

    async getData(dataKey) {
        return this.getState(dataKey);
    }

    async updateData(data) {
        return this.updateState(data);
    }

    async deleteData(dataKey) {
        return this.deleteState(dataKey);
    }

}

module.exports = DataList;
// module.exports.IndexList = IndexList;

