var express = require('express');
var app = express();
var jwt = require('express-jwt');
var bodyParser = require('body-parser'); //bodyparser + json + urlencoder
var morgan  = require('morgan'); // logger
var tokenManager = require('./config/token_manager');
var secret = require('./config/secret');
var config = require('./config/config');

// loging with data and time
var log = console.log;

console.log = function () {
    var first_parameter = arguments[0];
    var other_parameters = Array.prototype.slice.call(arguments, 1);

    function formatConsoleDate (date) {
        var hour = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        var milliseconds = date.getMilliseconds();

        return '[' +
               ((hour < 10) ? '0' + hour: hour) +
               ':' +
               ((minutes < 10) ? '0' + minutes: minutes) +
               ':' +
               ((seconds < 10) ? '0' + seconds: seconds) +
               '.' +
               ('00' + milliseconds).slice(-3) +
               '] ';
    }

    log.apply(console, [formatConsoleDate(new Date()) + first_parameter].concat(other_parameters));
};

app.listen(config.port);
app.use(bodyParser());
app.use(express.static('../app'));
app.use(morgan());

//Routes
var routes = {};
routes.posts = require('./route/posts.js');
routes.users = require('./route/users.js');


app.all('*', function(req, res, next) {
  res.set('Access-Control-Allow-Origin', config.url);
  res.set('Access-Control-Allow-Credentials', true);
  res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
  res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization, json');
  if ('OPTIONS' == req.method) return res.send(200);
  next();
});

//Get all published post
app.get('/api/post', routes.posts.list);

//Get all posts
app.get('/api/post/all', routes.posts.listAll);

// Get the post id
app.get('/api/post/:id', routes.posts.read); 

// Get posts by tag
app.get('/api/tag/:tagName', routes.posts.listByTag); 

// Create a new user
app.post('/api/user/register', routes.users.register); 

// Login
app.post('/api/user/signin', routes.users.signin); 

// Logout
app.get('/api/user/logout', jwt({secret: secret.secretToken}), routes.users.logout); 

// Create a new post
app.post('/api/post', jwt({secret: secret.secretToken}), tokenManager.verifyToken , routes.posts.create); 

// Edit the post id
app.put('/api/post', jwt({secret: secret.secretToken}), tokenManager.verifyToken, routes.posts.update); 

// add vote
app.post('/api/post/addvote', jwt({secret: secret.secretToken}), tokenManager.verifyToken, routes.posts.addVote);

// get post statistik
app.get('/api/post/statistik/:id', jwt({secret: secret.secretToken}), tokenManager.verifyToken, routes.posts.getPostStatistik);

// Delete the post id
app.delete('/api/post/:id', jwt({secret: secret.secretToken}), tokenManager.verifyToken, routes.posts.deletePost); 

// Get all posts
app.get('/api/wsstatistik/all', jwt({secret: secret.secretToken}), tokenManager.verifyToken, routes.posts.wsListAll);

// Delete a user py id
app.delete('/api/user/delete', jwt({secret: secret.secretToken}), tokenManager.verifyToken, routes.users.deleteUser);


console.log('Voting API is starting on port '+config.port);
