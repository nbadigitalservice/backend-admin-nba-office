const mongoose = require("mongoose");
const Joi = require("joi");

const blogSchema = new mongoose.Schema(
  {
    user_id:{type:String, required:true},
    title: {type: String, required: true},
    description: {type: String},
    imgUrl: {
      type: [
        {
          url: {type: String, required: true},
          imageId:{type: String, required: true}
        },
      ],
    },
  },
  {timestamps: true}
);

const Blog = mongoose.model('Blog',blogSchema);

module.exports = {Blog};