var client = require('./routes/connection.js');

client.cluster.health({},function(err,resp,status) {
    console.log("-- Client Health --",resp);
});

client.count({index: 'tvshowroom',type: 'tv'},function(err,resp,status) {
    console.log("tv",resp);
});
