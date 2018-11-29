var Elasticsearch = require('aws-es');
elasticsearch = new Elasticsearch({
    accessKeyId: 'AKIAIV7YCAPRHY7VXS6A',
    secretAccessKey : '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',
    service : 'es',
    log: 'trace',
    region: 'us-west-2',
    host: 'search-tvsets-ufpidf2ylw7ln3ekxhqtwk3rju.us-east-2.es.amazonaws.com'
});

elasticsearch.index({
    index: 'blog',
    type: 'posts',
    id: '1',
    body: {
        title: 'manually set id',
        shares: 10
    }
}, function(err, data) {
    console.log('json reply received');
});

elasticsearch.index({
    index: 'blog',
    type: 'posts',
    body: {
        title: 'auto set id',
        shares: 5
    }
}, function(err, data) {
    console.log('json reply received');
});

elasticsearch.get({
    index: 'blog',
    type: 'posts',
    id: '1'
}, function(err, data) {
    console.log('json reply received');
});
