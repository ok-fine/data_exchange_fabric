'use strict';

const { Contract, Context} = require('fabric-contract-api');
// const sd = require('silly-datetime');

const Identity = require('./identity.js');
const IdentityList = require('./identitylist');
// const QueryUtils = require('./queries.js');


/**
 * @param {dataList} (name + owner) => (position ...)
 * @param {ownerList} name => owner
 */
class DataAssetContext extends Context {
	constructor() {
		super();
		this.identitylist = new IdentityList();
        console.log('Create the context successfully');
	}

}


class DataAssetContract extends Contract {
	constructor() {
		super('org.datanet.identity');
        console.log('Create the contract successfully');
	}

    createContext() {
        return new DataAssetContext();
    }


	async instantiate(ctx) {
        // No implementation required with this example
        // It could be where data migration is performed, if necessary
        console.log('Instantiate the contract');
    }

    /**
     * 所有人都可以使用的链码功能
     */

    /**
     * @param {publisher} 上传的user的身份信息
     * @param {owner} 上传的 org + user
     */
    async push(ctx, name, owner, publisher, publishTime, position, contHash) {
        // let publishTime = new Date();  // 链码中不允许出现随机数、Date() 等变量，如果需要请在服务器中进行

    	//在 Object.assign() 的时候就已经设置了这些属性了
    	let data = DataAsset.createInstance(name, owner, publisher, publishTime, position, contHash);
    	let index = Index.createIndex(name, owner);

    	// 将data的状态置为pushed 
    	data.setPushed();

    	let mspid = ctx.clientIdentity.getMSPID();
    	data.setOwnerMSP(mspid);

    	// data.setPublisher(publisher);

    	await ctx.dataList.addData(data);
    	await ctx.indexList.addIndex(index);

    	return data;
    }


    async exist(ctx, name, owner) {
    	//如果只有姓名的话，需要查找出owner是谁
    	if (arguments.length === 2) {
            let owner = await ctx.indexList.getIndex(name);
            if(owner === null) return false;
        }

        let datakey = DataAsset.makeKey([name, owner]);
    	let data = await ctx.dataList.getData(datakey);

    	return data;
    }


    // 此步骤需要得请求前置机节点，查看内容是否符合要求
    // null - 不存在，false - 不正确，true - 正确
    async confirm(ctx, name, owner, contHash) {
    	let datakey = DataAsset.makeKey([name, owner]);
        // let data = DataAsset.fromBuffer(await this.exist(ctx, name, owner));
        let data = await ctx.dataList.getData(datakey);

        if(data === null){
            // console.log(name + ':'+ owner +' - 不存在');
            return 'null';
        }

        if(contHash === data.getContHash()){
            return true;
        }

    	return false;
    }


    /**
     * 只能对自己发布的数据进行更改
     */

    // async updatePos() {

    // }

    // // 
    // async updateCont() {

    // }

    // async delete() {

    // }


}
// }

module.exports = IdentityContract;
// module.exports.context = DataAssetContext;


