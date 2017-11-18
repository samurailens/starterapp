// Get dependencies
const express = require('express');
const path = require('path');
const http = require('http');
const jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

// require('./server/config/passport.js')(passport); // pass passport for configuration

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session      = require('express-session');
var multer  = require('multer');
var cors = require('cors');
var Helmet = require('helmet');

var request = require("request");
var https = require('https');
var querystring = require('querystring');
var unirest = require("unirest");

// var User = require('./server/models/usermodel');
// var Course = require('./server/models/coursemodel');
// var Trainer =  require('./server/models/trainermodel');

// configuration sienna-dev-user:sienna-dev-user===============================================================
// mongoose.connect('mongodb://localhost:27017/bornartist'); // connect to our database

const app = module.exports =  express();
app.use(express.static(path.join(__dirname, 'dist')));
// Parsers for POST data
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.set('superSecret','amygdala'); // secret variable
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser()); // read cookies (needed for auth)
app.use(cors());
app.use(morgan('dev')); // log every request to the console
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(Helmet());
// Point static path to dist

app.use(session({
  secret: 'bornartistisawesome',
  saveUninitialized: true,
  resave: true,
}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session



//Server Routes
app.get('/setup', function (req, res) {


    /**
     * req will contain the incoming request data
     * res will contain the data we need to send to clients
     * 
     * req.body will contain your POST data
     * req.send() will send the data and close connection. Connection closed cannot be opened/sent again.
     * every function should have this req, res
     */

    res.send('Hello API world')

});

app.post('/setup', function (req, res) {


    /**
     * req will contain the incoming request data
     * res will contain the data we need to send to clients
     * 
     * req.body will contain your POST data
     * req.send() will send the data and close connection. Connection closed cannot be opened/sent again.
     * every function should have this req, res
     */
    console.log(req.body.name)
    req.body['server'] = 'localhost'
    res.send(req.body)

});




 //End of Server Routes



///
// Catch all other routes and return the index file
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist/index.html'));
// });

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

var io = require('socket.io')(server)
io.on('connection', function(socket){
  console.log(socket);
  console.log('a user connected');

  //If you want to send a message to everyone except for a certain socket, we have the broadcast flag:
  socket.broadcast.emit('hi', { for: 'new guy joined' } );

  //In order to send an event to everyone, Socket.IO gives us the io.emit:
  io.emit('some-event', { for: 'everyone' });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
  });

});

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));