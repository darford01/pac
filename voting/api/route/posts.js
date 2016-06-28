var db = require('../config/mongo_database.js');

var publicFields = '_id title url tags content created tunables';

var publicFieldsVote = 'postid votevalue'; 

var userPublicFieldsVote = '_id username password is_admin created roles';

var userInfo = require('./userinfo');

var wsStatistik = require('./wsCalls');

exports.list = function(req, res) {
	wsStatistik.wsCalls('list');
	var query = db.postModel.find({is_published: true});

	query.select(publicFields);
	query.sort('-created');
	query.exec(function(err, results) {
		if (err) {
  			console.log(err);
  			return res.send(400);
  		}

  		for (var postKey in results) {
    		results[postKey].content = results[postKey].content.substr(0, 400);
    	}

  		return res.json(200, results);
	});
};

exports.listAll = function(req, res) {
	wsStatistik.wsCalls('listAll');
	/*if (!req.user) {
		return res.send(401);
	}*/

	var query = db.postModel.find();
	query.sort('-created');
	query.exec(function(err, results) {
		if (err) {
  			console.log(err);
  			return res.send(400);
  		}

  		for (var postKey in results) {
    		results[postKey].content = results[postKey].content.substr(0, 400);
    	}

  		return res.json(200, results);
	});
};

exports.read = function(req, res) {
	wsStatistik.wsCalls('read');
	var id = req.params.id || '';
	if (id == '') {
		return res.send(400);
	}

	var query = db.postModel.findOne({_id: id});
	query.select(publicFields);
	query.exec(function(err, result) {
		if (err) {
  			console.log(err);
  			return res.send(400);
  		}

  		if (result != null) {
  			result.update({ $inc: { read: 1 } }, function(err, nbRows, raw) {
				return res.json(200, result);
			});
  		} else {
  			return res.send(400);
  		}
	});
};

exports.update = function(req, res) {
	wsStatistik.wsCalls('list');
	if (!req.user) {
		return res.send(401);
	}

	var post = req.body.post;

	if (post == null || post._id == null) {
		res.send(400);
	}

	var updatePost = {};

	if (post.title != null && post.title != "") {
		updatePost.title = post.title;
	} 

	if(post.tunables != null){
		updatePost.tunables = post.tunables;
	}
	
	if (post.tags != null) {
		if (Object.prototype.toString.call(post.tags) === '[object Array]') {
			updatePost.tags = post.tags;
		}
		else {
			updatePost.tags = post.tags.split(',');
		}
	}

	if (post.is_published != null) {
		updatePost.is_published = post.is_published;
	}

	if (post.content != null && post.content != "") {
		updatePost.content = post.content;
	}

	updatePost.updated = new Date();

	db.postModel.update({_id: post._id}, updatePost, function(err, nbRows, raw) {
		return res.send(200);
	});
};

exports.listByTag = function(req, res) {
	wsStatistik.wsCalls('listByTAg');
	var tagName = req.params.tagName || '';
	if (tagName == '') {
		return res.send(400);
	}

	var query = db.postModel.find({tags: tagName, is_published: true});
	query.select(publicFields);
	query.sort('-created');
	query.exec(function(err, results) {
		if (err) {
  			console.log(err);
  			return res.send(400);
  		}

  		for (var postKey in results) {
    		results[postKey].content = results[postKey].content.substr(0, 400);
    	}

  		return res.json(200, results);
	});
}

exports.delete = function(req, res) {
	wsStatistik.wsCalls('delete');
	if (!req.user) {
		return res.send(401);
	}

	var id = req.params.id;
	if (id == null || id == '') {
		res.send(400);
	} 

	var query = db.postModel.findOne({_id:id});

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
};


exports.create = function(req, res) {
	wsStatistik.wsCalls('create');
	if (!req.user) {
		return res.send(401);
	}

	var post = req.body.post;
	if (post == null || post.title == null || post.content == null 
		|| post.tags == null) {
		return res.send(400);
	}

	var postEntry = new db.postModel();
	postEntry.title = post.title;
	postEntry.tags = post.tags.split(',');
	postEntry.is_published = post.is_published;
	postEntry.content = post.content;
	postEntry.tunables = post.tunables;

	postEntry.save(function(err) {
		if (err) {
			console.log(err);
			return res.send(400);
		}

		return res.send(200);
	});
}

exports.addVote = function(req, res) {
	wsStatistik.wsCalls('addVote');
	if (!req.user) {
		console.log('--> 001');
		return res.send(401);
	}
	
	var vote = req.body.vote;
	var userId = userInfo.getUserId(req.headers);
	console.log('--> vote: '+vote+' id: '+vote._id+' value: '+vote.votevalue+' userid: '+userId);
	if (vote == null || vote._id == null || vote.votevalue == null || userId == null) {
		console.log('--> 002');
		return res.send(400);
	}	
	// Add Vote
	// Check if the entry ellready exists and add one if no one exists
	var query = db.voteModel.findOne({userid:userId, postid: vote._id});
	var doAddVote = false;
	query.exec(function(err, result) {
		if (err) {
			console.log(err);
			return res.send(400);
		}

		if (result == null) {
			var voteEntry = new db.voteModel();
			voteEntry.userid = userId;
			voteEntry.postid = vote._id;
			voteEntry.votevalue = vote.votevalue;

			voteEntry.save(function(err) {
				if (err) {
					console.log(err);
					return res.send(400);
				}

				return res.send(200);
			});
		}
	});
	//TODO sperre die Bearbeitung des Entrys, somit kann der Redakteur dieses Antry nicht mehr beabeiten	
}

/* get vote results */
exports.getPostStatistik = function(req, res) {
	wsStatistik.wsCalls('getPostStatistik');
	var id = req.params.id || '';
	var userId = userInfo.getUserId(req.headers);
	if (id == '' || userId == null) {
		return res.send(400);
	}
	//console.log('--> 1: id= '+id+' userid: '+userId);
	var query = db.voteModel.findOne({userid:userId, postid: id});
	query.exec(function(err, result) {
		if (err) {
			console.log(err);
			return res.send(400);
		}

		if (result == null) {
			return res.json(200, result);
		}else{
			// resultat für das Voting
			var voteQuery = db.voteModel.find({postid: id});
			voteQuery.select(publicFieldsVote);
			voteQuery.exec(function(err, results) {
				if (err) {
		  			console.log(err);
		  			return res.send(400);
		  		}

		  		if (results != null) {

		  	  		/*for (var vote in results) {
		  	  			console.log('--> ID: ' + results[vote].postid+ ' Result: ' + results[vote].votevalue);
		  	    	}*/
					return res.json(200, results);
				
		  		} else {
		  			return res.send(400);
		  		}
			});
		}
	});	
}

// lsit all WS Calls
exports.wsListAll = function(req, res) {
	wsStatistik.wsCalls('wsListAll');
	
	var query = db.wsCallsModel.find();
	query.sort('-wsName');
	query.exec(function(err, results) {
		if (err) {
			console.log(err);
			return res.send(400);
		}
		return res.json(200, results);
	});
};
