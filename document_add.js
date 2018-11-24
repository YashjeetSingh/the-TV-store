var client = require('./routes/connection.js');

client.index({
    index: 'tvshowroom',
    id: '401',
    type: 'tv',
    body: {
        "title": "MyBookAyush",
        "Author": "ayushsood"
    }
},function(err,resp,status) {
    console.log(resp);
});
