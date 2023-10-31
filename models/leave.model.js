const mongoose = require("mongoose");
const Joi = require("joi");

const leaveSchema = new mongoose.Schema(
    

);

const leave = mongoose.model('Leave', leaveSchema);
module.exports =  leave ;