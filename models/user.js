// include
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// user model
var userSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  adminLevel: { type: Number, default: 0 }
});

module.exports = mongoose.model('User', userSchema);
