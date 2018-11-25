var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    ImageURL: {type: String, required: true},
    Title: {type: String, required: true},
    Brand: {type: String, required: true},
    Price: {type: Number, required: true},
    seller:{type: String,required: true}
});

module.exports = mongoose.model('ProductsSearch', schema);
