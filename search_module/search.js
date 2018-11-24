var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
    accessKeyId: 'AKIAJNMBTNOGXKRZCUTQ',
    secretAccessKey : '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',
    service : 'es',
    log: 'trace',
    region: 'us-west-2',
    host: 'search-bookecommerce-hwglvcrguky6kzxyvfhfjw7rea.us-east-2.es.amazonaws.com'
});

client.ping({
    // ping usually has a 3000ms timeout
    requestTimeout: 1000
}, function (error) {
    if (error) {
        console.trace('elasticsearch cluster is down!');
    } else {
        console.log('All is well');
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
