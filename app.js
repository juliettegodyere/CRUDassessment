var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser'); //parses information from POST
var methodOverride = require('method-override'); //used to manipulate POST
var expressValidator = require('express-validator');
var expressSession = require('express-session');
// var validate = require('mongoose-validator');

// var db = require('./models/db');
var user = require('./models/users');

var routes = require('./routes/index');
var users = require('./routes/users');
// var user = new users(process.env.CUSTOMCONNSTR_MONGOLAB_URI);


var app = express();

// view engine setup
app.set('port',process.env.port || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser('3CCC4ACD-6ED1-4844-9217-82131BDCB239'));
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({secret: process.env.SESSION_SECRET||'secret', saveUninitialized: false, resave: false}));

app.use(function(req, res, next) {
  if (req.session && req.session.admin)
    res.locals.admin = true;
  next();
});

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


http.createServer(app).listen(app.get('port'),function(){
  console.log("express server listening on port " + app.get('port'));
    console.log('Press Ctrl+C to quit.');
});

module.exports = app;
