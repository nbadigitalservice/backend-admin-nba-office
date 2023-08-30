const mongoose = require("mongoose");
const Joi = require("joi");

const chatRoomSchema = new mongoose.Schema(
  {
    user_id:{ type:String, required:true },
    status:{ type:String, required:true},
    image:{ type:String, required:true},
  },
  {timestamps: true}
);

const ChatRoom = mongoose.model('chatroom', chatRoomSchema);

module.exports = { ChatRoom };