const mongoose = require("mongoose");
const Joi = require("joi");

const checkoutSchema = new mongoose.Schema(
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

const checkout = mongoose.model('Checkout', checkoutSchema);
module.exports =  checkout ;