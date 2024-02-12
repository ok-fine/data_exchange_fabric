'use strict';

// Utility class for ledger state
const AuthList = require('./authlist.js');
const State = require('./../ledger-api/state.js');
const Utils = require('./utils.js');

class Role extends State {
	/**
     * 权限是在自己的组织中进行管理的，所以不同组织的人进入的是不同的权限列表
	 * Data(name, publisher, publish time, position)
	 *
	 */
	constructor(obj) {
		// super(stateClass, keyParts)
		super('org.datanet.role', [obj.org, obj.name]);
        this.authlist = new AuthList();

		//assign拷贝 obj 的所有可枚举对象到 this 中去
		Object.assign(this, obj);
	}

    deserializeAuthlist(){
        this.authlist = AuthList.deserializeClass(this.authlist)
        // let json = JSON.parse(JSON.stringify(this.authlist));
        // console.log('json: ');
        // this.authlist = new (AuthList)(json);
        console.log(this.authlist);
    }

    /**
     * Basic getters and setters
    */

    getKey() {
        return State.makeKey([this.org, this.name]);
    }

    getName() {
    	return this.name;
    }

    // setName(name) {
    // 	this.name = name;
    // }

    getDescription() {
    	return this.description;
    }

    setDescription(description) {
    	this.description = description;
    }

    getCreator(){
    	return this.creator;
    }

    isCreator(creatorBytes){
    	return (this.creatorBytes === creatorBytes);
    }

    setCreatorBytes(creatorBytes){
    	this.creatorBytes = creatorBytes;
    }

    getPublicPem() {
        return this.publicPem;
    }

    setPem(privatePem, publicPem){
        this.privatePem = privatePem;
        this.publicPem = publicPem
    }

    /*
     * 权限管理部分函数
     */

    isClient(){
        if(this.isClient){
            return true;
        }

        return false;
    }

    addAuth(dataKey, auth) {
        if(typeof(auth) !== 'string'){
            auth = State.makeKey(auth);
        }

        console.log('role addAuth: ' + auth);

        // this.deserializeAuthlist();
        this.authlist.addAuth(dataKey, auth);
    }

    isAuth(dataKey, auth) {
        let res = this.authlist.isAuth(dataKey, auth);
        console.log('isAuth res: ' + res);

        console.log('private pem: ' + this.privatePem);

        let enres = Utils.encryptPriRSA(this.privatePem, res.toString());
        console.log('encrypto res: ' + enres);

        return enres;

        // return this.authlist.isAuth(dataKey, auth);
    }

    getAllAuth(dataKey) {
        return this.authlist.getAllAuth(dataKey);
    }

    deleteAuth(dataKey, auth) {
        if(typeof(auth) !== 'string'){
            auth = State.makeKey(auth);
        }
        return this.authlist.deleteAuth(dataKey, auth);
    }

    delData(dataKey){
        this.authlist.delData(dataKey);
    }

    getAuthList() {
        this.deserializeAuthlist();
    	return this.authlist;
    }

    setAuthList(authlist) {
    	this.authlist = authlist;
    }


    /**
     * static function
     */

    static fromBuffer(buffer) {
        return Role.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    static deserialize(auth) {
        return State.deserializeClass(auth, Role);
    }

    /**
     * Factory method to create a data asset object
     * @param {name) - name of authority[role name]
     * @param {isClient) - 是否继承client的全部权限，“true”：继承、”false“：不继承，即没有任何权限
     * org, name, isClient, description, creator, createTime
     */

    static createInstance(org, name, isClient, description, creator, createTime) {
        // let pem = State.createRSA();
        // // let privatePem = pem.privatePem;
        // // let publicPem = pem.publicPem;

        // let privatePem = 'pem.privatePem';
        // let publicPem = 'pem.publicPem';
        return new Role({org, name, isClient, description, creator, createTime});
    }


	static getClass(){
		return 'org.datanet.role';
	}

}

module.exports = Role;

// const func = [ 'push', 'exist', 'confirm', 'update', 
//             'searchByOwner', 'searchByOrg', 'delete' ];

// let a = Role.createInstance('System', 'Admin', false, 'A role who has the higher authprity in the channel', 'System', new Date());

// // console.log(Buffer.from(JSON.stringify(a)));

// a.addAuth('data1:org1:user1', func);

// // a.authlist = JSON.stringify(a.authlist);
// console.log('try: ' + a.authlist);
// a.deserializeAuthlist();

// a.addAuth('data3:org1:user1', func);
// console.log(a.isAuth('data1:org1:user1', 'delete'));

// // a.deleteAuth('data1:org1:user1', func);

// console.log(a.getAllAuth('data1:org1:user1'));
// console.log(JSON.stringify(a.authlist));





