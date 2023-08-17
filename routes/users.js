var express = require('express');
var router = express.Router();
var User = require('../controller/user.controller');
var {AuthorizeUser}= require('../middleware/auth');

/* GET users listing. */
router.get('/',AuthorizeUser, User.GetUser);

router.post('/login',User.Login);
router.post('/create',AuthorizeUser,User.Create);
router.put('/update/:id',AuthorizeUser,User.Update);
router.delete('/:id',AuthorizeUser,User.Delete);

module.exports = router;
