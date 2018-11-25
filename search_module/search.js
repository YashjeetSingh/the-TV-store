var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  accessKeyId: 'AKIAIV7YCAPRHY7VXS6A',
  secretAccessKey : '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',
  service : 'es',
  log: 'trace',
  region: 'us-east-2',
  host: 'search-tvsets-ufpidf2ylw7ln3ekxhqtwk3rju.us-east-2.es.amazonaws.com'
});

client.ping({
    // The ping will timeout at 1000ms timeout
    requestTimeout: 1000
}, function (error) {
    if (error) {
        console.trace('The AWS elasticsearch service is not available!');
    } else {
        console.log('Amazon Elasticsearch Service successfully connected!');
    }
});

module.exports.search = function(searchData, callback) {
    client.search({
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
