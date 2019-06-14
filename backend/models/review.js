const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  date: {type: Date, required: true},
  username1: {type: String, required: false},
  username2: {type: String, required: false},
  rating: {type: Number, required: false},
  review: {type: String, required: false},
  logId: {type: Number, required: false},
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Review', userSchema);
