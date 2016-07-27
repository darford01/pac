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
- [x] Permission for Article
- [X] Statistic for a Post
- [x] Statistic for Web-Services calls 
- [x] Locks Article after first vote
- [x] Units Tests
- [x] NodeJS autostart and monitoring
- [X] Real-time monitoring data
- [X] clustring


## Dependencies

You need `redis-2.8.9` up and running on port `6379`

You need `mongodb-2.4.10` up and running on port `27017`

## Installation

Clone the repository with: >>git clone https://github.com/darford01/pac.git

install npm
install and run mongodb
install and run redis 

flow the steps below

### Configuration

1. For edit host-name and port.number got to `voting/api/config/config.js` 
2. To edit the host-name and port-number of the app go to `voting/app/dist/js/controller.js` and edit `options.api.base_url`  
3. Other configuration for Mongo and Redis DBs are in `voting/api/config` folder


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
### Install voting App

* Go to the voting folder and install the dependencies: `my@home:/voting/$ npm install`
* Go to the app folder and install the dependencies: `my@home:/voting/app$ npm install`
* Go to the api folder and install the dependencies: `my@home:/voting/api$ npm install`

### Start 

Run the application: `my@home:/voting/api$ node voting-api.js`

#### Start and Stop the app

Recommended start for the application is: 
my@home:/voting/api$ pm2 start voting-api && tail -f ~/.pm2/logs/voting-api-out-0.log

you have to install pm2: sudo npm install -g pm2

And for stopping the app:
my@home:/voting/api$ pm2 stop voting-api 

### Run

You can now open your browser: 
* On Apache -- `http://localhost:<your-port>/voting/app`
* Without http-Server -- `http://localhost:<port>/'
* Default-port is `9877`


Create a first account (Administrator) on `http://localhost:<your-port>/<voting/app>/#/admin/register`

To access the Administration, go to `http://localhost:<your-port>/<voting/app>/#/admin/login`

## Testing 

For testing the application we will use Mocha. Please install mocha:

$ sudo npm install -g mocha

and then in another shell run:

$ cd /voting
$ mocha 

## Monitoring and autostart

http://pm2.keymetrics.io/

if you want to monitor and autostart the application flow this steps:
	
	* npm install pm2 -g
	
	* pm2 start votin-api.js

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

## cluster

you can run the app in cluster by installing the application more the one and edit the port-number of api and app

## Modify or extend the voting-application

### API modification and extensions

* To add, change, or create new REST services, please go to `voting/api/route` folder and adapt or insert the desired methods. 
* When you add a new methods in new js-file please use `var abc = require(' abc.js ');` in the other the files, so that they are known there.
* When you add new methods you have to mapp them to REST-URL, please do that in `voting/api/voting-api.js`, here is an example:
```js
 // Create a new post
 app.post('/api/post', jwt({secret: secret.secretToken}), tokenManager.verifyToken , routes.posts.create); 
```  

### AngularJS APP modification and extensions
* please install gulp: `$ npm install -g gulp`
* All css changes have to be done in `voting/app/css`
* All AngularJS modifikation have to be done in `voting/app/js`
* To deploy you changes please run gulp: `$ gulp`, all your changes will be saved in the folger dist `voting/app/dist`
 
## Stack

* AngularJS V1.2.1
* Bootstrap v3.0.2
* MongoDB V2.4.10
* Redis V2.8.9
* Charts.js V1.1.1
* Node.js v5.7.0
* Mocha v2.5.3
* PM2 V1.0.1

## Known errors 

### Error: Cannot find module 'bson'
please install bson by your self, flow this steps 
* sudo npm un node-gyp -g;sudo npm i node-gyp -g
* sudo npm un bson;sudo npm i bson --save

## Author

Issam Lamani (PRODYNA AG)

## License
free
