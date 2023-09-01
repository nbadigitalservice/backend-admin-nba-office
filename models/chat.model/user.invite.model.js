const mongoose = require("mongoose");
const Joi = require("joi");

const userinviteSchema = new mongoose.Schema(
  {
    roomId: {type: String, required: true},
    name: {type: String, required: true},
    surname: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    email: {type: String},
    tel: {type: String},
    status: { type: String, enum: ['pending', 'accept', 'cancel'], default: 'pending' }
  },
  {timestamps: true}
);

const UserInvite = mongoose.model("UsersInvite", userinviteSchema);

module.exports = { UserInvite };