'use strict';
const HashMap = require('hashmap');


class User {
	// id, name, pwd, email, org, user, wallet, roles, type
	constructor(obj){
		Object.assign(this, obj);
	}

	getRolePem(role){
		return this.roles[role];
	}


	static createInstance(id, name, pwd, email, org, user, wallet, roles, type){
		// walle
		if(typeof(wallet) === 'string'){
			wallet = JSON.parse(wallet);
		}

		if(typeof(roles) === 'string'){
			roles = JSON.parse(roles);
		}

		return new User({id, name, pwd, email, org, user, wallet, roles, type});
	}

}


// let a = {
// 	'a': 1,
// 	'b': 2,
// 	'c': 3
// }

// let b = new HashMap(a);
// b.set('a', 1);
// console.log(a['s']);
