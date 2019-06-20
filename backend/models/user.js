const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
var Float = require('mongoose-float').loadType(mongoose);

const userSchema = mongoose.Schema({
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  type: {type: Boolean, required: false},
  online: {type: Boolean, required: false},
  username: {type: String, required: true, unique: true},
  name: {type: String, required: false},
  description: {type: String, required: false},
  rating: {type: Float, required: false},
  reviews: {type: Number, required: false},
  id: {type: Number, required: false,  unique: true},
  price: {type: Number, required: false},
  joinDate: {type: Date, required: false},
  categories: {type: {}, required: false},
  imagePath: {type: String, required: false}
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
