const db = require('../models/db');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

module.exports.indexGet = (req, res) => {
  // console.log("index");
  res.render('pages/index', {
    title: 'Express',
    msgemail: req.flash('msgemail')
  });
};
module.exports.indexPost = (req, res) => {
  console.log(req.body);
  req.flash('msgemail', req.body.message);
  res.redirect('/#form');
}

module.exports.loginGet = (req, res) => {
  // console.log("GEt");
  
  if(req.session.autorization) {
    res.redirect('/admin');
  } else {
    res.render('pages/login', {title: 'Express'});
  }
}

module.exports.loginPost = (req, res) => {
  
  // console.log(req.body);
  if( req.body.email.length > 0 && req.body.password.length > 0) {
    
    db
      .getUser(req.body.email)
      .then((user) => {
        console.log(user);
        if (!user) {
          req.flash('msglogin', 'Не правльный логин или пароль');
          res.render('pages/login', {
            msglogin: req.flash('msglogin')
          })
        } else if(user.password === req.body.password) {
          req.session.email = user.email; 
          req.session.autorization = true;
          console.log('ok password');
          res.redirect('/admin');
        } else {
          req.flash('msglogin', 'Не правльный логин или пароль');
          res.render('pages/login', {
            msglogin: req.flash('msglogin')
          })
        }
      })
      .catch( (err) => {
        console.log(err);
      
        res.redirect('/login');
      })
  } else {
    res.redirect('/login')
  }
}

module.exports.adminGet = (req, res) => {
  // console.log('Admin');
  if(req.session.autorization) {
    res.render('pages/admin', {msgskill: 'Test send'});
  } else {
    res.redirect('/');
  }
}

module.exports.uploadPost = (req, res, next) => {
  if(!req.session.autorization) {
    res.render('pages/login');
  } else {
    // console.log(req.body);
    const email = req.session.email;
    let form = new formidable.IncomingForm();
    let upload = path.join('./public', 'upload');
    let fileName;

    if(!fs.existsSync(upload)) {
      fs.mkdirSync(upload);
    }

    form.uploadDir = path.join(process.cwd(), upload);

    form.parse(req, (err, fields, files) => {
      // console.log(fields, files.photo.path);
      
      if (err) {
        console.log(err);
        
        return next(err);
      }
      
      if(files.photo.name === '' || files.photo.size === 0) {
        fs.unlink(files.photo.path, (err) => {
          if(err) {
            next(err);
          }
        });
        req.flash('msgfile', 'Error')
        return res.render('pages/admin', {
          msgfile: req.flash('msgfile')
        });
      }
      if(!fields.name) {
        fs.unlink(files.photo.path, (err) => {
          if(err) {
            next(err);
          }
        });
        req.flash('msgfile', 'Error')
        return res.render('pages/admin', {
          msgfile: req.flash('msgfile')
        });
      }
      
      fileName = path.join(upload, files.photo.name);
      fs.rename(files.photo.path, fileName, (err) => {
        if(err){
          console.log(err);
          fs.unlink(fileName);
          fs.rename(files.photo.path, fileName)
        }
        db.getUser(email)
          .then((user) => {
            const id = user._id;
            // console.log(id);
            // console.log(files.photo);
            let data = {
              path: files.photo.path,
              name: files.photo.name,
              price: fields.price,
              idUser: id
            }
            db.insertUpload(data)
              .then((result) => {
                if(result)
                  console.log('added upload');
                else
                  console.log('not added upload');
              })
              .catch((err) => {
                console.log(err);
                next(err);
              })
          })
        let dir = fileName.substr(fileName.indexOf(path.join('\\')));
        req.flash('msgfile', 'Download')
        res.render('pages/admin', {
          msgfile: req.flash('msgfile')
        });
        
      });
      // res.redirect('/admin')
    })
  }
}

module.exports.skillsPost = (req, res, next) => {
  // console.log(req.body);
  if(!req.session.autorization) {
    res.render('pages/login');
  } else {
    const skills = {
      age: req.body.age,
      concerts: req.body.concerts,
      cities: req.body.cities,
      years: req.body.years
    }
    const email = req.session.email
    db.setSkills(email, skills)
      .then((result) => {
        if(result) {
          // console.log('seted');
          req.flash('msgskill', 'Добавлены данные о скилах')
          res.render('pages/admin', {
            msgskill: req.flash('msgskill')
          })
        } else {
          req.flash('msgskill', 'Данные о скилах не валидны')
          res.render('pages/admin', {
            msgskill: req.flash('msgskill')
          })
        }
      })
      .catch((err) => {
        next(err)
      })
  }

  
  
}