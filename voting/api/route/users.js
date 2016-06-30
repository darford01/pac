var db = require('../config/mongo_database');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var secret = require('../config/secret');
var redisClient = require('../config/redis_database').redisClient;
var tokenManager = require('../config/token_manager');
var wsStatistik = require('./wsCalls');
var userInfo = require('./userinfo');
var async = require('async');


exports.signin = function(req, res) {
	wsStatistik.wsCalls('signin');
	var username = req.body.username || '';
	var password = req.body.password || '';
	
	if (username == '' || password == '') { 
		return res.send(401); 
	}

	db.userModel.findOne({username: username}, function (err, user) {
		if (err) {
			console.log(err);
			return res.send(401);
		}

		if (user == undefined) {
			return res.send(401);
		}
		
		user.comparePassword(password, function(isMatch) {
			if (!isMatch) {
				console.log("Attempt failed to login with " + user.username);
				return res.send(401);
            }

			var token = jwt.sign({userid: user.id}, secret.secretToken, { expiresInMinutes: tokenManager.TOKEN_EXPIRATION });
			console.log("--> Der User ist: " + user.id);
			return res.json({token:token});
		});

	});
};

exports.logout = function(req, res) {
	wsStatistik.wsCalls('logout');
	if (req.user) {
		tokenManager.expireToken(req.headers);

		delete req.user;	
		return res.send(200);
	}
	else {
		return res.send(401);
	}
}

exports.deleteUser = function(req, res) {
	wsStatistik.wsCalls('deleteUser');
	var targetUserId = req.body.userId || '';
	console.log('--> targetUserId : '+targetUserId );
	if(targetUserId == ''){
		
		return res.send(400);
	}
	var userId = userInfo.getUserId(req.headers);
	var isAdmin = null;
	var isAdminCallback = function(data) {
		isAdmin = data;
		console.log('--> Userid: '+userId+' isAdmin: '+isAdmin);
		if(isAdmin){
			var query = db.userModel.findOne({_id:targetUserId});
			query.exec(function(err, result) {
				if (err) {
					console.log(err);
					return res.send(400);
				}

				if (result != null) {
					result.remove();
					return res.send(200);
				}
				else {
					return res.send(400);
				}
			});
		}
	};
	userInfo.userIsAdmin(userId, isAdminCallback);

}

exports.register = function(req, res) {
	wsStatistik.wsCalls('register');
	var username = req.body.username || '';
	var password = req.body.password || '';
	var passwordConfirmation = req.body.passwordConfirmation || '';

	if (username == '' || password == '' || password != passwordConfirmation) {
		return res.send(400);
	}

	var user = new db.userModel();
	user.username = username;
	user.password = password;

	user.save(function(err) {
		if (err) {
			console.log(err);
			return res.send(500);
		}	
		
		db.userModel.count(function(err, counter) {
			if (err) {
				console.log(err);
				return res.send(500);
			}

			if (counter == 1) {
				db.userModel.update({username:user.username}, {is_admin:true}, function(err, nbRow) {
					if (err) {
						console.log(err);
						return res.send(500);
					}

					console.log('First user created as an Admin');
					return res.send(200);
				});
			} 
			else {
				return res.send(200);
			}
		});
	});
}