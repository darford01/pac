# Voting

[![Node version](https://nodejs.org/en/blog/release/v5.7.0/)](http://nodejs.org/download/)

## Description

Voting is a simple voting application built with AngularJS, Node.js and MongoDB. Create Posts and add question and vote for one of them.

## Features

- [x] Create Article
- [x] Edit Article
- [x] Delete Article
- [x] Add tags to Article
- [x] Add Authentication to the administration
- [x] Add registration for new user
- [x] Handle Logout
- [ ] Add users management
- [X] Vote Article
- [ ] Permission for Article
- [X] Statistic for a Post
- [ ] Statistic for websServices calls 
- [ ] Lock Article after first vote
- [ ] Tests
- [ ] Dokus


## Dependencies

You need `redis-2.8.9` up and running on port `6379`

You need `mongodb-2.4.10` up and running on port `27017`

## Installation

Clone the repository with: >>git clone https://github.com/darford01/pac.git

### Start Redis

Start your redis instance:
```bash
my@home:...$ redis-server 
                _._                                                  
           _.-``__ ''-._                                             
      _.-``    `.  `_.  ''-._           Redis 2.8.9 (00000000/0) 64 bit
  .-`` .-```.  ```\/    _.,_ ''-._                                   
 (    '      ,       .-`  | `,    )     Running in stand alone mode
 |`-._`-...-` __...-.``-._|'` _.-'|     Port: 6379
 |    `-._   `._    /     _.-'    |     PID: 13499
  `-._    `-._  `-./  _.-'    _.-'                                   
 |`-._`-._    `-.__.-'    _.-'_.-'|                                  
 |    `-._`-._        _.-'_.-'    |           http://redis.io        
  `-._    `-._`-.__.-'_.-'    _.-'                                   
 |`-._`-._    `-.__.-'    _.-'_.-'|                                  
 |    `-._`-._        _.-'_.-'    |                                  
  `-._    `-._`-.__.-'_.-'    _.-'                                   
      `-._    `-.__.-'    _.-'                                       
          `-._        _.-'                                           
              `-.__.-'                                               

[13499] 12 May 19:22:41.172 # Server started, Redis version 2.8.9
[13499] 12 May 19:22:41.172 * The server is now ready to accept connections on port 6379
```

### Build angularjs app

The build result is already available, but if you want to build it yourself, install gulp and the dependencies, then run it.

install gulp and the gulp dependencies: `npm install`

You can run the app in other Web-Server like Apache http Server. Create on Apache a folder voting and cope all the files from voting/app into and run the server

Edit app/js/app.js and replace the value of `options.api.base_url` to match your server configuration of the Web-Server if you will use one. If you will not use a Web-Server for app, please configure there the same host and port number as nodejs server. 

Run gulp to build the scripts of the AngularJS app with: `$ gulp`

### Install voting App

Go to the api folder and install the dependencies: `my@home:/voting/api$ npm install`

Edit api/voting-api.js and replace the value of Access-Control-Allow-Origin to match your Node.js server configuration.

Run the application: `my@home:/voting/api$ node voting-api.js`

## Run

You can now open your browser: 
* On Apache -- `http://localhost:<your-port>/voting/app`
* Without http-Server -- `http://localhost:<your-port>/'

Create a first account on `http://localhost:<your-port>/<voting/app>/#/admin/register`

To access the Administration, go to `http://localhost:<your-port>/<voting/app>/#/admin/login`

## Stack

* AngularJS V1.2.1
* Bootstrap v3.0.2
* MongoDB
* Redis
* Charts.js V1.1.1
* Node.js v5.7.0

## Author

Issam Lamani

## License
free
