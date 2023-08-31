const mongoose = require("mongoose");
const Joi = require("joi");

const chatRoomSchema = new mongoose.Schema(
  {
    roomId: { type: String, required: true },
    users: {
      type: [{
        userid: { type: String, required: true },
        username: { type: String, required: true },
        usersurname: { type: String, required: true },
        useremail: { type: String, required: true },
        usertel: { type: String, required: true }
      }]
    },
    roomName: { type: String, required: true },
    avatar: {
      type: [
        {
          url: { type: String, required: true },
          imageId: { type: String, required: true }
        }
      ]
    },
  },
  { timestamps: true }
);

const ChatRoom = mongoose.model('chatroom', chatRoomSchema);

module.exports = { ChatRoom };