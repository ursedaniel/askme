const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  dateStart: {type: Date, required: true},
  dateEnd: {type: Date, required: true},
  username1: {type: String, required: false},
  username2: {type: String, required: false},
  duration: {type: String, required: false},
  price: {type: String, required: false},
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Log', userSchema);
