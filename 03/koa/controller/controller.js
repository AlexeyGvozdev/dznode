const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync')
const fs = require('fs');

const adapter = new FileSync('./models/db.json')
const db = low(adapter)

module.exports.indexGet = async(ctx) => {
  ctx.render('pages/index', {
    msgemail: ctx.flash('msgemail')
  });
  console.log(ctx.session);
  
}

module.exports.indexPost = async(ctx) => {
  console.log(ctx.request.body);
  ctx.flash('msgemail', 'Send message');
  ctx.redirect('/#form');
}

module.exports.loginGet = async(ctx) => {
  if(!ctx.session.autorization) {
    ctx.render('pages/login');
  } else {
    ctx.redirect('/admin');
  }
}

module.exports.loginPost = async(ctx) => {

  user = db.get('users').find({email: ctx.request.body.email}).value();
  
  if(user && user.password === ctx.request.body.password) {
    console.log('ok');
    ctx.session.autorization = true;
    ctx.session.email = user.email;
    ctx.redirect('/admin')
  }
}


module.exports.adminGet = async(ctx) => {
  if(ctx.session.autorization) {
    ctx.render('pages/admin', {
      msgfile: ctx.flash('msgfile'),
      msgskill: ctx.flash('msgskill')
    })
  } else {
    ctx.redirect('/login')
  }
}

module.exports.uploadPost = async(ctx) => {

  // Если файл не загружен
  if(!ctx.request.files.photo.name) {
    // удаляем tmp файл
    fs.unlinkSync(ctx.request.files.photo.path)
    ctx.flash('msgfile', 'File did not download');

  // Если цена и имя не указанны
  } else if (!ctx.request.body.price && !ctx.request.body.name) {
    ctx.flash('msgfile', 'Data is not valid')
  } else {
    // Если всё валидно, то преименновываем файл
    let oldPath = ctx.request.files.photo.path;
    let newPath = oldPath.substr(0, oldPath.lastIndexOf('/') + 1) + ctx.request.files.photo.name;

    try {
      fs.renameSync(oldPath, newPath)
    } catch(err) {
      console.log(err);
    }

    // Записываем данные в базу
    let data = {
      fileName: ctx.request.files.photo.name,
      userEmail: ctx.session.email,
      name: ctx.request.body.name,
      price: ctx.request.body.price
    }

    
    db.get('upload')
    .push(data)
    .write();

    ctx.flash('msgfile', 'Goods added');
  }
  ctx.redirect('/admin');
}

module.exports.skillsPost = async(ctx) => {

  // Проверяем валидность данных
  if(ctx.request.body.age && ctx.request.body.concerts && ctx.request.body.cities && ctx.request.body.years) {
    let skills = {
      age: ctx.request.body.age,
      concerts: ctx.request.body.concerts,
      countCity: ctx.request.body.cities,
      yearsOnScene: ctx.request.body.years
    }
    // Записываем в базу
    
    db.get('users')
    .find({email: ctx.request.body.email})
    .set('skills', skills)
    .write();
    ctx.flash('msgskill', 'Skills added');
  } else {
    ctx.flash('msgskill', 'Skills is not valid');
  }
  ctx.redirect('/admin');
}