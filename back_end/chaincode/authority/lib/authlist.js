'use strict';

const State = require('./../ledger-api/state.js');
const HashMap = require('hashmap');

// 不参与世界状态，与role捆绑在一个key-value中
// hashmap: datakey - makeKey([auth, ...]);
class AuthList{

	// context(stub)
	// StateList(ctx, listName)
	constructor(obj){
		this.authmap = new HashMap();
		// Object.assign(this, obj);
	}

	// 操作
	/**
     * @param {auth} 权限函数名称的数组 makeKey 之后的字符串
     * like："fun1:fun2...."
     */
	addAuth(dataKey, auth) {
		let auths = State.splitKey(auth);

		let authlist = this.authmap.get(dataKey);

		console.log('add Auth----');
		console.log('dataKey: ' + dataKey);
		console.log('authlist: ' + authlist);

		if(authlist === undefined) {
    		authlist = [];
    	}

    	for(var authority of auths ){
    		// console.log('do for authority: ' + authority);
    		if(authlist.findIndex(item => item === authority) !== -1) {
	    		console.log("Authority " + authority + " has already exist in data " + dataKey);
	    		continue;
	    	}

	    	authlist.push(authority);

    	}
		this.authmap.set(dataKey, authlist);
		console.log('after add auth map: ' + JSON.stringify(this.authmap));
    }

    isAuth(dataKey, auth) {
    	let authlist = this.authmap.get(dataKey);
    	console.log('authlist.isauth: ' + authlist);
    	console.log('dataKey: ' + dataKey);
    	console.log('authority: ' + auth);
    	// 没有数据，或者没有数据权限
    	if(authlist === undefined || authlist.findIndex(item => item === auth) === -1) {
    		return false;
    	}
    	return true;
    }

    /**
     * @return {string[]} [fun1, fun2, ....]
     */
    getAllAuth(dataKey){  
    	// let authlist = [];
    	// for(var pair of this.authmap){
    	// 	authlist.push(pair.key);
    	// }

    	let authlist = this.authmap.get(dataKey);
    	if(authlist === undefined){
    		return null;
    	}

    	return authlist;
    }

    /**
     * @param {auth} 权限函数名称的数组 makeKey 之后的字符串
     * like："fun1:fun2...."
     */
    deleteAuth(dataKey, auth) {
    	let auths = State.splitKey(auth);

        let authlist = this.authmap.get(dataKey);
        if(authlist === undefined) {
    		console.log('data ' + dataKey + 'is not exist');
    		return false;
    	}

    	for(var authority of auths) {
    		var index = authlist.findIndex(item => item === authority);
	    	if(index !== -1) {
	    		authlist.splice(index, 1);
	    	}
    	}

    	if(authlist.length === 0){
    		this.authmap.delete(dataKey);
    	} else {
    		this.authmap.set(dataKey, authlist);
    	}

	    return true;
    }

    delData(dataKey){
    	this.authmap.delete(dataKey);
    }

    static deserializeClass(authlist) {
        let json = JSON.parse(JSON.stringify(authlist));
        console.log('deserializeClass json: ' + JSON.stringify(authlist));
        let object = new AuthList();
        object.authmap = new HashMap(json.authmap);
        return object;
    }

}

module.exports = AuthList;


 