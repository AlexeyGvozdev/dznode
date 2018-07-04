const db = require('../module/db');
const uuid = require('uuid/v4');
const formidable = require('formidable');
const mongoose = require('mongoose');
const User = mongoose.model('users');
const News = mongoose.model('news');
const ObjectId = mongoose.Types.ObjectId;
const fs = require('fs');
const path = require('path');


module.exports.saveUserPost = (req, res) => {
  console.log('save');  
  db.saveUser(req.body)
    .then( (user) => {
      req.session.id = user.id;
      res.send(user);
    })
    .catch((err) => {
      console.log(err);
      res.send({user: 22222})
    });
}

module.exports.loginPost = async(req, res) => {
  console.log('req.session');
  db.findUser({username: req.body.username})
    .then((user) => {
      req.session.user = user.username;
      console.log(req.session.user);
      
      res.send(user);
    })
    .catch((err) => {
      console.log(err);
    })
}

module.exports.authFromTokenPost = (req, res) => {
  console.log(req);
  
  console.log('authFromTokenPost');
  
}

module.exports.updateUserPut = (req, res) => {
  db.updateUser(req.params.id, req.body)
    .then( (user) => {
      res.send(user);
    }).catch((err) => {
      console.log(err);
  });
}



module.exports.deleteUserDelete = (req, res) => {
  // сначала проверка, чтобы самого себя не удалить  
  db.getUser({id: req.params.id})
    .then((user) => {
      if(user.id === req.params.id) {
        res.send({});
      } else {

        db.deleteUser(req.params.id)
          .then(() => {
            db.getUsers()
              .then((users) => {
                res.send(users)
              })
              .catch((err) => {
                console.log(err);
              })
          })
          .catch((err) => {
            console.log(err);
          })
      }
    })
  console.log('updateUserPost');
}


module.exports.saveUserImagePost = (req, res) => {
  // console.log(req);
  try {
    let form = new formidable.IncomingForm();
    
    let upload = path.join('public', 'upload');
    // console.log("1111",upload);
    let fileName;

    if(!fs.existsSync(upload)) {
      fs.mkdirSync(upload);
    }

    form.uploadDir = path.join(process.cwd(), upload);
    // console.log(form.uploadDir);
    
    form.parse(req, (err, fields, files) => {
      if (err) {
        console.log(err);
        return next(err);
      }
      let id = req.params.id;
      // console.log(files[Object.keys(files)].path)
      let name = uuid() + '.png';
      let newFileName = path.join(upload, name);
      fs.rename(files[Object.keys(files)].path, newFileName, (err) => {
        if (err) {
          fs.unlink(fileName);
        } else {
          console.log(name);
          
          db.updateUser(req.params.id, {image: name})
            .then((user) => {
              console.log(user);
              res.send({path: path.join('upload', user.image)});
            })
            .catch((err) => {
              console.log(err);
            })

        }
      })
    }) 
  } catch (err) {
    console.log(err);
    
  }
  console.log('updateUserPost');
}

module.exports.getNewsGet = (req, res) => {
  console.log('getNewsGet');
  responseNews(res);
  
}

module.exports.newNewsPost = (req, res) => {
  console.log(req.body);
  db.saveNews(req.body)
    .then((news) => {
      responseNews(res);
    })
    .catch((err) => {
      console.log(err);
    });
  // res.send('index.html')
}

module.exports.updateNewsPut = (req, res) => {
  console.log('updateUserPost');
  console.log(req.params.id, res.body);
  
  db.updateNews(req.params.id, req.body)
    .then(() => {
      responseNews(res);
    })
    .catch((err) => {
      console.log(err);
    })
}

module.exports.deleteNewsDelete = (req, res) => {
  console.log(req.params.id);
  db.deleteNews(req.params.id)
    .then(() => {
      responseNews(res);
    })
    .catch((err) => {
      console.log(err);
    })
  console.log('updateUserPost');
}

module.exports.updateUserPremissionPut = (req, res) => {
  let groups = ['chat', 'news', 'setting'];
  let boolPers = ['U', 'C', 'R', 'D'];
  console.log("body", req.body.permission);
  
  db.getUser({permissionId: req.params.id})
    .then((user) => {
      console.log("old", user.permission);
      groups.forEach((group) => {
        boolPers.forEach((boolPer) => {
          // console.log(req.body.permission[group]);
          if(req.body.permission[group] !== void 0) {
            if(req.body.permission[group][boolPer] !== void 0)
              user.permission[group][boolPer] = req.body.permission[group][boolPer]
          }
        })
      })
      // for(let per in req.body.permission) {
      //   if(per === "chat") {
      //     for(let el in req.body.permission.chat) {
      //       console.log(per, el);
      //       if(el === "U") user.permission['chat'].U = req.body.permission.chat.U
      //     }
      //   } else if(per === "chat") {
          
      //   } else if(per === "chat") {
          
      //   }
        
      // }
      console.log("new", user.permission);
      db.deleteUser(user.id)
        .then(() => {
          console.log("del");
          db.saveUser(user, true)
            .then((user) => {
              console.log('save');
              res.send(user);
            }).catch((err) =>{
              console.log(err);
              
            })

        })
        .catch((err) => {
          console.log(err);
        })
      // db.updateUser(user.id, user)
      //   .then((newUser) => {
      //     console.log('end', newUser);
          
      //   }).catch((err) => {console.log(err);})
    })
  console.log('updateUserPost');
}

module.exports.getUserGet = (req, res) => {
  db.getUsers()
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      console.log(err);
    })
}

function responseNews(res){
  db.getNews()
    .then((news) => {
      let arrUserId = new Array();
      let arrAnswerNews = new Array();
      news.forEach((element) => {
        if(arrUserId.lastIndexOf(element.userId) === -1) {
          arrUserId.push(element.userId);
        }
        // console.log(element.userId);
      })
      // console.log(arrUserId);
      
      db.getUsersIn(arrUserId)
        .then((users) => {
        // console.log(users);
        
        let answerNews = {};
        news.forEach((element) => {
          users.forEach((user) => {
            // console.log(user.id === element.userId, user.id, element.userId);
            
            if(new ObjectId(user.id).equals(element.userId)) {
              answerNews = {
                id:     element.id,
                date:   element.date,
                text:   element.text,
                theme:  element.theme,
                userId: element.id,
                user: user
              }
              // console.log('qweq');
              
              arrAnswerNews.push(answerNews);
            }
          })
        })
        // let answerNews = {
        //   id: news.id,
        //   date: news.date,
        //   text: news.text,
        //   theme: news.theme,
        //   user: user
        // }
        // news.user = user;
        console.log(arrAnswerNews);
        
        // res.send([answerNews]);
        res.send(arrAnswerNews);
      });
    })
    .catch((err) => {
      console.log(err);
    })
}