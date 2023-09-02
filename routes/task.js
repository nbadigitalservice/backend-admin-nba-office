const express = require('express');
const router = express.Router();
const { AuthorizeUser } = require('../middleware/auth');
const task = require('../controller/task.controller')

router.get('/list', AuthorizeUser, task.GetTaskByUserId)

module.exports = router