# Voting


## Description

Voting is a simple voting application built with AngularJS, Node.js and MongoDB. Creates your article and shares them in a beautiful minimalistic template.

## Features

- [x] Create Article
- [x] Edit Article
- [x] Delete Article
- [x] Add tags to Article
- [x] Add Authentication to the administration
- [x] Add registration for new user
- [x] Handle Logout
- [ ] Add users management
- [ ] Vote Article
- [ ] Permission for Artikel
- [ ] Statistic
- [ ] 


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

Edit app/js/app.js and replace the value of `options.api.base_url` to match your server configuration.

Run gulp to build the scripts of the AngularJS app with: `$ gulp`

### Install voting App

Go to the api folder and install the dependencies: `my@home:/voting/api$ npm install`

Edit api/voting.js and replace the value of Access-Control-Allow-Origin to match your server configuration.

Run the application: `my@home:/voting/api$ node voting.js`

## Run

You can now open your browser: `http://localhost/voting/app`

Create a first account on `http://localhost/voting/app/#/admin/register`

To access the Administration, go to `http://localhost/voting/app/#/admin/login`

## Stack

* AngularJS
* Bootstrap
* MongoDB
* Redis
* Node.js
