var express = require('express');
var router = express.Router();
var Checkout = require('../controller/checkout.controller');
var {AuthorizeUser}= require('../middleware/auth');


/* GET checkout*/

router.get('/getcheckout', AuthorizeUser,Checkout.Getchekout);

module.exports = router;