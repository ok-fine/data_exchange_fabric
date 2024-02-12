'use strict';

const { Contract, Context} = require('fabric-contract-api');
const shim = require('fabric-shim');
const sd = require('silly-datetime');
const fs = require('fs');

// const Auth = require('./auth.js');
const AuthList = require('./authlist.js');
const Role = require('./role.js');
const RoleList = require('./rolelist');

const Utils = require('./utils');
const QueryUtils = require('./queries.js');

// shim.success('success'): eyJzdGF0dXMiOjIwMCwicGF5bG9hZCI6InN1Y2Nlc3MifQ==
// shim.error('error'): eyJzdGF0dXMiOjUwMCwibWVzc2FnZSI6ImVycm9lIn0=

/**
 * @param {dataList} (name + owner) => (position ...)
 * @param {ownerList} name => owner
 */
class RoleContext extends Context {
	constructor() {
		super();
		this.rolelist = new RoleList(this);
        console.log('Create the context successfully');
	}
}


class RoleContract extends Contract {
	constructor() {
		super('org.datanet.role');
        // this.Init();
        console.log('Create the contract successfully');
	}

    createContext() {
        return new RoleContext();
    }

    // async initAuth2(ctx, type) {
    //     console.log('function 2');

    //     if(type === '1'){
    //         console.log('function success');
    //         return shim.success('success');
    //     }
    //     console.log('function error');
    //     return shim.error('error');

    // }

    initPem(){
        let admin = {};
        let client = {};

        // admin.privatePem = fs.readFileSync('../pem/privateAdmin.pem', 'utf-8').toString();
        // admin.publicPem = fs.readFileSync('../pem/publicAdmin.pem', 'utf-8').toString();

        // client.privatePem = fs.readFileSync('../pem/privateClient.pem', 'utf-8').toString();
        // client.publicPem = fs.readFileSync('../pem/publicClient.pem', 'utf-8').toString();

        admin.privatePem = `-----BEGIN RSA PRIVATE KEY-----
MIIBOQIBAAJBAJVOan0Wh1XbDFCybqjV5oDF9uq3iwvCylGE9wf8Ow7xlgsutT6N
AvJ48+EiUthD/9WuAXU8qxQMiwi1pcvkQoMCAwEAAQJAII9dQbIsCVkfsml3IHKl
Nef2FPG57PKp1GU+ygsDhhpqTFFJdDLRvxuq6e1wxmV8HrofWwR8DAmR8mpQOL2j
IQIhAO2b46Y6jkxnDxeawnzLtSCk3aYTPYbW/BMs02mJzgWNAiEAoNzZ5NwU9f2Y
if5u1XqR1gQQqPUqXMKEN3J78h5xvE8CIATBuiz5vx+IcKToVDxrV5TvuAA7ImAw
rZs0qobSW22BAiASHo5Unw2lX7lM4eHuHe5LYw3VWjg5Vpe5/yVC8nbxNQIgDpL2
wLxeF1AfHR2CRGg2VyH1XfHIZhxp0HdIIJ8aN3M=
-----END RSA PRIVATE KEY-----`;
        admin.publicPem = `-----BEGIN RSA PUBLIC KEY-----
MEgCQQCVTmp9FodV2wxQsm6o1eaAxfbqt4sLwspRhPcH/DsO8ZYLLrU+jQLyePPh
IlLYQ//VrgF1PKsUDIsItaXL5EKDAgMBAAE=
-----END RSA PUBLIC KEY-----`;

        client.privatePem = `-----BEGIN RSA PRIVATE KEY-----
MIIBOgIBAAJBAMPT9fvu/NUVgEhjkiUnRIbCAreI25h3iFxZBJ5s46zqde5lVmYV
3GG0L22ZVZ4HkgA3z/fOKqkWIbnTFlOHubcCAwEAAQJBAKjAD/pg8JlC5P/8ZeUE
WKXzq9my4uEZKHXD9Bn9ZZkMEuReXpdU94OKR3BifM86DHIj+jBN1KoudRyI6nge
wsECIQD0XPD9pbB3X7aRvQlTWl8QqnO3f8FvqH/96u10iCFiYQIhAM0nUplNcj3h
nyKbc+mdgKTINUz7c57ELMdMl4PhmMMXAiBJXFmxHHwE6oQp7qGNF5VwsGt7DGyr
M9/xAAV3taKoIQIgPo3B6sqpjeLQ0g2SX2ZOBnChh/KYA44PlUluXaEZIksCIGnq
viMPkoneKWH8EL4J0LPuAZPXRwh3eYO3g29P+pGF
-----END RSA PRIVATE KEY-----`;
        client.publicPem = `-----BEGIN RSA PUBLIC KEY-----
MEgCQQDD0/X77vzVFYBIY5IlJ0SGwgK3iNuYd4hcWQSebOOs6nXuZVZmFdxhtC9t
mVWeB5IAN8/3ziqpFiG50xZTh7m3AgMBAAE=
-----END RSA PUBLIC KEY-----`;

        return {admin, client};
    
    }

