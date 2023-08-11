var express = require('express');
var router = express.Router();
var User = require('../controller/user.controller');
var {AuthorizeUser}= require('../middleware/auth');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login',User.Login);
router.post('/create',AuthorizeUser,User.Create);

module.exports = router;
