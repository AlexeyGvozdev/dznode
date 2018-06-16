const db = require('../models/db')

let user = {
  email: "",
  password: ""
};

module.exports.indexGet = (req, res) => {
  console.log("index");
  
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
  console.log("GEt");
  
  if(req.session.autorization) {
    // console.log(req.session.autorization);
    
    // req.flash('autorized', req.session.user)
    // console.log( 'get',req.session.user);
    
    // req.flash('msglogin', 'Вы уже вошли');
    // res.render('pages/login', {
    //   title: 'Express',
    //   msglogin: req.flash('msglogin'),
    //   autorized: req.session.user
    // })

    res.redirect('/admin');
  } else {
    res.render('pages/login', {title: 'Express'});
  }
}

module.exports.loginPost = (req, res) => {
  
  console.log(req.body);
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
          console.log('ok password');
          res.redirect('/admin');
          req.session.autorization = true;
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
  console.log('Admin');
  
  res.render('pages/admin', {msgskill: 'Test send'});
}

module.exports.uploadPost = (req, res) => {
  console.log(req.body);
  res.redirect('/admin')
}

module.exports.skillsPost = (req, res) => {
  res.send("ghjghjghj");
  console.log(req.body);
  
}