    async initAuth(ctx) {
        console.log('function 3');

        let channel = ctx.stub.getChannelID();
        let func = await ctx.stub.invokeChaincode('dataasset', ['getFunction'], channel);
        // func { "admin": [fun, ..], "client": [fun, ...] }
        func = JSON.parse(func.payload);

        console.log("func: " + func);
        console.log("func admin: " + func.admin);
        // console.log("stringi func: " + JSON.stringify(func));
        // func = JSON.parse(JSON.stringify(func));
        // let cont = func.payload.toString();
        // console.log('cont: ' + cont);
        // console.log('json cont: ' + JSON.parse(cont));

        return func;

    }

    async initLedger(ctx){
        console.log('Init system role \'Admin\' and \'Client\'');
        // channel 的管理员

        // await this.initAuth2(ctx);

        let time = this.getTime(ctx);
        // let authlist = await this.initAuth(ctx);
        let functions = await this.initAuth(ctx);
        let pems = this.initPem();

        // org, name, isClient, description, creator, createTime
        let admin = Role.createInstance('orgS', 'Admin', false, 'A role who has the higher authprity in the channel', 'System', time);
        admin.setCreatorBytes(Utils.crypto.sha1('orgS'));

        admin.setPem(pems.admin.privatePem, pems.admin.publicPem);

        admin.setAuthList(new AuthList());
        admin.addAuth('All', Role.splitKey(functions.admin));

        // admin.addAuth('All', ['push', 'exist', 'confirm', 'update', 'searchByOwner', 
                        // 'searchByOrg', 'searchByName', 'searchAll', 'delete']);
        console.log('all admin auths' + admin.getAllAuth('All'));


        // channel 上的所有用户
        let client = Role.createInstance('orgS', 'Client', true, 'A basic role to be assigned authorities', 'System', time);
        client.setCreatorBytes(Utils.crypto.sha1('orgS'));

        client.setPem(pems.client.privatePem, pems.client.publicPem);

        client.setAuthList(new AuthList());
        client.addAuth('All', Role.splitKey(functions.client));
        // client.addAuth('All', ['exist', 'confirm']);
        console.log('all client auths' + client.getAllAuth('All'));

        await ctx.rolelist.addRole(admin);
        await ctx.rolelist.addRole(client);
    }


	async instantiate(ctx) {
        // No implementation required with this example
        // It could be where data migration is performed, if necessary
        console.log('Instantiate the contract');
    }

    /**-----------------------
     * 角色增删改查
     *-----------------------*/

    /**
     * @param {creator} 就是user
     * @param {owner} 上传的 org + user
     * @return {role} 一定要将 role 的 publicPem 保存下来
     */
    async create(ctx, name, isClient, description, privatePem, publicPem) {
        let mspid = ctx.clientIdentity.getMSPID();
        let org = mspid.substr(0, mspid.length - 3).toLowerCase();

        // user
        let id = ctx.clientIdentity.getID();
        let creator = Utils.getUserByID(id).toLowerCase();

        // 创建过的就不需要创建了
        let exist = await this.search(ctx, org, name);
        if(exist !== null){
            console.log(`The role ${name} has already exist.` );
            return false;
        }


        let createTime = this.getTime(ctx);

    	//在 Object.assign() 的时候就已经设置了这些属性了
    	let role = Role.createInstance(org, name, isClient, description, creator, createTime);
        role.setCreatorBytes(Utils.crypto.sha1(ctx.clientIdentity.getIDBytes()));
        role.setPem(privatePem, publicPem);

        // 继承client的全部权限，直接在Client中查找
        // if(isclient) {
        //     let client = this.rolelist.getRole(Role.makeKey(['System', 'Client']));
        //     role.setAuthList(client.getAuthList());
        // }else {
        //     role.setAuthList(new AuthList());
        // }

    	await ctx.rolelist.addRole(role);
        console.log('create role: ' + role);
        console.log('role: ' + role.getName());

    	return role;
    }

    async delete(ctx, org, name){
        let roleKey = Role.makeKey([org, name]);
        // 权限验证

        // 是否存在
        let role = await ctx.rolelist.getRole(roleKey);
        if(role === null){
            console.log(`Role ${name} is not exist.`);
            return false;
        }

        console.log('delete role ' + role.getName() + ' successfully.');

        await ctx.rolelist.deleteRole(roleKey);
        return true;
    }

    async update(ctx, newRole){
        let roleKey = newRole.getKey();
        // 权限验证

        // 是否存在
        let oldRole = await ctx.rolelist.getRole(roleKey);
        if(oldRole === null){
            console.log(`Role ${newRole.getName()} is not exist, we will create a new role.`);
            await ctx.rolelist.addRole(newRole);
        }else{
            await ctx.rolelist.updateRole(newRole);
        }

        return true;
    }

