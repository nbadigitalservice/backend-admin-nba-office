const mongoose = require("mongoose");
const Joi = require("joi");

const timesheetSchema = new mongoose.Schema(
    {
        name:{ type:String},
        workDate:{type:String},
        checkin:{type:String},
        checkout:{type:String},
        total:{type:String},
        ot:{type:String},
        userId:{type:String }
    },
    {timestamp: true}
);

const timesheet = mongoose.model('Timesheet', timesheetSchema);
module.exports =  timesheet ;