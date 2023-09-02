const mongoose = require("mongoose");
const Joi = require("joi");

const taskSchema = new mongoose.Schema(
  {
    from: { type:String,required:true },
    to: { type:String,required:true },
    decription: { type:String,required:true },
    status: { type: String, required: true, enum: ['ยังไม่ได้อ่าน', 'อ่านแล้ว'], default: 'ยังไม่ได้อ่าน' }
  },{timestamps:true});

  const validateTask = (data) => {
    const schema = Joi.object({
      from: Joi.string().max(300).required().label("invalid sender"),
      to: Joi.string().max(300).required().label("invalid receiver"),
      decription: Joi.string().max(1000).required().label("invalid description"),
      status: Joi.string().required().label("invalid status").default("ยังไม่ได้อ่าน"),
    });
  
    return schema.validate(data);
  };

const Task = mongoose.model("Task", taskSchema);

module.exports = { Task, validateTask };
