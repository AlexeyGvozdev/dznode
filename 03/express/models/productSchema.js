const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const ObjectID = mongoose.

const userSchema = new Schema({
    path: {
        type: String,
        unique: true
    },
    name: {
        type: String
    },
    price: Number,
    idUser: {
        type: Schema.Types.ObjectId
    }
});

const Product = mongoose.model('products', userSchema);
module.exports = Product;