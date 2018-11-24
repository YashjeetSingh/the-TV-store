var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  _id: { type: Number,required: true},
  Title:{type: String,required: true},
  Brand:{type: String,required: true},
  seller:{type: String,required: true},
  Size:{ type: String,required: true},
  Style:{type: String,required: true},
  Weight:{type:String,required: true},
  Dimension:{type:String,required: true},
  Modelnumber:{type: String,required: true},
  ASIN:{type:String,required: true},
  Price: {type:String,required: true},
  SoldBy: {type:String,required: true},
  ImageURL: {type:String,required: true}
});

module.exports = mongoose.model('Product', schema);
