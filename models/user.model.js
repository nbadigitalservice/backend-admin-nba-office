const mongoose = require('mongoose');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    name:{type:String,required:true},
    surname:{type:String,required:true},
    username:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    level:{type:String,required:true,enum:['admin','employee','manager','owner']},
    department:{type:String,required:true,enum:['Programmer','Marketing','Financial','Accounting','IT','Graphic']},
    email:{type:String},
    tel:{type:String},
},{timestamps:true});

const validateLogin = (data) => {
    const schema = Joi.object({
        username: Joi.string().required().label("invalid username"),
        password: Joi.string().required().label("invalid password"),
    })

    return schema.validate(data);
}

const validateUpdate = (data) => {
    const schema = Joi.object({
        name:Joi.string().required().allow("").label("invalid name"),
        surname:Joi.string().required().allow("").label("invalid surname"),
        password:Joi.string().required().allow("").label("invalid password"),
        email:Joi.string().email().required().allow("").label("invalid email"),
        tel:Joi.string().required().allow("").label("invalid telephone number"),
    })

    return schema.validate(data);
}

const validateUser= (data)=>{

    const schema = Joi.object({

        name:Joi.string().required().label("invalid name"),
        surname:Joi.string().required().label("invalid surname"),
        username:Joi.string().required().label("invalid usernamne"),
        password:Joi.string().required().label("invalid password"),
        level:Joi.string().required().label("invalid level"),
        department:Joi.string().required().label("invalid department"),
        email:Joi.string().email().required().allow("").label("invalid email"),
        tel:Joi.string().required().allow("").label("invalid telephone number"),

    });

    return schema.validate(data);
}

const User = mongoose.model('Users',userSchema);

module.exports = {User,validateUser,validateLogin,validateUpdate};
