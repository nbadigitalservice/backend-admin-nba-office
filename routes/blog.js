var express = require('express');
var router = express.Router();
var {AuthorizeUser} = require('../middleware/auth');
var Blog = require("./../controller/blog.controller");

router.get('/',AuthorizeUser,Blog.GetUserBlog);
router.post('/create',AuthorizeUser,Blog.Create);


module.exports = router;