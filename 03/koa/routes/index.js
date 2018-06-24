const Router = require('koa-router');
const router = new Router();
const path = require('path');
const koaBody = require('koa-body');
const controller = require('../controller/controller');

router.get('/', controller.indexGet);

router.post('/', koaBody(), controller.indexPost);

router.get('/login', controller.loginGet);

router.post('/login', koaBody(), controller.loginPost);

router.get('/admin', controller.adminGet);

router.post('/admin/upload', koaBody(
  {
    formidable: {
        uploadDir: path.join(process.cwd(), 'public/upload') // Директория, куда следует сохранить файл
    },
    multipart: true }
  ), 
    controller.uploadPost);

router.post('/admin/skills', koaBody(), controller.skillsPost);


router.get('*', async(ctx, next) => {
  ctx.render('error', {
    status: ctx.response.status,
    error: ctx.response.message
  });
});

module.exports = router;