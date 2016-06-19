var db = require('../config/mongo_database.js');

var wsPublicFields = 'wsName wsRecords';

// count WS-Calls
exports.wsCalls = function(webServices) {
	console.log('--> WS-Calls: '+webServices);

	var query = db.wsCallsModel.findOne({wsName: webServices});
	query.select(wsPublicFields);
	query.exec(function(err, result) {
		if (err) {
  			console.log(err);
  		}

  		if (result != null) {
  			result.update({ $inc: { wsRecords: 1 } }, function(err, nbRows, raw) {
			});
  		} else {
  			var wsCallsModel = new db.wsCallsModel();
  			wsCallsModel.wsName = webServices;
  			wsCallsModel.wsRecords = 1;

  			wsCallsModel.save(function(err) {
  				if (err) {
  					console.log(err);
  				}
  			});
  		}
	});
}