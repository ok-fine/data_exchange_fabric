'use strict';

const { Contract, Context} = require('fabric-contract-api');
const shim = require('fabric-shim');
const sd = require('silly-datetime');

// const Index = require('./index.js');

const DataAsset = require('./data.js');
const Utils = require('./utils.js');
const State = require('./../ledger-api/state.js');
const DataList = require('./datalist');
const QueryUtils = require('./queries.js');


/**
 * @param {dataList} (name + owner) => (position ...)
 * @param {ownerList} name => owner
 */
class DataAssetContext extends Context {
	constructor() {
		super();
		this.datalist = new DataList(this);
		// this.indexlist = new IndexList(this);
        console.log('Create the context successfully');
	}

    async show(){
        console.log('datalist:' + this.datalist.name);
        // console.log('indexlist:' + this.indexlist.name);
    }

	// constructor(listName) {
	// 	// context(stub, clientIdentify)
	// 	super();
	// 	this.dataList = new DataList(this, listName);
	// }
}


class DataAssetContract extends Contract {
	constructor() {
		super('org.datanet.dataasset');
        console.log('Create the contract successfully');
	}

    createContext() {
        return new DataAssetContext();
    }

    show(ctx, cont){
        console.log('show content is: ' + cont);

        const time = ctx.stub.getTxTimestamp();
        console.log(`time type: ${typeof(time)}`);
        console.log(`time: ${JSON.stringify(time)}`);

        const cid = ctx.clientIdentity;
        console.log(cid.getIDBytes());

    }

