'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');
const Utils = require('./utils.js');


class Identity extends State {
	/**
	 * Data(name, publisher, publish time, position)
	 *
	 */
	constructor(obj) {
		// super(stateClass, keyParts)
		super(Identity.getClass(), [obj.mspid, obj.user, obj.name]);

		//assign拷贝 obj 的所有可枚举对象到 this 中去
        // name, org, user, password, rolelist, createTime
		Object.assign(this, obj);
	}


    /**
     * Basic getters and setters
    */

    getName() {
    	return this.name;
    }

    setName(newName) {
    	this.name = newName;
    }

    getOwnerMSP() {
    	return this.mspid;
    }

    setOwnerMSP(mspid) {
        this.mspid = mspid;
    }

    getUser() {
        return this.user;
    }

    setUser(user) {
        this.user = user;
    }


    isPassword(password) {
        return this.password === password;
    }

    setPassword(password) {
        this.password = password;
    }

    getRolelist() {
        return this.rolelist;
    }

    setRolelist(rolelist) {
        this.rolelist = rolelist;
    }


    static fromBuffer(buffer) {
        return DataAsset.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    static deserialize(data) {
        return State.deserializeClass(data, DataAsset);
    }

    /**
     * Factory method to create a data asset object
     * @param {name) - name of data
     * @param {owner) - org whuch own the  data
     * @param {position) - data's position in the org
     * @param {conHash) - Hash of data content, to make sure the content is correct
     */

    static createInstance(name, mspid, user, password, rolelist, createTime) {
        return new DataAsset({name, mspid, user, password, rolelist, createTime});
    }


	static getClass(){
		return 'org.datanet.identity';
	}

}

module.exports = Identity;


