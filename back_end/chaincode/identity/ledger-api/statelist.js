'use strict';
const State = require('./state.js');



class Statelist {

	/**
     * State 是通过数据的属性复合来进行存储的
     * 而StateList 是将listname和state的key值复合后存储在世界状态中的
     * ctx 对象用来操作区块链的 - 世界状态
     */
	constructor(ctx, listName) {
		this.ctx = ctx;
		this.name = listName;
		this.supportedClasses = {};
	}

	/**
     * Add a state to the list. Creates a new state in worldstate with
     * appropriate composite key.  Note that state defines its own key.
     * State object is serialized before writing.
     * State(class, key, currentState);
     */
	async addState(state) {
		//键值为 listname + state.key 的复合
		let key = this.ctx.stub.createCompositeKey(this.name, state.getSplitKey());
		//内容为除了 state.key 的内容的剩下的所有属性的json序列化
		let value = State.serialize(state);
		await this.ctx.stub.putState(key, value);
	}

	/**
     * Get a state from the list using supplied keys. Form composite
     * keys to retrieve state from world state. State data is deserialized
     * into JSON object before being returned.
     */
    async getState(key) {
        let ledgerKey = this.ctx.stub.createCompositeKey(this.name, State.splitKey(key));
        let value = await this.ctx.stub.getState(ledgerKey);
        if (value && value.toString('utf8')) {
            let state = State.deserialize(value, this.supportedClasses);
            return state;
        } else {
            return null;
        }
    }

    /**
     * Update a state in the list. Puts the new state in world state with
     * appropriate composite key.  Note that state defines its own key.
     * A state is serialized before writing. Logic is very similar to
     * addState() but kept separate becuase it is semantically distinct.
     */
    async updateState(state) {
        let key = this.ctx.stub.createCompositeKey(this.name, state.getSplitKey());
        let value = State.serialize(state);
        //key 存在的话将会被新的 value 所覆盖
        await this.ctx.stub.putState(key, value);
    }

    async deleteState(key) {
        let ledgerKey = this.ctx.stub.createCompositeKey(this.name, State.splitKey(key));
        await this.ctx.stub.deleteState(ledgerKey);
    }

    /** Stores the class for future deserialization */
    use(stateClass) {
        this.supportedClasses[stateClass.getClass()] = stateClass;
    }

}

module.exports = Statelist;