    /**-----------------------
     * 角色查找方法部分
     *-----------------------*/


    // 查找角色一个唯一的角色 org:name
    async search(ctx, org, name) {
        let role = await ctx.rolelist.getState(Role.makeKey([org, name]));
        console.log("role: " + role);
        return role;
    }

    // 查找组织 orh 创建的所有的角色
    async searchByOrg(ctx, org) {
        let query = new QueryUtils(ctx, Role.getClass());
        let results = await query.queryKeyByPartial(org);
        return results;
    }

    
    // 查找名字为 name 的所有角色
    async searchByName(ctx, name) {
        let query = new QueryUtils(ctx, Role.getClass());
        let results = await query.queryKeyByName(name);
        return results;
    }

    // 查找所有的角色
    async searchAll(ctx) {
        console.log('searchAll');
        let query = new QueryUtils(ctx, Role.getClass());
        let results =  await query.queryKeyByPartial();
        return results;
    }

    /**-----------------------
     * 角色权限管理方法
     *-----------------------*/

    /**
     * @param {dataKey}  name:org:user
     * @param {roleKey} org:name
     * @param {authlist} 权限函数名称的数组
     */
    async addAuth(ctx, roleKey, dataKey, authlist) {
        console.log();
        console.log('submit transaction addAuth');

        let role = await ctx.rolelist.getState(roleKey);

        if(role === null){
            console.log(`role ${roleKey} is not exist`);
            return false;
        }

        // 资源是否存在
        let channel = ctx.stub.getChannelID();
        let data = await ctx.stub.invokeChaincode('dataasset', ['isData', dataKey], channel);
        console.log(data.payload);
        console.log(data.payload.toString() === 'false');
        if(data.payload.toString() === 'false'){
            // 资源不存在
            console.log(`data ${dataKey} is not exist`);
            console.log('addAuth failed');
            return false;
        }

        console.log('authlist: ' + authlist);

        role.deserializeAuthlist();
        role.addAuth(dataKey, authlist);
        console.log("all auth: " + role.getAllAuth(dataKey));
        console.log('addAuth successfully');

        await ctx.rolelist.updateRole(role);
        return true;
    }

    async isAuth(ctx, roleKey, dataKey, authority) {
        console.log();
        console.log('submit transaction isAuth');

        let role = await ctx.rolelist.getState(roleKey);
        if(role === null){
            console.log(`role ${roleKey} is not exist`);
            return false;
        }

        role.deserializeAuthlist();
        return role.isAuth(dataKey, authority);
    }

    /**
     * @return {string[] || null} 权限函数名称的数组
     */
    async getAllAuth(ctx, roleKey, dataKey) {
        console.log();
        console.log('submit transaction getAllAuth');

        let role = await ctx.rolelist.getState(roleKey);
        if(role === null){
            console.log(`role ${roleKey} is not exist`);
            return false;
        }

        role.deserializeAuthlist();
        return role.getAllAuth(dataKey);
    }

    /**
     * @param {dataKey}  name:org:user
     * @param {roleKey} org:name
     * @param {authlist} 权限函数名称的数组
     */
    async deleteAuth(ctx, roleKey, dataKey, authlist) {
        console.log();
        console.log('submit transaction deleteAuth');

        let role = await ctx.rolelist.getState(roleKey);
        if(role === null){
            console.log(`role ${roleKey} is not exist`);
            return false;
        }

        role.deserializeAuthlist();
        let res = role.deleteAuth(dataKey, authlist);
        console.log('delete auth res; ' + res);

        if(res){
            await ctx.rolelist.updateRole(role);
        }

        return res;
    }

    /**-----------------------
     * 与data交互
     *-----------------------*/
    async delData(ctx, dataKey){
        console.log('delete data: ' + dataKey);
        let roles = await this.searchAll(ctx);
        for(var roleinfo of roles){
            console.log(roleinfo.Record.org + ':' + roleinfo.Record.name);
            var role = await ctx.rolelist.getState(roleinfo.Record.org + ':' + roleinfo.Record.name);
            role.deserializeAuthlist();
            role.delData(dataKey);
            await ctx.rolelist.updateRole(role);
        }

        // return re
    }


    /**-----------------------
     * 通用方法
     *-----------------------*/

    getTime(ctx){
        // 需要先转换成JSON字符串，再转换为JSON对象，不然他只是一个Object类
        let time = JSON.parse(JSON.stringify(ctx.stub.getTxTimestamp()));
        let ms = time.seconds * 1000 + time.nanos / 1000000;
        let date = sd.format(new Date(ms), 'YYYY-MM-DDTHH:mm:ss.000Z');
        console.log('dateTime: ' + date);
        return date
    }

    isRole(){
        return true;
    }

}

module.exports = RoleContract;

// let admin = new AuthList();
// admin.addAuth('a', 1);
// admin.addAuth('b', 2);
// console.log(admin.isAuth('c'));
// console.log(admin);
// // console.log(client);


