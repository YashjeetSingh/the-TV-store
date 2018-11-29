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
router.get('/', function (req, res, next) {

    var successMsg = req.flash('success')[0];  // to display the success message on top of home page after purchasing product
    Product.find(function (err, docs) {
        var productChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            productChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('shop/index', {title: 'The-TV-store', products: productChunks, successMsg: successMsg, noMessages: !successMsg});
    });
});

//Using Amazon Elastic Search and display results
router.get('/search', redisClient.route(), function(req,response,next)
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

router.get('/add-to-cart/:id', function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});
  Product.findById(productId, function (err, product) {
    if (err){
      return res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/');
  });
});

router.get('/shopping-cart', function (req, res, next) {
  if (!req.session.cart) {
    return res.render('shop/shopping-cart', {products:null});
    }
    var cart = new Cart(req.session.cart);
    res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

router.get('/checkout', isLoggedIn, function(req, res, next){
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    var errMsg = req.flash('error')[0];
    res.render('shop/checkout', {total: cart.totalPrice, errMsg: errMsg, noError: !errMsg});
});

router.post('/checkout', isLoggedIn, function(req, res, next) {
  if (!req.session.cart) {
    return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);

    var stripe = require("stripe")(
      "sk_test_9VlMlA4LaejfeWxv2tdmmqry"
    );
stripe.charges.create({
  amount: cart.totalPrice * 100,
  currency: "USD",
  source: req.body.stripeToken, //obtain in stripe.js
  description: "Test Charge "
}, function(err, charge) {
  //handling the results of the charge
  //asynchronously called
  if (err){
    req.flash('error',err.message);
    return res.redirect('/checkout');
  }
  var order = new Order({
    user: req.user,
    cart: cart,
    address: req.body.address,
    name: req.body.name,
    paymentId: charge.id
  });
  order.save(function(err, result){
    req.flash('success','Product purchased successfully!');
    req.session.cart = null;
    res.redirect('/');

  });
  });
});




module.exports = router;

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/user/signin');
}
