// var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var { notFound, errorHandler } = require('./middlewares/error.middleware');

// require routes
var indexRouter = require('./routes/index.routes');

/* ------------------------- set up 'app' ------------------------- */
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// define routes
app.use('/index', indexRouter);

// catch 404 and forward to error handler
app.use(notFound);

// error handler
app.use(errorHandler);

module.exports = app;
