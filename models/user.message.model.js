const mongoose = require("mongoose");
const Joi = require("joi");

const userMessageSchema = new mongoose.Schema(
  {
    from:{type:String,required:true},
    to:{type:String,required:true},
    message:{type:String,required:true}
  },
  {timestamps: true}
);

const validateMessage = (data) => {
    const schema = Joi.object({
        to:Joi.string().max(200).required(),
        message:Joi.string().max(2000).required()
    });
  
    return schema.validate(data);
  };
  

const UserMessage = mongoose.model('UserMessage',userMessageSchema);

module.exports = {UserMessage,validateMessage};