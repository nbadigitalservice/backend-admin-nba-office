var express = require('express');
var router = express.Router();
var User = require('../controller/user.controller');
var {AuthorizeUser}= require('../middleware/auth');

/* GET users listing. */
router.get('/list',AuthorizeUser, User.GetUser);
router.get('/me',AuthorizeUser, User.Me);
router.post('/login',User.Login);
router.post('/create',AuthorizeUser, User.Create);
router.put('/update',User.Update);
router.delete('/delete/:id',AuthorizeUser,User.Delete);
router.put('/avatar',AuthorizeUser,User.UpdateAvatar);

module.exports = router;
