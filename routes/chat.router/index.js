const express = require('express');
const router = express.Router();
const { AuthorizeUser } = require('../../middleware/auth');
const ChatRoom = require('../../controller/chat.controller/user.room.controller') 

router.post('/createroom', AuthorizeUser, ChatRoom.createRoom)
router.get('/room', AuthorizeUser, ChatRoom.GetRoomByUserID)
router.post('/inviteuser/:roomId', AuthorizeUser, ChatRoom.InviteUser)
router.post('/accept/:id', AuthorizeUser, ChatRoom.Accept)

module.exports = router;