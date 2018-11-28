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

module.exports.redis = function(searchData, callback) {
    redisClient.search({
        index: 'tv',
        type: 'products',
        body: {
            query: {
                bool: {
                    must: {
                        match: {
                            "description": searchData.searchTerm
                        }
                    }
                }
            }
        }
    }).then(function (resp) {
        callback(resp.hits.hits);
    }, function (err) {
        callback(err.message)
        console.log(err.message);
    });
}
