var elasticsearch = require('elasticsearch'),
    fs = require('fs'),
    pubs = JSON.parse(fs.readFileSync(__dirname + '/pubs.json')), // name of my first file to parse
    forms = JSON.parse(fs.readFileSync(__dirname + '/forms.json')); // and the second set
var client = new elasticsearch.Client({  // default is fine for me, change as you see fit
    accessKeyId: 'AKIAJNMBTNOGXKRZCUTQ',
    secretAccessKey : '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',
    service : 'es',
    log: 'trace',
    region: 'us-west-2',
    host: 'search-bookecommerce-hwglvcrguky6kzxyvfhfjw7rea.us-east-2.es.amazonaws.com'
});

for (var i = 0; i < pubs.length; i++ ) {
    client.create({
        index: "tvshowroom", // name your index
        type: "tv", // describe the data thats getting created
        id: i, // increment ID every iteration - I already sorted mine but not a requirement
        body: pubs[i] // *** THIS ASSUMES YOUR DATA FILE IS FORMATTED LIKE SO: [{prop: val, prop2: val2}, {prop:...}, {prop:...}] - I converted mine from a CSV so pubs[i] is the current object {prop:..., prop2:...}
    }, function(error, response) {
        if (error) {
            console.error(error);
            return;
        }
        else {
            console.log(response);  //  I don't recommend this but I like having my console flooded with stuff.  It looks cool.  Like I'm compiling a kernel really fast.
        }
    });
}

for (var a = 0; a < forms.length; a++ ) {  // Same stuff here, just slight changes in type and variables
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
