var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials=require('express-partials');// INSTALO partials
var methodOverride = require('method-override'); //instalo method override
var session = require('express-session');

var routes = require('./routes/index');
//var users = require('./routes/users'); ESTO LO ELIMINAMOS

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());


// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false })); LOO QUITO EN LA FASE DE CREACION DE PREGUNTAS
app.use(bodyParser.urlencoded()); //sustituyo en anterior por este


app.use(cookieParser('Quiz 2015'));//esto LO HEMOS CAMBIADO PARA LO DE SESIÓN

app.use(session());

app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method')); //lo pongo para la edición
app.use('/', routes);
//app.use('/users', users); ESTO TAMBIËN LO ELIMINAMOS

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
      error: err,
       errors:[]    //modificaciones tema errores
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    errors:[]  //modificaciones tema errores
  });
});

//app.set('port', (process.env.PORT || 5000)) //añadido según instrucciones web

module.exports = app;
