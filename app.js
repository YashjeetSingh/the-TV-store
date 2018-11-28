// Calling installed packages
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');
var MongoStore = require('connect-mongo')(session);
var index = require('./routes/index');
var user = require('./routes/user');
var app = express();
// Connectig to the cloud Mongodb Atlas database
var url = 'mongodb://yashjeet:Mongo123@cluster0-shard-00-00-y1niv.mongodb.net:27017,cluster0-shard-00-01-y1niv.mongodb.net:27017,cluster0-shard-00-02-y1niv.mongodb.net:27017/Db?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';
mongoose.connect(url,{useMongoClient:true});
var db=mongoose.connection;
require('./config/passport');

// Setting up Handlebars as the View Engine
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

//Amazon Elasticsearch Service
  //Setting up Amazon Elasticsearch Service
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    accessKeyId: 'AKIAIV7YCAPRHY7VXS6A',
    secretAccessKey : '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',
    service : 'es',
    log: 'trace',
    region: 'us-east-2',
    host: 'search-tvsets-ufpidf2ylw7ln3ekxhqtwk3rju.us-east-2.es.amazonaws.com'
});

  //Elasticsearch client for my Amazon ES created here
var es = require('elasticsearch').Client({
    hosts: [ 'https://search-tvsets-ufpidf2ylw7ln3ekxhqtwk3rju.us-east-2.es.amazonaws.com' ],
    connectionClass: require('http-aws-es')
});

    // Terminal output
    // The ping will timeout at 1000ms timeout
client.ping({
    requestTimeout: 1000
}, function (error) {
    if (error) {
        console.trace('The AWS elasticsearch service is not available!');
    } else {
        console.log('Amazon Elasticsearch Service successfully connected!');
    }
});

/*Setting up Redis cache
var redis = require('redis');
var redisClient  = require('redis')({
  host: "redis-18544.c74.us-east-1-4.ec2.cloud.redislabs.com:18544", port: "18544", auth_pass: 'wrFxyijExesYwY2xllff5nh2ivRnKLdv'
  });

// Terminal output
// The ping will timeout at 1000ms timeout
redisClient.ping({
requestTimeout: 1000
}, function (error) {
if (error) {
    console.trace('The Redis caching service is not available!');
} else {
    console.log('Redis caching service has successfully started!');
}
});*/

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({
  secret: 'mysupersecret',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: { maxAge: 180 * 60 * 1000 }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    res.locals.login = req.isAuthenticated();
    res.locals.session = req.session;
    next();
});

app.use('/', user);
app.use('/', index);

// Handling errors

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handling for development environment
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// Error handling for production environment
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
