const express = require('express');
const router = express.Router();
const { AuthorizeUser } = require('../../middleware/auth');
const ChatRoom = require('../../controller/chat.controller/user.room.controller') 

router.post('/createroom', AuthorizeUser, ChatRoom.createRoom)

module.exports = router;