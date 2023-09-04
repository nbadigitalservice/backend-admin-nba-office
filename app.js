var createError = require('http-errors');
var cors = require('cors')
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const helmet = require('helmet');
require('dotenv').config();
const connect = require('./lib/mongodb');

//connect database;
connect();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var apiRouter = require('./routes/api');

var app = express();

//security
app.use(helmet());

app.use(cors())
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/v1/official', indexRouter);
app.use('/v1/official/api', apiRouter);
app.use('/v1/official/users', usersRouter);
app.use('/v1/official/blog', require("./routes/blog"));

// chat
app.use('/v1/official/chat', require("./routes/chat.router/index"));
app.use('/v1/official/callback',require('./routes/callback'));

// task
app.use('/v1/official/task', require("./routes/task"))


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
