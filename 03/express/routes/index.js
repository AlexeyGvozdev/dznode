var express = require('express');
var router = express.Router();
const session = require('express-session');
const controller = require('../controller/controller')

// const flash = require('connect-flash');
 

/* GET home page. */
router.get('/', controller.indexGet);

router.post('/', controller.indexPost);


router.get('/login', controller.loginGet);

router.post('/login', controller.loginPost);

router.get('/admin', controller.adminGet);

router.post('/admin/upload', controller.uploadPost);

router.post('/admin/skills', controller.skillsPost);

module.exports = router;
