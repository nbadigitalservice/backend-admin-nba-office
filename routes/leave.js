var express = require('express');
var router = express.Router();
var Leave = require('../controller/leave.controller');
var {AuthorizeUser}= require('../middleware/auth');


/* GET checkout*/

// router.get('/getleave', AuthorizeUser,Leave.Getleave);
// router.post('/createcheckout',AuthorizeUser,Checkout.CreateCheckOut)

module.exports = router;