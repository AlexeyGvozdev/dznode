const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  id: {
    type: String
  },
  username: {
    type: String
  },
  password: {
    type: String
  },
  firstName: {
    type: String
  },
  surName: {
    type: String
  },
  middleName: {
    type: String
  },
  permissionId: {
    type: String
  },
  image: {
    type: String
  },
  permission: {
    type: JSON
  },
  access_token: {
    type: String
  }


});

const User = mongoose.model('users', userSchema);
module.exports = User;