const mongoose = require("mongoose");
const Joi = require("joi");
const { v4: uuidv4 } = require('uuid');


const chatRoomSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true, default: uuidv4() },
    users: {
      type: [{
        user_id: { type: String, required: true },
        user_name: { type: String, required: true },
        user_surname: { type: String, required: true },
        user_email: { type: String, required: true },
        user_tel: { type: String, required: true }
      }]
    },
    name: { type: String, required: true },
    image: {
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