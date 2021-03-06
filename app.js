var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var lessCompiler = require('less-middleware');

var routesLoader = require('./routes/index');

module.exports = function(db) {

  var app = express();

  var routes = routesLoader(db);

// view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');

  //app.use(function (req, res, next) {
  //  req.db = db;
  //  next();
  //});

// uncomment after placing your favicon in /public
  app.use(favicon(__dirname + '/public/favicon.ico'));
  app.use(logger(':remote-addr [:date] :method :url :status', {
    skip: function (req, res) {
      if (req.path.indexOf('checkout') > -1 || (req.path.indexOf('checkout') > -1 && req.path.indexOf('checkout') < 5)) {
        return false;
      }
      return true;
    }
  }));
//app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(cookieParser());
  app.use(lessCompiler(path.join(__dirname, 'public')));
  app.use(express.static(path.join(__dirname, 'public')));

  app.use('/', routes);

// catch 404 and forward to error handler
  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

// error handlers

// development error handler
// will print stacktrace
  console.log(app.get('env'));
  if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    });
  }

// production error handler
// no stacktraces leaked to user
  app.use(function (err, req, res, next) {
    console.log(err);
    res.status(err.status || 500);
    res.send('error');
  });

  return app;
};