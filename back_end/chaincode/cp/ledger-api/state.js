'use strict';

class State {

	/**
     * @param {String|Object} 还不知道
     * @param {keyParts[]} 当前data的所有属性值的复合
     */
	constructor(stateClass, keyParts, isData){
		this.class = stateClass;
        //如果是DataAsset类型的话
        if(isData){
            this.key = State.makeKey(keyParts);
            this.currentState = null;
            
        }else{  //如果是index类型
            this.key = keyParts;
        }
	}


    getClass() {
        return this.class;
    }

    getKey() {
        return this.key;
    }

    //
    getSplitKey(){
        return State.splitKey(this.key);
    }

    getCurrentState(){
        return this.currentState;
    }

    /**
     * 通常在 putState()ledger API 之前使用
     * @param {Object} 一个json类型的变量
     * @return {buffer} 需要存储的data的buffer
     */
	static serialize(object) {
        // don't write the key:value passed in - we already have a real composite key, issuer and paper Number.
        delete object.key;
        return Buffer.from(JSON.stringify(object));
    }

     /**
     * Deserialize object into one of a set of supported JSON classes
     * i.e. Covert serialized data to JSON object
     * Typically used after getState() ledger API
     * @param {data} data to deserialize into JSON object
     * @param (supportedClasses) the set of classes data can be serialized to
     * @return {json} data内容的json对象
     */
    static deserialize(data, supportedClasses) {
        let json = JSON.parse(data.toString());
        let objClass = supportedClasses[json.class];
        if (!objClass) {
            throw new Error(`Unknown class of ${json.class}`);
        }
        let object = new (objClass)(json);
        return object;
    }

    /**
     * Deserialize object into specific object class
     * Typically used after getState() ledger API
     * @param {data} data to deserialize into JSON object
     * @return {json} json with the data to store
     */
    static deserializeClass(data, objClass) {
        let json = JSON.parse(data.toString());
        let object = new (objClass)(json);
        return object;
    }

    /**
     * Join the keyParts to make a unififed string
     * @param (String[]) keyParts
     */
    static makeKey(keyParts) {
        // return keyParts.map(part => JSON.stringify(part)).join(':');
        return keyParts.map(part => part).join(':');
    }

    static splitKey(key){
        return key.split(':');
    }


}

module.exports = State;
