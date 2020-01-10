var cookieSession = require('cookie-session')
var createError = require('http-errors');
var express = require('express');
var i18n = require("i18n");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
var hbs = require('hbs');

var indexRouter = require('./routes/index');


const dotenv = require('dotenv');
dotenv.config();

var app = express();

app.use(cookieParser());

i18n.configure({
  locales:['en', 'cy'],
  directory: __dirname + '/locales',
  cookie: 'lang',
  queryParameter: 'lang'
});

app.use(i18n.init);

app.use(function(req, res, next) {
  if(req.query.lang)
    res.cookie('lang', req.query.lang, { maxAge: 900000, httpOnly: true });

  next();
})

hbs.registerHelper('__', function () {
  return i18n.__.apply(this, arguments);
});
hbs.registerHelper('__n', function () {
  return i18n.__n.apply(this, arguments);
});

app.use(cookieSession({
  name: 'session',
  maxAge: 1000*60*15, //15 minute session
  keys: ['key1', 'key2']
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

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
