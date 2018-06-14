let user = {
  email: "",
  password: ""
};

exports.indexGet = (req, res) => {
  res.render('pages/index', {
    title: 'Express',
    msgemail: req.flash('msgemail')
  });
};
exports.indexPost = (req, res) => {
  console.log(req.body);
  req.flash('msgemail', 'Send email!');
  res.redirect('/#form');
}

exports.loginGet = (req, res) => {
  if(req.session.autorization) {
    req.flash('autorized', req.session.user)
    console.log( 'get',req.session.user);
    
    req.flash('msglogin', 'Вы уже вошли');
    res.render('pages/login', {
      title: 'Express',
      msglogin: req.flash('msglogin'),
      autorized: req.session.user
    })
  } else {
    res.render('pages/login', {title: 'Express'});
  }
}

exports.loginPost = (req, res) => {
  console.log(req.body);
  if( req.body.email.length > 0 && req.body.password.length > 0) {
    if(req.session.user) {
      if(req.session.user.email === req.body.email)
      res.redirect('/login');
    }
    user.email = req.body.email;
    user.password = req.body.password;
    req.session.autorization = true;
    req.session.user = user;
    res.redirect('/login');
  } else {
    res.redirect('/login')
  }
}

exports.adminGet = (req, res) => {
  res.render('pages/admin', {msgskill: 'Test send'});
}