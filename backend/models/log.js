const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  date: {type: String, required: true},
  firstUserName: {type: String, required: false},
  secondUserName: {type: String, required: false},
  duration: {type: String, required: false},
  price: {type: String, required: false},
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Log', userSchema);
