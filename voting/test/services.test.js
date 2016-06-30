var should = require("should");
var supertest = require("supertest");
var qs = require("querystring");

var bson = require('bson');
var mongoose = require('mongoose');
var app = require('../api/voting-api.js');
var db = require('../api/config/mongo_database');

var server = supertest.agent("http://localhost:9877");

// parameter
var postid=0;
var token = {};

describe("Unit tests without login: ", function() {

	it("should return empty Array", function(done) {
		debugger
		
		server.get("/api/post").expect("Content-type", /json/).expect(200) 
		.end(function(err, res) {
			// HTTP status should be 200
			res.status.should.equal(200);
			
			// Error key should be false.
			res.body.should.be.instanceof(Array).and.have.lengthOf(0);
			done();
		});
	});
	
	it("should return all posts", function(done) {
		debugger
		// calling get all post
		server.get("/api/post/all").expect("Content-type", /json/).expect(200)														// response
		.end(function(err, res) {
			// HTTP status should be 200
			res.status.should.equal(200);
			
			postid = res.body[0]._id;
			
			res.body.should.be.instanceof(Array);
			done();
		});
	});


	it("should return get one of the posts", function(done) {
		debugger
		// calling get id
		server.get("/api/post/"+postid).expect("Content-type", /json/).expect(200)														// response
		.end(function(err, res) {
			// HTTP status should be 200
			res.status.should.equal(200);
			
			// Error key should be false.
			res.body._id.should.be.equal(postid);
			done();
		});
	});
	
	it("should return error wehn we try to add post without login", function(done) {
		debugger
		// calling addvote
		server.post("/api/post/addvote").expect("Content-type", /json/).expect(200)																// response
		.end(function(err, res) {
			// HTTP status should be 400
			res.status.should.equal(401);
			
			done();
		});
	});
});

describe("Unit tests with login: ", function() {

	//create test user
	it("Create test user",function(done) {
		debugger
		// calling home page api
		server.post("/api/user/register").send(qs.stringify({ username: 'TestUser', password: '321wsxyaq',  passwordConfirmation: '321wsxyaq' })).expect("Content-type", /json/).expect(200)
		.end(function(err, res) {
			// HTTP status should be 200
			res.status.should.equal(200);
			console.log("----> "+JSON.stringify(token));
			
			done();
		});
	});

	
	it("login with the the TestUser ",function(done) {
		debugger
		// calling home page api
		server.post("/api/user/signin").send({ username: 'TestUser', password: '321wsxyaq'}).expect("Content-type", /json/).expect(200)
		.end(function(err, res) {
			// HTTP status should be 200
			res.status.should.equal(200);
			token = res.body.token;
			console.log("----> "+JSON.stringify(token));
			
			done();
		});
	});
	
	it("Get all webservices statistik ", function(done) {
		debugger
		// calling home page api
		server.get("/api/wsstatistik/all").set('Authorization', 'Bearer ' +token).expect("Content-type", /json/).expect(200)
		.end(function(err, res) {
			done();
		});
	});
	
	it.skip("delete a user ", function(done) {
		debugger
		// calling home page api
		server.delete("/api/user/delete").set('Authorization', 'Bearer ' +token).send(qs.stringify({userId: '577476dd9f4315194bb513b9'})).expect("Content-type", /json/).expect(400, done)
		.end(function(err, res) {

			// HTTP status should be 200
			res.status.should.equal(400)
			done();
		});
	});
	
	after(function(done) {
			debugger
			// calling home page api
			server.get("/api/user/logout").send('Authorization', 'Bearer ' +token).expect(200)
			.end(function(err, res) {
				done();
			});
			
			
			// delete the user
			var query = db.userModel.findOne({username:'TestUser'});
			query.exec(function(err, result) {
				if (err) {
					console.log(err);
				}

				if (result != null) {
					result.remove();
				}
			});
	});

});