    show2(ctx){
        console.log('this is show2');
        const creator = ctx.stub.getCreator();
        console.log(`create type: ${typeof(creator)}`);
        console.log(`create: ${JSON.stringify(creator)}`);

        // const channel = ctx.stub.getChannelID();
        // console.log(`channel: ${channel}`);

        // const bind = ctx.stub.getBinding();
        // console.log(`bind: ${bind}`);

        const id = ctx.clientIdentity.getID();
        console.log('id: ' + id);

        const idb = ctx.clientIdentity.getIDBytes();
        console.log('idb: ' + idb);

        const msp = ctx.clientIdentity.getMSPID();
        console.log('msp: ' + msp);

        const res =  ctx.clientIdentity.assertAttributeValue("id", id);
        console.log('res: ' + res);

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
     * @param {name} dataname
     * @param {publisher} 上传的user的身份信息
     * @param {owner} 上传的 org + user
     */
    async push(ctx, name, type, position, contHash) {
        // let publishTime = new Date();  // 链码中不允许出现随机数、Date() 等变量，如果需要请在服务器中进行

        // 验证属性的正确性

        // // 1. 拥有权限的人才可以上传
        // //    不能上传已经存在的数据，需要用updata来更改已经上传了的数据
        // let channelName = ctx.stub.getChannelID();
        // let res = ctx.stub.invokeChaincode('authority',['show', 'hhhhh'], channelName};
        // console.log('res type is: ' + typeof(res));
        // if (res === 'false'){
        //     console.log('you do not have the authority to push a new data asset');
        //     return null;
        // }

        // 2. 只有两种类型 type{ file, data}，单独的一份文件file，或者是文件下的一条数据
        if(type !== 'file' && type !== 'data'){
            console.log('Please input a correct data asset type like \'file\' or \'data\'! ');
            return 'null';
        }

        let publishTime = this.getTime(ctx);
        let clientInfo = this.getClientInfo(ctx);
        let owner = DataAsset.makeKey([clientInfo.org, clientInfo.user]);
        
        let dataKey = DataAsset.makeKey([name, owner]);
        let d = await ctx.datalist.getData(dataKey);
        console.log('data: ' + d);

        if(d !== null){
            console.log(name + ':'+ owner +' - 已存在');
            return false;
        }


        // hash(org + user + name)
        let publisher =  Utils.crypto.sha1(ctx.clientIdentity.getIDBytes());


    	//在 Object.assign() 的时候就已经设置了这些属性了
    	let data = DataAsset.createInstance(name, owner, publisher, publishTime, type, position, contHash);
    	// let index = Index.createIndex(name, DataAsset.makeKey([org, user]));

    	// 将data的状态置为pushed 
    	data.setPushed();
    	data.setOwnerMSP(clientInfo.mspid);

    	await ctx.datalist.addData(data);
    	// await ctx.indexlist.addIndex(index);

        // 给system和client添加权限

    	return data;
    }

    /**
     * @param {params} string[] 里面放需要查询的参数：org，user
     * @param {name} data name 
     */
    async exist(ctx, name, params) {
        console.log(params);
        // console.log(params.length);

        let query = new QueryUtils(ctx, DataAsset.getClass());
        let data = null;
    	//如果只有姓名的话，需要查找出owner是谁
    	if (params.length === 0) {
            // let owner = await ctx.indexlist.getIndex(name);
            // if(owner === null) return false;

            data = await query.queryKeyByPartial(name);

        }else {
            let dataKey = DataAsset.makeKey([name, params.toLowerCase()]);
            console.log('dataKey: ' + dataKey);
            data = await query.queryKeyByPartial(dataKey);
        }

        console.log('data: ' + data);

        console.log('type: ' + typeof(data));
        console.log('data[0]: ' + data[0]);

    	return data;
    }


    // 此步骤需要得请求前置机节点，查看内容是否符合要求
    // null - 不存在，false - 不正确，true - 正确
    async confirm(ctx, name, owner, position, contHash) {
    	let dataKey = DataAsset.makeKey([name, owner.toLowerCase()]);
        // let data = DataAsset.fromBuffer(await this.exist(ctx, name, owner));
        let data = await ctx.datalist.getData(dataKey);
        console.log('data: ' + data);

        if(data === null){
            // console.log(name + ':'+ owner +' - 不存在');
            return 'null';
        }

        console.log('cont:' + data.isContHash(contHash));
        console.log('pos:' + data.isPosition(position));

        if(data.isContHash(contHash) && data.isPosition(position)){
            return true;
        }

    	return false;
    }

    /**
     * 下面的链码功能需要验证权限，
     */

    async update(ctx, roleKey, publicPem, dataKey, type, position, contHash){
        let res = await this.canDo(ctx, roleKey, dataKey, 'update', publicPem);

        if(!res){
            return false;
        }

        let clientInfo = this.getClientInfo(ctx);
        let owner = DataAsset.makeKey([clientInfo.org, clientInfo.user]);
        // let dataKey = DataAsset.makeKey([name, owner]);
        // let data = DataAsset.fromBuffer(await this.exist(ctx, name, owner));

        let data = await ctx.datalist.getData(dataKey);
        if(data === null){
            return false;
        }

        data.setLastChange(owner, this.getTime(ctx).toString());
        data.setType(type);
        data.setPosition(position);
        data.setContHash(contHash);

        let res = await ctx.datalist.updateData(data);

        return data;

    }

    // 查找 org:user 下的所有DataAsset
    async searchByOwner(ctx, roleKey, publicPem, org, user) {


        let query = new QueryUtils(ctx, DataAsset.getClass());
        let selector = {
            owner: DataAsset.makeKey([org, user]).toLowerCase()
        }
        let data = query.queryKeyByValues(selector);

        let res = [];

        for(var d of data){
            if(await this.canDo(ctx, roleKey, d.Key, 'searchByOwner', publicPem)){
                res.push(d);
            }
        }

        return res;
    }

    // 查找org下的所有 DataAsset
    async searchByOrg(ctx, roleKey, publicPem, org) {
        let query = new QueryUtils(ctx, DataAsset.getClass());
        let selector = {
            // owner: DataAsset,
            mspid: `Org${org}MSP`
        }
        let data = query.queryKeyByValues(selector);

        let res = [];

        for(var d of data){
            if(await this.canDo(ctx, roleKey, d.Key, 'searchByOrgr', publicPem)){
                res.push(d);
            }
        }

        return res;
    }

    // 查找所有链上所有名称为 name 的数据
    async searchByName(ctx, roleKey, publicPem, name) {
        let query = new QueryUtils(ctx, DataAsset.getClass());
        let data = await query.queryKeyByPartial(name);

        let res = [];

        for(var d of data){
            if(await this.canDo(ctx, roleKey, d.Key, 'searchByName', publicPem)){
                res.push(d);
            }
        }

        return res;
    }


    // 查找所有链上数据
    async searchAll(ctx, roleKey, publicPem) {
        let query = new QueryUtils(ctx, DataAsset.getClass());
        let data = await query.queryKeyByPartial();
        let res = [];

        for(var d of data){
            if(await this.canDo(ctx, roleKey, d.Key, 'searchAll', publicPem)){
                res.push(d);
            }
        }

        return res;
    }


    async delete(ctx, roleKey, dataKey, publicPem){
        // 权限管理，只有自己上传的才可以删除和修改
        // let clientInfo = this.getClientInfo(ctx);
        // let dataKey = DataAsset.makeKey([name, clientInfo.org, clientInfo.user]);
        let res = await this.canDo(ctx, roleKey, dataKey, 'delete', publicPem);
        console.log('cando res: ' + res);
        if(!res){
            // console.log();
            return false;
        }

        let data = await ctx.datalist.getData(dataKey);

        if(data === null){
            console.log('data \'' + dataKey + '\' is not exist');
            return 'null';
        }

        // // 验证是否是自己的数据 
        // if(Utils.crypto.sha1(ctx.clientIdentity.getIDBytes()) !== data.getPublisher()){
        //     console.log('you don\'t have authority to delete');
        //     return false;
        // }

        await ctx.datalist.deleteData(dataKey);

        // 删除role里面的dataKey
        let channel = ctx.stub.getChannelID();
        await ctx.stub.invokeChaincode('authority', ['delData', dataKey], channel);

        return true;

    }

    /*
     *  工具部分，用于验证身份
     */

    // 用户提供的角色 roleKey 可以对数据 dataKey 执行func 操作吗
    // 或者是自己，即owner（org user）相同即可
    async canDo(ctx, roleKey, dataKey, func, publicPem){
        let channel = ctx.stub.getChannelID();
        let resCrypto = await ctx.stub.invokeChaincode('authority', ['isAuth', roleKey, dataKey, func], channel);
        console.log('resCrypto: ' + resCrypto.payload);
        let res = Utils.decryptPubRSA(publicPem, resCrypto.payload.toString());
        console.log('res: ' + res); 

        if(res.toString() === 'true'){
            console.log(`角色 ${roleKey} 可以对数据 ${dataKey} 进行操作 ${func}`);
            return true;
        
        }else if(res.toString() === 'false'){
            console.log(`角色 ${roleKey} 没有对数据 ${dataKey} 进行操作 ${func} 的权限`);
        
        }else{
            console.log(`用户并不具有角色 ${roleKey} 的权限  -->  pubPem 错误`);
        }

        return false;
    }

    async isData(ctx, dataKey){
        let res = await ctx.datalist.getData(dataKey);
        if(res === null){
            console.log(`data ${dataKey} is not exist`);
            return false;
        }

        return true;
    }

    getClientInfo(ctx) {
        let mspid = ctx.clientIdentity.getMSPID();
        let org = mspid.substr(0, mspid.length - 3).toLowerCase();

        // user
        let id = ctx.clientIdentity.getID();
        let user = Utils.getUserByID(id).toLowerCase();

        return {
            mspid,
            org,
            id,
            user
        }
    }

    getTime(ctx){
        // 需要先转换成JSON字符串，再转换为JSON对象，不然他只是一个Object类
        let time = JSON.parse(JSON.stringify(ctx.stub.getTxTimestamp()));
        let ms = time.seconds * 1000 + time.nanos / 1000000;
        let date = sd.format(new Date(ms), 'YYYY-MM-DDTHH:mm:ss.000Z');
        console.log('dateTime: ' + date);
        return date
    }

    async getFunctions(ctx){
        let client = ['exist', 'confirm'];
        let admin = ['push', 'exist', 'confirm', 'update',
                        'searchByOwner', 'searchByOrg', 'delete'];

        return {client, admin};
    }

    // 真正使用到的
    async getFunction(ctx){
        let client = DataAsset.makeKey(['push', 'exist', 'confirm']);
        let admin = DataAsset.makeKey(['push', 'exist', 'confirm', 'update', 'delete',
                        'searchByOwner', 'searchByOrg', 'searchByName', 'searchAll']);
        return { admin, client };
    }

    async getFunction2(ctx, type) {
        console.log('function 2');

        if(type === '1'){
            console.log('function success');
            return shim.success('success');
        }
        console.log('function error');
        return shim.error('error');

    }

    async callRole(ctx){
        let channel = ctx.stub.getChannelID();
        let res1 = await ctx.stub.invokeChaincode('authority', ['initAuth2', '1'], channel);
        console.log("payload 1: " + res1.payload);
        console.log(JSON.stringify(res1));

        let res = await ctx.stub.invokeChaincode('authority', ['initAuth2', '2'], channel);
        console.log("payload 2: " + res.payload);
        console.log(JSON.stringify(res));

        return 'success';

    }

}

module.exports = DataAssetContract;

// let a = shim.Shim;
// console.log(a.success('asd'));
// console.log(shim.success('asd'));
// console.log(a.error('asd'));
// console.log(shim.error('asd'));

// console.log(shim.OK);

