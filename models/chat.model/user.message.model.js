const mongoose = require("mongoose");
const Joi = require("joi");

const userMessageSchema = new mongoose.Schema(
  {
    user_id:{ type:String, required:true },
    from:{ type:String, required:true},
    to:{ type:String, required:true},
    message:{ type:String, required:true }
  },
  {timestamps: true}
);

const UserMessage = mongoose.model('usermessage', userMessageSchema);

module.exports = { UserMessage };