var elasticsearch = require('elasticsearch'),
    fs = require('fs'),
    pubs = JSON.parse(fs.readFileSync(__dirname + '/pubs.json')), // name of my first file to parse
    forms = JSON.parse(fs.readFileSync(__dirname + '/forms.json')); // and the second set
var client = new elasticsearch.Client({  // default is fine for me, change as you see fit
  accessKeyId: 'AKIAIV7YCAPRHY7VXS6A',
  secretAccessKey : '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',
  service : 'es',
  log: 'trace',
  region: 'us-east-2',
  host: 'search-tvsets-ufpidf2ylw7ln3ekxhqtwk3rju.us-east-2.es.amazonaws.com'
});

for (var i = 0; i < pubs.length; i++ ) {
    client.create({
        index: "tvshowroom", // Index name created via Kibana in AWS.
        type: "tv", // Using Kibana service by AWS, describing the type of dta created.
        id: i, // Incrementing the ID every iteration bi 'i'.
        body: pubs[i]
    }, function(error, response) {
        if (error) {
            console.error(error);
            return;
        }
        else {
            console.log(response);
        }
    });
}

for (var a = 0; a < forms.length; a++ ) {
    client.create({
        index: "epubs",
        type: "form",
        id: a,
        body: forms[a]
    }, function(error, response) {
        if (error) {
            console.error(error);
            return;
        }
        else {
            console.log(response);
        }
    });
}
