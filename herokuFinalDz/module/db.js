const mongoose = require('mongoose');
const User = require('./UserSchema');
const News = require('./NewsSchema');
const uuid = require('uuid/v4');
const ObjectId = mongoose.Types.ObjectId;

module.exports.saveUser = (data, resave) => {
  console.log('sadfsadfas');
  let per = data.permission
  // per.news.C = true;
  // per.news.U = true;
  // per.news.R = true;
  // per.news.D = true;
  // per.chat.C = true;
  // per.chat.U = true;
  // per.chat.R = true;
  // per.chat.D = true;
  // per.setting.C = true;
  // per.setting.U = true;
  // per.setting.R = true;
  // per.setting.D = true;
  console.log(per);
  
  const user = new User({
    id: !resave ? ObjectId() : data.id,
    access_token: !resave ? uuid() : data.access_token,
    username: data.username,
    password: data.password,
    firstName: data.firstName,
    surName: data.surName,
    middleName: data.middleName,
    permissionId: !resave ? ObjectId() : data.permissionId,
    image: !resave ? '' : data.image,
    permission: data.permission
  });
  
  return user.save();
}

module.exports.updateUser = (id, data) => {
  // console.log(id, data);
  delete data.id
  // let set = {$set: data}
  // console.log(set);
  return User.findOneAndUpdate({id: id}, {$set: data}, {new: true});
}

module.exports.findUser = (params) => {
  return User.findOne(params)
}


module.exports.deleteUser = (id) => {
  return User.remove(User.remove({id: ObjectId(id)}))
}

module.exports.getUsers = () => {
  return User.find({})
}

module.exports.getUser = (params) => {
  return User.findOne(params)
}


module.exports.saveNews = (data) => {
  let news = new News({
    id: ObjectId(),
    userId: data.userId,
    date: data.date,
    text: data.text,
    theme: data.theme
  });
  return news.save();
}

module.exports.getNews = () => {
  return News.find({});
}

module.exports.getUsersIn = (params) => {
  return User.find({id: {$in: params}});
}

module.exports.deleteNews = (id) => {
  return News.findOneAndRemove({id: id});
}

module.exports.updateNews = (id, data) => {
  return News.findOneAndUpdate({id: id}, {$set: {theme: data.theme, text: data.text}});
}