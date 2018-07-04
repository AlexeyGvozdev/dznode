var express = require('express');
var router = express.Router();
// const session = require('express-session');
const controller = require('../controller/controller');
//const bodyJson = require('body-parser').json({type: 'text/plain'});


router.post('/saveNewUser', controller.saveUserPost);

router.post('/login', controller.loginPost);

router.post('/authFromToken', controller.authFromTokenPost);

router.put('/updateUser/:id', controller.updateUserPut);

router.delete('/deleteUser/:id', controller.deleteUserDelete);

router.post('/saveUserImage/:id', controller.saveUserImagePost);

router.get('/getNews', controller.getNewsGet);

router.post('/newNews', controller.newNewsPost);

router.put('/updateNews/:id', controller.updateNewsPut);

router.delete('/deleteNews/:id', controller.deleteNewsDelete);

router.put('/updateUserPermission/:id', controller.updateUserPremissionPut);

router.get('/getUsers', controller.getUserGet);

// router.get('/', controller.indexGet);

module.exports = router;