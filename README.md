# Voting

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
- [ ] Add users management (set admins, delete user, etc.)
- [X] Vote Article
- [ ] Permission for Article
- [X] Statistic for a Post
- [x] Statistic for websServices calls 
- [ ] Lock Article after first vote
- [x] Units Tests
- [ ] Dokus
- [x] nodeJs autostart and monitoring


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

## Testing 

For testing the application we will use Mocha. Please install mocha:

$ sudo npm install -g mocha

and then in another shell run:

$ cd /voting
$ mocha 

## Monitoring and autostart
if you want to monitor and autostart the application flow this steps:
	1) npm install pm2 -g
	2) pm2 start votin-api.js

Applications that are running under PM2 will be restarted automatically if the application crashes or is killed, but an additional step needs to be taken to get the application to launch on system startup (boot or reboot). Luckily, PM2 provides an easy way to do this, the startup subcommand.

The startup subcommand generates and configures a startup script to launch PM2 and its managed processes on server boots. You must also specify the platform you are running on, which is ubuntu, in our case:

    pm2 startup ubuntu

The last line of the resulting output will include a command (that must be run with superuser privileges) that you must run:

Output:
[PM2] You have to run this command as root
[PM2] Execute the following command :
[PM2] sudo su -c "env PATH=$PATH:/opt/node/bin pm2 startup ubuntu -u sammy --hp /home/sammy"

Run the command that was generated (similar to the highlighted output above) to set PM2 up to start on boot (use the command from your own output):

     sudo su -c "env PATH=$PATH:/opt/node/bin pm2 startup ubuntu -u sammy --hp /home/sammy"

Other PM2 Usage (Optional)

PM2 provides many subcommands that allow you to manage or look up information about your applications. Note that running pm2 without any arguments will display a help page, including example usage, that covers PM2 usage in more detail than this section of the tutorial.

Stop an application with this command (specify the PM2 App name or id):

    pm2 stop example

Restart an application with this command (specify the PM2 App name or id):

    pm2 restart example

The list of applications currently managed by PM2 can also be looked up with the list subcommand:

    pm2 list

More information about a specific application can be found by using the info subcommand (specify the PM2 App name or id)::

    pm2 info example

The PM2 process monitor can be pulled up with the monit subcommand. This displays the application status, CPU, and memory usage:

    pm2 monit

## Stack

* AngularJS V1.2.1
* Bootstrap v3.0.2
* MongoDB
* Redis
* Charts.js V1.1.1
* Node.js v5.7.0
* Mocha v2.5.3
 
## Author

Issam Lamani (PRODYNA AG)

## License
free
