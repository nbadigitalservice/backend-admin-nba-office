var express = require('express');
var router = express.Router();
var Checkin = require('../controller/checkin.controller');
var {AuthorizeUser}= require('../middleware/auth');


/* GET timesheet*/

router.get('/getcheckin',AuthorizeUser,Checkin.Getcheckin);

module.exports = router;