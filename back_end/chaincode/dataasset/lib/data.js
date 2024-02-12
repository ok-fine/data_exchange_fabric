'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');
const Utils = require('./utils.js');


// 不一定需要
//enumerate data state values
const dataState = {
	PUSHED: 1,
	CHECK: 2,
	UPDATE: 3,
	OVERDUE: 4
}

class DataAsset extends State {
	/**
	 * Data(name, publisher, publish time, position)
	 *
	 */
	constructor(obj) {
		// super(stateClass, keyParts)
		super(DataAsset.getClass(), [obj.name, obj.owner], true);

		//assign拷贝 obj 的所有可枚举对象到 this 中去
		Object.assign(this, obj);
	}


    /**
     * Basic getters and setters
    */

    getKey(){
        return State.makeKey(this.name, this.owner);
    }

    getOwnerMSP() {
        return this.mspid;
    }

    setOwnerMSP(mspid) {
        this.mspid = mspid;
    }

    getName() {
    	return this.name;
    }

    setName(newName) {
    	this.name = newName;
    }

    //上传的user
    getPublisher() {
        return this.publisher;
    }

    setPublisher(newPublisher) {
        this.publisher = newPublisher;
    }

    gerPublishTime(){
        return this.publishTime;
    }

    getLastChange(){
        return this.lastChange;
    }

    setLastChange(user, time){
        this.lastChange = DataAsset.makeKey([user, time]);
        
    }

    getType() {
        return this.type;
    }

    setType(type) {
        this.type = type;
    }

    isPosition(position) {
        let posHash = DataAsset.getPosHash(this.owner, position);
        return this.posHash === posHash;
    }

    getPositon(){
        return this.position;
    }

    setPosition(position) {
        this.position = position;
        this.posHash = DataAsset.getPosHash(this.owner, position);
    }


    isContHash(contHash) {
        return this.contHash === contHash;
    }

    setContHash(contHash) {
        this.contHash = contHash;
    }


    /**
     * Useful methods to encapsulate data asset states
     */

    setPushed() {
    	this.currentState = dataState.PUSHED;
    }

    setCheck() {
     	this.currentState = dataState.CHECK;
    }

    setUpdate() {
     	this.currentState = dataState.UPDATE;
    }

    setOverdue() {
     	this.currentState = dataState.OVERDUE;
    }

    isPushed() {
    	return this.currentState === dataState.PUSHED;
    }

    isCheck() {
     	return this.currentState === dataState.CHECK;
    }

    isUpdate() {
     	return this.currentState === dataState.UPDATE;
    }

    isOverdue() {
     	return this.currentState === dataState.OVERDUE;
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
     * @param {owner) - org:user who own the  data
     * @param {publisher) - 谁上传的
     * @param {position) - data's position in the org
     * @param {conHash) - Hash of data content, to make sure the content is correct
     */

    static createInstance(name, owner, publisher, publishTime, type, position, contHash) {
    	let posHash = DataAsset.getPosHash(owner, position);
        let lastChange = DataAsset.makeKey([owner, publishTime]);
        return new DataAsset({name, owner, publisher, publishTime, position, type, posHash, contHash, lastChange});
    }

    static getPosHash(owner, position){
        return Utils.crypto.sha256(owner + position);
    }


	static getClass(){
		return 'org.datanet.dataasset';
	}

}

module.exports = DataAsset;

// let a = 'org1:user1';
// let b = '/1/2/3';

// console.log(DataAsset.getPosHash(a, b));
// // 41eda123a16bcef1b9e3ec0ee070bbff5372d4362071d220365bdd5f30461c39


