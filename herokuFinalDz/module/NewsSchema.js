const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newsSchema = new Schema({
  id: {
    type: Schema.Types.ObjectId
  },
  userId: {
    type: Schema.Types.ObjectId
  },
  date: {
    type: String
  },
  text: {
    type: String
  },
  theme: {
    type: String
  }
});

const News = mongoose.model('news', newsSchema);
module.exports = News;