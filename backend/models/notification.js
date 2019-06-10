const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  date: {type: Date, required: true},
  username: {type: String, required: true},
  message: {type: String, required: true},
  checked: {type: Boolean, required: false},
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Notification', userSchema);
