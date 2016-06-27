var should = require("should");
var supertest = require("supertest");

var bson = require('bson');
var mongoose = require('mongoose');
var app = require('../api/voting-api.js');

var server = supertest.agent("http://localhost:9877");

// parameter
var postid=0;

// UNIT test begin

describe("SAMPLE unit test", function() {
		
	// #1 should return home page

	it("should return empty Array", function(done) {
		debugger
		// calling home page api
		server.get("/api/post").expect("Content-type", /json/).expect(200) // THis is
																	// HTTP
																	// response
		.end(function(err, res) {
			// HTTP status should be 200
			res.status.should.equal(200);
			
			//console.log("----> "+JSON.stringify(res.body));
			
			// Error key should be false.
			res.body.should.be.instanceof(Array).and.have.lengthOf(0);
			done();
		});
	});
	
	it("should return all posts", function(done) {
		debugger
		// calling home page api
		server.get("/api/post/all").expect("Content-type", /json/).expect(200) // THis is
																	// HTTP
																	// response
		.end(function(err, res) {
			// HTTP status should be 200
			res.status.should.equal(200);
			
			//console.log("----> "+JSON.stringify(res.body[0]._id));
			postid = res.body[0]._id;
			// Error key should be false.
			res.body.should.be.instanceof(Array);
			done();
		});
	});


	it("should return get one of the posts", function(done) {
		debugger
		// calling home page api
		server.get("/api/post/"+postid).expect("Content-type", /json/).expect(200) // THis is
																	// HTTP
																	// response
		.end(function(err, res) {
			// HTTP status should be 200
			res.status.should.equal(200);
			
			//console.log("----> "+JSON.stringify(res.body));
			
			// Error key should be false.
			res.body._id.should.be.equal(postid);
			done();
		});
	});
	
	it("should return error wehn we try to add post without login", function(done) {
		debugger
		// calling home page api
		server.get("/api/post/addvote").expect("Content-type", /json/).expect(200) // THis is
																	// HTTP
																	// response
		.end(function(err, res) {
			// HTTP status should be 400
			res.status.should.equal(400);
			
			done();
		});
	});
});
