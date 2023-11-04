var express = require('express');
var router = express.Router();
var Timesheet = require('../controller/timesheet.controller');
var {AuthorizeUser}= require('../middleware/auth');


/* GET timesheet*/

router.get('/getsheet', AuthorizeUser,Timesheet.GetTimesheet);
router.post('/checkinTimesheet', AuthorizeUser,Timesheet.CreateCheckin);
router.put('/checkoutTimesheet', AuthorizeUser,Timesheet.CreateCheckout);
router.get('/filltertimesheet', AuthorizeUser,Timesheet.FilterTimsheet);


module.exports = router;