var tokenManager = require('../config/token_manager');
var secret = require('../config/secret');
var jwt = require('jsonwebtoken');

exports.getUserId = function(headers) {
	var userid = 0;
	// check header or url parameters or post parameters for token
	var token = tokenManager.getUserToken(headers);
	jwt.verify(token, secret.secretToken, function(err, decoded) {
		userid = decoded.userid;
	});
	
	return userid;
}
