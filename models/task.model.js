const mongoose = require("mongoose");
const Joi = require("joi");

const taskSchema = new mongoose.Schema(
  {
    from:{type:String,required:true},
    decription:{type:String,required:true},

  },{timestamps:true});

  const validateTask = (data) => {
    const schema = Joi.object({
      from: Joi.string().max(300).required().label("invalid sender"),
      decription: Joi.string().max(1000).required().label("invalid description"),
    });
  
    return schema.validate(data);
  };

const Task = mongoose.model("Task", taskSchema);

module.exports = { Task, validateTask };
