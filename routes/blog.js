var express = require('express');
var router = express.Router();
var {AuthorizeUser} = require('../middleware/auth');
var Blog = require("./../controller/blog.controller");
var BlogMessage = require("./../controller/blog.message.controller");

router.get('/',AuthorizeUser,Blog.GetUserBlog);
router.post('/create',AuthorizeUser,Blog.Create);

//message
router.post('/message/:id',AuthorizeUser,BlogMessage.CreateBlogMessage);


module.exports = router;