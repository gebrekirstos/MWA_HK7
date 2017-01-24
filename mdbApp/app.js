var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

//add require library
var crypto = require('crypto');
//var mongoClient = require('mongodb').MongoClient;
var mongo = require('mongoskin');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.set('etag', true);
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));


//crypto encryption
app.use(function (req, res, next) {
  var db = mongo.db('mongodb://127.0.0.1:27017/mydb', {native_parser:true});
  db.bind('homework7');
  db.homework7.find().toArray(function(err, items){
    const encryption = items[0].message;
    const decipher = crypto.createDecipher('aes256','asaadsaad');
    var decrypted = decipher.update(encryption, 'hex','utf8');
    decrypted += decipher.final('utf8');
    res.locals.msg = decrypted;
    res.locals.title = 'The Decrypted message';
    res.render('index');
  });
});

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
