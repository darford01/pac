var tokenManager = require('../config/token_manager');
var secret = require('../config/secret');
var jwt = require('jsonwebtoken');
var db = require('../config/mongo_database');

exports.getUserId = function(headers) {
	var userid = 0;
	// check header or url parameters or post parameters for token
	var token = tokenManager.getUserToken(headers);
	jwt.verify(token, secret.secretToken, function(err, decoded) {
		userid = decoded.userid;
	});
	
	return userid;
}

exports.userIsAdmin = function(userID, callback) {
	var query = db.userModel.findOne({_id:userID});
	query.exec(function(err, result) {
		if (err) {
			console.log(err);
		}

		if (result != null) {
			callback(result.is_admin);
		}
	});
	
	//callback(random_data);
}