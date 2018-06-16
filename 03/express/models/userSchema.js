const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    age: {
        type: Number
    },
    concerts: {
        type: Number
    },
    countCity: {
        type: Number
    },
    yearsOnScene: {
        type: Number
    }
});

const User = mongoose.model('users', userSchema);
module.exports = User;