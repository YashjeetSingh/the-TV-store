var elasticsearch=require('elasticsearch');

var client = new elasticsearch.Client({
    accessKeyId: 'AKIAIV7YCAPRHY7VXS6A',
    secretAccessKey : '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',
    service : 'es',
    log: 'trace',
    region: 'us-east-2',
    host: 'search-tvsets-ufpidf2ylw7ln3ekxhqtwk3rju.us-east-2.es.amazonaws.com'
});
module.exports = client;
