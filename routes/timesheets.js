var express = require('express');
var router = express.Router();
var Timesheet = require('../controller/timesheet.controller');
var {AuthorizeUser}= require('../middleware/auth');

/* GET users listing. */
// router.get('/list',AuthorizeUser, User.GetUser);
// router.get('/me',AuthorizeUser, User.Me);
// router.post('/login',User.Login);
// router.post('/create',AuthorizeUser, User.Create);
// router.put('/update',User.Update);
// router.delete('/delete/:id',AuthorizeUser,User.Delete);
// router.put('/avatar',AuthorizeUser,User.UpdateAvatar);

// module.exports = router;


/* GET timesheet*/

router.get('/gettimesheet',AuthorizeUser,Timesheet.GetTimesheet);

module.exports = router;