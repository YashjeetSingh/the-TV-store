var client = require('./routes/connection.js');

client.indices.delete({index: 'eventlogs_2017_01'},function(err,resp,status) {
    console.log("delete",resp);
});