const mongoose = require("mongoose");
const Joi = require("joi");

const checkinSchema = new mongoose.Schema(
    {
        name:{
            type:String
           
        },
        status:{
            type:String
        },
        timeChackin:{
            type:Date
        },
        createdAt:{
            type:Date
        },
        updatedAt:{
            type:Date
        }
    },
    {timestamp: true}
);

const checkin = mongoose.model('Checkin', checkinSchema);
module.exports =  checkin ;