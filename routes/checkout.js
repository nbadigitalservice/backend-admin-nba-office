var express = require('express');
var router = express.Router();
var Checkout = require('../controller/checkout.controller');
var {AuthorizeUser}= require('../middleware/auth');


/* GET checkout*/

router.get('/getdata', AuthorizeUser,Checkout.Getcheckout);
router.post('/createcheckout',AuthorizeUser,Checkout.CreateCheckOut)

module.exports = router;