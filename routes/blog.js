var express = require('express');
var router = express.Router();
var {AuthorizeUser} = require('../middleware/auth');
var Blog = require("./../controller/blog.controller");
var BlogMessage = require("./../controller/blog.message.controller");

//public
router.get('/all',Blog.GetAllBlog);

//member blog
router.get('/',AuthorizeUser,Blog.GetUserBlog);
router.get('/:id',AuthorizeUser,Blog.GetUserBlogById);
router.post('/create',AuthorizeUser,Blog.Create);
router.delete('/delete/:id',AuthorizeUser,Blog.DeleteBlog);

//message
router.post('/message/:id',AuthorizeUser,BlogMessage.CreateBlogMessage);

//image
router.delete('/image/:id',AuthorizeUser,Blog.DeleteBlogImage);




module.exports = router;