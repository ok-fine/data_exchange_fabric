const mysql = require('mysql');

var pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: 'game123456',
    database: 'dataExchange'
});

module.exports={
	query: function(sql, values){
	// 返回一个 Promise
		try{
			return new Promise((resolve, reject) => {
				pool.getConnection(function(err, connection) {
					if(err) {
						console.log(err);
			        	reject(err);
			        }else{
			        	connection.query(sql, values, (err, data) => {
					        if(err) {
					        	console.log(err);
					        	reject(err);
					        }else{
					        	resolve(data);
					        }
					        connection.release();
				      	});
			        }
			    });
	    	});
		}catch(err){
			console.log(err);
			return err;
		}
  	}
}



