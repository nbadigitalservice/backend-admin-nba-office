const mongoose = require("mongoose");
const Joi = require("joi");

const leaveSchema = new mongoose.Schema(
    {
    name:{type:String},
    leaveType:{type:String},
    detail:{type:String},
    startDate:{type:date},
    endDate:{type:date}
    }
);

const leave = mongoose.model('Leave', leaveSchema);
module.exports =  leave ;