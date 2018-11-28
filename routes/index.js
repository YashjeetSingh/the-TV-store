var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');
var Product = require('../models/product');
var Order = require('../models/order');
var elasticsearch = require('elasticsearch');
var client = require('./connection.js');

/*Setting up Redis cache*/
var redis = require('express-redis-cache');
var redisClient  = redis({
  host: "redis-18544.c74.us-east-1-4.ec2.cloud.redislabs.com", port: "18544", auth_pass: 'wrFxyijExesYwY2xllff5nh2ivRnKLdv'
  });

// Terminal output
// The ping will timeout at 1000ms timeout
redisClient.on('message', function(message){
  console.log("Redis caching service has successfully started here!", message);
});

redisClient.on('error', function(error){
  console.error("The Redis caching service is not available!", error);
});
/* GET home page. */
router.get('/', redisClient.route(), function (req, res, next) {

    var successMsg = req.flash('success')[0];
    Product.find(function (err, docs) {
        var productChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            productChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('shop/index', {title: 'the-TV-store', products: productChunks, successMsg: successMsg, noMessages: !successMsg});
    });
});

//Using Amazon Elastic Search and display results
router.get('/search', function(req,response,next)
{
    var pageNum= 1;
    var perPage=6;
    var userQuery = req.query['query'];
    console.log(userQuery);
    var searchParams = {
        index: 'tvshowroom',
        type: 'tv',
        body: {
            query: {
               multi_match: {
                    fields: ["seller","Brand"],
                    query: userQuery,
                    fuzziness: "AUTO"
               }
            }
        }};
    client.search(searchParams, function (error, res) {
        if (error) {
           // console.log("search error: " + error);
            throw error;
        }
            var results = res.hits.hits.map(function (i) {
                return i['_source'];
            });
            var productChunks = [];
            var chunkSize = 3;
            for (var i = 0; i < results.length; i += chunkSize) {
                productChunks.push(results.slice(i, i + chunkSize));
                console.log(productChunks);
                console.log("reached here");
            }
            response.render('shop/search', {
                title: 'Search Results', products: productChunks
            });
        });
});

/*/var redis = require('redis');
//var client = redis.createClient(12067, 'redis-12067.c9.us-east-1-4.ec2.cloud.redislabs.com', {no_ready_check: true});
client.auth('password', function (err) {
    if (err) throw err;
});
client.on('connect', function() {console.log('Connected to Redis');
});*/

/*Setting up Redis cache*/
var redis = require('express-redis-cache');
var redisClient  = redis({
  host: "redis-18544.c74.us-east-1-4.ec2.cloud.redislabs.com", port: "18544", auth_pass: 'wrFxyijExesYwY2xllff5nh2ivRnKLdv'
  });

// Terminal output
// The ping will timeout at 1000ms timeout
redisClient.on('message', function(message){
  console.log("Redis caching service has successfully started!", message);
});

redisClient.on('error', function(error){
  console.error("The Redis caching service is not available!", error);
});

//Using Redis cache to cache the results
/*router.get('/search',redisClient.route(), function(req,response,next)
{
    var pageNum= 1;
    var perPage=6;
    var userQuery = req.query['query'];
    console.log(userQuery);
    var searchParams = {
        index: 'tvshowroom',
        type: 'tv',
        body: {
            query: {
               multi_match: {
                    fields: ["seller","Brand"],
                    query: userQuery,
                    fuzziness: "AUTO"
               }
            }
        }};
    client.search(searchParams, function (error, res) {
        if (error) {
           // console.log("search error: " + error);
            throw error;
        }
            var results = res.hits.hits.map(function (i) {
                return i['_source'];
            });
            var productChunks = [];
            var chunkSize = 3;
            for (var i = 0; i < results.length; i += chunkSize) {
                productChunks.push(results.slice(i, i + chunkSize));
                console.log(productChunks);
                console.log("reached here");
            }
            response.render('shop/search', {
                title: 'Cached results:', products: productChunks
            });
        });
});*/

router.get('/contactus', function(req, res, next) {
    res.render('layouts/contactus',{title: 'the-TV-store'});
});
router.get('/aboutus', function(req, res, next) {
    res.render('layouts/aboutus',{title: 'the-TV-store'});
    });


router.get('/loadProduct', function (req, res) {
    console.log("Calling MongoDB to load product Details!");
    var productId = req.query._id;
    console.log(productId)
    Product.find({_id: productId}, function(err, product) {
        console.log("Connect to MongoDB");
        console.log("productName from MongoDb"+product);
        res.render('shop/product', {title: 'the-TV-store', products: product});
    });
});

module.exports = router;
