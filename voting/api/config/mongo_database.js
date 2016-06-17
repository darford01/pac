var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
var mongodbURL = 'mongodb://localhost/voting';
var mongodbOptions = { };

mongoose.connect(mongodbURL, mongodbOptions, function (err, res) {
    if (err) { 
        console.log('Connection refused to ' + mongodbURL);
        console.log(err);
    } else {
        console.log('Connection successful to: ' + mongodbURL);
    }
});

var Schema = mongoose.Schema;

// User schema
var User = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    is_admin: { type: Boolean, default: false },
    created: { type: Date, default: Date.now }
});

var Post = new Schema({
    title: { type: String, required: true },
    tags: [ {type: String} ],
    tunables: {type: Array, arrayType: {type: String, minLength: 0, default: []}},
    is_published: { type: Boolean, default: false },
    content: { type: String, required: true },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    read: { type: Number, default: 0 },
    roleids: { type: Array, arrayType: {type: Number} },
    ownerid: { type: Number, default: 0 },
    likes: { type: Number, default: 0 }
});

var Vote = new Schema({
	userid: {type: String, required: true},
	postid: {type: String, required: true},
	votevalue: { type: String, required: true},
	created: { type: Date, default: Date.now }
});

// Bcrypt middleware on UserSchema
User.pre('save', function(next) {
  var user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
    });
  });
});

//Password verification
User.methods.comparePassword = function(password, cb) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(isMatch);
    });
};


//Define Models
var userModel = mongoose.model('User', User);
var postModel = mongoose.model('Post', Post);
var voteModel = mongoose.model('Vote', Vote);


// Export Models
exports.userModel = userModel;
exports.postModel = postModel;
exports.voteModel = voteModel; 
