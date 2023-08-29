const mongoose = require("mongoose");
const Joi = require("joi");

const blogMessageSchema = new mongoose.Schema(
  {
    member_name:{type:String, required:true},
    blog_id: {type: String, required: true},
    message:{type:String, required:true}
  },
  {timestamps: true}
);

const BlogMessage = mongoose.model('BlogMessage',blogMessageSchema);

module.exports = {BlogMessage};