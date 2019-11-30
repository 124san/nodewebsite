var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var allowedOrigins = ['http://localhost:8080', 'https://sz124san.herokuapp.com/']

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// MongoDB Atlus
const MongoClient = require('mongodb').MongoClient;
const uri = 'mongodb+srv://'+process.env.MONGO_USER+':'+process.env.MONGO_PW+'@cluster0-4rswz.gcp.mongodb.net/test?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
app.use(function(req,res,next){
  // req.db = db;
  req.client = client;
  next();
});

// Verify POST requests
// app.use(function(req,res,next){
//   if (!req.body.mykey) {
//     res.status(403).send('unauthorized http request.')
//   }
//   if (req.body.mykey !== process.env.HTTPKEY) {
//     res.status(403).send('unauthorized http request')
//   }
//   else {
//     next();
//   }
// })

// Routers
app.use('/', indexRouter);
app.use('/users', usersRouter);

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
