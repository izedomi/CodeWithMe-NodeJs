const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const User = new Schema({
  name: {
      type: String,
      required: true
  },
  email: {
      type: String,
      required: true,
      minlength: 3,
  },
  password: {
      type: String,
      required: true,
  }
});

exports.UserModel = mongoose.model('User', User);


//module.exports.User = 