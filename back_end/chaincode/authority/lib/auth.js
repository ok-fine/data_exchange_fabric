'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');
const Utils = require('./utils.js');

class Authority {
	/**
     * 权限是在自己的组织中进行管理的，所以不同组织的人进入的是不同的权限列表
	 * Data(name, publisher, publish time, position)
	 *
	 */
	constructor(obj) {
        //assign拷贝 obj 的所有可枚举对象到 this 中去
		Object.assign(this, obj);
	}


    /**
     * Basic getters and setters
    */

    getAuth(data) {

    }

    setAuth(data) {

    }

    getAllAuth() {

    }




    static getDataAuth(role, data) {
        let auth = role.authlist.getAuth(data);

        return auth;

    }

    static fromBuffer(buffer) {
        return Authority.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    static deserialize(auth) {
        return State.deserializeClass(auth, Authority);
    }

    /**
     * Factory method to create a data asset object
     * @param {name) - name of function role can exacute;
     * @param {isClient) - 是否继承client的全部权限，“true”：继承、”false“：不继承，即没有任何权限
     * @param {position) - data's position in the org
     * @param {conHash) - Hash of data content, to make sure the content is correct
     */

    static createInstance() {
        return new Authority({name, creator});
    }


	static getClass(){
		return 'org.datanet.authority';
	}

}

module.exports = Authority;


